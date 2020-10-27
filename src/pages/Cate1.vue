<template>
  <div>
    <el-breadcrumb separator="/" style="margin-bottom:20px;">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>管理员列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="primary" @click="addFn">添加</el-button>
    <el-table :data="catelist"
                row-key="id"
                :tree-props="{
                    children:'children',
                    hasChildren:'hasChildren'
                }"
    >
      <el-table-column label="分类名称" prop="catename" width="200"></el-table-column>
      <el-table-column label="状态" width="200">
        <template slot-scope="scope">
          <el-tag effect="dark" type="success" v-if="scope.row.status==1">启用</el-tag>
          <el-tag effect="dark" type="danger" v-else>禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="editFn(scope.row.uid)">编辑</el-button>
          <el-button size="mini" @click="deleteFn(scope.row.id)" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 对话框 -->
    <el-dialog :visible.sync="dialogVisible" @open="openFn" @close="closeFn">
      <!-- 表单 -->
      <el-form label-width="100px" :model="formdata" ref="roleform" :rules="rules">
        <el-form-item prop="rolename" label="上级分类">
          <!-- 将被选中role的id,作为新增的管理员的roleid -->
          <el-select v-model="formdata.pid" placeholder="请选择">
              <el-option key="0" label="顶级分类" value="0"></el-option>
            <el-option
              v-for="item in topCate"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="catename" label="分类名称">
          <el-input v-model="formdata.catename"></el-input>
        </el-form-item>
        <el-form-item label="图片">
            <input type="file" ref="file">
            <!-- <el-upload></el-upload> -->
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
import axios from "axios"
export default {
  data() {
    return {
      total: 0,
      page: 1,
      size: 2,
      catelist: [], //表格数据
      dialogVisible: false, //对话框显示状态
      checkedKeys: [], //编辑时的预先选中项
      //表格绑定数据
      formdata: {
        pid:"",
        catename: "",
        img: "",
        status: true
      },
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
      //顶级分类的列表
      topCate : []
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    //   页面数发生变化时触发的函数 page 新的页数
    pageChange(page) {
    //   console.log(page);
      this.page = page;
      this.getList();
    },
    closeFn() {
      this.checkedKeys = [];
      this.formdata = {
        rolename: "",
        menus: [],
        status: true
      };
    },
    //   新增按钮
    addFn() {
      this.dialogVisible = true;
    },
    // 编辑按钮
    editFn(uid) {
      this.dialogVisible = true;
      this.$http.get(this.$api.USERINFO, { uid }).then(res => {
          console.log(res.list)
        if (res.code == 200) {
            this.formdata = {
                ...res.list
            }
          this.formdata.status = res.list.status == 1 ? true : false;
        }
      });
    },
    // 删除按钮
    deleteFn(id) {
      this.$http.post(this.$api.USERDELETE, { id }).then(res => {
        if (res.code == 200) {
          this.page = 1;
          this.getList();
          this.$message.success("删除成功");
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // 打开对话框的回调
    openFn() {
      this.getTopCate();
    },
    // 提交按钮
    async submit() {
        console.log(this.$refs.file.files[0])

        this.formdata.img = this.$refs.file.files[0];
        this.formdata.status = this.formdata.status ? 1 : 2;
        let url = this.formdata.id ? "/api/cateedit" : "/api/cateadd";
        // 获取表单实例
        let form1 = new FormData();
        for(var key in this.formdata){
            // append:向表单实例添加数据的方法
            // key: 数据的名称
            // value: 数据的值
            form1.append(key,this.formdata[key]);
        }

        axios({
            method:"post",
            url,
            data:form1,
            headers:{
                Authorization:localStorage.getItem("token")?localStorage.getItem("token"):"",
                "Content-Type":"multipart/form-data",//改写上传文件的文件类型
            }
        }).then(res=>{
            console.log(res);
        })

    //   let res = await this.$http.post(url, str);
    //   if (res.code == 200) {
    //     // console.log(res)
    //     this.$message.success("操作成功");
    //   } else {
    //     this.$message.error(res.msg);
    //   }
    //   this.dialogVisible = false;
    //   this.getList();
    },
    // 获取树状结构 表格数据
    async getList() {
      let res = await this.$http.get(this.$api.CATELIST, {
        istree:true
      });
        console.log(res);
      if (res.code == 200) {
        this.catelist = res.list ? res.list : [];
      } else {
        this.$message.error(res.msg);
      }
    },
    // 获取获取顶级分类
    async getTopCate() {
      let res = await this.$http.get(this.$api.CATELIST,{
        pid:0
      });
      console.log(res);
      if (res.code == 200) {
        this.topCate = res.list ? res.list : [];
      } else {
        this.$message.error(res.msg);
      }
    }
  }
};
</script>