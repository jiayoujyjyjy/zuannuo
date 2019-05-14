<template>
  <div class="device">
    <el-container>
      <el-header class="firsttitle" height="70px">
        <el-row type="flex" class="grid-four">
          <el-col :span="6" class="grid-four-col">
            <div id="title1" class="grid-content-set bg-purple-1" @click="todata">
              <div class="titlepic"><img class="titleicon" src="/static/data.png"></div>
              <div class="tiltename"><span class="grid-text bg-text-1">数据监测</span></div>
            </div>
          </el-col>
          <el-col :span="6" class="grid-four-col">
            <div id="title2" class="grid-content-set bg-purple-1" @click="toalarm">
              <div class="titlepic"><img class="titleicon" src="/static/alarm.png"></div>
              <div class="tiltename"><span class="grid-text bg-text-2">报警记录</span></div>
            </div>
          </el-col>
          <el-col :span="6" class="grid-four-col">
            <div id="title3" class="grid-content-set bg-purple-1" @click="tohistory">
              <div class="titlepic"><img class="titleicon" src="/static/history.png"></div>
              <div class="tiltename"><span class="grid-text bg-text-3">历史数据</span></div>
            </div>
          </el-col>
          <el-col :span="6" class="grid-four-col">
            <div id="title4" class="grid-content-set bg-purple-1" @click="toset">
              <div class="titlepic"><img class="titleicon" src="/static/set.png"></div>
              <div class="tiltename"><span class="grid-text bg-text-4">网关基本配置</span></div>
            </div>
          </el-col>
        </el-row>
      </el-header>

      <el-container class="devicemain">
        <div class="content">
          <div class="contentbox">
            <router-view></router-view>
          </div>
        </div>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import Routers from '@/router'
export default {
  data () {
    return {
      alarmFlag: false
    }
  },
  mounted () {
    this.tabPaneSet()
  },
  methods: {
    // 点击顶部四个按键跳转
    todata () {
      Routers.push({ path: '/home/device/data' })
      this.colorChange('#409EFF', '#F8F8FF', '#F8F8FF', '#F8F8FF')
      if (this.alarmFlag) document.getElementById('title2').style.backgroundColor = '#EE0000'
    },
    toalarm () {
      Routers.push({ path: '/home/device/alarm' })
      this.colorChange('#F8F8FF', '#409EFF', '#F8F8FF', '#F8F8FF')
      if (this.alarmFlag) document.getElementById('title2').style.backgroundColor = '#EE0000'
    },
    tohistory () {
      Routers.push({ path: '/home/device/history' })
      this.colorChange('#F8F8FF', '#F8F8FF', '#409EFF', '#F8F8FF')
      if (this.alarmFlag) document.getElementById('title2').style.backgroundColor = '#EE0000'
    },
    toset () {
      Routers.push({ path: '/home/device/set' })
      this.colorChange('#F8F8FF', '#F8F8FF', '#F8F8FF', '#409EFF')
      if (this.alarmFlag) document.getElementById('title2').style.backgroundColor = '#EE0000'
    },
    // 跳转之后修改图标颜色封装函数,之后调用传参
    colorChange (dataColor, alarmColor, historyColor, setColor) {
      document.getElementById('title1').style.backgroundColor = dataColor
      document.getElementById('title2').style.backgroundColor = alarmColor
      document.getElementById('title3').style.backgroundColor = historyColor
      document.getElementById('title4').style.backgroundColor = setColor
    },
    tabPaneSet: function () {
      // 获取当前页面的url地址
      let uri = window.location.href
      console.log(uri)
      var arrUri = uri.split('/')
      console.log(arrUri)
      if (arrUri[arrUri.length - 2] === 'data') {
        this.colorChange('#409EFF', '#F8F8FF', '#F8F8FF', '#F8F8FF')
      } else if (arrUri[arrUri.length - 2] === 'alarm') {
        this.colorChange('#F8F8FF', '#409EFF', '#F8F8FF', '#F8F8FF')
      } else if (arrUri[arrUri.length - 2] === 'history') {
        this.colorChange('#F8F8FF', '#F8F8FF', '#409EFF', '#F8F8FF')
      } else if (arrUri[arrUri.length - 2] === 'set') {
        this.colorChange('#F8F8FF', '#F8F8FF', '#F8F8FF', '#409EFF')
      }
      // if (this.alarmFlag) {
      //   document.getElementById('title2').style.backgroundColor = '#EE0000'
      // }
    }
  }
}
</script>

<style>
.device {
  display: flex;
  flex-direction: column;
  min-height: 99vh;
  overflow: hidden;
}
.firsttitle {
  /* height: 70px; */
  padding: 0;
}
.grid-four {
  height: 71px;
  background-color: #f8f8ff;
}
.grid-four-col {
  height: 71px;
  min-width: 70px;
  font-size: medium;
  cursor: pointer;
  white-space: nowrap;
}
#title1 {
  background-color: #409EFF;
}
/* #title2 {
  background-color: red;
}
#title3 {
  background-color: yellow;
}
#title4 {
  background-color: pink;
} */
.grid-content-set {
  padding: 10px;
}
.titlepic {
  height: 32px;
}
.titleicon {
  height: 28px;
  width: 28px;
}
.titlename {
  height: 17px;
  line-height: 17px;
}
.grid-text {
  height: 80px;
  font-size: 15px;
}
.devicemain {
  bottom: 0;
  background-color: #ffffff;
  /* background-color: pink; */
}
.select {
  flex: 1 0 25%;
  display: -webkit-flex;
  display: flex;
  flex-wrap: wrap;
}
.selectitem {
  flex: 1 0 25%;
  align-self: center;
}
.content {
  flex: 1 0 75%;
  width: 100%;
}
.contentbox {
  height: 100%;
}
</style>
