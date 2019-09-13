import req from "@/utils/request.js";

export default {
  //获得供应商数据
  getSupplierList() {
    return req({
      url: "/supplier/list",
      method: "get"
    });
  },
  //分页接口
  search(currentPage, size, searchMap) {
    return req({
      url: `/supplier/list/search/${currentPage}/${size}`,
      method: "post",
      data: searchMap
    });
  },

  //新增供应商
  addSupplier(pojo) {
    return req({
      url: "/supplier",
      method: "post",
      data: pojo
    });
  },
  //查询接口
  searchSupplier(id) {
    return req({
      url: `/supplier/${id}`,
      method: "get"
    });
  },
  //更新接口
  UpdateSupplier(pojo) {
    return req({
      url: `/supplier/${pojo.id}`,
      method: "put",

      data: pojo
    });
  },
  //删除接口
  DeleteSupplier(id) {
    return req({
      url: `/supplier/${id}`,
      method: "delete"
    });
  }
};
