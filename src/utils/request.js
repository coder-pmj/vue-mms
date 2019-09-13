import axios from "axios";
import { Loading, Message } from 'element-ui';

// Loading.service({target:'body'})

const loading = {
  loadingInstance: null,
  open() {
    if (this.loadingInstace === null) {
      this.loadingInstance = Loading.service({ target: '.main', text: "拼命加载中……" })
    }

  },
  close() {
    if (this.loadingInstance != null) {
      this.loadingInstance.close()
    }
    this.loadingInstace = null
  }
}



const MyReq = axios.create({
  baseURL: process.env.VUE_APP_SERVICE_URL,
  timeout: 5000 //请求超过5000ms=>超时
});

//请求的拦截
MyReq.interceptors.request.use(
  config => {
    loading.open()
    // loading2.open()
    return config;
  },
  error => {
    loading.close()
    // loading2.close()
    return Promise.reject(error);
  }
);

//响应拦截
MyReq.interceptors.response.use(
  res => {
    loading.close()
    // loading2.close()
    const resp = res.data
    if (resp.code != 2000) {
      Message({
        type: 'error',
        duration: 5000,
        message: '请求超时' || resp.message
      })
    }
    return res;
  },
  error => {
    loading.close()
    // loading2.close()
    Message({
      message: error.message,
      type: 'error',
      duration: 5000
    })
    return Promise.reject(error);
  }
);

export default MyReq;
