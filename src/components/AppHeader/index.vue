<template>
  <div class="header">
    <a href="#/home/">
      <img class="logo" src="@/assets/logo.png" width="30" height="30" />
      <span class="company">会员管理系统</span>
    </a>

    <el-dropdown @command="handleCommand">
      <span class="el-dropdown-link">
        {{user.name}}
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="change-password">修改密码</el-dropdown-item>
        <el-dropdown-item command="exit">退出系统</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <!--修改密码-->
    <el-dialog title="修改密码" :visible.sync="dialogVisible" width="400px">
      <el-form :model="forms" :rules="rules" status-icon ref="pwdForm">
        <el-form-item label="旧密码" prop="oldPwd">
          <el-input v-model="forms.oldPwd" autocomplete="off" type="password"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="pwd">
          <el-input v-model="forms.pwd" autocomplete="off" type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="checkPwd">
          <el-input v-model="forms.checkPwd" autocomplete="off" type="password"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="$refs['pwdForm'].resetFields()">重置</el-button>
        <el-button type="primary" @click="changPassword('pwdForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- end dialog-->
  </div>
</template>
<script>
import { logout } from "@/api/login.js";
import passwordApi from "@/api/password.js";
export default {
  data() {
    //检验旧密码是否正确
    const olds = (r, v, callback) => {
      passwordApi.checkPwd(this.user.id, v).then(res => {
        const resp = res.data;
        if (!resp.flag) {
          callback(new Error(resp.message));
        } else {
          callback();
        }
      });
    };

    //校验新密码与旧密码是否相同
    const epass = (r, v, callback) => {
      if (v == this.forms.oldPwd) {
        callback(new Error("请设置与原密码不一致的新密码"));
      } else {
        callback();
      }
    };

    //校验两次是否一致
    const npass = (r, v, callback) => {
      if (v != this.forms.pwd) {
        callback(new Error("两次密码不一致"));
      } else {
        callback();
      }
    };
    return {
      user: this.$store.state.user.user,
      dialogVisible: false,
      forms: {
        oldPwd: "",
        pwd: "",
        checkPwd: ""
      },
      rules: {
        oldPwd: [
          { required: true, message: "原密码不能为空", trigger: "blur" },
          { validator: olds, trigger: "change" }
        ],
        pwd: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          { validator: epass, trigger: "change" }
        ],
        checkPwd: [
          { required: true, message: "确认密码不能为空", trigger: "blur" },
          { validator: npass, trigger: "change" }
        ]
      }
    };
  },
  methods: {
    handleCommand(command) {
      switch (command) {
        case "change-password":
          this.showDialog();
          break;

        case "exit": //用户点击退出系统按钮
          this.handleLogout();
          break;

        default:
          break;
      }
    },
    showDialog() {
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs["pwdForm"].resetFields();
      });
    },
    changPassword(t) {
      //this.dialogVisible = false;
      this.$refs[t].validate(v => {
        if (v) {
          passwordApi.updatePwd(this.user.id, this.forms.pwd).then(res => {
            const resp = res.data;
            this.$message({
              type: resp.flag ? "success" : "warning",
              message: resp.message
            });
            if (resp.flag) {
              this.dialogVisible = false;
              //清空表单

              //更新成功，退出系统
              this.handleLogout();
            }
          });
        } else {
          this.$message("请检查密码");
        }
      });
    },
    handleLogout() {
      this.$store.dispatch("Logout").then(res => {
        //console.log(res)
        if (res.flag) {
          this.$router.push("/login");
        } else {
          this.$message({
            message: rsp.message,
            type: "warning"
          });
        }
      });
    }
  },

  created() {}
};
</script>
<style scoped>
.logo {
  vertical-align: middle;
  padding: 0px 10px 0px 40px;
}
.company {
  position: absolute;
  color: aqua;
}
.el-dropdown {
  float: right;
  margin-right: 40px;
}
.el-dropdown-link {
  color: cornsilk;
  cursor: pointer;
}
</style>
