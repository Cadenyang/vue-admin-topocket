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
          <el-radio-button v-for="(state, index) in withDrawStatusTypes.TypesArray" :key="index" :label="state.key">{{ state.value }}</el-radio-button>
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
    <el-tabs v-model="coinType" type="border-card" @tab-click="getWithdrawalList">
      <el-tab-pane v-for="(type, index) in coinTypes.TypesArray" :key="index" :name="type.key" :label="type.value">
        <!-- 列表 -->
        <el-table v-loading="isloading" :data="dataList" stripe border>
          <el-table-column prop="creatTime" label="创建时间" width="180" align="center" />
          <el-table-column prop="userName" label="用户名" align="center" />
          <el-table-column label="手机号" align="center">
            <template slot-scope="scope">
              {{ scope.row.areaCode + '-' + scope.row.phone }}
            </template>
          </el-table-column>
          <el-table-column prop="withdrawalCoinAddress" label="提币地址" align="center" />
          <el-table-column prop="withdrawalCoinNum" label="数量" align="center" />
          <el-table-column prop="withdrawalCoinType" label="币种" align="center" />
          <el-table-column label="状态" align="center">
            <template slot-scope="scope">
              {{ withDrawStatusTypes[scope.row.withdrawalCoinState] }}
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
import { getWithdrawalList, remark } from '@/api/wallet'
import { CoinTypes, WithDrawStatusTypes } from '@/utils/enums'

const modelName = 'WithdrawalList'

export default {
  name: 'WithdrawList',
  data() {
    return {
      userId: '',
      query: {
        searchTxt: '',
        time: '',
        status: -1
      },
      coinType: '-1',
      coinTypes: CoinTypes,
      withDrawStatusTypes: WithDrawStatusTypes,
      dataList: [],
      remarkDialog: false,
      remarkForm: {
        id: '',
        oldVal: '',
        newVal: ''
      },
      isloading: false,
      page: 1,
      pageSize: 10,
      total: 0
    }
  },
  mounted() {
    this.getWithdrawalList()
  },
  methods: {
    getWithdrawalList() {
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
      getWithdrawalList(params).then(res => {
        this.dataList = res.data.list || []
        this.total = res.data.total
        this.isloading = false
      }).catch(_ => {
        this.isloading = false
      })
    },
    pageChange(pg) {
      this.page = pg
      this.getWithdrawalList()
    },
    sizeChange(size) {
      this.page = 1
      this.pageSize = size
      this.getWithdrawalList()
    },
    search() {
      this.page = 1
      this.getWithdrawalList()
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
          this.getWithdrawalList()
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
