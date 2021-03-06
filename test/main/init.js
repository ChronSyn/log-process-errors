import process from 'process'

import test from 'ava'
import sinon from 'sinon'

import { repeatEvents } from '../helpers/repeat.js'
import { startLogging, startLoggingNoOpts } from '../helpers/init.js'
import { removeProcessListeners } from '../helpers/remove.js'

removeProcessListeners()

const addProcessHandler = function(name) {
  const processHandler = sinon.spy()
  process.on(name, processHandler)
  return processHandler
}

const normalizeArgs = function([error]) {
  return String(error)
}

repeatEvents((prefix, { name, emitEvent, defaultLevel }) => {
  test.serial(`${prefix} should work with no options`, async t => {
    // eslint-disable-next-line no-restricted-globals
    const stub = sinon.stub(console, defaultLevel)
    const { stopLogging } = startLoggingNoOpts()

    await emitEvent()

    const messages = stub.args.map(normalizeArgs)

    stopLogging()
    stub.restore()

    t.snapshot(messages)
  })

  test.serial(
    `${prefix} should keep existing process event handlers`,
    async t => {
      if (name === 'warning') {
        return t.pass()
      }

      const processHandler = addProcessHandler(name)

      const { stopLogging } = startLogging()

      t.true(processHandler.notCalled)

      await emitEvent()

      t.true(processHandler.called)

      stopLogging()

      // TODO: use `process.off()` instead of `process.removeListener()`
      // after dropping Node.js <10 support
      process.removeListener(name, processHandler)
    },
  )

  test.serial(`${prefix} should allow disabling logging`, async t => {
    const processHandler = addProcessHandler(name)

    const { stopLogging, log } = startLogging({ log: 'spy' })

    stopLogging()

    t.true(processHandler.notCalled)

    await emitEvent()

    t.true(processHandler.called)
    t.true(log.notCalled)

    stopLogging()

    // TODO: use `process.off()` instead of `process.removeListener()`
    // after dropping Node.js <10 support
    process.removeListener(name, processHandler)
  })
})
