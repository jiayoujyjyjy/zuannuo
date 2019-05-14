<template>
  <div class="groupSet">
    <el-container>
      <!-- 编辑按钮部分 -->
      <el-header>
        <el-row>
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <el-button type="text" class="setButton" icon="el-icon-arrow-left" @click="backToMap">用户管理</el-button>
            </div>
          </el-col>
          <el-col :span="12"></el-col>
        </el-row>
      </el-header>
      <!-- 实际主要部分 -->
      <el-main class="setMain">
        <el-table
        :data="userTableData"
        border
        style="width: 100%">
        <el-table-column
          fixed
          prop="name"
          label="用户名称"
          header-align="center"
          min-width="15%">
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="手机号"
          header-align="center"
          min-width="20%">
        </el-table-column><el-table-column
          prop="company"
          label="公司名称"
          header-align="center"
          min-width="20%">
        </el-table-column>
        <el-table-column
          prop="auth"
          label="权限"
          header-align="center"
          min-width="15%">
        </el-table-column>
        <el-table-column
          prop="operation"
          label="操作"
          header-align="center"
          min-width="30%">
          <template slot-scope="scope">
            <el-button type="text" size="small" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)" v-show="editBtnShow">编辑</el-button>
            <el-button type="text" size="small" icon="el-icon-info" @click="handleRead(scope.$index, scope.row)">查看</el-button>
            <el-button type="text" size="small" icon="el-icon-delete" @click="handleDelete(scope.$index, scope.row)" v-show="delBtnShow">删除</el-button>
          </template>
        </el-table-column>
        </el-table>
      </el-main>
      <!-- 底部按钮、对话框部分 -->
      <el-footer>
        <el-button-group>
          <el-button type="primary" icon="el-icon-circle-plus-outline" @click="userAddBtn" v-show="addBtnShow">添加用户</el-button>
          <el-button type="primary" @click="goPersonalBtn">回到自己 <i class="el-icon-check"></i></el-button>
        </el-button-group>
        <el-dialog :title="diaTitle" :visible.sync="diaShow" @closed="diaClose" width="300px" center>
          <el-form ref="userForm" :model="userForm" :rules="rulesLogin">
            <el-form-item label="用户名" prop="name" label-width="80px">
              <el-input v-model="userForm.name" placeholder="请填写用户名"></el-input>
            </el-form-item>
            <el-form-item label="账号" prop="account" label-width="80px">
              <el-input v-model="userForm.account" type="text" placeholder="请填写账号" autocomplete="new-password"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password" label-width="80px">
              <el-input v-model="userForm.password" type="text" placeholder="请填写密码" autocomplete="new-password" onfocus="this.type='password'"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="mobile" label-width="80px">
              <el-input v-model="userForm.mobile" placeholder="请填写手机号码"></el-input>
            </el-form-item>
            <el-form-item label="公司" prop="company" label-width="80px">
              <el-input v-model="userForm.company" placeholder="请填写公司名称"></el-input>
            </el-form-item>
            <el-form-item label="权限设置" prop="auth" label-width="80px">
              <el-select v-model="userForm.auth" placeholder="请选择权限">
                <el-option
                  v-for="item in authOptions"
                  :key="item.authValue"
                  :label="item.authName"
                  :value="item.authValue">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <div class="footerBtn">
                <el-button @click="diaShow = false">取消</el-button>
                <el-button type="primary" @click="diaConfirmBtn('userForm')">确定</el-button>
              </div>
            </el-form-item>
          </el-form>
        </el-dialog>
        <!-- 删除提示输入密码确认对话框 -->
        <el-dialog :title="delDiaTitle" :visible.sync="delDiaShow" @closed="delDiaClose" width="300px" center>
          <el-form ref="delForm" :model="delForm" :rules="rulesDel">
            <el-form-item label="账号" prop="account" label-width="80px">
              <el-input v-model="delForm.account" type="text" placeholder="请填写账号" autocomplete="new-password"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password" label-width="80px">
              <!-- <el-input v-model="delForm.password" type="text" placeholder="请填写密码" autocomplete="new-password" @change="this.type='password'"></el-input> -->
              <!-- <el-input v-model="delForm.password" type="text" placeholder="请填写密码" autocomplete="new-password" @onfocus="this.type='password'"></el-input> -->
              <el-input v-model="delForm.password" type="text" placeholder="请填写密码" autocomplete="new-password" onfocus="this.type='password'"></el-input>
              <!-- <el-input v-model="delForm.password" type="text" placeholder="请填写密码" autocomplete="new-password" @change.native="this.type='password'"></el-input> -->
              <!-- <el-input v-model="delForm.password" type="text" v-show="passwordshow" ref="userinfo" placeholder="请填写密码" autocomplete="new-password" @focus="onfocus()"></el-input>
              <el-input v-model="delForm.password" type="password" v-show="!passwordshow" ref="userinfo" placeholder="请填写密码" autocomplete="new-password"></el-input> -->
            </el-form-item>
            <el-form-item>
              <div class="footerBtn">
                <el-button @click="delDiaShow = false">取消</el-button>
                <el-button type="primary" @click="delDiaConfirmBtn('delForm')">确定</el-button>
              </div>
            </el-form-item>
          </el-form>
        </el-dialog>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import Routers from '@/router'
import { back } from 'api'
import { sessionSetStore, sessionGetStore } from '@/components/config/Utils'

export default {
  name: 'gruopSetDiv',
  data () {
    // ***********表单输入规则校验***********
    // 校验用户名
    var checkName = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('用户名不能为空'))
      } else {
        callback()
      }
    }
    // 校验账号
    var checkAccount = (rule, value, callback) => {
      var reg = /^[\u4e00-\u9fff\w]{3,18}$/
      if (value === '') {
        return callback(new Error('账号不能为空'))
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
    var checkMobile = (rule, value, callback) => {
      if (value === '') {
        return callback()
      } else if (value.length !== 11) {
        callback(new Error('请输入11位手机号'))
      } else {
        callback()
      }
    }
    return {
      passwordshow: true,
      // 参数，用于API请求
      param: {
        userId: '123',
        name: ''
      },
      // 存储用户列表信息
      userTableData: [{
        name: '周涛hh',
        mobile: '123456',
        company: '轨物',
        auth: '超级管理员',
        password: '123456',
        account: 'zhoutao'
      }, {
        name: '杜坤',
        mobile: '13777899253',
        company: '轨物',
        auth: '管理员',
        password: '123456',
        account: 'zhoutao'
      }],
      // 存储用户表单信息
      userForm: {
        index: 1,
        name: '',
        account: '',
        password: '',
        mobile: '',
        company: '',
        auth: ''
        // groupId: ''
      },
      // 存储删除提示表单信息
      delForm: {
        index: 1,
        account: '',
        password: ''
      },
      // 存储权限选择框
      authOptions: [{
        authValue: '1',
        authName: '管理员'
      }, {
        authValue: '2',
        authName: '查看者'
      }, {
        authValue: '3',
        authName: '普通用户'
      }],
      // 表单验证
      rulesLogin: {
        name: [
          { required: true, validator: checkName, trigger: 'blur' }
        ],
        account: [
          { required: true, validator: checkAccount, trigger: 'blur' }
        ],
        password: [
          { required: true, validator: checkPassword, trigger: 'blur' }
        ],
        mobile: [
          { validator: checkMobile, trigger: 'blur' }
        ],
        auth: [
          { required: true, message: '请选择权限', trigger: 'change' }
        ]
      },
      // 删除表单验证
      rulesDel: {
        account: [
          { required: true, validator: checkAccount, trigger: 'blur' }
        ],
        password: [
          { required: true, validator: checkPassword, trigger: 'blur' }
        ]
      },
      formAddOrModify: 0,   // 分组添加与编辑标志 0-add,1-modify
      diaTitle: '',         // 对话框标题
      delDiaTitle: '身份确认',      // 删除对话框标题
      editBtnShow: true,    // 编辑按钮显示标志位
      delBtnShow: true,     // 删除按钮显示标志位
      addBtnShow: true,     // 添加按钮显示标志位
      diaShow: false,        // 是否显示对话框
      delDiaShow: false      // 删除提示密码确认对话框显示标志位
    }
  },
  computed: {
  },
  created () {
    // 如果刷新页面，则重新获取用户下挂信息 userId
    // this.param.userId = sessionGetStore('userId')
    this.param.userId = sessionGetStore('userIdMe')
    // 分组管理/设备添加/用户管理 按钮显示判断
    let auth = sessionGetStore('authMe')
    switch (auth) { // 注：auth位string类型
      case '0':
        this.editBtnShow = true
        this.delBtnShow = true
        this.addBtnShow = true
        // 超级管理员可再添加超级管理员用户
        this.authOptions = [
          { authValue: '0', authName: '超级管理员' },
          { authValue: '1', authName: '管理员' },
          { authValue: '2', authName: '查看者' }, 
          { authValue: '3', authName: '普通用户' }
        ]
        break
      case '1': 
        this.editBtnShow = true
        this.delBtnShow = false
        this.addBtnShow = true
        break
      case '2': 
        this.editBtnShow = false
        this.delBtnShow = false
        this.addBtnShow = false
        break
      default:
        this.editBtnShow = false
        this.delBtnShow = false
        this.addBtnShow = false
    }
  },
  mounted () {
    // back用户信息列表获取
    this.backUserInfoListQue()
  },
  methods: {
    // 表单-密码项获取焦点事件
    onfocus: function (e) {
      this.passwordshow = false
    },
    // 关闭对话框自动调用事件
    diaClose: function () {
      // 关闭表单验证
      this.$refs.userForm.resetFields()
    },
    // 关闭删除提示对话框自动调用事件
    delDiaClose: function () {
      // 关闭表单验证
      this.$refs.delForm.resetFields()
    },
    // 返回，跳转至地图页面
    backToMap () {
      Routers.push({ path: '/home/map' })
    },
    // 添加用户-打开对话框
    userAddBtn: function () {
      this.userForm.name = ''
      this.userForm.account = ''
      this.userForm.password = ''
      this.userForm.mobile = ''
      this.userForm.company = ''
      // this.userForm.auth = ''
      this.formAddOrModify = 0              // 0-添加 1-编辑
      // 初始化用户表单信息
      this.diaTitle = '添加用户'
      console.log('userTableData.length: ' + this.userTableData.length)
      this.userForm.index = this.userTableData.length
      this.diaShow = true
    },
    // 编辑当前用户-打开对话框
    handleEdit: function (index, row) {
      console.log(index)
      console.log(row)
      this.formAddOrModify = 1
      this.diaTitle = '编辑用户'
      this.userForm.name = this.userTableData[index].name
      this.userForm.account = this.userTableData[index].account
      // this.userForm.password = this.userTableData[index].password
      this.userForm.password = '******' // 假装从后台拿到了密码
      this.userForm.mobile = this.userTableData[index].mobile === '无' ? '' : this.userTableData[index].mobile
      this.userForm.company = this.userTableData[index].company === '无' ? '' : this.userTableData[index].company
      this.userForm.auth = this.userTableData[index].auth
      this.userForm.authCurRel = this.userTableData[index].authCurRel
      this.userForm.index = index
      this.userForm.userIdOther = row.userId
      this.diaShow = true
    },
    // 查看按钮
    handleRead: function (index, row) {
      console.log('查看按钮')
      console.log(index)
      console.log(row)
      sessionSetStore('name', row.name)
      sessionSetStore('userId', row.userId)
      let auth
      if (row.auth === '超级管理员') auth = 0
      if (row.auth === '管理员') auth = 1
      if (row.auth === '查看者') auth = 2
      if (row.auth === '普通用户') auth = 3
      sessionSetStore('auth', auth)
      // 全局网关列表刷新标志位置true，需要刷新
      this.$store.commit('setdeviceGroupRefresh', true)
    },
    // 对话框确定按键
    diaConfirmBtn: function (formName) {
      /* 
        如果是编辑用户，不写密码就不传password，去掉密码项的表单验证，让其placehold为空
        这里用了个迂回的方式，假设修改用户信息时，表单并未修改密码时，判断此时password为空，为其赋值'*******'
        这样就避免了去除密码表单验证必填项的繁琐
        之后后台请求时修改密码时判断是否为'*******',，若是则代表并未修改password，传递password参数为空即可
      */
      if (this.formAddOrModify === 1) {
        if (this.userForm.password === '******') { // 6个*与7个*
          this.userForm.password = '*******'
        }
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log('正确提交')
          console.log(this.userForm)
          // 根据this.userForm.auth 中文转化为对应代号 用在编辑用户切换
          switch (this.userForm.auth) {
            case '超级管理员':
              this.userForm.auth = 0
              break
            case '管理员':
              this.userForm.auth = 1
              break
            case '查看者':
              this.userForm.auth = 2
              break
            case '普通用户':
              this.userForm.auth = 3
              break
            default:
              console.log('default')
          }
          // 存储param参数
          for (let key in this.userForm) {                      // for...in循环操作对象
            this.param[key] = this.userForm[key]                // K值构建 (对象)
          }
          this.param.userIdOther = this.userForm.userIdOther
          if (this.formAddOrModify === 0) {
            this.backUserAdd()
          } else if (this.formAddOrModify === 1) {
            // 若是管理员，则不可以编辑超级管理员;
            // ...之前已针对管理员和超管理员作了""编辑"按钮显示隐藏
            if (this.userForm.authCurRel === 0) {
              if (sessionGetStore('authMe') !== '0') {
                this.diaShow = false
                this.notificationInfo('错误提示', '您没有此权限！')
                return
              }
            }
            if (this.param.password === '*******') {
              this.param.password = ''
            }
            this.backUserManagerMod()
          }
          this.diaShow = false
        } else {
          console.log('错误提交')
        }
      })
    },
    // 删除选中行的小组
    handleDelete: function (index, row) {
      console.log(index)
      console.log(row)
      if (row.auth === '超级管理员') {
        if (sessionGetStore('authMe') !== '0') {
          this.$message({
            type: 'info',
            message: '超级管理员不可修改删除'
          })
          return
        }
      }
      this.delDiaShow = true
      this.param.userIdOther = row.userId // 确定删除的是哪个用户
    },
    // 删除对话框确认按键
    delDiaConfirmBtn: function (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 用户身份验证，只有超级管理员才可以删除用户
          // 思路1. back确认用户信息登录,删除用户
          // this.param.account = this.delForm.account
          // this.param.password = this.delForm.password
          // this.backUserLogin()
          // 思路2. 直接和浏览器存储用户登录时的信息进行比对
          this.authIdentity(this.delForm)
          this.delDiaShow = false
        } else {
          console.log('错误提交')
        }
      })
    },
    // 回到自己按钮
    goPersonalBtn: function () {
      console.log('回到自己按钮')
      sessionSetStore('name', sessionGetStore('nameMe'))
      sessionSetStore('userId', sessionGetStore('userIdMe'))
      sessionSetStore('auth', sessionGetStore('authMe'))
      // 全局网关列表刷新标志位置true，需要刷新
      this.$store.commit('setdeviceGroupRefresh', true)
    },
    /*
    **  **********  API调用相关函数  **********
    */
    // back添加用户
    backUserAdd: function () {
      console.log('back添加用户')
      console.log(this.param)
      back.userAdd(this.param).then(function (response) {
        console.log(response)
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
          return
        }
        // back用户信息列表获取
        this.backUserInfoListQue()
      }.bind(this))
    },
    // back修改用户
    backUserManagerMod: function () {
      console.log('back修改用户')
      console.log(this.param)
      back.userManagerMod(this.param).then(function (response) {
        console.log(response)
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
          return
        }
        // back用户信息列表获取
        this.backUserInfoListQue()
      }.bind(this))
    },
    // back用户信息列表获取
    backUserInfoListQue: function () {
      console.log('back获取用户信息列表')
      console.log(this.param)
      back.userInfoListQue(this.param).then(function (response) {
        console.log(response)
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
        } else {
          let list = []
          for (let i = 0; i < response.data.length; i++) {
            let obj = {}
            obj.userId = response.data[i].userId
            obj.name = response.data[i].name
            obj.mobile = response.data[i].mobile === '' || response.data[i].mobile === undefined ? '无' : response.data[i].mobile
            obj.company = response.data[i].company === '' || response.data[i].company === undefined ? '无' : response.data[i].company
            obj.account = response.data[i].account
            obj.authCurRel = response.data[i].auth
            // back返给的auth 0,1,2,3 => 对应中文名称
            let auth
            if (response.data[i].auth === 0) auth = '超级管理员'
            if (response.data[i].auth === 1) auth = '管理员'
            if (response.data[i].auth === 2) auth = '查看者'
            if (response.data[i].auth === 3) auth = '普通用户'
            obj.auth = auth
            list[i] = obj
          }
          this.userTableData = list
        }
      }.bind(this))
    },
    // 编辑当前用户
    backUserMod: function () {
      console.log('back编辑/修改当前用户')
      console.log(this.param)
    },
    // 删除当前用户
    backUserDel: function () {
      console.log('back删除当前用户')
      console.log(this.param)
      back.userDel(this.param).then(function (response) {
        console.log(response)
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
          return
        }
        // back用户信息列表获取
        this.backUserInfoListQue()
      }.bind(this))
    },
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
        if (response.data === undefined) {
          this.notificationInfo('错误提示', '账号或密码错误，请重新输入')
          return
        }
        // 用户身份验证成功，back删除用户
        this.backUserDel()
      }.bind(this))
    },
    /*
    **  **********  辅助方法函数  **********
    */
    // 思路2. 直接和浏览器存储用户登录时的信息进行比对
    authIdentity: function (delForm) {
      if (delForm.account === sessionGetStore('account')  && delForm.password === sessionGetStore('password')) {
        console.log('用户身份认证成功')
        // 用户身份验证成功，back删除用户
        this.backUserDel()
      } else {
        this.notificationInfo('错误提示', '账号或密码错误，请重新输入')
      }
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
.setButton {
  font-size: 20px;
}
.el-container {
  display: flex;
  display: -webkit-flex; /* Safari */
  position: relative;
  width: 100%;
  min-height: 100vh;
  flex-direction: column;
  background-color: #FFFFFF;
}
.el-main {
  padding: 0px;
  flex: 1;
}
.groupSet >>> .el-header, .el-footer {
  background-color: #FFFFFF;
  color: #333;
  /* footer与header都在container容器内 => 可test-align */
  text-align: left;
  line-height: 60px;
  height: 60px;
}
.el-footer {
  bottom:0px;
  left: 0px;
}
/* .el-input {
  margin-top: 9px;
} */
.setmain{
  height: 100px;
  overflow: auto;
}
.el-dialog .el-dialog__header{
  text-align: center;
  color: rgb(65, 81, 226);
  background-color: #409EFF;
}
.groupSet >>> .el-form-item__content {
  text-align: center;
  /* margin-left: 0px; */
}
</style>
