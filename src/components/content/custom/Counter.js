import React, { useState } from "react"

const Counter = () => {
  const [count, setCount] = useState(0)
  const onIncrement = () => {
    setCount(count + 1)
  }
  const onDecrement = () => {
    setCount(count - 1)
  }
  return (
    <span>
      <span>What is it likes here</span>
      {count}
      <button onClick={onIncrement}>+1</button>
      <button onClick={onDecrement}>-1</button>
    </span>
  )
}

export default Counter
