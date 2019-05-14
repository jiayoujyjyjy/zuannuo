<template>
  <el-container>
    <div id="mask" style="width:100%;height:100%;">
      <div id="mask-header">
            <button>退出</button>
        </div>
        <div id="mask-body">
            <div id="lineChartScreen" style="height:80%;display:none" ref="mylineFullScreen"></div>
            <div id="barChartScreen" style="height:80%;display:none" ref="barChartFullScreen"></div>
        </div>
    </div>
    <div class="deviceonepage">
      <!-- 分组(采集器)、表格(该采集器下的传感器数据表格) -->
      <el-main class="deviceonemain">
        <!-- 监控点（采集器选择）和查询按钮 -->
        <el-row class="thirdtitle" :gutter="20">
          <el-col class="" :span="5">
            <div class="grid-content bg-purple span-right span-top">
              <span>节点(采集器)选择：</span>
            </div>
          </el-col>
          <el-col class="" :span="19">
            <div class="grid-content bg-purple span-left">
              <el-select v-model="nodeSelected" placeholder="请选择" @change="selectChangeEvent()">
                <el-option v-for="item in nodeListInfo" :key="item.collectorUId" :label="item.name" :value="item.mac"></el-option>
              </el-select>
              <el-button type="primary" size="" @click="mointorPointQueBt()">监控查询</el-button>
            </div>
          </el-col>
        </el-row>
        <!-- 当前监控点简要信息 -->
        <el-row class="deviceInfoDiv">
          <p></p>
          <span style="margin-left:20px">状态：<span style="color: #999">{{ nodeListInfoNow.online }}&nbsp;&nbsp;&nbsp;&nbsp;|</span></span>
          <span style="margin-left:20px">采集器ID：<span style="color: #999">{{ nodeListInfoNow.collectorId }}&nbsp;&nbsp;&nbsp;&nbsp;|</span></span>
          <span style="margin-left:20px">安装位置：<span style="color: #999">{{ nodeListInfoNow.location }}&nbsp;&nbsp;&nbsp;&nbsp;|</span></span>
          <span style="margin-left:20px">安装时间：<span style="color: #999">{{ nodeListInfoNow.installTime }}&nbsp;&nbsp;&nbsp;&nbsp;|</span></span>
          <span style="margin-left:20px">节点MAC：<span style="color: #999">{{ nodeListInfoNow.mac }}</span></span>
          <p></p>
        </el-row>
        <!-- 采集器下的传感器信息表格 -->
        <el-row v-if="moniterDataShow">
          <p style="text-align:left;">&nbsp;&nbsp;&nbsp;&nbsp;当前数据刷新时间点：<span style="color: #999;">{{ newTime }}</span></p>
          <el-table :data="sensorListData" border style="width: 100%;" :row-class-name="tableRowClassName">
            <el-table-column
              prop="id"
              label="名称"
              min-width="50%"
              header-align="center">
            </el-table-column>
            <el-table-column
              prop="current_value"
              label="数值(Kn)"
              min-width="50%"
              header-align="center">
            </el-table-column>
          </el-table>
        </el-row>
        <!-- 传感器数据折线图及柱状图 -->
        <div class="chartview" v-if="moniterDataShow">
          <div id="diagram">
            <el-row class="lineBarDiv">
              <el-col :span="12">
                <div id="lineChartDiv" style="min-width: 50%;height:350px;" ref="mylineChart"></div>
              </el-col>
              <el-col :span="12">
                <div id="barChartDiv" style="min-width: 50%;height:350px;" ref="barChart"></div>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-main>
      <!-- 所用对话框 -->
      <el-dialog></el-dialog>
    </div>
  </el-container>
</template>

<script>
import { back, onenet } from 'api'
import $ from 'jquery'
import { sessionGetStore } from '@/components/config/Utils'
// 引入柱状图组件
require('echarts/lib/chart/bar')
// 引入提示框和title组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
export default {
  data () {
    return {
      param: {
        'userId': '',
        'sn': '',
        'Authorization': '',
        'apiKey': '',
        'deviceId': '',
        'limit': 3,
        'start': '2018-12-01T00:00:00',
        'datastreamId': []
      },
      nodeSelected: '',                       // 当前选择的监控点(采集器)的ID号（小组【采集器】UID号（用于后台））
      // 监控点(采集器)选择存储列表
      nodeListInfo: [{
        // collectorUId: '',                     // 采集器UID号（用于后台）
        collectorId: '',                      // 采集器ID号（用于发往设备）
        name: '',                             // 采集器名
        index: '',                            // 节点所在节点列表索引号
        installTime: '',                      // 节点安装时间
        location: '',                         // 节点安装位置
        online: '',                           // 节点在线信息
        mac: ''                               // 节点MAC地址
      }],
      // 当前选中的节点信息数据
      nodeListInfoNow: {
        collectorId: '',                      // 采集器ID号（用于发往设备）
        name: '',                             // 采集器名
        index: '',                            // 节点所在节点列表索引号
        installTime: '',                      // 节点安装时间
        location: '',                         // 节点安装位置
        online: '',                           // 节点在线信息
        mac: ''                               // 节点MAC地址
      },
      moniterDataShow: false,                  // 监控点表格,图表显示标志位
      dataGetTime: '',                        // 传感器数据刷新时间点
      // 传感器表格数据
      sensorListData: [{
        create_time: '',                      // 创建时间
        current_value: '',                    // 1路传感器当前数值
        id: '',                               // 1路传感器ID号
        update_at: ''                         // 1路传感器数据更新时间
      }, {
        create_time: '',                      // 创建时间
        current_value: '',                    // 2路传感器当前数值
        id: '',                               // 2路传感器ID号
        update_at: ''                         // 2路传感器数据更新时间
      }, {
        create_time: '',                      // 创建时间
        current_value: '',                    // 3路传感器当前数值
        id: '',                               // 3路传感器ID号
        update_at: ''                         // 3路传感器数据更新时间
      }, {
        create_time: '',                      // 创建时间
        current_value: '',                    // 4路传感器当前数值
        id: '',                               // 4路传感器ID号
        update_at: ''                         // 4路传感器数据更新时间
      }],
      lineChartData: [],                      // 折线图数据
      item: 0,
      timer: null,                            // 折线图定时器
      newTime: null,                          // 折线图最新时间
      isFullScreen: false,                    // 是否全屏
      isChange: false                        // 是否切换全屏
    }
  },
  created () {
    // 后台请求参数param设置
    this.param.userId = sessionGetStore('userId')
    this.param.Authorization = sessionGetStore('Authorization')
    this.param.sn = sessionGetStore('deviceSNNow')
    this.param.apiKey = sessionGetStore('apikeyNow')
    this.param.deviceId = sessionGetStore('deviceIdNow')
    // 表格数据初始化
    this.sensorListData = []
    // this.tableRowClassName()
  },
  mounted: async function () {
    // 获取网关下节点列表信息
    await this.backDevInfoQue()
    // onenet查询当前网关是否在线，若离线则不查询监控点数据
    this.queryDevStateOnenet()
  },
  beforeDestroy () {
    // 停止定时器
    window.clearInterval(this.timer)
  },
  methods: {
    tableRowClassName ({ row, rowIndex }) {
      if (rowIndex === 0) {
        return 'theone'
      } else if (rowIndex === 1) {
        return 'thetwo'
      } else if (rowIndex === 2) {
        return 'thethree'
      } else if (rowIndex === 3) {
        return 'thefour'
      }
      return ''
    },
    /*
    //  ************  用户操作触发方法  ************
    */
    // 按键事件方法，监控信息查询
    mointorPointQueBt (item) {
      console.log('监控查询')
      console.log(this.nodeListInfo)
      // 后台查询该节点下监控点数据流信息
      var index = 0                           // 选中节点序号标志位
      for (let i = 0; i < this.nodeListInfo.length; i++) {
        if (this.nodeSelected === this.nodeListInfo[i].mac) {
          index = this.nodeListInfo[i].index
        }
      }
      console.log(index)
      this.newTime = this.nodeListInfo[index].installTime
      for (let j = 1; j < 5; j++) {
        this.param.datastreamId[j - 1] = this.nodeListInfo[index].mac + 0 + j
      }
      this.nodeListInfoNow = this.nodeListInfo[index]
      // 处理后台返给的节点信息数据，即将online数字0，1转化为status在线，离线
      if (this.nodeListInfoNow.online === 0) {
        this.nodeListInfoNow.online = '离线'
      } else {
        this.nodeListInfoNow.online = '在线'
      }
      if (this.nodeSelected !== '') {
        // 查询当前节点下的监控点信息
        console.log('查询当前节点下的监控点信息')
        this.initLine()
        this.drawBar()
        // 折线/柱状图高宽度自适应
        // let chartBox = document.getElementsByClassName('chartview')[0]
        // let resizechartviewContainer = function () {
        //   chartBox.style.height = document.body.clientHeight - 300 + 'px'
        // }
        let lineBox = document.getElementById('lineChartDiv')
        let resizeLinechartviewContainer = function () {
          lineBox.style.height = document.body.clientHeight - 300 + 'px'
        }
        let barBox = document.getElementById('barChartDiv')
        let resizeBarchartviewContainer = function () {
          barBox.style.height = document.body.clientHeight - 300 + 'px'
        }
        resizeLinechartviewContainer()
        resizeBarchartviewContainer()
        // let diagram = this.$echarts.init(document.getElementById('diagram')) // 这样会遮挡下面的东西
        // 获取折线/柱状图的实例化对象
        // * 之前再底部获取实例化对象再通过this传递到这里则获取不到
        // * 因为逻辑顺序压根就不一样，因为有onenet的异步axios请求
        let lineChartDiv = this.$refs.mylineChart
        let mylineChart = this.$echarts.init(lineChartDiv)
        let barChartDiv = this.$refs.barChart
        let myBarChart = this.$echarts.init(barChartDiv)
        window.onresize = function () {
          console.log(123456)
          // resizechartviewContainer()
          resizeLinechartviewContainer()
          resizeBarchartviewContainer()
          // diagram.resize()
          mylineChart.resize()
          myBarChart.resize()
        }
      }
      this.querydataOnenet()
    },
    // 节点多选框（改变对应改变列表内容）
    selectChangeEvent () {
    },
    // 折线图初始化
    initLine () {
      this.lineChartData = []                             // 初始化折线图数据，防止下次进来接着，防止下次进来接着前一次继续画图
      window.clearInterval(this.timer)                    // 停止定时器（开启定时器之前最好先复位）
      var time = this.newTime // time为旧时间，保存就变量便于比较最新时间
      var _this = this
      onenet.onenetSteamsQue(this.param).then(function (response) {
        // 回调函数为空，重复发送一次
        if (response.errno === undefined) {
          this.querydataOnenet()
          return
        }
        if (response.errno !== 0) {
          this.notificationInfo('错误提示：', response.error)
          return
        }
        if (response.data[0].current_value === undefined) {
          // 平台无数据
          return
        }
        console.log('最新数据')
        console.log(response)
        var sets = {}
        for (let i = 0; i < response.data.length; i++) { // 如果旧time小于新time，则覆盖赋值
          if (time < response.data[i].update_at) {
            time = response.data[i].update_at
          }
        }
        _this.newTime = time
        sets.time = time
        sets.value1 = response.data[0].current_value
        sets.value2 = response.data[1].current_value
        sets.value3 = response.data[2].current_value
        sets.value4 = response.data[3].current_value
        this.lineChartData.splice(this.item, 0, sets)
        this.item++
        console.log('第一次折线图数据')
        console.log(this.lineChartData)
        if (this.lineChartData.length !== 0) {
          console.log('第一次进行画图')
          this.drawLine('mylineChart')
        }
        this.LineData()
      }.bind(this))
    },
    // 折线图数据
    LineData: function () {
      // this代表当前data，封装为_this
      // 避免下面onenetLimitHisQue的this指代onenetLimitHisQue
      // 而不是指代我们想要的data
      var _this = this
      this.timer = setInterval(function () {
        onenet.onenetSteamsQue(_this.param).then(function (response) {
        // 回调函数为空，重复发送一次
          if (response.errno === undefined) {
            this.querydataOnenet()
            return
          }
          if (response.errno !== 0) {
            this.notificationInfo('错误提示：', response.error)
            return
          }
          if (response.data[0].current_value === undefined) {
            // 平台无数据
            return
          }
          console.log('最新数据')
          console.log(response)
          var time = response.data[0].update_at
          var sets = {}
          for (let i = 0; i < response.data.length; i++) {
            if (time < response.data[i].update_at) {
              time = response.data[i].update_at
            }
          }
          // console.log('time')
          // console.log(time)
          // console.log(_this.newTime)
          // if (time !== _this.newTime) {
          if (time !== _this.newTime || time === _this.newTime) {
            sets.time = time
            sets.value1 = response.data[0].current_value
            sets.value2 = response.data[1].current_value
            sets.value3 = response.data[2].current_value
            sets.value4 = response.data[3].current_value
            _this.lineChartData.splice(_this.item, 0, sets)
            _this.item++
            console.log('折线图数据')
            console.log(_this.lineChartData)
            var idName
            if (_this.isFullScreen) {
              idName = 'mylineFullScreen'
            } else {
              idName = 'mylineChart'
            }
            if (_this.lineChartData.length !== 0) {
              console.log('进行画图')
              _this.newTime = time
              _this.drawLine(idName)
            }
          } else if (_this.isChange) {
            _this.isChange = false
            if (_this.isFullScreen) {
              idName = 'mylineFullScreen'
            } else {
              idName = 'mylineChart'
            }
            if (_this.lineChartData.length !== 0) {
              console.log('进行画图')
              _this.newTime = time
              _this.drawLine(idName)
            }
          }
        })
      }, 2000)
    },
    // 折线图绘图
    drawLine (idName) {
      var xData = []
      var yData1 = []
      var yData2 = []
      var yData3 = []
      var yData4 = []
      for (let i = 0; i < this.lineChartData.length; i++) {
        xData[i] = this.lineChartData[i].time
        yData1[i] = this.lineChartData[i].value1
        yData2[i] = this.lineChartData[i].value2
        yData3[i] = this.lineChartData[i].value3
        yData4[i] = this.lineChartData[i].value4
      }
      console.log('xData')
      console.log(xData)
      var _this = this
      var lineChartDiv 
      // 基于准备好的dom，初始化echarts实例
      // let mylineChart = this.$echarts.init(document.getElementById('mylineChart')) // 这样可能开始取不到
      if (idName === 'mylineChart') {
        lineChartDiv = this.$refs.mylineChart
      } else {
        lineChartDiv = this.$refs.mylineFullScreen
      }
      // var lineChartDiv = this.$refs.mylineChart
      if (lineChartDiv) {
        console.log('lineChartDiv不为空')
        let mylineChart = this.$echarts.init(lineChartDiv)
        // 绘制图表
        mylineChart.setOption({
          color: ['#DC143C', '#00FFFF', '#00008B', '#008B8B'],
          title: { 
            text: '预紧力折线图',
            textStyle: {
              fontWeight: 'normal',
              color: '#2c3e50'
            },
            x: 'center'
          },
          toolbox: {
            dataZoom: {  
              show: true
            },
            feature: _this.toolLine(idName)
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross'
            },
            backgroundColor: 'rgba(245, 245, 245, 0.8)',
            borderWidth: 1,
            borderColor: '#ccc',
            padding: 10,
            textStyle: {
              color: '#000'
            },
            extraCssText: 'width: 170px'
          },
          legend: {
            data: ['传感器1', '传感器2', '传感器3', '传感器4'],
            bottom: 10,
            left: 'center'
          },
          grid: {
            top: 50,
            bottom: 50
          },
          xAxis: [
            {
              type: 'category',
              data: xData
            }
          ],
          yAxis: [{type: 'value'}],
          series: [
            {
              name: '传感器1数据',
              type: 'line',
              smooth: true,
              data: yData1
              // markArea: {                                 // 标记区域
              //   // itemStyle: {
              //   //   color: '#FA8072'
              //   // },
              //   data: [
              //     [{
              //       name: '',
              //       yAxis: '-15',                         // y轴坐标控制
              //       itemStyle: {
              //         color: '#5CACEE'
              //       }
              //     }, {
              //       yAxis: '5'
              //     }], [{
              //       name: '',
              //       yAxis: '-20',                         // y轴坐标控制
              //       itemStyle: {
              //         color: '#54FF9F'
              //       }
              //     }, {
              //       yAxis: '-15'
              //     }], [{
              //       name: '',
              //       yAxis: '-20',                         // y轴坐标控制
              //       itemStyle: {
              //         color: '#5CACEE'
              //       }
              //     }, {
              //       yAxis: '-300'
              //     }]
              //   ]
              // }
            },
            {
              name: '传感器2数据',
              type: 'line',
              smooth: true,
              data: yData2
            },
            {
              name: '传感器3数据',
              type: 'line',
              smooth: true,
              data: yData3
            },
            {
              name: '传感器4数据',
              type: 'line',
              smooth: true,
              data: yData4
            }
          ]
        })  
      } else {
        console.log('lineChartDiv为空') 
      }
    },
    toolLine: function (idName) {
      var _this = this
      let feature = {}
      if (idName === 'mylineChart')  {
        feature =  {
          myTool1: {
            show: true,
            title: '全屏',
            icon: 'image://static/fullScreen.png',
            onclick: function () {
              console.log('全屏')
              _this.isChange = true
              _this.isFullScreen = true
              window.clearInterval(_this.timer)
              _this.fullScreen()
              $('#mask-header>button').click(function () {
                console.log('退出')
                $('#lineChartScreen').css('display', 'none')
                _this.isChange = true
                _this.isFullScreen = false
                $('#mask').css('display', 'none')
              })
            }
          }
        }
      } else {
        feature =  {}
      }
      return feature
    },
    toolBar: function (idName) {
      var _this = this
      let feature = {}
      if (idName === 'barChart')  {
        feature = {
          myTool1: {
            show: true,
            title: '全屏',
            icon: 'image://static/fullScreen.png',
            onclick: function () {
              console.log('柱形图全屏')
              _this.isFullScreen = true
              _this.barFullScreen()
              $('#mask-header>button').click(function () {
                $('#barChartScreen').css('display', 'none')
                console.log('退出')
                _this.isFullScreen = false
                $('#mask').css('display', 'none')
              })
            }
          }
        }
      } else {
        feature =  {}
      }
      return feature
    },
    fullScreen () {
      console.log('全屏渲染')
      $('#mask').css('display', 'block')
      $('#lineChartScreen').css('display', 'block')
      $('#mask-body').width($(document.body).width() - 100)
      $('#mask-header').width($(document.body).width() - 100)
      this.LineData()
    },
    barFullScreen () {
      console.log('柱形图全屏渲染')
      $('#mask').css('display', 'block')
      $('#barChartScreen').css('display', 'block')
      $('#mask-body').width($(document.body).width() - 100)
      $('#mask-header').width($(document.body).width() - 100)
      this.drawBar()
    },
    // 柱状图绘图
    drawBar () {
      var _this = this
      onenet.onenetSteamsQue(this.param).then(function (response) {
        // 查询当前节点云平台最新数据
        console.log(response)
        // 回调函数为空，重复发送一次
        if (response.errno === undefined) {
          this.querydataOnenet()
          return
        }
        if (response.errno !== 0) {
          this.notificationInfo('错误提示：', response.error)
          return
        }
        if (response.data[0].current_value === undefined) {
          // 平台无数据
          return
        }
        let barData = []
        for (let i = 0; i < response.data.length; i++) {
          let obj = {}
          // obj.update_at = response.data.devices[0].datastreams[i].at
          obj.Name = response.data[i].id
          obj.data = response.data[i].current_value
          barData[i] = obj
        }
        this.sortByKey(barData, 'Name')
        console.log('数据')
        console.log(barData)
        var barDataNow = []
        for (let i = 0; i < response.data.length; i++) {
          barDataNow[i] = barData[i].data
        }
        var barChartDiv
        var idName
        if (this.isFullScreen) {
          barChartDiv = this.$refs.barChartFullScreen
          idName = 'barChartFullScreen'
        } else {
          barChartDiv = this.$refs.barChart
          idName = 'barChart'
        }
        // 基于准备好的dom，初始化echarts实例
        if (barChartDiv) {
          console.log('barChartDiv不为空')
          let myBarChart = this.$echarts.init(barChartDiv)
          // 绘制图表
          myBarChart.setOption({
            title: {
              text: '传感器柱状图',
              textStyle: {
                fontWeight: 'normal',
                color: '#2c3e50'
              },
              x: 'center'
            },
            grid: {
              top: 50,
              bottom: 50
            },
            toolbox: {
              dataZoom: {  
                show: true
              },
              feature: _this.toolBar(idName)
            },
            tooltip: {},
            xAxis: {
              data: ['传感器1', '传感器2', '传感器3', '传感器4']
            },
            yAxis: {},
            series: [{
              name: '',
              type: 'bar',
              itemStyle: {
                normal: {
                  // 各个柱状图颜色
                  color: function (params) {
                    var colorList = [ '#DC143C', '#00FFFF', '#00008B', '#008B8B' ]
                    return colorList[params.dataIndex]
                  }
                }
              },
              data: barDataNow
            }]
          })
        } else {
          console.log('barChartDiv为空')
        }
      }.bind(this))
    },
    /*
    //  ************  API调用相关函数  ************
    */
    // ***************   back   **************
    // 后台查询网关下节点列表信息
    backDevInfoQue: function () {
      return new Promise(function (resolve, reject) {
        back.relatioNode(this.param).then(function (response) {
          console.log('网关下节点列表信息')
          console.log(response)
          let nodeListdata = []
          if (response.errno !== 0) {
            this.notificationInfo('错误提示', response.error)
            reject()
          } else {
            for (let i = 0; i < response.data.length; i++) {
              let obj = {}
              obj.name = response.data[i].name
              obj.collectorId = response.data[i].collectorId
              obj.location = response.data[i].location
              obj.installTime = response.data[i].installTime
              obj.mac = response.data[i].mac
              obj.online = response.data[i].online
              obj.index = i
              nodeListdata[i] = obj
            }
            resolve()
          }
          this.nodeListInfo = nodeListdata
          console.log(this.nodeListInfo)
        }.bind(this))
          .catch(function (error) {
            console.log(error)
            reject()
          })
      }.bind(this))
    },
    // ******************   onenet   ****************************
    // 查询设备的状态:1在线0离线，决定是否显示监控点数据，及是否查询监控点，以节省带宽
    queryDevStateOnenet: function () {
      console.log('查询设备的状态:1在线0离线')
      console.log(this.param)
      onenet.onenetDevSingleQue(this.param).then(function (response) {
        console.log(response)
        if (!response.data.online) {
          this.param.online = 0
          this.moniterDataShow = false
        } else {
          this.param.online = 1
          // 页面刷新默认查询网关下第一个节点信息，并显示在页面中
          console.log(this.nodeListInfo)
          if (this.nodeListInfo.length !== 0) {
            this.nodeSelected = this.nodeListInfo[0].mac       // label-显示值，value-实际值；v-model绑定到value则显示该value对应的label值
            this.moniterDataShow = true
            // 使用$nextTick函数避免dom异步更新。由于dom发生更新变化，同步获得不到dom节点，所以要等待dom更新完成后回调函数
            this.$nextTick(function () {
              // let chartBox = document.getElementsByClassName('chartview')[0]
              // // 用于使chart自适应高度和宽度,通过窗体高宽计算容器高宽
              // // * 开始点击第一次进来窗口大小自适应
              // var resizechartviewContainer = function () {
              //   chartBox.style.height = document.body.clientHeight - 240 + 'px'
              // }
              // resizechartviewContainer()
              this.mointorPointQueBt()
            })
            // this.mointorPointQueBt()
          }
        }
      }.bind(this))
    },
    // 查询onenet上的最新监控点数据（只返回有数据的监控点的信息）
    querydataOnenet: function () {
      onenet.onenetSteamsQue(this.param).then(function (response) {
        // 回调函数为空，重复发送一次
        if (response.errno === undefined) {
          this.querydataOnenet()
          return
        }
        if (response.errno !== 0) {
          this.notificationInfo('错误提示：', response.error)
          return
        }
        if (response.data[0].current_value === undefined) {
          // 平台无数据
          return
        }
        console.log('选中节点传感器信息')
        console.log(response)
        this.dataGetTime = response.data[0].update_at
        let chData = []
        for (let i = 0; i < response.data.length; i++) {
          let obj = {}
          obj.update_at = response.data[i].update_at
          obj.id = '传感器' + (i + 1)
          obj.current_value = response.data[i].current_value
          chData[i] = obj
        }
        // 数组排序处理
        this.sortByKey(chData, 'id')
        this.sensorListData = chData
        console.log(this.sensorListData)
      }.bind(this))
    },
    /*
    //  ************  辅助方法函数  ************
    */        
    // 数组对象方法排序
    sortByKey: function (array, key) {
      return array.sort(function (a, b) {
        var x = a[key]
        var y = b[key]
        return ((x < y) ? -1 : ((x > y) ? 1 : 0))
      })
    },
    // 时间格式化函数
    changeTime () {
      var now = new Date()
      var myHour = now.getHours()
      var myMinutes = now.getMinutes()
      var mySeconds = now.getSeconds()
      if (myHour < 10) {
        myHour = '0' + myHour
      }
      if (myMinutes < 10) {
        myMinutes = '0' + myMinutes
      }
      if (mySeconds < 10) {
        mySeconds = '0' + mySeconds
      }
      var ATime = myHour + ':' + myMinutes + ':' + mySeconds
      return ATime
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
.el-table >>> .theone{
  color: #DC143C;
}
.el-table >>> .thetwo {
  color:#00FFFF;
}
.el-table >>> .thethree {
  color: #00008B;
}
.el-table >>> .thefour {
  color:#008B8B;
}
.deviceonepage {
  padding: 2px;
  bottom: 0;
  width: 100%;
  overflow: hidden;
  position: relative;
  display: flex;
  display: -webkit-flex; /* Safari */
  flex-direction: column;
}
.deviceonemain {
  padding: 0;
  overflow-x: hidden;
  height: 70%;
}
.deviceInfoDiv {
  /* background-color: red; */
  text-align: justify;
}
.span-top {
  padding-top: 10px;
}
.span-left {
  float: left;
}
.deviceonepage >>> .echart {
  width: 100%;
  height: 100%;
}
/* .mylineChart {
  left: 700px;
  top: 30px;
}
.barChart {
  position: absolute;
  top: 80px;
} */
.span-right {
  float: right;
  /* left: 50%; */
  margin-left: 50px;
}
.lineBarDiv {
  margin-top: 25px;
  width: 100%;
}
#mask {
  width:100%;
  height:100%;
  position:fixed;
  top:0;
  left:0;
  display: none;
  z-index:9999999;
  background: rgba(168, 168, 168, 0.85);
}
#mask-body{
  position: absolute;
  top: 100px;
  left: 50px;
  height: 80%;
  border: 1px solid black;
  background: white!important;
  opacity: 1;
  z-index: 99;
  border-top: none;
}
#mask-header{
  position: absolute;
  top: 50px;
  left: 50px;
  height: 50px;
  border: 1px solid black;
  background: white!important;
  opacity: 1;
  z-index: 999;
  border-bottom: none;
}
#mask-header>button{
  padding: 3px;
  border: 1px solid black;
  position: absolute;
  right: 15px;
  top: 10px;
  cursor: pointer;
}
#mask-header>button:hover{
  background: rgba(168, 168, 168, 0.5);
}
</style>
