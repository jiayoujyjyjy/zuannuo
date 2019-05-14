<template>
  <div class="devicedata">
    <el-container class="">
      <el-header class="secondtitle" height="41px">
        <template>
          <el-tabs v-model="activeName" @tab-click="todevicedata">
            <el-tab-pane label="数据监测" name="first"></el-tab-pane>
            <!-- <el-tab-pane label="监控设置" name="second"></el-tab-pane> -->
            <el-tab-pane label="节点管理" name="second"></el-tab-pane>
          </el-tabs>
        </template>
      </el-header>
      <el-container class="devicedatamain">
        <router-view></router-view>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import Routers from '@/router'
export default {
  data () {
    return {
      activeName: 'first'
    }
  },
  computed: {},
  watch: {},
  created () {
    this.tabPaneSet()
  },
  mounted () {},
  methods: {
    // Tabs标签页点击跳转
    todevicedata (tab, event) {
      // console.log(tab, event)
      if (tab.index === '0') Routers.push({ path: '/home/device/data/watchone' })
      // if (tab.index === '1') Routers.push({ path: '/home/device/data/watchset' })
      if (tab.index === '1') Routers.push({ path: '/home/device/data/watchgroup' })
    },
    // Tabs标签刷新页面保存
    tabPaneSet () {
      let url = window.location.href // 保存当前页面url地址
      var arrUrl = url.split('/')
      if (arrUrl[arrUrl.length - 1] === 'watchone') this.activeName = 'first'
      // if (arrUrl[arrUrl.length - 1] === 'watchset') this.activeName = 'second'
      if (arrUrl[arrUrl.length - 1] === 'watchgroup') this.activeName = 'second'
    }
  }
}
</script>

<style>
.devicedata {
  overflow: hidden;
  height: 100%;
}
.el-container {
  width: 100%;
  height: 100%;
}
.devicedatamain {
  bottom: 0;
  overflow: hidden;
}
.secondtitle {
  padding: 0;
}
.el-tabs__header {
  margin-left: 20px;
}
</style>
