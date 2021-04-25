import {Router} from 'express'
import swagger from './swagger/swagger'
import asyncWrap from './../utils/asyncWrap'

import connect from './../utils/mongoConnect'

const router = Router()

router.get('/user', asyncWrap( async(req, res) => {
  const db = await connect()
  const users = await db.collection('Users').find({}).toArray()
  console.log('user')
  res.status(200).json({users})

}))

router.use('/api', swagger)

export = router
