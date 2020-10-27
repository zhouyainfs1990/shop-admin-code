<template>
  <div>
    <span v-for="(item,index) in demo" :key="index">{{item}}</span>
    <button @click="changeFn">change</button>
    <el-breadcrumb separator="/" style="margin-bottom:20px;">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>管理员列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="primary" @click="addFn">添加</el-button>
    <el-table :data="specslist">
      <el-table-column label="属性名称" prop="specsname" width="200"></el-table-column>
      <el-table-column label="属性值"  width="200">
          <template slot-scope="scope">
            <el-tag  type="primary" v-for="(item,index) in scope.row.attrs" :key="index">{{item}}</el-tag>  
          </template>
      </el-table-column>
      <el-table-column label="状态" width="200">
        <template slot-scope="scope">
          <el-tag effect="dark" type="success" v-if="scope.row.status==1">启用</el-tag>
          <el-tag effect="dark" type="danger" v-else>禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="editFn(scope.row.id)">编辑</el-button>
          <el-button size="mini" @click="deleteFn(scope.row.id)" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 对话框 -->
    <el-dialog :visible.sync="dialogVisible" @open="openFn" @close="closeFn">
      <!-- 表单 -->
      <el-form label-width="100px" :model="formdata" ref="roleform" :rules="rules">
        <el-form-item prop="specsname" label="属性名">
          <el-input v-model="formdata.specsname"></el-input>
        </el-form-item>
        <el-form-item label="属性值">
            <div v-for="(item,index) in attrsArr" :key="index"><el-input v-model="item.value"   :style="{width:'60%'}"></el-input> 
            <el-button type="primary" v-if="index==0" @click="addAttr(index)">添加属性</el-button>
            <el-button type="danger" v-else @click="deleteAttr(index)">删除属性</el-button></div>
        </el-form-item>
        <el-form-item label="状态">
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
import Vue from "vue"
export default {
  data() {
    return {
      demo:["a","b"],
      total: 0,
      specslist: [], //表格数据
      dialogVisible: false, //对话框显示状态
      checkedKeys: [], //编辑时的预先选中项
      //表格绑定数据
      formdata: {
        specsname: "",
        attrs: "",
        status: true
      },
      attrsArr:[{value:""}],//属性值构成的数据
      //验证规则
      rules: {
        rolename: [
          {
            required: true,
            message: "请填写角色名称",
            trigger: blur
          }
        ]
      },
      //角色列表
      rolelist: []
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
      changeFn(){
        //   数据项通过下标或者修改长度，数据发生变化但是视图不会更新
        //   通过下标访问直接修改数组成员
        //   this.demo[0]="c";
        // this.demo.length = 1;

        // 1.通过数组的相关API
        // this.demo.splice(0,1,"c")
        

        // 2.不直接修改数组成员本身，变成对象修改它的属性
        // this.demo[0].value = "c";

        // 3.$set 方法修改
        // 被修改的数据，下标， 修改后成员
        // this.$set(this.demo,0,"c")
        Vue.set(this.demo,0,"c")

        // 4. 指向空数组后，再重新复制
        // let tem = this.demo;
        // tem[0] = "c";
        // this.demo = "";
        // this.demo = tem;

        // 5.重新赋值一个空数组
        // this.demo[0] = "c"
        // this.demo = [...this.demo];
        console.log(this.demo)
      },
    //   新增属性
    addAttr(){
        this.attrsArr.push({value:""});
    },
    //删除属性
    deleteAttr(i){
        this.attrsArr.splice(i,1);
    },
    closeFn() {
      this.attrsArr = [];
      this.formdata = {
        specsname: "",
        attrs: "",
        status: true
      };
    },
    //   新增按钮
    addFn() {
      this.dialogVisible = true;
    },
    // 编辑按钮
    editFn(id) {
      this.dialogVisible = true;
      this.$http.get("/api/specsinfo", { id }).then(res => {
        console.log(res.list)
        if (res.code == 200) {
            this.formdata = {
                ...res.list[0]
            }
        this.attrsArr = res.list[0].attrs.map(item=>({value:item}))
        this.formdata.status = res.list[0].status == 1 ? true : false;
        }
      });
    },
    // 删除按钮
    deleteFn(id) {
      this.$http.post("/api/specsdelete", { id }).then(res => {
        if (res.code == 200) {
          this.getList();
          this.$message.success("删除成功");
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // 打开对话框的回调
    openFn() {
      this.getRoleList();
    },
    // 提交按钮
    async submit() {
      this.formdata.status = this.formdata.status ? 1 : 2;
    // map 将对象数组转化为字符串构成的数组
    // join 转化为字符串
      this.formdata.attrs = this.attrsArr.map(item=>item.value).join(",");
      console.log(this.formdata.attrs);
      let url = this.formdata.id ?"/api/specsedit" : "/api/specsadd";
      console.log(url)
      let str = this.$qs.stringify(this.formdata);
      let res = await this.$http.post(url, str);
      if (res.code == 200) {
        // console.log(res)
        this.$message.success("操作成功");
      } else {
        this.$message.error(res.msg);
      }
      this.dialogVisible = false;
      this.getList();
    },
    // 获取属性列表
    async getList() {
      let res = await this.$http.get("/api/specslist");
        console.log(res);
      if (res.code == 200) {
        this.specslist = res.list ? res.list : [];
      } else {
        this.$message.error(res.msg);
      }
    },
    // 打开对话框时需要的角色列表
    async getRoleList() {
      let res = await this.$http.get(this.$api.ROLELIST);
      console.log(res);
      if (res.code == 200) {
        this.rolelist = res.list ? res.list : [];
      } else {
        this.$message.error(res.msg);
      }
    }
  }
};
</script>