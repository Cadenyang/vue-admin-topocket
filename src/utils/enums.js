// 存币状态类型
export const DepositStatusTypes = {
  '-1': '所有',
  '0': '待存币',
  '1': '存币成功',
  '2': '存币失败',
  'TypesArray': [
    {
      key: '-1',
      value: '所有'
    },
    {
      key: '0',
      value: '待存币'
    },
    {
      key: '1',
      value: '存币成功'
    },
    {
      key: '2',
      value: '存币失败'
    }
  ]
}

// 提币状态类型
export const WithDrawStatusTypes = {
  '-1': '所有',
  '0': '待提币',
  '1': '提币成功',
  '2': '提币拒绝',
  'TypesArray': [
    {
      key: '-1',
      value: '所有'
    },
    {
      key: '0',
      value: '待提币'
    },
    {
      key: '1',
      value: '提币成功'
    },
    {
      key: '2',
      value: '提币拒绝'
    }
  ]
}

// 币种类型
export const CoinTypes = {
  '-1': '所有',
  '1': 'BTC',
  '2': 'LTC',
  '3': 'ETH',
  '4': 'BCH',
  '5': 'USDT',
  '6': 'USDX',
  'TypesArray': [
    {
      key: '-1',
      value: '所有'
    },
    {
      key: '1',
      value: 'BTC'
    },
    {
      key: '2',
      value: 'LTC'
    },
    {
      key: '3',
      value: 'ETH'
    },
    {
      key: '4',
      value: 'BCH'
    },
    {
      key: '5',
      value: 'USDT'
    },
    {
      key: '6',
      value: 'USDX'
    }
  ]
}

// 流水类型
export const AccountStatementTypes = {
  '21': '币币卖出',
  '23': '币币买入',
  '25': '理财买入',
  '26': '理财卖出',
  '27': '冻结',
  '28': '解冻',
  '29': 'otc平台买入',
  '30': 'otc平台卖出',
  '31': '手续费扣除',
  '33': '冻结手续费',
  '34': '解冻手续费',
  '35': '资产转移',
  '36': '红包划入',
  '37': '红包划出',
  '38': '红包冻结',
  '39': '红包解冻',
  '40': '出账',
  '41': '入账',
  'TypesArray': [
    {
      key: '21',
      value: '币币卖出'
    },
    {
      key: '23',
      value: '币币买入'
    },
    {
      key: '25',
      value: '理财买入'
    },
    {
      key: '26',
      value: '理财卖出'
    },
    {
      key: '27',
      value: '冻结'
    },
    {
      key: '28',
      value: '解冻'
    },
    {
      key: '29',
      value: 'otc平台买入'
    },
    {
      key: '30',
      value: 'otc平台卖出'
    },
    {
      key: '31',
      value: '手续费扣除'
    },
    {
      key: '33',
      value: '冻结手续费'
    },
    {
      key: '34',
      value: '解冻手续费'
    },
    {
      key: '35',
      value: '资产转移'
    },
    {
      key: '36',
      value: '红包划入'
    },
    {
      key: '37',
      value: '红包划出'
    },
    {
      key: '38',
      value: '红包冻结'
    },
    {
      key: '39',
      value: '红包解冻'
    },
    {
      key: '40',
      value: '出账'
    },
    {
      key: '41',
      value: '入账'
    }
  ]
}

// 交易状态类型
export const TradeStatusTypes = {
  '-1': '所有',
  '4': '完成',
  '5': '失败',
  'TypesArray': [
    {
      key: '-1',
      value: '所有'
    },
    {
      key: '4',
      value: '完成'
    },
    {
      key: '5',
      value: '失败'
    }
  ]
}

// 产品状态类型
export const ProductStautsTypes = {
  '-1': '所有',
  '1': '上架',
  '2': '下架',
  'TypesArray': [
    {
      key: '-1',
      value: '所有'
    },
    {
      key: '1',
      value: '上架'
    },
    {
      key: '2',
      value: '下架'
    }
  ]
}

// 订单状态类型
export const OrderStautsTypes = {
  '-1': '所有',
  '1': '进行中',
  '2': '已赎回',
  '3': '失败',
  '4': '提前赎回',
  'TypesArray': [
    {
      key: '-1',
      value: '所有'
    },
    {
      key: '1',
      value: '进行中'
    },
    {
      key: '2',
      value: '已赎回'
    },
    {
      key: '3',
      value: '失败'
    },
    {
      key: '4',
      value: '提前赎回'
    }
  ]
}

// 显示状态类型
export const VisibleTypes = {
  '0': '隐藏',
  '1': '显示',
  'TypesArray': [
    {
      key: '0',
      value: '隐藏'
    },
    {
      key: '1',
      value: '显示'
    }
  ]
}

// APP发布状态类型
export const ReleaseTypes = {
  '0': '待发布',
  '1': '已发布',
  'TypesArray': [
    {
      key: '0',
      value: '待发布'
    },
    {
      key: '1',
      value: '已发布'
    }
  ]
}

// APP热更新状态
export const HotUpdateTypes = {
  '0': '非热更新',
  '1': '热更新',
  'TypesArray': [
    {
      key: '0',
      value: '非热更新'
    },
    {
      key: '1',
      value: '热更新'
    }
  ]
}

// 发现状态类型
export const FoundStautsTypes = {
  '-1': '所有',
  '1': '开启',
  '2': '关闭',
  'TypesArray': [
    {
      key: '-1',
      value: '所有'
    },
    {
      key: '1',
      value: '开启'
    },
    {
      key: '2',
      value: '关闭'
    }
  ]
}

// 兑换状态类型
export const ExchangeTypes = {
  '1': '初始化',
  '2': '已转移',
  '3': '待兑换',
  '4': '兑换成功',
  '5': '兑换失败',
  '6': '待提币',
  'TypesArray': [
    {
      key: '1',
      value: '初始化'
    },
    {
      key: '2',
      value: '已转移'
    },
    {
      key: '3',
      value: '待兑换'
    },
    {
      key: '4',
      value: '兑换成功'
    },
    {
      key: '5',
      value: '兑换失败'
    },
    {
      key: '6',
      value: '待提币'
    }
  ]
}

// 兑换方式类型
export const DeductionTypes = {
  '1': '按扣除比例计算手续费',
  '2': '按固定值计算手续费',
  'TypesArray': [
    {
      key: '1',
      value: '按扣除比例计算手续费'
    },
    {
      key: '2',
      value: '按固定值计算手续费'
    }
  ]
}
