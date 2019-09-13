import req from '@/utils/request.js';

export default {
    checkPwd(userId, password) {
        return req({
            url: 'user/pwd',
            method: 'post',
            data: {
                userId,
                password
            }
        })
    },

    updatePwd(userId, password) {
        return req({
            url: 'user/pwd',
            method: 'put',
            data: {
                userId,
                password
            }
        })
    }
}