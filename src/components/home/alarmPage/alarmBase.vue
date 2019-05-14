<template>
  <div class="alarmInfo">
    <el-container>
      <el-header class="secondtitle" height="39px">
        <template>
          <el-tabs v-model="activeName" @tab-click="toAlarmData">
            <el-tab-pane label="当前报警" name="first"></el-tab-pane>
            <el-tab-pane label="历史报警" name="second"></el-tab-pane>
            <el-tab-pane label="报警值设置" name="third"></el-tab-pane>
            <el-tab-pane label="报警联系人设置" name="fourth"></el-tab-pane>
            <!-- <el-tab-pane label="全局设置" name="fifth"></el-tab-pane> -->
          </el-tabs>
        </template>
      </el-header>
      <el-container class="alarmInfomain">
        <router-view></router-view>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import Routers from '@/router'

export default {
  name: 'alarmInfoDiv',
  data () {
    return {
      activeName: 'first'
    }
  },
  created () {
    this.tabPaneSet()
  },
  methods: {
    // Tabs标签页点击跳转
    toAlarmData (tab, event) {
      console.log(tab, event)
      if (tab.index === '0') Routers.push({ path: '/home/device/alarm/alarmnow' })
      if (tab.index === '1') Routers.push({ path: '/home/device/alarm/alarmhistory' })
      if (tab.index === '2') Routers.push({ path: '/home/device/alarm/alarmregister' })
      if (tab.index === '3') Routers.push({ path: '/home/device/alarm/alarmauthority' })
      // if (tab.index === '4') Routers.push({ path: '/home/device/alarm/alarmset' })
    },
    // Tabs标签刷新页面保存(通过url来判断)
    tabPaneSet () {
      let url = window.location.href // 保存当前页面url地址
      var arrUrl = url.split('/')
      if (arrUrl[arrUrl.length - 1] === 'alarmnow') this.activeName = 'first'
      if (arrUrl[arrUrl.length - 1] === 'alarmhistory') this.activeName = 'second'
      if (arrUrl[arrUrl.length - 1] === 'alarmregister') this.activeName = 'third'
      if (arrUrl[arrUrl.length - 1] === 'alarmauthority') this.activeName = 'fourth'
      // if (arrUrl[arrUrl.length - 1] === 'alarmset') this.activeName = 'fifth'
    }
  }
}
</script>

<style>
.alarmInfo{
  overflow: hidden;
  height: 100%;
}
.el-container{
  width: 100%;
  height: 100%;
}
.alarmInfomain{
  bottom: 0;
  overflow: hidden;
}
.secondtitle{
  padding: 0;
}
.el-tabs__header{
  margin-left: 20px;
}
</style>
