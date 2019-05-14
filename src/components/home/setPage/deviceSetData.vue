<template>
  <div class="deviceSetData">
    <el-table
      :data="tableData"
      border
      stripe
      style="width: 100%">
      <el-table-column
        prop="name"
        label="名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="uesd"
        label="已使用条目"
        width="180">
      </el-table-column>
      <el-table-column
        prop="useful"
        label="可使用总条目数">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { ossUp, ossDown } from '@/components/config/plupload.js'

export default {
  name: 'deviceSetData',
  data () {
    return {
      tableData: [{
        name: '数据监控',
        uesd: '0',
        useful: '10000'
      }, {
        name: '数据监控',
        uesd: '0',
        useful: '10000'
      }, {
        name: '数据监控',
        uesd: '0',
        useful: '10000'
      }, {
        name: '数据监控',
        uesd: '0',
        useful: '10000'
      }]
    }
  },
  mounted () {
    ossUp('杜')
    ossDown('坤')
  }
}
</script>

<style scoped>
.deviceSetData {
  margin: 30px;
  font-size: 18px;
  padding: 2px;
  bottom: 0;
  width: 100%;
  overflow: hidden;
  position: relative;
  display: flex;
  display: -webkit-flex; /* Safari */
  flex-direction: column;
}
</style>
<style>
.el-table td, .el-table th.is-leaf {
  text-align: center;
}
/* .el-dialog--center .el-dialog__header {
  background-color: #409EFF;
  padding-top: 15px;
  line-height: 40px;
} */
</style>
