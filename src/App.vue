<template>
  <div id="app">
    <router-view @transferuser="getuser"></router-view>
  </div>
</template>

<script>
import { back } from 'api'
import Routers from './router'

export default {
  name: 'App',
  data () {
    return {
      param: {
        'userId': 0,
        'Authorization': ''
      }
    }
  },
  created () {
    // 定时刷新Token
    // window.setInterval(this.backRefreshToken, 3600000)
  },
  methods: {
    // 判断用户登录是否正确，通过子传父传递msg,进而跳转
    getuser (msg) {
      if (msg === 'home') {
        Routers.push({ path: '/home' })
      } else if (msg === 'login') {
        Routers.push({ path: '/login' })
      }
    },
    // 后台刷新token值
    backRefreshToken: function () {
      this.param.userId = this.$store.state.userId
      this.param.Authorization = this.$store.state.Authorization
      back.refreshToken(this.param).then(function (response) {
        if (response.errno === 0) {
          let Authorization = 'Bearer' + ' ' + response.data.token
          this.$store.commit('setAuthorization', Authorization)
        } else {
          console.log('获取token值失败 ：' + response.error)
        }
      }.bind(this)) // bind在=>函数下不可用
    }
  }
}
</script>

<style>
body, html {
  margin: 0px;
  padding: 0px;
  height: 100%;
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
  font-size: 14px;
  -webkit-font-smoothing: antialiased;
}
html {
  display: block;
  /* 高度自适应 */
  box-sizing: border-box;
  min-height: 100%;
}
#app {
  position: absolute;
  top: 0px;
  bottom: 0px;
  width: 100%;
  text-align: center;
  color: #2c3e50;
  background-color: rgb(128, 141, 163);
}
/* 额外加的，不知道师兄怎么没加这个，而只用#app的text-align就可以了 */
.el-table td {
  text-align: center;
}
.el-dialog--center .el-dialog__header {
  background-color: #409EFF;
  padding-top: 15px;
  line-height: 40px;
}
.el-dialog__title{
  color: #303133;
}
/* line-height是强加的，师兄没有这个(或许是我没找到)，但是有这个效果 */
.el-dialog--center .el-dialog__body {
  text-align: left;
  padding: 25px 27px 20px;
  line-height: 24px;
}
/* 覆盖对话框×号颜色样式 */
.el-dialog__headerbtn:hover .el-dialog__close {
  color: white!important;
}
.el-dialog__headerbtn .el-dialog__close {
  color: #333!important;
}
</style>
