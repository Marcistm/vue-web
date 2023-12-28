<template>
  <!-- 定义一个名为 index 的组件 -->
  <div class="index" style="color: white;line-height: 500%;font-weight: bold;font-size: 48px;">
    <!-- 显示欢迎信息 -->
    <span style="margin-left: 10%">Welcome!</span>
  </div>
</template>

<script>
export default {
  // 此处可以添加组件的逻辑和方法
}
</script>

<style scoped>
/* 定义 index 类的样式 */
.index {
  width: 100%;
  height: 100%;
  /* 设置背景图片 */
  background-image: url('../../assets/image/index.jpg');
  /* 背景不重复 */
  background-repeat: no-repeat;
  /* 背景填充整个容器 */
  background-size: 100% 100%;
}
</style>
