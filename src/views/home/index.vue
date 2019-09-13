<template>
  <div align="center">
    <h2>欢迎光临</h2>
    <p>我把你紧紧拥入怀里</p>
    <p>哈哈哈哈</p>
    <p>小娜不能为你做啥，为你提供一个简易计算器吧</p>
    <p>哈哈哈，但是这个计算器千万不要乘除与加减混用哈哈哈</p>
    <p>程序员主人告诉我他没有做优先级运算</p>
    <el-button @click="close">关闭弹窗</el-button>

    <div style="width:245px;">
      <el-input type="textarea" v-model="AllString" disabled placeholder="输入"></el-input>
      <el-input type="textarea" v-model="result" disabled placeholder="计算结果"></el-input>

      <el-button-group v-for="gr in btns" :key="gr.type">
        <el-button
          v-for="(br,index) in gr.btn"
          :key="index"
          :type="br.color"
          @click="gobtn(gr,br)"
        >{{br.text}}</el-button>
      </el-button-group>
    </div>
  </div>
</template>

<script>
Array.prototype.method1 = function() {
  var arr = [];
  for (var i = 0; i < this.length; i++) {
    if (arr.indexOf(this[i]) == -1) {
      arr.push(this[i]);
    }
  }
  return arr;
};
export default {
  data() {
    return {
      ddd: "",
      AllString: "",
      result: null,
      btns: [
        {
          type: "1",
          isCo: true,
          btn: [
            { text: "6", color: "info" },
            { text: "7", color: "info" },
            { text: "8", color: "info" },
            { text: "9", color: "info" },
            { text: "0", color: "info" }
          ]
        },
        {
          type: "2",
          isCo: true,
          btn: [
            { text: "1", color: "info" },
            { text: "2", color: "info" },
            { text: "3", color: "info" },
            { text: "4", color: "info" },
            { text: "5", color: "info" }
          ]
        },
        {
          type: "3",
          isCo: true,
          btn: [
            { text: "+", color: "primary" },
            { text: "-", color: "primary" },
            { text: "*", color: "primary" },
            { text: "/", color: "primary" }
          ]
        },
        {
          type: "4",
          isCo: false,
          btn: [
            { text: "重置", color: "primary" },
            { text: "清除", color: "danger" },
            { text: "计算", color: "success" }
          ]
        }
      ]
    };
  },
  methods: {
    gobtn(objP, objC) {
      // alert(obj.text)

      if (objP.isCo) {
        this.AllString = this.AllString + objC.text;
      } else {
        switch (objC.text) {
          case "重置":
            //alert("正在重置");
            this.AllString = "";
            this.result = "";
            break;
          case "清除":
            // alert("正在清除");
            const strLength = this.AllString.length;
            this.AllString = this.AllString.substr(0, strLength - 1);
            break;
          case "计算":
            //alert("正在计算");

            // console.log(this.AllString.split(""))

            //收取用户输入了哪些计算符
            //  console.log(['1','3','5'].indexof('1'))
            const t = this.AllString,
              s = t.split("").filter(v => {
                return isNaN(v);
              });
            //console.log(s)
            //console.log(s.join(""))
            this.caculate(s);

            break;
          default:
            break;
        }
      }
    },
    setMyInfo() {
      return Math.floor((Math.random() + 5) * 1000);
    },
    caculate(arr) {
      let index = [],
        tv = 0;
      let newArr = this.AllString;
      for (let i = 0; i < arr.length; i++) {
        index[i] = newArr.indexOf(arr[i], tv);
        /* newArr=newArr.substr(index[i]+1,newArr.length-index[i]) */
        tv = index[i] + 1;
      }

      if (
        !index[0] ||
        this.AllString.substr(index[index.length - 1] + 1, 1) == ""
      ) {
        this.$message({
          type: "error",
          message: "你的输入有误，小娜无法为您计算出正确答案"
        });
        return;
      }

      index.forEach((value, i, lt) => {
        // console.log(value, i, lt);
        if (parseInt(lt[i + 1]) - parseInt(lt[i]) == 1) {
          this.$message({
            type: "error",
            message: "你的输入有误，小娜无法为您计算出正确答案"
          });
          return;
        }
      });

      //若用户为错误输入
      //执行一下代码
      {
        let num_right = "",
          in_index = 0,
          sum = parseInt(this.AllString.substring(0, index[0]));

        for (let i = 0; i < index.length; i++) {
          in_index = parseInt(index[i]) + 1;

          if (index.length == 1) {
            num_right = this.AllString.substring(
              in_index,
              this.AllString.length
            );
          } else {
            num_right = this.AllString.substring(in_index, index[i + 1]);
            // console.log("rig", num_right);
          }

          if (arr[i] == "+") {
            sum = sum + parseInt(num_right);
          } else if (arr[i] == "-") {
            sum = sum - parseInt(num_right);
          } else if (arr[i] == "*") {
            sum = sum * parseInt(num_right);
          } else if (arr[i] == "/") {
            sum = sum / parseInt(num_right);
          }
          //sum= sum+parseInt(num_right) + parseInt(num_left);
        }

        // console.log(num_left);
        // console.log(num_right);
        this.result = sum;
      }
      /////
    },
    close(){
      clearTimeout(this.ddd)
    }
  },

  created() {
    this.ddd = setTimeout(() => {
      this.$message({
        type: "success",
        message: "这位菜鸡工程师还在努力开发高级计算器哟~~~~~"
      });
    }, this.setMyInfo());
    /* const a = "-";
    const b='+'

    console.log(isNaN(a));
    console.log(isNaN(b)); */
  }
};
</script>
