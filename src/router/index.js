import Vue from 'vue'
import Router from 'vue-router'
const Hello = r => require.ensure([], () => r(require('@/components/hello/HelloWorld')), 'Hello')
const Login = r => require.ensure([], () => r(require('@/components/login')), 'Login')
const Home = r => require.ensure([], () => r(require('@/components/home')), 'Home')
const Mapss = r => require.ensure([], () => r(require('@/components/home/map')), 'Mapss')
const set = r => require.ensure([], () => r(require('@/components/home/set')), 'set')
const userManaget = r => require.ensure([], () => r(require('@/components/home/userManaget')), 'userManaget')
const Blank = r => require.ensure([], () => r(require('@/components/home/blank')), 'Blank')
const BlankToDevice = r => require.ensure([], () => r(require('@/components/home/blankToDevice')), 'BlankToDevice')
const User = r => require.ensure([], () => r(require('@/components/home/user')), 'User')
const Devices = r => require.ensure([], () => r(require('@/components/home/device')), 'Devices')
const devicedatas = r => require.ensure([], () => r(require('@/components/home/datapage/devicedata')), 'devicedatas')
const devicewatchone = r => require.ensure([], () => r(require('@/components/home/dataPage/devicewatch/devicewatch-one')), 'devicewatchone')
// const devicewatchset = r => require.ensure([], () => r(require('@/components/home/dataPage/devicewatch/devicewatch-set')), 'devicewatchset')
const devicewatchgroup = r => require.ensure([], () => r(require('@/components/home/dataPage/devicewatch/devicewatch-group')), 'devicewatchgroup')
const alarmBase = r => require.ensure([], () => r(require('@/components/home/alarmPage/alarmBase')), 'alarmBase')
const alarmNow = r => require.ensure([], () => r(require('@/components/home/alarmPage/alarmNow')), 'alarmNow')
const alarmHistory = r => require.ensure([], () => r(require('@/components/home/alarmPage/alarmHistory')), 'alarmHistory')
const alarmRegister = r => require.ensure([], () => r(require('@/components/home/alarmPage/alarmRegister')), 'alarmRegister')
const alarmAuthority = r => require.ensure([], () => r(require('@/components/home/alarmPage/alarmAuthority')), 'alarmAuthority')
const alarmSet = r => require.ensure([], () => r(require('@/components/home/alarmPage/alarmSet')), 'alarmSet')
const historyBase = r => require.ensure([], () => r(require('@/components/home/historyPage/historybase')), 'historyBase')
const historyInquire = r => require.ensure([], () => r(require('@/components/home/historyPage/historyInquire')), 'historyInquire')
const deviceBase = r => require.ensure([], () => r(require('@/components/home/setPage/devicebase')), 'deviceBase')
const deviceInfo = r => require.ensure([], () => r(require('@/components/home/setPage/deviceInfo')), 'deviceInfo')
const deviceSetData = r => require.ensure([], () => r(require('@/components/home/setPage/deviceSetData')), 'deviceSetData')
const deviceMap = r => require.ensure([], () => r(require('@/components/home/setPage/deviceMap')), 'deviceMap')
const deviceUpdate = r => require.ensure([], () => r(require('@/components/home/setPage/deviceUpdate')), 'deviceUpdate')

Vue.use(Router)

export default new Router({
  routes: [
    { path: '/hello', name: 'hello', component: Hello },
    { path: '/', redirect: '/login' },
    { path: '/login', name: 'login', component: Login },
    { path: '/home',
      component: Home,
      children: [
        { path: '', redirect: 'map' },
        { path: 'map', name: 'map', component: Mapss },
        { path: 'set', name: 'set', component: set },                               // 点击分组管理按键
        { path: 'userManaget', name: 'userManaget', component: userManaget },      // 点击用户管理按键
        { path: 'blank', name: 'Blank', component: Blank },
        { path: 'blankToDevice', name: 'blankToDevice', component: BlankToDevice }, // 过渡/检查userId
        { path: 'user', name: 'user', component: User },                            // 点击头像用户名
        { path: 'device',                                                           // 主页面顶部公共模板组件
          component: Devices,
          children: [
            { path: '', redirect: 'data' },
            { path: 'data',                                                         // 数据监控部分的header公共组件
              component: devicedatas,
              children: [
                { path: '', redirect: 'watchone' },
                { path: 'watchone', component: devicewatchone },
                // { path: 'watchset', component: devicewatchset },
                { path: 'watchgroup', component: devicewatchgroup }
              ]
            },
            { path: 'alarm',
              component: alarmBase,
              children: [
                { path: '', redirect: 'alarmnow' },
                { path: 'alarmnow', name: 'alarmnow', component: alarmNow },
                { path: 'alarmhistory', name: 'alarmhistory', component: alarmHistory },
                { path: 'alarmregister', name: 'alarmregister', component: alarmRegister },
                { path: 'alarmauthority', name: 'alarmauthority', component: alarmAuthority },
                { path: 'alarmset', name: 'alarmset', component: alarmSet }
              ]
            },
            { path: 'history',
              component: historyBase,
              children: [
                { path: '', redirect: 'historyinquire' },
                { path: 'historyinquire', name: 'historyinquire', component: historyInquire }
              ]
            },
            { path: 'set',
              component: deviceBase,
              children: [
                { path: '', redirect: 'deviceinfo' },
                { path: 'deviceinfo', name: 'deviceinfo', component: deviceInfo },
                { path: 'deviceSetData', name: 'deviceSetData', component: deviceSetData },
                { path: 'deviceMap', name: 'deviceMap', component: deviceMap },
                { path: 'deviceUpdate', name: 'deviceUpdate', component: deviceUpdate }
              ]
            }
          ]
        }
      ]
    }
  ]
})
