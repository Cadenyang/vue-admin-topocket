import request from '@/utils/request'

export function SendEditPwdEmail() {
  return request({
    url: '/api/personalInfo/sendEmail',
    method: 'post',
    params: {}
  })
}

/**
 * @param {String} password 密码
 * @param {String} code 验证码
 */
export function setLoginPwd(password, code) {
  return request({
    url: '/api/personalInfo/setLoginPwd',
    method: 'post',
    params: {
      password,
      code
    }
  })
}

/**
 * @export
 * @param {String} code 邮箱验证码
 * @returns
 */
export function generateGoogleKey(code) {
  return request({
    url: '/api/personalInfo/google_key',
    method: 'post',
    params: {
      code
    }
  })
}
