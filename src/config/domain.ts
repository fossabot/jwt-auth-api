import { either, taskEither, json } from 'fp-ts'
import { flow } from 'fp-ts/lib/function'
import { promisify } from 'util'
import { validate } from '../utils/validation'
import * as fs from 'fs'
import * as t from 'io-ts'

export const ConfigC = t.type({
  server: t.type({
    connection: t.type({
      port: t.number,
      host: t.string
    }),
    app: t.type({
      cookie: t.string,
      jwt: t.tuple([t.string, t.string])
    })
  }),
  databasePool: t.type({
    uri: t.string,
    databases: t.array(t.string)
  })
})

export type Config = t.TypeOf<typeof ConfigC>
export type JwtConfig = Config['server']['app']['jwt']

export const readFile = (path: fs.PathOrFileDescriptor) =>
  taskEither.tryCatch(
    () => promisify(fs.readFile)(path, 'utf8'),
    either.toError
  )

export const parse = flow(
  json.parse,
  either.mapLeft(error => error as SyntaxError)
)

export const config = flow(
  readFile,
  taskEither.chainEitherK(parse),
  taskEither.chainEitherK(validate(ConfigC))
)
