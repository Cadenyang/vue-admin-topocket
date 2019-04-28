import request from '@/utils/request'

/**
 * @export 公告列表
 * @param {Number} pageNum
 * @param {Number} pageSize
 * @returns
 */
export function getAnnouncementList(pageNum, pageSize) {
  return request({
    url: '/api/information/Announcement/getList',
    method: 'get',
    params: {
      pageNum,
      pageSize
    }
  })
}

/**
 * @export 添加公告
 * @param {Object} params 参数集合
 * @param params.title 标题
 * @param params.client 平台
 * @param params.language 语言
 * @param params.content 内容
 * @param params.status 是否可见
 * @param params.code 谷歌验证码
 * @returns
 */
export function addNotice(params) {
  return request({
    url: '/api/information/Announcement/addNotice',
    method: 'post',
    data: {
      title: params.title,
      client: params.client,
      language: params.language,
      content: params.content,
      status: params.status,
      code: params.code
    }
  })
}

/**
 * @export 修改公告
 * @param {Object} params 参数集合
 * @param params.id id
 * @param params.title 标题
 * @param params.client 平台
 * @param params.language 语言
 * @param params.content 内容
 * @param params.status 是否可见
 * @param params.code 谷歌验证码
 * @returns
 */
export function editNotice(params) {
  return request({
    url: '/api/information/Announcement/editNotice',
    method: 'post',
    data: {
      id: params.id,
      title: params.title,
      client: params.client,
      language: params.language,
      content: params.content,
      status: params.status,
      code: params.code
    }
  })
}

/**
 * @export 删除公告
 * @param {*} id
 * @param {*} code
 * @returns
 */
export function delNotice(id, code) {
  return request({
    url: '/api/information/Announcement/delNotice',
    method: 'post',
    data: {
      id,
      code
    }
  })
}

/**
 * @export Banner列表
 * @param {Number} pageNum
 * @param {Number} pageSize
 * @returns
 */
export function getBannerList(pageNum, pageSize) {
  return request({
    url: '/api/information/Banner/getList',
    method: 'get',
    params: {
      pageNum,
      pageSize
    }
  })
}

/**
 * @export 添加Banner
 * @param {Object} params 参数集合
 * @param params.title 标题
 * @param params.url 页面链接
 * @param params.client 平台
 * @param params.language 语言
 * @param params.imgUrl 图片
 * @param params.status 是否可见
 * @param params.code 谷歌验证码
 * @returns
 */
export function addBanner(params) {
  return request({
    url: '/api/information/Banner/addBanner',
    method: 'post',
    data: {
      title: params.title,
      url: params.url,
      client: params.client,
      language: params.language,
      imgUrl: params.imgUrl,
      status: params.status,
      code: params.code
    }
  })
}

/**
 * @export 修改Banner
 * @param {Object} params 参数集合
 * @param params.id id
 * @param params.title 标题
 * @param params.url 页面链接
 * @param params.client 平台
 * @param params.language 语言
 * @param params.imgUrl 图片
 * @param params.status 是否可见
 * @param params.code 谷歌验证码
 * @returns
 */
export function editBanner(params) {
  return request({
    url: '/api/information/Banner/editBanner',
    method: 'post',
    data: {
      id: params.id,
      title: params.title,
      url: params.url,
      client: params.client,
      language: params.language,
      imgUrl: params.imgUrl,
      status: params.status,
      code: params.code
    }
  })
}

/**
 * @export 删除Banner
 * @param {*} id
 * @param {*} code
 * @returns
 */
export function delBanner(id, code) {
  return request({
    url: '/api/information/Banner/delBanner',
    method: 'post',
    data: {
      id,
      code
    }
  })
}

/**
 * @export App版本列表
 * @param {Number} pageNum
 * @param {Number} pageSize
 * @returns
 */
export function getVersionList(pageNum, pageSize) {
  return request({
    url: '/api/information/Version/getList',
    method: 'get',
    params: {
      pageNum,
      pageSize
    }
  })
}

/**
 * @export 添加APP版本
 * @param {Object} params 参数集合
 * @param params.name app名称
 * @param params.number 版本号
 * @param params.platform 平台
 * @param params.updateUrl 下载地址
 * @param params.hotUrl 热更新地址
 * @param params.info 更新描述
 * @param params.force 强制更新
 * @param params.status 是否可见
 * @param params.code 谷歌验证码
 * @returns
 */
export function addVersion(params) {
  return request({
    url: '/api/information/Version/addVersion',
    method: 'post',
    data: {
      name: params.name,
      number: params.number,
      platform: params.platform,
      updateUrl: params.updateUrl,
      hotUrl: params.hotUrl,
      info: params.info,
      force: params.force,
      status: params.status,
      code: params.code
    }
  })
}

/**
 * @export 修改APP版本
 * @param {Object} params 参数集合
 * @param params.id id
 * @param params.name app名称
 * @param params.number 版本号
 * @param params.platform 平台
 * @param params.updateUrl 下载地址
 * @param params.hotUrl 热更新地址
 * @param params.info 更新描述
 * @param params.force 强制更新
 * @param params.status 是否可见
 * @param params.code 谷歌验证码
 * @returns
 */
export function editVersion(params) {
  return request({
    url: '/api/information/Version/editVersion',
    method: 'post',
    data: {
      id: params.id,
      name: params.name,
      number: params.number,
      platform: params.platform,
      updateUrl: params.updateUrl,
      hotUrl: params.hotUrl,
      info: params.info,
      force: params.force,
      status: params.status,
      code: params.code
    }
  })
}
