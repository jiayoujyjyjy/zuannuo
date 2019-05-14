import axios from 'axios'
import * as url from './urlConfig'
// import paramCase = require('param-case');

export const onenet = {
  //
  // ****************反向代理*****************
  //
  // 设备
  // 精确查询单个设备
  // 传入参数：apikey，设备id
  // 返回:设备名称、在线状态、数据流等信息
  onenetDevSingleQue (param) {
    return axios({
      url: `http://onenet.zn.thingcom.com/devices/${param.deviceId}`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'api-key': param.apiKey
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 设备
  // 模糊查询设备
  // 参数：api-Key，不带其它参数
  // 返回：该产品下的所有设备的参数信息
  onenetDevQue (param) {
    return axios({
      url: `http://onenet.zn.thingcom.com/devices`,
      method: 'get',
      headers: {
        'api-key': param.apiKey
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 设备
  // 批量查询设备最新数据
  // 传入参数：apikey，需要查询的设备id
  // 返回各个设备的最新数据，设备Id,设备名，设备数据流名称，数据点最新时间，数据点值
  onenetDataRequire (param) {
    return axios({
      url: `http://onenet.zn.thingcom.com/devices/datapoints?devIds=${param.deviceId}`,
      method: 'get',
      headers: {
        'api-key': param.apiKey
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 数据点
  // 查询数据点
  // 传入参数：apikey，需要查询的设备id，数据流id
  // 返回所查询数据流下的所有数据点信息,如果没有数据流数据则返回所有数据点信息
  onenetSteamsQue (param) {
    return axios({
      url: `http://onenet.zn.thingcom.com/devices/${param.deviceId}/datastreams?datastream_ids=${param.datastreamId}`,
      method: 'get',
      headers: {
        'api-key': param.apiKey
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 数据点
  // 查询设备历史数据
  // 传入参数：apikey，需要查询的设备id，开始时间
  // 返回所查询数据流下的所有数据点信息,如果没有数据流数据则返回所有数据点信息
  onenetStartOneHisQue (param) {
    return axios({
      url: `http://onenet.zn.thingcom.com/devices/${param.deviceId}/datapoints?datastream_id=${param.datastreamId}&start=${param.startTime}&end=${param.endTime}&limit=${param.limit}`,
      method: 'get',
      headers: {
        'api-key': param.apiKey
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 数据点
  // 查询设备历史数据
  // 传入参数：apikey，需要查询的设备id，开始时间
  // 返回所查询数据流下的所有数据点信息,如果没有数据流数据则返回所有数据点信息
  onenetStartOneHisQue1 (param) {
    return axios({
      url: `http://onenet.zn.thingcom.com/devices/${param.deviceId}/datapoints?datastream_id=${param.datastreamId1}&start=${param.startTime}&end=${param.endTime}&limit=${param.limit}`,
      method: 'get',
      headers: {
        'api-key': param.apiKey
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  onenetStartOneHisQue2 (param) {
    return axios({
      url: `http://onenet.zn.thingcom.com/devices/${param.deviceId}/datapoints?datastream_id=${param.datastreamId2}&start=${param.startTime}&end=${param.endTime}&limit=${param.limit}`,
      method: 'get',
      headers: {
        'api-key': param.apiKey
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  onenetStartOneHisQue3 (param) {
    return axios({
      url: `http://onenet.zn.thingcom.com/devices/${param.deviceId}/datapoints?datastream_id=${param.datastreamId3}&start=${param.startTime}&end=${param.endTime}&limit=${param.limit}`,
      method: 'get',
      headers: {
        'api-key': param.apiKey
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  onenetStartOneHisQue4 (param) {
    return axios({
      url: `http://onenet.zn.thingcom.com/devices/${param.deviceId}/datapoints?datastream_id=${param.datastreamId4}&start=${param.startTime}&end=${param.endTime}&limit=${param.limit}`,
      method: 'get',
      headers: {
        'api-key': param.apiKey
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 数据点
  // 查询数据点，限制查询数据点的个数
  // 传入参数：apikey，需要查询的设备id，数据流id
  // 返回所查询数据流下的所有数据点信息,如果没有数据流数据则返回所有数据点信息
  onenetStartNextHisQue (param) {
    return axios({
      url: `http://onenet.zn.thingcom.com/devices/${param.deviceId}/datapoints?datastream_id=${param.datastreamId}&start=${param.startTime}&cursor=${param.cursor}&limit=${param.limit}`,
      method: 'get',
      headers: {
        'api-key': param.apiKey
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 数据点
  // 查询数据点，限制查询数据点的个数
  // 传入参数：apikey，需要查询的设备id，数据流id
  // 返回所查询数据流下的所有数据点信息,如果没有数据流数据则返回所有数据点信息
  onenetStartNextHisQue1 (param) {
    return axios({
      url: `http://onenet.zn.thingcom.com/devices/${param.deviceId}/datapoints?datastream_id=${param.datastreamId1}&start=${param.startTime}&cursor=${param.cursor1}&limit=${param.limit}`,
      method: 'get',
      headers: {
        'api-key': param.apiKey
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  onenetStartNextHisQue2 (param) {
    return axios({
      url: `http://onenet.zn.thingcom.com/devices/${param.deviceId}/datapoints?datastream_id=${param.datastreamId2}&start=${param.startTime}&cursor=${param.cursor2}&limit=${param.limit}`,
      method: 'get',
      headers: {
        'api-key': param.apiKey
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  onenetStartNextHisQue3 (param) {
    return axios({
      url: `http://onenet.zn.thingcom.com/devices/${param.deviceId}/datapoints?datastream_id=${param.datastreamId3}&start=${param.startTime}&cursor=${param.cursor3}&limit=${param.limit}`,
      method: 'get',
      headers: {
        'api-key': param.apiKey
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  onenetStartNextHisQue4 (param) {
    return axios({
      url: `http://onenet.zn.thingcom.com/devices/${param.deviceId}/datapoints?datastream_id=${param.datastreamId4}&start=${param.startTime}&cursor=${param.cursor4}&limit=${param.limit}`,
      method: 'get',
      headers: {
        'api-key': param.apiKey
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  }
}

export const back = {
  // 1.用户模块
  // 1.1 用户注册
  userRegister (param) {
    return axios({
      url: `${url.backbasurl}/api/user`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        name: param.name, // 用户名，16字符以内
        password: param.password, // 密码，16字符以内
        company: param.company, // 公司，20字符以内
        mobile: param.mobile, // 手机号，11字符
        code: param.code // 短信验证码，6位数字
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 1.2 用户登录
  userLogin (param) {
    return axios({
      url: `${url.backbasurl}/api/user/login`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        password: param.password,
        account: param.account
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 1.3 用户信息获取
  getuserInfo (param) {
    return axios({
      url: `${url.backbasurl}/api/user`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {}
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 2.网关模块
  // 2.1 添加网关
  addNetgate (param) {
    return axios({
      url: `${url.backbasurl}/api/netgate`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {
        sn: param.sn, // 网关序列号,不超过16字符
        password: param.password, // 网关密码，6位
        name: param.name, // 网关名字，不超过16字符
        location: param.location, // 网关三维坐标，JSON格式
        groupUid: param.groupUid // 网关组UID
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 2.2 新增网关分组
  addNetGroup (param) {
    return axios({
      url: `${url.backbasurl}/api/netgate/group`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {
        groupName: param.groupName          // 网关分组名
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 2.3 查询网关信息
  getNetInfo (param) {
    return axios({
      url: `${url.backbasurl}/api/netgate?sn=${param.sn}`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {}
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 2.4 修改网关分组名
  devGroupNameMod (param) {
    return axios({
      url: `${url.backbasurl}/api/netgate/group`,
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {
        groupName: param.groupName,            // 网关分组名
        groupUid: param.groupUid               // 网关分组UID
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 2.5 修改网关信息
  devMod (param) {
    return axios({
      url: `${url.backbasurl}/api/netgate`,
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {
        sn: param.sn,                           // 网关sn
        name: param.name,                       // 网关名称
        location: param.location,               // {"lon":12, "lat": 13, "ele": 13}
        installCompany: param.installCompany,   // 安装公司
        operator: param.operator,               // 安装人员
        picture1: param.picture1,               // 图片1名称
        picture2: param.picture2,               // 图片2名称
        host1: param.host1,                     // 图片1的地址
        host2: param.host2                      // 图片2的地址
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 2.6 删除网关
  devDel (param) {
    return axios({
      url: `${url.backbasurl}/api/netgate?sn=${param.sn}`,
      method: 'delete',
      headers: {
        'Content-Type': 'application/json',
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {}
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 3.节点模块
  // 3.1 添加节点
  addNode (param) {
    return axios({
      url: `${url.backbasurl}/api/node`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {
        sn: param.sn,                           // 网关序列号
        name: param.name,                       // 节点名称
        collectorId: param.collectorId,         // 采集器ID
        mac: param.mac,                         // 节点MAC
        slaveAddress: param.slaveAddress,       // 从机地址
        location: param.location,               // 安装位置
        installTime: param.installTime,         // 安装日期
        boltFormat: param.boltFormat,           // 螺栓规格
        boltFactory: param.boltFactory,         // 螺栓厂家
        nutFactory: param.nutFactory,           // 螺母厂家
        boltMaterial: param.boltMaterial,       // 螺栓材料
        boltGrade: param.boltGrade,             // 螺栓等级
        surfaceHandle: param.surfaceHandle,     // 表面处理
        preload: param.preload,                 // 预紧力
        company: param.company,                 // 安装公司
        // tightWay: param.tightWay,               // 拧紧方式：拉伸或者扭矩
        screwMethod: param.screwMethod,         // 拧紧方式：拉伸/扭矩
        operator: param.operator,               // 操作员
        lubricate: param.lubricate,             // 润滑方式
        tenseTool: param.tenseTool,             // 拉伸工具 -当screwMethod选择拉伸时，需要额外传两个参数： 
        drawingForce: param.drawingForce,       // 安装拉伸力 -当screwMethod选择拉伸时，需要额外传两个参数： 
        screwTool: param.screwTool,             // 拧紧工具 -当screwMethod选择扭矩时，需要额外传递两个参数
        screwTorque: param.screwTorque,         // 拧紧扭矩 -当screwMethod选择扭矩时，需要额外传递两个参数
        picture1: param.picture1,               // 图片1文件名
        picture2: param.picture2,               // 图片2文件名
        host1: param.host1,                     // 图片1的地址
        host2: param.host2                      // 图片2的地址
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 3.2 查询节点信息
  devNodeInfoQue (param) {
    return axios({
      url: `${url.backbasurl}/api/node?mac=${param.mac}`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': param.Authorization
      },
      data: {}
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 3.3 修改节点信息
  changeNode (param) {
    return axios({
      url: `${url.backbasurl}/api/node`,
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {
        needSend: param.needSend,           // 1表示客户修改了从站地址，0表示该参数没有修改
        name: param.name,                   // 节点名称
        collectorId: param.collectorId,     // 采集器ID
        mac: param.mac,                     // 节点MAC
        slaveAddress: param.slaveAddress,   // 从机地址
        location: param.location,           // 安装位置
        installTime: param.installTime,     // 安装日期
        boltFormat: param.boltFormat,       // 螺栓规格
        boltFactory: param.boltFactory,     // 螺栓厂家
        nutFactory: param.nutFactory,       // 螺母厂家
        boltMaterial: param.boltMaterial,   // 螺栓材料
        boltGrade: param.boltGrade,         // 螺栓等级
        surfaceHandle: param.surfaceHandle, // 表面处理
        preload: param.preload,             // 预紧力
        company: param.company,             // 安装公司
        operator: param.operator,           // 拧紧方式
        lubricate: param.lubricate,         // 操作员
        screwMethod: param.screwMethod,     // 润滑方式
        tenseTool: param.tenseTool,         // 拉伸工具 -当screwMethod选择拉伸时，需要额外传两个参数： 
        drawingForce: param.drawingForce,   // 安装拉伸力 -当screwMethod选择拉伸时，需要额外传两个参数： 
        screwTool: param.screwTool,         // 拧紧工具 -当screwMethod选择扭矩时，需要额外传递两个参数
        screwTorque: param.screwTorque,     // 拧紧扭矩 -当screwMethod选择扭矩时，需要额外传递两个参数
        picture1: param.picture1,           // 图片1
        host1: param.host1,                 // 图片1地址
        picture2: param.picture2,           // 图片2
        host2: param.host2                  // 图片2地址
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 3.4 删除节点
  deleteNode (param) {
    return axios({
      url: `${url.backbasurl}/api/node?sn=${param.sn}&mac=${param.mac}`,
      method: 'delete',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': param.Authorization
      },
      data: {}
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 4.关联模块
  // 4.1 获取用户下网关列表
  userDevQue (param) {
    return axios({
      url: `${url.backbasurl}/api/relation/user/netgates`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 4.2 获取网关下节点列表
  relatioNode (param) {
    return axios({
      url: `${url.backbasurl}/api/relation/netgate/nodes?sn=${param.sn}`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 5.工具模块
  // 5.1 发送短信验证码
  relatioNetgate (param) {
    return axios({
      url: `${url.backbasurl}/api/util/sms?mobile=${param.mobile}`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 5.2 检查网关是否需要更新
  gatewayUpdateCheck (param) {
    return axios({
      url: `${url.backbasurl}/api/util/update?sn=${param.sn}`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 5.3 开始网关更新
  gatewayUpdate (param) {
    return axios({
      url: `${url.backbasurl}/api/util/update?sn=${param.sn}&type=${param.type}`,
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },    
  // 5.4 刷新token(未完成)
  refreshToken (param) {
    return axios({
      url: `${url.backbasurl}/api/util/token`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 6. 报警模块
  // 6.1 添加触发器
  triAdd (param) {
    return axios({
      url: `${url.backbasurl}/api/trigger`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {
        sn: param.sn,
        name: param.name,
        streamId: param.streamId,
        type: param.type,
        threshold: param.threshold,
        content: param.content
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 6.2 获取当前未处理的报警信息
  getNowTriNot (param) {
    return axios({
      url: `${url.backbasurl}/api/trigger/data/current?sn=${param.sn}`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {}
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 6.3 确认当前报警
  triNowConfirm (param) {
    return axios({
      url: `${url.backbasurl}/api/trigger/data/current?id=${param.id}`,
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {}
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 6.4  获取历史报警
  getHisTri (param) {
    return axios({
      url: `${url.backbasurl}/api/trigger/data/history?sn=${param.sn}&startTime=${param.startTime}&endTime=${param.endTime}`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {}
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 6.5 添加报警联系人
  triContactAdd (param) {
    return axios({
      url: `${url.backbasurl}/api/trigger/contact`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {
        sn: param.sn,
        name: param.name,
        mobile: param.mobile,
        enable: param.enable
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 6.6 获取报警联系人列表
  getTriConList (param) {
    return axios({
      url: `${url.backbasurl}/api/trigger/contact/list?sn=${param.sn}`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {}
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 6.7 获取触发器列表
  getTriList (param) {
    return axios({
      url: `${url.backbasurl}/api/trigger/list?sn=${param.sn}`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {}
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 6.8 修改触发器
  triMod (param) {
    return axios({
      url: `${url.backbasurl}/api/trigger`,
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {
        sn: param.sn,
        name: param.name,
        streamId: param.streamId,
        type: param.type,
        threshold: param.threshold,
        content: param.content,
        triggerId: param.triggerId
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 6.9 删除触发器
  triDel (param) {
    return axios({
      url: `${url.backbasurl}/api/trigger`,
      method: 'delete',
      headers: {
        'Content-Type': 'application/json',
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {
        sn: param.sn,
        triggerId: param.triggerId
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 6.10 修改报警联系人
  triContactMod (param) {
    return axios({
      url: `${url.backbasurl}/api/trigger/contact`,
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {
        id: param.id,                   // 报警联系人id
        name: param.name,               
        mobile: param.mobile,           
        enable: param.enable            
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 6.11 删除报警联系人
  triContactDel (param) {
    return axios({
      url: `${url.backbasurl}/api/trigger/contact?id=${param.id}`,
      method: 'delete',
      headers: {
        'Content-Type': 'application/json',
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {}
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 7. 用户管理模块
  // 7.1 新增用户
  userAdd (param) {
    return axios({
      url: `${url.backbasurl}/api/manager/user`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {
        name: param.name,
        account: param.account,
        password: param.password,
        mobile: param.mobile,         // 选填
        company: param.company,       // 选填
        auth: param.auth              // 0-超级(不可添加) 1-管理员 2-查看者 3-普通用户
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 7.2 修改用户信息
  userManagerMod (param) {
    return axios({
      url: `${url.backbasurl}/api/manager/user`,
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {
        userId: param.userIdOther,
        name: param.name,
        account: param.account,
        password: param.password,
        mobile: param.mobile,        // 选填
        company: param.company,      // 选填 
        auth: param.auth
      }
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 7.3 获取用户列表
  userInfoListQue (param) {
    return axios({
      url: `${url.backbasurl}/api/manager/user/list`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {}
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // 7.4 删除用户
  userDel (param) {
    return axios({
      url: `${url.backbasurl}/api/manager/user?userId=${param.userIdOther}`,
      method: 'delete',
      headers: {
        'Content-Type': 'application/json',
        'userId': param.userId,
        'Authorization': param.Authorization
      },
      data: {}
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  // *********
  // 获取oss签名数据
  ossInfo () {
    return axios({
      url: `http://picture.thingcom.com/web/token`,
      method: 'get',
      headers: {},
      data: {}
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })
  }
}
