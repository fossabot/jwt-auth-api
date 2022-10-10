import { Newtype } from 'newtype-ts'
import { Password } from './password'

export type Name = Newtype<{ readonly Name: unique symbol }, string>

export type Credential = {
  name: Name
  password: Password
}
