import { either } from 'fp-ts'
import { flow } from 'fp-ts/lib/function'
import { failure } from 'io-ts/lib/PathReporter'
import * as t from 'io-ts'

export class ValidationError extends SyntaxError {}

export const validate = <A>(decoder: t.Decoder<unknown, A>) =>
  flow(
    decoder.decode,
    either.mapLeft(e => new ValidationError(failure(e).join('\n')))
  )
