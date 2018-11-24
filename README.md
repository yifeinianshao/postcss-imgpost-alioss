## Usage
> 下载
```bash
npm i postcss-imgpost-alioss -D 或 yarn add postcss-imgpost-alioss --dev
```
> 使用方法和postcss插件一样

> 配置
```javascript
const options = {
    // required
    accessKeyId: 'your ali accessKeyId',
    accessKeySecret: 'your ali accessKeySecret',
    region: 'your ali region',
    bucket: 'your ali bucket',
    // not required
    https: true,
    domain: 'your hostname', // eg: 'hostname.com/'
    name: 'your filename' // eg: 'filename/'
}
```
