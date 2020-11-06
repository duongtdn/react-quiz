"use strict"

import React from 'react';

export default function({ width, height , children })  {

  return (
    <div className = "w3-card w3-margin" style = {{ position: 'relative', width, height }}>
      {
        React.Children.map(children, child => React.cloneElement(child, { boundary: { width, height } }))
      }
    </div>
  )
}
