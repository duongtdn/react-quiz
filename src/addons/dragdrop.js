"use strict"

import React, { Component } from 'react'

export class DragZone extends Component {
  constructor(props) {
    super(props)
    this.setDragItemPosition = {}
    this.dragItemsPosition = {}
    this.activeDragItem = null
    this.mouse = null
    const methods = [
      'handleMouseDown',
      'handleMouseMove',
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
      let children = []
      if (el.props.children) {
        children = React.Children.map(el.props.children, child => cloneElementRecursively(child))
      }
      if (children.length > 0) {
        if (el.type && el.type.name && el.type.name === 'DragItem') {
          return React.cloneElement(el, {
            __id: Math.random().toString(36).substr(2,9),
            onDragStart: (id) => this.activeDragItem = id,
            onDragEnd: (id) => this.activeDragItem = null,
            onMounted: (id, position, setPositionfn) => {
              this.dragItemsPosition[id] = position
              this.setDragItemPosition[id] = setPositionfn
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
    const currPosition = this.dragItemsPosition[this.activeDragItem]
    const offset = { left: e.pageX - this.mouse.left , top: e.pageY - this.mouse.top }
    const newPosition = { 
      left: currPosition.left + offset.left, 
      top: currPosition.top + offset.top
    }
    this.mouse = { left: e.pageX, top: e.pageY}
    this.dragItemsPosition[this.activeDragItem] = newPosition
    this.setDragItemPosition[this.activeDragItem](newPosition)
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
    this.props.onMounted && this.props.onMounted(this.props.__id, position, this.setPosition)
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
  }
  render() {
    let _baseClassName = this.props.className || 'w3-container w3-border w3-border-grey w3-padding'
    const style = {
      position: 'absolute',
      zIndex: -1,
      width: this.props.width, 
      height: this.props.height, 
      ...this.props.style
    }
    if (this.props.left) {
      style.left = this.props.left
    }
    if (this.props.top) {
      style.top = this.props.top
    }
    // if (this.state.active) {
    //   _baseClassName += ' w3-pale-green'
    // }
    return (
      <div  className={_baseClassName}
            style={ style }
      >
        {this.props.items}
      </div>
    )
  }
}