import req from "@/utils/request.js";

export default {
    //分页接口
    search(currentPage, size, searchMap) {
        return req({
            url: `/staff/list/search/${currentPage}/${size}`,
            method: "post",
            data: searchMap
        });
    },
    //新增员工
    addStaff(pojo) {
        return req({
            url: "/staff",
            method: "post",
            data: pojo
        });
    },
    //查询接口
    searchStaff(id) {
        return req({
            url: `/staff/${id}`,
            method: "get"
        });
    },
    //更新接口
    UpdateStaff(pojo) {
        return req({
            url: `/staff/${pojo.id}`,
            method: "put",
            data: pojo
        });
    },
    //删除接口
    DeleteStaff(id) {
        return req({
            url: `/staff/${id}`,
            method: "delete"
        });
    }
}