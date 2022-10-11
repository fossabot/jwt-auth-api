import { either, json, readerTaskEither } from 'fp-ts'
import { pipe } from 'fp-ts/lib/function'
import { deleteOne, findOne, updateOne } from 'mongad'
import { MongoError, WithId } from 'mongodb'
import { AtLeastOne, Query, Statement } from '../utils/repository'
import { Session } from './domain'

export const findSession = (
  query: Query<Session>
): Statement<MongoError, Session> =>
  pipe(
    findOne('sessions', query),
    readerTaskEither.chainEitherK(
      either.fromNullable(
        new MongoError(
          `Cannot find session by query: ${pipe(
            json.stringify(query),
            either.toUnion
          )}`
        )
      )
    )
  )

export const updateSession = (
  query: Query<Session>,
  update: AtLeastOne<Session>
): Statement<MongoError, Session> =>
  pipe(
    updateOne<WithId<Session>>(
      'sessions',
      query,
      { $set: update },
      { upsert: true }
    ),
    readerTaskEither.chainEitherK(
      either.fromNullable(
        new MongoError(
          `Cannot update session by query: ${pipe(
            json.stringify(query),
            either.toUnion
          )}`
        )
      )
    )
  )

export const deleteSession = (
  query: Query<Session>
): Statement<MongoError, Session> =>
  pipe(
    deleteOne('sessions', query),
    readerTaskEither.chainEitherK(
      either.fromNullable(
        new MongoError(
          `Cannot delete session by query: ${pipe(
            json.stringify(query),
            either.toUnion
          )}`
        )
      )
    )
  )
