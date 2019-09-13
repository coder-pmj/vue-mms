<template>
  <div>
    <!-- el-form -->
    <el-form
      ref="searchForm"
      :inline="true"
      :model="searchMap"
      class="demo-form-inline"
      style="margin-top:20px"
    >
      <el-form-item prop="name">
        <el-input v-model="searchMap.name" placeholder="供应商名称" style="width:200px"></el-input>
      </el-form-item>
      <el-form-item prop="linkman" v-if="! theFlag">
        <el-input v-model="searchMap.linkman" placeholder="联系人" style="width:200px"></el-input>
      </el-form-item>
      <el-form-item prop="mobile" v-if="! theFlag">
        <el-input v-model="searchMap.mobile" placeholder="联系电话" style="width:200px"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchData" class="el-icon-search">查询</el-button>
        <el-button type="primary" @click="ShowDiglog" class="el-icon-edit" v-if="! theFlag">增加</el-button>
        <el-button @click="resetForm('searchForm')" v-if="! theFlag">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- end el-form -->

    <!-- diglog -->
    <el-dialog
      v-if="! theFlag"
      title="供应商编辑"
      width="500px"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
    >
      <el-form
        v-loading="loadingFlag"
        :rules="rules"
        :model="pojo"
        ref="pojoForm"
        label-width="100px"
        label-position="right"
        style="width:400px"
      >
        <el-form-item label="供应商名称" prop="name">
          <el-input v-model="pojo.name" placeholder></el-input>
        </el-form-item>
        <el-form-item label="联系人" prop="linkman">
          <el-input v-model="pojo.linkman" placeholder></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="mobile">
          <el-input v-model="pojo.mobile" placeholder></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="pojo.remark" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancle">取 消</el-button>

        <el-button
          type="primary"
          :disabled="disabledFlag"
          @click="
            pojo.id == null
              ? addSupplier('pojoForm')
              : UpdateSupplier('pojoForm')
          "
        >确 定</el-button>
      </span>
    </el-dialog>
    <!-- end diglog -->

    <!-- el-table -->
    <el-table
      :data="list"
      style="width: 100%"
      border
      height="390"
      :highlight-current-row="theFlag"
      @current-change="handleCurrentChange1"
    >
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column prop="name" label="供应商名称" width="160"></el-table-column>
      <el-table-column prop="linkman" label="联系人" width="100"></el-table-column>
      <el-table-column prop="mobile" label="联系电话" width="200" v-if="! theFlag"></el-table-column>
      <el-table-column prop="remark" label="备注" v-if="! theFlag"></el-table-column>
      <el-table-column label="操作" width="145" v-if="! theFlag">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row.id)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- end el-table -->

    <!-- 分页 -->
    <el-pagination
      style="margin:20px 350px"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 50]"
      :page-size="pageSize"
      :layout="theFlag?' prev, pager,next':'total, sizes, prev, pager, next'"
      :total="total"
    ></el-pagination>
    <!--  -->
  </div>
</template>

<script>
import supplierApi from "@/api/supplier";
export default {
  data() {
    return {
      disabledFlag: false,
      dialogVisible: false,
      loadingFlag: false,
      list: [],
      pageSize: 10,
      currentPage: 1,
      total: 200,
      searchMap: {
        linkman: "",
        name: "",
        mobile: ""
      },
      pojo: {
        id: null,
        linkman: "",
        name: "",
        mobile: "",
        remark: ""
      },
      rules: {
        name: [{ required: true, message: "请输入供应商名称" }],
        linkman: [{ required: true, message: "请输入联系人名称" }],
        mobile: [{ required: true, message: "请输入联系电话" }]
      }
    };
  },
  props: {
    theFlag: Boolean
  },
  created() {
    //获取表格数据
    this.fetchData();
  },
  methods: {
    fetchData() {
      supplierApi
        .search(this.currentPage, this.pageSize, this.searchMap)
        .then(res => {
          this.list = res.data.data.rows;
          this.total = res.data.data.total;
          //console.log(this.list);
        });
    },
    handleEdit(id) {
      this.ShowDiglog();
      console.log(id);

      this.loadingFlag = true;
      setTimeout(() => {
        this.loadingFlag = false;
      }, 700);

      this.$nextTick(() => {
        supplierApi.searchSupplier(id).then(res => {
          if (res.data.flag) {
            this.pojo = res.data.data[0];
          } else {
            this.$message(res.data.message);
          }
        });
      });
    },
    handleDelete(id) {
      this.$confirm("此操作将删除该会员信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        supplierApi.DeleteSupplier(id).then(res => {
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
    addSupplier(pojoForm) {
      console.log("新增供应商");
      this.$refs[pojoForm].validate(va => {
        if (va) {
          supplierApi.addSupplier(this.pojo).then(res => {
            // console.log(res.data.message);
            this.fetchData();
            this.dialogVisible = false;
          });
        } else {
          this.$message({
            type: "warning",
            message: "请填写必填项"
          });
        }
      });
      /*  */
    },
    UpdateSupplier(pojoForm) {
      console.log("修改供应商");
      this.$refs[pojoForm].validate(va => {
        if (va) {
          supplierApi.UpdateSupplier(this.pojo.id).then(res => {
            this.fetchData();
            this.dialogVisible = false;
          });
        } else {
          this.$message(res.data.message);
        }
      });
    },

    //监听页面显示条数变化
    handleSizeChange(val) {
      //console.log(val);
      this.pageSize = val;
      this.fetchData();
    },

    //监听当前页变化
    handleCurrentChange(val) {
      //console.log(val);
      this.currentPage = val;
      this.fetchData();
    },

    //弹出页面
    ShowDiglog() {
      this.pojo.id = null;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.disabledFlag = false;
        this.$refs["pojoForm"].resetFields();
      });
    },

    //重置表单
    resetForm(resetForm) {
      this.$refs[resetForm].resetFields();
    },

    //关闭图标
    handleClose(done) {
      done();
    },

    //取消按钮
    cancle() {
      this.dialogVisible = false;
    },
    handleCurrentChange1(t) {
      console.log(t);
      this.$emit("theRow", t);
    }
  }
};
</script>
