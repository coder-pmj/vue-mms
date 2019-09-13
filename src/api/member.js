import req from "@/utils/request.js";

export default {
  getMemberList() {
    return req({
      url: "/member/list",
      method: "get"
    });
  },
  //分页搜索
  //page 当前页码 size每页数据大小  searchMap条件查询条件值
  search(page, size, searchMap) {
    return req({
      url: `/member/list/search/${page}/${size}`,
      method: "post",
      data: searchMap
    });
  },
  //添加会员
  addMember(pojo) {
    return req({
      url: "/member",
      method: "post",
      data: pojo
    });
  },
  //编辑会员，查询
  SearchMember(id) {
    return req({
      url: `/member/${id}`,
      method: "get"
    });
  },
  //修改会员接口
  UpdateMember(pojo) {
    return req({
      url: `/member/${pojo.id}`,
      method: "put",
      data: pojo
    });
  },
  //删除会员接口
  DeleteMember(id) {
    return req({
      url: `/member/${id}`,
      method: "delete"
    });
  }
};
