const AWS = require('aws-sdk');
const moment = require('moment');

const User = require('./models/User');
const UserService = require('./UserService');

function postProfileImage(req, res) {
  const file = req.file;
  const s3FileURL = process.env.AWS_Uploaded_File_URL_LINK;

  let s3bucket = new AWS.S3({
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_ACCESS_KEY_SECRET,
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    region: process.env.AWS_REGION
  });

  var params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: file.originalname,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'public-read'
  };

  s3bucket.upload(params, async function (err, data) {
    if (err) {
      res.json({ sucess: false });
    } else {
      req.user.image = s3FileURL + file.originalname;
      await req.user.save();
      for (var i = 0; i < req.user.contacts.length; i++) {
        User.findById(req.user.contacts[i], (err, user) => {
          if (user) UserService.updateContactsData(user, () => {});
        });
      }
      res.json({ sucess: true });
    }
  });
}

function postFile(req, res) {
  const file = req.file;
  const s3FileURL = process.env.AWS_Uploaded_File_URL_LINK;

  let s3bucket = new AWS.S3({
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_ACCESS_KEY_SECRET,
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    region: process.env.AWS_REGION
  });

  const newName = moment.utc().valueOf() + '_' + file.originalname;

  var params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: newName,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'public-read'
  };

  s3bucket.upload(params, function (err, data) {
    if (!err) {
      res.json({ fileLink: s3FileURL + newName });
    }
  });
}

module.exports = { postProfileImage, postFile };
