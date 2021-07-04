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
  nickName: string
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
  nickName?: string | null
  gender?: string | null
  introduction? :string | null
  updatedAt? : Date
}

export {Location, User, FoundUser, EditUser}
