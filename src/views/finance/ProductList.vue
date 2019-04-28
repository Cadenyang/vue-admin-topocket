<template>
  <div class="app-container">
    <!-- Tools -->
    <el-row :gutter="20" class="tools-wrapper">
      <el-col :lg="6" :xs="24">
        <el-input v-model="query.searchTxt" class="tools-item" placeholder="输入产品名查询" clearable @keyup.enter.native="search" />
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
          <el-radio-button v-for="(state, index) in productStautsTypes.TypesArray" :key="index" :label="state.key">{{ state.value }}</el-radio-button>
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
    <el-tabs v-model="coinType" type="border-card" @tab-click="getProductList">
      <el-tab-pane v-for="(type, index) in coinTypes.TypesArray" v-if="type.key == -1 || type.key == 1 || type.key == 6" :key="index" :name="type.key" :label="type.value">
        <!-- 列表 -->
        <el-table v-loading="isloading" :data="dataList" stripe border>
          <el-table-column prop="name" label="产品名" align="center" width="200" fixed="left" />
          <el-table-column prop="total_amount" label="规模" align="center" />
          <el-table-column label="剩余规模" align="center">
            <template slot-scope="scope">
              {{ scope.row.total_amount - scope.row.already_buy }}
            </template>
          </el-table-column>
          <el-table-column prop="min_amount" label="每份" align="center" />
          <el-table-column prop="already_buy" label="购买数" align="center" />
          <el-table-column prop="rate" label="利率" align="center" />
          <el-table-column prop="coinType" label="币种" align="center" />
          <el-table-column prop="advance_redeem_day" label="扣减时间" align="center" />
          <el-table-column label="状态" align="center">
            <template slot-scope="scope">
              {{ productStautsTypes[scope.row.status] }}
            </template>
          </el-table-column>
          <el-table-column prop="operatorName" label="创建/修改用户" width="120" align="center" />
          <el-table-column prop="create_time" label="创建时间" width="180" align="center" />
          <el-table-column label="操作" align="center" width="60" fixed="right">
            <template slot-scope="scope">
              <el-tooltip content="编辑" placement="right">
                <el-button type="text" @click="openOperateWindow(scope)"><i class="el-icon-edit" /></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <v-pagination v-if="total" :pg="page" :size="pageSize" :total="total" :views="5" @page-change="pageChange" @size-change="sizeChange" />
      </el-tab-pane>
    </el-tabs>

    <!-- 创建/修改产品 -->
    <el-dialog :visible.sync="productDialog" :close-on-click-modal="false" :title="dialogTitle" :before-close="beforeClose" width="600px">
      <!-- Form -->
      <el-form ref="productForm" :model="productForm" :rules="productRules" status-icon label-width="100px">
        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item prop="name" label="产品名称:">
              <el-input v-model="productForm.name" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="totalAmount" label="规模:">
              <el-input v-model="productForm.totalAmount" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="minAmount" label="数量/每份:">
              <el-input v-model="productForm.minAmount" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="buyQuantity" label="购买份数:">
              <el-input v-model="productForm.buyQuantity" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="coinType" label="币种:">
              <el-select v-model="productForm.coinType" placeholder="请选择" clearable>
                <el-option
                  v-for="(item, index) in coinTypes.TypesArray"
                  v-if="item.key == 1 || item.key == 6"
                  :key="index"
                  :label="item.value"
                  :value="item.key" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="rate" label="利率:">
              <el-input v-model="productForm.rate">
                <template slot="append">%</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="status" label="状态:">
              <el-radio-group v-model="productForm.status">
                <el-radio
                  v-for="(state, index) in productStautsTypes.TypesArray"
                  v-if="state.key != -1"
                  :key="index"
                  :label="state.key">
                  {{ state.value }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item>
              <el-button @click="productDialog = false">取消</el-button>
              <el-button type="primary" @click="validatorForm">提交</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>

    <!-- Google Code -->
    <el-dialog :visible.sync="googleDialog" :append-to-body="true" :show-close="false" title="请输入Google验证码" center width="300px">
      <v-input-code
        v-if="hackReset"
        ref="inputCode"
        :code="googleCode"
        :success="confirmOperate"
        type="number"
        input-size="16px"
        span-size="16px"
        span-color="#409EFF"/>
      <p class="google-code-tip">{{ '正在' + dialogTitle + '...' }}</p>
    </el-dialog>
  </div>
</template>

<script>
import { getProductList, addProduct, editProduct } from '@/api/finance'
import { CoinTypes, ProductStautsTypes } from '@/utils/enums'
import { isNumber } from '@/utils/validate'

export default {
  name: 'Product',
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
      operateType: '', // type: {1:新建；2:修改}
      coinTypes: CoinTypes,
      productStautsTypes: ProductStautsTypes,
      dialogTitle: '',
      productDialog: false,
      productForm: {
        id: '', // 修改时使用
        name: '',
        totalAmount: '', // 规模
        minAmount: '', // 每份数量
        buyQuantity: '', //	购买份数
        coinType: '',
        rate: '',
        status: '1', // 上架状态
        code: '' //	google验证码
      },
      productRules: {
        name: [{ required: true, message: '请输入产品名称', trigger: 'blur' }],
        totalAmount: [
          { required: true, message: '请输入规模', trigger: 'blur' },
          { validator: isNumber, trigger: 'change' }
        ],
        minAmount: [
          { required: true, message: '请输入每份数量', trigger: 'blur' },
          { validator: isNumber, trigger: 'change' }
        ],
        buyQuantity: [
          { required: true, message: '请输入购买份数', trigger: 'blur' },
          { validator: isNumber, trigger: 'change' }
        ],
        coinType: [{ required: true, message: '请选择币种', trigger: 'change' }],
        rate: [
          { required: true, message: '请输入利率', trigger: 'blur' },
          { validator: isNumber, trigger: 'change' }
        ],
        status: [{ required: true, message: '请选择产品状态', trigger: 'change' }]
      },
      googleDialog: false,
      hackReset: true, // 用来强制刷新验证码输入组件
      googleCode: []
    }
  },
  mounted() {
    this.getProductList()
  },
  methods: {
    getProductList() {
      this.isloading = true
      const params = {
        pageNum: this.page,
        pageSize: this.pageSize,
        startTime: this.query.time ? this.query.time[0] : '',
        endTime: this.query.time ? this.query.time[1] : '',
        name: this.query.searchTxt || '',
        status: this.query.status,
        coinType: this.coinType
      }
      getProductList(params).then(res => {
        this.dataList = res.data.list || []
        this.total = res.data.total
        this.isloading = false
      }).catch(_ => {
        this.isloading = false
      })
    },
    pageChange(pg) {
      this.page = pg
      this.getProductList()
    },
    sizeChange(size) {
      this.page = 1
      this.pageSize = size
      this.getProductList()
    },
    search() {
      this.page = 1
      this.getProductList()
    },
    openOperateWindow(scope = null) {
      if (!scope) {
        this.operateType = 1
        this.dialogTitle = '创建理财产品'
        this.productDialog = true
        this.$nextTick(() => {
          this.productForm.id = ''
          this.$refs.productForm.resetFields()
        })
      } else {
        this.operateType = 2
        this.dialogTitle = '修改理财产品'
        this.productDialog = true
        this.$nextTick(() => {
          this.productForm.id = scope.row.id
          this.productForm.name = scope.row.name
          this.productForm.totalAmount = scope.row.total_amount
          this.productForm.minAmount = scope.row.min_amount
          this.productForm.buyQuantity = scope.row.buy_quantity
          this.productForm.coinType = scope.row.coin_type
          this.productForm.rate = scope.row.rate
          this.productForm.status = scope.row.status
        })
      }
    },
    beforeClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => { done() })
        .catch(_ => {})
    },
    validatorForm() {
      this.$refs.productForm.validate(valid => {
        if (!valid) {
          return false
        } else {
          this.googleDialog = true
          this.hackReset = false
          this.googleCode = []
          this.$nextTick(() => {
            this.hackReset = true
            this.$nextTick(() => {
              this.$refs.inputCode.focusInput()
            })
          })
        }
      })
    },
    confirmOperate() {
      this.$loading()
      if (this.operateType === 1) { // 新增
        const params = {
          name: this.productForm.name,
          totalAmount: this.productForm.totalAmount,
          minAmount: this.productForm.minAmount,
          buyQuantity: this.productForm.buyQuantity,
          coinType: this.productForm.coinType,
          rate: this.productForm.rate,
          status: this.productForm.status,
          code: this.googleCode.join('')
        }
        addProduct(params).then(res => {
          this.$message({
            type: 'success',
            message: res.msg,
            duration: 1000,
            onClose: () => {
              this.googleDialog = false
              this.productDialog = false
              this.$loading().close()
              this.getProductList()
            }
          })
        }).catch(_ => {
          this.googleDialog = false
          this.$loading().close()
        })
      } else { // 修改
        const params = {
          id: this.productForm.id,
          name: this.productForm.name,
          totalAmount: this.productForm.totalAmount,
          minAmount: this.productForm.minAmount,
          buyQuantity: this.productForm.buyQuantity,
          coinType: this.productForm.coinType,
          rate: this.productForm.rate,
          status: this.productForm.status,
          code: this.googleCode.join('')
        }
        editProduct(params).then(res => {
          this.$message({
            type: 'success',
            message: res.msg,
            duration: 1000,
            onClose: () => {
              this.googleDialog = false
              this.productDialog = false
              this.$loading().close()
              this.getProductList()
            }
          })
        }).catch(_ => {
          this.googleDialog = false
          this.$loading().close()
        })
      }
    }
  }
}
</script>

<style lang="scss">
.vue_input_code .input > span {
  border-color: #cccccc!important;
}
.google-code-tip {
  margin: 14px 0 0;
  text-align: center;
  color: #333;
}
</style>
