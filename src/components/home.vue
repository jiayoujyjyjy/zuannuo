<template>
  <div class="home">
    <el-container style="boder: 1px solid #eee">
      <!-- 侧边栏 -->
      <el-aside id="aside" width="260px">

        <!-- 用户部分 -->
        <el-row>
          <!-- 左边头像 -->
          <el-col :span="6" class="userleft" ref="userleftRef" :style="{paddingTop: xx + 'px'}">
            <div class="userpic">
              <img src="/static/user.png" class="usericon" v-on:click="touserBt">
            </div>
          </el-col>
          <!-- 右边信息、注销 -->
          <el-col :span="18" class="userright">
            <div class="grid-content bg-aside-user" ref="bgAsideUserRef" :style="{height: yy + 'px'}">
              <div class="userup"><el-button type="text" class="log-aside-user">用户名：{{userName}}</el-button></div>
              <div class="usermiddle" v-show="userManagementShow"><el-button type="text" class="log-aside-middle">观察对象：{{observeUser}}</el-button></div>
              <div class="userdown"><el-button type="text" icon="el-icon-circle-close" class="log-aside-out" @click="tologinBt">退出</el-button></div>
            </div>
          </el-col>
        </el-row>

        <!-- 快捷键操作部分 -->
        <el-row class="grid-select">
          <el-col :span="24">
            <div class="grid-content bg-aside-select">
              <el-button-group>
                <el-tooltip content="分组管理" placement="bottom" effect="light">
                  <el-button class="fouricons" type="primary" icon="el-icon-tickets" @click="tosetBt" :disabled="!this.groupSetShow"></el-button>
                </el-tooltip>
                <el-tooltip content="添加网关" placement="bottom" effect="light">
                  <el-button class="fouricons" type="primary" icon="el-icon-circle-plus-outline" @click="adddeviceformBt" :disabled="!this.devAddShow"></el-button>
                </el-tooltip>
                <el-tooltip content="用户管理" placement="bottom" effect="light">
                  <el-button class="fouricons" type="primary" icon="el-icon-user" @click="toUserManBt" :disabled="!this.userManagementShow"></el-button>
                </el-tooltip>
                <el-tooltip content="地图显示" placement="bottom" effect="light">
                  <el-button class="fouricons" type="primary" icon="el-icon-location-outline" @click="tomapBt"></el-button>
                </el-tooltip>
              </el-button-group>
            </div>
          </el-col>
        </el-row>
        <!-- 设备组部分 -->
        <el-row>
          <el-col :span="24">
            <div class="grid-content bg-aside-list">
              <!-- 搜索 -->
              <el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
              <!-- 具体设备组 -->
              <el-tree
              class="filter-tree"
              :data="deviceList"
              :props="defaultProps"
              :filter-node-method="filterNode"
              ref="devListTree"
              :render-content="renderContent"
              @node-click="todeviceBt">
              </el-tree>
            </div>
          </el-col>
        </el-row>
      </el-aside>

      <!-- 主窗体部分 -->
      <el-container id="container">
        <router-view class="main"></router-view>
      </el-container>

    </el-container>

    <!-- 添加设备(网关) 弹出对话框 -->
    <el-dialog class="addGateway" title="添加网关" :visible.sync="addDevDialogFormVisible" width="700px" top="50px" center>
      <el-form :model="form">
        <div class="item_addGateway">
          <el-form-item class="addGateway_formItem" label="网关SN" :label-width="formLabelWidth">
            <el-input v-model="form.sn" placeholder="输入网关SN"></el-input>
          </el-form-item>
          <el-form-item class="addGateway_formItem" label="网关密码" :label-width="formLabelWidth">
            <el-input v-model="form.password" placeholder="输入网关密码"></el-input>
          </el-form-item>
        </div>
        <div class="item_addGateway">
          <el-form-item class="addGateway_formItem" label="网关名称" :label-width="formLabelWidth">
            <el-input v-model="form.name" placeholder="输入网关名称"></el-input>
          </el-form-item>
          <el-form-item class="addGateway_formItem" label="网关组选择" :label-width="formLabelWidth">
            <el-select v-model="tableDataGroupSelected" placeholder="网关组">
              <el-option v-for="item in tableDataGroup" :key="item.id" :label="item.name" :value="item.groupUid"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="item_addGateway">
          <el-form-item class="addGateway_formItem" label="经度" :label-width="formLabelWidth">
            <el-input v-model="form.location.lon" :disabled="true" placeholder="经度"></el-input>
          </el-form-item>
          <el-form-item class="addGateway_formItem" label="纬度" :label-width="formLabelWidth">
            <el-input v-model="form.location.lat" :disabled="true" placeholder="纬度"></el-input>
          </el-form-item>
        </div>
        <div class="item_addGateway">
          <el-form-item class="addGateway_formItem" label="省份" :label-width="formLabelWidth">
            <el-input v-model="form.province" placeholder="省份"></el-input>
          </el-form-item>
          <el-form-item class="addGateway_formItem" label="城市" :label-width="formLabelWidth">
            <el-input v-model="form.city" placeholder="城市"></el-input>
          </el-form-item>
        </div>
        <div class="item_addGateway">
          <el-form-item class="addGateway_formItem" style="textAlign:center;">
            <!-- <span style="font-size:12px;color:red;">（选取点后，经度、纬度、省份、城市会被自动添上）</span> -->
            <el-button-group>
              <!-- 1、地图上选点(chose) 2、关键词搜索(search) -->
              <el-button size="small" :type="pointChoseType=='chose'?'primary':'info'" @click="mapselectpoint">地图上选点</el-button>
              <el-button size="small" :type="pointChoseType=='search'?'primary':'info'" @click="mapkeyword">关键词搜索</el-button>
            </el-button-group>
          </el-form-item>
          <el-form-item class="addGateway_formItem" v-show="pointChoseType == 'search'" label="地点" :label-width="formLabelWidth">
            <el-input v-model="form.locationKeyWord" placeholder="请输入要搜索的地点">
              <el-button slot="append" icon="el-icon-search" @click="mapKeyWord"></el-button>
            </el-input>
          </el-form-item>
        </div>
        <div class="item_addGateway">
          <!-- 地图 -->
          <div id="addwgmap" style="width:90%;height:250px;margin-left:5%;"></div>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDevDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="deviceaddBt">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 浏览器缩放，若窗口宽度过小，首先隐藏左侧设备列表，通过此div实现控制再显示和再隐藏控制 -->
    <div id="listbutton" @click="asideVisibleBt" v-show="listbuttonVisible">
      <img src="/static/listbutton.png" style="width:25px;height:25px;margin-top:6px;">
    </div>
  </div>
</template>

<script>
import BMap from 'BMap'
// import BMAP_STATUS_SUCCESS from 'BMAP_STATUS_SUCCESS'
import Routers from '../router'
import { back, onenet } from 'api'
import { sessionGetStore, sessionSetStore, sessionRemoveStore } from '@/components/config/Utils'

export default {
  data () {
    return {
      param: {
        'Authorization': '',
        'userId': 1000,
        'sn': '',
        'password': '',
        'name': '',
        'groupUid': '',
        'location': {'lat': 120.377841, 'lon': 30.3099, 'ele': 3},
        // 设备所在省份
        province: '',
        // 设备所在城市
        city: ''      
      },
      observeUser: '',                                  // 所观察对象
      filterText: '',                                   // 设备过滤
      addDevDialogFormVisible: false,                   // 添加设备对话框
      groupSetShow: true,                              // 是否显示分组管理按钮 auth: 0,1,2-true;3-false
      devAddShow: true,                             // 是否显示添加设备按钮 auth: 0,1,2-true;3-false
      userManagementShow: true,                               // 是否显示用户管理按钮 auth: 0,1,2-true;3-false
      xx: 20,
      yy: 67.5,
      formLabelWidth: '100px',
      deviceList: [
      //   { id: 1,
      //   label: 'Default',
      //   // online: '',
      //   // alarm: '',
      //   children: [{
      //     id: 9,
      //     label: '网关1',
      //     apiKey: '',
      //     sn: '',
      //     location: '',
      //     online: '在线',
      //     alarm: '',
      //     auth: ''
      //   }
      // }, {
      //   id: 2,
      //   label: '设备分组二',
      //   online: '',
      //   alarm: '',
      //   children: [{
      //     id: 5,
      //     label: '网关8',
      //     apiKey: '',
      //     sn: '',
      //     location: '',
      //     online: '离线',
      //     alarm: '报警',
      //     auth: ''
      //   }]
      // }
      ],
      // 树形组件设备显示
      defaultProps: {
        children: 'children',
        label: 'label',
        online: 'online'
      },
      timerOnline: 0,                  // 定时器，定时查询数据和在线状态
      timerWindowWidth: 0,             // 定时器，定时查询窗体宽度
      apiKeyGroup: [],                 // 存储所有不同网关设备的apikey
      // 存储设备表单信息
      form: {
        index: 0,
        sn: '',
        password: '',
        name: '',
        groupUid: '',
        // 设备坐标
        location: {
          'lat': '',
          'lon': '',
          'ele': ''
        },
        // 设备所在省份
        province: '',
        // 设备所在城市
        city: '',
        // 地点关键词
        locationKeyWord: ''
      },
      tableDataGroupSelected: '',                           // 选中分组ID
      // 存储分组信息
      tableDataGroup: [{                                    // 一个字打错复制粘贴都不可以，...至今找不到哪里打错了
        id: '选项1',                                        // 为了设置默认显示而存在的
        name: 'Default',
        groupUid: ''
      }, {
        id: '选项2',
        name: '设备分组二',
        groupUid: ''
      }],
      Authorization: 4,
      listbuttonVisible: false, // 控制左侧设备列表显示或隐藏
      windowWidth: 0,       // 窗体宽度
      aside: '',            // 左侧设备列表对象
      listbtn: '',          // 控制左侧列表显示或隐藏的按钮对象
      marker: 0,            // 标识，当窗体宽度从大于设定宽度缩小到小于设定宽度，默认隐藏左侧列表，按钮操作后不再默认隐藏，根据按钮操作进行变化
      map: null,             // 地图实例
      pointChoseType: 'chose', // 哪种选点方式---1、地图上选点(chose) 2、关键词搜索(search)
      keyWordObj: null         // 关键词检索变量
    }
  },
  computed: {
    // 左上角用户名渲染前computed 
    userName () {                                       // computed的proterty不能与data定义的变量重名
      var userName = sessionGetStore('nameMe')          // 前期测试通过浏览器缓存数据，后期只需浏览器存userId调用用户信息API
      this.$store.commit('setUserName', userName)
      return this.$store.state.userName
    },
    // 设备列表刷新-监控1（groupRefresh是单独命名的一个变量，与dom无关）
    groupRefresh () {
      return this.$store.state.deviceGroupRefresh
    }
  },
  watch: {
    // 设备过滤
    filterText (val) {
      this.$refs.devListTree.filter(val)
    },
    // 设备列表刷新-监控2 + 观察者对象名刷新
    groupRefresh: function (val) {
      if (val) {
        console.log('设备列表刷新refresh + observeUserRefresh')
        this.observeUser = sessionGetStore('name')
        this.param.userId = sessionGetStore('userId')
        // 分组管理/设备添加/用户管理 按钮显示判断
        if (sessionGetStore('userId') === sessionGetStore('userIdMe')) {
          // 若userId = userIdMe则代表回到自己，可以对自己的网关/节点进行任何操作
          this.groupSetShow = true
          this.devAddShow = true
        } else {
          this.groupSetShow = false
          this.devAddShow = false
        }
        // 用户下设备信息获取
        this.backDevInfoGet()
        // 全局节点列表刷新标志位置false，已刷新
        this.$store.commit('setdeviceGroupRefresh', false)
      }
    }
  },
  created () {
    var userId = sessionGetStore('userId')
    // 无法获取到用户Id，数据异常，退回到登陆界面
    if (!userId) {
      this.notificationInfo('提示', '用户数据过期，拿不到userId,请重新登陆')
      // this.$emit('transferuser', 'login')
      Routers.push({ path: '/login' })
      return
    }
    console.log(userId)
    this.param.userId = userId
    this.$store.commit('setUserId', userId)
    // 全局节点列表刷新标志位置false，已刷新
    // this.$store.commit('setdeviceGroupRefresh', false)
    // 分组管理/设备添加/用户管理 按钮显示判断
    if (sessionGetStore('authMe') === '3') {
      this.userManagementShow = false
      this.xx = 10
      this.yy = 45
    }
    if (sessionGetStore('authMe') === '0') {
      this.groupSetShow = true
      this.devAddShow = true
      this.userManagementShow = true
    } 
  },
  mounted () {
    this.observeUser = sessionGetStore('name')
    this.param.userId = sessionGetStore('userId')           // 避免刷新页面导致数据丢失，所以不用vuex而用localstore
    this.deviceList = sessionGetStore('deviceList')         // 存储设备list
    this.param.Authorization = sessionGetStore('Authorization') // 避免刷新页面导致数据丢失，所以不用vuex而用localstore
    // 获取用户信息

    // 获取用户下网关列表信息
    this.backDevInfoGet()
    // 开启定时器，定时查询onenet平台的监控点数据和在线离线信息；
    // * 定时查询浏览器窗口宽度，判断是否显示隐藏左侧设备的按钮
    this.queryLoop()
    // 初始化获取aside，listbtn对象
    this.aside = document.getElementById('aside')
    this.listbtn = document.getElementById('listbutton') // 若'listbutton' div写在对话框内，则取不到该dom，设计nextTick
  },
  // 生命周期，销毁前
  beforeDestroy: function () {
    // 停止定时器
    window.clearInterval(this.timerOnline)
    window.clearInterval(this.timerWindowWidth)
    console.log('leave one')
  },
  methods: {
    // 地图初始化
    mapinit () {
      // 创建地图实例
      this.map = new BMap.Map('addwgmap')
      // 设置中心点和缩放比例
      // this.map.centerAndZoom(new BMap.Point(116.404, 39.915), 11)
      this.map.centerAndZoom('上海', 11)

      // var geolocation = new BMap.Geolocation() // 返回用户当前的位置
      // // 浏览器定位
      // geolocation.getCurrentPosition(function (r) {
      //   if (this.getStatus() === BMAP_STATUS_SUCCESS) {
      //     var mk = new BMap.Marker(r.point)
      //     this.map.addOverlay(mk)
      //     this.map.panTo(r.point)
      //     console.log('您的位置：' + r.point.lng + ',' + r.point.lat)
      //   } else {
      //     console.log('failed' + this.getStatus())
      //   }        
      // }, {enableHighAccuracy: true})
      
      // 开启鼠标滚轮缩放
      this.map.enableScrollWheelZoom(true)
    },
    // 选择-地图上选点
    mapselectpoint () {
      // 修改选点方式
      this.pointChoseType = 'chose' // 1、地图上选点(chose) 2、关键词搜索(search)
      // 清除地图
      this.map = null
      // 清除 地点关键词
      this.form.locationKeyWord = '' // 地点关键词
      // 设置地图
      this.$nextTick(function () {
        // 百度地图是必须让它在页面加载完成后显示（生命周期mounted），但是由于element的对话框（el-dialog）是基于v-if这个功能。所以，应该在dom加载完后再初始化地图
        // 地图初始化
        this.mapinit()
        // 添加点击地图监听事件---点击地图后添加标注点
        this.map.addEventListener('click', function (e) {
          // console.log(e)
          // 清除标注点
          this.map.clearOverlays()
          // 添加标注点
          var point = new BMap.Point(e.point.lng, e.point.lat) // 创建点
          var marker = new BMap.Marker(point)  // 创建标注
          this.map.addOverlay(marker) // 将标注添加到地图中
          // 修改form表单内容
          // 设备坐标
          this.form.location = {
            'lat': e.point.lat,
            'lon': e.point.lng
          }
          var geoc = new BMap.Geocoder() // 用于获取用户的地址解析
          // 地址解析
          geoc.getLocation(e.point, function (rs) {
            var addComp = rs.addressComponents
            // 设备所在省份
            this.form.province = addComp.province
            // 设备所在城市
            this.form.city = addComp.city
          }.bind(this))
        }.bind(this))
      }.bind(this))
    },
    // 选择-关键词搜索
    mapkeyword () {
      // 修改选点方式
      this.pointChoseType = 'search' // 1、地图上选点(chose) 2、关键词搜索(search)
      // 清除地图
      this.map = null
      // 清除 地点关键词
      this.form.locationKeyWord = '' // 地点关键词
      // 设置地图
      this.$nextTick(function () {
        // 百度地图是必须让它在页面加载完成后显示（生命周期mounted），但是由于element的对话框（el-dialog）是基于v-if这个功能。所以，应该在dom加载完后再初始化地图
        // 地图初始化
        this.mapinit()
        var _this = this
        // 关键词检索
        var gjcOptions = {
          // 结果呈现设置
          renderOptions: {map: this.map},
          // // 标注添加完成后的回调函数
          // onMarkersSet: function () {
          //   console.log('onMarkersSet')
          // },
          // 标注气泡内容创建后的回调函数---点击不同气泡会触发
          onInfoHtmlSet: function (res) {
            console.log(res)
            // 修改form表单内容
            // 设备坐标
            _this.form.location = {
              'lat': res.point.lat,
              'lon': res.point.lng
            }
            // 设备所在省份
            _this.form.province = res.province
            // 设备所在城市
            _this.form.city = res.city
          }
          // // 结果列表添加完成后的回调函数
          // onResultsHtmlSet: function () {
          //   console.log('onResultsHtmlSet')
          // },
          // // 检索完成后的回调函数
          // onSearchComplete: function (results) {
          //   console.log(results)
          // }
        }
        this.keyWordObj = new BMap.LocalSearch(this.map, gjcOptions) // 用于位置检索、周边检索和范围检索。
        // this.keyWordObj.search("景点")
      }.bind(this))
    },
    // 点击地点的搜索---关键词检索
    mapKeyWord () {
      this.keyWordObj.search(this.form.locationKeyWord)
    },
    // el-tree重新渲染，加入每行的在线离线数据显示
    renderContent (h, { node, data, store }) {
      // console.log(node)
      return (
        <span class={node.data.sn} style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
          <span>
            <span>{node.label}</span>
          </span>
          <span>
            <el-button style="font-size: 12px; color: #ff0000;" type="text" >{node.data.alarm}</el-button>
            <el-button style="font-size: 12px;" type="text" >{node.data.online}</el-button>
          </span>
        </span>
      )
    },
    // el-tree设备树过滤
    filterNode (value, data) {
      if (!value) return true
      if (data.label === undefined) return false
      return data.label.indexOf(value) !== -1
    },
    // 加载设备监控页面(点击网关)
    todeviceBt (data) {
      console.log('点击分组')
      console.log(data)
      if (data.children === undefined) { // 点击子节点网关，若没有children则跳转到blankToDevice，以此来阻止点击小组的跳转
        this.$nextTick(() => {           // {}外的程序先执行
          console.log('点击分组下网关')
          let treeBox = document.getElementsByClassName('el-tree-node')
          for (let index = 0; index < treeBox.length; index++) {
            treeBox[index].style.backgroundColor = ''
          }
          let treeSelBox = document.getElementsByClassName('el-tree-node is-current')
          treeSelBox[0].style.backgroundColor = '#D9D9D9' // 选择之后的颜色，客户端交互
        })
        this.$store.commit('setDeviceSNNow', data.sn)
        this.$store.commit('setDeviceApiKeyNow', data.apiKey)
        this.$store.commit('setDeviceIdNow', data.id)
        this.$store.commit('setDeviceOnlineNow', data.online)
        sessionSetStore('deviceSNNow', data.sn)
        sessionSetStore('deviceOnlineNow', data.online)
        sessionSetStore('apikeyNow', data.apiKey)
        sessionSetStore('deviceIdNow', data.id)
        console.log('网关sn ：' + data.sn)
        console.log(this.$store.state.deviceApiKeyNow)
        Routers.push({ path: '/home/blankToDevice' }) // 相当于加了一个跳转页面的限制条件，在if下才会跳转，否则则会点击小组名就会触发跳转，导致el-tree自带事件被影响，不能够展开
      }
    },
    /*
    ****************用户操作触发方法*****************
    */
    // 返回登录页面
    tologinBt: function () {
      console.log('退出')
      // 浏览器本地存储（避免用户刷新页面数据丢失）
      sessionRemoveStore('name')
      sessionRemoveStore('nameMe')
      sessionRemoveStore('account')
      sessionRemoveStore('password')
      sessionRemoveStore('userId')
      sessionRemoveStore('userIdMe')
      sessionRemoveStore('auth')
      sessionRemoveStore('authMe')
      sessionRemoveStore('Authorization')
      // 这里跳转页面的方法此组件的父组件App.vue中，通过触发自定义函数transferuser，将参数('login'，要跳转的页面)传给App.vue
      this.$emit('transferuser', 'login')
    },
    // 添加设备初始化（打开对话框）
    adddeviceformBt () {
      if (!this.devAddShow) {
        // this.notificationInfo('错误提示', '您没有此权限，请联系管理员')
        return
      }
      console.log('添加设备')
      console.log(this.tableDataGroup)
      this.form.sn = ''
      this.form.password = ''
      this.form.name = ''
      // 设备坐标
      this.form.location = {
        'lat': '',
        'lon': '',
        'ele': ''
      }
      this.form.province = '' // 设备所在省份
      this.form.city = '' // 设备所在城市
      this.form.locationKeyWord = '' // 地点关键词
      this.form.pointChoseType = 'chose' // 哪种选点方式
      this.form.keyWordObj = null // 关键词检索变量
      if (this.tableDataGroup.length === 0) {
        this.notificationInfo('错误提示', '请先添加分组')
      } else {
        console.log(this.tableDataGroup)
        this.tableDataGroupSelected = this.tableDataGroup[0].groupUid // 默认选择分组为分组ID第一个
        this.addDevDialogFormVisible = true
        // 地图初始化---默认 地图上选点(chose)
        this.mapselectpoint()      
      }
    },
    // 加载分组设置界面
    tosetBt () {
      if (!this.groupSetShow) {
        // this.notificationInfo('错误提示', '您没有此权限，请联系管理员')
        return
      }
      Routers.push({ path: '/home/set' })
    },
    // 加载用户管理界面
    toUserManBt () {
      if (!this.userManagementShow) {
        // this.notificationInfo('错误提示', '您没有此权限，请联系管理员')
        return
      }
      Routers.push({ path: '/home/userManaget' })
    },
    // 加载用户设置界面
    touserBt: function () {
      if (sessionGetStore('userId') !== sessionGetStore('userIdMe')) {
        // 当前用户id !== 登录者用户id
        return
      }
      Routers.push({ path: '/home/user' })
    },
    // 加载地图组件
    tomapBt () {
      Routers.push({ path: '/home/map' })
    },
    // 添加设备(网关)对话框确认按键
    deviceaddBt () {
      if (this.form.name === '' || this.form.sn === '' || this.form.password === '') {
        this.notificationInfo('错误提示', '参数不能为空')
        return
      }
      if (this.checkDevName(this.form.name)) {
        this.notificationInfo('错误提示', '设备名称不能重复')
        return
      }
      this.param.password = this.form.password
      this.param.sn = this.form.sn
      this.param.name = this.form.name
      // this.param.location = this.form.location
      this.param.groupUid = this.tableDataGroupSelected
      this.param.location = this.form.location
      this.param.province = this.form.province
      this.param.city = this.form.city
      // 添加设备
      this.backDeveiceAdd()
      this.addDevDialogFormVisible = false
    },
    // 检查设备名称是否重复
    checkDevName: function (devName) {
      let checkFlag = false
      for (let groupIndex = 0; groupIndex < this.deviceList.length; groupIndex++) {
        if (this.deviceList[groupIndex].children !== undefined) {
          for (let deviceIndex = 0; deviceIndex < this.deviceList[groupIndex].children.length; deviceIndex++) {
            if (this.deviceList[groupIndex].children[deviceIndex].label === devName) {
              checkFlag = true
              return checkFlag
            }
          }
        }
      }
      return checkFlag
    },
    /*
    ** *************API调用相关函数*************
    */
    // 查询设备的状态:在线离线--模糊查询设备
    queryDevStateOnenet: function () {
      onenet.onenetDevQue(this.param).then(function (response) {
        console.log(response)
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
          return
        }
        // 查找本地设备列表，改变el-tree设备的在线离线状态
        this.listDevStatueChange(response)
      }.bind(this))
        .catch(function (error) {
          console.log(error)
        })
    },
    // 用户下网关列表信息获取
    backDevInfoGet: function () {
      console.log('用户下网关列表信息')
      console.log(this.param)
      back.userDevQue(this.param).then(function (response) {
        console.log(response)
        // this.apiResponses = response // 为啥把response存起来，其他请求参数会用到该数据
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
          return
        }
        // 设备列表信息存储到当前组件内
        this.deviceInfoStore(response)
      }.bind(this))
    },
    // 添加设备
    backDeveiceAdd: function () {
      console.log(this.param)
      back.addNetgate(this.param).then(function (response) {
        // console.log(response)
        // 进行新设备的添加
        // 先判断是否添加成功，失败则弹出失败信息
        // 若成功，则刷新设备列表，弹出成功信息
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
        } else {
          this.notificationInfo('提示', '添加设备成功')
          console.log(response)
          // 用户下设备信息获取
          this.backDevInfoGet()
        }
      }.bind(this))
    },
    /*
    //  ************  方法函数  *************
    */
    // 开启定时器，定时查询onenet上的最新数据，定时查询设备在线状态；
    // * 定时查询浏览器窗口大小，判断是否显示隐藏左侧设备组件按钮
    queryLoop: function () {
      // 停止定时器
      window.clearInterval(this.timerOnline) // 复位再开启 重启操作
      // this.timerOnline = window.setInterval(this.queOnenetDevInfo, 6666)
      // 停止定时器 （先停止再开始 === 重启操作） ？？？？？
      window.clearInterval(this.timerWindowWidth)
      this.timerWindowWidth = window.setInterval(this.listbtnVisible, 2000)
    },
    // 模糊查询设备(根据不同的API批量查询)
    queOnenetDevInfo: function () {
      console.log(this.apiKeyGroup)
      if (this.apiKeyGroup.length !== undefined && this.apiKeyGroup.length > 0) {
        for (let i = 0; i < this.apiKeyGroup.length; i++) {
          this.param.apiKey = this.apiKeyGroup[i]
          // 查询设备的状态:在线离线
          this.queryDevStateOnenet()
        }
      }
    },
    // 判断是否显示listbutton按钮
    listbtnVisible: function () {
      this.windowWidth = $(window).width()
      if (this.windowWidth <= 700) {
        if (this.marker === 0) {
          this.aside.style.flexBasis = 0 + 'px'
          this.listbtn.style.left = 2 + 'px'
          this.listbuttonVisible = true
        } else {
          this.listbuttonVisible = true
        }
      } else {
        this.aside.style.flexBasis = 260 + 'px'
        this.listbtn.style.left = 262 + 'px'
        this.marker = 0
        this.listbuttonVisible = false
      }
    },
    // 按钮操作显示或隐藏左侧设备列表
    asideVisibleBt: function () {
      if (this.aside.style.flexBasis !== 0 + 'px') {
        this.aside.style.flexBasis = 0 + 'px'
        this.listbtn.style.left = 2 + 'px'
      } else {
        this.aside.style.flexBasis = 260 + 'px'
        this.listbtn.style.left = 262 + 'px'
        this.marker = 1
      }
    },
    // 设备列表信息存储到当前组件内
    deviceInfoStore: function (info) {
      let devicesinfo = [] // 网关列表数组
      if (info.errno === 0) {
        // 设备组
        // 设备列表信息存储到当前左侧组件内
        for (let j = 0; j < info.data.length; j++) {
          let devicesgroup = {}                                       // 网关数组中的一个对象
          devicesgroup.id = info.data[j].groupUid
          devicesgroup.label = info.data[j].groupName
          // devicesgroup.online = ''
          // devicesgroup.alarm = ''
          let data = []                                               // 网关数组->对象->数组(chidldren数组)
          if (info.data[j].devices === undefined) {
            data[0] = {}                                              // children数组内对象为空
            devicesgroup.children = data
            devicesinfo[j] = devicesgroup
            continue
          }
          // 组内设备
          for (let k = 0; k < info.data[j].devices.length; k++) {
            let obj = {}                                              // children数组内对象
            obj.id = info.data[j].devices[k].deviceId
            obj.label = info.data[j].devices[k].name
            obj.apiKey = info.data[j].devices[k].apiKey
            obj.sn = info.data[j].devices[k].sn
            obj.location = info.data[j].devices[k].location
            obj.createTime = info.data[j].devices[k].createTime
            obj.auth = ''
            obj.alarm = ''
            obj.online = info.data[j].devices[k].online === 1 ? '在线' : '离线'
            data[k] = obj
          }
          devicesgroup.children = data
          devicesinfo[j] = devicesgroup
        }
      }
      // 设备列表信息存储到当前组件内
      this.deviceList = devicesinfo
      this.$store.commit('setDeviceList', this.deviceList)
      // 查询设备APIKEY 存储不同的APIKEY值
      this.apikeyGroupSet()
      // 设备列表组信息存储到 添加网关组件内
      let sets = []
      if (info.errno === 0) {
        for (let m = 0; m < info.data.length; m++) {
          let obj = {}
          obj.name = info.data[m].groupName
          obj.id = '选项' + (m + 1)
          obj.groupUid = info.data[m].groupUid
          sets[m] = obj
        }
        this.tableDataGroup = sets
      }
    },
    // 查询设备APIKEY 存储不同的APIKEY值（仅仅是存储）
    apikeyGroupSet: function () {
      this.apiKeyGroup = []
      console.log('查询设备APIKEY 存储不同的APIKEY值（仅仅是存储）')
      console.log(this.deviceList)
      for (let i = 0; i < this.deviceList.length; i++) {
        if (this.deviceList[i].children !== undefined) {
          for (let j = 0; j < this.deviceList[i].children.length; j++) {
            if (this.deviceList[i].children[j].apiKey !== undefined) {
              this.pushApikey(this.deviceList[i].children[j].apiKey)
            }
          }
        }
      }
    },
    // push apikey 存储不同的APIKEY值
    pushApikey: function (apikeyparam) {
      if (this.apiKeyGroup.length === undefined || this.apiKeyGroup.length === 0) {
        this.apiKeyGroup.push(apikeyparam)
      } else if (this.apiKeyGroup.length > 0) {
        for (let i = 0; i < this.apiKeyGroup.length; i++) {
          if (apikeyparam === this.apiKeyGroup[i]) {
            return
          }
        }
        this.apiKeyGroup.push(apikeyparam)
      }
    },
    // 查找本地设备列表，改变el-tree设备的在线离线状态
    listDevStatueChange: function (responseInfo) {
      if (responseInfo.data !== undefined) {
        if (responseInfo.data.devices !== undefined) {
          for (let i = 0; i < responseInfo.data.devices.length; i++) {
            // 传入设备信息（deviceId，online），修改设备在线离线状态
            this.listDevOnlineChange(responseInfo.data.devices[i].id, responseInfo.data.devices[i].online)
          }
        }
      }
    },
    // 传入设备信息（deviceId，online），修改设备在线离线状态
    listDevOnlineChange: function (deviceId, online) {
      for (let i = 0; i < this.deviceList.length; i++) {
        if (this.deviceList[i].children !== undefined) {
          for (let j = 0; j < this.deviceList[i].children.length; j++) {
            if (this.deviceList[i].children[j].id !== undefined) {
              if (this.deviceList[i].children[j].id === deviceId) {
                this.deviceList[i].children[j].online = (online) ? '在线' : '离线'
                console.log(123456)
                this.$store.commit('settDeviceOnlieState', {sn: this.deviceList[i].children[j].sn, online: online})
              }
            }
          }
        }
      }
    },
    // 可关闭式通知提示，titlePara为标题，messagePara为通知内容
    notificationInfo: function (titlePara, messagePara) {
      const h = this.$createElement
      this.$notify({
        title: titlePara,
        message: h('i', {style: 'color: teal'}, `${messagePara}`)
      })
    }
  }
}
</script>

<style scoped>
.home {
  top: 0px;
  bottom: 0px;
  width: 100%;
  position: absolute;
}
.el-container {
  display: flex;
  background-color: rgb(226, 234, 239);
  /* background-color: red; */
  width: 100%;
  top: 0;
  bottom: 0;
  height: 100%;
}
.el-aside {
  border-right: 1px solid silver;
  /* width: 260px; */
  flex: 0 0 0 260px;
  flex-basis: 260px;
  overflow-y: hidden;
}
.main {
  width: 100%;
  overflow: hidden;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.userleft {
  padding: 10px;
  /* padding-top: 20px; */
}
.userright {
  padding: 10px;
}
.userpic {
  height: 25px;
  width: 25px;
  padding: 10px;
  background-color: white;
  cursor: pointer;
}
.usericon {
  height: 25px;
  width: 25px;
  line-height: 30px;
  text-align: left;
}
.bg-aside-user {
  /* height: 67.5px; */
  height: 45px;
}
.userup {
  height: 22.5px;
  text-align: left;
}
.usermiddle {
  height: 22.5px;
  text-align: left;
}
.userdown {
  height: 22.5px;
  text-align: left;
}
.log-aside-user {
  height: 22.5px;
  line-height: 22.5px;
  padding: 0px;
  text-align: left;
}
.log-aside-middle {
  height: 22.5px;
  line-height: 22.5px;
  padding: 0px;
  text-align: left;
}
.log-aside-out {
  height: 22.5px;
  line-height: 22.5px;
  padding: 0px;
  text-align: left;
}
.grid-select {
  margin-bottom: 0px;
}
.bg-aside-select {
  height: 46px;
  margin: 8px auto;
  margin-top: 0px;
}
.fouricons{
  font-size: 18px;
}
.bg-aside-list {
  min-height: 40px;
}
.el-input {
  width: 99%;
}
.sider {
  flex: 0 0 25%;
}
#aside {
  background-color: rgb(238, 241, 246);
  /* background-color: red; */
  width: 260px;
  flex: 0 0 260px;
  flex-basis: 260px;
}
#listbutton {
  position: absolute;
  background-color: white;
  opacity: 0.5;
  border-radius: 5px;
  /* border: 2px solid black; */
  top: 28px;
  left: 262px;
  width: 30px;
  height: 35px;
}
.el-dialog--center .el-dialog__header {
  background-color: #409EFF;
  padding-top: 15px;
}
/* .addGateway {} */
.addGateway .item_addGateway {
  width: 100%;
  margin-top: 15px;
  min-height: 40px;
}
.addGateway .item_addGateway .addGateway_formItem {
  float: left;
  width: 50%;
  padding-right: 30px;
  height: 40px;
  box-sizing: border-box;
}
</style>

<style>
.addGateway .el-dialog--center .el-dialog__body {
  padding: 0;
}
.addGateway .item_addGateway .el-form-item {
  margin-bottom: 0;
}
.addGateway .el-dialog--center .el-dialog__header {
  padding-top: 10px;
  line-height: 30px;
}
.addGateway .anchorBL{
  display: none;
}
</style>
