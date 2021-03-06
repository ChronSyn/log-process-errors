import { argv } from 'process'

// We use `import` instead of the `-r` flag because Istanbul does not cover
// files loaded with the `-r` flag:
//   https://github.com/istanbuljs/istanbuljs.github.io/issues/144
// eslint-disable-next-line import/no-unassigned-import
import '../../../register/index.js'

import { stubStackTrace } from '../stack.js'
import { EVENTS } from '../emit/main.js'

stubStackTrace()

const [, , name] = argv
EVENTS[name]()
