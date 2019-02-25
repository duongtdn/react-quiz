"use strict"

import React, { Component } from 'react'
import { render } from 'react-dom'

import Quiz from '../src/components/Quiz'
import { serialize, deserialize } from '../src/libs/serilaizer'

import addons from '../src/addons/'
import {DragHolder, DragItem, DragZone} from '../src/addons/dragdrop'

const data = {
  problem: '{"props":{"updateAnswers":true},"type":"DragZone","children":[{"type":"div","props":{"className":"w3-cell-row"},"children":[{"type":"div","props":{"className":"w3-cell"},"children":[{"type":"p","props":{},"children":[" Drag and drop your answer to the box in right side "]},{"type":"DragHolder","props":{"id":"$0","width":"300px","height":"100px","style":{"verticalAlign":"top"},"dropEffect":"copy"},"children":[{"type":"DragItem","props":{"style":{"margin":"8px"},"value":"morning"},"children":[{"type":"label","props":{},"children":[" Morning "]}]},{"type":"DragItem","props":{"style":{"margin":"8px"},"value":"noon"},"children":[{"type":"label","props":{},"children":[" Noon "]}]},{"type":"DragItem","props":{"style":{"margin":"8px"},"value":"night"},"children":[{"type":"label","props":{},"children":[" Night "]}]}]}]},{"type":"div","props":{"className":"w3-cell"},"children":[{"type":"p","props":{},"children":[" Label should be in order"]},{"type":"DragHolder","props":{"id":"$1","answerable":true,"width":"100px","height":"200px","className":"w3-container w3-border w3-border-blue w3-padding","style":{"verticalAlign":"top"}}}]}]}]}'
}

class App extends Component {
  constructor(props) {
    super(props)
  }
  componentDidMount() {
    // console.log(serialize(
    //     <DragZone updateAnswers={true} >
    //       <div className="w3-cell-row">
    //         <div className="w3-cell"> 
    //           <p> Drag and drop your answer to the box in right side </p>
    //           <DragHolder id='$0' width='300px' height='100px'
    //                   style={{verticalAlign: 'top'}}
    //                   dropEffect='copy'>
    //             <DragItem style={{margin: '8px'}} value='morning'>
    //               <label> Morning </label>
    //             </DragItem>
    //             <DragItem style={{margin: '8px'}} value='noon'>
    //               <label> Noon </label>
    //             </DragItem>
    //             <DragItem style={{margin: '8px'}} value='night'>
    //             <label> Night </label>
    //             </DragItem>
    //           </DragHolder>
    //         </div>
    //         <div className="w3-cell">
    //           <p> Label should be in order</p>
    //           <DragHolder id='$1' answerable={true}
    //                       width='100px' height='200px'  
    //                       className='w3-container w3-border w3-border-blue w3-padding'
    //                       style={{verticalAlign: 'top'}}>
    //           </DragHolder>
    //         </div>
    //       </div>
    //     </DragZone>
    // ))
  }
  render() {
    return (
      <div className="w3-container">
        Hello
        <Quiz data={data} addons={addons} updateAnswers = { ans => console.log(ans) } />

      </div>
    )
  }
}

render(<App />, document.getElementById('root'))