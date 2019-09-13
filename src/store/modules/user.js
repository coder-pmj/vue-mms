import * as handleLocal from '@/utils/auth';
import * as loginApi from '@/api/login';

export default {
    state: {
        token: handleLocal.getToken(),
        user: handleLocal.getUser()
    },
    mutations: {
        set_token(state, token) {
            state.token = token
            handleLocal.setToken(token)
        },
        set_user(state, user) {
            state.user = user
            handleLocal.setUser(user)
        }

    },
    actions: {
        //登录判断
        Login({ commit }, forms) {
            //console.log('Login')
            return new Promise((resolve, reject) => {
                loginApi.login(forms.username.trim(), forms.password).then(res => {
                    const resp = res.data
                    //console.log(resp)
                    commit('set_token', resp.data.token)

                    //通知运用成功,并将resp传入
                    resolve(resp)
                }).catch(error => {
                    reject(error)
                })
            })

        },
        GetUserInfo({ commit, state }) {
            return new Promise((resolve, reject) => {
                loginApi.getUserInfo(state.token).then(res => {
                    const resp = res.data
                  //  console.log(resp)
                    commit('set_user', resp.data)

                    resolve(resp)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        //退出
        Logout({ commit, state }, token) {
            //console.log(token)
            return new Promise((resolve, reject) => {
                loginApi.logout(state.token).then(res => {
                    const resp = res.data
                    commit('set_token', null)
                    commit('set_user', null)

                    handleLocal.removeToken()
                    resolve(resp)
                }).catch(error => {
                    reject(error)
                })
            })
        }
    }
}