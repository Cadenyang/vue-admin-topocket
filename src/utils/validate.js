export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

export function isNumber(rule, value, callback) {
  if (!/^\d*\.?\d+$/.test(value)) {
    callback(new Error('请输入正确的数值'))
  } else {
    callback()
  }
}
