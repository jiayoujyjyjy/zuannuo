<template>
  <div class="historydata">
    <el-container>
     <template>
        <el-header class="secondtitle" height="39px">
          <el-tabs v-model="activeName" @tab-click="tohistorydata">
            <el-tab-pane label="数据查询" name="first"></el-tab-pane>
            <!--el-tab-pane label="图表分析" name="second"></el-tab-pane-->
          </el-tabs>
        </el-header>
        <el-container class="historydatamain">
          <router-view class="historyview"></router-view>
        </el-container>
      </template>
    </el-container>
  </div>
</template>

<script>
import Routers from '@/router'

export default {
  name: 'historyBaseDiv',
  data () {
    return {
      activeName: 'first'
    }
  },
  methods: {
    tohistorydata: function (tab) {
      if (tab.index === '0') {
        this.toHistoryInquire()
      } else if (tab.index === '1') {
        this.toHistoryCharts()
      }
    },
    toHistoryInquire: function () {
      Routers.push({ path: '/home/device/history/historyinquire' })
    },
    toHistoryCharts: function () {
      // Routers.push({ path: '/home/device/history/historycharts' })
    }
  }
}
</script>

<style scoped>
.historydata{
  overflow: hidden;
  height: 100%;
}
.el-container{
  width: 100%;
  height: 100%;
}
.historydatamain{
  bottom: 0;
  overflow: hidden;
}
.secondtitle{
  padding: 0;
}
</style>
<style>
.el-tabs__header {
  margin-left: 20px;
}
</style>
