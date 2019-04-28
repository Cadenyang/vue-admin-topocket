import request from '@/utils/request'

/**
 * @export 兑换交易买入列表
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
export function getBuyExchange(params) {
  return request({
    url: '/api/convert/BuyTransaction/getBuyExchange',
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
 * @export 兑换交易卖出列表
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
export function getSellExchange(params) {
  return request({
    url: '/api/convert/SellTransaction/getSellExchange',
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
 * @param {String} module 模块名称(BuyTransaction:兑换交易买入； SellTransaction:兑换交易卖出;)
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
    url: '/api/convert/' + module + '/remarks',
    method: 'post',
    data: {
      id,
      remark
    }
  })
}

/**
 * @export USDx与USDT兑换记录列表
 * @param {Object} params 参数集合
 * @param params.pageNum 页码
 * @param params.pageSize 每页条数
 * @param params.startTime 开始时间
 * @param params.endTime 结束时间
 * @param params.search 手机号或用户名
 * @param params.coinType 币种
 * @returns
 */
export function getRecordExchange(params) {
  return request({
    url: '/api/convert/ConvertRecord/getList',
    method: 'get',
    params: {
      pageNum: params.pageNum,
      pageSize: params.pageSize,
      startTime: params.startTime || '',
      endTime: params.endTime || '',
      search: params.search || '',
      coinType: params.coinType || ''
    }
  })
}
