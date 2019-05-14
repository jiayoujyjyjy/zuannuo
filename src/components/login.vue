<template>
  <div class="out">
    <div class="login">
      <div class="titlediv">
        <img class="logoDiv" src="static/znLogo.png" alt="" >
        <span class="titlename">UltraBolts螺栓载荷实时监测系统</span>
      </div>
      <!--用户登录-->
      <el-form :model="ruleFormLogin" :rules="rulesLogin" ref="ruleFormLogin" v-show="loginShowFlag" label-position="left" label-width="0px" class="demo-ruleForm login-container">
        <h3 class="title">用户登录</h3>
        <el-form-item prop="account">
          <el-input type="text" @keyup.enter.native="userLandBt('ruleFormLogin')" v-model="ruleFormLogin.account" auto-complete="off" placeholder="请输入用户账号"></el-input>
        </el-form-item>
        <el-form-item prop="password" class="password">
          <el-input type="password" @keyup.enter.native="userLandBt('ruleFormLogin')" v-model="ruleFormLogin.password" auto-complete="off" placeholder="请输入密码"></el-input>
        </el-form-item>
        <!-- <el-button type="text" @click.native.prevent="regiterForm" class="toLogin">用户注册</el-button> -->
        <el-button type="text" class="toLogin">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
        <!-- <el-button type="text" @click.native.prevent="passwordForget" class="toRemember">忘记密码</el-button> -->
        <el-form-item style="width:100%;">
          <el-button type="primary" round style="width:100%;" @click.native.prevent="userLandBt('ruleFormLogin')" :loading="logining">确定</el-button>
        </el-form-item>
      </el-form>

      <!--忘记密码-->
      <el-form :model="ruleFormPass" :rules="rulesRetrieve" ref="ruleFormPass" v-show="passShowFlag" label-position="left" label-width="0px" class="demo-ruleForm login-container">
        <h3 class="title">找回密码</h3>
        <el-form-item prop="phone">
          <el-input type="text" v-model="ruleFormPass.phone" auto-complete="off" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item prop="VeriCode">
          <el-input type="text" v-model="ruleFormPass.VeriCode" auto-complete="off" placeholder="获取验证码">
          <el-button slot="append" v-show="!passwordComputedTime" @click.native.prevent="passGetVeriCode">获取验证码</el-button>
          <el-button slot="append" v-show="passwordComputedTime">已发送({{passwordComputedTime}}s)</el-button>
          </el-input>
        </el-form-item>
        <el-form-item prop="newPassword">
          <el-input type="password" v-model="ruleFormPass.newPassword" auto-complete="off" placeholder="请输入新密码"></el-input>
        </el-form-item>
        <el-form-item prop="newPasswordAgain" class="password">
          <el-input type="password" v-model="ruleFormPass.newPasswordAgain" auto-complete="off" placeholder="确认新密码"></el-input>
        </el-form-item>
        <el-button type="text" @click.native.prevent="backToLogin" class="remember">返回登录</el-button>
        <el-form-item style="width:100%;">
          <el-button type="primary" round style="width:100%;" @click.native.prevent="getPasswordBt('ruleFormPass')" :loading="logining">确定</el-button>
        </el-form-item>
      </el-form>

      <!--用户注册-->
      <el-form :model="ruleFormRegister" :rules="rulesRegister" ref="ruleFormRegister" v-show="registerShowFlag" label-position="left" label-width="0px" class="demo-ruleForm login-container">
        <h3 class="title">用户注册</h3>
        <el-form-item prop="account">
          <el-input type="text" v-model="ruleFormRegister.account" auto-complete="off" placeholder="用户账号"></el-input>
        </el-form-item>
        <el-form-item prop="phone">
          <el-input type="text" v-model="ruleFormRegister.phone" auto-complete="off" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item prop="VeriCode">
          <el-input type="text" v-model="ruleFormRegister.VeriCode" auto-complete="off" placeholder="获取验证码">
          <el-button slot="append" v-show="!regiterComputedTime" @click.native.prevent="registerGetVeriCode">获取验证码</el-button>
          <el-button slot="append" v-show="regiterComputedTime">已发送({{regiterComputedTime}}s)</el-button>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model="ruleFormRegister.password" auto-complete="off" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item prop="passwordAgain" class="password">
          <el-input type="password" v-model="ruleFormRegister.passwordAgain" auto-complete="off" placeholder="确认密码"></el-input>
        </el-form-item>
        <el-button type="text" @click.native.prevent="backToLogin" class="remember">返回登录</el-button>
        <el-form-item style="width:100%;">
          <el-button type="primary" round style="width:100%;" @click.native.prevent="userRegiterBt('ruleFormRegister')" :loading="logining">确定</el-button>
        </el-form-item>
      </el-form>

    </div>
  </div>
</template>

<script>
import { back } from 'api'
import { sessionSetStore, sessionRemoveStore } from '@/components/config/Utils'

export default {
  name: 'loginDiv',
  data () {
    // ***********表单输入规则校验***********
    // 校验用户账号
    var checkUserAccount = (rule, value, callback) => {
      var reg = /^[\u4e00-\u9fff\w]{3,18}$/
      if (value === '') {
        return callback(new Error('用户账号不能为空'))
      } else if (!reg.test(value)) {
        callback(new Error('只能包含数字、字母、汉字和下划线，长度在3~18之间'))
      } else {
        callback()
      }
    }
    // 校验密码
    var checkPassword = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('密码不能为空'))
      } else if (value.length > 20) {
        callback(new Error('密码长度不超过20位'))
      } else {
        callback()
      }
    }
    // 校验手机号
    var checkPhone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('手机号不能为空'))
      } else if (value.length !== 11) {
        callback(new Error('请输入11位手机号'))
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
    // 校验再次输入的密码(忘记密码)
    var checkPasswordAgainForget = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('密码不能为空'))
      } else if (value.length > 20) {
        callback(new Error('密码长度不超过20位'))
      } else if (value !== this.ruleFormPass.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    // 校验再次输入的密码（用户注册）
    var checkPasswordAgainRegister = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('密码不能为空'))
      } else if (value.length > 20) {
        callback(new Error('密码长度不超过20位'))
      } else if (value !== this.ruleFormRegister.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      param: {
        'account': '',
        'password': '',
        'userId': 0,
        'mobile': '',
        'email': '',
        'company': ''
      },
      passwordVeriCode: '',         // 忘记密码时的验证码
      regiterVeriCode: '',          // 用户注册时的验证码
      passwordComputedTime: 0,      // 忘记密码短信倒数记时
      regiterComputedTime: 0,       // 用户注册短信倒数记时
      loginShowFlag: false,         // 登陆表单显示标志位
      passShowFlag: false,          // 找回密码表单显示标志位
      registerShowFlag: false,      // 用户注册表单显示标志位
      logining: false,              // 确定按键--加载效果
      // 用户登录
      ruleFormLogin: {
        account: '',
        password: ''
      },
      rulesLogin: {
        account: [
          { validator: checkUserAccount, trigger: 'blur' }
        ],
        password: [
          { validator: checkPassword, trigger: 'blur' }
        ]
      },
      // 忘记密码
      ruleFormPass: {
        phone: '',
        VeriCode: '',
        newPassword: '',
        newPasswordAgain: '',
        VerCodeToken: '',
        VerPhone: ''
      },
      rulesRetrieve: {
        phone: [
          { validator: checkPhone, trigger: 'blur' },
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        VeriCode: [
          { validator: checkVeriCode, trigger: 'blur' }
        ],
        newPassword: [
          { validator: checkPassword, trigger: 'blur' },
          {min: 6, max: 16, message: '密码长度必须大于6位小于16位', trigger: 'blur'}
        ],
        newPasswordAgain: [
          { validator: checkPasswordAgainForget, trigger: 'blur' },
          {min: 6, max: 16, message: '密码长度必须大于6位小于16位', trigger: 'blur'}
        ]
      },
      // 用户注册
      ruleFormRegister: {
        account: '',
        phone: '',
        VeriCode: '',
        password: '',
        passwordAgain: '',
        VerCodeToken: '',
        VerPhone: ''
      },
      rulesRegister: {
        account: [
          { validator: checkUserAccount, trigger: 'blur' }
        ],
        phone: [
          { validator: checkPhone, trigger: 'blur' }
        ],
        VeriCode: [
          { validator: checkVeriCode, trigger: 'blur' }
        ],
        password: [
          { validator: checkPassword, trigger: 'blur' },
          {min: 6, max: 16, message: '密码长度必须大于6位小于16位', trigger: 'blur'}
        ],
        passwordAgain: [
          { validator: checkPasswordAgainRegister, trigger: 'blur' },
          {min: 6, max: 16, message: '密码长度必须大于6位小于16位', trigger: 'blur'}
        ]
      }
    }
  },
  computed: {},
  watch: {
    socket: function (val) {
      console.log(val)
      console.log('socketio' + val)
    }
  },
  //
  // *****************生命周期****************
  //
  // 生命周期钩子--创建期
  created: function () {
    // 清除浏览器本地存储
    sessionRemoveStore('sn')
    sessionRemoveStore('name')
    sessionRemoveStore('nameMe')
    sessionRemoveStore('password')
    sessionRemoveStore('userId')
    sessionRemoveStore('userIdMe')
    sessionRemoveStore('auth')
    sessionRemoveStore('authMe')
    this.loginShowFlag = true
    this.passShowFlag = false
    this.registerShowFlag = false
  },
  //
  // ****************方法函数***********************
  //
  methods: {
    // 用户登录
    userLandBt: function (ruleFormLogin) {
      console.log(ruleFormLogin)
      // 错误检查
      this.$refs[ruleFormLogin].validate((valid) => {
        console.log(valid)
        if (valid) {
          this.logining = true
          // 用户登录，用户账号登陆
          this.param = { account: this.ruleFormLogin.account, password: this.ruleFormLogin.password }
          this.backUserLogin()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // // 用户注册，进行表单的跳转
    // regiterForm: function () {
    //   // 数据初始化
    //   this.dataAllInit()
    //   this.loginShowFlag = false
    //   this.passShowFlag = false
    //   this.registerShowFlag = true
    // },
    // // 忘记密码，进行表单的跳转
    // passwordForget: function () {
    //   // 数据初始化
    //   this.dataAllInit()
    //   this.loginShowFlag = false
    //   this.passShowFlag = true
    //   this.registerShowFlag = false
    // },
    // 用户登录，进行表单的跳转
    backToLogin: function () {
      // 数据初始化
      this.dataAllInit()
      this.loginShowFlag = true
      this.passShowFlag = false
      this.registerShowFlag = false
    },
    // 用户注册，按键事件
    userRegiterBt: function (ruleFormRegister) {
      // 错误检查
      this.$refs[ruleFormRegister].validate((valid) => {
        console.log(valid)
        console.log('手机号码')
        console.log(this.ruleFormRegister)
        if (valid && this.ruleFormRegister.VeriCode === this.ruleFormRegister.VerCodeToken && this.ruleFormRegister.phone === this.ruleFormRegister.VerPhone) {
          this.logining = true
          this.param = {
            account: this.ruleFormRegister.account,
            company: '',
            mobile: this.ruleFormRegister.phone,
            password: this.ruleFormRegister.password,
            email: ''
          }
          // 用户注册，新增用户
          this.backRserRegister()
        } else {
          if (this.ruleFormRegister.VeriCode !== this.ruleFormRegister.VerCodeToken) {
            this.notificationInfo('错误提示', '验证码不正确')
          }
          if (this.ruleFormRegister.phone !== this.ruleFormRegister.VerPhone) {
            this.notificationInfo('错误提示', '手机号码未校验')
          }
          console.log('error submit!!')
          return false
        }
      })
    },
    // 忘记密码，按键事件
    getPasswordBt: function (ruleFormPass) {
      // 错误检查
      this.$refs[ruleFormPass].validate((valid) => {
        if (valid && this.ruleFormPass.VeriCode === this.ruleFormPass.VerCodeToken && this.ruleFormPass.phone === this.ruleFormPass.VerPhone) {
          this.logining = true
          this.param = { mobile: this.ruleFormPass.phone, password: this.ruleFormPass.newPassword }
          // 忘记密码，密码修改
          this.backUserPasswordMod()
        } else {
          if (this.ruleFormPass.VeriCode !== this.ruleFormPass.VerCodeToken) {
            this.notificationInfo('错误提示', '验证码不正确')
          }
          if (this.ruleFormPass.phone !== this.ruleFormPass.VerPhone) {
            this.notificationInfo('错误提示', '手机号码未校验')
          }
          console.log('error submit!!')
          return false
        }
      })
    },
    // 忘记密码，获取验证码
    passGetVeriCode: function () {
      if (/^1\d{10}$/gi.test(this.ruleFormPass.phone)) {
        this.passwordComputedTime = 60
        this.passTimer = setInterval(() => {
          this.passwordComputedTime--
          if (this.passwordComputedTime === 0) {
            clearInterval(this.passTimer)
          }
        }, 1000)
        this.param.mobile = this.ruleFormPass.phone
        // 发送短信验证信息
        this.backSmsSend()
      } else {
        this.notificationInfo('错误提示', '手机号格式不正确')
      }
    },
    // 用户注册，获取验证码
    registerGetVeriCode: function () {
      if (/^1\d{10}$/gi.test(this.ruleFormRegister.phone)) {
        this.regiterComputedTime = 60
        this.regiterTimer = setInterval(() => {
          this.regiterComputedTime--
          if (this.regiterComputedTime === 0) {
            clearInterval(this.regiterTimer)
          }
        }, 1000)
        this.param.mobile = this.ruleFormRegister.phone
        // 发送短信验证信息
        this.backSmsSend()
      } else {
        this.notificationInfo('错误提示', '手机号格式不正确')
      }
    },
    /*
    *
    *   ******** API调用函数 ********
    *
    */
    // 用户登录
    backUserLogin: function () {
      console.log('用户登录')
      console.log(this.param)
      back.userLogin(this.param).then(function (response) {
        console.log(response)
        this.logining = false
        if (response.errno > 0) {
          this.notificationInfo('错误提示', response.error)
          return
        }
        // if (!('data' in response)) {
        //   this.notificationInfo('错误提示', '用户名或密码错误，请重新登录')
        //   return
        // }
        if (response.data === undefined) {
          this.notificationInfo('错误提示', '用户名或密码错误，请重新登录')
          return
        }
        // 用户信息存储vuex localstorge
        this.userInfoStore(response)
        // 跳转到home页面
        this.$emit('transferuser', 'home')
      }.bind(this))
    },
    // 用户注册
    backRserRegister: function () {
      back.userRegister(this.param).then(function (response) {
        this.logining = false
        if (response.errno > 0) {
          this.notificationInfo('错误提示', response.error)
        } else {
          this.notificationInfo('提示', '注册用户成功！')
          this.loginShowFlag = true
          this.passShowFlag = false
          this.registerShowFlag = false
        }
      }.bind(this))
    },
    // 发送短信验证码
    backSmsSend: function () {
      console.log('发送短信验证码')
      console.log(this.param)
      back.relatioNetgate(this.param).then(function (response) {
        console.log(response)
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
          return
        }
        // 存储获取到的验证码
        // this.ruleFormPass.VerCodeToken = response.data[0].code
        this.ruleFormPass.VerPhone = this.param.mobile
        // this.ruleFormRegister.VerCodeToken = response.data[0].code
        this.ruleFormRegister.VerPhone = this.param.mobile
      }.bind(this))
    },
    /*
    *
    *   ******** 辅助方法函数 ********
    *
    */
    // 用户信息存储vuex localstorge
    userInfoStore: function (info) {
      // vuex存储
      this.$store.commit('setUserId', info.data.userId)
      // this.$store.commit('setUserName', this.param.account)           // 仅用作home页左上角显示用户名
      this.$store.commit('setUserName', info.data.name)               // 仅用作home页左上角显示用户名
      this.param.userId = info.data.userId                            // param此时为{username, password userId}
      let Authorization = 'Bearer' + ' ' + info.data.token
      this.$store.commit('setAuthorization', Authorization)
      // 浏览器本地存储（避免用户刷新页面数据丢失）
      sessionSetStore('name', info.data.name)
      sessionSetStore('nameMe', info.data.name)
      // sessionSetStore('account', info.data.account)
      sessionSetStore('account', this.param.account)
      sessionSetStore('password', this.param.password)
      sessionSetStore('userId', this.param.userId)
      sessionSetStore('userIdMe', this.param.userId)
      sessionSetStore('auth', info.data.auth)
      sessionSetStore('authMe', info.data.auth)
      sessionSetStore('Authorization', Authorization)
    },
    // 界面跳转，数据初始化
    dataAllInit: function () {
      // 用户登录，数据初始化
      this.ruleFormLogin = {
        account: '',
        password: ''
      }
      // 忘记密码，数据初始化
      this.ruleFormPass = {
        phone: '',
        VeriCode: '',
        newPassword: '',
        newPasswordAgain: '',
        VerCodeToken: '',
        VerPhone: ''
      }
      // 用户注册，数据初始化
      this.ruleFormRegister = {
        account: '',
        phone: '',
        VeriCode: '',
        password: '',
        passwordAgain: '',
        VerCodeToken: '',
        VerPhone: ''
      }
      this.passwordVeriCode = ''        // 忘记密码时的验证码
      this.regiterVeriCode = ''         // 用户注册时的验证码
      this.passwordComputedTime = 0     // 忘记密码短信倒数记时
      this.regiterComputedTime = 0      // 用户注册短信倒数记时
      if (this.regiterTimer !== undefined) {
        clearInterval(this.regiterTimer)
      }
      if (this.passTimer !== undefined) {
        clearInterval(this.passTimer)
      }
      this.logining = false
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
.out{
  position: absolute;
  top: 0px;
  bottom: 0px;
  width: 100%;
  height: 100%;
  background-image: url('/static/thingcom-bg.jpg');
  background-repeat:no-repeat;
  background-size:100% 100%;
  -moz-background-size:100% 100%;
}
.titlediv{
  margin-top: 9vh;
}
.titlename{
  color: white;
  /* font-size: 40px; */
  font-size: 28px;
}
/* .login {
  padding-top:15%;
  background-color: #878D99;
} */

.login-container {
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
    -webkit-border-radius: 5px;
    border-radius: 15px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 0 auto;
    margin-top: 3vh;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: rgba(48, 64, 57, 0.5);
    /*border: 1px solid #ffffff;*/
    box-shadow: 0 0 25px #cac1c6;
  }
.title{
  color: white;
  font-size: 20px;
}

.password {
  margin-bottom: 0px;
}
.toLogin {
  margin: 0px 100px 0px 0px;
  height: 10px;
}
.toRemember {
  margin: 0px 0px 0px 100px;
}
.remember {
  margin: 0px 0px 0px 260px;
}
.logoDiv {
  height: 31px;
  width: 31px;
}
</style>
