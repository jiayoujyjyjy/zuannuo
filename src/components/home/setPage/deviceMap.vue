<template>
  <div class="deviceset">
    <el-container class="mapsmain">
      <el-row>
        <el-col :span="12"><div class="grid-content bg-purple">
          <el-button type="text" icon="el-icon-arrow-right"></el-button>
          <span>当前位置：{{location}}</span>
        </div></el-col>
        <el-col :span="12"><div class="grid-content bg-purple-light">
          <el-button type="primary" icon="el-icon-location" @click="locatEditInit" :disabled="!this.locModBtnShow">修改位置信息</el-button>
        </div></el-col>
      </el-row>
      <div class="devicemaps">
        <div id="deviceset">
          <h3>设备坐标图</h3>
        </div>
      </div>
    </el-container>
  </div>
</template>

<script>
import { back } from 'api'
import { sessionGetStore } from '@/components/config/Utils'
import BMap from 'BMap'
import BMAP_ANCHOR_TOP_LEFT from 'BMAP_ANCHOR_TOP_LEFT'

export default {
  name: 'deviceSetDiv',
  // VUE内部数据
  data () {
    return {
      // 参数，用于API请求
      param: {
        'sn': '',
        'userId': 1000,
        'auth': 2, // 权限
        'deviceId': '19889082', // 当前设备ID号
        'deviceName': 'noname', // 当前设备设备名
        'apiKey': 'N0HRSTOlpNNQrJ=WmsDbXXgUfzI=', // apikey值
        'location': {'lon': '120', 'lat': '30', 'ele': '100'}
      },
      locModBtnShow: true, // 修改位置信息显示标志位
      name: '',
      location: 'LocationMessage',
      map: null,
      lon: null,
      lat: null,
      centerDialogVisible: false
    }
  },
  //
  // *************生命周期****************
  //
  // 生命周期钩子--创建期
  created: function () {
    this.param.sn = sessionGetStore('deviceSNNow')
    this.param.userId = sessionGetStore('userId')
    this.param.Authorization = sessionGetStore('Authorization')
    // 获取onenet调用关键参数
    // 分组管理/设备添加/用户管理 按钮显示判断
    if (sessionGetStore('authMe') === '0') {
      this.locModBtnShow = true
    } else {
      this.locModBtnShow = false
    }
    if (sessionGetStore('userId') === sessionGetStore('userIdMe')) {
      this.locModBtnShow = true
    }
  },
  // 生命周期，安装期
  mounted: function () {
    // 地图加载
    this.loadmap()
    // 设备信息查询
    back.getNetInfo(this.param).then(function (response) {
      console.log(response)
      if (response.errno !== 0) {
        this.notificationInfo('', response.error)
        return
      }
      this.param.name = response.data.name
      this.param.location = response.data.location
      // this.location = '经度：' + JSON.parse(this.param.location).lon + ' 纬度：' + JSON.parse(this.param.location).lat + ''
      // this.lon = JSON.parse(this.param.location).lon
      // this.lat = JSON.parse(this.param.location).lat
      this.location = '经度：' + this.param.location.lon + ' 纬度：' + this.param.location.lat + ''
      this.lon = this.param.location.lon
      this.lat = this.param.location.lat
      this.map.centerAndZoom(new BMap.Point(this.lon, this.lat), 11)
      this.map.enableScrollWheelZoom(true)
      this.addmarker()
      // // 用户设备权限查询
      // this.backUserDevAuthQue()
    }.bind(this))
  },
  //
  // ****************方法函数***********************
  //
  methods: {
    // 地图加载
    loadmap: function () {
      this.map = new BMap.Map('deviceset')
      this.map.centerAndZoom(new BMap.Point(116.404, 39.915), 11)
      this.map.enableScrollWheelZoom(true)
      this.map.addEventListener('click', function (e) {
        // console.log(e.point.lng + ',' + e.point.lat)
        this.lon = e.point.lng.toFixed(3)
        this.lat = e.point.lat.toFixed(3)
        this.addmarker()
        this.location = '经度：' + this.lon + ' ' + '纬度：' + this.lat
      }.bind(this))
      this.map.addControl(new BMap.CityListControl({
        anchor: BMAP_ANCHOR_TOP_LEFT,
        offset: new BMap.Size(50, 50)
      }))
      this.map.clearOverlays()
      var marker = new BMap.Marker(new BMap.Point(this.lon, this.lat))
      this.map.addOverlay(marker)
    },
    // 向地图中添加坐标标注点
    addmarker: function () {
      this.map.clearOverlays()
      var marker = new BMap.Marker(new BMap.Point(this.lon, this.lat))
      this.map.addOverlay(marker)
    },
    // 修改位置信息
    locatEditInit: function () {
      console.log('修改设备位置信息')
      this.$confirm('此操作将修改设备位置信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let locat = {lon: this.lon, lat: this.lat, ele: '123'}
        this.param = {}
        this.param.sn = sessionGetStore('deviceSNNow')
        this.param.userId = sessionGetStore('userId')
        this.param.Authorization = sessionGetStore('Authorization')
        console.log(locat)
        this.param.location = JSON.stringify(locat)
        this.param.location = locat
        console.log(this.param.location)
        back.devMod(this.param).then(function (response) {
          // console.log(response)
          if (response.errno === 1) {
            this.notificationInfo('', response.error)
            return
          }
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
        }.bind(this))
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消修改'
        })
      })
    }
  }
}
</script>

<style scoped>
 .el-tabs__header{
    padding: 0;
    position: relative;
    margin: 0;
  }
  .el-row{
    margin-bottom: 5px;
    margin-top: 5px;
  }
  .deviceset{
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: hidden;
  }
  .mapsmain {
    width: 100%;
    height: 100%;
    display: flex;
    display: -webkit-flex; /* Safari */
    flex-direction: column;
    padding: 5px;
    bottom: 0;
  }
  .devicemaps {
    padding-top: 5px;
    width: 100%;
    height: 100%;
    bottom: 0;
  }
  #deviceset {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
    bottom: 0;
  }
  .anchorBL {
    display:none
  }
  #ptest {
    height: 50px
  }
</style>
