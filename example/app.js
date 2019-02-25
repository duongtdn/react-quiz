"use strict"

import React, { Component } from 'react'
import { render } from 'react-dom'

import Quiz from '../src/components/Quiz'
import { serialize, deserialize } from '../src/libs/serilaizer'

import addons from '../src/addons/'
import {DragHolder, DragItem, DragZone} from '../src/addons/dragdrop'

const data = {
  problem: '{"props":{},"type":"div","children":[{"type":"DragZone","props":{"updateAnswers":true},"children":[{"type":"DragHolder","props":{"id":"$1","dropLimit":2,"answerable":true,"width":"400px","height":"200px","className":"w3-container w3-border w3-border-blue w3-padding","style":{"verticalAlign":"top"}}}," ",{"type":"DragHolder","props":{"id":"$2","width":"400px","height":"200px","answerable":true,"className":"w3-container w3-border w3-border-red w3-padding","style":{"verticalAlign":"top"}}},{"type":"hr","props":{}},{"type":"DragHolder","props":{"id":"$3","width":"900px","height":"200px","answerable":false,"style":{"verticalAlign":"top"},"dropEffect":"copy"},"children":[{"type":"DragItem","props":{"style":{"margin":"8px"},"value":"morning"},"children":[{"type":"img","props":{"src":"https://i.ytimg.com/vi/-ABRpxQKpiI/maxresdefault.jpg","className":"w3-circle","width":"60px","height":"60px"}},{"type":"label","props":{},"children":[" Morning "]}]},{"type":"DragItem","props":{"style":{"margin":"8px"},"value":"noon"},"children":[{"type":"img","props":{"src":"https://ak8.picdn.net/shutterstock/videos/12530228/thumb/11.jpg","className":"w3-circle","width":"60px","height":"60px"}},"Noon"]},{"type":"DragItem","props":{"style":{"margin":"8px"},"value":"night"},"children":[{"type":"img","props":{"src":"https://static-2.gumroad.com/res/gumroad/3846839948920/asset_previews/ce091808afdcf672e4cd27b826868d2a/retina/Night_20Night_20Lullaby.bmp","className":"w3-circle","width":"60px","height":"60px"}},"Night"]}]}]}]}'
}

class App extends Component {
  constructor(props) {
    super(props)
  }
  componentDidMount() {
    // console.log(serialize(
    //   <div>
    //     <DragZone updateAnswers={true}>
    //       <DragHolder id='$1' dropLimit={2} answerable={true}
    //                   width='400px' height='200px'  
    //                   className='w3-container w3-border w3-border-blue w3-padding'
    //                   style={{verticalAlign: 'top'}}>
    //       </DragHolder>
    //       {' '}
    //       <DragHolder id='$2' width='400px' height='200px' answerable={true}
    //                   className='w3-container w3-border w3-border-red w3-padding'
    //                   style={{verticalAlign: 'top'}}>
    //       </DragHolder>
    //       <hr />
    //       <DragHolder id='$3' width='900px' height='200px' answerable={false}
    //                   style={{verticalAlign: 'top'}}
    //                   dropEffect='copy'>
    //         <DragItem style={{margin: '8px'}} value='morning'>
    //           <img  src = 'https://i.ytimg.com/vi/-ABRpxQKpiI/maxresdefault.jpg' 
    //                 className="w3-circle" width='60px' height='60px' />
    //           <label> Morning </label>
    //         </DragItem>
    //         <DragItem style={{margin: '8px'}} value='noon'>
    //           <img  src = 'https://ak8.picdn.net/shutterstock/videos/12530228/thumb/11.jpg' 
    //                 className="w3-circle" width='60px' height='60px' />
    //           Noon
    //         </DragItem>
    //         <DragItem style={{margin: '8px'}} value='night'>
    //           <img  src = 'https://static-2.gumroad.com/res/gumroad/3846839948920/asset_previews/ce091808afdcf672e4cd27b826868d2a/retina/Night_20Night_20Lullaby.bmp' 
    //                 className="w3-circle" width='60px' height='60px' />
    //           Night
    //         </DragItem>
    //       </DragHolder>
    //     </DragZone>
    //   </div>
    // ))
  }
  render() {
    return (
      <div>
        Hello
        <Quiz data={data} addons={addons} updateAnswers = { ans => console.log(ans) } />
      </div>
    )
  }
}

render(<App />, document.getElementById('root'))