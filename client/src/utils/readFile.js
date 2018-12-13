export function readFile(attachment) {
  let reader = new FileReader()
  return new Promise((resolve, reject) => {
    reader.addEventListener('load', function () {
      resolve(this.result)
    }, false)
    if (attachment) {
      return reader.readAsDataURL(attachment)
    } else {
      reject('There was a problem when converting the file')
    }
  })
}
