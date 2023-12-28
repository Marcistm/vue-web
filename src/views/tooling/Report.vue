<template>
<div>
  <el-form :inline="true" style="margin-top: 10px">
    <el-form-item label="项目号">
      <el-input v-model="work_number"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="search">查询</el-button>
    </el-form-item>
  </el-form>
  <el-table :data="data">
    <el-table-column label="项目名称" prop="work_row_item" width="120"></el-table-column>
    <el-table-column label="项目号" prop="tooling_no" width="60"></el-table-column>
    <el-table-column label="子任务" prop="work_procedure" width="60"></el-table-column>
    <el-table-column label="项目备注" prop="work_memo"></el-table-column>
    <el-table-column label="任务人员" prop="worker" width="60">
    </el-table-column>
    <el-table-column label="开始时间" prop="start_time"></el-table-column>
    <el-table-column label="状态" prop="condition" width="60"></el-table-column>
    <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button type="primary" :disabled="scope.row.tag" v-if="scope.row.condition==='未开始'" @click="start(scope.row)">开始加工</el-button>
        <el-button type="danger" v-if="scope.row.condition==='已开始'" @click="end(scope.row)">结束加工</el-button>
      </template>
    </el-table-column>
  </el-table>
</div>
</template>

<script>
import axios from "axios";
import {getUserName, removeToken} from "@/utils/auth";
import {getWorkNameTable} from "@/api/api";
export default {
  name: "Report",
  data(){
    return{
      row:'',
      num_table:[{num:'',finish_num:"",scrap_num:''}],
      num_tag:false,
      data:[],
      work_number:'',
      work_procedure:'',
      work_name_table:[],
    }
  },methods:{
    submit(){
      if (parseInt(this.num_table[0].num)!==parseInt(this.num_table[0].scrap_num)+parseInt(this.num_table[0].finish_num)|
      this.num_table[0].scrap_num<0|this.num_table[0].finish_num<0){
        this.$message.error('数量填写错误')
        return
      }
      let path='http://127.0.0.1:6325/tooling_process/report/num'
      let params={
        scrap_num:this.num_table[0].scrap_num,finish_num:this.num_table[0].finish_num,
        work_row_item:this.row.work_row_item,number:this.row.number
      }
      axios.get(path,{params:params}).then(res=>{
        if (res.data.code===200){
          this.num_tag=false
        }
      })


    },
    start(row){
      this.$confirm('是否开始加工', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        // 执行 "report" 函数
        let path='http://127.0.0.1:6325/tooling_process/report/start'
        let params={
          work_row_item:row.work_row_item,number:row.number,worker:row.worker,
        }

        axios.get(path,{params:params}).then(res=>{
          if (res.data.code===200){
            this.$message.success(res.data.msg)
            this.search()
          }
        })
      }).catch(() => {
        // 取消执行
      });

    },

    search(){
      if(this.work_number===''){
        this.$message.error('请填写工单号')
        return
      }
      let username=getUserName()
      let path='http://127.0.0.1:6325/tooling_process/report/search'
      let params={
        work_number:this.work_number,
        work_procedure:this.work_procedure,
        worker:username
      }
      axios.get(path,{params:params}).then(res=>{
        this.data=res.data.data
        this.data.forEach(item=>{
          item['worker']=username
        })
      })
    },
    end(row){
        const startPath = 'http://127.0.0.1:6325/tooling_process/report/end';
        const startParams = {
          work_row_item: row.work_row_item,
          number: row.number,
          worker: row.worker,
          work_procedure: row.work_procedure,
        };
        axios.get(startPath, {params:startParams}).then(res=>{
          if (res.data.code === 200) {
            this.$message.success(res.data.msg);
            this.search()
          }
        })
    },
  },
  mounted() {
    getWorkNameTable()
        .then((data) => {
          this.work_name_table = data;
        })
  }
}
</script>

<style scoped>

</style>
