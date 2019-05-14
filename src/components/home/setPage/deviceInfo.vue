<template>
  <div class="deviceSetInfo">
    <el-row :gutter="20">
      <el-col :span="3">
        <div class="span-right">
          <el-button class="lineFlag" type="text" icon="el-icon-arrow-right"></el-button>
          <span>网关名：</span>
        </div>
      </el-col>
      <el-col :span="21">
        <div class="span-left">
          <span>{{devInfo.name}}</span>
          <el-button type="text">&nbsp;</el-button>
          <el-button type="text" icon="el-icon-edit-outline" @click="changeDeviceNameBt" v-show="devNameBtnShow">更改网关名</el-button>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="3">
        <div class="span-right">
          <el-button class="lineFlag" type="text" icon="el-icon-arrow-right"></el-button>
          <span>网关SN：</span>
        </div>
      </el-col>
      <el-col :span="21">
        <div class="span-left">
          <span>{{devInfo.sn}}</span>
          <el-button type="text">&nbsp;</el-button>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="3">
        <div class="span-right">
          <el-button class="lineFlag" type="text" icon="el-icon-arrow-right"></el-button>
          <span>网关ID：</span>
        </div>
      </el-col>
      <el-col :span="21">
        <div class="span-left">
          <span>{{devInfo.deviceId}}</span>
          <el-button type="text">&nbsp;</el-button>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="3">
        <div class="span-right">
          <el-button class="lineFlag" type="text" icon="el-icon-arrow-right"></el-button>
          <span>操作者：</span>
        </div>
      </el-col>
      <el-col :span="21">
        <div class="span-left">
          <span>{{devInfo.operator}}</span>
          <el-button type="text">&nbsp;</el-button>
          <el-button type="text" icon="el-icon-edit-outline" @click="changeDevicehandlers" v-show="operBtnShow">更改操作者</el-button>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="3">
        <div class="span-right">
          <el-button class="lineFlag" type="text" icon="el-icon-arrow-right"></el-button>
          <span>安装公司：</span>
        </div>
      </el-col>
      <el-col :span="21">
        <div class="span-left">
          <span>{{devInfo.installCompany}}</span>
          <el-button type="text">&nbsp;</el-button>
          <el-button type="text" icon="el-icon-edit-outline" @click="changeDeviceCompany" v-show="companyBtnShow">更改安装公司</el-button>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="3">
        <div class="span-right">
          <el-button class="lineFlag" type="text" icon="el-icon-arrow-right"></el-button>
          <span>安装时间：</span>
        </div>
      </el-col>
      <el-col :span="21">
        <div class="span-left">
          <el-date-picker
            v-model="devInfo.installTime"
            align="right"
            :disabled="installTimeBtnShow"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="选择日期"
            @change="changeInstallTime"
            :picker-options="pickerOptions1">
          </el-date-picker>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="3">
        <div class="span-right">
          <el-button class="lineFlag" type="text" icon="el-icon-arrow-right"></el-button>
          <span>现场照片：</span>
        </div>
      </el-col>
      <el-col :span="21">
        <p></p>
        <div class="span-left">
         <el-upload
          :disabled="picUpBtnShow"
          :action="host"
          :accept="type"
          :show-file-list="fileListShow"
          :file-list="pictureList"
          list-type="picture-card"
          :limit="pictureNum"
          :data="ossParams"
          :before-upload="beforeUpload"
          :on-success="handleSuccess"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-exceed="onExceed">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
        </div>
      </el-col>
    </el-row>
    <p></p>
    <el-row :gutter="20">
      <el-col :span="3">
        <div class="grid-content bg-purple span-right">
          <el-button class="lineFlag" type="text" icon="el-icon-arrow-right"></el-button>
          <span>高级功能：</span>
        </div>
      </el-col>
      <el-col :span="21">
        <div class="grid-content bg-purple span-left">
          <el-button type="danger" size="medium" @click="delDeviceBt" :disabled="!this.delDevBtnShow">删除网关</el-button>
        </div>
      </el-col>
    </el-row>

    <!--删除网关对话框-->
    <el-dialog
      title="提示"
      :visible.sync="deleteDialogVisible"
      width="30%"
      center>
      <span>确定删除该网关{{param.sn}}么？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteDeviceBt">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import Routers from '@/router'
import { back } from 'api'
import { sessionGetStore } from '@/components/config/Utils'
import { character } from '@/components/config/Character'
export default {
  name: 'deviceInfo',
  data () {
    return {
      param: {
        'userId': '',
        'sn': '',
        'Authorization': ''
      },
      devInfo: {
        apiKey: '',
        sn: '',               // 当前网关SN
        name: '',             // 当前网关网关名
        deviceId: '',         // 当前网关网关ID
        operator: '',         // 当前网关操作者
        installCompany: '',   // 当前网关安装公司
        installTime: '',      // 当前网关安装时间
        location: {}          // 当前网关安装位置
      },
      dialogImageUrl: '',
      dialogVisible: false,
      // auth决定的操作权限按钮显示标志位
      devNameBtnShow: true,
      operBtnShow: true,
      companyBtnShow: true,
      delDevBtnShow: true, // 删除网关显示标志位
      installTimeBtnShow: false,
      picUpBtnShow: false,
      pickerOptions1: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [{
          text: '今天',
          onClick (picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '昨天',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周前',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
      },
      // 上传图片参数数据
      host: 'http://zhoutao-test.oss-cn-hangzhou.aliyuncs.com',      // 创建oss的外网地址
      type: 'image/*',                         //    
      fileListShow: true,                      // 是否显示已上传照片列表
      pictureNum: 2,
      // 从服务端获取到的签名数据
      ossParams: {
        OSSAccessKeyId: '',
        policy: '',
        signature: '',
        expire: '',
        key: '',                      // key后面有用，先默认设空字符串
        success_action_status: '200'  // 默认200
      },
      // 已上传文件列表
      pictureList: [],
      host1Flag: false,                 // 图片1地址是否已存在标志位 true-有 false-无
      host2Flag: false,                 // 图片2地址是否已存在标志位 true-有 false-无
      deleteDialogVisible: false,       // 删除网关对话框标志位
      deviceInfoLoading: null           // 网关操作loading标志位
    }
  },
  //
  // ***************生命周期*********************
  //
  // 生命周期钩子--创建期
  created: function () {
    // 获取back调用关键参数
    this.param.userId = sessionGetStore('userId')
    this.param.Authorization = sessionGetStore('Authorization')
    this.param.sn = sessionGetStore('deviceSNNow')
    this.param.online = sessionGetStore('deviceOnlineNow')
    // 分组管理/网关添加/用户管理 按钮显示判断
    if (sessionGetStore('authMe') === '0') {
      this.devNameBtnShow = true
      this.operBtnShow = true
      this.companyBtnShow = true
      this.installTimeBtnShow = false
      this.picUpBtnShow = false
      this.delDevBtnShow = true
    } else {
      this.devNameBtnShow = false
      this.operBtnShow = false
      this.companyBtnShow = false
      this.installTimeBtnShow = true
      this.picUpBtnShow = true
      this.delDevBtnShow = false
    }
    if (sessionGetStore('userId') === sessionGetStore('userIdMe')) {
      this.devNameBtnShow = true
      this.operBtnShow = true
      this.companyBtnShow = true
      this.installTimeBtnShow = false
      this.picUpBtnShow = false
      this.delDevBtnShow = true
    }
  },
  // 生命周期钩子--安装期
  mounted: function () {
    // 后台获取网关信息
    // debugger
    this.backGetNetInfo()
  },
  computed: {
  },
  methods: {
    // 修改网关名--弹出对话框
    changeDeviceNameBt: function () {
      this.$prompt('网关名', '更改网关名', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({value}) => {
        this.param.name = value
        // 网关信息修改
        this.backDeviceMod()
      }).catch(() => {
      })
    },
    // 修改操作者--弹出对话框
    changeDevicehandlers: function () {
      this.$prompt('操作者', '更改操作者', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({value}) => {
        this.param.operator = value
        // 网关信息修改
        this.backDeviceMod()
      }).catch(() => {
      })
    },
    // 修改安装公司--弹出对话框
    changeDeviceCompany: function () {
      this.$prompt('安装公司', '更改安装公司', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({value}) => {
        this.param.installCompany = value
        // 网关信息修改
        this.backDeviceMod()
      }).catch(() => {
      })
    },
    // 修改安装时间--弹出对话框
    changeInstallTime: function () {
      this.param.installTime = this.devInfo.installTime
      // 网关信息修改
      this.backDeviceMod()
    },
    /*
    **  ******************  照片相关方法函数  ******************
    */
    // 生成随机字符串
    randomString: function (len) {
      len = len || 32
      var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
      var maxPos = chars.length
      var pwd = ''
      for (let i = 0; i < len; i++) {
        pwd += chars.charAt(Math.floor(Math.random() * maxPos))
      }
      return pwd
    },
    // 上传之前的回调
    beforeUpload: async function (file) {
      console.log('上传之前的回调')
      console.log(file)
      // file.name = 'haha.png' // error: file为只读对象，其属性当然为只读的
      await this.backOssInfo(file)
    },
    // 上传成功的回调
    handleSuccess (res, file) {
      console.log('上传成功的回调')
      console.log(file)
      console.log(this.host1Flag, this.host2Flag)
      this.imageUrl = this.host + '/' + this.ossParams.key
      if (!this.host1Flag) {
        this.param.host1 = this.host + '/' + this.ossParams.key
        this.param.picture1 = this.ossParams.key
        this.host1Flag = true
        this.backDeviceMod()
      } else {
        this.param.host2 = this.host + '/' + this.ossParams.key
        this.param.picture2 = this.ossParams.key
        this.host2Flag = true
        this.backDeviceMod()
      }
    },
    // 文件列表移除文件时的钩子
    handleRemove: function (file, fileList) {
      console.log('移除的回调')
      console.log(this.pictureList)
      console.log(this.host1Flag, this.host2Flag)
      console.log(file)                 // 移除文件
      console.log(fileList)             // 剩余文件
      if (this.pictureList[0] !== undefined) {
        if (file.url === this.pictureList[0].url) {
          this.param.host1 = '图片1地址'
          // this.pictureList.splice(0, 1)
          this.backDeviceMod()
        }
      }
      if (this.pictureList[1] !== undefined) {
        if (file.url === this.pictureList[1].url) {
          this.param.host2 = '图片2地址'
          // this.pictureList.splice(1, 1)
          this.backDeviceMod()
        }
      }
      // this.backGetNetInfo()
    },
    // 点击文件列表中已上传的文件时的钩子
    handlePictureCardPreview (file) {
      console.log('点击文件列表中已上传的文件时回调')
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 文件超出个数限制时的钩子
    onExceed (files, fileList) {
      console.log(files)
      console.log(fileList)
      this.notificationInfo('错误提示', '最多只允许上传两张图片')
    },
    // 删除网关（打开对话框）
    delDeviceBt: function () {
      this.deleteDialogVisible = true
      console.log('删除网关（打开对话框）')
    },
    // 网关删除（对话框确认）
    deleteDeviceBt: function () {
      this.deviceInfoLoading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.5)'
      })
      this.deleteDialogVisible = false
      // 查询onenet上网关的状态信息，离线还是在线
      // 直接从back处获得网关在线离线信息，若离线则不可删除，之前的工业网关离线删除功能涉及到很多
      if (this.param.online === '离线') {
        this.notificationInfo('错误提示', '删除失败，该网关不在线')
        this.deviceInfoLoading.close()
        return
      }
      // back后台删除网关
      back.devDel(this.param).then(function (response) {
        console.log(response)
        if (response.errno === 1) {
          this.notificationInfo('错误提示', '删除失败')
        }
        if (response.errno === 0) {
          this.notificationInfo('成功提示', '删除成功')
          // 全局节点列表刷新标志位置true，需要刷新
          this.$store.commit('setdeviceGroupRefresh', true)
          Routers.push({ path: '/home/map' })
        }
        this.deviceInfoLoading.close()
      }.bind(this))
        .catch(function (error) {
          console.log(error)
          this.deviceInfoLoading.close()
        })
    },
    /*
    **  ******************  API调用相关函数  ******************
    */
    // ******************   back   ****************************
    //
    // 查询网关信息
    backGetNetInfo: function () {
      back.getNetInfo(this.param).then(function (response) {
        console.log('查询网关信息')
        // debugger
        console.log(response)
        let obj = {}
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
          return false
        } else {
          if (response.data.length !== 0) {
            obj.sn = response.data.sn
            obj.deviceId = response.data.deviceId
            obj.apiKey = response.data.apiKey
            obj.name = response.data.name
            obj.location = response.data.location
            obj.installTime = response.data.installTime
            obj.installCompany = response.data.installCompany
            obj.operator = response.data.operator
          }
        }
        this.devInfo = obj
        console.log(this.devInfo)
        // 上传照片模块处理
        console.log('图片信息1')
        console.log(this.pictureList)
        if (response.data.host1 === '图片1地址' || response.data.host1 === undefined) {
          response.data.host1 = ''
          response.data.picture1 = ''
          this.host1Flag = false
        } else {
          let imgObj1 = {}
          imgObj1.url = response.data.host1
          imgObj1.name = response.data.picture1
          if (this.pictureList[0] === undefined) {
            this.pictureList.push(imgObj1)
          }
          this.host1Flag = true
        }
        if (response.data.host2 === '图片2地址' || response.data.host2 === undefined) {
          response.data.host2 = ''
          response.data.picture2 = ''
          this.host2Flag = false
        } else {
          let imgObj2 = {}
          imgObj2.url = response.data.host2
          imgObj2.name = response.data.picture2
          if (this.pictureList[1] === undefined) {
            this.pictureList.push(imgObj2)
          }
          this.host2Flag = true
        }
        console.log('图片信息2')
        console.log(this.pictureList)
      }.bind(this))
    },
    // 修改网关信息
    backDeviceMod: function () {
      console.log('修改网关信息')
      console.log(this.param)
      back.devMod(this.param).then(function (response) {
        console.log(response)
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
        } else {
          // 获取网关信息
          this.backGetNetInfo()
        }
      }.bind(this))
    },
    // 获取oss签名数据
    backOssInfo: function (file) {
      return new Promise(function (resolve, reject) {
        back.ossInfo().then(function (response) {
          console.log(response)
          if (response === undefined) {
            this.notificationInfo('错误提示', response.error)
            reject()
          } else {
            this.ossParams.OSSAccessKeyId = response.accessid
            this.ossParams.policy = response.policy
            this.ossParams.signature = response.signature
            // this.ossParams.expire = response.expire
            // this.ossParams.key = `${this.type}/${this.randomString(10)}.${file.type.split('/').pop()}`
            // this.ossParams.key = file.name
            this.ossParams.key = sessionGetStore('userId') + character.randomWord(true, 9, 12)
            // this.ossParams.key = `${this.randomString(10)}.${file.type.split('/').pop()}`
            resolve()
          }
        }.bind(this))
      }.bind(this))
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
.deviceSetInfo {
  width: 100%;
  /* margin: 20px; */
  overflow-x: hidden;
  overflow-y: auto;
}
.span-left {
  float: left;
}
.span-right {
  display: table-cell;
  float: right;
  vertical-align: middle;
}
.el-icon-arrow-right {
  color: rgba(0, 135, 224, 0.959);
}
.lineFlag {
  /* 鼠标悬停,浏览器默认光标 */
  cursor: auto;
}
</style>
