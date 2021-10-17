const AWS = require('aws-sdk');

const multer = require('multer');
const multerS3 = require('multer-s3');

const path = require('path')

const { AWS_config_region, AWS_IDENTITYPOOLID } = process.env

const bucket = 'ourcats'

AWS.config.update({
  region : AWS_config_region,
  credentials : new AWS.CognitoIdentityCredentials({
    IdentityPoolId: AWS_IDENTITYPOOLID
  })
})

const s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  params: {Bucket: bucket}
})

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: bucket,
    contentType: multerS3.AUTO_CONTENT_TYPE, // 자동으로 콘텐츠 타입 세팅
    acl: 'public-read',
    key: (req, file, cb) => {
      const extension = path.extname(file.originalname)
      cb(null, Date.now().toString()+extension)
    }
  }),
  limits: { fileSize: 5 * 1024 * 1024 } // 용량 제한
})

module.exports = upload