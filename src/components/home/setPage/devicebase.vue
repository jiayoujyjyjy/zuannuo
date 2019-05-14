<template>
  <div class="deviceSet">
    <!-- <h2>devicebase 页面</h2> -->
    <el-container>
       <el-header class="secondtitle" height="39px">
        <template>
          <el-tabs v-model="activeName" @tab-click="toSetData">
            <el-tab-pane label="网关基本信息" name="first"></el-tab-pane>
            <!-- <el-tab-pane label="网关数据限制" name="second"></el-tab-pane> -->
            <el-tab-pane label="网关位置信息" name="second"></el-tab-pane>
            <!-- <el-tab-pane label="网关远程更新" name="fourth"></el-tab-pane> -->
            <!-- <el-tab-pane label="全局设置" :disabled="!(param.auth <= shareAdminAuth)" name="fifth"></el-tab-pane> -->
          </el-tabs>
        </template>
      </el-header>
      <el-container class="deviceInfomain">
        <router-view></router-view>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import Routers from '@/router'

export default {
  name: 'deviceSet',
  data () {
    return {
      activeName: 'first'
      // ownerAuth: 1,                   // 拥有者权限
      // shareAdminAuth: 2,              // 分享者管理员权限  写死定死的变量，用作权限比较，parm.auth是后台获取和vuex获得的
      // shareOperateAuth: 3,            // 分享者操作工权限
      // shareNoteAuth: 4,                // 分享者记录员权限
    }
  },
  created () {
    this.tabPaneSet()
  },
  methods: {
    // Tabs标签页点击跳转
    toSetData (tab, event) {
      console.log(tab, event)
      if (tab.index === '0') Routers.push({ path: '/home/device/set/deviceinfo' })
      if (tab.index === '1') Routers.push({ path: '/home/device/set/deviceMap' })
      // if (tab.index === '2') Routers.push({ path: '/home/device/set/deviceMap' })
      // if (tab.index === '3') Routers.push({ path: '/home/device/set/deviceUpdate' })
      // if (tab.index === '4') Routers.push({ path: '/home/device/alarm/alarmset' })
    },
    // Tabs标签刷新页面保存(通过url来判断)
    tabPaneSet () {
      let url = window.location.href // 保存当前页面url地址
      var arrUrl = url.split('/')
      if (arrUrl[arrUrl.length - 1] === 'deviceInfo') this.activeName = 'first'
      if (arrUrl[arrUrl.length - 1] === 'deviceMap') this.activeName = 'second'
      // if (arrUrl[arrUrl.length - 1] === 'deviceMap') this.activeName = 'third'
      // if (arrUrl[arrUrl.length - 1] === 'deviceUpdate') this.activeName = 'fourth'
      // if (arrUrl[arrUrl.length-1] === 'alarmset') this.activeName = 'fifth'
    }
  }
}
</script>

<style scoped>
.deviceSet {
  overflow: hidden;
  height: 100%;
}
.deviceInfomain {
  bottom: 0;
  overflow: hidden;
}
.el-container {
  width: 100%;
  height: 100%;
}
</style>
