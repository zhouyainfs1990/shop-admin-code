<template>
  <!-- 表格列表
        data:表格渲染使用的数据
        row-key:行标识
        tree-props:
            属性数据配置
            children：树形结构子数据key名称
            hasChildren：'hasChildren' 拥有树形结构
  -->
  <el-table
    :data="menulist"
    style="width: 100%"
    row-key="id"
    :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
  >
    <!-- 每一列
            label:列表头
            prop:这一列关联的数据的key
    -->
    <el-table-column label="名称" width="180" prop="title"></el-table-column>
    <el-table-column label="图标" width="180">
      <!-- 当前列的数据，
            scope：代表包含每一行的数据对象
            row:行
      -->
      <template slot-scope="scope">
        <i :class="scope.row.icon"></i>
      </template>
    </el-table-column>
    <el-table-column label="类型" width="180">
      <!-- 当前列的数据，
            scope：代表包含每一行的数据对象
            row:行
      -->
      <template slot-scope="scope">
        <el-tag v-if="scope.row.type===1">目录</el-tag>
        <el-tag v-else-if="scope.row.type===2" type="success">菜单</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="菜单URL" width="180" prop="url"></el-table-column>
    <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button size="mini" @click="$emit('edit',scope.row)">编辑</el-button>
        <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
export default {
  props: {
    menulist: {
      type: Array
    }
  },
  methods: {
    //和后台交互删除这一行的数据
    async deleteMenu(id) {
      let res = await this.$http.post(
        this.$api.MENUDELETE,
        this.$qs.stringify({ id })
      );

      if (res.code == 200) {
        console.log(res);
        this.$message.success("删除成功");
        this.$emit("changeMenu",res.list);
      } else {
        this.$message.error(res.msg);
      }
    },
    handleDelete(id) {
      this.$confirm("此操作将永久删除该菜单, 是否继续?", "", {
        confirmButtonText: "确定", //确定按钮的文本
        cancelButtonText: "取消", //取消按钮的文本
        type: "warning"
      }).then(() => {
        this.deleteMenu(id);
      }).catch(()=>{});
    }
  }
};
</script>