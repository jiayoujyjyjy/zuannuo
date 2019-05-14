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
              <el-button type="primary" icon="el-icon-tickets" @click="dataListBtn"></el-button>
            </el-tooltip>
            <el-tooltip content="折线图" placement="bottom" effect="light">
              <el-button type="primary" icon="el-icon-picture-outline" @click="dataChartBtn"></el-button>
            </el-tooltip>
          </el-button-group>
        </el-col>
        <el-col :span="5">
          <el-button type="primary" @click="queryHistoryBt" round>开始查询</el-button>
        </el-col>
        <el-col :span="6" v-show="pageControlBtnShow">
          <el-button-group>
            <el-tooltip content="上一页" placement="bottom" effect="light">
              <el-button type="primary" icon="el-icon-arrow-left" @click="pageUpBtn"></el-button>
            </el-tooltip>
            <el-tooltip content="下一页" placement="bottom" effect="light">
              <el-button type="primary" icon="el-icon-arrow-right" @click="pageDownBtn"></el-button>
            </el-tooltip>
          </el-button-group>
        </el-col>
        <el-col :span="5" v-show="downloadShow">
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
        'limit': 4000, // onenet规定最大为6000
        'cursor': '',
        'datastreamId': []
      },
      // ...几个数据存储变量说明
      // * onenetPriData--onenet所有原始数据(排序后) 
      // * lengthData--4路传感器4个数组的数据长度
      // * limitData--cursor,时间格式,数据格式,4路最小数组长度的onenet所有数据
      // * moniterPointer--所有处理之后的最终最新4路监控点数据，表格实际显示数据
      onenetPriData: {
        count: 100,
        cursor: '203830_514218083_1551504654798',
        datastreams: [
          { 
            datapoints: [
              {at: '', value: 123},
              {at: '', value: 456}
            ], 
            id: '01'
          },
          { 
            datapoints: [
              {at: '', value: 123},
              {at: '', value: 456}
            ], 
            id: '02'
          },
          { 
            datapoints: [
              {at: '', value: 123},
              {at: '', value: 456}
            ], 
            id: '03'
          },
          { 
            datapoints: [
              {at: '', value: 123},
              {at: '', value: 456}
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
      valueStart: '',             // 开始日期
      valueEnd: '',               // 结束日期
      monitorCreatetime: '',      // 当前选中监控点创建时间
      nodeSelected: '',           // 当前选择的监控点(采集器)的ID号（小组【采集器】UID号（用于后台））
      limitData: [],              // 存放向onenet查询到的带limit参数的数据
      // limitDataPriLength: 0,     // 所请求之后的并且筛选时间范围之后的所有的数据的上一次的长度，slice起始位置
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
      cursorArr: [],        // 存储每一次请求返回的cursor到一个数组中去
      // ...分页用变量
      pageCurNum: null,           // 第一条数据,只在1-5之间徘徊，大于5则back请求并回置为5，小于1则back请求并回置为1
      // pageSizeNumber: null,      // 第1000条数据
      numberConst: 1000, // number常量 后期仅需修改numberConst即可动态设置每页数据
      // test
      pageDownBackNum: null, // 只增加不减少，表示最新数据页面量，===请求back次数
      pageDataNum: null, // 1，2，3，4, 5 表示5个元素数组的索引号，不会大于5的，
      pageUpBackNum: null,  // 测试下一页判断是否back用变量
      pageControlBtnShow: false,       // 上页下页按钮显示标志位
      endTimeFlag: false,              // 下一页触发按钮标志位
      pageDownOrUp: null,         // 上一页下一页判断 true-下一页，false-上一页
      dataListView: true,        // 表格显示标志位
      downloadShow: false,       // 下载图标按钮显示标志位
      loadingFlag: false
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
      // // 调试用数据
      // test1 ... 无限数据
      this.valueStart = '2019-04-01T00:00:00'
      this.valueEnd = '2019-04-30T15:32:02'
      this.nodeSelected = 'FDFD0001'
      // test2 ... 4页数据 实际查到了 4000+4000+4000+1372()
      // this.valueStart = '2019-04-29T11:14:35'
      // this.valueEnd = '2019-05-03T11:14:35'
      // this.nodeSelected = 'FDFD0001'
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
      // onenet查询历史数据
      // this.pageCurNum = 1
      // this.pageSizeNumber = this.numberConst
      this.onenetOneHistoryQuery()
    },
    // 上一页触发按钮 不请求数据而是调用缓存已查询数据
    pageUpBtn: function () {
      console.log('上一页')
      this.pageDownOrUp = false
      // 点击上一页 页码就加1
      this.pageCurNum -= 1
      this.pageDataNum -= 1
      // 综合判断
      // ...判断是否加载到第一页数据
      if (this.pageCurNum === 0) {
        this.notificationInfo('提示：', '已经到第一页数据了!!!')
        this.pageCurNum += 1
        this.pageDataNum += 1
        return
      }
      // ...判断上一页是back 还是 cache
      if (this.pageCurNum <= (this.pageDownBackNum - 5)) {
        // back
        if (this.cursorArr[this.pageCurNum - 1 - 1] !== undefined && this.pageCurNum >= 1) {
          console.log('上一页back平常')
          this.loadingFlag = true
          this.onenetNextHistoryQuery(this.cursorArr[this.pageCurNum - 1 - 1])
        } else if (this.cursorArr[this.pageCurNum - 1 - 1] === undefined) {
          // 回滚之后到第一页时，因为没有最初的cursor，所以相当于点击开始查询按钮
          console.log('上一页back第一页')
          this.loadingFlag = true
          this.onenetNoCursorHisQue()
        }
      } else if (this.pageCurNum > (this.pageDownBackNum - 5)) {
        // cache
        console.log('上一页cache')
        this.loadingFlag = true
        this.fillSomeData()
      }
    },
    // 下一页触发按钮 判断是否请求数据还是调用缓存已查询数据
    pageDownBtn: function () {
      console.log('下一页')
      this.pageDownOrUp = true
      // 点击下一页 页码就加1
      this.pageCurNum += 1
      this.pageDataNum += 1
      // 综合判断
      // ...判断是否加载到最后一页数据
      if (this.cursorArr[this.pageCurNum - 1 - 1] === undefined || this.endTimeFlag) {
        this.notificationInfo('提示：', '数据只有这么多了!!!')
        this.pageCurNum -= 1
        this.pageDataNum -= 1
        return
      }
      // ...判断下一页是back 还是 cache
      // if (this.pageCurNum >= this.pageDownBackNum) {
      // if (this.pageCurNum >= (this.pageCurNum + 5 - 1)) {
      // if (this.pageCurNum >= (this.pageUpBackNum + 5) || this.pageCurNum >= this.pageDownBackNum) {
      // if ((this.pageCurNum + Math.abs(this.pageUpBackNum)) >= 14 || this.pageUpBackNum === 1) {
      if (this.pageCurNum > this.pageDownBackNum || this.pageCurNum > (this.pageUpBackNum + this.pageDownBackNum - 1)) {
        // back
        if (this.pageCurNum >= (this.pageUpBackNum + this.pageDownBackNum) || this.pageUpBackNum === 1) {
          if (this.cursorArr[this.pageCurNum - 1 - 1] !== undefined && !this.endTimeFlag) {
            console.log('下一页back')
            this.loadingFlag = true
            this.onenetNextHistoryQuery(this.cursorArr[this.pageCurNum - 1 - 1])
          }
        }
      } else if (this.pageCurNum <= this.pageDownBackNum) {
        // cache
        console.log('下一页调cache')
        this.loadingFlag = true
        this.fillSomeData()
      }
    },
    // 开始时间选择改变，获取时间信息
    getStartTime: function (datetime) {
      this.valueStart = datetime
    },
    // 结束时间选择改变，获取时间信息
    getEndTime: function (datetime) {
      this.valueEnd = datetime
    },
    // 点击数据列表按钮
    dataListBtn () {
      this.dataListView = true
      this.downloadShow = true
    },
    // 打开数据图表部分内容，加载图表信息
    // * autuo项目只查询一次onenet数据保存到组件中，点击曲线按钮切换显示，而不是再次查询数据
    // * 钻诺一一写的是分两次查询，这样太占用带宽了，尽管用户体验较好(仅仅是切换显示效果，而不是速度效果)
    dataChartBtn () {
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
      }.bind(this))
    },
    // *************   onenet   **************
    // onenet查询近期最多limit个历史数据
    onenetOneHistoryQuery: function () {
      this.onenetPriData = {}
      this.monitorPointData = []
      onenet.onenetStartOneHisQue(this.param).then(function (response) {
        console.log('onenet查询近期最多limit个历史数据')
        console.log(response)
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
          this.loadingFlag = false
          return
        }
        // cursor存储
        if (response.data.cursor !== undefined) this.cursorArr.push(response.data.cursor)
        // 页面变量初始化
        this.pageCurNum = 1
        this.pageDataNum = 1
        this.pageDownBackNum = 1
        this.pageUpBackNum = 1
        // streamId正序排序
        this.sortByKey(response.data.datastreams, 'id')
        // 筛选出4路数据中最小长度，保存到this.limitData
        let lengthData = [] // 4路传感器数组的各个长度拼成一个新辅助数组
        response.data.datastreams.map(function (n) {
          lengthData.push(n.datapoints.length)
        })
        let dataMinLength = Math.min.apply(Math, lengthData) // onenet数据4路数组中最小长度
        // back新数据保存到onenetPriData
        this.onenetPriData = response.data // response.data引用类型所以是sort排序之后的
        console.log(this.onenetPriData)
        // 遍历onenetPriData，转化格式存储到limitData
        let data = []
        if (this.onenetPriData.datastreams.length > 0) {
          for (let i = 0; i < dataMinLength; i++) {
            let obj = {}
            obj.number = i + 1
            obj.time = this.onenetPriData.datastreams[0].datapoints[i].at.slice(0, -4) // 时间格式由ms精确到s
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
        this.loadingFlag = false
        this.dataListView ? this.downloadShow = true : this.downloadShow = false
        this.pageControlBtnShow = true
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
        console.log('onenet查询近期最多limit个历史数据,从cursor开始')
        console.log(response)
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
          this.loadingFlag = false
          return
        }
        // cursor存储
        // ...下一页查询并且保证cursor不重复则push新cursor到cursorArr数组中去，上一页则不操作
        if (this.pageDownOrUp && response.data.cursor !== undefined && this.pageCurNum > this.pageDownBackNum) {
          this.cursorArr.push(response.data.cursor)
        }
        // 页面变量初始化
        // ...判断下一页or上一页
        if (this.pageDownOrUp)  {
          // ....下一页
          if (this.pageCurNum > this.pageDownBackNum) this.pageDownBackNum++ // 下一页则pageBackNum+1
        } else {
          // ....上一页
          this.pageUpBackNum-- // 上一页则pageBackNum-1
        }
        // streamId正序排序
        this.sortByKey(response.data.datastreams, 'id')
        // 筛选出4路数据中最小长度，保存到this.limitData
        let lengthData = [] // 4路传感器数组的各个长度拼成一个新辅助数组
        response.data.datastreams.map(function (n) {
          lengthData.push(n.datapoints.length)
        })
        let dataMinLength = Math.min.apply(Math, lengthData) // onenet数据4路数组中最小长度
        // back新数据保存到onenetPriData
        // ...注意: 这一切的操作都是基于发起新Back请求的基础
        console.log(this.onenetPriData.datastreams)
        for (let i = 0; i < this.onenetPriData.datastreams.length; i++) {
          if (this.onenetPriData.datastreams[i].datapoints.length < 5000) {
            // onenetPriData数量小于5000，小于5页
            // ...每次push叠加1000个对象到datapoints数组中去
            console.log('小于5000')
            for (let j = 0; j < dataMinLength; j++) {
              this.onenetPriData.datastreams[i].datapoints.push(response.data.datastreams[i].datapoints[j])
            }
          } else {
            // onenetPriData数量大于5000，大于5页
            console.log('大于等于5000')
            // ...判断是去头还是去尾
            if (this.pageDownOrUp) {
              // 去头填尾
              // ...移除前1000个，push叠加最新1000个对象到datapoints数组中去
              console.log('去头填尾')
              this.onenetPriData.datastreams[i].datapoints.splice(0, 1000)
              for (let j = 0; j < dataMinLength; j++) {
                this.onenetPriData.datastreams[i].datapoints.push(response.data.datastreams[i].datapoints[j])
              }
            } else {
              // 去尾填头 
              // ...移除后1000个，unshift方法要先插入最后一个数据，逆序插入
              console.log('去尾填头')
              this.onenetPriData.datastreams[i].datapoints.splice(4000, 1000)
              for (let j = dataMinLength - 1; j >= 0; j--) {
                this.onenetPriData.datastreams[i].datapoints.unshift(response.data.datastreams[i].datapoints[j])
              }
            }
          }
        }
        console.log(this.onenetPriData)
        // 遍历onenetPriData，转化格式存储到limitData 
        let data = [] // data最多存储的就是'5页'数据，因为this.onenetPriData.datastreams最多存储'5页'数据
        if (this.onenetPriData.datastreams.length > 0) {
          // 上边已经确保最新Back数据每路数据量相同，从而确保this.onenetPriData.datastreams的每路数据量相同，所以可以固定写datastreams[0]
          for (let i = 0; i < this.onenetPriData.datastreams[0].datapoints.length; i++) {
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
        this.loadingFlag = false
        this.dataListView ? this.downloadShow = true : this.downloadShow = false
        this.pageControlBtnShow = true
      }.bind(this))
        .catch(function (err) {
          this.loadingFlag = false
          console.log(err)
        }.bind(this))
    },
    // 回滚之后到第一页时，因为没有最初的cursor，所以相当于点击开始查询按钮
    onenetNoCursorHisQue: function () {
      onenet.onenetStartOneHisQue(this.param).then(function (response) {
        console.log('回滚之后到第一页时，因为没有最初的cursor，所以相当于点击开始查询按钮')
        console.log(response)
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
          this.loadingFlag = false
          return
        }
        // 页面变量初始化
        this.pageUpBackNum--
        // streamId正序排序
        this.sortByKey(response.data.datastreams, 'id')
        // 筛选出4路数据中最小长度，保存到this.limitData
        let lengthData = [] // 4路传感器数组的各个长度拼成一个新辅助数组
        response.data.datastreams.map(function (n) {
          lengthData.push(n.datapoints.length)
        })
        let dataMinLength = Math.min.apply(Math, lengthData) // onenet数据4路数组中最小长度
        // back新数据保存到onenetPriData
        // ... 注意: 这一切的操作都是基于发起新Back请求的基础
        console.log(this.onenetPriData.datastreams)
        for (let i = 0; i < this.onenetPriData.datastreams.length; i++) {
          if (this.onenetPriData.datastreams[i].datapoints.length < 5000) {
            // onenetPriData数量小于5000，小于5页
            // ...每次push叠加1000个对象到datapoints数组中去
            console.log('小于5000')
            for (let j = 0; j < dataMinLength; j++) {
              this.onenetPriData.datastreams[i].datapoints.push(response.data.datastreams[i].datapoints[j])
            }
          } else {
            // onenetPriData数量大于5000，大于5页
            console.log('大于等于5000')
            // ...判断是去头还是去尾
            if (this.pageDownOrUp) {
              // 去头填尾
              // ...移除前1000个，push叠加最新1000个对象到datapoints数组中去
              console.log('去头填尾')
              this.onenetPriData.datastreams[i].datapoints.splice(0, 1000)
              for (let j = 0; j < dataMinLength; j++) {
                this.onenetPriData.datastreams[i].datapoints.push(response.data.datastreams[i].datapoints[j])
              }
            } else {
              // 去尾填头 
              // ...移除后1000个，unshift方法要先插入最后一个数据，逆序插入
              console.log('去尾填头')
              this.onenetPriData.datastreams[i].datapoints.splice(4000, 1000)
              for (let j = dataMinLength - 1; j >= 0; j--) {
                this.onenetPriData.datastreams[i].datapoints.unshift(response.data.datastreams[i].datapoints[j])
              }
            }
          }
        }
        console.log(this.onenetPriData)
        // 遍历onenetPriData，转化格式存储到limitData 
        let data = [] // data最多存储的就是'5页'数据，因为this.onenetPriData.datastreams最多存储'5页'数据
        if (this.onenetPriData.datastreams.length > 0) {
          // 上边已经确保最新Back数据每路数据量相同，从而确保this.onenetPriData.datastreams的每路数据量相同，所以可以固定写datastreams[0]
          for (let i = 0; i < this.onenetPriData.datastreams[0].datapoints.length; i++) {
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
        this.loadingFlag = false
        this.dataListView ? this.downloadShow = true : this.downloadShow = false
        this.pageControlBtnShow = true
      }.bind(this))
        .catch(function (err) {
          this.loadingFlag = false
          console.log(err)
        }.bind(this))
    },
    // 从查询到的近期最多limit个历史数据中筛选所选时间段内的数据
    fillSomeData: function () {
      let length = this.limitData.length
      if (length === 0) return
      // 日期格式转换，统一为"yyyy-MM-dd HH:mm:ss"格式，以便后续进行比较
      var valueStart = this.valueStart.replace(/T/, ' ')
      var valueEnd = this.valueEnd.replace(/T/, ' ')
      if (this.monitorCreatetime > valueEnd) {
        // this.monitorPointData = []
        this.limitData = []
      } else {
        if (this.monitorCreatetime >= valueStart) {
          valueStart = this.monitorCreatetime
        }
        if (this.limitData[0].time > valueEnd) {
          // this.monitorPointData = [] // 源程序不需要这行？
          this.limitData = []
        } else {
          if (this.limitData[0].time >= valueStart) {
            this.limitData = this.limitData.filter(function (item, index, array) {
              return (item.time <= valueEnd)
            })
            // 设置点击下一页是否发起back请求标志位，length为原始limiterData长度，this.limitData.length为filter过滤之后最新长度
            if (length > this.limitData.length) this.endTimeFlag = true
          } else if (this.limitData[0].time < valueStart) {
            this.limitData = this.limitData.filter(function (item, index, array) {
              return ((item.time >= valueStart) && (item.time <= valueEnd))
            })
          }
        }
        // limitData: 所请求之后的并且筛选时间范围之后所有的数据 最多存5页数据
        // data：筛选后的limitData再slice切成最新根据cursor查找的数组，最新一次请求的数据
        // monitorPointData: 当前页数据
        // let monitorPointData = this.limitData.slice(this.limitDataPriLength, this.limitData.length)
        // let data = this.limitData.slice((this.pageCurNum - 1) * this.numberConst, this.pageSizeNumber)
        // this.pageDataNum 为实际计算变量，当前页大于5则为5，当前页小于1则为1
        if (this.pageDataNum > 5) {
          this.pageDataNum = 5
        } else if (this.pageDataNum < 1) {
          this.pageDataNum = 1
        } else {
          this.pageDataNum = this.pageDataNum
        }
        let data = this.limitData.slice((this.pageDataNum - 1) * this.numberConst, this.pageDataNum * this.numberConst)
        // 转化序号，因为this.limitdata保存的最多是[0,999... 4000,4999]
        for (let i = 0; i < data.length; i++) {
          data[i].number = (this.pageCurNum - 1) * 1000 + i + 1
        }
        this.monitorPointData = data
        // 对应的折线图也实现相应功能
        if (!this.dataListView) {
          this.dataChartBtn()
        }
        this.loadingFlag = false
        // for (let j = 0; j < data.length; j++) {
        //   this.monitorPointData.push(data[j])
        //   // /* 数据存到本地但是不渲染dom的话是不会卡顿的，所以应分步骤缓存所有数据到sorceData中去
        //   //   最终通过一系列的逻辑控制从sourceData中筛选10条数据到domData中，之后再渲染dom，
        //   //   回滚时也是根据page number来从缓存数组sourceData中筛选出所需的domData
        //   //   这样子的分页效果更好一点
        //   //   滚动效果更麻烦一些
        //   // */
        //   // this.testData.push(data[j])
        // }
      }
    },
    // 存储折线图数据,绘制图表
    loaddiagram: function () {
      var xData = []
      // var xDataTime = []
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
        // // 将请求到的时间数据转换为只保留年月日的格式,x轴label显示格式
        // let obj = {}
        // let datatest = new Date(this.monitorPointData[i].time)
        // obj = datatest.getFullYear() + '-' + (datatest.getMonth() + 1) + '-' + datatest.getDate()
        // xDataTime[i] = obj
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
          padding: 30,
          x: 'center'
        },
        tooltip: { // 提示框(鼠标悬浮)
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
        // legend: { // 左上角说明 图例项 data-与series要一一对应
        //   data: ['传感器1数据', '传感器2数据', '传感器3数据', '传感器4数据'],
        //   bottom: 10,
        //   left: 'right'
        // },
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
            data: xData,
            axisLabel: {
              formatter: function (value, idx) {
                var date = new Date(value)
                return idx === 0 ? value : [date.getMonth() + 1, date.getDate()].join('-')
              }
            }
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
          },
          {
            name: 'test',
            type: 'line',
            data: this.xdata
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
        // var list = this.monitorPointData
        var list = this.limitData
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
