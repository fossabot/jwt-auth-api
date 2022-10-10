import { either, record, task } from 'fp-ts'
import { apply, flow, pipe } from 'fp-ts/lib/function'
import { iso, Newtype } from 'newtype-ts'
import { compare, Hashed } from '../utils/hash'
import { ValidationError } from '../utils/validation'

export type Password = Newtype<{ readonly Password: unique symbol }, string>

export type Unverified<A> = Newtype<{ readonly Unverified: unique symbol }, A>

export const comparePassword = flow(
  iso<Unverified<Password>>().unwrap,
  iso<Password>().unwrap,
  compare
)

export const verify = (password: Unverified<Password>) =>
  flow(
    comparePassword(password),
    task.map(isValid =>
      pipe(
        iso<Unverified<Password>>().unwrap(password),
        either.fromPredicate(
          () => isValid,
          () => new ValidationError('Invalid password')
        )
      )
    )
  )

export type Subtract<A, B> = Pick<A, Exclude<keyof A, keyof B>>

export type Public<A> = {
  [K in keyof A as A[K] extends Password ? never : K]: A[K]
}

export type Private<A> = Subtract<A, Public<A>>

export type Protected<A> = Public<A> & Hashed<Private<A>>

export const protect = <R extends Record<string, unknown>>(
  hashed: Hashed<Private<R>>
) =>
  flow(record.union({ concat: x => x }), apply(hashed)) as (
    a: R
  ) => Protected<R>
