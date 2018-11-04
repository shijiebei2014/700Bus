export default function(wxRequest, options) {
  if (Object.prototype.toString.call(options) !== '[object Object]') { options = Object.create(null) }

  return new Promise((resolve, reject) => {
    options.success = (data) => { resolve(data) }
    options.fail = (err) => { reject(err) }
    wxRequest(options)
  })
}
