"use strict"

import React, { useState, useRef } from 'react';



export default function DragItem({ boundary, children }) {

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);

  const mouse = useRef({x: 0, y: 0});
  const itemRef = useRef(null);

  const left = position.x + 'px';
  const top = position.y + 'px';

  return (
    <div  style = {{ ...styles.draggable, left, top }}
          onMouseDown = {handleMouseDown}
          onMouseUp = {handleMouseUp}
          onMouseMove = {handleMouseMove}
          onTouchStart = {handleMouseDown}
          onTouchEnd = {handleMouseUp}
          ref = {itemRef}
    >
      { children }
    </div>
  );

  function handleMouseDown(e) {
    if (e.changedTouches) e = e.changedTouches[0];
    startDragging(e);
  }

  function handleMouseUp(e) {
    if (e.changedTouches) e = e.changedTouches[0];
    endDragging();
  }

  function handleMouseMove(e) {
    if (!active) return
    if (e.changedTouches) e = e.changedTouches[0];
    doDragging(e);
  }

  function startDragging(e) {
    console.log('drag start');
    setActive(true);
    rememberCurrentMousePosition({ x: e.pageX, y: e.pageY });
  }

  function endDragging() {
    console.log('drag end')
    setActive(false);
  }

  function doDragging(e) {
    moveItem();

    rememberCurrentMousePosition({ x: e.pageX, y: e.pageY });

    isMouseOutOfRange(e) && endDragging();

    function moveItem() {
      setPosition(calculateNewPosition(e));
    }
  }

  function calculateNewPosition(e) {
    const offset = calculateMouseOffset(e);
    return {
      x: calculateValidPosition('x', offset),
      y: calculateValidPosition('y', offset),
    };
  }

  function calculateValidPosition(axis, offset) {
    const nextValue = position[axis] + offset[axis];
    if (nextValue < 0) return 0;
    const maxValue = getMaxAxisValue(axis);
    if (nextValue > maxValue) return maxValue;
    return nextValue;
  }

  function getMaxAxisValue(axis) {
    const dict = { x: 'width', X: 'Width', y: 'height', Y: 'Height', };
    return boundary[dict[axis]] - itemRef.current[`offset${dict[axis.toUpperCase()]}`];
  }

  function calculateMouseOffset(e) {
    return {
      x: e.pageX - mouse.current.x,
      y: e.pageY - mouse.current.y,
    };
  }

  function rememberCurrentMousePosition({x, y}) {
    mouse.current = { x, y };
  }

  function isMouseOutOfRange(e) {
    const offset = calculateMouseOffset(e);

    const left= position.x + offset.x;
    if (left < 0 || left > getMaxAxisValue('x')) return true;

    const top = position.y + offset.y;
    if (top < 0 || top > getMaxAxisValue('y')) return true;

    return false;
  }

}

const styles = {
  draggable: {
    position: 'absolute',
    cursor: 'move',
    userSelect: 'none',
  }
};
