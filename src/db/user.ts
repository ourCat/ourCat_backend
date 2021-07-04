import connect from 'utils/mongoConnect'
import {ObjectId} from 'mongodb'
import {User, FoundUser, EditUser} from './interface'
import nullFilter from 'utils/nullFilter'

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
  return await db.collection('User').find({deactvate: {$exists: false}}, {sort: {_id: -1}, limit: 20}).toArray()
}

/**
 * userId로 user정보를 찾는 함수 (비활성화된 사용자는 제외)
 * @param userId 
 * @returns 사용자정보
 */
async function getUserById(userId: string) : Promise<FoundUser> {
  const db = await connect()
  return await db.collection('User').findOne(
    {_id: ObjectId(userId), deactivate: {$exists: false}}
  )
}

/**
 * 사용자 비활성화
 * @param userId 
 * @param reason 
 */
async function deactvateUser(userId: string, reason: string) : Promise<void> {
  const db = await connect()
  await db.collection('User').updateOne(
    {_id: ObjectId(userId)},
    {$set: {
      socialId: null,
      deactvate: {
        reason,
        deactvateAt: dayjs().toDate()
      }
    }}
  )
}

/**
 * 사용자 정보변경
 * @param userId 
 * @param editInfo 
 */
async function editUserInfo(userId: string, editInfo: EditUser) : Promise<void> {
  const {nickName, gender, introduction} = editInfo

  let $set = {nickName, gender, introduction, updatedAt: dayjs().toDate()}
  $set = nullFilter($set)
  const db = await connect()

  await db.collection('User').updateOne(
    {_id: ObjectId(userId)},
    { $set }
  )
}

/**
 * 비밀번호 변경
 * @param userId 
 * @param newPassword 
 */
async function editPassword(userId: string, newPassword: string) : Promise<void> {
  const db = await connect()
  await db.collection('User').updateOne(
    { _id: ObjectId(userId)},
    { $set: {
      password: newPassword,
      updatedAt: dayjs().toDate()
    }}
  )
}

export {
  getUserByLoginId,
  signup,
  getUsers,
  getUserById,
  deactvateUser,
  editUserInfo,
  editPassword
}
