import {Router} from 'express'
import swagger from './swagger/swagger'

const router = Router()

router.use('/', swagger)

export = router
