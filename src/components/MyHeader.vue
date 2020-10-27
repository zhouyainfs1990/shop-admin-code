<template>
  <!-- command:event 点击任意下拉菜单项都会触发
                 被点击的项command值作为事件处理函数的参数传入   
  -->
  <el-dropdown @command="logout">
    <!--下拉框固定显示  -->
    <span>
      <span>{{username}}</span>
      <!-- 图标的使用 设置 类名实现 -->
      <i class="el-icon-setting"></i>
    </span>
    <!-- 下拉菜单 -->
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item>登出</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>
<script>
export default {
  props: {
    username: {
      required: true,
      type: String
    }
  },
  methods: {
    //   登出的事件函数
    logout() {
        this.$store.commit("clearInfo");
        this.$router.replace("/login")
    }
  }
};
</script>