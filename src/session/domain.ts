import { ObjectId } from 'mongodb'
import { RefreshToken } from './token'

export type Session = {
  credential: ObjectId
  refreshToken: RefreshToken
}
