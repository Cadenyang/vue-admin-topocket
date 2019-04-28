<template>
  <div class="app-container">
    <!-- Tools -->
    <el-row :gutter="20" class="tools-wrapper">
      <el-col :lg="3" :xs="8">
        <el-button class="tools-item" type="primary" icon="el-icon-plus" @click="openOperateWindow()">创建版本</el-button>
      </el-col>
    </el-row>

    <!-- Table -->
    <el-table v-loading="isloading" :data="dataList" stripe border>
      <el-table-column prop="ver_ctime" label="创建时间" align="center" width="180" />
      <el-table-column prop="ver_name" label="名称" align="center" width="120" />
      <el-table-column label="强制更新" align="center">
        <template slot-scope="scope">
          {{ hotUpdateTypes[scope.row.ver_force] }}
        </template>
      </el-table-column>
      <el-table-column prop="ver_platform" label="app平台" align="center" />
      <el-table-column prop="ver_number" label="版本号" align="center" />
      <el-table-column prop="ver_update_url" label="下载地址" align="center" width="150" />
      <el-table-column prop="ver_hot_url" label="热更新地址" align="center" width="200" />
      <el-table-column prop="ver_info" label="更新描述" align="center" width="200" />
      <el-table-column label="操作" align="center" width="60" fixed="right">
        <template slot-scope="scope">
          <el-tooltip content="修改" placement="top">
            <el-button type="text" @click="openOperateWindow(scope)"><i class="el-icon-edit" /></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <v-pagination v-if="total" :pg="page" :size="pageSize" :total="total" :views="5" @page-change="pageChange" @size-change="sizeChange" />

    <!-- 创建/修改版本 -->
    <el-dialog :visible.sync="versionDialog" :close-on-click-modal="false" :title="dialogTitle" :before-close="beforeClose" width="600px">
      <!-- Form -->
      <el-form ref="versionForm" :model="versionForm" :rules="versionRules" status-icon label-width="100px">
        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item prop="name" label="app名称:">
              <el-input v-model="versionForm.name" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="number" label="版本号:">
              <el-input v-model="versionForm.number" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="platform" label="平台:">
              <el-radio-group v-model="versionForm.platform">
                <el-radio label="ios">ios</el-radio>
                <el-radio label="android">android</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="updateUrl" label="下载地址:">
              <el-input v-model="versionForm.updateUrl" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="hotUrl" label="热更新地址:">
              <el-input v-model="versionForm.hotUrl" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="info" label="更新描述:">
              <el-input v-model="versionForm.info" type="textarea" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="force" label="强制更新:">
              <el-radio-group v-model="versionForm.force">
                <el-radio v-for="(item, index) in hotUpdateTypes.TypesArray" :key="index" :label="item.key">
                  {{ item.key == 0 ? '停用' : '启用' }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="status" label="发布状态:">
              <el-radio-group v-model="versionForm.status">
                <el-radio v-for="(item, index) in releaseTypes.TypesArray" :key="index" :label="item.key">
                  {{ item.value }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item>
              <el-button @click="versionDialog = false">取消</el-button>
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
import { getVersionList, addVersion, editVersion } from '@/api/information'
import { ReleaseTypes, HotUpdateTypes } from '@/utils/enums'

export default {
  name: 'Application',
  data() {
    return {
      dataList: [],
      isloading: false,
      total: 0,
      page: 1,
      pageSize: 10,
      operateType: '', // type: {1:新建；2:修改; 3:删除}
      releaseTypes: ReleaseTypes,
      hotUpdateTypes: HotUpdateTypes,
      dialogTitle: '',
      versionDialog: false,
      versionForm: {
        id: '',
        name: '',
        number: '',
        platform: '',
        updateUrl: '',
        hotUrl: '',
        info: '',
        force: '',
        status: '',
        code: ''
      },
      versionRules: {
        name: [{ required: true, message: '请输入版本标题', trigger: 'blur' }],
        number: [{ required: true, message: '请输入版本号', trigger: 'blur' }],
        platform: [{ required: true, message: '请选择发布平台', trigger: 'change' }],
        updateUrl: [{ required: true, message: '请输入下载地址', trigger: 'blur' }],
        hotUrl: [{ required: true, message: '请输入热更新地址', trigger: 'blur' }],
        info: [{ required: true, message: '请填写更新内容', trigger: 'blur' }],
        force: [{ required: true, message: '请选择是否强制更新', trigger: 'change' }],
        status: [{ required: true, message: '请选择版本发布状态', trigger: 'change' }]
      },
      googleDialog: false,
      hackReset: true, // 用来强制刷新验证码输入组件
      googleCode: []
    }
  },
  mounted() {
    this.getVersionList()
  },
  methods: {
    getVersionList() {
      this.isloading = true
      getVersionList(this.page, this.pageSize).then(res => {
        this.dataList = res.data.list || []
        this.total = res.data.total
        this.isloading = false
      }).catch(_ => {
        this.isloading = false
      })
    },
    pageChange(pg) {
      this.page = pg
      this.getVersionList()
    },
    sizeChange(size) {
      this.page = 1
      this.pageSize = size
      this.getVersionList()
    },
    search() {
      this.page = 1
      this.getVersionList()
    },
    openOperateWindow(scope = null) {
      if (!scope) {
        this.operateType = 1
        this.dialogTitle = '创建版本'
        this.versionDialog = true
        this.$nextTick(() => {
          this.versionForm.id = ''
          this.$refs.versionForm.resetFields()
        })
      } else {
        this.operateType = 2
        this.dialogTitle = '修改版本'
        this.versionDialog = true
        this.$nextTick(() => {
          this.versionForm.id = scope.row.ver_id
          this.versionForm.name = scope.row.ver_name
          this.versionForm.number = scope.row.ver_number
          this.versionForm.platform = scope.row.ver_platform
          this.versionForm.updateUrl = scope.row.ver_update_url
          this.versionForm.hotUrl = scope.row.ver_hot_url
          this.versionForm.info = scope.row.ver_info
          this.versionForm.force = scope.row.ver_force
          this.versionForm.status = scope.row.ver_status
        })
      }
    },
    beforeClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => { done() })
        .catch(_ => {})
    },
    validatorForm() {
      this.$refs.versionForm.validate(valid => {
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
          name: this.versionForm.name,
          number: this.versionForm.number,
          platform: this.versionForm.platform,
          updateUrl: this.versionForm.updateUrl,
          hotUrl: this.versionForm.hotUrl,
          info: this.versionForm.info,
          force: this.versionForm.force,
          status: this.versionForm.status,
          code: this.googleCode.join('')
        }
        addVersion(params).then(res => {
          this.$message({
            type: 'success',
            message: res.msg,
            duration: 1000,
            onClose: () => {
              this.googleDialog = false
              this.versionDialog = false
              this.$loading().close()
              this.getVersionList()
            }
          })
        }).catch(_ => {
          this.googleDialog = false
          this.$loading().close()
        })
      } else if (this.operateType === 2) { // 修改
        const params = {
          id: this.versionForm.id,
          name: this.versionForm.name,
          number: this.versionForm.number,
          platform: this.versionForm.platform,
          updateUrl: this.versionForm.updateUrl,
          hotUrl: this.versionForm.hotUrl,
          info: this.versionForm.info,
          force: this.versionForm.force,
          status: this.versionForm.status,
          code: this.googleCode.join('')
        }
        editVersion(params).then(res => {
          this.$message({
            type: 'success',
            message: res.msg,
            duration: 1000,
            onClose: () => {
              this.googleDialog = false
              this.versionDialog = false
              this.$loading().close()
              this.getVersionList()
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
