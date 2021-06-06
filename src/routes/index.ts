import {Router, Request, Response} from 'express'
import createError from 'http-errors'
import jwt from 'jsonwebtoken'
import swagger from './swagger/swagger'
import user from './user'

const router = Router()

router.use('/user', user)
router.use('/api', swagger)

router.get('/token', (req: Request, res: Response) => {
  const { authorization } = req.headers
  if(!authorization) throw createError(401, 'Unauthorized')

  const token = authorization.split(' ')[1]

  try {
    const result = jwt.verify(token, process.env.USER_TOKEN_KEY)

    const accessToken = jwt.sign({
      userId: result.userId,
      iss: 'dev-Cats',
      exp: Math.floor(Date.now() / 1000) + 1800
    }, process.env.ACCESS_TOKEN_KEY)

    res.status(200).json({accessToken})
  } catch (error) {
    console.log(error)
    throw createError(401, 'Unauthorized')
  }
})

export = router
