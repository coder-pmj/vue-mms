<template>
  <div>
    <!-- form -->
    <el-form
      ref="searchForm"
      :inline="true"
      :model="searchMap"
      class="demo-form-inline"
      style="margin-top:20px"
    >
      <el-form-item prop="cardNum">
        <el-input v-model="searchMap.cardNum" placeholder="会员卡号" style="width:200px"></el-input>
      </el-form-item>
      <el-form-item prop="name">
        <el-input v-model="searchMap.name" placeholder="会员名称" style="width:200px"></el-input>
      </el-form-item>
      <el-form-item prop="payType">
        <el-select v-model="searchMap.payType" placeholder="支付类型" style="width:110px">
          <el-option v-for="li in optionArr" :value="li.id" :label="li.typeName" :key="li.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="birthday">
        <el-date-picker
          value-format="yyyy-MM-dd"
          v-model="searchMap.birthday"
          type="date"
          placeholder="生日"
          style="width:200px"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchData" class="el-icon-search">查询</el-button>
        <el-button type="primary" @click="ShowDiglog" class="el-icon-edit">增加</el-button>

        <el-button @click="resetForm('searchForm')">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- end form -->

    <!-- diglog -->
    <el-dialog title="会员编辑" width="500px" :visible.sync="dialogVisible" :before-close="handleClose">
      <el-form
        v-loading="loadingFlag"
        :rules="rules"
        :model="pojo"
        ref="pojoForm"
        label-width="100px"
        label-position="right"
        style="width:400px"
      >
        <el-form-item label="会员卡号" prop="cardNum">
          <el-input v-model="pojo.cardNum" placeholder></el-input>
        </el-form-item>
        <el-form-item label="会员姓名" prop="name">
          <el-input v-model="pojo.name" placeholder></el-input>
        </el-form-item>
        <el-form-item label="会员生日" prop="birthday">
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="pojo.birthday"
            type="date"
            placeholder="生日"
            style="width:200px"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="pojo.phone" placeholder></el-input>
        </el-form-item>
        <el-form-item label="开卡金额" prop="money">
          <el-input v-model="pojo.money" placeholder></el-input>
        </el-form-item>
        <el-form-item label="可用积分" prop="integral">
          <el-input v-model="pojo.integral" placeholder></el-input>
        </el-form-item>
        <el-form-item label="支付类型" prop="payType">
          <el-select v-model="pojo.payType" placeholder="支付类型" style="width:110px">
            <el-option v-for="li in optionArr" :value="li.id" :label="li.typeName" :key="li.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="会员地址" prop="address">
          <el-input v-model="pojo.address" placeholder="请输入地址"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancle">取 消</el-button>

        <el-button
          type="primary"
          :disabled="disabledFlag"
          @click="
            pojo.id == null ? addMember('pojoForm') : UpdateMember('pojoForm')
          "
        >确 定</el-button>
      </span>
    </el-dialog>
    <!-- end diglog -->

    <!-- table -->
    <el-table :data="list" height="390" border style="width: 100%">
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column prop="cardNum" label="会员卡号"></el-table-column>
      <el-table-column prop="name" label="会员姓名"></el-table-column>
      <el-table-column prop="birthday" label="会员生日"></el-table-column>
      <el-table-column prop="phone" label="手机号码"></el-table-column>
      <el-table-column prop="integral" label="可用积分"></el-table-column>
      <el-table-column prop="money" label="开卡金额"></el-table-column>
      <el-table-column prop="payType" label="支付类型">
        <template #default="scope">
          <!-- 运用一个payTypeFilter(过滤器)将类型编号转换为文字 -->
          <span>{{ scope.row.payType | payTypeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="会员地址"></el-table-column>
      <el-table-column label="操作" width="145">
        <template #default="scope">
          <el-button size="mini" @click="handleEdit(scope.row.id)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- end table -->

    <!-- 页码 -->
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
    <!-- end 页码 -->
  </div>
</template>

<script>
import memberApi from "@/api/member";

//过滤器中不能使用this  因此不能将数据定义在data里面
const FilterArr = [
  { id: "1", typeName: "现金" },
  { id: "2", typeName: "微信" },
  { id: "3", typeName: "支付宝" },
  { id: "4", typeName: "银行卡" }
];

export default {
  data() {
    return {
      disabledFlag: false,
      loadingFlag: false,
      dialogVisible: false, //初始化弹出框的状态--隐藏
      pojo: {
        //初始化会员表单数据
        id: null,
        cardNum: "",
        name: "",
        birthday: "",
        phone: "",
        payType: "",
        address: "",
        integral: "0"
      },
      list: [], //会员数据
      optionArr: FilterArr, //支付类型==>下拉菜单
      total: 0, //总记录数
      currentPage: 1, //当前页码
      pageSize: 10, //每页记录数
      searchMap: {
        //条件查询条件值
        cardNum: "",
        name: "",
        payType: "",
        birthday: ""
      },
      rules: {
        //增加会员页 检验规则
        cardNum: [{ required: true, message: "卡号不能为空", trigger: "blur" }],
        name: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
        payType: [
          { required: true, message: "请选择支付方式", trigger: "change" }
        ]
      }
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      memberApi
        .search(this.currentPage, this.pageSize, this.searchMap)
        .then(res => {
          const resp = res.data.data;
          this.total = resp.total;
          this.list = resp.rows;
        });
    },
    //每页显示条数发生改变，val是最新的显示条数
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchData();
    },
    //当前页码发生改变，val是最新的页码
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchData();
    },

    //会员编辑功能，调用api 获取数据
    handleEdit(id) {
      this.ShowDiglog();

      this.loadingFlag = true;
      setTimeout(() => {
        this.loadingFlag = false;
      }, 700);

      this.$nextTick(() => {
        memberApi.SearchMember(id).then(res => {
          const resp = res.data;
          if (resp.flag) {
            this.pojo = resp.data[0]; //存放渲染数据
          } else {
            this.$message(resp.message);
          }
        });
      });
    },
    handleDelete(id) {
      // console.log("删除" + id);
      this.$confirm("此操作将删除该会员信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        memberApi.DeleteMember(id).then(res => {
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

    //取消按钮
    cancle() {
      this.dialogVisible = false;
    },

    //搜索栏=>清空表单，重置检验
    resetForm(resetForm) {
      // console.log(resetForm)
      this.$refs[resetForm].resetFields();
    },

    //✖图标点击关闭
    handleClose(done) {
      done();
    },

    //提交新增会员表单数据
    addMember(formName) {
      console.log("add");
      console.log(this.pojo);
      this.$refs[formName].validate(vaild => {
        if (vaild) {
          this.disabledFlag = true;
          //数据提交
          memberApi.addMember(this.pojo).then(res => {
            if (res.data.flag) {
              this.fetchData();
              /*  */
              // this.$refs[formName].resetFields();
              this.dialogVisible = false;
            } else {
              //清空id
              //提示失败信息
              this.$message({
                type: "warning",
                message: res.data.message
              });
            }
          });
        } else {
          //表单有未填项，不让表单关闭
          this.dialogVisible = true;
          this.$message({
            type: "warning",
            message: "请填写必填项",
            duration: 1000
          });
        }
      });
    },

    //修改会员信息
    UpdateMember(formName) {
      console.log(this.pojo);
      console.log("update");
      this.$refs[formName].validate(vaild => {
        if (vaild) {
          this.disabledFlag = true;
          //数据提交
          memberApi.UpdateMember(this.pojo).then(res => {
            if (res.data.flag) {
              this.fetchData();
              this.dialogVisible = false;
            } else {
              //提示失败信息
              this.$message({
                type: "warning",
                message: res.data.message
              });
            }
          });
        } else {
          //表单有未填项，不让表单关闭
          this.dialogVisible = true;
          this.$message({
            type: "warning",
            message: "请填写必填项",
            duration: 1000
          });
        }
      });
    },

    //每次打开弹窗都会清空表单并重置校验
    ShowDiglog() {
      this.pojo.id = null;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.disabledFlag = false;
        this.$refs["pojoForm"].resetFields();
      });
    }
  },
  //定义过滤器，将支付类型（数字）转换为文字
  filters: {
    payTypeFilter(typeNum) {
      //typeNum 为传进来的支付类型（数字）
      const payObj = FilterArr.find(obj => obj.id === typeNum);
      // return payObj ? payObj.typeName : null;
      return payObj.typeName;
    }
  }
};
</script>