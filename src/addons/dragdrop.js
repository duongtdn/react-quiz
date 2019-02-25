"use strict"

import React, { Component } from 'react'

export class DragZone extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }
    this.holders = {}
    this.itemsIndexes = {}
    this.itemsRel = {}
    this.dragItems = []
    this.dragHolders = {}
  }
  componentDidMount() {
    this.setState({}) // forced render
  }
  render() {
    return (
      <div className={this.props.className} style={{position: 'relative'}}>
        {this.renderChildren()}
      </div>
    )
  }
  updateChildList(holder, children) {
    const dragItems = React.Children.map(children, child => {
      if (child.type && typeof child.type.name && child.type.name === 'DragItem') {
        const _dragItemId = Math.random().toString(36).substr(2,9)
        this.itemsIndexes[_dragItemId] = holder
        return React.cloneElement(child, {
          _dragItemId
        })
      }
    })
    this.holders[holder] = dragItems || []
    this.dragItems = this.dragItems.concat(dragItems)
  }
  renderChildren() {
    // I should move this function to a lib as many addons will need it
    const cloneElementRecursively = (el) => {
      if (!el.type) {
        return el
      }
      if (el.type && typeof el.typename && el.type.name === 'DragHolder') {
        const dragHolder = React.cloneElement(el, {
          items: this.holders[el.props.id],
          updateChildList: (holder, children) => this.updateChildList(holder, children),
          onDroppedItem: (holder, item) => this.droppedItem(holder, item)
        })
        this.dragHolders[el.props.id] = dragHolder
        return dragHolder
      }
      let children = []
      if (el.props.children) {
        children = React.Children.map(el.props.children, child => cloneElementRecursively(child))
      }
      if (children.length > 0) {
        return React.cloneElement(el, {}, children)
      } else {
        return el
      }
    }

    return React.Children.map(this.props.children, child => cloneElementRecursively(child))

  }
  droppedItem(holder, item) {
    // check if drop to the same holder
    if (holder === this.itemsIndexes[item]) {
      return
    }

    const sourceHolder = this.holders[this.itemsIndexes[item]]
    const targetHolder = this.holders[holder]
    
    if (this.itemsRel[item]) {
      const relItem = this.itemsRel[item]
      // check if holder contain a copied version of this item
      if (Object.prototype.toString.call(relItem) === '[object Array]' && relItem.some(_item => this.itemsIndexes[_item] === holder)) {
        return
      }
      // check if this item was copied from an origin item which already have a copied version in this holder
      if (relItem.origin && this.itemsRel[relItem.origin].some(_item => this.itemsIndexes[_item] === holder)) {
        return
      }
      // check if this holder is the holder of origin item
      if (relItem.origin && this.itemsIndexes[relItem.origin] === holder) {
        // when a clone item is drag back to its origin holder,
        // simply removed it
        this.holders[this.itemsIndexes[item]] = sourceHolder.filter(_item => _item.props._dragItemId !== item)
        delete this.itemsIndexes[item]
        delete this.itemsRel[item]
        // updating answers to parent and force rerender
        this.updateAnswers().setState({ })
        return
      }
    }

    let dropEffect, dropLimit
    for (let id in this.dragHolders) {
      if (id === this.itemsIndexes[item]) {
        dropEffect = this.dragHolders[id].props.dropEffect
      }
      if (id === holder) {
        dropLimit = this.dragHolders[id].props.dropLimit
      }
    }

    // push dropped item to new holder if not exceed limit
    if (!dropLimit || dropLimit > targetHolder.length) {
      // extract dropped item
      const droppedItem = sourceHolder.filter(_item => _item.props._dragItemId === item)[0]
      if (dropEffect && dropEffect.toLowerCase() === 'copy') {
        // dropEffect is defined as copy, we clone to new item with new id and push to target
        // also need to make relationship between
        const _dragItemId = Math.random().toString(36).substr(2,9)
        this.itemsIndexes[_dragItemId] = holder
        const newItem = React.cloneElement(droppedItem, { 
          _dragItemId
        })
        targetHolder.push(newItem)
        this.itemsRel[_dragItemId] = { origin: item }
        if (this.itemsRel[item]) {
          this.itemsRel[item].push(_dragItemId)
        } else {
          this.itemsRel[item] = [_dragItemId]
        }
      } else {        
        // push dropped item and remove from source if dropEffect is move
        targetHolder.push(droppedItem)
        this.holders[this.itemsIndexes[item]] = sourceHolder.filter(_item => _item.props._dragItemId !== item)
        this.itemsIndexes[item] = holder
      }
      // updating answers to parent and force rerender
      this.updateAnswers().setState({ })
    }
  }
  updateAnswers() {
    const answerables = []
    for (let id in this.dragHolders) {
      const dragHolder = this.dragHolders[id]
      if (dragHolder.props.answerable) {
        answerables.push(id)
      }
    }
    const answers = {}
    for (let holder in this.holders) {
      if (answerables.indexOf(holder) !== -1) {
        answers[holder] = this.holders[holder].map(child => child.props.value)
      }        
    }      
    this.props.updateAnswers && this.props.updateAnswers(answers)
    return this
  }
}

export class DragHolder extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }
    this.onItemDroppedHere = this.onItemDroppedHere.bind(this)
    this.onDragOver = this.onDragOver.bind(this)
    this.onDragEntered = this.onDragEntered.bind(this)
    this.onDragLeaved = this.onDragLeaved.bind(this)
  }
  componentDidMount() {
    this.props.updateChildList && this.props.updateChildList(this.props.id, this.props.children)
  }
  render() {
    let _baseClassName = this.props.className || 'w3-container w3-border w3-border-grey w3-padding'
    return (
      <div  className={_baseClassName}
            style={{display: 'inline-block', width: this.props.width, height: this.props.height, ...this.props.style}}
            onDragEnter={ this.onDragEntered }
            onDragLeave={ this.onDragLeaved }
            onDragOver={ this.onDragOver }
            onDrop={this.onItemDroppedHere}>
        {this.props.items}
      </div>
    )
  }
  onItemDroppedHere(e) {
    e.preventDefault()
    const data = e.dataTransfer.getData("text")
    this.props.onDroppedItem && this.props.onDroppedItem(this.props.id, data) 
    this.setState({active: false})
  }
  onDragOver(e) {
    e.preventDefault()
  }
  onDragEntered(e) {

  }
  onDragLeaved(e) {

  }
}

export class DragItem extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dragging: false
    }
    this.startDragging = this.startDragging.bind(this)
    this.endDragging = this.endDragging.bind(this)
  }
  render() {
    return (
      <div  draggable={true}
            style={{display: 'inline-block', ...this.props.style}}
            className={this.state.dragging? 'w3-opacity-max' : ''}
            onDragStart={this.startDragging}
            onDragEnd= {this.endDragging}
      >
        {
          React.Children.map(this.props.children, child => {
            if (child.type ) {
              return React.cloneElement(child, { draggable: false })
            } else {
              return child
            }
          })
        }
      </div>
    )
  }
  startDragging(e) {
    this.setState({ dragging: true })
    e.dataTransfer.setData("text", this.props._dragItemId)
  }
  endDragging(e) {
    this.setState({ dragging: false })
  }
}
