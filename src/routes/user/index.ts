import {Router, Request, Response} from 'express'
const router = Router()
import bcrypt from 'bcrypt'
import asyncWrap from 'utils/asyncWrap'
import createError from 'http-errors'

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('Asia/Seoul')

import {getUserByLoginId, signup, getUsers } from 'db/user'

router.get('/', asyncWrap(async (req: Request, res: Response) => {
  const users = await getUsers()
  res.status(200).json({users})
}))


router.post('/signup', asyncWrap(async (req: Request, res: Response) => {
  const { email, password, passwordConfirm, mobileNo, gender }:
  {email: string, password: string, passwordConfirm: string, mobileNo: string, gender: string} = req.body
  let { nickName }: {nickName: string} = req.body

  if(!nickName || !email || !password || !passwordConfirm || !gender ) {
    throw createError(400, 'Required Body')
  }

  nickName = nickName.trim()

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
    nickName,
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

export default router