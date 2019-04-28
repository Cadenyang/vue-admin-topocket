<template>
  <div class="app-container">
    <!-- Tools -->
    <el-row :gutter="20" class="tools-wrapper">
      <el-col :lg="3" :xs="8">
        <el-button class="tools-item" type="primary" icon="el-icon-plus" @click="openOperateWindow()">添加配置</el-button>
      </el-col>
    </el-row>

    <!-- Table -->
    <el-table v-loading="isloading" :data="dataList" stripe border>
      <el-table-column prop="id" label="ID" align="center" />
      <el-table-column prop="value" label="值" align="center" />
      <el-table-column prop="tag" label="标的" align="center" />
      <el-table-column prop="remark" label="备注" align="center" />
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          {{ foundStautsTypes[scope.row.config_status] }}
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="创建时间" align="center" width="180" />
      <el-table-column prop="update_time" label="更新时间" align="center" width="180" />
      <el-table-column label="操作" align="center" fixed="right">
        <template slot-scope="scope">
          <el-tooltip content="修改" placement="top">
            <el-button type="text" @click="openOperateWindow(scope)"><i class="el-icon-edit" /></el-button>
          </el-tooltip>
          <el-tooltip content="删除" placement="top">
            <el-button type="text" @click="delBaseConfig(scope)"><i class="el-icon-delete" /></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <v-pagination v-if="total" :pg="page" :size="pageSize" :total="total" :views="5" @page-change="pageChange" @size-change="sizeChange" />

    <!-- 添加/修改 -->
    <el-dialog :visible.sync="configDialog" :close-on-click-modal="false" :title="dialogTitle" :before-close="beforeClose" width="600px">
      <!-- Form -->
      <el-form ref="configForm" :model="configForm" :rules="configRules" status-icon label-width="100px">
        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item prop="value" label="值:">
              <el-input v-model="configForm.value" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="tag" label="标的:">
              <el-input v-model="configForm.tag" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="remark" label="备注:">
              <el-input v-model="configForm.remark" type="textarea" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="status" label="状态:">
              <el-radio-group v-model="configForm.status">
                <el-radio v-for="(item, index) in foundStautsTypes.TypesArray" v-if="item.key > 0" :key="index" :label="item.key">{{ item.value }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item>
              <el-button @click="configDialog = false">取消</el-button>
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
import { getBasicList, addBaseConfig, editBaseConfig, delBaseConfig } from '@/api/configration'
import { FoundStautsTypes } from '@/utils/enums'

export default {
  name: 'Basic',
  data() {
    return {
      dataList: [],
      isloading: false,
      total: 0,
      page: 1,
      pageSize: 10,
      operateType: '', // type: {1:新建；2:修改; 3:删除}
      foundStautsTypes: FoundStautsTypes,
      dialogTitle: '',
      configDialog: false,
      configForm: {
        id: '', // 修改时使用
        value: '',
        tag: '',
        remark: '',
        status: '', // 是否可见
        code: '' //	google验证码
      },
      configRules: {
        tag: [{ required: true, message: '请输入标的', trigger: 'blur' }],
        value: [{ required: true, message: '请输入值', trigger: 'blur' }],
        remark: [{ required: true, message: '请输入备注内容', trigger: 'blur' }],
        status: [{ required: true, message: '请选择配置是否显示', trigger: 'change' }]
      },
      googleDialog: false,
      hackReset: true, // 用来强制刷新验证码输入组件
      googleCode: []
    }
  },
  mounted() {
    this.getBasicList()
  },
  methods: {
    getBasicList() {
      this.isloading = true
      getBasicList(this.page, this.pageSize).then(res => {
        this.dataList = res.data.list || []
        this.total = res.data.total
        this.isloading = false
      }).catch(_ => {
        this.isloading = false
      })
    },
    pageChange(pg) {
      this.page = pg
      this.getBasicList()
    },
    sizeChange(size) {
      this.page = 1
      this.pageSize = size
      this.getBasicList()
    },
    search() {
      this.page = 1
      this.getBasicList()
    },
    openOperateWindow(scope = null) {
      if (!scope) {
        this.operateType = 1
        this.dialogTitle = '创建配置'
        this.configDialog = true
        this.$nextTick(() => {
          this.configForm.id = ''
          this.$refs.configForm.resetFields()
        })
      } else {
        this.operateType = 2
        this.dialogTitle = '修改配置'
        this.configDialog = true
        this.$nextTick(() => {
          this.configForm.id = scope.row.id
          this.configForm.tag = scope.row.tag
          this.configForm.value = scope.row.value
          this.configForm.remark = scope.row.remark
          this.configForm.status = scope.row.config_status
        })
      }
    },
    beforeClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => { done() })
        .catch(_ => {})
    },
    validatorForm() {
      this.$refs.configForm.validate(valid => {
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
          tag: this.configForm.tag,
          value: this.configForm.value,
          remark: this.configForm.remark,
          status: this.configForm.status,
          code: this.googleCode.join('')
        }
        addBaseConfig(params).then(res => {
          this.$message({
            type: 'success',
            message: res.msg,
            duration: 1000,
            onClose: () => {
              this.googleDialog = false
              this.configDialog = false
              this.$loading().close()
              this.getBasicList()
            }
          })
        }).catch(_ => {
          this.googleDialog = false
          this.$loading().close()
        })
      } else if (this.operateType === 2) { // 修改
        const params = {
          id: this.configForm.id,
          tag: this.configForm.tag,
          value: this.configForm.value,
          remark: this.configForm.remark,
          status: this.configForm.status,
          code: this.googleCode.join('')
        }
        editBaseConfig(params).then(res => {
          this.$message({
            type: 'success',
            message: res.msg,
            duration: 1000,
            onClose: () => {
              this.googleDialog = false
              this.configDialog = false
              this.$loading().close()
              this.getBasicList()
            }
          })
        }).catch(_ => {
          this.googleDialog = false
          this.$loading().close()
        })
      } else { // 删除
        const id = this.configForm.id
        const code = this.googleCode.join('')
        delBaseConfig(id, code).then(res => {
          this.$message({
            type: 'success',
            message: res.msg,
            duration: 1000,
            onClose: () => {
              this.googleDialog = false
              this.configDialog = false
              this.$loading().close()
              this.getBasicList()
            }
          })
        }).catch(_ => {
          this.googleDialog = false
          this.$loading().close()
        })
      }
    },
    delBaseConfig(scope) {
      this.$confirm('是否删除该配置？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.dialogTitle = '删除配置'
        this.operateType = 3
        this.configForm.id = scope.row.id
        this.googleDialog = true
        this.hackReset = false
        this.googleCode = []
        this.$nextTick(() => {
          this.hackReset = true
          this.$nextTick(() => {
            this.$refs.inputCode.focusInput()
          })
        })
      }).catch(_ => {})
    }
  }
}
</script>
