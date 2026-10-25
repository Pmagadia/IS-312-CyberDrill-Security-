// React Router needs TextEncoder, which Jest's browser simulation (jsdom) does not provide.
import { TextDecoder, TextEncoder } from 'node:util'

Object.assign(globalThis, { TextEncoder, TextDecoder })
