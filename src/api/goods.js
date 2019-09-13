import req from "@/utils/request.js";

export default {
  //获取商品列表
  /*  getGoodsList() {
        return req({
            url: '/goods/list',
            method: 'get'
        })
    }, */
  search(currentPage, pageSize, searchMap) {
    return req({
      url: `/goods/list/search/${currentPage}/${pageSize}`,
      method: "post",
      data: searchMap
    });
  },


  addGoods(pojo) {
    return req({
      url: '/goods',
      method: 'post',
      data: pojo
    })
  },
  searchGoods(id) {
    return req({
      url: `/goods/${id}`,
      method: "get"
    });
  },
  //修改
  updateGoods(pojo) {
    return req({
      url: `/goods/${pojo.id}`,
      method: "put",
      data: pojo
    });
  },
  deleteGoods(id) {
    return req({
      url: `/goods/${id}`,
      method: "delete"
    });
  }
};
