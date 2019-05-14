<template>
  <!-- <div> -->
    <el-container class="mapmain">
      <div id="mapPage">
        <div id="allmap">
          <h3>地图显示</h3>
        </div>
        <div id="devicepanel">
          <div id="titleandclose">
            <span id="paneltitle">设备信息</span>
            <span style="float: right; margin: 5px; cursor: default" v-on:click="closepanel">X</span>
          </div>
            <div id="deviceinfo" style="height: 260px">
          </div>
        </div>
      </div>
    </el-container>
  <!-- </div> -->
</template>

<script>
import BMap from 'BMap'
import BMAP_ANCHOR_BOTTOM_RIGHT from 'BMAP_ANCHOR_BOTTOM_RIGHT'
import BMAP_ANCHOR_TOP_LEFT from 'BMAP_ANCHOR_TOP_LEFT'
import $ from 'jquery'
import { back } from 'api'
import { sessionGetStore, sessionSetStore } from '@/components/config/Utils'
import Routers from '@/router'
import Vue from 'vue'

export default {
  data () {
    return {
      // 参数，用于API请求
      param: {

      },
      device: [],     // 存放设备信息，并赋予title,devId,address等属性
      point: [],      // 存放标注点经纬度信息
      marker: [],     // 存放标注点对象
      map: null,
      overlapgroup: [],   // 将经纬度相同的点存放在一个组里
      pointsimplify: [],  // 存放删除了重复点的点数据
      apikey: [],         // 存放不重复的APIKEY值
      timerOnlineMap: 0,
      clickEvent: 0,      // 当前点击显示弹窗序号
      devpanelOnline: [],
      devicehtml: ''
    }
  },
  created () {
    this.param.userId = sessionGetStore('userId')
    this.param.Authorization = sessionGetStore('Authorization')
  },
  mounted () {
    // 向后台请求数据并存储
    this.backQuery()
    // 初始化先隐藏设备信息面板
    $('#devicepanel').hide()
  },
  beforeDestroy: function () {
    // 停止定时器
    window.clearInterval(this.timerOnlineMap)
  },
  methods: {
    // 向后台请求数据并存储
    backQuery: function () {
      back.userDevQue(this.param).then(function (response) {
        console.log(response)
        let k = 0
        // 遍历数组1
        for (let i = 0; i < response.data.length; i++) {
          if (response.data[i].devices === undefined) {
            continue
          }
          // 遍历数组1中的数组2
          for (let j = 0; j < response.data[i].devices.length; j++) {
            let locat = response.data[i].devices[j].location
            this.point[k] = new BMap.Point(locat.lon, locat.lat)
            let obj = {}
            obj.title = response.data[i].devices[j].name
            obj.devId = response.data[i].devices[j].deviceId
            obj.sn = response.data[i].devices[j].sn
            obj.address = ''
            obj.points = []
            obj.online = response.data[i].devices[j].online
            obj.onlineimg = response.data[i].devices[j].online ? '/static/online.png' : '/static/offline.png'
            obj.points.push(this.point[k])
            // 获取设备地理位置信息
            let geoc = new BMap.Geocoder()
            geoc.getLocation(this.point[k], function (rs) {
              var addComp = rs.addressComponents
              obj.address = addComp.province + addComp.city
            })
            this.device[k] = obj
            // 存储apikey（去重）
            this.pushApikey(response.data[i].devices[j].apiKey)
            k++
          }
        }
        // 地图初始化
        this.mapinit()
        // 将经纬度相同的点存放在一个组里
        this.countmarkers()
      }.bind(this))
    },
    // 地图初始化
    mapinit: function () {
      // 创建Map实例
      this.map = new BMap.Map('allmap')
      // 开启鼠标滚轮缩放
      this.map.enableScrollWheelZoom(true)
      // 左上角，添加比例尺
      var topleftcontrol = new BMap.ScaleControl({anchor: BMAP_ANCHOR_TOP_LEFT})
      this.map.addControl(topleftcontrol)
      // 左上角，添加默认缩放平移控件
      var topleftnavigation = new BMap.NavigationControl()
      this.map.addControl(topleftnavigation)            // 添加平移缩放控件
      // 左上角添加城市列表控件
      this.map.addControl(new BMap.CityListControl({
        anchor: BMAP_ANCHOR_TOP_LEFT,
        offset: new BMap.Size(80, 60)
      }))
      this.setCenterandZoom()
      // 添加刷新页面图标及功能
      function Refresh () {
        this.defaultAnchor = BMAP_ANCHOR_TOP_LEFT
        this.defaultOffset = new BMap.Size(90, 90)
      }
      Refresh.prototype = new BMap.Control()
      Refresh.prototype.initialize = function (map) {
        var ref = document.createElement('input')
        document.body.appendChild(ref)
        ref.type = 'image'
        ref.src = '/static/refresh.png'
        ref.style = 'height: 35px; width: 35px'
        ref.onclick = function (e) {
          Routers.push({ path: '/home/blank' })
        }
        map.getContainer().appendChild(ref)
        return ref
      }
      if (navigator.userAgent.indexOf('Chrome') !== -1) {
        var myrefresh = new Refresh()
        this.map.addControl(myrefresh)
      }
      // 设置版权标识
      var cr = new BMap.CopyrightControl({anchor: BMAP_ANCHOR_BOTTOM_RIGHT})
      this.map.addControl(cr)
      var bs = this.map.getBounds()
      // cr.addCopyright({id: 1, content: '<img src="/static/znLogo.png" height=40px width=100px/>', bounds: bs})
      cr.addCopyright({id: 1, content: '<img src="/static/znLogo.png" style="margin-right: 20px;margin-bottom: 20px;"/>', bounds: bs})
    },
    // 开启定时器，定时查询onenet信息
    queryLoop: function () {
      window.clearInterval(this.timerOnlineMap)
      // this.timerOnlineMap = window.setInterval(this.backOnlineQue, 2345)
      // 若直接轮询backQuery 则导致地图面板一卡一卡的重复刷新，我们只需要刷新在线离线状态即可，而不需刷新整个地图页
      // this.timerOnlineMap = window.setInterval(this.backQuery, 2345)
    },
    // // 后台查询设备在线状态
    // backOnlineQue: function () {
    //   back.userDevQue(this.param).then(function (response) {
    //     console.log(response)
    //     console.log(this.device)
    //     // 遍历数组1
    //     for (let i = 0; i < response.data.length; i++) {
    //       if (response.data[i].devices === undefined) continue
    //       // 遍历数组1中的数组2
    //       // 嵌套循环中的第一个循环加上[i]就相当于写死了。例如下面的response.data[i]读作'死'的
    //       for (let j = 0; j < response.data[i].devices.length; j++) {
    //         for (let k = 0; k < this.device.length; k++) {
    //           if (this.device[k].devId === response.data[i].devices[j].deviceId) {
    //             this.device[k].online = response.data[i].devices[j].online
    //             this.device[k].onlineimg = response.data[i].devices[j].online ? '/static/online.png' : '/static/offline.png'
    //           }
    //         }
    //       }
    //     }
    //   }.bind(this))
    //   this.addmarkerandInfo()
    // },
    // 向onenet请求获取设备在线状态

    // 添加标注点和信息面板，根据设备在线状况添加不同的标注点
    addmarkerandInfo: function () {
      this.map.clearOverlays()
      // 简化添加标注点和标签
      for (let i = 0; i < this.overlapgroup.length; i++) {
      // 按重叠分组的第一个点添加标注
        if (!this.overlapgroup[i][0].online) {
          var myIcon = new BMap.Icon('/static/27.png', new BMap.Size(32, 32))
          this.marker[i] = new BMap.Marker(this.overlapgroup[i][0].points[0], {icon: myIcon})
        } else {
          this.marker[i] = new BMap.Marker(this.overlapgroup[i][0].points[0])
        }
        this.map.addOverlay(this.marker[i])
        // 添加标注点重叠数量标签
        var label = new BMap.Label(this.overlapgroup[i].length, {offset: new BMap.Size(20, -10)})
        this.marker[i].setLabel(label)
        this.marker[i].addEventListener('click', function () {
          // 获取点击的标注点序号
          this.clickEvent = i
          this.devicehtml = '<div class="class2"><span class="class1" style="width:90px">编号</span><span class="class1" style="width:90px">名称</span>' +
          '<span class="class1" style="width:90px">ID</span><span class="class1" style="width:90px">状态</span><span class="class1" style="width:90px">地址</span>' +
          '<span class="class1" style="width:20px"></span></div>'
          document.getElementById('deviceinfo').innerHTML = this.devicehtml
          this.devpanelOnline = []
          for (let k = 0; k < this.overlapgroup[i].length; k++) {
            this.devpanelOnline.push(this.overlapgroup[i][k].online)
            var MyComponent = Vue.extend({
              template: '<div></br></br><div class="class2"><span class="class1" style="width:90px">' + k + '</span><span class="class1" style="width:90px">' + this.overlapgroup[i][k].title +
              '</span><span class="class1" style="width:90px">' + this.overlapgroup[i][k].devId + '</span><span class="class1" style="width:90px"><img src=' + this.overlapgroup[i][k].onlineimg + '></span>' +
              '<span class="class1" style="width:90px">' + this.overlapgroup[i][k].address + '</span><span style="width:20px;float:right;margin:5px;cursor:default" v-on:click="todevice(' + "'" + this.overlapgroup[i][k].sn + "'" + ')">>></span></div></div>',
              methods: {
                todevice: function (sn) {
                  sessionSetStore('deviceSNNow', sn)
                  Routers.push({ path: '/home/blankToDevice' })
                }
              }
            })
            var component = new MyComponent().$mount()
            document.getElementById('deviceinfo').appendChild(component.$el)
            $('#devicepanel').show()
          }
        }.bind(this))
        // 处理面板打开之后，在线离线状态刷新的问题
        if (this.devpanelOnline[0] !== undefined) {
          let num = 0
          for (let k = 0; k < this.overlapgroup[this.clickEvent].length; k++) {
            if (this.overlapgroup[this.clickEvent][k].online !== this.devpanelOnline[k]) {
              num = num + 1
              this.devpanelOnline[k] = this.overlapgroup[this.clickEvent][k].online
            }
          }
          if (num !== 0) {
            document.getElementById('deviceinfo').innerHTML = this.devicehtml
            for (let j = 0; j < this.overlapgroup[this.clickEvent].length; j++) {
              var MyComponent = Vue.extend({
                template: '<div></br></br><div class="class2"><span class="class1" style="width:90px">' + j + '</span><span class="class1" style="width:90px">' + this.overlapgroup[this.clickEvent][j].title +
                '</span><span class="class1" style="width:90px">' + this.overlapgroup[this.clickEvent][j].devId + '</span><span class="class1" style="width:90px"><img src=' + this.overlapgroup[this.clickEvent][j].onlineimg + '></span>' +
                '<span class="class1" style="width:90px">' + this.overlapgroup[this.clickEvent][j].address + '</span><span style="width:20px;float:right;margin:5px;cursor:default" v-on:click="todevice(' + "'" + this.overlapgroup[this.clickEvent][j].sn + "'" + ')">>></span></div></div>',
                methods: {
                  todevice: function (sn) {
                    sessionSetStore('deviceSNNow', sn)
                    Routers.push({ path: '/home/blankToDevice' })
                  }
                }
              })
              var component = new MyComponent().$mount()
              document.getElementById('deviceinfo').appendChild(component.$el)
            }
          }
        }
      }
    },
    // 根据原始数据计算中心坐标和缩放级别，并为地图设置中心坐标和缩放级别
    setCenterandZoom: function () {
      if (this.point.length > 0) {
        let maxLon = this.point[0].lng
        let minLon = this.point[0].lng
        let maxLat = this.point[0].lat
        let minLat = this.point[0].lat
        let res
        for (let i = 0; i < this.point.length; i++) {
          res = this.point[i]
          if (res.lng > maxLon) maxLon = res.lng
          if (res.lng < minLon) minLon = res.lng
          if (res.lat > maxLat) maxLat = res.lat
          if (res.lat < minLat) minLat = res.lat
        }
        let cenLon = (parseFloat(maxLon) + parseFloat(minLon)) / 2
        let cenLat = (parseFloat(maxLat) + parseFloat(minLat)) / 2
        let zoom = this.getZoom(maxLon, minLon, maxLat, minLat)
        // console.log(cenLon)
        // console.log(cenLat)
        // console.log(zoom)
        this.map.centerAndZoom(new BMap.Point(cenLon, cenLat), zoom)
      } else {
        this.map.centerAndZoom(new BMap.Point(103.388611, 35.563611), 5)
      }
    },
    // 根据经纬极值计算缩放级别
    getZoom: function (maxLon, minLon, maxLat, minLat) {
      let zoom = ['50', '100', '200', '500', '1000', '2000', '5000', '10000', '20000', '25000', '50000', '100000', '200000', '500000', '1000000', '2000000']
      let pointA = new BMap.Point(maxLon, maxLat)
      let pointB = new BMap.Point(minLon, minLat)
      let distance = this.map.getDistance(pointA, pointB).toFixed(1)
      for (let i = 0, zoomLen = zoom.length; i < zoomLen; i++) {
        if (zoom[i] - distance > 0) {
          return 18 - i + 3
        }
      }
      return 5
    },
    // push apikey 存储不同的APIKEY值 (去重)
    pushApikey: function (apikeyparam) {
      if (this.apikey.length === undefined || this.apikey.length === 0) {
        this.apikey.push(apikeyparam)
      } else if (this.apikey.length > 0) {
        for (let i = 0; i < this.apikey.length; i++) {
          if (apikeyparam === this.apikey[i]) {
            return
          }
        }
        this.apikey.push(apikeyparam)
      }
    },
    // 关闭设备信息面板
    closepanel: function () {
      $('#devicepanel').hide()
    },
    // 将经纬度相同的点存放在一个组里
    countmarkers: function () {
      console.log('将经纬度相同的点存放在一个组里')
      this.pointsimplify = []
      for (let i = 0; i < this.point.length; i++) {
        this.pointsimplify.push(this.point[i])
      }
      for (let i = 0; i < this.pointsimplify.length; i++) {
        let group = []
        if (this.pointsimplify[i] === undefined) {
          continue
        }
        for (let j = i; j < this.pointsimplify.length; j++) {
          if (this.pointsimplify[j] === undefined) {
            continue
          }
          if (this.pointsimplify[i].lng === this.pointsimplify[j].lng && this.pointsimplify[i].lat === this.pointsimplify[j].lat) {
            group.push(this.device[j])
            // 防止i与j相等时，删除数组中第j个数据时也删除了第i个数据，导致继续进行循环时找不到第i个数据出错
            if (i !== j) {
              delete this.pointsimplify[j]
            }
          }
        }
        this.overlapgroup.push(group)
      }
      // 添加标注点和信息面板，根据设备在线状况添加不同的标注点
      this.addmarkerandInfo()
      // 开启定时器，定时查询设备信息，并添加标注点和信息窗口
      this.queryLoop()
    }
  }
}
</script>

<style>
.mapmain {
  padding: 20px;
}
#mapPage {
  width: 100%;
  height: 100%;
}
#allmap {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  font-family: '微软雅黑';
  /* margin:0; */
  /* background: white; */
}
/* 去除百度标识 */
.anchorBL{
  display: none;
}
.map {
  padding: 0;
  margin: 0;
}
.h3 {
  padding: 0;
  margin: 0;
}
#devicepanel {
  position: absolute;
  font-size: 15px;
  top: 20px;
  right: 20px;
  color: white;
  width: 500px;
  height:400px;
  opacity: 0.75;
  background: black;
  margin: 5px;
  border-radius: 5px;
  overflow: auto;
}
.devInfo {
  float: left;
  margin: 10px;
}
#paneltitle {
  font-size: 18px;
}
#titleandclose {
  margin-top: 10px;
  margin-bottom: 10px
}
.class1 {
  float: left;
}
.class2 {
  margin-left: 5px;
  margin-top:10px;
}
</style>
