"use strict"

const React = require('react')

const { serialize } = require('../src/libs/serilaizer')

const {DragItem, DragZone, DropHolder} = require('../src/addons/dragdrop')
const {MultipleChoices, CheckBox} = require('../src/addons/choices')
const {TextGroup, TextBox} = require('../src/addons/text')

const text0 = ({num, text }) => {
  return (
    <TextGroup updateAnswers getSavedAnswers  >
      <h4 className='w3-text-blue'> Quiz-type: Text - ${num} </h4>
      <p> {text} </p>
      <TextBox id='$1' className='w3-light-grey' />
      <p> Thank you </p>
    </TextGroup>
  )
}

const text1 =  ({num, text1, text2}) => {
  return (
    <TextGroup updateAnswers getSavedAnswers  >
      <h4 className='w3-text-orange'> Quiz-type: Text - ${num} </h4>
      <p> {text1} </p>
      <TextBox id='$1' className='w3-light-grey' />
      <p> {text2} </p>
      <p> Thank you </p>
    </TextGroup>
  )
}

const choice0 = ({num, text, labels }) => {
  return (
    <TextGroup updateAnswers getSavedAnswers  >
      <h4 className='w3-text-blue'> Quiz-type: Choice - ${num} </h4>
      <MultipleChoices updateAnswers  getSavedAnswers >
        <p> {text}</p>
        <CheckBox id="$1" label={labels[0]} /> <br />
        <CheckBox id="$2" label={labels[1]} /> <br />
        <CheckBox id="$3" label={labels[2]} /> <br />
      </MultipleChoices>
    </TextGroup>
  )
}

const choice1 = ({num, text1, text2, labels }) => {
  return (
    <TextGroup updateAnswers getSavedAnswers  >
      <h4 className='w3-text-orange'> Quiz-type: Choice - ${num} </h4>
      <MultipleChoices updateAnswers  getSavedAnswers >
        <p> {text1}</p>
        <p className='w3-text-blue-grey' style={{fontStyle: 'italic'}}> {text2} </p>
        <CheckBox id="$1" label={labels[0]} />
        <CheckBox id="$2" label={labels[1]} />
        <CheckBox id="$3" label={labels[2]} />
      </MultipleChoices>
    </TextGroup>
  )
}

const dragdrop0 = ({num, text, labels}) => {
  return (
    <DragZone className='w3-container w3-border w3-border-grey w3-padding'
              width='280px' height='300px' style={{margin: 'auto'}}
              updateAnswers 
              getSavedAnswers
              updateInternalState 
              getSavedInternalState 
    >
      <div>
        <h4 className='w3-text-orange'> Quiz-type: DragDrop - ${num} </h4>
        <p> {text} </p>
        <DragItem id="$1" left='10px' top='20px'> 
          <div className="w3-container w3-red" style={{width: '100px', height: '30px'}}> {labels[0]} </div> 
        </DragItem>
        <DragItem id="$2" left='10px' top='80px'> 
          <div className="w3-container w3-blue" style={{width: '100px', height: '30px'}}> {labels[1]} </div> 
        </DragItem>
        <DragItem id="$3" left='10px' top='140px'> 
          <div className="w3-container w3-green" style={{width: '100px', height: '30px'}}> {labels[2]} </div> 
        </DragItem>
      </div>
      <DropHolder id="$dh_1" layout={{ type: 'stack', spacing: {top:10,left:10} }} width='120px' height='150px' top='20px' left='140px' />
    </DragZone>
  )
}

const template = {
  text: [text0, text1],
  choice: [choice0, choice1],
  dragdrop: [dragdrop0]
}

const answers = {
  text: {
    '$1': '/^awesome$/i'
  },
  choice: {
    '$1': '/false/',
    '$2': '/true/',
    '$3': '/false/'
  },
  dragdrop: {
    '$1': {top: '/^30$/', left: '/^150$/'},
    '$2': {top: '/^70$/', left: '/^150$/'},
    '$3': {top: '/^110$/', left: '/^150$/'}
  }
}

genQuiz()

function genQuiz() {
  const text0s = [
    'ABBA – "Dancing Queen"',
    'Aerosmith – "Dream On"',
    'Games of Thrones - Theme song',
    'The Elder Scrolls V - Theme song',
    'Christina Aguilera – "Beautiful"',
    'AKB48 – "Aitakatta"',
    'Lynn Anderson – "Rose Garden"',
    'The Animals – "The House of the Rising Sun"',
    'Eddy Arnold – "The Cattle Call"',
    'Rick Astley – "Never Gonna Give You Up"',
  ]
  const text1s = [
    'Cyberpunk 2077',
    'Watch Dogs Legion',
    'The Outer Worlds',
    'Star Wars Jedi',
    'Halo Infinite',
    'Battletoads',
    'Age of Empire II: Definitive Edition',
    'Forza Horizon 4',
    'Fire Emblem',
    'Dragon Quest'
  ]
  // generate text 0
  for (let i=0; i<10; i++) {
    const quiz = {
      problem: serialize(template.text[0]({ num: `TA${i}`, text: text0s[i] })),
      answers: answers.text
    }
    console.log(quiz)
  }
  // generate text 1
  for (let i=0; i<10; i++) {
    const quiz = {
      problem: serialize(template.text[1]({ num: `TB${i}`, text1: text1s[i], text2: 'Thank you and regards' })),
      answers: answers.text
    }
    console.log(quiz)
  }
  // generate choice 0
  for (let i=0; i<10; i++) {
    const quiz = {
      problem: serialize(template.choice[0]({ num: `CA${i}`, text: 'Please select one of the following options', labels: [text0s[i], text1s[i], 'Both'] })),
      answers: answers.text
    }
    console.log(quiz)
  }
  // generate choice 1
  for (let i=0; i<10; i++) {
    const quiz = {
      problem: serialize(template.choice[1]({ num: `CB${i}`, text1: 'Please select one of the following options', text2: 'The right answer is the middle one', labels: [text0s[i], text1s[i], 'None'] })),
      answers: answers.text
    }
    console.log(quiz)
  }
  // generate dradrop
  for (let i=0; i<10; i++) {
    const quiz = {
      problem: serialize(template.dragdrop[0]({ num: `DDA${i}`, text: 'Drag in the order Red - Blue - Green', labels: ['Red', 'Blue', 'Green'] })),
      answers: answers.text
    }
    console.log(quiz)
  }
}
