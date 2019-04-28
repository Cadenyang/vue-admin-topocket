import request from '@/utils/request'

/**
 * @export 基本配置列表
 * @param {String} pageNum 页码
 * @param {String} pageSize 条数
 * @returns
 */
export function getBasicList(pageNum, pageSize) {
  return request({
    url: '/api/config/Basic/getList',
    method: 'get',
    params: {
      pageNum,
      pageSize
    }
  })
}

/**
 * @export 添加基本配置
 * @param {Object} params 参数集合
 * @param params.value 值
 * @param params.tag 订单类型
 * @param params.remark 备注
 * @param params.status 状态
 * @param params.code 谷歌验证码
 * @returns
 */
export function addBaseConfig(params) {
  return request({
    url: '/api/config/Basic/addBaseConfig',
    method: 'post',
    data: {
      value: params.value,
      tag: params.tag,
      remark: params.remark,
      status: params.status,
      code: params.code
    }
  })
}

/**
 * @export 修改基本配置
 * @param {Object} params 参数集合
 * @param params.id id
 * @param params.value 值
 * @param params.tag 订单类型
 * @param params.remark 备注
 * @param params.status 状态
 * @param params.code 谷歌验证码
 * @returns
 */
export function editBaseConfig(params) {
  return request({
    url: '/api/config/Basic/editBaseConfig',
    method: 'post',
    data: {
      id: params.id,
      value: params.value,
      tag: params.tag,
      remark: params.remark,
      status: params.status,
      code: params.code
    }
  })
}

/**
 * @export 删除基本配置
 * @param {*} id
 * @param {*} code
 * @returns
 */
export function delBaseConfig(id, code) {
  return request({
    url: '/api/config/Basic/delBaseConfig',
    method: 'post',
    data: {
      id,
      code
    }
  })
}

/**
 * @export 兑换配置列表
 * @param {String} pageNum 页码
 * @param {String} pageSize 条数
 * @param {Number} direction 兑换方向（1：买入兑换； 2：卖出兑换； 默认：1）
 * @returns
 */
export function getConvertList(pageNum, pageSize, direction) {
  return request({
    url: '/api/config/Convert/getList',
    method: 'get',
    params: {
      pageNum,
      pageSize,
      direction
    }
  })
}

/**
 * @export 添加兑换配置
 * @param {Object} params 参数集合
 * @param params.exchangeRate 	兑换比例
 * @param params.deductionRate 	扣除比例
 * @param params.fixedValue 固定值
 * @param params.deductionType 手续费方式（1:按扣除比例计算手续费; 2:按固定值计算手续费）
 * @param params.status 状态
 * @param params.code 谷歌验证码
 * @returns
 */
export function addConvertConfig(params) {
  return request({
    url: '/api/config/Convert/addConvert',
    method: 'post',
    data: {
      exchangeRate: params.exchangeRate,
      deductionRate: params.deductionRate,
      fixedValue: params.fixedValue,
      deductionType: params.deductionType,
      status: params.status,
      code: params.code
    }
  })
}

/**
 * @export 修改兑换配置
 * @param {Object} params 参数集合
 * @param params.id id
 * @param params.exchangeRate 	兑换比例
 * @param params.deductionRate 	扣除比例
 * @param params.fixedValue 固定值
 * @param params.deductionType 手续费方式（1:按扣除比例计算手续费; 2:按固定值计算手续费）
 * @param params.status 状态
 * @param params.code 谷歌验证码
 * @returns
 */
export function editConvertConfig(params) {
  return request({
    url: '/api/config/Convert/editConvert',
    method: 'post',
    data: {
      id: params.id,
      exchangeRate: params.exchangeRate,
      deductionRate: params.deductionRate,
      fixedValue: params.fixedValue,
      deductionType: params.deductionType,
      status: params.status,
      code: params.code
    }
  })
}
