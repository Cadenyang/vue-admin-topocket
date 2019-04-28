<template>
  <div class="app-container">
    <!-- Tools -->
    <el-row :gutter="20" class="tools-wrapper">
      <el-col :lg="5" :xs="24">
        <el-input v-model="query.searchTxt" class="tools-item" placeholder="输入用户名或手机号查询" clearable @keyup.enter.native="search" />
      </el-col>
      <el-col :lg="5" :xs="24">
        <el-input v-model="query.orderNumber" class="tools-item" placeholder="输入订单号查询" clearable @keyup.enter.native="search" />
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
      <el-col :lg="6" :xs="24">
        <el-radio-group v-model="query.status" class="tools-item" @change="search">
          <el-radio-button v-for="(state, index) in orderStautsTypes.TypesArray" v-if="index < 3" :key="index" :label="state.key">{{ state.value }}</el-radio-button>
        </el-radio-group>
      </el-col>
      <el-col :lg="3" :xs="8">
        <el-button class="tools-item" type="primary" icon="el-icon-plus" @click="openOperateWindow()">创建</el-button>
      </el-col>
      <el-col :lg="3" :xs="8">
        <el-button class="tools-item" type="primary" icon="el-icon-search" @click="search">查询</el-button>
      </el-col>
    </el-row>

    <!-- Table -->
    <el-tabs v-model="coinType" type="border-card" @tab-click="getOrderList">
      <el-tab-pane v-for="(type, index) in coinTypes.TypesArray" v-if="type.key == -1 || type.key == 1 || type.key == 6" :key="index" :name="type.key" :label="type.value">
        <!-- 列表 -->
        <el-table v-loading="isloading" :data="dataList" stripe border>
          <el-table-column prop="order_number" label="订单号" align="center" />
          <el-table-column prop="productName" label="产品名" align="center" width="200" fixed="left" />
          <el-table-column prop="userName" label="用户" width="120" align="center" />
          <el-table-column label="手机号" align="center">
            <template slot-scope="scope">
              {{ scope.row.areaCode + '-' + scope.row.phone }}
            </template>
          </el-table-column>
          <el-table-column prop="buy_quantity" label="购买数" align="center" />
          <el-table-column prop="principal" label="本金" align="center" />
          <el-table-column prop="receiveAmount" label="利息" align="center" />
          <el-table-column prop="coinType" label="币种" align="center" />
          <el-table-column label="状态" align="center">
            <template slot-scope="scope">
              {{ orderStautsTypes[scope.row.status] }}
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
import { getOrderList } from '@/api/finance'
import { CoinTypes, OrderStautsTypes } from '@/utils/enums'

export default {
  name: 'Product',
  data() {
    return {
      query: {
        time: '',
        orderNumber: '',
        searchTxt: '',
        status: '-1'
      },
      dataList: [],
      isloading: false,
      total: 0,
      page: 1,
      pageSize: 10,
      coinType: '-1',
      coinTypes: CoinTypes,
      orderStautsTypes: OrderStautsTypes
    }
  },
  mounted() {
    this.getOrderList()
  },
  methods: {
    getOrderList() {
      this.isloading = true
      const params = {
        pageNum: this.page,
        pageSize: this.pageSize,
        startTime: this.query.time ? this.query.time[0] : '',
        endTime: this.query.time ? this.query.time[1] : '',
        search: this.query.searchTxt || '',
        orderNumber: this.query.getOrderList || '',
        status: this.query.status,
        coinType: this.coinType
      }
      getOrderList(params).then(res => {
        this.dataList = res.data.list || []
        this.total = res.data.total
        this.isloading = false
      }).catch(_ => {
        this.isloading = false
      })
    },
    pageChange(pg) {
      this.page = pg
      this.getOrderList()
    },
    sizeChange(size) {
      this.page = 1
      this.pageSize = size
      this.getOrderList()
    },
    search() {
      this.page = 1
      this.getOrderList()
    }
  }
}
</script>
