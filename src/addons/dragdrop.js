"use strict"

import React, { Component } from 'react'

export class DragZone extends Component {
  constructor(props) {
    super(props)
    this.dragItems = {}
    this.activeDragItem = null
    this.dropHolders = {}
    this.mouse = null
    const methods = [
      'handleMouseDown',
      'handleMouseMove',
      'handleDragStart',
      'handleDragEnd'
    ]
    methods.forEach(method => this[method] = this[method].bind(this))
    this.myRef = React.createRef()
  }
  componentDidMount() {
    this.children = this._genChildren()
    this.setState({ })
  }
  render() {
    const style = {
      width: this.props.width || '500px',
      height: this.props.height || '500px',
      position: 'relative'
    }
    return (
      <div  className={this.props.className} style={ style }
            onMouseDown = {this.handleMouseDown}
            onMouseMove = {this.handleMouseMove}
            ref={this.myRef}
      >
        {this.children || this.props.children}
      </div>
    )
  }
  _genChildren() {
    const answers = this._getStoredAnswers()
    // I should move this function to a lib as many addons will need it
    const cloneElementRecursively = (el) => {
      if (!el.type) {
        return el
      }
      if (el.type && el.type.name && el.type.name === 'DropHolder') {
        // DropHolder has no child
        return React.cloneElement(el, {
          __id: Math.random().toString(36).substr(2,9),
          onMounted: (id, position, size, dropLimit, layout, onDragEnterFn, onDragLeaveFn, onDropFn) => {
            this.dropHolders[id] = { 
              position, 
              size, 
              dropLimit,
              layout,
              onDragEnter: onDragEnterFn, 
              onDragLeave: onDragLeaveFn, 
              onDrop: onDropFn,
              reCalculateDroppedItemPosition: this._reCalculateDroppedItemPosition
            }
          }
        })
      }
      let children = []
      if (el.props.children) {
        children = React.Children.map(el.props.children, child => cloneElementRecursively(child))
      }
      if (children.length > 0) {
        if (el.type && el.type.name && el.type.name === 'DragItem') {
          const position = {}
          if (answers && answers[el.props.id]) {
            const ans = answers[el.props.id]
            position.left = ans.left + 'px'
            position.top = ans.top + 'px'
          }
          return React.cloneElement(el, {
            onDragStart: this.handleDragStart,
            onDragEnd: this.handleDragEnd,
            onMounted: (id, position, size, setPositionfn) => {
              this.dragItems[id] = { 
                id, 
                position, 
                size, 
                updatePosition(position) {
                  this.position = position
                  setPositionfn(position)
                }
              }
            },
            ...position
          }, children)
        } else {
          return React.cloneElement(el, {}, children)
        }
      } else {
        return el
      }
    }
    return React.Children.map(this.props.children, child => cloneElementRecursively(child))
  }
  _getStoredAnswers() {
    return this.props.getSavedAnswers && this.props.getSavedAnswers()
  }
  handleMouseDown(e) {
    this.mouse = { left: e.pageX, top: e.pageY}
    this.handleMouseMove(e) // call mouse move to update dropHolder active
  }
  handleMouseMove(e) {
    if (!this.activeDragItem) {
      return
    }
    const draggingItem = this.dragItems[this.activeDragItem]
    // update position
    const currPosition = draggingItem.position
    const offset = { left: e.pageX - this.mouse.left , top: e.pageY - this.mouse.top }
    const newPosition = { 
      left: currPosition.left + offset.left, 
      top: currPosition.top + offset.top
    }
    // make sure drag in the boundary of DragZone
    if (newPosition.left < 0) { 
      newPosition.left = 0 
      this.handleDragEnd(this.activeDragItem)
    }
    if (newPosition.left > this.myRef.current.offsetWidth - draggingItem.size.width) {
      newPosition.left = this.myRef.current.offsetWidth - draggingItem.size.width
      this.handleDragEnd(this.activeDragItem)
    }
    if (newPosition.top < 0) { 
      newPosition.top = 0 
      this.handleDragEnd(this.activeDragItem)
    }
    if (newPosition.top > this.myRef.current.offsetHeight - draggingItem.size.height) {
      newPosition.top = this.myRef.current.offsetHeight - draggingItem.size.height
      this.handleDragEnd(this.activeDragItem)
    }

    this.mouse = {left: e.pageX, top: e.pageY}
    draggingItem.updatePosition(newPosition)
    // calculate whether drag is over a DropHolder
    for (let id in this.dropHolders) {
      const dropHolder = this.dropHolders[id]
      if (this._isOverZone(draggingItem, newPosition, dropHolder)) {
        if (!dropHolder.active) {
          dropHolder.active = true
          dropHolder.onDragEnter()
        }  
      } else {
        if (dropHolder.active) {
          dropHolder.active = false
          dropHolder.onDragLeave()
        } 
      }
    }
    
  }
  _isOverZone(dragItem, position, dropHolder) {
    const item = {
      top: position.top,
      bottom: position.top + dragItem.size.height,
      left: position.left,
      right: position.left + dragItem.size.width
    }
    const zone = {
      top: dropHolder.position.top, 
      bottom: dropHolder.position.top + dropHolder.size.height,
      left: dropHolder.position.left, 
      right: dropHolder.position.left + dropHolder.size.width
    }
    return ( item.bottom > zone.top && item.top < zone.bottom && item.right > zone.left && item.left < zone.right )
  }
  handleDragStart(id) {
    this.activeDragItem = id
    if (this.dragItems[id]) {
      this.dragItems[id].startPosition = { ...this.dragItems[id].position }
    }
  }
  handleDragEnd(id) {
    const draggingItem = this.dragItems[this.activeDragItem]
    if (!draggingItem) { return }
    this.activeDragItem = null
    const target = this.dropHolders[Object.keys(this.dropHolders).filter(id => this.dropHolders[id].active)[0]]
    // check dropLimit
    if (target && target.dropLimit && target.virtualItems && target.virtualItems.length >= target.dropLimit) {
      // dropLimit prevent dropping to this drop holder, dragging item is back to the position
      // before dragging
      draggingItem.updatePosition(draggingItem.startPosition)
      target.active = false
      target.onDrop()
      return
    }
    const dropHolder = draggingItem.holder
    if (dropHolder && (dropHolder !== target)) {
      dropHolder.virtualItems = dropHolder.virtualItems.filter(item => item.id !== draggingItem.id)
      this._reRenderDroppedItemPosition(dropHolder)
    }
    if (dropHolder && (dropHolder === target)) {
      this._reRenderDroppedItemPosition(target)
      target.active = false
      target.onDrop()
    } else {
      if (target) {
        if (!target.virtualItems) { target.virtualItems = [] }
        target.virtualItems.push({ id: draggingItem.id, size: draggingItem.size })
        this._reRenderDroppedItemPosition(target)
        draggingItem.holder = target
        target.active = false
        target.onDrop()
      } else {
        draggingItem.holder = null
      }
    }
    this.updateAnswers()
  }
  _reRenderDroppedItemPosition(dropHolder) {
    const positions = dropHolder.reCalculateDroppedItemPosition()
    for (let i in positions) {
      this.dragItems[i].updatePosition({...positions[i]})
    }
    return this
  }
  _reCalculateDroppedItemPosition() {
    const droppedItemPosition = {}
    const spacing = this.layout && this.layout.spacing ? 
                    {top: parseInt(this.layout.spacing.top), left: parseInt(this.layout.spacing.left)} : {top: 10, left:10}
    const position = { top: this.position.top + spacing.top, left: this.position.left + spacing.left }
    for (let i = 0; i < this.virtualItems.length; i++) {
      const item = this.virtualItems[i]
      droppedItemPosition[item.id] = {...position}
      if (this.layout && this.layout.type === 'stack') {
        position.top += (item.size.height + spacing.top)
      } else {
        position.left += (item.size.width + spacing.left)
      }
    }
    return droppedItemPosition
  }
  updateAnswers() {
    const answer = {}
    for (let i in this.dragItems) {
      answer[i] = {...this.dragItems[i].position}
    }
    this.props.updateAnswers && this.props.updateAnswers(answer)
  }
}

export class DragItem extends Component {
  constructor(props) {
    super(props)

    this.state = {
      left: null, top: null,
      active: false
    }

    this.myRef = React.createRef()

    this.zIndex = undefined

    const methods = [
      'handleMouseDown',
      'handleMouseUp',
      'setPosition',
    ]
    methods.forEach(method => this[method] = this[method].bind(this))
  }

  componentDidMount() {
    const node = this.myRef.current
    this.zIndex = node.style.zIndex
    const position = { left: node.offsetLeft, top: node.offsetTop }
    const size = {width: node.offsetWidth, height: node.offsetHeight}
    this.props.onMounted && this.props.onMounted(this.props.id, position, size, this.setPosition)
  }

  render() {
    const style = {
      position: 'absolute',
      cursor: 'move',
      userSelect: 'none',
    }
    if (this.state.left !== null && this.state.left !== undefined) {
      style.left = this.state.left + 'px'
    } else {
      style.left = this.props.left
    }
    if (this.state.top !== null && this.state.top !== undefined) {
      style.top = this.state.top + 'px'
    } else {
      style.top = this.props.top
    }
    if (this.state.active) {
      style.zIndex = 1000
    } else {
      style.zIndex = this.zIndex
    }
    let className = this.props.className || ''
    if (this.state.active) {
      className += ' w3-card-4'
    }
    return (
      <div  className = {className} style = {style}
            onMouseDown = {this.handleMouseDown}
            onMouseUp = {this.handleMouseUp}
            onMouseEnter = {this.handleMouseEnter}
            ref={this.myRef}
      >
        {this.props.children}
      </div>
    )
  }
  handleMouseDown(e) {
    this.setState({ active: true })
    this.props.onDragStart && this.props.onDragStart(this.props.id)
  }
  handleMouseUp(e) {
    this.setState({ active: false })
    this.props.onDragEnd && this.props.onDragEnd(this.props.id)
  }
  setPosition({left,top}) {
    this.setState({left, top})
  }
}

export class DropHolder extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isDragOver: false
    }
    this.myRef = React.createRef()
    const methods = [
      'onDragEnter',
      'onDragLeave',
      'onDrop'
    ]
    methods.forEach(method => this[method] = this[method].bind(this))
  }
  componentDidMount() {
    const node = this.myRef.current
    const position = { left: node.offsetLeft, top: node.offsetTop }
    const size = {width: node.offsetWidth, height: node.offsetHeight}
    const dropLimit = this.props.dropLimit
    const layout = this.props.layout
    this.props.onMounted && this.props.onMounted(this.props.__id, position, size, dropLimit, layout, this.onDragEnter, this.onDragLeave, this.onDrop)
  }
  render() {
    let _baseClassName = this.props.className || 'w3-container w3-border w3-border-grey w3-padding'
    if (this.state.isDragOver) {
      _baseClassName += ' w3-pale-blue'
    }
    const style = {
      position: 'absolute',
      zIndex: -1,
      width: this.props.width, 
      height: this.props.height, 
      ...this.props.style,
    }
    if (this.props.left) {
      style.left = this.props.left
    }
    if (this.props.top) {
      style.top = this.props.top
    }
    return (
      <div  className={_baseClassName}
            style={ style }
            ref={this.myRef}
      >
        {this.props.items}
      </div>
    )
  }
  onDragEnter() {
    this.setState({ isDragOver: true })
  }
  onDragLeave() {
    this.setState({ isDragOver: false })
  }
  onDrop() {
    this.setState({ isDragOver: false })
  }
}