<template>
  <div id="blankToDevice">
    <h3>设备界面加载中</h3>
  </div>
</template>

<script>
import Routers from '@/router'
export default {
  name: 'blankToDeviceDiv',
  data () {
    return {}
  },
  mounted () {
    // var userId = sessionGetStore('userId')
    // // 无法获取到用户id，数据异常，退回到登陆界面
    // if (!userId) {
    //   Routers.push({ path: '/login' })
    //   return // 等同于if else的写法
    // }
    // Routers.push({ path: '/home/device' })

    var userId = true
    // 无法获取到用户id，数据异常，退回到登陆界面
    if (!userId) {
      Routers.push({ path: '/login' })
    } else {
      Routers.push({ path: '/home/device' })
    }
  }
}
</script>
