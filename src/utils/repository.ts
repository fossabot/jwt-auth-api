import { ReaderTaskEither } from 'fp-ts/lib/ReaderTaskEither'
import { Db, WithId } from 'mongodb'

export type AtLeastOne<A, Keys extends keyof A = keyof A> = Partial<A> &
  { [K in Keys]: Required<Pick<A, K>> }[Keys]

export type Query<A> = AtLeastOne<WithId<A>>

export type Statement<E, A> = ReaderTaskEither<Db, E, WithId<A>>
