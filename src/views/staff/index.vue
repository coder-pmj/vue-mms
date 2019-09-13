<template>
  <div>
    <el-form
      ref="searchForm"
      :inline="true"
      :model="searchMap"
      class="demo-form-inline"
      style="margin-top:20px"
    >
      <el-form-item prop="username">
        <el-input v-model="searchMap.username" placeholder="账号" style="width:200px"></el-input>
      </el-form-item>
      <el-form-item prop="name">
        <el-input v-model="searchMap.name" placeholder="姓名" style="width:200px"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="fetchData" class="el-icon-search">查询</el-button>
        <el-button type="primary" @click="showDiglog" class="el-icon-edit">增加</el-button>
        <el-button @click="resetForm('searchForm')">重置</el-button>
      </el-form-item>
    </el-form>

    <el-dialog title="员工编辑" width="500px" :visible.sync="dialogVisible" :before-close="handleClose">
      <el-form
        v-loading="loadingFlag"
        :rules="rules"
        :model="pojo"
        ref="pojoForm"
        label-width="100px"
        label-position="right"
        style="width:400px"
      >
        <el-form-item label="账号" prop="username">
          <el-input v-model="pojo.username" placeholder="请输入账号"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="pojo.name" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model="pojo.age" placeholder></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="pojo.mobile" placeholder="请输入电话"></el-input>
        </el-form-item>
        <el-form-item label="薪酬" prop="salary">
          <el-input v-model="pojo.salary"></el-input>
        </el-form-item>
        <el-form-item label="入职时间" prop="entryDate">
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="pojo.entryDate"
            type="date"
            placeholder="选择入职时间"
            style="width:200px"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancle">取 消</el-button>

        <el-button
          type="primary"
          :disabled="disabledFlag"
          @click="
            pojo.id == null
              ? addStaff('pojoForm')
              : UpdateStaff('pojoForm')
          "
        >确 定</el-button>
      </span>
    </el-dialog>

    <el-table :data="list" style="width:100%" border height="390">
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column prop="username" label="账号"></el-table-column>
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="age" label="年龄"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column prop="salary" label="薪酬"></el-table-column>
      <el-table-column prop="entryDate" label="入职时间"></el-table-column>
      <el-table-column label="操作" width="145">
        <template #default="scope">
          <el-button size="mini" @click="handleEdit(scope.row.id)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      style="margin:20px 350px"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 50]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next"
      :total="total"
    ></el-pagination>
  </div>
</template>

<script>
import staffApi from "@/api/staff.js";
export default {
  data() {
    return {
      list: [],
      searchMap: {
        username: "",
        name: ""
      },
      currentPage: 1,
      pageSize: 20,
      total: 200,
      dialogVisible: false,
      loadingFlag: false,
      rules: {
        username: [
          { required: true, message: "账号不能为空", trigger: "blur" }
        ],
        name: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
        mobile: [{ required: true, message: "电话不能为空", trigger: "blur" }]
      },
      pojo: {
        id: null,
        username: "",
        name: "",
        age: "",
        mobile: "",
        salary: "",
        entryDate: ""
      },
      disabledFlag: false
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      staffApi
        .search(this.currentPage, this.pageSize, this.searchMap)
        .then(res => {
          const resp = res.data.data;
          
          this.list = resp.rows;
          this.total = resp.total;
        });
    },
    handleEdit(id) {
      this.showDiglog();
      this.loadingFlag=true
      setTimeout(() => {
        this.loadingFlag = false;
      }, 800);

      this.$nextTick(() => {
        staffApi.searchStaff(id).then(res => {
          const resp = res.data;
          if (resp.flag) {
            this.pojo = resp.data[0];
          } else {
            this.$message({
              type: "warning",
              message: resp.message
            });
          }
        });
      });
    },
    handleDelete(id) {
      this.$confirm("此操作将删除该员工信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        staffApi.DeleteStaff(id).then(res => {
          const resp = res.data;

          this.$message({
            type: resp.flag ? "success" : "error",
            message: resp.message
          });
          if (resp.flag) {
            this.fetchData();
          }
        });
      });
    },
    showDiglog() {
      this.dialogVisible = true;
      this.pojo.id = null;
      this.$nextTick(() => {
        this.disabledFlag = false;
        this.$refs["pojoForm"].resetFields();
      });
    },
    resetForm(Fo) {
      this.$refs[Fo].resetFields();
    },
    handleSizeChange(v) {
      this.pageSize = v;
      this.fetchData();
    },
    handleCurrentChange(v) {
      this.currentPage = v;
      this.fetchData();
    },
    handleClose(done) {
      done();
    },
    addStaff(pojoForm) {
      this.$refs[pojoForm].validate(v => {
        if (v) {
          staffApi.addStaff(this.pojo).then(res => {
            const resp = res.data;
            if (resp.flag) {
              this.dialogVisible = false;
              this.fetchData();
            } else {
              this.$message({
                type: "warning",
                message: resp.message
              });
            }
          });
        } else {
          this.$message("请填写必填项");
        }
      });
    },
    cancle() {
      this.dialogVisible = false;
    },
    UpdateStaff(pojoForm) {
      this.$refs[pojoForm].validate(v => {
        if (v) {
          this.disabledFlag = true;
          staffApi.UpdateStaff(this.pojo).then(res => {
            const resp = res.data;
            if (resp.flag) {
              this.dialogVisible = false;
              this.fetchData();
            } else {
              this.$message({
                type: "warning",
                message: resp.message
              });
            }
          });
        } else {
          this.message("请填写必填项");
        }
      });
    }
  }
};
</script>

<style scoped>
</style>