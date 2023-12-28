<template>
<div>
  <el-form :inline="true" style="margin-top: 10px">
    <el-form-item>
      <el-button type="success" @click="add">新增</el-button>
    </el-form-item>
    <el-form-item label="项目号">
      <el-input v-model="work_number"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="search">查询</el-button>
    </el-form-item>
  </el-form>
  <el-table :data="table"  >
    <el-table-column label="项目号" prop="tooling_no" width="100"></el-table-column>
    <el-table-column label="项目名称" prop="tooling_name"></el-table-column>
    <el-table-column label="项目备注">
      <template slot-scope="scope">
        <el-input v-model="scope.row.work_order_memo" type="textarea" ></el-input>
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <el-button type="primary" @click="submit">保存</el-button>
      <el-button type="danger" @click="del">删除</el-button>
      <br>
    </el-table-column>
  </el-table>
  <el-table :data="data"   ref="myTable" >
    <el-table-column label="子任务" width="150">
    </el-table-column>
    <el-table-column label="状态" prop="condition"></el-table-column>
    <el-table-column label="操作">
    </el-table-column>
  </el-table>
</div>
</template>

<script>
import axios from "axios";
import {MessageBox} from "element-ui";

export default {
  name: "Plan",
  data(){
    return{
      pos:'',
      type:'正式图纸',
      file:'',
      edit_tag:false,
      work_name_table:[],
      work_procedure_table:[],
      dialog:false,
      work_number:'',
      tag:false,
      tooling_no:'',
      data:[],
      table:[{tooling_no: '',tooling_name:'',tooling_map:'',process_num:'',work_number:'',work_order_memo:'',oa_id:''}],
      dialog_form:{
        work_row_item:'',
        sub_map:'',
        comp_numbers:'',
        work_row_memo:''
      },
      options:[],
      map_options:[],

    }
  },
  methods:{

    search_version(){
      let path = 'http://127.0.0.1:6325/tooling_process/search_version'
      let paramas = {
        type: this.type
      }
      axios.get(path,{params:paramas}).then(res=>{
        this.options=res.data.data
        this.map_options=this.options.slice()
      })
    },

    to_print(work_row_item){
      const index = parseInt(work_row_item.split('-')[1])
      if (this.data[0].work_row_item.split('-')[1] === '0') {
        this.data.splice(index, 1, {
          ...this.data[index],
          condition: '已打印'
        })
      } else {
        this.data.splice(index - 1, 1, {
          ...this.data[index - 1],
          condition: '已打印'
        })
      }
      let newtab = this.$router.resolve({
        path: '/print',
        query: {
          work_row_item:work_row_item,
        }
      })
      window.open(newtab.href, '_blank')
    },

    open(work_row_item,sub_map){
      let path='http://127.0.0.1:6325/tooling_process/work_row_item/get'
      let params={
        work_row_item:work_row_item
      }
      axios.get(path,{params:params}).then(res=>{

        this.dialog_form.work_row_item=work_row_item
        this.dialog_form.sub_map=sub_map
        if (res.data.data.length>0){
          this.dialog_form.comp_numbers=res.data.data[0].comp_numbers
          this.work_procedure_table=res.data.data
          if (res.data.data[0].condition==='未开始'){
            this.edit_tag=true
          }else {
            this.edit_tag=false
          }
          this.dialog_form.work_row_memo=res.data.data[0].work_row_memo
        }else {
          let path='http://127.0.0.1:6325/tooling_process/work_row_item/history/get'
          let params={
            tooling_no:this.table[0].tooling_no,
            index:work_row_item.substring(work_row_item.indexOf('-') + 1),
            work_number:this.table[0].work_number
          }
          axios.get(path,{params:params}).then(res=>{
            this.dialog_form.comp_numbers=1
            this.work_procedure_table=res.data.data
            if (this.work_procedure_table.length>0){
              this.work_procedure_table.forEach(item=>{
                item['condition']='未开始'
              })
            }else {
              if (work_row_item.substring(work_row_item.indexOf('-') + 1)==='0'){
                this.work_procedure_table.push({work_procedure:'装配',work_memo:'',condition:'未开始'})
              }
            }
            this.edit_tag=true

          })
          this.dialog_form.work_row_memo=''
        }
        this.dialog=true
      })

    },
    del(){
      MessageBox.confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
          .then(() => {
            let path='http://127.0.0.1:6325/tooling_process/del'
            let parmas={
              work_number:this.table[0].work_number
            }
            axios.get(path,{params:parmas}).then(res=>{
              if (res.data.code===200){
                this.$message.success('删除成功')
                this.tag=false
                this.work_number=''
              }
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });

    },
    add() {
        this.table[0].work_number=''
      if (this.file === '') {
        this.$message.error('版本未选择')
        return
      }
      if (this.type==='正式图纸'){
        let path = 'http://127.0.0.1:6325/tooling_process/create'
        let paramas = {
          file:this.file
        }
        axios.get(path, {
          params: paramas
        }).then(res => {
          this.table[0].tooling_no = this.tooling_no

          const lastDashIndex = this.file.indexOf("-");
          this.table[0].tooling_name = this.file.slice(lastDashIndex+1, this.file.length);

          this.table[0].tooling_map = this.file;

          this.data = res.data.data
          this.index = this.data.findIndex(item => item.sub_map.endsWith("-000"));
          if (this.index !== -1) {
            // 从数组中移除找到的元素
            const itemWith000 = this.data.splice(this.index, 1)[0];
            // 截取'-000'之前的所有内容
            const itemBefore000 = itemWith000.sub_map.split("-000").join("");
            // 将元素添加到数组的第一个位置
            this.data.unshift({ sub_map: itemBefore000 });
          }
        })
      }else {
        this.table[0].tooling_map = this.file
        this.data=[{sub_map:this.file}]
      }
      this.tag = true


    },
    search(){
      if (this.work_number === ''&this.table[0].work_number==='') {
        this.$message.error('工单号未填')
      }else {
        let path = 'http://127.0.0.1:6325/tooling_process/plan/search'
        let paramas = {
          work_number:this.work_number
        }
        axios.get(path, {
          params: paramas
        }).then(res => {
          this.table[0].tooling_no = res.data.tooling_no
          this.table[0].tooling_name = res.data.tooling_name
          this.table[0].tooling_map = res.data.tooling_map
          this.table[0].process_num=res.data.process_num
          this.table[0].work_order_memo=res.data.work_order_memo
          this.table[0].oa_id=res.data.oa_id
          this.data = res.data.data

          this.tag = true
          this.$set(this.table[0], 'work_number', this.work_number)
          this.index = this.data.findIndex(item => item.sub_map.endsWith("-000"));
          if (this.index !== -1) {
            // 从数组中移除找到的元素
            const itemWith000 = this.data.splice(this.index, 1)[0];
            // 截取'-000'之前的所有内容
            const itemBefore000 = itemWith000.sub_map.split("-000").join("");
            // 将元素添加到数组的第一个位置
            this.data.unshift({ sub_map: itemBefore000 });
          }
          if (this.index!==-1){
            for (let i = 0; i <this.data.length ; i++) {
              this.$set(this.data[i], 'work_row_item', this.table[0].work_number+'-'+i)
            }
          }
          else {
            for (let i = 1; i <this.data.length+1 ; i++) {
              this.$set(this.data[i-1], 'work_row_item', this.table[0].work_number+'-'+i)
            }
          }
          this.data.forEach(item=>{
           if(res.data.print_row_item.includes(item['work_row_item'])){
             item['condition']='已打印'
           } else if(res.data.work_row_item.includes(item['work_row_item'])){
             item['condition']='已排产'
           }else {
             item['condition']='未排产'
           }
          })

        })
      }
    },
    submit(){
      if (this.table[0].process_num===''){
        this.$message.error('加工数量不能为空')
        return
      }
      if (this.table[0].oa_id===''){
        this.$message.error('OAID不能为空')
        return
      }
      let path='http://127.0.0.1:6325/tooling_process/create/submit'

      let params={header:this.table,type:this.type}
      axios.post(path,params).then(res=>{
        if (res.data.code===200){
          if (res.data.tag){
            this.$set(this.table[0], 'work_number', res.data.work_number)

            this.index = this.data.findIndex(item => item.sub_map.includes("装配图"));
            if (this.index===-1){
              this.index = this.data.findIndex(item => item.sub_map.includes("总装图"));
            }
            if (this.index!==-1){
              for (let i = 0; i <this.data.length ; i++) {
                this.$set(this.data[i], 'work_row_item', this.table[0].work_number+'-'+i)
              }
            }
            else {
              for (let i = 1; i <this.data.length+1 ; i++) {
                this.$set(this.data[i-1], 'work_row_item', this.table[0].work_number+'-'+i)
              }
            }
            this.data.forEach(item=>{
              item['condition']='未排产'
            })
            this.edit_tag=true
          }
            this.$message.success('保存成功')

        }

      })
    }

  },
  mounted() {
    this.search_version()
    let path='http://127.0.0.1:6325/tooling_process/work_procedure/get'
    axios.get(path).then(res=>{
      this.work_name_table=res.data.data
    })
  }
}
</script>

<style scoped>

</style>
