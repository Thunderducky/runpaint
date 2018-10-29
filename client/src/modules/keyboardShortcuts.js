const makeKeyboardShortcuts = PUBSUB => {
  document.addEventListener('keydown', (event) => {
    const {publish:PUB} = PUBSUB
    const key = event.key.toLowerCase()
    if(key === 'e'){
      PUB('context.canvas.set.tool', { tool: 'eraser' })
    } else if(key === 'q'){
      PUB('context.canvas.set.tool', { tool: 'dotpen' })
    }
  })
}

export { makeKeyboardShortcuts }
