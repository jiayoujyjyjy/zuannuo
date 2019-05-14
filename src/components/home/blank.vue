<template>
  <div id="allmap" >
    <h3>地图刷新跳转</h3>
  </div>
</template>

<script>
import Routers from '@/router'
import { sessionGetStore } from '@/components/config/Utils'

export default {
  name: 'blankDiv',
  data () {
    return {
    }
  },
  mounted: function () {
    var userId = sessionGetStore('userId')
    // 无法获取到用户Id，数据异常，退回到登陆界面
    if (!userId) {
      Routers.push({ path: '/login' })
      return
    }
    Routers.push({ path: '/home/map' })
  }
}
</script>

<style scoped>
</style>
