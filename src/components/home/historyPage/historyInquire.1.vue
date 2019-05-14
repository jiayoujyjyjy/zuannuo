<template>
  <div class="history">
    <h3></h3>
    <div>
      <el-row>
        <el-col :span="5">
          <div class="span-top">
            <span style="float: right;">采集器选择：</span>
          </div>
        </el-col>
        <el-col :span="5">
          <div>
            <el-select v-model="nodeSelected" placeholder="请选择">
              <el-option v-for="item in nodeListInfo" :key="item.collectorUId" :label="item.name" :value="item.mac"></el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple">开始日期
            <el-date-picker
              v-model="valueStart"
              type="datetime"
              @change="getStartTime"
              value-format="yyyy-MM-ddTHH:mm:ss"
              placeholder="选择日期时间"
              :picker-options="pickerOptions">
            </el-date-picker>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple">结束日期
            <el-date-picker
              v-model="valueEnd"
              type="datetime"
              @change="getEndTime"
              value-format="yyyy-MM-ddTHH:mm:ss"
              placeholder="请选择日期时间"
              align="right"
              :picker-options="pickerOptions">
            </el-date-picker>
          </div>
        </el-col>
      </el-row>
      <p></p>
      <el-row>
        <el-col :span="8">
          <el-button-group>
              <el-tooltip content="表格" placement="bottom" effect="light">
                <el-button type="primary" icon="el-icon-tickets" @click="dataListView=true"></el-button>
              </el-tooltip>
              <el-tooltip content="折线图" placement="bottom" effect="light">
            <el-button type="primary" icon="el-icon-picture-outline" @click="dataChartShow"></el-button>
              </el-tooltip>
            <!-- <el-button type="primary" icon="el-icon-tickets" @click="dataListView=true"></el-button>
            <el-button type="primary" icon="el-icon-picture-outline" @click="dataChartShow"></el-button> -->
          </el-button-group>
        </el-col>
        <el-col :span="8">
          <el-button type="primary" @click="queryHistoryBt" round>开始查询</el-button>
        </el-col>
        <el-col :span="8" v-show="downloadShow">
          <el-button type="primary" @click="download" round>导出表格</el-button>
        </el-col>
      </el-row>
    </div>
    <p></p>
    <template v-if="dataListView">
      <el-table
        v-loading="loadingFlag"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        :data="monitorPointData"
        border
        style="width: 100%;">
          <el-table-column
            fixed
            prop="number"
            label="序号"
            header-align="center"
            min-width="8%">
          </el-table-column>
          <el-table-column
            prop="time"
            label="时间"
            header-align="center"
            min-width="24%">
          </el-table-column>
          <el-table-column
            prop="CH1"
            header-align="center"
            label="传感器1"
            min-width="17%">
          </el-table-column>
          <el-table-column
            prop="CH2"
            header-align="center"
            label="传感器2"
            min-width="17%">
          </el-table-column>
          <el-table-column
            prop="CH3"
            header-align="center"
            label="传感器3"
            min-width="17%">
          </el-table-column>
          <el-table-column
            prop="CH4"
            header-align="center"
            label="传感器4"
            min-width="17%">
          </el-table-column>
        </el-table>
    </template>
    <!-- <h1></h1> -->
    <template v-else>
      <div class="chartview">
        <div id="diagram">
          <h1>echart</h1>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { back, onenet } from 'api'
import { sessionGetStore } from '@/components/config/Utils'
export default {
  data () {
    return {
      // 参数，用于API请求
      param: {
        'userId': '',
        'sn': '',
        'Authorization': '',
        'apiKey': '',
        'deviceId': '',
        'startTime': '',
        'endTime': '',
        'limit': 6000,
        'cursor': '',
        'datastreamId': []
      },
      // 存储onenet返回的原始数据
      // * nenetPriData--onenet原始数据(排序后) lengthData--4路传感器4个数组的数据长度
      // * limitData--cursor,时间格式,数据格式,4路最小数组长度的onenet所有数据
      // * moniterPointer--所有处理之后的最终最新4路监控点数据
      onenetPriData: {
        count: 100,
        cursor: '203830_514218083_1551504654798',
        datastreams: [
          { 
            datapoints: [
              {at: ''},
              {value: 123}
            ], 
            id: '01'
          },
          { 
            datapoints: [
              {at: ''},
              {value: 123}
            ], 
            id: '02'
          },
          { 
            datapoints: [
              {at: ''},
              {value: 123}
            ], 
            id: '03'
          },
          { 
            datapoints: [
              {at: ''},
              {value: 123}
            ], 
            id: '04'
          }
        ]
      },
      // 实际存储当前页面中的设备的查询到的历史数据信息
      monitorPointData: [{
        number: '',
        time: '',
        CH1: '',
        CH2: '',
        CH3: '',
        CH4: ''
      }],
      dataMinLength: 0,           // 所能取到onenet数据4路数组中最小长度
      valueStart: '',             // 开始日期
      valueEnd: '',               // 结束日期
      monitorCreatetime: '',      // 当前选中监控点创建时间
      nodeSelected: '',           // 当前选择的监控点(采集器)的ID号（小组【采集器】UID号（用于后台））
      lineData: [],               // 折线图数据
      limitData: '',              // 存放向onenet查询到的带limit参数的数据
      table: '',
      // 存储节点列表信息 collectorId,installTime,location,mac,name,online,slaveAddress,index
      nodeListInfo: [{
        collectorUId: '',                 // 采集器UID号（用于后台）
        collectorId: '',                  // 采集器ID号（用于发往设备）
        name: '',                         // 采集器名
        index: ''
      }],
      pickerOptions: {
        // 设置禁用状态，参数为当前日期，要求返回 Boolean
        disabledDate (time) {
          return (time.getTime() > Date.now() || time.getTime() < Date.now() - 1000 * 60 * 60 * 24 * 90)
        }
      },
      dataListView: true,        // 表格显示标志位
      downloadShow: false,       // 下载图标按钮显示标志位
      myChart: null,             // 曲线图表
      loadingFlag: false,
      groupSetLoading: null      // 导出excel表格相应界面标志位
    }
  },
  created () {
    this.param.sn = sessionGetStore('deviceSNNow')
    this.param.userId = sessionGetStore('userId')
    this.param.Authorization = sessionGetStore('Authorization')
    // back获取apikey,deviceId
    back.getNetInfo(this.param).then(function (response) {
      if (response.errno !== 0) {
        this.notificationInfo('错误提示', response.error)
        return
      }
      this.param.apiKey = response.data.apiKey
      this.param.deviceId = response.data.deviceId
    }.bind(this))
  },
  mounted () {
    // 查询后台的所有监控点信息（重新渲染组件时操作）
    this.backDevInfoQue()
  },
  methods: {
    // 点击历史查询按键，查询对应时间段内的历史数据
    queryHistoryBt () {
      if (!(this.valueStart && this.valueEnd)) {
        this.notificationInfo('错误提示：', '请选择时间范围')
        return
      }
      if (this.valueStart > this.valueEnd) {
        this.notificationInfo('错误提示：', '开始时间不能大于结束时间')
        return
      }
      if (this.nodeSelected === '') {
        this.notificationInfo('错误提示：', '请选择监控点')
        return
      }
      this.param.startTime = this.valueStart
      this.param.endTime = this.valueEnd
      var valueStart = this.valueStart.replace(/T/, ' ')
      var valueEnd = this.valueEnd.replace(/T/, ' ')
      // 匹配选择框选中节点与整个nodeListInfo列表,得到与之一一对应的index
      var index
      for (let i = 0; i < this.nodeListInfo.length; i++) {
        if (this.nodeSelected === this.nodeListInfo[i].mac) {
          index = this.nodeListInfo[i].index
        }
      }
      // 根据index，获取对应的节点创建时间
      // * 如果监控点创建时间大于选择开始时间，则param.startTime = 监控点创建时间
      this.monitorCreatetime = this.nodeListInfo[index].installTime
      if (this.monitorCreatetime >= valueStart) {
        valueStart = this.monitorCreatetime.replace(' ', 'T')
        this.param.startTime = valueStart
      }
      if (this.monitorCreatetime >= valueEnd) {
        this.notificationInfo('提示：', '该时间段内无数据')
        return
      }
      this.loadingFlag = true
      this.dataListView = true
      for (let j = 1; j < 5; j++) {
        this.param.datastreamId[j - 1] = this.nodeListInfo[index].mac + 0 + j
      }
      console.log(this.param)
      // onenet查询历史数据
      this.onenetOneHistoryQuery()
    },
    // 开始时间选择改变，获取时间信息
    getStartTime: function (datetime) {
      this.valueStart = datetime
      console.log(this.valueStart)
    },
    // 结束时间选择改变，获取时间信息
    getEndTime: function (datetime) {
      this.valueEnd = datetime
      console.log(this.valueEnd)
    },
    // 打开数据图表部分内容，加载图表信息
    // * autuo项目只查询一次onenet数据保存到组件中，点击曲线按钮切换显示，而不是再次查询数据
    // * 钻诺一一写的是分两次查询，这样太占用带宽了，尽管用户体验较好(仅仅是切换显示效果，而不是速度效果)
    dataChartShow () {
      this.dataListView = false
      this.downloadShow = false
      // 使用$nextTick函数避免dom异步更新。由于dom发生更新变化，同步获得不到dom节点，所以要等待dom更新完成后回调函数
      this.$nextTick(function () {
        let chartBox = document.getElementsByClassName('chartview')[0]
        // 用于使chart自适应高度和宽度,通过窗体高宽计算容器高宽
        // * 开始点击第一次进来窗口大小自适应
        var resizechartviewContainer = function () {
          chartBox.style.height = document.body.clientHeight - 240 + 'px'
        }
        resizechartviewContainer()
        this.loaddiagram()
      })
    },
    /*
    ** ************* API调用相关函数 *************
    */
    // *************   back   **************
    // 后台查询网关下节点列表信息
    backDevInfoQue: function () {
      back.relatioNode(this.param).then(function (response) {
        console.log('网关下节点列表信息')
        console.log(response)
        let nodeListdata = []
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
        } else {
          for (let i = 0; i < response.data.length; i++) {
            let obj = {}
            obj.name = response.data[i].name
            obj.slaveAddress = response.data[i].slaveAddress
            obj.collectorId = response.data[i].collectorId
            obj.location = response.data[i].location
            obj.installTime = response.data[i].installTime
            obj.mac = response.data[i].mac
            obj.online = response.data[i].online
            obj.index = i
            nodeListdata[i] = obj
          }
        }
        this.nodeListInfo = nodeListdata
        console.log(this.nodeListInfo)
      }.bind(this))
    },
    // *************   onenet   **************
    // onenet查询近期最多limit个历史数据
    onenetOneHistoryQuery: function () {
      this.onenetPriData = {}
      this.monitorPointData = []
      console.log('onenet查询近期最多limit个历史数据')
      onenet.onenetStartOneHisQue(this.param).then(function (response) {
        console.log(response)
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
          return
        }
        this.sortByKey(response.data.datastreams, 'id')
        this.onenetPriData = response.data
        // 将onenetPriDate数据改变时间格式
        // * 筛选出4路数据中最小长度，保存到this.limitData
        let lengthData = [] // 4路传感器数组的各个长度拼成一个新辅助数组
        this.onenetPriData.datastreams.map(function (n) {
          lengthData.push(n.datapoints.length)
        })
        let dataMinLength = Math.min.apply(Math, lengthData) // 4路传感器数组的各个长度拼成一个新辅助数组中的最小长度，即4路数据最小长度
        this.dataMinLength = dataMinLength
        let data = []
        if (this.onenetPriData.datastreams.length > 0) {
          for (let i = 0; i < dataMinLength; i++) {
            let obj = {}
            obj.number = i + 1
            obj.time = this.onenetPriData.datastreams[0].datapoints[i].at.slice(0, -4)
            obj.CH1 = this.onenetPriData.datastreams[0].datapoints[i].value
            obj.CH2 = this.onenetPriData.datastreams[1].datapoints[i].value
            obj.CH3 = this.onenetPriData.datastreams[2].datapoints[i].value
            obj.CH4 = this.onenetPriData.datastreams[3].datapoints[i].value
            data[i] = obj
          }
        }
        this.limitData = data
        // 只查询一次进行this.limitData迁移到表格MointerPointerData中展示
        // * 目的是为了调用之前的程序，因为之前程序是基于limitData的
        this.fillSomeData()
        // 若第一次查询数据时间点已经大于结束日期，则不进行下次查询
        let valueEnd = this.valueEnd.replace(/T/, ' ')
        for (let i = 0; i < response.data.datastreams.length; i++) {
          for (let j = 0; j < response.data.datastreams[i].datapoints.length; j++) {
            if (response.data.datastreams[i].datapoints[j].at >= valueEnd) {
              this.loadingFlag = false
              this.downloadShow = true
              return
            }
          }
        }
        // 若第一次查询数据返回参数没有cursor，则表示没有数据，即不再进行下次查询
        if (response.data.cursor !== undefined) {
          this.onenetNextHistoryQuery(response.data.cursor)
        } else {
          this.loadingFlag = false
          this.downloadShow = true
        }
      }.bind(this))
        .catch(function (err) {
          this.loadingFlag = false
          console.log(err)
        }.bind(this))
    },
    // onenet查询近期最多limit个历史数据,从cursor开始
    onenetNextHistoryQuery: function (cursor) {
      this.param.cursor = cursor
      onenet.onenetStartNextHisQue(this.param).then(function (response) {
        console.log(response)
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
          return
        }
        this.onenetPriData.count = this.onenetPriData.count + response.data.count
        this.sortByKey(response.data.datastreams, 'id')
        // 最新请求data合并到原始onenetPriData中
        for (let i = 0; i < this.onenetPriData.datastreams.length; i++) {
          for (let j = 0; j < response.data.datastreams[i].datapoints.length; j++) {
            this.onenetPriData.datastreams[i].datapoints.push(response.data.datastreams[i].datapoints[j])
          }
        }
        // 将onenetPriDate数据改变时间格式
        // * 筛选出4路数据中最小长度，保存到this.limitData
        let lengthData = [] // 4路传感器数组的各个长度拼成一个新辅助数组
        this.onenetPriData.datastreams.map(function (n) {
          lengthData.push(n.datapoints.length)
        })
        let dataMinLength = Math.min.apply(Math, lengthData) // 4路传感器数组的各个长度拼成一个新辅助数组中的最小长度，即4路数据最小长度
        this.dataMinLength = dataMinLength
        let data = []
        if (this.onenetPriData.datastreams.length > 0) {
          for (let i = 0; i < dataMinLength; i++) {
            let obj = {}
            obj.number = i + 1
            obj.time = this.onenetPriData.datastreams[0].datapoints[i].at.slice(0, -4)
            obj.CH1 = this.onenetPriData.datastreams[0].datapoints[i].value
            obj.CH2 = this.onenetPriData.datastreams[1].datapoints[i].value
            obj.CH3 = this.onenetPriData.datastreams[2].datapoints[i].value
            obj.CH4 = this.onenetPriData.datastreams[3].datapoints[i].value
            data[i] = obj
          }
        }
        this.limitData = data
        // 只查询一次进行this.limitData迁移到表格MointerPointerData中展示
        // *目的是为了调用之前的程序，因为之前程序是基于limitData的
        this.fillSomeData()
        // 若第一次查询数据时间点已经大于结束日期，则不进行下次查询
        let valueEnd = this.valueEnd.replace(/T/, ' ')
        for (let i = 0; i < response.data.datastreams.length; i++) {
          for (let j = 0; j < response.data.datastreams[i].datapoints.length; j++) {
            if (response.data.datastreams[i].datapoints[j].at >= valueEnd) {
              this.loadingFlag = false
              this.downloadShow = true
              return
            }
          }
        }
        // 若第一次查询数据返回参数没有cursor，则表示没有数据，即不再进行下次查询
        if (response.data.cursor !== undefined) {
          this.onenetNextHistoryQuery(response.data.cursor)
        } else {
          this.loadingFlag = false
          this.downloadShow = true
        }
      }.bind(this))
        .catch(function (err) {
          this.loadingFlag = false
          console.log(err)
        }.bind(this))
    },
    // 从查询到的近期最多limit个历史数据中筛选所选时间段内的数据
    fillSomeData: function () {
      let length = this.limitData.length
      let pushLimitDataIndex
      if (this.monitorPointData.length === 0) {
        pushLimitDataIndex = 0
      } else {
        pushLimitDataIndex = this.monitorPointData.length
      }
      if (length === 0) return
      // 日期格式转换，统一为"yyyy-MM-dd HH:mm:ss"格式，以便后续进行比较
      var valueStart = this.valueStart.replace(/T/, ' ')
      var valueEnd = this.valueEnd.replace(/T/, ' ')
      if (this.monitorCreatetime > valueEnd) {
        this.monitorPointData = []
      } else {
        if (this.monitorCreatetime >= valueStart) {
          valueStart = this.monitorCreatetime
        }
        if (this.limitData[0].time > valueEnd) {
          this.monitorPointData = [] // 源程序不需要这行？
        } else {
          // 筛选limit数据
          if (this.limitData[0].time >= valueStart) {
            for (let i = 0; i < length; i++) {
              if (this.limitData[i].time <= valueEnd) {
                let CH1 = this.limitData[i].CH1
                let CH2 = this.limitData[i].CH2
                let CH3 = this.limitData[i].CH3
                let CH4 = this.limitData[i].CH4
                this.limitData[i].CH1 = CH1
                this.limitData[i].CH2 = CH2
                this.limitData[i].CH3 = CH3
                this.limitData[i].CH4 = CH4
              }
            }
          } else {
            for (let i = 0; i < length; i++) {
              if ((this.limitData[i].time >= valueStart) && (this.limitData[i].time <= valueEnd)) {
                let CH1 = this.limitData[i].CH1
                let CH2 = this.limitData[i].CH2
                let CH3 = this.limitData[i].CH3
                let CH4 = this.limitData[i].CH4
                this.limitData[i].CH1 = CH1
                this.limitData[i].CH2 = CH2
                this.limitData[i].CH3 = CH3
                this.limitData[i].CH4 = CH4
              }
            }
          }
        }
        // data数组 == 筛选后的limitData再slice切成最新根据cursor查找的数组
        let data = this.limitData.slice(pushLimitDataIndex)
        for (let j = 0; j < data.length; j++) {
          this.monitorPointData.push(data[j])
          // /* 数据存到本地但是不渲染dom的话是不会卡顿的，所以应分步骤缓存所有数据到sorceData中去
          //   最终通过一系列的逻辑控制从sourceData中筛选10条数据到domData中，之后再渲染dom，
          //   回滚时也是根据page number来从缓存数组sourceData中筛选出所需的domData
          //   这样子的分页效果更好一点
          //   滚动效果更麻烦一些
          // */
          // this.testData.push(data[j])
        }
      }
      console.log(this.monitorPointData)
    },
    // 存储折线图数据,绘制图表
    loaddiagram: function () {
      var xData = []
      var xDataTime = []
      var yData1 = []
      var yData2 = []
      var yData3 = []
      var yData4 = []
      for (let i = 0; i < this.monitorPointData.length; i++) {
        xData[i] = this.monitorPointData[i].time
        yData1[i] = this.monitorPointData[i].CH1
        yData2[i] = this.monitorPointData[i].CH2
        yData3[i] = this.monitorPointData[i].CH3
        yData4[i] = this.monitorPointData[i].CH4
        // 将请求到的时间数据转换为只保留年月日的格式,x轴label显示格式
        let obj = {}
        let datatest = new Date(this.monitorPointData[i].time)
        obj = datatest.getFullYear() + '-' + (datatest.getMonth() + 1) + '-' + datatest.getDate()
        xDataTime[i] = obj
      }
      // 折线图表高宽度自适应
      let chartBox = document.getElementsByClassName('chartview')[0]
      var resizechartviewContainer = function () {
        chartBox.style.height = document.body.clientHeight - 240 + 'px'
      }
      let diagram = this.$echarts.init(document.getElementById('diagram'))
      // 绘制图表
      diagram.setOption({
        color: ['#DC143C', '#00FFFF', '#00008B', '#008B8B'],
        title: { 
          text: '预紧力历史数据',
          textStyle: {
            fontWeight: 'normal',
            color: '#2c3e50'
            // fontSize: 17
          },
          x: 'center'
        },
        tooltip: { // 提示框
          trigger: 'axis',
          axisPointer: { // 鼠标移动显示双轴坐标值
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
          // formatter: function (params) {
          //   console.log(params)
          //   let label = ''
          //   label = params[4].value + '<br/>' + params[0].seriesName + '：' + params[0].data + '<br/>' + params[1].seriesName + '：' + params[1].data + '<br/>' + params[2].seriesName + '：' + params[2].data + '<br/>' + params[3].seriesName + '：' + params[3].data
          //   return label
          // }
        },
        legend: { // 左上角说明 图例项 data-与series要一一对应
          data: ['传感器1', '传感器2', '传感器3', '传感器4'],
          bottom: 10,
          left: 'right'
        },
        grid: { // 绘图网格
          show: true,
          left: '10%',
          right: '10%',
          bottom: '15%',
          background: '#ed1d1d'
        }, 
        dataZoom: [ // 区域缩放
          {
            type: 'slider', // 滑动条调节
            start: 0,
            end: 100
          },
          {
            type: 'inside', // 鼠标缩放
            start: 0,
            end: 100
          }
        ],
        xAxis: [ // x轴坐标显示
          {
            type: 'category',
            splitNumber: 10,
            data: xDataTime
          }
        ],
        yAxis: [{type: 'value'}], // y轴坐标显示
        series: [ // 鼠标放上面的每一个点的所有系列数据
          {
            name: '传感器1数据',
            type: 'line',
            smooth: true,
            data: yData1
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
      // 用于使chart自适应高度和宽度
      // * window.onresize为实时监听事件，外部函数不执行，window.onresize也会执行，但只能有一处window.onresize
      window.onresize = function () {
        // 重置容器高，自己写一个自定义自适应外部容器高度
        resizechartviewContainer()
        // 重置容器宽，echarts自带resize()方法，
        // * 但相当于只能自适应宽度，
        // * 因为外部容器高度没有自适应，所以要自己再写一个外部容器自适应
        diagram.resize()
      }
    },
    /* 
      ****** excel表格模块 ******
    */
    // 下载excel表格
    download () {
      console.log('下载表格')
      require.ensure([], () => {
        const {
          exportJsonToExcel
        } = require('vendor/Export2Excel')
        var tHeader = ['Time', '传感器1', '传感器2', '传感器3', '传感器4']
        var filterVal = ['time', 'CH1', 'CH2', 'CH3', 'CH4']
        var list = this.monitorPointData
        var data = this.formatJson(filterVal, list)
        exportJsonToExcel(tHeader, data, '传感器数据')
      })
    },
    // excel表格数据格式处理
    formatJson (filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    // 数组对象方法排序
    sortByKey: function (array, key) {
      return array.sort(function (a, b) {
        var x = a[key]
        var y = b[key]
        return ((x < y) ? -1 : ((x > y) ? 1 : 0))
      })
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
.history {
  width: 100%;
  height: 100%;
  bottom: 0;
  overflow-x: hidden;
  overflow-y: auto;
}
#diagram {
  margin: 0 auto;
  width: 100%;
  height: 100%;
  min-height: 200px;
}
.span-top {
  padding-top: 10px;
}
</style>
