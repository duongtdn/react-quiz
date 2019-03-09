"use strict"

import React, { Component } from 'react'
import { render } from 'react-dom'

import Quiz from '../src/components/Quiz'
import { serialize, deserialize } from '../src/libs/serilaizer'

import addons from '../src/addons/'
import {DragItem, DragZone, DropHolder} from '../src/addons/dragdrop'

const data = {
  problem: '{"props":{"updateAnswers":true},"type":"DragZone","children":[{"type":"div","props":{"className":"w3-cell-row"},"children":[{"type":"div","props":{"className":"w3-cell"},"children":[{"type":"p","props":{},"children":[" Drag and drop your answer to the box in right side "]},{"type":"DragHolder","props":{"id":"$0","width":"300px","height":"100px","style":{"verticalAlign":"top"},"dropEffect":"copy"},"children":[{"type":"DragItem","props":{"style":{"margin":"8px"},"value":"morning"},"children":[{"type":"label","props":{"className":"w3-tag w3-round w3-blue"},"children":[" Morning "]}]},{"type":"DragItem","props":{"style":{"margin":"8px"},"value":"noon"},"children":[{"type":"label","props":{"className":"w3-tag w3-round w3-orange"},"children":[" Noon "]}]},{"type":"DragItem","props":{"style":{"margin":"8px"},"value":"night"},"children":[{"type":"label","props":{"className":"w3-tag w3-round w3-purple"},"children":[" Night "]}]}]}]},{"type":"div","props":{"className":"w3-cell"},"children":[{"type":"p","props":{},"children":["  Match the label to correct holder "]},{"type":"div","props":{},"children":[{"type":"DragHolder","props":{"id":"$1","answerable":true,"dropLimit":1,"width":"100px","height":"50px","className":"w3-container w3-border w3-border-blue w3-padding","style":{"verticalAlign":"top"}}},{"type":"label","props":{},"children":[" 8:00 am "]}]},{"type":"div","props":{},"children":[{"type":"DragHolder","props":{"id":"$2","answerable":true,"dropLimit":1,"width":"100px","height":"50px","className":"w3-container w3-border w3-border-blue w3-padding","style":{"verticalAlign":"top"}}},{"type":"label","props":{},"children":[" 12:00 pm "]}]},{"type":"div","props":{},"children":[{"type":"DragHolder","props":{"id":"$3","answerable":true,"dropLimit":1,"width":"100px","height":"50px","className":"w3-container w3-border w3-border-blue w3-padding","style":{"verticalAlign":"top"}}},{"type":"label","props":{},"children":[" 10:00 pm "]}]}]}]}]}'
}

class App extends Component {
  constructor(props) {
    super(props)
  }
  componentDidMount() {
    // console.log(serialize(

    // ))
  }
  render() {
    return (
      <div className="w3-container">
        Hello
        {/* <Quiz data={data} addons={addons} updateAnswers = { ans => console.log(ans) } />         */}
        <DragZone className='w3-container w3-border w3-border-grey w3-padding' width='700px' height='500px'>
          <div>
            <DragItem> <div className="w3-container w3-red" style={{width: '100px', height: '100px'}}> Drag Me </div> </DragItem>
            <DragItem left='120px' > <div className="w3-container w3-blue" style={{width: '150px', height: '100px'}}> Drag Me </div> </DragItem>
            <DragItem left='280px'> <div className="w3-container w3-green" style={{width: '100px', height: '100px'}}> Drag Me </div> </DragItem>
          </div>
          <DropHolder width='350px' height='120px' top='200px' left='100px' />
        </DragZone>
      </div>
    )
  }
}

render(<App />, document.getElementById('root'))