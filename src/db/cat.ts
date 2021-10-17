import connect from 'utils/mongoConnect'
import {ObjectId} from 'mongodb'
import { Cat, FoundCat } from './interface'

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('Asia/Seoul')

/**
 * 고양이 생성
 * @param cat
 */
async function createCat(cat: Cat): Promise<FoundCat> {
  const db = await connect()
  return await db.collection('Cat').insertOne(
    cat
  )
}

export { createCat }