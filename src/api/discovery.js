import request from '@/utils/request'

/**
 * @export 发现列表管理
 * @param {Object} params 参数集合
 * @param params.pageNum 页码
 * @param params.pageSize 每页条数
 * @param params.startTime 开始时间
 * @param params.endTime 结束时间
 * @param params.title 标题
 * @param params.status 状态
 * @param params.language 语言
 * @returns
 */
export function getDiscoveryList(params) {
  return request({
    url: '/api/discovery/DiscoveryList/getList',
    method: 'get',
    params: {
      pageNum: params.pageNum,
      pageSize: params.pageSize,
      startTime: params.startTime || '',
      endTime: params.endTime || '',
      title: params.title || '',
      language: params.language || '',
      status: (params.status || params.status === 0) ? params.status : ''
    }
  })
}

/**
 * @export 添加发现
 * @param {Object} params 参数集合
 * @param params.title 标题
 * @param params.url 页面链接
 * @param params.language 语言
 * @param params.imgUrl 图片
 * @param params.status 是否可见
 * @param params.code 谷歌验证码
 * @returns
 */
export function addDiscovery(params) {
  return request({
    url: '/api/discovery/DiscoveryList/addDiscovery',
    method: 'post',
    data: {
      title: params.title,
      url: params.url,
      language: params.language,
      imgUrl: params.imgUrl,
      status: params.status,
      code: params.code
    }
  })
}

/**
 * @export 修改发现
 * @param {Object} params 参数集合
 * @param params.id id
 * @param params.title 标题
 * @param params.url 页面链接
 * @param params.language 语言
 * @param params.imgUrl 图片
 * @param params.status 是否可见
 * @param params.code 谷歌验证码
 * @returns
 */
export function editDiscovery(params) {
  return request({
    url: '/api/discovery/DiscoveryList/addDiscovery',
    method: 'post',
    data: {
      id: params.id,
      title: params.title,
      url: params.url,
      language: params.language,
      imgUrl: params.imgUrl,
      status: params.status,
      code: params.code
    }
  })
}

/**
 * @export 删除发现
 * @param {*} id
 * @param {*} code
 * @returns
 */
export function delDiscovery(id, code) {
  return request({
    url: '/api/discovery/DiscoveryList/delDiscovery',
    method: 'post',
    data: {
      id,
      code
    }
  })
}
