// miniprogram/pages/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bus_name: '',
    direction: true,
    lines: {},
    line: []
  },

  onReverseDirection: function() {
    let line = Object.values(this.data.lines).find((line) => {
      return (!this.data.direction) + '' === line.direction
    })
    this.setData({
      direction: !this.data.direction,
      line: line ? line.stops : []
    })
  },

  onDetail: function(e) {
    // https://developers.weixin.qq.com/miniprogram/dev/api/ui/interaction/wx.showModal.html
    const { id } = e.target
    const stop = this.data.line.find((stop) => {
      return stop.id === id
    })
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: `http://47.98.115.56:3000/search_stop?stopid=${id}&name=${this.data.bus_name}&direction=${this.data.direction + '' === true + '' ? 0 : 1}`,
      success: function (result) {
        const { data } = result
        let content = ''
        if (Array.isArray(data.cars) && data.cars.length > 0) {
          var info = data.cars[0]
          content = `${info.terminal}距${stop.zdmc},\n还有约${Math.floor(info.time / 60)}分钟`
        } else {
          content = `错过末班车了或者还未发车`     
        }
        wx.showModal({
          title: '提示',
          content,
          showCancel: false,
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      },
      fail: function (err) {
        console.log('err:', err)
      },
      complete: function () {
        wx.hideLoading({
          title: '加载中',
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var {bus_name} = options
    this.setData({ bus_name })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const self = this

    wx.showLoading({
      title: '加载中',
    })

    wx.request({
      url: `http://47.98.115.56:3000/search?name=${this.data.bus_name}`,
      success: function (data) {
        const { lineResults0, lineResults1 } = data.data
        const { direction } = self.data
        let line = []

        if (lineResults0 && lineResults0.direction == direction + '') {
          line = lineResults0.stops;
        }
        if (lineResults1 && lineResults1.direction == direction + '') {
          line = lineResults1.stops;
        }
        self.setData({
          lines: { lineResults0, lineResults1 },
          line
        })
      },
      fail: function (err) {
        wx.showModal({
          title: '提示',
          content: err,
          showCancel: false,
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
        console.log('err:', err)
      },
      complete: function () {
        wx.hideLoading({
          title: '加载中',
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})