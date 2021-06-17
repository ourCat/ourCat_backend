import connect from 'utils/mongoConnect'
import {ObjectId} from 'mongodb'
import {User, FoundUser} from './interface'

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('Asia/Seoul')

/**
 * loginId로 user를 찾아 리턴하는 함수
 * @param loginId 
 * @returns User object
 */
async function getUserByLoginId(loginId : string): Promise<FoundUser> {
  const db = await connect()
  return await db.collection('User').findOne(
    {
      loginId,
      deactvate: {$exists: false}
    }
  )
}

/**
 * 회원가입 함수
 * @param user 
 */
async function signup(user: User): Promise<void> {
  const db = await connect()
  await db.collection('User').insertOne(
    user
  )
}

/**
 * 최신 가입한 사용자 20개 정보를 불러오는 임시 함수
 * @returns 사용자 목록
 */
async function getUsers() : Promise<Array<FoundUser>> {
  const db = await connect()
  return await db.collection('User').find({}, {sort: {_id: -1}, limit: 20}).toArray()
}

export { getUserByLoginId, signup, getUsers }