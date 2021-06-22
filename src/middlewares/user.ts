import {Request, Response, NextFunction} from 'express'
import asyncWrap from 'utils/asyncWrap'
import {getUserById} from 'db/user'
import createError from 'http-errors'


const userMiddleware = asyncWrap(async (req: Request, res: Response, next: NextFunction) => {
  const {userId}: {userId: string} = req
  const user = await getUserById(userId)
  if(!user) throw createError(400, 'InvalidUserId')
  req.user = user
  next()
})

export default userMiddleware