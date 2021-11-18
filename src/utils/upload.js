const AWS = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3')

const path = require('path')

const bucket = 'ourcats'

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESSKEY,
  secretAccessKey: process.env.AWS_SECRETKEY,
  region: process.env.AWS_config_region
})

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: bucket,
    contentType: multerS3.AUTO_CONTENT_TYPE, // 자동으로 콘텐츠 타입 세팅
    acl: 'public-read',
    metadata: (req, file, cb) => {
      cb(null, {filedName: file.fieldname})
    },
    key: (req, file, cb) => {
      const extension = path.extname(file.originalname)
      cb(null, Date.now().toString()+extension)
    }
  }),
  limits: { fileSize: 5 * 1024 * 1024 } // 용량 제한
})

module.exports = upload