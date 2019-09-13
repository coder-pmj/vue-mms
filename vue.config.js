module.exports = {
  publicPath:'./',
  devServer: {
    port: 6930, //重信配置端口号
    https: false,
    open: true,
    proxy: {
      [process.env.VUE_APP_BASE_API]: {
        target: process.env.VUE_APP_SERVICE_URL,
        changeOrigin: true,
        pathRewrite: {
          ["^" + process.env.VUE_APP_BASE_API]: ""
        }
      }
    }
  },
  lintOnSave: false, //关闭格式检查
  //outputDir: "dist", //指定打包后的目录
  //assetsDir: "assets", //静态资源打包后的路径，相对于outputDir的目录
  //indexPath: "out/index.html" //打包后主页位置
};
