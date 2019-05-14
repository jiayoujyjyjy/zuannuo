<template>
  <div class="globalSet" id="deviceSys">
    <el-row>
      <el-col :span="24">
        <el-form :inline="true" :model="formVersion" class="from-inline fromList-first" label-width="120px">
          <el-form-item label="固件版本：">
            <el-input readonly v-model="formVersion.version"></el-input>
          </el-form-item>
          <el-form-item>
          <el-button type="primary" @click="updateVersionCheckBt" v-show="upBtnShow">开始更新</el-button>
        </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24">
        <el-form :inline="true" class="from-inline" label-width="120px">
          <el-form-item label="版本说明：">
            <el-input readonly v-model="versionInfo"></el-input>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <!--更新设备对话框-->
    <el-dialog
      title="提示"
      :visible.sync="updateDialogVisible"
      width="30%"
      center>
      <span>确定更新设备{{param.sn}}么？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateDeviceBt">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { back } from 'api'
import { sessionGetStore } from '@/components/config/Utils'

export default {
  data () {
    return {
      // 参数，用于API请求
      param: {
        'sn': 'fdfd',
        'userId': '',
        'auth': 2,                                // 权限
        'apiKey': '',                             // apikey值
        'deviceId': '',                           // 当前设备ID号
        'deviceName': 'noname',                   // 当前设备设备名
        'online': 0                               // 当前设备在线状态，在线，离线
      },
      formVersion: {
        version: ''
      },
      upBtnShow: false,
      updateDialogVisible: false,
      serialSetLoading: null,
      versionInfo: '设备已是最新版'
    }
  },
  created: function () {
  // 获取back调用关键参数
    this.param.userId = sessionGetStore('userId')
    this.param.Authorization = sessionGetStore('Authorization')
    this.param.sn = sessionGetStore('deviceSNNow')
  },
  mounted: async function () {
    try {
      // 后台获取网关信息
      await this.backGetNetInfo()
      // 初始化获取网关版本号并检查网关是否需要更新
      this.backUpdateCheck()
    } catch (err) {
      console.log(err)
    }
  },
  methods: {
    // 开始更新按钮-打开dialog
    updateVersionCheckBt: function () {
      this.updateDialogVisible = true
    },
    // 开始网关更新
    updateDeviceBt: function () {
      this.serialSetLoading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.5)'
      })
      this.updateDialogVisible = false
      // 进行网关更新
      this.backUpdateGateway()
      console.log('进行网关更新')
    },
    //
    // ****************API方法函数***********************
    //
    // 设备信息查询
    backGetNetInfo: function () {
      console.log('设备信息查询')
      console.log(this.param)
      return new Promise(function (resolve, reject) {
        back.getNetInfo(this.param).then(function (response) {
          console.log(response)
          if (response.errno !== 0) {
            this.notificationInfo('错误提示', response.error)
            resolve()
          }
          // this.param.apiKey = response.data[0].apiKey
          // this.param.deviceId = response.data[0].deviceId
          // this.param.deviceName = response.data[0].title
          resolve()
        }.bind(this))
          .catch(function (error) {
            console.log(error)
            reject()
          })
      }.bind(this))
    },
    // 检查网关是否需要更新
    backUpdateCheck: function () {
      console.log('检查网关是否需要更新')
      console.log(this.param)
      back.gatewayUpdateCheck(this.param).then(function (response) {
        console.log(response)
        if (response.errno !== 0) {
          this.notificationInfo('提示', response.error)
          return
        }
        this.formVersion.version = response.data.version
        this.param.type = response.data.type
        if (response.data.need === false) {
          this.versionInfo = '设备已是最新版'
          this.notificationInfo('提示', '设备已是最新版')
        } else {
          this.versionInfo = '设备有最新版本'
          this.upBtnShow = true
        }
      }.bind(this))
    },
    // 网关更新
    backUpdateGateway: function () {
      console.log('网关更新')
      console.log(this.param)
      back.gatewayUpdate(this.param).then(function (response) {
        console.log(response)
        if (response.errno !== 0) {
          this.notificationInfo('提示', response.error)
        } else {
          this.notificationInfo('提示', '网关更新成功！')
        }
        this.serialSetLoading.close()
        // 初始化获取网关版本号并检查网关是否需要更新
        this.backUpdateCheck()
      }.bind(this)).catch(function (response) {
        this.serialSetLoading.close()
        // 初始化获取网关版本号并检查网关是否需要更新
        this.backUpdateCheck()
      })
    },
    /*
    *
    *   ******** 辅助方法函数 ********
    *
    */
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
.globalSet {
  background-color: #ffffff;
}
#deviceSys{
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
}
.from-inline {
  float: left;
  margin-left: 20px
}
.fromList-first {
  margin-top: 20px
}
</style>
