<template>
  <div class="alarmnow">
    <el-table v-loading="loadingFlag" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" :data="alarmTableData" border style="width: 100%">
      <el-table-column fixed prop="number" label="编号" header-align="center" min-width="10%"></el-table-column>
      <el-table-column prop="name" label="名称" header-align="center" min-width="10%"></el-table-column>
      <el-table-column prop="content" label="信息" header-align="center" min-width="20%"></el-table-column>
      <!-- <el-table-column prop="state" label="状态" header-align="center" min-width="10%"></el-table-column> -->
      <el-table-column prop="value" label="数值" header-align="center" min-width="10%"></el-table-column>
      <el-table-column prop="time" label="时间" header-align="center" min-width="25%"></el-table-column>
      <el-table-column label="操作" header-align="center" min-width="15%">
        <template slot-scope="scope">
          <el-button type="text" size="small" icon="el-icon-info" v-show="operation" @click="confirmClick(scope.$index, scope.row)">确认</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { back } from 'api'
import { sessionGetStore } from '@/components/config/Utils'

export default {
  name: 'alarmNowDiv',
  data () {
    return {
      // 参数，用于API请求
      param: {
        'userId': '',
        'Authorization': '',
        'sn': '',
        'apiKey': '',           // apikey值
        'deviceId': '',         // 当前设备ID号
        'time': '',
        'id': ''                // 报警数据ID   
      },
      // 报警信息列表
      alarmTableData: [{
        number: '',            // 编号
        id: '',               // 报警数据的ID
        name: '',             // 触发器名称
        content: '',          // 报警内容
        // state: '正常', // OK
        handleState: 0,       // 是否处理
        value: '',           // 报警数值
        time: ''             // 报警时间
      }],
      operation: true,               // 操作确认按键显示标志位
      loadingFlag: false             // 加载图标标志位
    }
  },
  created: function () {
    // 获取back调用关键参数
    this.param.userId = sessionGetStore('userId')
    this.param.Authorization = sessionGetStore('Authorization')
    this.param.sn = sessionGetStore('deviceSNNow')
    // 表格数据初始化
    this.alarmTableData = []
  },
  mounted: function () {
    // 获取当前未处理的报警信息
    this.backGetNowTriNot()
  },
  computed: {
    // alarmRefersh () {
    //   return this.$store.state.deviceAlarmAlaRefresh
    // }
  },
  watch: {
    /* 设备列表刷新
      父组件home stomp长链接接受报警推送，一旦报警，置deviceAlarmAlaRefresh = ture
      监听变化了，触发重查当前报警记录
      一切是建立在用户在报警页面上不动的基础上
    */
    // alarmRefersh: function (val) {
    //   if (val) {
    //     console.log('AlarmAlaRefresh')
    //     // 查询当前报警记录
    //     this.backGetNowTriNot()
    //     // 全局节点列表刷新标志位置false，已刷新
    //     this.$store.commit('setdeviceAlarmAlaRefresh', false)
    //   }
    // }
  },
  methods: {
    // 确认收到消息按键方法（确认之后下次就看不到这条报警信息了）
    confirmClick (index, row) {
      console.log('确认当前报警信息按键')
      console.log(index)
      console.log(row)
      this.param.id = row.id
      this.backTriNowConfirm()
    },
    /*
    **  ******************  API调用相关函数  ******************
    */
    // 获取当前未处理的报警信息
    backGetNowTriNot: function () {
      console.log(this.param)
      back.getNowTriNot(this.param).then(function (response) {
        console.log('显示当前未处理报警信息')
        console.log(response)
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
          return
        }
        let data = []
        if (response.data !== undefined) {
          for (let i = 0; i < response.data.length; i++) {
            let obj = {}
            obj.number = i + 1
            obj.id = response.data[i].id
            obj.name = response.data[i].name
            obj.content = response.data[i].content
            obj.value = response.data[i].value
            obj.time = response.data[i].time
            obj.handleState = response.data[i].handleState
            data[i] = obj
          }
        }
        this.alarmTableData = data
      }.bind(this))
    },
    // 确认当前报警
    backTriNowConfirm: function () {
      console.log(this.param)
      back.triNowConfirm(this.param).then(function (response) {
        console.log('确认当前报警')
        console.log(response)
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
          return
        }
        // 刷新当前未处理的报警信息列表
        this.backGetNowTriNot()
      }.bind(this))
    }
  }
}
</script>

<style>
.alarmnow {
  padding: 0;
  bottom: 0;
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
}
/* 这个自己加的，有点疑问，师兄是怎么搞得表格居中,这里写了加上scoped则都不起作用，不加scoped都会起作用，但是跳转到报警登记表格也是居中的，刷新报警登记又不居中了，刷新当前报警是剧中的 */
/* .el-table td {
  text-align: center;
} */
</style>
