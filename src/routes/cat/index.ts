import {Router, Request, Response} from 'express'
const router = Router()
import asyncWrap from 'utils/asyncWrap'
import createError from 'http-errors'
import accessMiddleware from 'middlewares/access'
import upload from 'utils/upload'
import { createCat } from '../../db/cat'

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('Asia/Seoul')


router.post('/profile', accessMiddleware, upload.single('img'), asyncWrap( async (req: Request, res : Response) => {
  console.log(req.file)
}))

router.post('/', accessMiddleware, asyncWrap( async (req: Request, res : Response) => {
  const {name, age, location, features, color, profilePicture }:
  {name: string, age: number, location: string, features: string[], color: string, profilePicture: string} = req.body

  const now = dayjs().toDate()
  const createdAt = now
  const updatedAt = now
  await createCat({name, profilePicture, age, location, features, color, createdAt, updatedAt})
  res.status(201).json({status: 'OK'})
}))

export default router