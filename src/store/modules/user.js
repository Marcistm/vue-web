import { getToken, setToken, removeToken, removeUser, removeUserName } from '@/utils/auth'

// 存储用户令牌和角色信息
const state ={
    token: getToken(),
    roles: [], //角色
}

const mutations ={
    SET_TOKEN: (state,token) => {
        state.token = token;
    },
    SET_ROLES: (state,roles) => {
        state.roles = roles;
    }
};

const actions = {
    // 用户登录
    login({ commit }, Token) {
        const { token } = Token;
        return new Promise((resolve,reject) => {
            setTimeout(() => {
                commit('SET_TOKEN',token);
                    // 写入cookie
                setToken(token)
                resolve()
            },1000)
        })
    },
    // 获取用户角色信息
    getInfo({ commit, state }){
        return new Promise((resolve) => {
            setTimeout(() => {
                // const roles = state.token === 'admin' ? ['admin'] : ['jerry']
                let roles = []
                let judge = parseInt(localStorage.getItem('permission'))
                let permission_lis = [[''], ['worker'], ['examiner'], ['admin']]
                roles = permission_lis[judge]
                // const roles = state.token === '' ? ['jerry'] : ['admin']
                commit('SET_ROLES',roles)
                resolve({roles})
            },1000)
        })
    },
    // 重置令牌
    resetToken({ commit }){
        return new Promise(resolve => {
            commit('SET_TOKEN','')
            commit('SET_ROLES',[])
            removeToken();
            removeUser();
            removeUserName();
            resolve()
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
