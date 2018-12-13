const mime = require('mime-types')
const { Storage } = require('@google-cloud/storage')

const handleAttachmentSending = (base64array) => {
  const storage = new Storage({
    projectId: 'emblica-212815'
  })
  const bucket = storage.bucket('rekrysofta')
  let attachmentLinks = []

  base64array.forEach(base64object => {
    let file = base64object.base64,
      fileName = Date.now() + base64object.fileName.replace(/ /g, ''),
      mimeType = mime.contentType(base64object.fileName),
      base64EncodedFileString = file.replace(/^data:[a-zA-Z0-9]+\/\w+;base64,/, ''),
      fileBuffer = new Buffer(base64EncodedFileString, 'base64')

    const fileToGCS = bucket.file(fileName)

    fileToGCS.save(fileBuffer, {
      metadata: { contentType: mimeType },
      public: false,
      validation: 'md5'
    }, function (error) {
      if (error) {
        console.log('Unable to upload the file')
      }
      console.log('Uploaded file to gcloud')
    })
    attachmentLinks.push(`https://storage.cloud.google.com/rekrysofta/${fileName}`)
  })
  return attachmentLinks
}

module.exports = { handleAttachmentSending }