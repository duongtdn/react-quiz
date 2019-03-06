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
      'handleDragEnd'
    ]
    methods.forEach(method => this[method] = this[method].bind(this))
  }
  componentDidMount() {
    this.children = this.genChildren()
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
      >
        {this.children || this.props.children}
      </div>
    )
  }
  genChildren() {
    // I should move this function to a lib as many addons will need it
    const cloneElementRecursively = (el) => {
      if (!el.type) {
        return el
      }
      if (el.type && el.type.name && el.type.name === 'DropHolder') {
        // DropHolder has no child
        return React.cloneElement(el, {
          __id: Math.random().toString(36).substr(2,9),
          onMounted: (id, position, size, onDragEnterFn, onDragLeaveFn, onDropFn) => {
            this.dropHolders[id] = { position, size, onDragEnter: onDragEnterFn, onDragLeave: onDragLeaveFn, onDrop: onDropFn }
          }
        })
      }
      let children = []
      if (el.props.children) {
        children = React.Children.map(el.props.children, child => cloneElementRecursively(child))
      }
      if (children.length > 0) {
        if (el.type && el.type.name && el.type.name === 'DragItem') {
          return React.cloneElement(el, {
            __id: Math.random().toString(36).substr(2,9),
            onDragStart: (id) => this.activeDragItem = id,
            onDragEnd: this.handleDragEnd,
            onMounted: (id, position, setPositionfn, size) => {
              this.dragItems[id] = { position, size, updatePosition: function(){setPositionfn(this.position)} }
            }
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
  handleMouseDown(e) {
    this.mouse = { left: e.pageX, top: e.pageY}
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
    this.mouse = { left: e.pageX, top: e.pageY}
    draggingItem.position = newPosition
    draggingItem.updatePosition()
    // calculate wether drag is over a DropHolder
    const center = {
      horizontal: newPosition.top + draggingItem.size.height/2,
      vertical: newPosition.left + draggingItem.size.width/2
    }
    for (let id in this.dropHolders) {
      const dropHolder = this.dropHolders[id]
      const threshold = {
        upper: dropHolder.position.top, bottom: dropHolder.position.top + dropHolder.size.height,
        left: dropHolder.position.left, right: dropHolder.position.left + dropHolder.size.width
      }
      if (center.horizontal > threshold.upper && center.horizontal < threshold.bottom &&
          center.vertical > threshold.left && center.vertical < threshold.right) {
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
  handleDragEnd(id) {
    const draggingItem = this.dragItems[this.activeDragItem]
    this.activeDragItem = null
    const dropHolder = this.dropHolders[Object.keys(this.dropHolders).filter(id => this.dropHolders[id].active)[0]]
    if (dropHolder) {
      const position = this._calDropItemPosition(dropHolder)
      draggingItem.position = position
      draggingItem.updatePosition()
      dropHolder.active = false
      dropHolder.onDrop()
    }
  }
  _renderVirtualDropHolder(enable, draggingItem, dropHolder) {
    if (!enable) {
      return null
    }
    const position = { top: dropHolder.position.top + 10, left: dropHolder.position.left + 10 }
    const size = { width: draggingItem.size.width, height: draggingItem.size.height }
    const style = {
      position: 'absolute',
      width: size.width + 'px', height: size.height + 'px',
      top: position.top + 'px', left: position.left + 'px'
    }
    return (
      <div className = "w3-border w3-border-grey w3-pale-red" style = {style} />
    )
  }
  _calDropItemPosition(dropHolder) {
    return { top: dropHolder.position.top + 10, left: dropHolder.position.left + 10 }
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
    this.props.onMounted && this.props.onMounted(this.props.__id, position, this.setPosition, size)
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
    return (
      <div  className = {this.props.className} style = { style }
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
    this.props.onDragStart && this.props.onDragStart(this.props.__id)
  }
  handleMouseUp(e) {
    this.setState({ active: false })
    this.props.onDragEnd && this.props.onDragEnd(this.props.__id)
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
    this.props.onMounted && this.props.onMounted(this.props.__id, position, size, this.onDragEnter, this.onDragLeave, this.onDrop)
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