"use strict"

import React, { Component } from 'react'

export class CheckBox extends Component {
  constructor(props) {
    super(props)
    this.state = { checked: false }
  }
  componentDidMount() {
    if (this.props.onMounted) {
      this.props.onMounted(this.props.id, status => this.setState({checked: status}))
    }
  }
  render() {
    return (
      <span>
        <input className="w3-check" type="checkbox" checked={this.state.checked} onChange={e => this.handleCheckboxChange(e)} />
        <label> {this.props.label} </label>
      </span>
    )
  }
  handleCheckboxChange(e) {
    this.props.onChange && this.props.onChange(e)
  }
}

export class MultipleChoices extends Component {
  constructor(props) {
    super(props)
    this.answers = this._getStoredAnswers() || {}
    this._handlers = {}
  }
  componentDidMount() {
    this.children = this._genChildren()
    this.setState({})
  }
  render() {
    return(
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
      if (el.type && el.type.name && el.type.name === 'CheckBox') {
        return React.cloneElement(el, {
          onMounted: (id, updateCheckedStatusFn) => {
            this._handlers[id] = updateCheckedStatusFn
            if (this.answers[id]) {
              this._handlers[id](true)
            } else {
              this.answers[id] = false
            }
          },
          onChange: e => this.handleChecked(el.props.id, e.target.checked)
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
  handleChecked(id, status) {
    this.answers[id] = status
    this._handlers[id](status)
    this.updateAnswers()
  }
  updateAnswers() {
    this.props.updateAnswers && this.props.updateAnswers({...this.answers})
    return this
  }
}