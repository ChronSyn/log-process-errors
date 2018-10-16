'use strict'

const process = require('process')

const { DEFAULT_OPTS } = require('./default')
const EVENTS = require('./events')

// Add event handling for all process-related errors
const setup = function(opts) {
  debugger
  const optsA = { ...DEFAULT_OPTS, ...opts }

  const listeners = addListeners({ opts: optsA })
  const removeAll = removeListeners.bind(null, listeners)
  return removeAll
}

const addListeners = function({ opts }) {
  return Object.entries(EVENTS).map(([eventName, eventFunc]) =>
    addListener({ opts, eventName, eventFunc }),
  )
}

const addListener = function({ opts, eventName, eventFunc }) {
  const eventListener = eventFunc.bind(null, { opts, eventName })
  process.on(eventName, eventListener)

  return { eventListener, eventName }
}

// Remove all event handlers
const removeListeners = function(listeners) {
  listeners.forEach(removeListener)
}

const removeListener = function({ eventListener, eventName }) {
  // TODO: use `process.off()` instead of `process.removeListener()`
  // after dropping Node.js <10 support
  process.removeListener(eventName, eventListener)
}

module.exports = setup
