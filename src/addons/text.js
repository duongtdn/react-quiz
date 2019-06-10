"use strict"

import React, { Component } from 'react'

export class TextBox extends Component {
  constructor(props) {
    super(props)
    this.state = { value: '' }
  }
  componentDidMount() {
    if (this.props.onMounted) {
      this.props.onMounted(this.props.id, value => this.setState({ value }))
    }
  }
  render() {
    return (
      <span style={this.props.style}>
        <input  className={`w3-input ${this.props.className}`} type="text"
                value={this.state.value} onChange={e => this.handleChange(e)}
        />
      </span>
    )
  }
  handleChange(e) {
    this.props.onChange && this.props.onChange(e)
  }
}


export class TextGroup extends Component {
  constructor(props) {
    super(props)
    this._handlers = {}
    this.answers = this._getStoredAnswers() || {}
  }
  componentDidMount() {
    this.children = this._genChildren()
    this.setState({})
  }
  render() {
    return (
      <div>
        {this.children || this.props.children}
      </div>
    )
  }
  _genChildren() {
    // I should move this function to a lib as many addons will need it
    const cloneElementRecursively = (el) => {
      if (!el.type) {
        return el
      }
      if (el.type && el.type.name && el.type.name === 'TextBox') {
        return React.cloneElement(el, {
          onMounted: (id, updateTextValueFn) => {
            this._handlers[id] = updateTextValueFn
            if (this.answers[id]) {
              this._handlers[id](this.answers[id])
            }
          },
          onChange: e => this.handleChange(el.props.id, e.target.value)
        })
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
  _getStoredAnswers() {
    return this.props.getSavedAnswers && this.props.getSavedAnswers()
  }
  handleChange(id, value) {
    this.answers[id] = value
    this._handlers[id](value)
    this.updateAnswers()
  }
  updateAnswers() {
    this.props.updateAnswers && this.props.updateAnswers({...this.answers})
    return this
  }
}
