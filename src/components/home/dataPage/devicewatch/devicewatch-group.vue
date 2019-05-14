<template>
  <div class="monitorgroup">
    <el-container>
      <el-main class="setmain">
        <el-table
          v-loading="loadingFlag"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          :data="nodeListData"
          border
          style="width: 100%"
          >
          <el-table-column
            fixed
            prop="index"
            label="序号"
            header-align="center"
            min-width="5%">
          </el-table-column>
          <el-table-column
            fixed
            prop="online"
            label="状态"
            header-align="center"
            min-width="5%">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" :content="scope.row.promptInfo"  placement="right">
                <el-button type="text" :icon="(scope.row.online === 1) ? 'el-icon-check': 'el-icon-close'"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="名称"
            header-align="center"
            min-width="13%">
          </el-table-column>
          <el-table-column
            prop="collectorId"
            label="采集器ID"
            header-align="center"
            min-width="13%">
          </el-table-column>
          <el-table-column
            prop="location"
            label="安装位置"
            header-align="center"
            min-width="19%">
          </el-table-column>
          <el-table-column
            prop="installTime"
            label="安装时间"
            header-align="center"
            min-width="20%"
            format="yyyy-MM-dd">
          </el-table-column>
          <el-table-column
            prop="mac"
            label="节点mac"
            header-align="center"
            min-width="15%">
          </el-table-column>
          <el-table-column
            prop="slaveAddress"
            label="站号"
            header-align="center"
            min-width="6%">
          </el-table-column>
          <el-table-column
            prop="operation"
            label="操作"
            header-align="center"
            min-width="25%">
            <template slot-scope="scope">
              <!-- <el-button type="text" size="small" icon="el-icon-info" @click="handleInfo(scope.$index, scope.row)">详情</el-button> -->
              <el-button type="text" size="small" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button type="text" size="small" icon="el-icon-delete" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <!-- 添加节点按钮和对话框 -->
      <el-footer>
        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="groupaddinit" :disabled="!this.addBtnShow">添加节点</el-button>
        <el-dialog title="编辑节点" :visible.sync="nodeDialogShow" width="740px" center @close="dialogClosed">
          <el-form :model="diaNodeInfoForm" :inline="true" label-width="80px" size="medium">

            <!-- 对话框第一部分内容-节点主要信息 -->
            <i class="diaPartTitle">主要信息 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - </i>
            <el-row>
              <el-col :span="12">
                <el-form-item label="名称" :label-width="formLabelWidth">
                  <el-input v-model="diaNodeInfoForm.name" placeholder="请输入名称"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="采集器ID" :label-width="formLabelWidth">
                  <el-input v-model="diaNodeInfoForm.collectorId" placeholder="请输入采集器ID"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="从机地址" :label-width="formLabelWidth">
                  <el-input-number v-model="diaNodeInfoForm.slaveAddress" controls-position="right" :min="slaveAdrRange.min" :max="slaveAdrRange.max"></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="节点mac" :label-width="formLabelWidth">
                  <el-input v-model="diaNodeInfoForm.mac" placeholder="请输入节点mac"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="安装位置" :label-width="formLabelWidth">
                  <el-input v-model="diaNodeInfoForm.location" placeholder="请输入安装位置"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="安装日期" :label-width="formLabelWidth">
                    <el-date-picker
                        class="timePicker"
                        v-model="diaNodeInfoForm.installTime"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            
            <!-- 对话框第二部分内容-节点螺栓信息 -->
            <i class="diaPartTitle">螺栓信息 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - </i>
            <el-row>
              <el-col :span="12">
                <el-form-item label="螺栓规格" :label-width="formLabelWidth">
                  <el-input v-model="diaNodeInfoForm.boltFormat" placeholder="请输入规格"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="螺栓厂家" :label-width="formLabelWidth">
                  <el-input v-model="diaNodeInfoForm.boltFactory" placeholder="请输入厂家"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="螺母厂家" :label-width="formLabelWidth">
                  <el-input v-model="diaNodeInfoForm.nutFactory" placeholder="请输入厂家"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="螺栓材料" :label-width="formLabelWidth">
                  <el-input v-model="diaNodeInfoForm.boltMaterial" placeholder="请输入螺栓材料"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="螺栓等级" :label-width="formLabelWidth">
                  <el-select v-model="diaNodeInfoForm.boltGrade" placeholder="请选择螺栓等级">
                    <el-option label="8.8" value="8.8"></el-option>
                    <el-option label="10.9" value="10.9"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="表面处理" :label-width="formLabelWidth">
                  <el-input v-model="diaNodeInfoForm.surfaceHandle" placeholder="请输入表面处理方式"></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <!-- 对话框第三部分内容-节点安装信息 -->
            <i class="diaPartTitle">安装信息 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - </i>
            <el-row>
              <el-col :span="12">
                <el-form-item label="预紧力" :label-width="formLabelWidth">
                  <el-input v-model="diaNodeInfoForm.preload" placeholder="请输入目标预紧力"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="安装公司" :label-width="formLabelWidth">
                  <el-input v-model="diaNodeInfoForm.company" placeholder="请输入公司名称"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="拧紧方式" :label-width="formLabelWidth">
                  <el-select v-model="diaNodeInfoForm.screwMethod" @change="changeTightWay" placeholder="选择拧紧方式">
                    <el-option label="拧紧工具" value="screwTool"></el-option>
                    <el-option label="拉伸工具" value="tenseTool"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="操作员" :label-width="formLabelWidth">
                  <el-input v-model="diaNodeInfoForm.operator" placeholder="请输入姓名"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <!-- 拧紧方式选择 -->
            <el-row v-show="diaNodeInfoForm.screwToolSelectedShow">
              <el-col :span="12">
                <el-form-item label="拧紧工具" :label-width="formLabelWidth">
                  <el-input v-model="diaNodeInfoForm.screwTool" placeholder="品牌及型号"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="拧紧扭矩" :label-width="formLabelWidth">
                  <el-input v-model="diaNodeInfoForm.screwTorque" placeholder="安装扭矩大小"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-show="diaNodeInfoForm.tenseToolSelectedShow">
              <el-col :span="12">
                <el-form-item label="拉伸工具" :label-width="formLabelWidth">
                  <el-input v-model="diaNodeInfoForm.tenseTool" placeholder="品牌及型号"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="安装拉力" :label-width="formLabelWidth">
                  <el-input v-model="diaNodeInfoForm.drawingForce" placeholder="安装拉力大小"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="润滑方式" :label-width="formLabelWidth">
                  <el-input v-model="diaNodeInfoForm.lubricate" placeholder="螺纹上的润滑情况"></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <!-- 对话框第四部分内容-照片模块息 -->
            <el-row v-if="uploadShow">
              <el-col :span="12">
                <el-form-item label="安装图片" :label-width="formLabelWidth">
                  <el-upload
                  :action="host"
                  :accept="type"
                  :show-file-list="fileListShow"
                  :file-list="pictureList"
                  list-type="picture"
                  :limit="pictureNum"
                  :data="ossParams"
                  :auto-upload="autoUpload"
                  :before-upload="beforeUpload"
                  :on-success="handleSuccess"
                  :on-preview="handlePictureCardPreview"
                  :on-remove="handleRemove"
                  :on-exceed="onExceed">
                  <i class="el-icon-plus"></i>
                </el-upload>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>

          <div slot="title" class="dialog-title" style="font-size:16px">{{operationName}}</div>
          <div slot="footer" class="dialog-footer">
            <el-button @click="nodeDialogShow = false">取 消</el-button>
            <el-button type="primary" @click="handleGroup('diaNodeInfoForm')">确 定</el-button>
          </div>
        </el-dialog>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import { back } from 'api'
import { sessionGetStore } from '@/components/config/Utils'
import { character } from '@/components/config/Character'
export default {
  data () {
    return {
      // 参数，用于API请求
      param: {
        'userId': '',
        'Authorization': '',
        'sn': '',
        'collectorId': '',
        'apiKey': '',
        'mac': '',
        'needSend': '',                       // 1表示客户修改了从站地址，0表示该参数没有修改
        'location': '',
        'tenseTool': '',
        'drawingForce': '',
        'screwTorque': '',
        'screwTool': ''
      },
      // 实际存储当前页面所有采集器信息
      nodeListData: [{
        index: '1',                              // 表格索引号
        online: '在线',                          // 标识当前采集器是在线还是离线
        promptInfo: '条目已下发',                // 采集器提示信息（条目已下发，条目未下发）
        name: '1号采集器',                       // 采集器名称
        collectorId: '1111111',                 // 采集器ID号
        slaveAddress: '1',                      // 从机地址
        mac: '22222',                           // 节点MAC
        location: '塔筒中平台',                  // 节点安装位置
        installTime: '2018-12-17',              // 节点安装时间
        fileList: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}, {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}],
        boltFormat: 'M36 X 4',                 // 螺栓规格
        boltFactory: '上海申光',                // 螺栓厂家
        nutFactory: '上海钻诺',                 // 螺母厂家
        boltMaterial: '42CrMoA',               // 螺栓材料
        boltGrade: '8.8',                      // 螺栓级别
        surfaceHandle: '达克罗',               // 螺栓表面处理
        preload: '510Kn',                      // 目标预紧力
        company: '上海钻诺',                   // 安装公司
        operator: '张伟',                      // 操作员
        screwMethod: 'screwTool',                   // 拧紧方式
        screwToolSelectedShow: false,                // 拧紧工具组模板加载标志位 true-显示，false-不显示
        tenseToolSelectedShow: false,             // 拉伸工具组模板加载标志位 true-显示，false-不显示
        screwTool: 'Junoup UBTU-3',           // 拧紧工具
        tenseTool: 'Junoup UBMT-M36',         // 拉紧工具
        screwTorque: '2500Nm',                // 拧紧扭矩
        drawingForce: '600Kn',                // 安装拉伸力
        lubricate: '半润滑'                   // 润滑方式
      }],
      // 存储节点对话框表单信息(当前选中节点)
      diaNodeInfoForm: {
        index: 1,                           // 存储当前选择第几行
        name: '',                           // 采集器名称
        collectorId: '',                    // 采集器ID号
        slaveAddress: 0,                    // 从机地址
        mac: '',                            // 数据推送频率
        location: '',                       // 采集器位置
        installTime: '',                    // 采集器安装时间
        fileList: [{name: '', url: ''}],    // 采集器上传照片
        boltFormat: '',                     // 螺栓规格
        boltFactory: '',                    // 螺栓厂家
        nutFactory: '',                     // 螺母厂家
        boltMaterial: '',                   // 螺栓材料
        boltGrade: '',                      // 螺栓级别
        surfaceHandle: '',                  // 螺栓表面处理
        preload: '',                        // 目标预紧力
        company: '',                        // 安装公司
        operator: '',                       // 操作员
        screwMethod: '',                       // 拧紧方式
        screwToolSelectedShow: false,              // 拧紧工具组模板加载标志位 true-显示，false-不显示
        tenseToolSelectedShow: false,           // 拉伸工具组模板加载标志位 true-显示，false-不显示
        screwTool: '',                      // 拧紧工具
        tenseTool: '',                      // 拉紧工具
        screwTorque: '',                    // 拧紧扭矩
        drawingForce: '',                   // 安装拉伸力
        lubricate: ''                       // 润滑方式
      },
      // 存储从机地址可选范围
      slaveAdrRange: {
        min: 1,
        max: 253
      },
      formAddOrModify: 0,                  // 分组添加与编辑标志 0-add,1-modify
      nodeDialogShow: false,               // 节点添加/删除 对话框显示标志位
      loadingFlag: false,                  // 加载图标标志位
      formLabelWidth: '80px',              // 对话框表单宽度
      operationName: '编辑采集器',          // 对话框标题
      // 添加/编辑/删除/对话框中确定按键 显示标志位
      addBtnShow: true,
      editBtnShow: true,
      delBtnShow: true,
      confirmBtnShow: true,
      uploadShow: false,                      // 是否显示上传照片组件 true-显示 false-隐藏
      // 上传图片参数数据
      host: 'http://zhoutao-test.oss-cn-hangzhou.aliyuncs.com',      // 创建oss的外网地址
      type: 'image/*',                         //    
      fileListShow: true,                      // 是否显示已上传照片列表
      pictureNum: 2,
      autoUpload: true,
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
      host2Flag: false                 // 图片2地址是否已存在标志位 true-有 false-无      
    }
  },
  computed: {
    // nodeAuthRefresh () {
    //   return this.$store.state.nodeAuthRefresh
    // }
  },
  watch: {
    // nodeAuthRefresh: function (val) {
    //   if (val) {
    //     console.log('节点权限刷新标志')
    //   }
    // }
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
    // 获取onenet调用关键参数
    // 分组管理/设备添加/用户管理 按钮显示判断
    if (sessionGetStore('authMe') === '0') {
      this.addBtnShow = true
      this.editBtnShow = true
      this.delBtnShow = true
      this.confirmBtnShow = true
    } else {
      this.addBtnShow = false
      this.editBtnShow = false
      this.delBtnShow = false
      this.confirmBtnShow = false
    }
    if (sessionGetStore('userId') === sessionGetStore('userIdMe')) {
      this.addBtnShow = true
      this.editBtnShow = true
      this.delBtnShow = true
      this.confirmBtnShow = true
    }
  },
  // 生命周期钩子--安装期
  mounted: function () {
    // 初始化表格数据，避免back请求延迟造成页面卡顿
    this.nodeListData = []
    // 获取网关下节点列表信息
    this.backDevNodeListQue()
  },
  methods: {
    /*
    //  ************  用户操作触发方法  ************
    */
    // 添加节点-打开对话框
    groupaddinit: function () {
      if (!this.addBtnShow) {
        this.notificationInfo('错误提示', '您没有此权限，请联系管理员')
        return
      }
      this.formAddOrModify = 0
      this.uploadShow = false
      this.operationName = '添加采集器'
      // 给表单设定初值,手动填充
      this.nodeFormDataFill(this.nodeListData.length, '', '', 1, '', '', '', [], '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '')
      this.nodeDialogShow = true
    },
    // 编辑节点-打开对话框
    handleEdit: function (index, row) {
      if (!this.editBtnShow) {
        this.notificationInfo('错误提示', '您没有此权限，请联系管理员')
        return
      }
      this.formAddOrModify = 1                              // 节点添加/编辑标志位 
      this.uploadShow = true
      this.operationName = '编辑监控点'
      this.param.mac = row.mac                              // 查询当前节点信息需要当前节点MAC
      // back获取当前节点详细信息
      this.backDevNodeInfoQue(index)
    },
    // 拧紧方式选择改变事件
    changeTightWay (tightWaySelectedItem) {
      if (tightWaySelectedItem === 'screwTool') {
        this.diaNodeInfoForm.screwToolSelectedShow = true
        this.diaNodeInfoForm.tenseToolSelectedShow = false
      } else {
        this.diaNodeInfoForm.screwToolSelectedShow = false
        this.diaNodeInfoForm.tenseToolSelectedShow = true
      }
    },
    // 添加/编辑节点确认按键
    handleGroup: function () {
      if (!this.confirmBtnShow) {
        this.notificationInfo('错误提示', '您没有此权限，请联系管理员')
        return
      }
      if (this.formAddOrModify === 0) {
        this.devNodeAdd()
      } else if (this.formAddOrModify === 1) {
        this.devNodeEdit()
      }
      this.nodeDialogShow = false
    },
    // 对话框关闭事件
    dialogClosed: function () {
      console.log('对话框关闭事件2')
      this.pictureList = [] // 初始化图片列表，防止点击其他节点继承遗留在上个节点的数据
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
        if (this.formAddOrModify === 0) {
          this.devNodeAdd()
        } else if (this.formAddOrModify === 1) {
          this.devNodeEdit() // 数据库设置了必选项，不传必选项则报指针空错误
        }
      } else {
        this.param.host2 = this.host + '/' + this.ossParams.key
        this.param.picture2 = this.ossParams.key
        this.host2Flag = true
        if (this.formAddOrModify === 0) {
          this.devNodeAdd()
        } else if (this.formAddOrModify === 1) {
          this.devNodeEdit()
        }
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
          // this.backChangeNode()
          this.devNodeEdit()
        }
      }
      if (this.pictureList[1] !== undefined) {
        if (file.url === this.pictureList[1].url) {
          this.param.host2 = '图片2地址'
          // this.pictureList.splice(1, 1)
          // this.backChangeNode()
          this.devNodeEdit()
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
    /*
    **  ******************  API调用相关函数  ******************
    */
    // 后台查询网关下节点列表信息
    backDevNodeListQue: function () {
      back.relatioNode(this.param).then(function (response) {
        console.log('后台查询网关下节点列表信息')
        console.log(response)
        let list = []
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
        } else {
          for (let i = 0; i < response.data.length; i++) {
            let obj = {}
            obj.index = i + 1
            obj.name = response.data[i].name
            obj.collectorId = response.data[i].collectorId
            obj.location = response.data[i].location
            obj.installTime = response.data[i].installTime
            obj.mac = response.data[i].mac
            obj.slaveAddress = response.data[i].slaveAddress
            obj.online = response.data[i].online
            obj.promptInfo = response.data[i].online ? '在线' : '离线'
            list[i] = obj
          }
        }
        this.nodeListData = list
        this.loadingFlag = false
      }.bind(this))
    },
    // 后台添加节点
    backAddNode: function () {
      back.addNode(this.param).then(function (response) {
        console.log('后台添加节点')
        console.log(response)
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
        } else {
          // 后台查询网关下节点列表信息
          this.backDevNodeListQue()
        }
        this.loadingFlag = false
      }.bind(this))
    },
    // 后台删除节点
    backDeleteNode: function () {
      back.deleteNode(this.param).then(function (response) {
        console.log('后台删除节点')
        console.log(response)
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
        } else {
          // 查询后台的所有监控点信息（重新渲染组件时操作）
          this.backDevNodeListQue()
        }
        this.loadingFlag = false
      }.bind(this))
    },
    // 后台修改节点信息
    backChangeNode: function () {
      back.changeNode(this.param).then(function (response) {
        console.log('后台修改节点')
        console.log(response)
        // this.pictureList = [] // 初始化图片列表，防止点击其他节点继承遗留在上个节点的数据
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
        } else {
          // 查询后台的所有节点列表信息（重新渲染组件时操作）
          this.backDevNodeListQue()
        }
      }.bind(this))
    },
    // 后台查询节点详细信息
    backDevNodeInfoQue: function (index) {
      back.devNodeInfoQue(this.param).then(function (response) {
        console.log('后台查询节点详细信息')
        console.log(response)
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
          return
        }
        // 编辑按钮->后台查询当前节点信息->填充表单数据
        this.nodeFormDataFill(
          index,
          response.data.name,
          response.data.collectorId,
          response.data.slaveAddress,
          response.data.mac,
          response.data.location,
          response.data.installTime,
          response.data.fileList,                       // 暂未设置
          response.data.boltFormat,
          response.data.boltFactory,
          response.data.nutFactory,
          response.data.boltMaterial,
          response.data.boltGrade,
          response.data.surfaceHandle,
          response.data.preload,
          response.data.company,
          response.data.operator,
          response.data.tightWay,
          response.data.screwToolSelectedShow,
          response.data.tenseToolSelectedShow,
          response.data.screwTool,
          response.data.tenseTool,
          response.data.screwTorque,
          response.data.drawingForce,
          response.data.lubricate
          // response.data.picture1,
          // response.data.host1,
          // response.data.picture2,
          // response.data.host2,
        )
        this.nodeDialogShow = true // 打开节点编辑对话框
        if (this.diaNodeInfoForm.screwMethod === 'screwTool') {
          this.diaNodeInfoForm.screwToolSelectedShow = true
        } else {
          this.diaNodeInfoForm.tenseToolSelectedShow = true
        }
        console.log(this.nodeListData)
        console.log(this.diaNodeInfoForm)
        console.log('图片信息1')
        console.log(this.pictureList)
        this.pictureList = [] // 初始化图片列表，防止点击其他节点继承遗留在上个节点的数据
        if (response.data.host1 === '图片1地址' || response.data.host1 === undefined) {
          response.data.host1 = ''
          response.data.picture1 = ''
          this.host1Flag = false
        } else {
          let imgObj1 = {}
          imgObj1.url = response.data.host1
          imgObj1.name = response.data.picture1
          // this.$set(this.pictureList, 0, imgObj1)
          if (this.pictureList[0] === undefined) {
            this.pictureList.push(imgObj1)
          }
          
          // this.pictureList.splice(0, 0, imgObj1)
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
          // this.$set(this.pictureList, 1, imgObj2)
          if (this.pictureList[1] === undefined) {
            this.pictureList.push(imgObj2)
          }
          // this.pictureList.splice(1, 0, imgObj2)
          this.host2Flag = true
        }
        console.log('图片信息2')
        console.log(this.pictureList)
      }.bind(this))
    },
    // 获取oss签名数据
    backOssInfo: function (file) {
      return new Promise(function (resolve, reject) {
        back.ossInfo().then(function (response) {
          console.log('获取oss签名数据')
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
    /*
    //  ************  辅助函数  *************
    */
    // 编辑节点 1.表单规则校验，2.存储param参数
    devNodeEdit: function () {
      // 表单规则校验
      var index = this.diaNodeInfoForm.index // 选中的节点在所有节点列表的索引号 0，1，2 ...
      console.log(index)
      if (this.diaNodeInfoForm.location === '' || this.diaNodeInfoForm.installTime === '' || this.diaNodeInfoForm.mac === '') {
        this.notificationInfo('错误提示', '主要信息项不可为空')
        return
      }
      if (this.diaNodeInfoForm.mac !== this.nodeListData[index].mac) {
        this.notificationInfo('错误提示', 'mac值不能改变')
        return
      }
      for (let i = 0; i < this.nodeListData.length; i++) {
        if (this.diaNodeInfoForm.slaveAddress !== this.nodeListData[index].slaveAddress) {
          if (this.diaNodeInfoForm.slaveAddress === this.nodeListData[i].slaveAddress) {
            this.notificationInfo('错误提示', '站号不能重复')
            return
          }
        }
      }
      // 处理并存储param参数
      // 判断客户是否修改从机地址 false-未改 true-修改
      if (this.nodeListData[index].slaveAddress === this.diaNodeInfoForm.slaveAddress) {
        this.param.needSend = false
      } else {
        this.param.needSend = true
      }
      console.log(this.diaNodeInfoForm)
      // 存储param参数
      for (let key in this.diaNodeInfoForm) {                      // for...in循环操作对象
        this.param[key] = this.diaNodeInfoForm[key]                // K值构建
      }
      console.log(this.param)
      // 判断拧紧拉紧工具方式，另一种方式则手动传递为空值
      if (this.param.screwMethod === 'tenseTool') {
        this.param.screwTool = ''
        this.param.screwTorque = ''
      } else if (this.param.screwMethod === 'screwTool') {
        this.param.tenseTool = ''
        this.param.drawingForce = ''
      }
      this.param.fileList = ''
      // this.param.screwMethod = ''
      // this.param.screwTool = ''
      // this.param.screwTorque = ''
      // this.param.screwToolSelectedShow = ''
      // this.screwToolSelectedShow = ''
      this.backChangeNode()
    },
    // 添加节点 1.表单规则校验，2.存储param参数
    devNodeAdd: function () {
      // 表单规则校验
      var index = this.diaNodeInfoForm.index           // 选中的节点在所有节点列表的索引号
      console.log(index)
      console.log(this.diaNodeInfoForm.mac)
      if (this.diaNodeInfoForm.location === '' || this.diaNodeInfoForm.installTime === '' || this.diaNodeInfoForm.mac === '') {
        this.notificationInfo('错误提示', '主要信息项不可为空')
        return
      }
      console.log(this.nodeListData)
      for (let i = 0; i < this.nodeListData.length; i++) {
        if (this.diaNodeInfoForm.mac === this.nodeListData[i].mac) {
          this.notificationInfo('错误提示', 'mac不能重复')
          return
        }
      }
      for (let i = 0; i < this.nodeListData.length; i++) {
        if (this.diaNodeInfoForm.slaveAddress === this.nodeListData[i].slaveAddress) {
          this.notificationInfo('错误提示', '站号不能重复')
          return
        }
      }
      // 存储param参数
      for (let key in this.diaNodeInfoForm) {                      // for...in循环操作对象
        this.param[key] = this.diaNodeInfoForm[key]                // K值构建
      }
      console.log(this.param)
      this.loadingFlag = true
      // back添加节点
      this.backAddNode()
    },
    // 删除选中行的小组
    handleDelete: function (index, row) {
      console.log(this.delBtnShow)
      this.$confirm('是否确认删除该节点?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loadingFlag = true
        this.param.mac = this.nodeListData[index].mac
        this.backDeleteNode()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 检查id是否重复
    checkGroupName: function (collectorId, index) {
      let checkFlag = false
      for (let i = 0; i < this.nodeListData.length; i++) {
        if (this.nodeListData[i].collectorId === collectorId) {
          if (i !== index) {
            checkFlag = true
            return checkFlag
          }
        }
      }
      return checkFlag
    },
    //  ----（对话框）---数据填充----数据改变----界面改变----确认发送参数填充----
    //
    // ...给对话框设定初值,手动填充(15个参数)
    nodeFormDataFill: function (
      index,                              // 存储当前选择第几行
      name,                               // 采集器名称
      collectorId,                        // 采集器ID号
      slaveAddress,                       // 从机地址
      mac,                                // 节点mac值
      location,                           // 采集器位置
      installTime,                        // 采集器安装时间
      fileList,                           // 采集器上传照片
      boltFormat,                         // 螺栓规格
      boltFactory,                        // 螺栓厂家
      nutFactory,                         // 螺母厂家
      boltMaterial,                       // 螺栓材料
      boltGrade,                          // 螺栓级别
      surfaceHandle,                      // 螺栓表面处理
      preload,                            // 目标预紧力
      company,                            // 安装公司
      operator,                           // 操作员
      screwMethod,                           // 拧紧方式
      screwToolSelectedShow,                 // 拧紧工具组模板加载标志位 true-显示，false-不显示
      tenseToolSelectedShow,              // 拉伸工具组模板加载标志位 true-显示，false-不显示
      screwTool,                          // 拧紧工具
      tenseTool,                          // 拉紧工具
      screwTorque,                        // 拧紧扭矩
      drawingForce,                       // 安装拉伸力
      lubricate                          // 润滑方式
      // picture1,                           // 照片1
      // host1,                              // 照片1地址
      // picture2,                           // 照片2
      // host2                               // 照片2地址
    ) {
      this.diaNodeInfoForm.index = index
      this.diaNodeInfoForm.name = name
      this.diaNodeInfoForm.collectorId = collectorId
      this.diaNodeInfoForm.slaveAddress = slaveAddress
      this.diaNodeInfoForm.mac = mac
      this.diaNodeInfoForm.location = location
      this.diaNodeInfoForm.installTime = installTime
      this.diaNodeInfoForm.fileList = fileList
      this.diaNodeInfoForm.boltFormat = boltFormat
      this.diaNodeInfoForm.boltFactory = boltFactory
      this.diaNodeInfoForm.nutFactory = nutFactory
      this.diaNodeInfoForm.boltMaterial = boltMaterial
      this.diaNodeInfoForm.boltGrade = boltGrade
      this.diaNodeInfoForm.surfaceHandle = surfaceHandle
      this.diaNodeInfoForm.preload = preload
      this.diaNodeInfoForm.company = company
      this.diaNodeInfoForm.operator = operator
      this.diaNodeInfoForm.screwMethod = screwMethod
      this.diaNodeInfoForm.screwToolSelectedShow = screwToolSelectedShow
      this.diaNodeInfoForm.tenseToolSelectedShow = tenseToolSelectedShow
      this.diaNodeInfoForm.screwTool = screwTool
      this.diaNodeInfoForm.tenseTool = tenseTool
      this.diaNodeInfoForm.screwTorque = screwTorque
      this.diaNodeInfoForm.drawingForce = drawingForce
      this.diaNodeInfoForm.lubricate = lubricate
      if (this.diaNodeInfoForm.tenseTool !== '') {
        // 若拧紧方式为拉伸工具
        this.diaNodeInfoForm.screwMethod = 'tenseTool'
        this.diaNodeInfoForm.screwToolSelectedShow = false
        this.diaNodeInfoForm.tenseToolSelectedShow = true
      } else if (this.diaNodeInfoForm.screwTool !== '') {
        // 若拧紧方式为拧紧工具
        this.diaNodeInfoForm.screwMethod = 'screwTool'
        this.diaNodeInfoForm.screwToolSelectedShow = true
        this.diaNodeInfoForm.tenseToolSelectedShow = false
      }
      // this.diaNodeInfoForm.picture1 = picture1
      // this.diaNodeInfoForm.host1 = host1
      // this.diaNodeInfoForm.picture2 = picture2
      // this.diaNodeInfoForm.host2 = host2
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
.monitorgroup {
  padding: 2px;
  bottom: 0;
  width: 100%;
  overflow: hidden;
  position: relative;
  display: flex;
  display: -webkit-flex; /* Safari */
  flex-direction: column;
}
.el-table .cell {
  text-align: center;
}
.el-date-editor.el-input, .el-date-editor.el-input__inner {
  width: 160px;
}
.diaPartTitle {
  font-size: larger;
  color: dodgerblue;
}
.monitorgroup >>> .el-icon-check {
  color: green;
  font-size: 18px;
}
.monitorgroup >>> .el-icon-close {
  color: red;
  font-size: 18px;
}
.monitorgroup >>> .el-dialog--center .el-dialog__body {
  padding: 15px 27px 8px;
}
.monitorgroup >>> .el-upload-list__item .el-upload--picture-card {
  width: 120px;
  height: 120px;
}
.monitorgroup >>> .el-header, .el-footer {
  background-color: #FFFFFF;
  color: #333;
  /* footer与header都在container容器内 => 可test-align */
  text-align: left;
  line-height: 60px;
  height: 60px;
}
.el-footer {
  bottom: 0px;
  left: 0px;
}
/* 新增padding样式 */
.el-main {
  padding: 0px;
}
/* 解决时间选择器宽度太小问题 */
.monitorgroup >>> .timePicker {
  width: 200px;
}
</style>
