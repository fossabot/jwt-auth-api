import { either, tuple } from 'fp-ts'
import { flow, pipe } from 'fp-ts/lib/function'
import { iso, Newtype } from 'newtype-ts'
import { Public, Unverified } from '../credential/password'
import { JwtConfig } from '../config/domain'
import * as jwt from 'jsonwebtoken'

export type RefreshToken = Newtype<
  { readonly RefreshToken: unique symbol },
  string
>

export type AccessToken = Newtype<
  { readonly AccessToken: unique symbol },
  string
>

export type Token = RefreshToken | AccessToken

export type TokenPair = [RefreshToken, AccessToken]

export type Payload = string | object | Buffer

export const tokenPair =
  <P extends Payload>([refresh, access]: JwtConfig) =>
  (payload: Public<P>): TokenPair =>
    pipe(
      [
        jwt.sign(payload, access, { expiresIn: '5m' }),
        jwt.sign(payload, refresh, { expiresIn: '30d' })
      ],
      tuple.bimap(iso<AccessToken>().wrap, iso<RefreshToken>().wrap)
    )

export const verify = <T extends Token>(secret: jwt.Secret) =>
  flow(iso<Unverified<T>>().unwrap, token =>
    pipe(
      either.tryCatch(
        () => jwt.verify(iso<T>().unwrap(token), secret),
        e => either.toError(e) as jwt.VerifyErrors
      ),
      either.map(() => token)
    )
  )
