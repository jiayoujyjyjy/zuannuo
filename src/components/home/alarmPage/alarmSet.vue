<template>
  <div class="alarmset">
    <el-row :gutter="20">
      <el-col :span="5">
        <div class="grid-content bg-purple span-right">
          <!-- button用作间距 -->
          <el-button type="text">&nbsp;</el-button>
          <span>允许报警数据推送 ：</span>
        </div>
      </el-col>
      <el-col :span="19">
        <div class="grid-content bg-purple span-left">
          <el-switch v-model="sendFlag" active-color="#ff4949" inactive-color="#13ce66" inactive-text="" @change="changeswitch"></el-switch>
          <el-button type="text">&nbsp;</el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 参数 用于API请求
      param: {
        'sn': '',
        'apiKey': '',
        'deviceId': '',
        'operation': 'stop'
      }
      // sendFlag: tru // 暂停/开始 监控数据推送 状态标识位
    }
  },
  created () {

  },
  mounted () {

  },
  methods: {
    // 拨动开关方法，选择是否推送数据
    changeswitch () {
      console.log(this.sendFlag)
      if (this.sendFlag) {
        this.param.operation = 'stop'
      } else {
        this.param.operation = 'start'
      }
      // 暂停/恢复 报警
      this.backAlarmSwitch()
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
.alarmset {
  width: 100%;
}
.span-left {
  float: left;
}
.span-right{
  display: table-cell;
  vertical-align: middle;
  float: right;
}
</style>
