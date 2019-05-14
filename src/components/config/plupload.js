// // //////////////////////////////////////////
// //
// //   上传/下载照片工具库
// //
// // //////////////////////////////////////////

// /**
//  * 上传照片
//  */
// import plupload from 'plupload'

// export const ossUp = function (id) { 
//   console.log(id)
//   // ***********全局变量**********
//   var accessid = ''           // 用户请求的accessid
//   // let accesskey = ''
//   let host = ''               // 用户要往哪个域名发送上传请求
//   let policyBase64 = ''       // 用户表单上传的策略（Policy），是经过base64编码过的字符串
//   let signature = ''          // 对变量policy签名后的字符串
//   let expire = ''             // 上传策略Policy失效时间，在服务端指定。失效时间之前都可以利用此Policy上传文件，无需每次上传都去服务端获取签名。
//   let key = ''                // dir 选填
//   // var filename = ''           // 文件名
//   let gObjectName = ''      // 全局对象名
//   let gObjectNameType = '' // 全局对象名的类型 本地文件名/随机
//   // let timestamp = Date.parse(new Date()) / 1000 // 时间戳
//   // let now = timestamp

//   // ***********方法函数*********
//   // 发送请求
//   function sendRequest () {
//     var xmlhttp = null
//     // if (window.XMLHttpRequest) {
//     //   xmlhttp = new XMLHttpRequest()
//     // } else if (window.ActiveXObject) {
//     //   xmlhttp = new ActiveXObject('Microsoft.XMLHTTP')
//     // }
//     if (xmlhttp != null) {
//       // serverUrl是 用户获取 '签名和Policy' 等信息的应用服务器的URL，请将下面的IP和Port配置为您自己的真实信息。
//       let serverUrl = 'http://picture.thingcom.com/web/token'
//       xmlhttp.open('GET', serverUrl, false)
//       xmlhttp.send(null)
//       return xmlhttp.responseText
//     } else {
//       alert('Your browser does not support XMLHTTP.')
//     }
//   }
//   // 检查文件名称选择类型
//   function checkObjectRadio () {
//     var tt = document.getElementsByName('myradio')
//     for (var i = 0; i < tt.length; i++) {
//       if (tt[i].checked) {
//         gObjectNameType = tt[i].value
//         break
//       }
//     }
//   }
//   // 获取签名
//   function getSignature () {
//     // 可以判断当前expire是否超过了当前时间， 如果超过了当前时间， 就重新取一下，3s 作为缓冲。
//     // now = timestamp = Date.parse(new Date()) / 1000;
//     // if (expire < now + 3) {
//     let body = sendRequest()
//     let obj = eval('(' + body + ')')
//     host = obj['host']
//     policyBase64 = obj['policy']
//     accessid = obj['accessid']
//     signature = obj['signature']
//     expire = parseInt(obj['expire'])
//     // callbackbody = obj['callback'] 
//     key = obj['dir']
//     console.log(host)
//     console.log(accessid)
//     console.log(signature)
//     console.log(expire)
//     console.log(policyBase64)
//     return true
//     // }
//     // return false
//   }
//   // 获取随机字符串
//   function randomString (len) {
//     len = len || 32
//     let chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
//     let maxPos = chars.length
//     let pwd = ''
//     for (let i = 0; i < len; i++) {
//       pwd += chars.charAt(Math.floor(Math.random() * maxPos))
//     }
//     return pwd     
//   }
//   // 得到文件后缀名
//   function getSuffix (filename) {
//     let pos = filename.lastIndexOf('.')
//     let suffix = ''
//     if (pos !== -1) {
//       suffix = filename.substring(pos)
//     }
//     return suffix    
//   }
//   // 计算文件名称
//   function calculateObjectName (filename) {
//     if (gObjectNameType === 'local_name') {
//       gObjectName += '${filename}'
//     } else if (gObjectNameType === 'random_name') {
//       let suffix = getSuffix(filename)
//       gObjectName = key + randomString(10) + suffix
//     }
//     return ''      
//   }
//   // 得到上传之后的文件名称
//   function getUploadedObjectName (filename) {
//     if (gObjectNameType === 'local_name') {
//       let tmpName = gObjectName
//       tmpName = tmpName.replace('${filename}', filename)
//       return tmpName
//     } else if (gObjectNameType === 'random_name') {
//       return gObjectName
//     }      
//   }
//   // 设置上传参数
//   function setUploadParam (up, filename, ret) {
//     if (ret === false) {
//       ret = getSignature()
//     }
//     gObjectName = key
//     if (filename !== '') {
//       let suffix = getSuffix(filename)
//       calculateObjectName(filename)
//     }
//     let newMultipartParams = {
//       'key': gObjectName,
//       'policy': policyBase64,
//       'OSSAccessKeyId': accessid,
//       'success_action_status': '200', // 让服务端返回200,不然，默认会返回204
//       // 'callback' : callbackbody,
//       'signature': signature
//     }
//     console.log(newMultipartParams)
//     console.log(up)
//     up.setOption({
//       'url': host,
//       'multipart_params': newMultipartParams
//     })

//     up.start()      
//   }
//   // 实例化/初始化uploader
//   var uploader = new plupload.Uploader({
//     runtimes: 'html5,flash,silverlight,html4',
//     browse_button: 'selectfiles',
//     // container: document.getElementById('container'),
//     // flash_swf_url: 'lib/plupload-2.1.2/js/Moxie.swf',
//     // silverlight_xap_url: 'lib/plupload-2.1.2/js/Moxie.xap',
//     url: 'http://oss.aliyuncs.com',

//     filters: {
//       mime_types: [ // 只允许上传图片和zip文件
//         { title: 'Image files', extensions: 'jpg,gif,png,bmp' },
//         { title: 'Zip files', extensions: 'zip,rar' }
//       ],
//       max_file_size: '10mb', // 最大只能上传10mb的文件
//       prevent_duplicates: true // 不允许选取重复文件
//     },
    
//     init: {
//       PostInit: function () {
//         console.log(12)
//         document.getElementById('ossfile').innerHTML = ''
//         document.getElementById('postfiles').onclick = function () {
//           setUploadParam(uploader, '', false)
//           return false
//         }
//       },
//       FilesAdded: function (up, files) {
//         console.log(1433125)
//         console.log(up)
//         plupload.each(files, function (file) {
//           document.getElementById('ossfile').innerHTML += '<div id="' + file.id + '">' + file.name + ' (' + plupload.formatSize(file.size) + ')<b></b>' + '<div class="progress"><div class="progress-bar" style="width: 0%"></div></div>' + '</div>'
//         })
//         console.log(456)
//       },
//       BeforeUpload: function (up, file) {
//         checkObjectRadio()
//         setUploadParam(up, file.name, true)
//       },
//       UploadProgress: function (up, file) {
//         let d = document.getElementById(file.id)
//         d.getElementsByTagName('b')[0].innerHTML = '<span>' + file.percent + '%</span>'
//         let prog = d.getElementsByTagName('div')[0]
//         let progBar = prog.getElementsByTagName('div')[0]
//         progBar.style.width = 2 * file.percent + 'px'
//         progBar.setAttribute('aria-valuenow', file.percent)
//       },
//       FileUploaded: function (up, file, info) {
//         if (info.status === 200) {
//           document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = 'upload to oss success, object name:' + getUploadedObjectName(file.name) + ' 回调服务器返回的内容是:' + info.response
//         } else if (info.status === 203) {
//           document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = '上传到OSS成功，但是oss访问用户设置的上传回调服务器失败，失败原因是:' + info.response
//         } else {
//           document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = info.response
//         }
//       },
//       Error: function (up, err) {
//         if (err.code === -600) {
//           document.getElementById('console').appendChild(document.createTextNode('\n选择的文件太大了,可以根据应用情况，在upload.js 设置一下上传的最大大小'))
//         } else if (err.code === -601) {
//           document.getElementById('console').appendChild(document.createTextNode('\n选择的文件后缀不对,可以根据应用情况，在upload.js进行设置可允许的上传文件类型'))
//         } else if (err.code === -602) {
//           document.getElementById('console').appendChild(document.createTextNode('\n这个文件已经上传过一遍了'))
//         } else {
//           document.getElementById('console').appendChild(document.createTextNode('\nError xml:' + err.response))
//         }
//       }          
//     }
//   })
//   // uploader.init()
// }

// /**
//  * 读取照片
//  */
// export const ossDown = (name) => { 
//   console.log(name)
// }
