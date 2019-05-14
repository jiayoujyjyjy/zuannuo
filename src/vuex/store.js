import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    userName: 'noUser', // home页左上部渲染用
    userId: 123,        // 用户Id,调用其他API关键参数
    Authorization: 'noAuthorization', // Bearer+''+Token值，需定时刷新，调用其他API关键参数
    deviceSNNow: 'noSN',
    deviceOnlineNow: 'noOnline',
    deviceApiKeyNow: 'noApiKey',
    deviceIdNow: 'noDeviceId',
    deviceGroupRefresh: false,
    // nodeAuthRefresh: false,
    deviceList: [],
    deviceOnlineList: [
      {sn: '', id: '', online: false}
    ]
    // deviceParam: [
    //   {sn: 'null', apiKey: 'null', deviceId: 1 }
    // ],
  },
  mutations: {
    setUserName (state, msg) {
      state.userName = msg
    },
    setUserId (state, msg) {
      state.userId = msg
    },
    setAuthorization (state, msg) {
      state.Authorization = msg
    },
    setdeviceGroupRefresh (state, msg) {
      state.deviceGroupRefresh = msg
    },
    // nodeAuthRefresh (state, msg) {
    //   state.nodeAuthRefresh = msg
    // },
    setDeviceSNNow (state, msg) {
      state.deviceSNNow = msg
    },
    setDeviceOnlineNow (state, msg) {
      state.deviceOnlineNow = msg
    },
    setDeviceApiKeyNow (state, msg) {
      state.deviceApiKeyNow = msg
    },
    setDeviceIdNow (state, msg) {
      state.deviceIdNow = msg
    },
    setDeviceList (state, msg) {
      state.deviceList = msg
    },
    settDeviceOnlieState (state, obj) {
      if (state.deviceOnlineList.length !== undefined) {
        for (let index = 0; index < state.deviceOnlineList.length; index++) {
          if (state.deviceOnlineList[index].sn === obj.sn) {
            state.deviceOnlineList[index].online = obj.online
          }
        }
      }
    }
    // setDeviceParam (state, msg) {
    //   state.deviceParam = msg
    // }
  },
  actions: {},
  modules: {}
})

export default store
