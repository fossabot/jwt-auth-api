import { task } from 'fp-ts'
import { flow, pipe } from 'fp-ts/lib/function'
import { iso, Newtype } from 'newtype-ts'
import * as bcrypt from 'bcryptjs'

export type Hash = Newtype<{ readonly Hash: unique symbol }, string>

export type Hashed<A> = {
  [K in keyof A]: Hash
}

export const hash = (string: string) =>
  pipe(
    () => bcrypt.genSalt(10),
    task.chain(salt => () => bcrypt.hash(string, salt)),
    task.map(iso<Hash>().wrap)
  )

export const compare = (string: string) =>
  flow(iso<Hash>().unwrap, hash => () => bcrypt.compare(string, hash))
