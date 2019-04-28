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
      <el-col :lg="3" :xs="8">
        <el-button class="tools-item" type="primary" icon="el-icon-search" @click="search">查询</el-button>
      </el-col>
      <el-col :lg="3" :xs="8">
        <el-button class="tools-item" type="primary" icon="el-icon-printer">导出</el-button>
      </el-col>
    </el-row>

    <!-- Table -->
    <el-tabs v-model="coinType" type="border-card" @tab-click="getRecordExchange">
      <el-tab-pane v-for="(type, index) in coinTypes.TypesArray" :key="index" :name="type.key" :label="type.value">
        <!-- 列表 -->
        <el-table v-loading="isloading" :data="dataList" stripe border>
          <el-table-column prop="exchange_record_id" label="ID" width="60" align="center" fixed="left" />
          <el-table-column label="用户" align="center" width="180" fixed="left">
            <template slot-scope="scope">
              {{ scope.row.user_name }}
            </template>
          </el-table-column>
          <el-table-column prop="assets" label="数量" width="100" align="center" />
          <el-table-column prop="account_type" label="类型" width="80" align="center" />
          <el-table-column label="兑换率" width="80" align="center">
            <template slot-scope="scope">
              {{ '1:' + scope.row.exchange_rate }}
            </template>
          </el-table-column>
          <el-table-column prop="exchange_coin_amount" label="兑换数量" width="120" align="center" />
          <el-table-column prop="exchange_coin_type" label="兑换类型" width="80" align="center" />
          <el-table-column label="手续费方式" width="200" align="center">
            <template slot-scope="scope">
              {{ deductionTypes[scope.row.deduction_type] }}
            </template>
          </el-table-column>
          <el-table-column prop="deduction_rate" label="手续费率" width="80" align="center" />
          <el-table-column prop="fixed_value" label="手续费固定值" width="120" align="center" />
          <el-table-column prop="cost" label="手续费" width="120" align="center" />
          <el-table-column label="状态" width="120" align="center">
            <template slot-scope="scope">
              {{ exchangeTypes[scope.row.status] }}
            </template>
          </el-table-column>
          <el-table-column prop="create_time" label="创建时间" width="180" align="center" />
        </el-table>
        <v-pagination v-if="total" :pg="page" :size="pageSize" :total="total" :views="5" @page-change="pageChange" @size-change="sizeChange" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { getRecordExchange } from '@/api/trade'
import { CoinTypes, DeductionTypes, ExchangeTypes } from '@/utils/enums'

export default {
  name: 'Buy',
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
      exchangeTypes: ExchangeTypes,
      deductionTypes: DeductionTypes
    }
  },
  mounted() {
    this.getRecordExchange()
  },
  methods: {
    getRecordExchange() {
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
      getRecordExchange(params).then(res => {
        this.dataList = res.data.list || []
        this.total = res.data.total
        this.isloading = false
      }).catch(_ => {
        this.isloading = false
      })
    },
    pageChange(pg) {
      this.page = pg
      this.getRecordExchange()
    },
    sizeChange(size) {
      this.page = 1
      this.pageSize = size
      this.getRecordExchange()
    },
    search() {
      this.page = 1
      this.getRecordExchange()
    }
  }
}
</script>
