<template>
  <el-container>
    <div class="alarmauthority">
      <el-main class="alarmauthoritymain">
        <el-table
          v-loading="loadingFlag"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          :data="userTableData"
          border
          style="width: 100%"
          max-height = "450">
          <el-table-column
            fixed
            prop="name"
            label="用户名"
            header-align="center"
            min-width="25%">
          </el-table-column>
          <el-table-column
            prop="phone"
            label="手机号"
            header-align="center"
            min-width="25%">
          </el-table-column>
          <el-table-column
            prop="content"
            label="启用"
            header-align="center"
            min-width="25%">
          </el-table-column>
          <el-table-column
            label="操作"
            header-align="center"
            min-width="25%">
            <template slot-scope="scope">
              <el-button type="text" size="small" icon="el-icon-edit" @click="userEditInitBt(scope.$index, scope.row)">编辑</el-button>
              <el-button type="text" size="small" icon="el-icon-delete" @click="userDeleteBt(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <el-footer class="bottomfooter" height="60px">
        <div class="addpoint">
          <el-button type="primary" class="adduser" icon="el-icon-circle-plus-outline" @click="userAddInitBt">新增用户</el-button>
          <el-dialog title="新增联系人" width="400px" :visible.sync="dialogFormVisible" center>
            <el-form :model="userForm" :inline="true" :rules="rules">
              <el-form-item label="用户名" :label-width="formLabelWidth">
                <el-input v-model="userForm.name" placeholder="请输入用户名"></el-input>
              </el-form-item>
              <el-form-item label="手机号" :label-width="formLabelWidth" prop="phone">
                <el-input v-model="userForm.phone" ></el-input>
              </el-form-item>
              <el-form-item label="启 用" :label-width="formLabelWidth">
                <el-switch
                  v-model="userForm.flag"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  inactive-text=""
                  @change="changeswitch">
                </el-switch>
              </el-form-item>
            </el-form>
            <div slot="title" class="dialog-title" style="font-size:16px">{{operationName}}</div>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="userAddOrEditBt">确 定</el-button>
            </div>
          </el-dialog>
        </div>
      </el-footer>
    </div>
  </el-container>
</template>

<script>
import { back } from 'api'
import { sessionGetStore } from '@/components/config/Utils'

export default {
  // VUE内部数据
  data () {
    // 手机号验证    注意是写在return外面的函数
    var validatePhone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('手机号不能为空'))
      } else if (value.length !== 11) {
        callback(new Error('请输入11位手机号'))
      } else {
        callback()
      }
    }
    return {
      // 参数，用于API请求
      param: {
        'sn': 'fdfd',
        'apiKey': '',                         // apikey值
        'userId': '',                         // 用户ID号
        'contactUuid': '',
        'mobile': '',
        'productId': '',                      // 当前产品ID号
        'deviceId': '',                       // 当前设备ID号
        'deviceName': '',                     // 当前设备名
        'enable': 0                           // 1-启用 0-未启用
      },
      // 所有报警联系人列表信息
      userTableData: [{
        name: '',
        phone: '',
        content: '',
        flag: ''
      }],
      // 联系人表单对话框
      userForm: {
        name: '',
        phone: '',
        flag: true,
        index: 1
      },
      loadingFlag: false,
      formLabelWidth: '80px',
      formAddOrModify: 0,                     // 分组添加与编辑标志 0-add,1-modify
      dialogFormVisible: false,
      operationName: '',
      rules: {
        phone: [
          {validator: validatePhone, trigger: 'blur'}
        ]
      }
    }
  },
  created () {
    // 后台请求参数param设置
    this.param.userId = sessionGetStore('userId')
    this.param.Authorization = sessionGetStore('Authorization')
    this.param.sn = sessionGetStore('deviceSNNow')
  },
  mounted () {
    // 查询当前的报警联系人信息
    this.backGetTriConList()
  },
  methods: {
    // 新增报警联系人按键方法
    userAddInitBt: function () {
      this.userForm.index = this.userTableData.length
      this.userForm.uid = ''
      this.userForm.name = ''
      this.userForm.phone = ''
      this.userForm.flag = true
      this.formAddOrModify = 0
      this.dialogFormVisible = true
      this.operationName = '新增联系人'
    },
    // 编辑选中行报警联系人按键方法
    userEditInitBt: function (index, row) {
      console.log(index)
      console.log(row)
      this.userForm.index = index
      this.userForm.uid = this.userTableData[index].uid
      this.userForm.name = this.userTableData[index].name
      this.userForm.phone = this.userTableData[index].phone
      if (this.userTableData[index].flag) {
        this.userForm.flag = true
      } else {
        this.userForm.flag = false
      }
      this.formAddOrModify = 1
      this.dialogFormVisible = true
      this.operationName = '编辑联系人'
      // console.log('handleEdit')
    },
    // 删除选中行的报警联系人按键方法
    userDeleteBt: function (index, row) {
      console.log(index, row)
      this.param.id = row.uid
      this.backUserContactDel()
    },
    // 进行报警联系人的添加或者修改
    userAddOrEditBt: function () {
      // 存储用户输入的表单信息到一个容器param里，之后统一发往后台，进行报警联系人更改
      console.log(this.userForm)
      this.param.id = this.userForm.uid
      this.param.name = this.userForm.name
      this.param.mobile = this.userForm.phone
      // isEnable为1表示启用，0表示禁用
      if (this.userForm.flag === true) {
        this.param.enable = 1
      } else {
        this.param.enable = 0
      }
      if (this.formAddOrModify === 0) {
        this.backTriContactAdd()
      } else {
        this.backUserContactUpdate()
      }
      this.dialogFormVisible = false
    },
    // 查询报警联系人列表
    backGetTriConList: function () {
      back.getTriConList(this.param).then(function (response) {
        console.log(response)
        if (response.data !== undefined) {
          // 将报警联系人信息存储到本地
          this.userContactInfoStorge(response.data)
        }
      }.bind(this))
    },
    // 后台进行报警联系人的添加
    backTriContactAdd: function () {
      back.triContactAdd(this.param).then(function (response) {
        if (response.errno !== 0) {
          this.notificationInfo('添加失败，错误提示：', response.error)
        }
        // 查询报警联系人列表
        this.backGetTriConList()
      }.bind(this))
    },
    // 后台进行报警联系人信息的修改
    backUserContactUpdate: function () {
      back.triContactMod(this.param).then(function (response) {
        console.log(response)
        if (response.errno !== 1) {
          let obj = {}
          obj.uid = this.userForm.uid
          obj.name = this.userForm.name
          obj.phone = this.userForm.phone
          if (this.userForm.flag === true) {
            obj.content = '√'
            obj.flag = 1
          } else {
            obj.content = '×'
            obj.flag = 0
          }
          this.userTableData.splice(this.userForm.index, 1, obj)
        } else {
          this.notificationInfo('修改失败，错误提示：', response.error)
        }
      }.bind(this))
    },
    // 后台进行报警联系人的删除
    backUserContactDel: function () {
      back.triContactDel(this.param).then(function (response) {
        console.log(response)
        if (response.errno !== 1) {
          this.userTableData.splice(this.userForm.index, 1)
        } else {
          this.notificationInfo('删除失败，错误提示：', response.error)
        }
      }.bind(this))
    },
    // 报警联系人是否启用
    changeswitch: function () {
      // console.log('123')
    },
    /*
    //  ************  功能函数  **************
    */
    // 将报警联系人信息存储到本地
    userContactInfoStorge: function (Info) {
      let data = []
      if (Info.length !== undefined) {
        for (let i = 0; i < Info.length; i++) {
          let obj = {}
          obj.uid = Info[i].id
          obj.name = Info[i].name
          obj.phone = Info[i].mobile
          if (Info[i].enable) {
            obj.content = '√'
            obj.flag = 1
          } else {
            obj.content = '×'
            obj.flag = 0
          }
          obj.flag = Info[i].enable
          data[i] = obj
        }
      }
      this.userTableData = data
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

<style>
.alarmauthority {
  bottom: 0;
  width: 100%;
  overflow: hidden;
  position: relative;
  display: flex;
  display: -webkit-flex; /* Safari */
  flex-direction: column;
}
.alarmauthoritymain {
  padding: 0;
  overflow-x: hidden;
  height: 70%;
}
.el-main{
  padding: 0;
  flex: 1;
}
.el-footer {
  bottom:0px;
  left: 0px;
  background-color: #FFFFFF;
  color: #333;
  text-align: left;
  line-height: 60px;
}
.adduser {
  float: left;
  margin-left: 10px;
  margin-top: 10px;
}
</style>
