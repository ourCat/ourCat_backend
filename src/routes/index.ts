import {Router} from 'express'
import swagger from './swagger/swagger'
import user from './user'

const router = Router()

router.use('/user', user)
router.use('/api', swagger)

export = router
