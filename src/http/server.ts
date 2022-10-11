import express, { Express } from 'express'
import cookieParser from 'cookie-parser'
import { AppConfig, ConnectionConfig, ServerConfig } from '../config/domain'
import { Handle } from '../handle/domain'
import { TaskEither } from 'fp-ts/lib/TaskEither'
import { Server } from 'http'
import { either, taskEither } from 'fp-ts'
import { pipe } from 'fp-ts/lib/function'
import { info } from 'logger-fp-ts'

export const app = (config: AppConfig) => (handle: Handle) =>
  express().disable('x-powered-by').use(cookieParser(config.cookie))

export class ServerStartupError extends Error {}

export const connection =
  (config: ConnectionConfig) =>
  (express: Express): TaskEither<ServerStartupError, Server> =>
    taskEither.tryCatch(
      () =>
        new Promise((resolve, reject) =>
          pipe(express.listen(config.port, config.host), server =>
            server
              .once('error', reject)
              .once('listening', () => resolve(server))
          )
        ),
      either.toError
    )

export const server =
  (config: ServerConfig) =>
  (handle: Handle): TaskEither<ServerStartupError, Server> =>
    pipe(
      app(config.app)(handle),
      connection(config.connection),
      taskEither.chainFirstIOK(() =>
        info(`Server running on port ${config.connection.port}`)(handle.logger)
      )
    )
