import {Request, Response, NextFunction} from 'express'
import jwt from 'jsonwebtoken'
import asyncWrap from 'utils/asyncWrap'
import createError from 'http-errors'


const accessMiddleware = asyncWrap(async (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers
  if(!authorization) throw createError(403, 'Unauthorized')

  const token = authorization.split(' ')[1]

  try {
    const result = jwt.verify(token, process.env.ACCESS_TOKEN_KEY)
    req.userId = result.userId
  } catch (error) {
    console.error(error)
    throw createError(403, 'Unauthorized')
  }

  next()
})

export default accessMiddleware