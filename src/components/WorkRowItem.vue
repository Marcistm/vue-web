<template>
  <el-dialog :visible.sync="tag">
    <el-table :data="dialog">
      <el-table-column label="子工单" prop="work_row_item"></el-table-column>
      <el-table-column label="子工单备注" prop="work_row_memo"></el-table-column>
      <el-table-column label="工序序号" prop="number"></el-table-column>
      <el-table-column label="工序描述" prop="work_procedure"></el-table-column>
      <el-table-column label="工序备注" prop="work_memo"></el-table-column>
      <el-table-column label="工序状态" prop="condition"></el-table-column>
      <el-table-column label="加工人员" prop="worker"></el-table-column>
      <el-table-column label="开始时间" prop="start_time"></el-table-column>
      <el-table-column label="结束时间" prop="end_time"></el-table-column>
      <el-table-column label="总加工时长" prop="time"></el-table-column>
      <el-table-column label="标准工时" prop="work_time"></el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>

export default {
  name: "WorkRowItem",
  props:{
    dialog:Array
  },
  watch: {
    dialog: {
      immediate: true, // Trigger the watch function immediately on component creation
      handler(newArray) {
        // Update the table data when the incoming array changes
        this.dialog = newArray;
      },
    },
  },
  data() {
    return {
      tag: false,
    }
  },methods:{

  }
}
</script>

<style scoped>

</style>
