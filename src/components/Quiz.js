"use strict"

import React, { Component } from 'react'

import { deserialize } from '../libs/serilaizer'

export default class Quiz extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div>
        {this.renderProblem()}
      </div>
    )
  }
  renderProblem() {    
    const problem = this.props.data.problem
    if (!problem) {
      throw new Error('Invalid data passed to Quiz. Missing problem')
    }
    return deserialize(
      problem, 
      this.props.addons, 
      this.props.updateAnswers, 
      this.props.getSavedAnswers, 
      this.props.updateInternalState,
      this.props.getSavedInternalState
    )
  }
}