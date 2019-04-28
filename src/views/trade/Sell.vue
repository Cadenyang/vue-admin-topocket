<template>
  <div class="app-container">
    <!-- Tools -->
    <el-row :gutter="20" class="tools-wrapper">
      <el-col :lg="6" :xs="24">
        <el-input v-model="query.searchTxt" class="tools-item" placeholder="输入手机号或者用户名查询" clearable @keyup.enter.native="search" />
      </el-col>
      <el-col :lg="8" :xs="24">
        <el-date-picker
          v-model="query.time"
          class="tools-item"
          type="daterange"
          range-separator="~"
          start-placeholder="开始日期"
          end-placeholder="结束日期" />
      </el-col>
      <el-col :lg="10" :xs="24">
        <el-radio-group v-model="query.status" class="tools-item" @change="search">
          <el-radio-button v-for="(state, index) in tradeStatusTypes.TypesArray" :key="index" :label="state.key">{{ state.value }}</el-radio-button>
        </el-radio-group>
      </el-col>
      <el-col :lg="3" :xs="8">
        <el-button class="tools-item" type="primary" icon="el-icon-search" @click="search">查询</el-button>
      </el-col>
      <el-col :lg="3" :xs="8">
        <el-button class="tools-item" type="primary" icon="el-icon-printer">导出</el-button>
      </el-col>
    </el-row>

    <!-- Table -->
    <el-tabs v-model="coinType" type="border-card" @tab-click="getSellExchange">
      <el-tab-pane v-for="(type, index) in coinTypes.TypesArray" :key="index" :name="type.key" :label="type.value">
        <!-- 列表 -->
        <el-table v-loading="isloading" :data="dataList" stripe border>
          <el-table-column prop="orderTime" label="创建时间" width="180" align="center" />
          <el-table-column prop="userName" label="用户名" align="center" />
          <el-table-column label="手机号" align="center">
            <template slot-scope="scope">
              {{ scope.row.areaCode + '-' + scope.row.phone }}
            </template>
          </el-table-column>
          <el-table-column prop="orderCoin" label="兑换币种" align="center" />
          <el-table-column prop="orderPayCoin" label="支付币种" align="center" />
          <el-table-column prop="orderId" label="订单号" align="center" />
          <el-table-column prop="orderAmount" label="数量" align="center" />
          <el-table-column prop="orderUnitPrice" label="单价" align="center" />
          <el-table-column prop="orderSumPrice" label="总价" align="center" />
          <el-table-column label="状态" align="center">
            <template slot-scope="scope">
              {{ tradeStatusTypes[scope.row.orderStatus] }}
            </template>
          </el-table-column>
          <el-table-column label="备注" align="center">
            <template slot-scope="scope">
              <el-button slot="remark" type="text" @click="openRemark(scope)">{{ scope.row.remark || '添加备注' }}</el-button>
            </template>
          </el-table-column>
        </el-table>
        <v-pagination v-if="total" :pg="page" :size="pageSize" :total="total" :views="5" @page-change="pageChange" @size-change="sizeChange" />
      </el-tab-pane>
    </el-tabs>

    <!-- Remark -->
    <el-dialog :visible.sync="remarkDialog" :close-on-click-modal="false" title="添加/修改备注" width="300px">
      <el-input v-model="remarkForm.newVal" :rows="5" type="textarea" placeholder="请输入内容" />
      <div slot="footer">
        <el-button :loading="isloading" @click="cancel">取 消</el-button>
        <el-button :loading="isloading" type="primary" @click="editRemark">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getSellExchange, remark } from '@/api/trade'
import { CoinTypes, TradeStatusTypes } from '@/utils/enums'

const modelName = 'SellTransaction'

export default {
  name: 'Sell',
  data() {
    return {
      query: {
        time: '',
        searchTxt: '',
        status: '-1'
      },
      dataList: [],
      isloading: false,
      total: 0,
      page: 1,
      pageSize: 10,
      coinType: '-1',
      currentId: '',
      remarkDialog: false,
      remarkForm: {
        id: '',
        oldVal: '',
        newVal: ''
      },
      coinTypes: CoinTypes,
      tradeStatusTypes: TradeStatusTypes
    }
  },
  mounted() {
    this.getSellExchange()
  },
  methods: {
    getSellExchange() {
      this.isloading = true
      const params = {
        pageNum: this.page,
        pageSize: this.pageSize,
        startTime: this.query.time ? this.query.time[0] : '',
        endTime: this.query.time ? this.query.time[1] : '',
        search: this.query.searchTxt || '',
        status: this.query.status,
        coinType: this.coinType
      }
      getSellExchange(params).then(res => {
        this.dataList = res.data.list || []
        this.total = res.data.total
        this.isloading = false
      }).catch(_ => {
        this.isloading = false
      })
    },
    pageChange(pg) {
      this.page = pg
      this.getSellExchange()
    },
    sizeChange(size) {
      this.page = 1
      this.pageSize = size
      this.getSellExchange()
    },
    search() {
      this.page = 1
      this.getSellExchange()
    },
    // 备注
    openRemark(scope) {
      this.remarkDialog = true
      this.currentId = scope.row.orderId
      this.remarkForm.oldVal = this.remarkForm.newVal = scope.row.remark || ''
    },
    editRemark() {
      if (this.remarkForm.oldVal === this.remarkForm.newVal) { // 如果没有修改内容
        this.cancel()
      } else if (this.remarkForm.oldVal && !this.remarkForm.newVal) { // 如果删除了旧内容提示是否继续或还原
        this.$confirm('该操作会删除先有备注，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '还原',
          type: 'warning'
        }).then(() => {
          this.setRemark()
        }).catch(_ => {
          this.remarkForm.newVal = this.remarkForm.oldVal
        })
      } else {
        this.setRemark()
      }
    },
    setRemark() {
      if (this.isloading) {
        return false
      } else {
        this.isloading = true
        remark(modelName, this.currentId, this.remarkForm.newVal).then(res => {
          this.getSellExchange()
          this.isloading = false
        }).catch(_ => {
          this.isloading = false
        })
        this.remarkDialog = false
      }
    },
    cancel() {
      this.$confirm('您未修改任何内容，确认离开吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.remarkDialog = false
      }).catch(_ => {
        this.$message.info('已取消')
      })
    }
  }
}
</script>
