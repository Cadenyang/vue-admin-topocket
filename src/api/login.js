import request from '@/utils/request'

/**
 * @param {String} loginAccount 用户名
 * @param {String} loginPassword 密码
 * @param {String} loginType 登录类型(1:邮箱验证码登录, 2:手机验证码登录, 3:账号密码登录, 4:邮箱密码登录, 5手机号密码登录)
 */
export function login(loginAccount, loginPassword, loginType) {
  return request({
    url: '/api/login',
    method: 'post',
    data: {
      loginAccount,
      loginPassword,
      loginType
    }
  })
}

/**
 * @param {String} email 邮箱
 */
export function sendLoginEmail(email) {
  return request({
    url: '/api/login/send',
    method: 'post',
    data: {
      email
    }
  })
}

export function logout() {
  return request({
    url: '/api/user/logout',
    method: 'post'
  })
}
