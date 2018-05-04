const path = require('path')
const fs = require('fs')
const co = require('co')
const oss = require('ali-oss')
const postcss = require('postcss')

function getAbsolutePath(dir, relative) {
	const absolute = path.resolve(dir, relative)

	const reg = /\.(jpg|jpeg|png|gif|svg|bmp)\b/i
	if (!reg.test(absolute)) {
    console.log(`文件路径不是图片: ${absolute}`)
		return
	}

	if (!fs.existsSync(absolute) && (relative.indexOf('../') > -1)) {
		relative = relative.replace('../', '')
		absolute = path.resolve(dir, relative)
	}

	return absolute
}

module.exports = postcss.plugin('postcss-imgpost-alioss', options => {
  return function (css) {
    const client = new oss({
      accessKeyId: options.accessKeyId,
      accessKeySecret: options.accessKeySecret,
      region: options.region,
      bucket: options.bucket
    })
    css.walkRules(ruler => {
      ruler.walkDecls(/^background(-image)?$/, decl => {
        const imageReg = new RegExp('url\\(["\']?([^)]*?)["\']?\\)')
        const matchValue = imageReg.exec(decl.value)
        if (!matchValue || matchValue[1].indexOf('data:') === 0) {
          return
        }

        const relativePath = matchValue[1]
        const inputDir = path.dirname(decl.source.input.file)
        const absolutePath = getAbsolutePath(inputDir, relativePath)
        if (!absolutePath) return

        const imageData = fs.readFileSync(absolutePath)
        const urls = relativePath.split(/^\.+\//)
        let filename = options.name || ''
        const url = filename + urls[1]
        let protol = options.https ? 'https://' : 'http://'
        let cssUrl = options.domain
          ? `url('${protol + options.domain + url}')`
          : `url('${protol + options.bucket}.${options.region}.aliyuncs.com/${url}')`
        decl.value = decl.value.replace(imageReg, cssUrl)
        co(function* () {
          const result = yield client.put(url, imageData)
        }).catch(err => {
          console.log(err)
        })
      })
    })
  }
})
