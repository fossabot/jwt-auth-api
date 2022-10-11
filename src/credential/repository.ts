import { either, json, readerTaskEither } from 'fp-ts'
import { pipe } from 'fp-ts/lib/function'
import { findOne, insertOne } from 'mongad'
import { MongoError, WithId } from 'mongodb'
import { Query, Statement } from '../utils/repository'
import { Credential } from './domain'
import { Protected, Public } from './password'

export const findCredential = (
  query: Query<Public<Credential>>
): Statement<MongoError, Protected<Credential>> =>
  pipe(
    findOne<WithId<Protected<Credential>>>('credentials', query),
    readerTaskEither.chainEitherK(
      either.fromNullable(
        new MongoError(
          `Cannot find credential by query: ${pipe(
            json.stringify(query),
            either.toUnion
          )}`
        )
      )
    )
  )

export const insertCredential = (
  credential: Protected<Credential>
): Statement<MongoError, Protected<Credential>> =>
  insertOne('credentials', credential)
