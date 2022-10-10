import { SystemClock } from 'clock-ts'
import { taskEither, console } from 'fp-ts'
import { pipe } from 'fp-ts/lib/function'
import { getColoredShow, LoggerEnv, ShowLogEntry, withShow } from 'logger-fp-ts'
import { connect, getDb } from 'mongad'
import { Db } from 'mongodb'

export type Handle = {
  database: Db
  logger: LoggerEnv
}

export const databasePool = (uri: string) => (database: string) =>
  pipe(connect(uri), taskEither.map(getDb(database)))

export const logger = {
  clock: SystemClock,
  logger: pipe(console.log, pipe(ShowLogEntry, getColoredShow, withShow))
}
