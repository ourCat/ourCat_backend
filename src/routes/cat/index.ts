import {Router, Request, Response} from 'express'
const router = Router()
import asyncWrap from 'utils/asyncWrap'
import accessMiddleware from 'middlewares/access'
import upload from 'utils/upload'

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('Asia/Seoul')


router.post('/profile', accessMiddleware, upload.single('img'), asyncWrap( async (req: Request, res : Response) => {
  console.log(req.file)
  res.json({url: req.file.location})
}))

export default router