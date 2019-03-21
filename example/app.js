"use strict"

import React, { Component } from 'react'
import { render } from 'react-dom'

import Quiz from '../src/components/Quiz'
import { serialize, deserialize } from '../src/libs/serilaizer'

import addons from '../src/addons/'
import {DragItem, DragZone, DropHolder} from '../src/addons/dragdrop'

const data = {
  problem: '{"props":{"className":"w3-container w3-border w3-border-grey w3-padding","width":"700px","height":"500px","updateAnswers":true,"getSavedAnswers":true},"type":"DragZone","children":[{"type":"div","props":{},"children":[{"type":"DragItem","props":{"id":"$1"},"children":[" ",{"type":"div","props":{"className":"w3-container w3-red","style":{"width":"100px","height":"100px"}},"children":[" Drag Me "]}," "]},{"type":"DragItem","props":{"id":"$2","left":"120px"},"children":[" ",{"type":"div","props":{"className":"w3-container w3-blue","style":{"width":"150px","height":"100px"}},"children":[" Drag Me "]}," "]},{"type":"DragItem","props":{"id":"$3","left":"280px"},"children":[" ",{"type":"div","props":{"className":"w3-container w3-green","style":{"width":"100px","height":"100px"}},"children":[" Drag Me "]}," "]}]},{"type":"DropHolder","props":{"layout":{"spacing":{"top":10,"left":20}},"width":"190px","height":"120px","top":"150px","left":"10px","dropLimit":1}},{"type":"DropHolder","props":{"width":"390px","height":"120px","top":"300px","left":"10px","dropLimit":2}},{"type":"DropHolder","props":{"layout":{"type":"stack","spacing":{"top":20,"left":10}},"width":"170px","height":"380px","top":"50px","left":"500px"}}]}'
}

// const answers = {
//   "$1": {top: 70, left: 510},
//   "$2": {top: 190, left: 510},
//   "$3": {top: 310, left: 510}
// }
const answers = undefined

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
        <Quiz data={data} addons={addons} updateAnswers = { ans => console.log(ans) } getSavedAnswers = {_ => answers} />        
        {/* <DragZone className='w3-container w3-border w3-border-grey w3-padding' width='700px' height='500px' updateAnswers={true} getSavedAnswers >
          <div>
            <DragItem id="$1"> <div className="w3-container w3-red" style={{width: '100px', height: '100px'}}> Drag Me </div> </DragItem>
            <DragItem id="$2" left='120px' > <div className="w3-container w3-blue" style={{width: '150px', height: '100px'}}> Drag Me </div> </DragItem>
            <DragItem id="$3" left='280px'> <div className="w3-container w3-green" style={{width: '100px', height: '100px'}}> Drag Me </div> </DragItem>
          </div>
          <DropHolder layout={{ spacing: {top:10,left:20} }}width='190px' height='120px' top='150px' left='10px' dropLimit={1} />
          <DropHolder width='390px' height='120px' top='300px' left='10px' dropLimit={2} />
          <DropHolder layout={{ type: 'stack', spacing: {top:20,left:10} }} width='170px' height='380px' top='50px' left='500px' />
        </DragZone> */}
      </div>
    )
  }
}

render(<App />, document.getElementById('root'))