'use strict'

const { multipleValidOptions } = require('jest-validate')

const { RUNNERS } = require('./runners')

// Apply `options.testing` which is basically a preset of options.
const applyTesting = function({ opts, opts: { level, testing } }) {
  if (testing === undefined) {
    return opts
  }

  const testOpts = RUNNERS[testing]

  validateTesting({ testOpts, testing })
  validateTestOpts({ opts, testOpts, testing })

  return {
    ...opts,
    ...testOpts,
    // Users can override `level.default` but not the ones defined in `testOpts`
    level: { default: 'error', ...level, ...testOpts.level },
  }
}

const validateTesting = function({ testOpts, testing }) {
  if (testOpts !== undefined) {
    return
  }

  const runners = Object.keys(RUNNERS).join(', ')
  throw new Error(
    `Invalid option 'testing' '${testing}': must be one of ${runners}`,
  )
}

// Presets override other options. We make sure users do not assume their
// options are used when they are actually overriden.
const validateTestOpts = function({ opts, testOpts, testing }) {
  const forbiddenOpts = Object.keys(testOpts).filter(isForbiddenOpt)

  const invalidOpt = Object.keys(opts).find(optName =>
    forbiddenOpts.includes(optName),
  )

  if (invalidOpt === undefined) {
    return
  }

  throw new Error(
    `Invalid option '${invalidOpt}': it must not be defined together with the option 'testing' '${testing}'`,
  )
}

// We allow overriding preset's `level` so users can filter events.
const isForbiddenOpt = function(optName) {
  return !ALLOWED_OPTS.includes(optName)
}

const ALLOWED_OPTS = ['level']

// Use during options validation
const getExampleTesting = function() {
  return multipleValidOptions(...Object.keys(RUNNERS))
}

module.exports = {
  applyTesting,
  getExampleTesting,
}
