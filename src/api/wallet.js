import request from '@/utils/request'

/**
 * @export 用户列表
 * @param {Object} params 参数集合
 * @param params.pageNum 页码
 * @param params.pageSize 每页条数
 * @param params.startTime 开始时间
 * @param params.endTime 结束时间
 * @param params.search 手机号或用户名
 * @returns
 */
export function getUserList(params) {
  return request({
    url: '/api/user/UserList/getUserList',
    method: 'get',
    params: {
      pageNum: params.pageNum,
      pageSize: params.pageSize,
      startTime: params.startTime || '',
      endTime: params.endTime || '',
      search: params.search || ''
    }
  })
}

/**
 * @export 提币列表
 * @param {Object} params 参数集合
 * @param params.pageNum 页码
 * @param params.pageSize 每页条数
 * @param params.startTime 开始时间
 * @param params.endTime 结束时间
 * @param params.search 手机号或用户名
 * @param params.coinType 币种
 * @param params.status 状态
 * @returns
 */
export function getWithdrawalList(params) {
  return request({
    url: '/api/user/WithdrawalList/getWithdrawalList',
    method: 'get',
    params: {
      pageNum: params.pageNum,
      pageSize: params.pageSize,
      startTime: params.startTime || '',
      endTime: params.endTime || '',
      search: params.search || '',
      coinType: params.coinType || '',
      status: (params.status || params.status === 0) ? params.status : ''
    }
  })
}

/**
 * @export 存币列表
 * @param {Object} params 参数集合
 * @param params.pageNum 页码
 * @param params.pageSize 每页条数
 * @param params.startTime 开始时间
 * @param params.endTime 结束时间
 * @param params.search 手机号或用户名
 * @param params.coinType 币种
 * @param params.status 状态
 * @returns
 */
export function getDepositList(params) {
  return request({
    url: '/api/user/DepositList/getDepositList',
    method: 'get',
    params: {
      pageNum: params.pageNum,
      pageSize: params.pageSize,
      startTime: params.startTime || '',
      endTime: params.endTime || '',
      search: params.search || '',
      coinType: params.coinType || '',
      status: (params.status || params.status === 0) ? params.status : ''
    }
  })
}

/**
 * @export 各模块备注
 * @param {String} module 模块名称(userList:用户列表； WithdrawalList:提币列表； DepositList：存币列表)
 * @param {Number} id id
 * @param {String} remark 备注
 * @returns
 */
export function remark(module, id, remark) {
  if (!module) {
    console.warn('请确认需要备注的模块')
    return false
  }
  return request({
    url: '/api/user/' + module + '/remarks',
    method: 'post',
    data: {
      id,
      remark
    }
  })
}

/**
 * @export 获取用户资产
 * @param {Number} id id
 * @param {String} coinType 币种
 * @param {Number} pageNum 页码
 * @param {Number} pageSize 每页条数
 * @returns
 */
export function getUserBalance(id, coinType, pageNum, pageSize) {
  return request({
    url: '/api/user/UserList/getUserBalance',
    method: 'post',
    data: {
      id,
      coinType,
      pageNum,
      pageSize
    }
  })
}
