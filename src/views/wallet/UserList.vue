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
    <el-table v-loading="isloading" :data="dataList" stripe border>
      <el-table-column prop="registerTime" label="注册时间" align="center" />
      <el-table-column prop="userName" label="用户名" align="center" />
      <el-table-column prop="phone" label="手机号" align="center" />
      <el-table-column prop="country" label="国家" width="100" align="center" />
      <el-table-column label="资产" width="60" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="openBalance(scope)">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center">
        <template slot-scope="scope">
          <el-button slot="remark" type="text" @click="openRemark(scope)">{{ scope.row.remark || '添加备注' }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <v-pagination v-if="total" :pg="page" :size="pageSize" :total="total" :views="5" @page-change="pageChange" @size-change="sizeChange" />

    <!-- Remark -->
    <el-dialog :visible.sync="remarkDialog" :close-on-click-modal="false" title="添加/修改备注" width="300px">
      <el-input v-model="remarkForm.newVal" :rows="5" type="textarea" placeholder="请输入内容" />
      <div slot="footer">
        <el-button :loading="isloading" @click="cancel">取 消</el-button>
        <el-button :loading="isloading" type="primary" @click="editRemark">确 定</el-button>
      </div>
    </el-dialog>

    <!-- Balance -->
    <el-dialog :visible.sync="balanceDialog" title="用户资产" width="80%">
      <el-tabs v-model="coinType" type="border-card" @tab-click="checkBalance">
        <el-tab-pane v-for="(type, index) in coinTypes.TypesArray" v-if="index > 0" :key="index" :name="type.value" :label="type.value">
          <!-- 概览 -->
          <el-row :gutter="20" class="balance-info">
            <el-col :lg="12" :sm="24">
              <div class="item">收款地址：{{ balance.depositCoinAddress }}</div>
            </el-col>
            <el-col :lg="6" :sm="12">
              <div class="item">冻结：{{ balance.freezeAssets }}</div>
            </el-col>
            <el-col :lg="6" :sm="12">
              <div class="item">总额：{{ balance.assets }}</div>
            </el-col>
          </el-row>
          <!-- 列表 -->
          <el-table v-loading="isloading" :data="balanceList" border>
            <el-table-column prop="creatTime" label="创建时间" align="center" />
            <el-table-column label="类型" align="center" >
              <template slot-scope="scope">
                {{ accountStatementTypes[scope.row.operationType] }}
              </template>
            </el-table-column>
            <el-table-column prop="waterMoney" label="数量" align="center" />
            <el-table-column prop="assets" label="可用" align="center" />
            <el-table-column prop="freezeAssets" label="冻结" align="center" />
          </el-table>
          <!-- 分页 -->
          <v-pagination v-if="subTotal" :pg="subPage" :size="subPageSize" :total="subTotal" :views="5" @page-change="balPageChange" @size-change="balSizeChange" />
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
import { getUserList, getUserBalance, remark } from '@/api/wallet'
import { CoinTypes, AccountStatementTypes } from '@/utils/enums'

const modelName = 'userList'

export default {
  name: 'UserList',
  data() {
    return {
      query: {
        searchTxt: '',
        time: ''
      },
      dataList: [],
      userId: '', // 操作列表使用的userId
      remarkDialog: false,
      remarkForm: {
        id: '',
        oldVal: '',
        newVal: ''
      },
      balanceDialog: false,
      balance: {}, // 资产
      balanceList: [],
      coinType: 'BTC',
      subPage: 1,
      subPageSize: 10,
      subTotal: 0,
      isloading: false,
      total: 0,
      page: 1,
      pageSize: 10,
      coinTypes: CoinTypes,
      accountStatementTypes: AccountStatementTypes
    }
  },
  mounted() {
    this.getUserList()
  },
  methods: {
    getUserList() {
      this.isloading = true
      const params = {
        pageNum: this.page,
        pageSize: this.pageSize,
        startTime: this.query.time ? this.query.time[0] : '',
        endTime: this.query.time ? this.query.time[1] : '',
        search: this.query.searchTxt || ''
      }
      getUserList(params).then(res => {
        this.total = res.data.total
        this.dataList = res.data.list
        this.isloading = false
      }).catch(_ => {
        this.isloading = false
      })
    },
    pageChange(pg) {
      this.page = pg
      this.getUserList()
    },
    sizeChange(size) {
      this.page = 1
      this.pageSize = size
      this.getUserList()
    },
    search() {
      this.page = 1
      this.getUserList()
    },
    // 备注
    openRemark(scope) {
      this.remarkDialog = true
      this.userId = scope.row.id
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
        remark(modelName, this.userId, this.remarkForm.newVal).then(res => {
          this.getUserList()
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
    },
    // 查看资产
    openBalance(scope) {
      this.coinType = 'BTC'
      this.userId = scope.row.id
      this.balanceDialog = true
      this.checkBalance()
    },
    checkBalance() {
      if (this.isloading) {
        return false
      } else {
        this.isloading = true
        getUserBalance(this.userId, this.coinType, this.subPage, this.subPageSize).then(res => {
          this.isloading = false
          this.balance = res.data
          this.balanceList = res.data.balDetail.list
          this.subTotal = res.data.balDetail.total
        }).catch(err => {
          this.isloading = false
          console.error(err)
        })
      }
    },
    balPageChange(pg) {
      this.subPage = pg
      this.checkBalance()
    },
    balSizeChange(size) {
      this.subPage = 1
      this.subPageSize = size
      this.checkBalance()
    }
  }
}
</script>

<style lang="scss" scoped>
.balance-info {
  margin-top: 22px;
  .item {
    margin-bottom: 22px;
  }
}
</style>
