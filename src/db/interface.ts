import {ObjectId} from 'mongodb'

interface Location {
  country: string
  region: string
  street: string
  zip: string
}

interface User {
  socialType?: string
  socialId?: string
  loginId: string
  password?: string
  mobileNo?: string
  email: string
  gender: string
  nickname: string
  location?: Location
  introduction?: string
  lastAccessedAt: Date
  createdAt: Date
  updatedAt: Date
}


interface FoundUser extends User {
  _id: string
}

interface EditUser {
  nickname?: string | null
  gender?: string | null
  introduction? :string | null
  updatedAt? : Date
}

interface signUpResult {
  insertedCount: number //The total amount of documents inserted.
  insertedId: ObjectId //The driver generated ObjectId for the insert operation.
  result: { //The raw command result object returned from MongoDB (content might vary by server version).
    ok: number //Is 1 if the command executed correctly.
    n: number //The total count of documents inserted.
  } 
}

export {Location, User, FoundUser, EditUser, signUpResult}
