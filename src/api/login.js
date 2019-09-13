import req from "@/utils/request.js";

//定义用户登录的接口
export function login(username, password) {
  return req({
    method: "post",
    url: "/user/login",
    data: {
      username,
      password
    }
  });
}

//
export function getUserInfo(token) {
  return req({
    url: `/user/info/${token}`,
    method: "get"
  });
}

//定义用户登出的接口
export function logout(token) {
  return req({
    url: `/user/logout`,
    method: "post"
  });
}
