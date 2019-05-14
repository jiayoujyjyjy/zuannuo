<template>
  <div id="userset">
    <!-- <h2>user page</h2> -->
    <el-row>
      <el-col :span="24">
        <el-form :inline="true" :model="formInline" class="from-title" label-width="120px">
          <el-form-item class="usertitle">
            <span  class="usertitletext">个人中心</span>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form :inline="true" :model="formInline" class="from-inline" label-width="100px">
          <el-form-item label="用户名">
            <el-input readonly v-model="formInline.name"></el-input>
          </el-form-item>
          <!-- <el-form-item>
          <el-button type="primary" @click="changenameBt">更改用户名</el-button>
        </el-form-item> -->
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form :inline="true" :model="formInline" class="from-inline" label-width="100px">
          <el-form-item label="公 司">
            <el-input readonly v-model="formInline.company"></el-input>
          </el-form-item>
          <!-- <el-form-item>
            <el-button type="primary" @click="changecompanyBt">更改公司</el-button>
          </el-form-item> -->
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form :inline="true" :model="formInline" class="from-inline" label-width="100px">
          <el-form-item label="手 机">
            <el-input readonly v-model="formInline.mobile"></el-input>
          </el-form-item>
          <!-- <el-form-item>
            <el-button type="primary" @click="changephoneBt">更改手机</el-button>
          </el-form-item> -->
          <!-- <el-form-item v-show="false">
            <el-button type="primary" @click="unbindphoneBt">解绑手机</el-button>
          </el-form-item> -->
        </el-form>
      </el-col>
    </el-row>
    <!-- <el-row>
      <el-col :span="24">
        <el-form :inline="true" :model="formInline" class="from-inline" label-width="100px">
          <el-form-item label="邮 箱">
            <el-input readonly v-model="formInline.mail"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="changemailBt">更改邮箱</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row> -->
    <!-- <el-row>
      <el-col :span="24">
        <el-form :inline="true" :model="formInline" class="from-inline" label-width="100px">
          <el-form-item label="用户ID">
            <el-input readonly v-model="formInline.userId"></el-input>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row> -->
    <!-- <el-row>
      <el-col :span="24">
        <el-form :inline="true" :model="formInline" class="from-inline" label-width="100px">
          <el-form-item label="密 码">
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="changepassBt">更改密码</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row> -->

    <!-- 更改手机号对话框 -->
    <el-dialog title="更改手机号" :visible.sync="phonedialogFormVisible" width="500px">
      <el-form ref="phoneruleform" :model="phoneruleform" :rules="rules" label-width="80px">
        <el-form-item label="手机号" prop="phone">
          <el-input type="text" v-model="phoneruleform.phone" auto-complete="off" placeholder="请输入手机号">
          <!-- <el-button slot="append" v-show="!passwordComputedTime" @click.native.prevent="phoneGetVeriCode">获取验证码</el-button>
          <el-button slot="append" v-show="passwordComputedTime">已发送({{passwordComputedTime}}s)</el-button> -->
          </el-input>
        </el-form-item>
        <!-- <el-form-item label="验证码" prop="VeriCode">
          <el-input type="text" v-model="phoneruleform.VeriCode" auto-complete="off" placeholder="请输入验证码"></el-input>
        </el-form-item> -->
        <el-form-item>
          <el-button type="primary" @click="changePhoneHandleSave('phoneruleform')">修改</el-button>
          <el-button @click="phonedialogFormVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 更改密码对话框 -->
    <el-dialog title="更改密码" :visible.sync="passdialogFormVisible" width="500px">
      <el-form ref="passruleform" :model="passruleform" :rules="rules" label-width="80px">
        <el-form-item label="旧密码" prop="oldpass">
          <el-input type="password" v-model="passruleform.oldpass"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newpass">
          <el-input type="password" v-model="passruleform.newpass"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmpass">
          <el-input type="password" v-model="passruleform.confirmpass"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="passHandleChange">修改</el-button>
          <el-button @click="passdialogFormVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script type="text/javascript">
import { back } from 'api'
import { sessionGetStore } from '@/components/config/Utils'
import 'element-ui/lib/theme-chalk/index.css'
export default {
  data  () {
    // 自定义校验规则
    // 旧密码
    var validatePassOld = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入旧密码'))
      } else if (value !== this.formInline.password) {
        callback(new Error('旧密码不正确'))
      } else {
        if (this.passruleform.newpass !== '') {
          this.$refs.passruleform.validateField('newpass')
        }
        callback()
      }
    }
    // 新密码
    var validatePassNew = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'))
      } else if (value === this.formInline.password) {
        callback(new Error('新密码不能与旧密码相同'))
      } else {
        if (this.passruleform.confirmpass !== '') {
          this.$refs.passruleform.validateField('confirmpass')
        }
        callback()
      }
    }
    // 确认新密码
    var validatePassConf = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.passruleform.newpass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    // 校验验证码
    var checkVeriCode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('验证码不能为空'))
      } else if (value.length !== 6) {
        callback(new Error('请输入6位验证码'))
      } else {
        callback()
      }
    }
    // 手机号验证
    var validatePhone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('手机号不能为空'))
      } else if (value.length !== 11) {
        callback(new Error('请输入11位手机号'))
      } else if (value === this.formInline.mobile) {
        callback(new Error('新手机号码不能与旧手机号码相同'))
      } else {
        callback()
      }
    }
    return {
      formInline: {
        name: '111',
        mobile: '222',
        mail: '333',
        company: '4444',
        password: '5555',
        userId: '6666'
      },
      phoneruleform: {
        phone: '',
        VeriCode: '',
        VerCodeToken: ''
      },
      passruleform: {
        oldpass: '',
        address: '',
        confirmpass: ''
      },
      param: {},
      // 校验规则
      rules: {
        phone: [
          {validator: validatePhone, trigger: 'blur'}
        ],
        VeriCode: [
          { validator: checkVeriCode, trigger: 'blur' }
        ],
        oldpass: [
          {validator: validatePassOld, trigger: 'blur'},
          {min: 6, max: 16, message: '密码长度必须大于6位小于16位', triiger: 'blur'}
        ],
        newpass: [
          {validator: validatePassNew, trigger: 'blur'},
          {min: 6, max: 16, message: '密码长度必须大于6位小于16位', triiger: 'blur'}
        ],
        confirmpass: [
          {validator: validatePassConf, trigger: 'blur'},
          {min: 6, max: 16, message: '密码长度必须大于6位小于16位', triiger: 'blur'}
        ]
      },
      phonedialogFormVisible: false, // 手机号修改对话框
      passdialogFormVisible: false // 密码修改对话框
    }
  },
  //
  // ***************生命周期*********************
  //
  // 生命周期钩子--创建期
  created: function () {
    /// 获取back调用关键参数
    this.param.userId = sessionGetStore('userId')
    this.param.Authorization = sessionGetStore('Authorization')
    this.param.sn = sessionGetStore('deviceSNNow')
  },
  // 生命周期钩子--安装期
  mounted: function () {
    // 获取用户信息
    this.backGetuserInfo()
  },
  methods: {
    // 更改用户名
    changenameBt () {
      this.$prompt('用户名', '更改用户名', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^[\u4e00-\u9fff\w]{3,18}$/,
        inputErrorMessage: '只能包含数字、字母、汉字和下划线，长度在3~18之间'
      }).then(({value}) => {
        this.formInline.name = value
        this.apiusermod()
      }).catch(() => {
      })
    },
    // 更改公司
    changecompanyBt () {
      this.$prompt('公司', '更改公司', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({value}) => {
        this.formInline.company = value
        this.apiusermod()
      }).catch(() => {
      })
    },
    // 更改手机号
    changephoneBt () {
      this.phoneruleform = {phone: '', VeriCode: ''}
      if (this.passTimer !== undefined) {
        clearInterval(this.passTimer)
      }
      this.phonedialogFormVisible = true
      this.passwordComputedTime = 0
      if (this.$refs.phoneruleform !== undefined) {
        this.$refs.phoneruleform.resetFields()
      }
    },
    // 更改密码
    changepassBt () {
      this.passruleform.oldpass = ''
      this.passruleform.address = ''
      this.passruleform.confirmpass = ''
      this.passdialogFormVisible = true
      if (this.$refs.phoneruleform !== undefined) {
        this.$refs.phoneruleform.resetFields()
      }
    },
    // 更改邮箱
    changemailBt () {
      this.$prompt('邮 箱', '更改邮箱', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
        inputErrorMessage: '格式不正确'
      }).then(({value}) => {
        console.log(value)
        this.formInline.mail = value
        this.apiusermod()
      }).catch(() => {
      })
    },
    // 确认密码修改
    passHandleChange () {
      this.$refs.passruleform.validate((valid) => {
        if (valid) {
          this.formInline.password = this.passruleform.newpass
          this.apiusermod()
          this.passdialogFormVisible = false
          this.passruleform.oldpass = ''
          this.passruleform.newpass = ''
          this.passruleform.confirmpass = ''
        } else {
          return false
        }
      })
    },
    /*
    **  ******************  API调用相关函数  ******************
    */
    // ******************   back   ****************************
    //
    // 用户信息获取
    backGetuserInfo: function () {
      back.getuserInfo(this.param).then(function (response) {
        console.log('用户信息获取')
        console.log(response)
        let obj = {}
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
        } else {
          if (response.data.length !== 0) {
            obj.name = response.data.name
            obj.mobile = response.data.mobile
            obj.company = response.data.company
            // obj.installTime = response.data.installTime
            // obj.mac = response.data.mac
            // obj.online = response.data.online
          }
        }
        this.formInline = obj
      }.bind(this))
    }
  }
}
</script>

<style scoped>
  #userset{
    background-color: #F8F8FF;
    overflow-y: auto;
  }
  .from-title{
    width: 100%;
    height: 100%;
    float: left;
    border-bottom: solid 1px silver;
    margin-bottom: 20px;
  }
  .usertitle {
    float: left;
    margin: 0;
     margin-left: 28px;
  }
  .from-inline {
    float: left;
    margin-left: 20px;
  }
  .usertitletext {
    color: black;
    font-size: 20px;
  }
  .el-message-box__header {
  position: relative;
  padding: 15px 15px 10px;
  background-color: #409EFF;
}
.el-message-box__title {
  padding-left: 0;
  margin-bottom: 0;
  font-size: 18px;
  line-height: 1;
  color: #303133;
  text-align: center;
}
.el-dialog__header {
  padding: 15px 15px 10px;
  background-color: #409EFF;
}
.el-dialog__title {
  line-height: 24px;
  font-size: 18px;
  color: #303133;
  text-align: center;
}
</style>
