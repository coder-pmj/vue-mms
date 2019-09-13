<template>
  <div>
    <!-- 搜索表单 -->
    <el-form
      ref="searchForm"
      :inline="true"
      :model="searchMap"
      class="demo-form-inline"
      style="margin-top:20px"
    >
      <el-form-item prop="name">
        <el-input v-model="searchMap.name" placeholder="商品名称" style="width:200px"></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input v-model="searchMap.code" placeholder="商品编号" style="width:200px"></el-input>
      </el-form-item>
      <el-form-item prop="supplierName">
        <el-input
          @click.native="showSupplier"
          readonly
          v-model="searchMap.supplierName"
          placeholder="选择供应商"
          style="width:200px;"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchData" class="el-icon-search">查询</el-button>
        <el-button type="primary" @click="ShowDiglog" class="el-icon-edit">增加</el-button>
        <el-button @click="resetForm('searchForm')">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- end  搜索表单 -->

    <!-- 数据表格 -->
    <el-table :data="list" height="390" border style="width: 100%">
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column prop="name" label="商品名称"></el-table-column>
      <el-table-column prop="code" label="商品编码"></el-table-column>
      <el-table-column prop="spec" label="商品规格"></el-table-column>
      <el-table-column prop="retailPrice" label="零售价"></el-table-column>
      <el-table-column prop="purchasePrice" label="进货价"></el-table-column>
      <el-table-column prop="storageNum" label="库存数量"></el-table-column>
      <el-table-column prop="supplierName" label="供应商"></el-table-column>

      <el-table-column label="操作" width="145">
        <template #default="scope">
          <el-button size="mini" @click="handleEdit(scope.row.id)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- end 数据表格 -->

    <!-- 分页 -->
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
    <!-- end 分页 -->

    <!-- diglog -->
    <el-dialog title="商品编辑" width="500px" :visible.sync="dialogVisible" :before-close="handleClose">
      <el-form
        v-loading="loadingFlag"
        :rules="rules"
        :model="pojo"
        ref="pojoForm"
        label-width="100px"
        label-position="right"
        style="width:400px"
      >
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="pojo.name" placeholder="请输入商品名称"></el-input>
        </el-form-item>
        <el-form-item label="商品编码" prop="code">
          <el-input v-model="pojo.code" placeholder="请输入商品编码"></el-input>
        </el-form-item>
        <el-form-item label="商品规格" prop="spec">
          <el-input v-model="pojo.spec" placeholder="请输入商品规格"></el-input>
        </el-form-item>
        <el-form-item label="零售价" prop="retailPrice">
          <el-input v-model="pojo.retailPrice" placeholder="请输入零售价"></el-input>
        </el-form-item>
        <el-form-item label="进货价" prop="purchasePrice">
          <el-input v-model="pojo.purchasePrice" placeholder></el-input>
        </el-form-item>
        <el-form-item label="数量" prop="storageNum">
          <el-input v-model="pojo.storageNum" placeholder="请输入数量"></el-input>
        </el-form-item>
        <el-form-item label="供应商" prop="supplierName">
          <el-input
            readonly
            @click.native="showSupplierList"
            v-model="pojo.supplierName"
            placeholder="请选择供应商名称"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancle">取 消</el-button>

        <el-button
          type="primary"
          :disabled="disabledFlag"
          @click="
            pojo.id == null
              ? addGoods('pojoForm')
              : UpdateGoods('pojoForm')
          "
        >确 定</el-button>
      </span>
    </el-dialog>
    <!-- end  diglog -->

    <el-dialog
      title="选择供应商"
      :visible.sync="dialogVisible2"
      width="500px"
      :before-close="handleClose"
    >
      <show-supplier :theFlag="true" @theRow="get_row"></show-supplier>
    </el-dialog>
  </div>
</template>


<script>
import goodsApi from "@/api/goods";
import Supplier from "@/views/supplier";

export default {
  data() {
    return {
      disabledFlag: false,
      loadingFlag: false,
      dialogVisible: false,
      dialogVisible2: false,
      list: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      searchMap: {
        id: null,
        name: "",
        code: "",
        supplierName: ""
      },
      pojo: {
        id: null,
        name: "",
        code: "",
        spec: "",
        retailPrice: "",
        purchasePrice: "",
        storageNum: "",
        supplierName: ""
      },
      isEdit: false, //是否为编辑窗口
      rules: {
        name: [{ required: true, message: "请输入商品名称", trigger: "blur" }],
        code: [{ required: true, message: "请输入商品编码", trigger: "blur" }],
        spec: [{ required: true, message: "请输入商品规格", trigger: "blur" }],
        retailPrice: [
          { required: true, message: "请输入零售价", trigger: "blur" }
        ],
        storageNum: [{ required: true, message: "请输入数量", trigger: "blur" }]
      }
    };
  },
  components: {
    "show-supplier": Supplier
  },

  created() {
    this.fetchData();
  },

  methods: {
    fetchData() {
      goodsApi
        .search(this.currentPage, this.pageSize, this.searchMap)
        .then(res => {
          const resp = res.data;
          this.list = resp.data.rows;
          this.total = resp.data.total;
          //console.log(resp.data.rows)
        });
    },
    handleEdit(id) {
      this.ShowDiglog();

      this.loadingFlag = true;
      setTimeout(() => {
        this.loadingFlag = false;
      }, 700);

      this.$nextTick(() => {
        goodsApi.searchGoods(id).then(res => {
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
        goodsApi.deleteGoods(id).then(res => {
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
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchData();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      console.log("点击第" + val + "页");
      this.fetchData();
    },
    ShowDiglog() {
      this.pojo.id = null;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.pojoForm.resetFields();
      });
    },
    //清空并重置搜索表单
    resetForm(resetForm) {
      this.$refs[resetForm].resetFields();
    },
    handleClose(done) {
      done();
    },
    cancle() {
      this.dialogVisible = false;
    },
    addGoods(Formed) {
      console.log("add");
      this.$refs[Formed].validate(va => {
        if (va) {
          goodsApi.addGoods(this.pojo).then(res => {
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
    UpdateGoods(Formed) {
      console.log("update");
      this.$refs[Formed].validate(va => {
        if (va) {
          goodsApi.updateGoods(this.pojo).then(res => {
            if (res.data.flag) {
              this.dialogVisible = false;
              this.fetchData();
            } else {
              this.$message({
                type: "warning",
                message: res.data.message
              });
            }
          });
        } else {
          this.$message("请填写必填项");
        }
      });
    },
    showSupplier() {
      this.dialogVisible2 = true;

      //this.$emit('listenSupplier')
    },

    get_row(t) {
      //alert(t.id);

      if (this.isEdit) {
        this.pojo.supplierName = t.name;
        this.pojo.id = t.id;
        this.isEdit = false; //还原状态值
      } else {
        this.searchMap.supplierName = t.name;
        this.searchMap.id = t.id;
      }
      this.dialogVisible2 = false;
    },
    showSupplierList() {
      this.dialogVisible2 = true;
      this.isEdit = true; //打开的窗口为编辑窗口
    }
  }
};
</script>
<style scoped>
</style>