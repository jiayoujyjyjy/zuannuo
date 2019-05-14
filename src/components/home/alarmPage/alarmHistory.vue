<template>
  <div class="alarmhistory">
    <!-- 用p标签来当作上下边距 -->
  <p></p>
    <div>
      <el-row>
        <el-col :span="7">
          <div class="grid-content bg-purple">开始日期
            <el-date-picker
              v-model="valueStart"
              type="datetime"
              @change="getStartTime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期时间"
              :picker-options="pickerOptions">
            </el-date-picker>
          </div>
        </el-col>
        <el-col :span="7">
          <div class="grid-content bg-purple">结束日期
            <el-date-picker
              v-model="valueEnd"
              type="datetime"
              @change="getEndTime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期时间"
              align="right"
              :picker-options="pickerOptions">
            </el-date-picker>
          </div>
          </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <p></p>
            <el-button type="primary" round @click="queryHistoryBt">开始查询</el-button>
          </div>
        </el-col>
      </el-row>
      <p></p>
    </div>
    <el-table :data="tableDataHistory" border style="width: 100%">
      <el-table-column fixed prop="number" label="序号" header-align="center" min-width="10%"></el-table-column>
      <el-table-column fixed prop="name" label="名称" header-align="center" min-width="20%"></el-table-column>
      <el-table-column fixed prop="info" label="信息" header-align="center" min-width="20%"></el-table-column>
      <el-table-column fixed prop="status" label="状态" header-align="center" min-width="20%"></el-table-column>
      <el-table-column prop="value" label="数值" header-align="center" min-width="30%"></el-table-column>
      <el-table-column prop="time" label="时间" header-align="center" min-width="40%"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import { back } from 'api'
import { sessionGetStore } from '@/components/config/Utils'

export default {
  name: 'alarmHistoryDiv',
  // VUE内部数据
  data () {
    return {
      // 参数，用于API请求
      param: {
        'sn': 'fdfd',
        'apiKey': '',                         // apikey值
        'productId': '',                      // 当前产品ID号
        'deviceId': '',                       // 当前设备ID号
        'datastream_id': '',
        'startTime': '',
        'endTime': '',
        'sort': 'DESC'                        // 值为DESC|ASC时间排序方式，DESC:倒序，ASC升序，默认升序
      },
      tableDataHistory: [{
        number: '',
        name: '',
        info: '',
        status: '',
        value: '',
        time: ''
      }],
      // time: [],
      valueStart: '',                            // 选择时间实时双向绑定数据源
      valueEnd: '',
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()        // 禁用时间状态，不可以选择未来时间，后界限为当前时间
        }
      },
      valuetime: ''                                // [new Date(), new Date()]
    }
  },
  // 生命周期钩子--创建期
  created: function () {
    this.param.userId = sessionGetStore('userId')
    this.param.Authorization = sessionGetStore('Authorization')
    this.param.sn = sessionGetStore('deviceSNNow')
  },
  // 生命周期，安装期
  mounted: function () {
    // back.devInfoQue(this.param).then(function (response) {
    //   console.log(response)
    //   this.param.apiKey = response.data[0].apiKey
    //   this.param.deviceId = response.data[0].deviceId
    // }.bind(this))
    // 清空数据
    this.tableDataHistory = []                          // 页面表格显示'暂无数据'
  },
  //
  // ****************方法函数***********************
  //
  methods: {
    // 历史数据查询按键对应的方法
    queryHistoryBt: function () {
      try {
        if (!(this.valueStart && this.valueEnd)) {
          this.notificationInfo('错误提示：', '请选择时间范围')
          return
        }
        if (this.valueStart > this.valueEnd) {
          this.notificationInfo('错误提示：', '开始时间不能大于结束时间')
          return
        }
        this.param.startTime = this.valueStart.replace('T', ' ')
        this.param.endTime = this.valueEnd.replace('T', ' ')
        // 后台查询历史报警数据
        this.backGetHisTri()
      } catch (ex) {
        console.log(ex)
      }
    },
    /*
    **  **********  API调用相关函数  ************
    */
    // 后台查询历史报警数据
    backGetHisTri: function () {
      back.getHisTri(this.param).then(function (response) {
        console.log(response)
        if (response.errno !== 0) {
          this.notificationInfo('错误提示：', response.error)
          return
        }
        let data = []
        if (response.data !== undefined) {
          for (let i = 0; i < response.data.length; i++) {
            let obj = {}
            obj.number = i + 1
            obj.name = response.data[i].name
            obj.info = response.data[i].content
            obj.status = '触发'
            obj.value = response.data[i].value
            obj.time = response.data[i].time
            data[i] = obj
          }
        } else {
          this.notificationInfo('提示：', response.error)
        }
        this.tableDataHistory = data
      }.bind(this))
    },
    /*
    //  ************  辅助函数  ************
    */
    // 开始时间选择改变，获取时间信息  （只要是改变都是通过@change事件来写的）
    getStartTime: function (datetime) {
      this.valueStart = datetime
      console.log(this.valueStart)
    },
    // 结束时间选择改变，获取时间信息
    getEndTime: function (datetime) {
      this.valueEnd = datetime
      console.log(this.valueEnd)
    },
    // 可关闭式通知提示，titlePara为标题，messagePara为通知内容
    notificationInfo: function (titlePara, messagePara) {
      const h = this.$createElement                                   // vue动态创建dom
      this.$notify({
        title: titlePara,
        message: h('i', {style: 'color: teal'}, `${messagePara}`)
      })
    }
  }
}
</script>

<style>
.alarmhistory{
  padding: 0;
  bottom: 0;
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
