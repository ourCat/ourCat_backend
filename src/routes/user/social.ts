import {Router, Request, Response} from 'express'
import axios from 'axios'
const router = Router()
import asyncWrap from 'utils/asyncWrap'
import createError from 'http-errors'
import jwt from 'jsonwebtoken'

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
dayjs.extend(utc)
dayjs.extend(timezone)

import {signup, getUserByLoginId, updateLastAccessedAt} from 'db/user'


router.post('/kakao', asyncWrap( async(req: Request, res: Response) => {
  const { token } : {token: string} = req.body

  try {
    const {data} = await axios('https://kapi.kakao.com/v2/user/me', {headers: {'Authorization': `Bearer ${token}`}})
    const {gender, email} : {gender: string, email: string} = data.kakao_account
    const now = dayjs().toDate()
    const user = {
      socialId : data.id,
      nickname: data.properties.nickname,
      socialType: 'kakao',
      email: email,
      loginId : `kakao_${data.id}`,
      gender : gender === 'male' ? 'M' : 'F',
      lastAccessedAt: now,
      createdAt: now,
      updatedAt: now
    }

    
    const foundUser = await getUserByLoginId(user.loginId)
    let userToken
    if (foundUser) {
      await updateLastAccessedAt(foundUser._id)
      userToken = jwt.sign({
        userId: foundUser._id,
        iss: 'dev-Cats',
        exp: Math.floor(Date.now() / 1000) + 3600 * 24 * 30
      }, process.env.USER_TOKEN_KEY)
    } else {
      const {insertedId} : {insertedId: string} = await signup(user)
      userToken = jwt.sign({
        userId: insertedId,
        iss: 'dev-Cats',
        exp: Math.floor(Date.now() / 1000) + 3600 * 24 * 30
      }, process.env.USER_TOKEN_KEY)

    }
    res.status(200).json(userToken)
  } catch (error) {
    throw createError(401, 'Invalid Token or expired')
  }
}))

export default router