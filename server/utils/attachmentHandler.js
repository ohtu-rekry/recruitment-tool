const { Storage } = require('@google-cloud/storage')
const Multer = require('multer')
const format = require('util').format

const handleAttachmentSending = (attachments) => {

  if (attachments === null) {
    return null
  }

  const storage = new Storage({
    projectId: 'emblica-212815'
  })
  const multer = Multer({
    storage: Multer.MemoryStorage,
    limits: {
      attachmentsize: 10 * 1024 * 1024
    },
  })

  const bucket = storage.bucket('rekrysofta')
  attachments.map(attachment => {
    console.log(attachment)
  })


  /*const blob = bucket.file(req.file.originalname)
  const blobStream = blob.createWriteStream()

  blobStream.on('error', (err) => {
    next(err)
  })

  blobStream.on('finish', () => {
    const publicUrl = format(`gs://${bucket.name}/${blob.name}`)
    res.status(200).send(publicUrl)
  })
  blobStream.end(req.file.buffer)*/
}

module.exports = { handleAttachmentSending }