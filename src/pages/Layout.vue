<template>
  <div class="layout">
    <el-container class="container">
      <el-aside width="150px">
        <side-bar></side-bar>
      </el-aside>
      <el-container>
        <el-header class="header">
          <my-header :username="username"></my-header>
        </el-header>
        <el-main >
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import MyHeader from "@/components/MyHeader";
import SideBar from "@/components/SideBar";
export default {
  components: {
    MyHeader,
    SideBar
  },
  computed: {
    username() {
      return this.$store.state.info.username;
    }
  }
};
</script>
<style lang="less">
@bg-gray: #b3c0d1;
.layout {
  height: 100%;
  .container {
    height: 100%;
    .header {
      background-color: @bg-gray;
      line-height: 60px;
      text-align: right;
    }
    .el-aside {
      color: #333;
      background-color: #20222a;
    }
    .el-main{
      background-color: #E5E5E5;
    }
  }
}
</style>