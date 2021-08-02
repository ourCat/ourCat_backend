import {Router, Request, Response} from 'express'
const router = Router()
import bcrypt from 'bcrypt'
import asyncWrap from 'utils/asyncWrap'
import jwt from 'jsonwebtoken'
import createError from 'http-errors'
import accessMiddleware from 'middlewares/access'
import userMiddleware from 'middlewares/user'
import {makeRandomCode} from 'utils/randomCode'
import codeTable from 'utils/deleteCode'

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('Asia/Seoul')

import {getUserByLoginId, signup, deactvateUser, editUserInfo, editPassword} from 'db/user'
import { FoundUser } from 'db/interface'

router.get('/', accessMiddleware, userMiddleware, (req: Request, res: Response) => {
  const user: FoundUser = req.user
  delete user.password
  res.status(200).json({user})
})

router.patch('/', accessMiddleware, asyncWrap( async (req: Request, res: Response) => {
  const {userId} : {userId : string} = req
  const {gender, introduction} : {gender: string | null, introduction: string | null} = req.body
  let {nickname} : {nickname: string | null } = req.body
  if(gender && gender !== 'M' && gender !== 'F') throw createError(400, 'Invalid gender value')
  if(nickname) nickname = nickname.trim()
  await editUserInfo(userId, {nickname, gender, introduction})
  res.status(200).json({status: 'OK'})
}))

router.put('/password', accessMiddleware, userMiddleware, asyncWrap( async (req: Request, res: Response) => {
  const { user } : {user : FoundUser}= req
  const {password, newPassword, newPasswordConfirm}: {password: string, newPassword: string, newPasswordConfirm: string} = req.body

  if(!password || !newPassword || !newPasswordConfirm) throw createError(400, 'Required Body')

  if(!await bcrypt.compare(password, user.password)) throw createError(400, 'Invalid password')
  if(password === newPassword) throw createError(400, 'Password must be New')
  if (!/^(?=.*\D)(?=.*\d)[\d\D\W]{8,20}$/.test(newPassword)) {
    throw createError(400, 'Invalid PasswordType')
  }
  
  if(newPassword !== newPasswordConfirm) throw createError(400, 'Unmatched newPassword and newPasswordConfirm')

  const hashedPassword: string = await bcrypt.hash(newPassword, 10)
  await editPassword(user._id, hashedPassword)

  res.status(200).json({status: 'OK'})
}))

router.post('/signup', asyncWrap(async (req: Request, res: Response) => {
  const { email, password, passwordConfirm, mobileNo, gender }:
  {email: string, password: string, passwordConfirm: string, mobileNo: string, gender: string} = req.body
  let { nickname }: {nickname: string} = req.body

  if(!nickname || !email || !password || !passwordConfirm || !gender ) {
    throw createError(400, 'Required Body')
  }

  nickname = nickname.trim()

  if(!(gender === 'M' || gender === 'F')) throw createError(400, 'Invalid gender value')

  if (!/^(?=.*\D)(?=.*\d)[\d\D\W]{8,20}$/.test(password)) {
    throw createError(400, 'Invalid PasswordType')
  }

  if (password !== passwordConfirm) {
    throw createError(400, 'Unmatched password and passwordConfirm')
  }

  const resisterdUser = await getUserByLoginId(email)
  if(resisterdUser) throw createError(400, 'Id Already exists')
  const hashedPassword: string = await bcrypt.hash(password, 10)
  
  const now = dayjs().toDate()
  const user = {
    loginId: email,
    nickname,
    email,
    password: hashedPassword,
    mobileNo: mobileNo ? mobileNo : undefined,
    gender,
    lastAccessedAt: now,
    createdAt: now,
    updatedAt: now
  }

  await signup(user)
  res.status(201).json({status: 'OK'})
}))

router.post('/signin', asyncWrap(async (req: Request, res: Response) => {
  const {loginId, password}: {loginId: string, password: string} = req.body
  if(!loginId || !password) throw createError(400, 'Required loginId or password')

  const foundUser = await getUserByLoginId(loginId)
  if(!foundUser) throw createError(400, 'Invalid loginId or password')

  if(!await bcrypt.compare(password, foundUser.password)) throw createError(400, 'Invalid loginId or password')

  const userToken = jwt.sign({
    userId: foundUser._id,
    iss: 'dev-Cats',
    exp: Math.floor(Date.now() / 1000) + 3600 * 24 * 30
  }, process.env.USER_TOKEN_KEY)

  res.status(200).json({userToken})
}))

router.get('/delete-Code', accessMiddleware, (req: Request, res: Response) => {
  const {userId} : {userId: string} = req
  const code: string = makeRandomCode(6)

  codeTable.set(userId, code)
  setTimeout( () => { codeTable.delete(userId)}, 300000)
  res.status(200).json({code})
})

router.post('/deactivate', accessMiddleware, asyncWrap(async (req: Request, res: Response) => {
  const {userId} : {userId: string} = req
  const {code} : {code: string} = req.query
  const {reason} : {reason: string} = req.body

  const deleteCode = codeTable.get(userId)
  if(deleteCode === code) {
    await deactvateUser(userId, reason)
    delete codeTable[userId]
  } else {
    throw createError(400, 'Invalid Code')
  }
  res.status(200).json({status: 'OK'})
}))

export default router
