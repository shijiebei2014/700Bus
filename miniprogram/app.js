//app.js
import promisify from './utils/promisify'
import { APPID, APPSECRET} from './constants/index'

const AppId = APPID
const AppSecret = APPSECRET
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }
    this.globalData = {}
  },
  getSessionKey: function () {
    var that = this
    if (this.globalData.session_key) {
      return Promise.resolve(this.globalData.session_key)
    } else {
      //调用登录接口，获取 code
      return promisify(wx.login).then((res) => {
        //发起网络请求
        const options = {
          url: 'https://api.weixin.qq.com/sns/jscode2session',
          data: {
            appid: AppId,
            secret: AppSecret,
            js_code: res.code,
            grant_type: 'authorization_code'
          },
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          method: 'GET'
        }
        return promisify(wx.request, options)
      }).then((data)=> {
        const session_key = data.data.session_key
        that.globalData.session_key = session_key
        return session_key;
      })
    }
  },
  session_key: ''
})
