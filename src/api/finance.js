import request from '@/utils/request'

/**
 * @export 产品列表
 * @param {Object} params 参数集合
 * @param params.pageNum 页码
 * @param params.pageSize 每页条数
 * @param params.startTime 开始时间
 * @param params.endTime 结束时间
 * @param params.name 产品名
 * @param params.coinType 币种
 * @param params.status 状态
 * @returns
 */
export function getProductList(params) {
  return request({
    url: '/api/finance/ProductList/getList',
    method: 'get',
    params: {
      pageNum: params.pageNum,
      pageSize: params.pageSize,
      startTime: params.startTime || '',
      endTime: params.endTime || '',
      name: params.name || '',
      coinType: params.coinType || '',
      status: (params.status || params.status === 0) ? params.status : ''
    }
  })
}

/**
 * @export 创建产品
 * @param {Object} params 参数集合
 * @param params.name 产品名
 * @param params.totalAmount 规模
 * @param params.minAmount 每份
 * @param params.buyQuantity 购买数量
 * @param params.coinType 币种
 * @param params.rate 利率
 * @param params.status 上下架状态
 * @param params.code Google验证码
 * @returns
 */
export function addProduct(params) {
  return request({
    url: '/api/finance/ProductList/addProduct',
    method: 'post',
    data: {
      name: params.name,
      totalAmount: params.totalAmount,
      minAmount: params.minAmount,
      buyQuantity: params.buyQuantity,
      coinType: params.coinType,
      rate: params.rate,
      status: params.status,
      code: params.code
    }
  })
}

/**
 * @export 修改产品
 * @param {Object} params 参数集合
 * @param params.id 产品id
 * @param params.name 产品名
 * @param params.totalAmount 规模
 * @param params.minAmount 每份
 * @param params.buyQuantity 购买数量
 * @param params.coinType 币种
 * @param params.rate 利率
 * @param params.status 上下架状态
 * @param params.code Google验证码
 * @returns
 */
export function editProduct(params) {
  return request({
    url: '/api/finance/ProductList/editProduct',
    method: 'post',
    data: {
      id: params.id,
      name: params.name,
      totalAmount: params.totalAmount,
      minAmount: params.minAmount,
      buyQuantity: params.buyQuantity,
      coinType: params.coinType,
      rate: params.rate,
      status: params.status,
      code: params.code
    }
  })
}

/**
 * @export 订单列表
 * @param {Object} params 参数集合
 * @param params.pageNum 页码
 * @param params.pageSize 每页条数
 * @param params.startTime 开始时间
 * @param params.endTime 结束时间
 * @param params.search 用户名或手机号
 * @param params.orderNumber 订单号
 * @param params.coinType 币种
 * @param params.status 状态
 * @returns
 */
export function getOrderList(params) {
  return request({
    url: '/api/finance/OrderList/getList',
    method: 'get',
    params: {
      pageNum: params.pageNum,
      pageSize: params.pageSize,
      startTime: params.startTime || '',
      endTime: params.endTime || '',
      search: params.search || '',
      orderNumber: params.orderNumber || '',
      coinType: params.coinType || '',
      status: (params.status || params.status === 0) ? params.status : ''
    }
  })
}
