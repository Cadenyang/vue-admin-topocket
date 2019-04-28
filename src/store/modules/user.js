import { login, logout } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    username: '',
    phone: '',
    email: '',
    roles: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
      setToken(token)
    },
    SET_USERNAME: (state, name) => {
      state.username = name
    },
    SET_PHONE: (state, phone) => {
      state.phone = phone
    },
    SET_EMAIL: (state, email) => {
      state.email = email
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const loginAccount = userInfo.username.trim()
      const loginPassword = userInfo.password
      const loginType = userInfo.loginType
      return new Promise((resolve, reject) => {
        login(loginAccount, loginPassword, loginType).then(response => {
          const data = response.data
          commit('SET_TOKEN', data.token)
          commit('SET_USERNAME', data.userName)
          commit('SET_PHONE', data.phone)
          commit('SET_EMAIL', data.email)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
