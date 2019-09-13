<template>
  <div class="container">
    <el-form ref="form" :model="form" label-width="80px" :rules="rules" class="login-form">
      <h2 class="form-title">会员管理系统</h2>
      <el-form-item label="账号" prop="username">
        <el-input v-model="form.username"></el-input>
      </el-form-item>

      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" type="password"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit(form)">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { login, getUserInfo } from "@/api/login";
export default {
  data() {
    return {
      form: {
        username: "",
        password: ""
      },
      rules: {
        username: [{ required: true, message: "请输入账号", trigger: "blur" }],
        password: [{ required: true, message: "密码不能为空" }]
      }
    };
  },
  methods: {
    onSubmit(form) {
      this.$refs.form.validate(v => {
        // console.log(v)  v表示表单是否全部输入
        if (v) {
          //将数据提交到后台验证
          /*  login(this.form.username, this.form.password)
            .then(res => {
              const res1 = res.data;
              // console.log(res1.data.token);

              // console.log(res1);
              if (res1.flag) {
                //验证成功，通过token去获取用户信息
                getUserInfo(res1.data.token).then(res => {
                  const res2 = res.data;
                  if (res2.flag) {
                    //获取用户信息
                    //console.log(res2.data);

                    //保存信息
                    localStorage.setItem("user", JSON.stringify(res2.data));
                    localStorage.setItem("token", res1.data.token);
                    //前往首页
                    this.$router.push("/");
                  } else {
                    //未能获取到信息
                    this.$message({
                      message: res2.message,
                      type: "warning"
                    });
                  }
                });
              } else {
                //未通过
                this.$message({
                  message: res1.message,
                  type: "warning"
                });
              }
            })
            .catch(error => {
              this.$message({
                message: error,
                type: "warning"
              });
            });
       
       // */
          this.$store
            .dispatch("Login", this.form)
            .then(r => {
              //r是接口返回的data
              //console.log(r);
              if (r.flag) {
                  this.$router.push("/");
              } else {
                this.$message({
                  type: "warning",
                  message: r.message
                });
              }
            })

          //console.log(this.$store.state.user.user);
        } else {
          this.$message("请输入必填项");
          return false;
        }
      });
    }
  }
};
</script>
<style scoped>
.login-form {
  background-color: skyblue;
  width: 350px;
  margin: 160px auto;
  padding: 30px;
  border-radius: 20px;
  background: url("../../assets/bg.jpg") no-repeat;
}
.el-form-item__label {
  color: cyan;
}
.form-title {
  text-align: center;
  color: darkkhaki;
}
.container {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: grey;
}
</style>
