<template>
  <div>
    <!-- 1.面包屑导航 -->
    <!-- separator ：分隔符 -->
    <el-breadcrumb separator="/" style="margin-bottom:20px;">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>菜单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="primary" @click="dialogVisible=true">添加</el-button>

    <my-table :menulist="menulist" @changeMenu="changeFn" @edit="editFn"></my-table>
    <!-- 
        open:打开对话框时触发的回调（请求顶级菜单的数据）
        close:关闭对话库重置表单内容
    -->
    <el-dialog title="新增菜单" 
    :visible.sync="dialogVisible" width="50%" 
    @open="getTop"
    @close="reset">
      <el-form label-width="100px" 
             :model="formdata" 
             :rules="rules" 
             ref="menuform">
        <!-- lebel:表单域文本 -->
        <el-form-item label="菜单名称">
          <!-- {{formdata.pid}} -->
          <el-select v-model="formdata.pid" placeholder="请选择" @change="changeMenu">
            <!-- key:标识
                label:选择项的文本
                value:当前项被选中的value (v-model绑定的值变成选中项的value)
            -->

            <el-option :key="0" label="顶级菜单" :value="0"></el-option>
            <el-option v-for="item in topmenu" :key="item.id" :label="item.title" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单名称" prop="title">
          <el-input v-model="formdata.title"></el-input>
        </el-form-item>
        <!-- 通过pid 的值来判断 显示的输入框 -->
        <el-form-item label="菜单图标" v-if="formdata.pid==0">
          <el-input v-model="formdata.icon"></el-input>
        </el-form-item>
        <el-form-item label="菜单地址" v-else>
          <el-input v-model="formdata.url"></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-radio v-model="formdata.type" :disabled="formdata.type!==1" :label="1">目录</el-radio>
          <el-radio v-model="formdata.type" :disabled="formdata.type===1" :label="2">菜单</el-radio>
        </el-form-item>
        <el-form-item label="状态">
          <!-- <p>{{formdata.status}}</p> -->
          <el-switch v-model="formdata.status"></el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 表格数据
      menulist: [],
      //表单内容
      formdata: {
        pid: 0,
        title: "",
        icon: "",
        type: 1,
        url: "",
        status: true
      },
      dialogVisible: false, //对话框显示状态,
      topmenu: [], //顶层菜单,
      rules: {
        title: [
          {
            required: true,
            message: "填写菜单名称",
            trigger: "blur"
          }
        ]
      }
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    //   子组件点击编辑按钮触发自定事件的事件处理函数
    editFn(row){
        this.dialogVisible = true;
        console.log(row);
        // 向formdata添加id属性
        this.formdata = {
            ...row
        }
        this.formdata.status = this.formdata.status==1?true:false;
    },
    reset(){
        this.formdata= {
            pid: 0,
            title: "",
            icon: "",
            type: 1,
            url: "",
            status: true
        }
    },
    //   提交事件
    submit() {
        //根据是否存在id来判断进行新增还是编辑操作
      let url = this.formdata.id?this.$api.MENUEDIT:this.$api.MENUADD;
      this.formdata.status = this.formdata.status ? 1 : 2;
      console.log(this.formdata)
      this.$refs.menuform.validate(value => {
        if (!value) {
          return false;
        }
        // console.log(this.formdata)
        this.$http.post(url, this.formdata).then(res => {
          console.log(res);
          if (res.code === 200) {
            this.$message.success("操作成功");
            this.getList();//获取最新的列表数据
            this.dialogVisible = false;//关闭对话框
          }
        });
      });
    },

    // 切换菜单名称时触发
    changeMenu(pid) {
      //   console.log(pid)
      this.formdata.type = pid > 0 ? 2 : 1;
    },
    // 子组件触发的自定义事件
    changeFn(menulist) {
      this.menulist = menulist;
    },
    // 获取树形结构的所以菜单
    async getList() {
      let res = await this.$http.get(this.$api.MENULIST, { istree: true });
      if (res.code == 200) {
        console.log(res);
        this.menulist = res.list ? res.list : [];
      } else {
        this.$message.error(res.msg);
      }
    },
    // 获取顶级菜单
    async getTop() {
      let res = await this.$http.get(this.$api.MENULIST, { pid: 0 });
      if (res.code == 200) {
        console.log(res);
        this.topmenu = res.list ? res.list : [];
      } else {
        this.$message.error(res.msg);
      }
    }
  }
};
</script>