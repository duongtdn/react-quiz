"use strict"

import React, { Component } from 'react'
import { render } from 'react-dom'

import Quiz from '../src/components/Quiz'
import { serialize, deserialize } from '../src/libs/serilaizer'

import addons from '../src/addons/'
import {DragItem, DragZone, DropHolder} from '../src/addons/dragdrop'

const data = {
  problem: '{"props":{"className":"w3-container w3-border w3-border-grey w3-padding","width":"700px","height":"500px","updateAnswers":true,"getSavedAnswers":true,"updateInternalState":true,"getSavedInternalState":true},"type":"DragZone","children":[{"type":"div","props":{},"children":[{"type":"DragItem","props":{"id":"$1"},"children":[" ",{"type":"div","props":{"className":"w3-container w3-red","style":{"width":"100px","height":"100px"}},"children":[" Drag Me "]}," "]},{"type":"DragItem","props":{"id":"$2","left":"120px"},"children":[" ",{"type":"div","props":{"className":"w3-container w3-blue","style":{"width":"150px","height":"100px"}},"children":[" Drag Me "]}," "]},{"type":"DragItem","props":{"id":"$3","left":"280px"},"children":[" ",{"type":"div","props":{"className":"w3-container w3-green","style":{"width":"100px","height":"100px"}},"children":[" Drag Me "]}," "]}]},{"type":"DropHolder","props":{"id":"$dh_1","layout":{"spacing":{"top":10,"left":20}},"width":"190px","height":"120px","top":"150px","left":"10px","dropLimit":1}},{"type":"DropHolder","props":{"id":"$dh_2","width":"390px","height":"120px","top":"300px","left":"10px","dropLimit":2}},{"type":"DropHolder","props":{"id":"$dh_3","layout":{"type":"stack","spacing":{"top":20,"left":10}},"width":"170px","height":"380px","top":"50px","left":"500px"}}]}'
}

const answers = {
  "$1": {top: 310, left: 20},
  "$2": {top: 160, left: 30},
  "$3": {top: 70, left: 510}
}
const state = {
  dragItems: {
    "$1": {id: "$1", holder: "$dh_2"},
    "$2": {id: "$2", holder: "$dh_1"},
    "$3": {id: "$3", holder: "$dh_3"}
  },
  dropHolders: {
    "$dh_1": {id: "$dh_1", virtualItems: [{id: "$2", size: {width: 150, height: 100}}]},
    "$dh_2": {id: "$dh_2", virtualItems: [{id: "$1", size: {width: 100, height: 100}}]},
    "$dh_3": {id: "$dh_3", virtualItems: [{id: "$3", size: {width: 100, height: 100}}]}
  }
}
// const answers = undefined
// const state = undefined

class App extends Component {
  constructor(props) {
    super(props)
  }
  componentDidMount() {
    console.log(serialize(
      <DragZone className='w3-container w3-border w3-border-grey w3-padding' 
                width='700px' height='500px' 
                updateAnswers 
                getSavedAnswers
                updateInternalState
                getSavedInternalState
      >
        <div>
          <DragItem id="$1"> <div className="w3-container w3-red" style={{width: '100px', height: '100px'}}> Drag Me </div> </DragItem>
          <DragItem id="$2" left='120px' > <div className="w3-container w3-blue" style={{width: '150px', height: '100px'}}> Drag Me </div> </DragItem>
          <DragItem id="$3" left='280px'> <div className="w3-container w3-green" style={{width: '100px', height: '100px'}}> Drag Me </div> </DragItem>
        </div>
        <DropHolder id="$dh_1" layout={{ spacing: {top:10,left:20} }}width='190px' height='120px' top='150px' left='10px' dropLimit={1} />
        <DropHolder id="$dh_2" width='390px' height='120px' top='300px' left='10px' dropLimit={2} />
        <DropHolder id="$dh_3" layout={{ type: 'stack', spacing: {top:20,left:10} }} width='170px' height='380px' top='50px' left='500px' />
      </DragZone>
    ))
  }
  render() {
    return (
      <div className="w3-container">
        Hello
        <Quiz data={data} addons={addons} 
              updateAnswers = { ans => console.log(ans) } 
              getSavedAnswers = { _ => answers } 
              updateInternalState = { state => console.log(state)}
              getSavedInternalState = { _ => state }
        />        
        {/* <DragZone className='w3-container w3-border w3-border-grey w3-padding' 
                  width='700px' height='500px' 
                  updateAnswers 
                  getSavedAnswers
                  updateInternalState
                  getSavedInternalState
        >
          <div>
            <DragItem id="$1"> <div className="w3-container w3-red" style={{width: '100px', height: '100px'}}> Drag Me </div> </DragItem>
            <DragItem id="$2" left='120px' > <div className="w3-container w3-blue" style={{width: '150px', height: '100px'}}> Drag Me </div> </DragItem>
            <DragItem id="$3" left='280px'> <div className="w3-container w3-green" style={{width: '100px', height: '100px'}}> Drag Me </div> </DragItem>
          </div>
          <DropHolder id="$dh_1" layout={{ spacing: {top:10,left:20} }}width='190px' height='120px' top='150px' left='10px' dropLimit={1} />
          <DropHolder id="$dh_2" width='390px' height='120px' top='300px' left='10px' dropLimit={2} />
          <DropHolder id="$dh_3" layout={{ type: 'stack', spacing: {top:20,left:10} }} width='170px' height='380px' top='50px' left='500px' />
        </DragZone> */}
      </div>
    )
  }
}

render(<App />, document.getElementById('root'))