<template>
  <div class="app-container">
    <!-- Tools -->
    <el-row :gutter="20" class="tools-wrapper">
      <el-col :lg="3" :xs="8">
        <el-button class="tools-item" type="primary" icon="el-icon-plus" @click="openOperateWindow()">创建公告</el-button>
      </el-col>
    </el-row>

    <!-- Table -->
    <el-table v-loading="isloading" :data="dataList" stripe border>
      <el-table-column prop="create_time" label="创建时间" align="center" />
      <el-table-column prop="title" label="标题" align="center" />
      <el-table-column prop="client" label="平台" align="center" />
      <el-table-column prop="language" label="语言" align="center" />
      <el-table-column prop="status" label="显示" align="center">
        <template slot-scope="scope">
          {{ visibleTypes[scope.row.status] }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right">
        <template slot-scope="scope">
          <el-tooltip content="修改" placement="top">
            <el-button type="text" @click="openOperateWindow(scope)"><i class="el-icon-edit" /></el-button>
          </el-tooltip>
          <el-tooltip content="删除" placement="top">
            <el-button type="text" @click="delNotice(scope)"><i class="el-icon-delete" /></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <v-pagination v-if="total" :pg="page" :size="pageSize" :total="total" :views="5" @page-change="pageChange" @size-change="sizeChange" />

    <!-- 创建/修改公告 -->
    <el-dialog :visible.sync="noticeDialog" :close-on-click-modal="false" :title="dialogTitle" :before-close="beforeClose" width="600px">
      <!-- Form -->
      <el-form ref="noticeForm" :model="noticeForm" :rules="noticeRules" status-icon label-width="100px">
        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item prop="title" label="标题:">
              <el-input v-model="noticeForm.title" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="client" label="平台:">
              <el-checkbox-group v-model="noticeForm.client">
                <el-checkbox label="ios" />
                <el-checkbox label="android" />
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="language" label="语言:">
              <el-checkbox-group v-model="noticeForm.language">
                <el-checkbox label="en-US">英文</el-checkbox>
                <el-checkbox label="zh-CN">中文</el-checkbox>
                <el-checkbox label="zh-HK">繁体</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="content" label="内容:">
              <el-input v-model="noticeForm.content" type="textarea" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="status" label="是否可见:">
              <el-radio-group v-model="noticeForm.status">
                <el-radio v-for="(item, index) in visibleTypes.TypesArray" :key="index" :label="item.key">{{ item.value }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item>
              <el-button @click="noticeDialog = false">取消</el-button>
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
import { getAnnouncementList, addNotice, editNotice, delNotice } from '@/api/information'
import { VisibleTypes } from '@/utils/enums'

export default {
  name: 'Announcement',
  data() {
    return {
      dataList: [],
      isloading: false,
      total: 0,
      page: 1,
      pageSize: 10,
      operateType: '', // type: {1:新建；2:修改; 3:删除}
      visibleTypes: VisibleTypes,
      dialogTitle: '',
      noticeDialog: false,
      noticeForm: {
        id: '', // 修改时使用
        title: '',
        client: [], // 平台
        language: [], // 语言
        content: '',
        status: '', // 是否可见
        code: '' //	google验证码
      },
      noticeRules: {
        title: [{ required: true, message: '请输入公告标题', trigger: 'blur' }],
        client: [{ required: true, message: '请选择发布平台', trigger: 'change' }],
        language: [{ required: true, message: '请选择语言', trigger: 'change' }],
        content: [{ required: true, message: '请输入公告内容', trigger: 'blur' }],
        status: [{ required: true, message: '请选择公告是否显示', trigger: 'change' }]
      },
      googleDialog: false,
      hackReset: true, // 用来强制刷新验证码输入组件
      googleCode: []
    }
  },
  mounted() {
    this.getAnnouncementList()
  },
  methods: {
    getAnnouncementList() {
      this.isloading = true
      getAnnouncementList(this.page, this.pageSize).then(res => {
        this.dataList = res.data.list || []
        this.total = res.data.total
        this.isloading = false
      }).catch(_ => {
        this.isloading = false
      })
    },
    pageChange(pg) {
      this.page = pg
      this.getAnnouncementList()
    },
    sizeChange(size) {
      this.page = 1
      this.pageSize = size
      this.getAnnouncementList()
    },
    search() {
      this.page = 1
      this.getAnnouncementList()
    },
    openOperateWindow(scope = null) {
      if (!scope) {
        this.operateType = 1
        this.dialogTitle = '创建公告'
        this.noticeDialog = true
        this.$nextTick(() => {
          this.noticeForm.id = ''
          this.$refs.noticeForm.resetFields()
        })
      } else {
        this.operateType = 2
        this.dialogTitle = '修改公告'
        this.noticeDialog = true
        this.$nextTick(() => {
          this.noticeForm.id = scope.row.id
          this.noticeForm.title = scope.row.title
          this.noticeForm.client = scope.row.client.split(',') || []
          this.noticeForm.language = scope.row.language.split(',') || []
          this.noticeForm.content = scope.row.content
          this.noticeForm.status = scope.row.status
        })
      }
    },
    beforeClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => { done() })
        .catch(_ => {})
    },
    validatorForm() {
      this.$refs.noticeForm.validate(valid => {
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
          title: this.noticeForm.title,
          client: this.noticeForm.client.toString(),
          language: this.noticeForm.language.toString(),
          content: this.noticeForm.content,
          status: this.noticeForm.status,
          code: this.googleCode.join('')
        }
        addNotice(params).then(res => {
          this.$message({
            type: 'success',
            message: res.msg,
            duration: 1000,
            onClose: () => {
              this.googleDialog = false
              this.noticeDialog = false
              this.$loading().close()
              this.getAnnouncementList()
            }
          })
        }).catch(_ => {
          this.googleDialog = false
          this.$loading().close()
        })
      } else if (this.operateType === 2) { // 修改
        const params = {
          id: this.noticeForm.id,
          title: this.noticeForm.title,
          client: this.noticeForm.client.toString(),
          language: this.noticeForm.language.toString(),
          content: this.noticeForm.content,
          status: this.noticeForm.status,
          code: this.googleCode.join('')
        }
        editNotice(params).then(res => {
          this.$message({
            type: 'success',
            message: res.msg,
            duration: 1000,
            onClose: () => {
              this.googleDialog = false
              this.noticeDialog = false
              this.$loading().close()
              this.getAnnouncementList()
            }
          })
        }).catch(_ => {
          this.googleDialog = false
          this.$loading().close()
        })
      } else { // 删除
        const id = this.noticeForm.id
        const code = this.googleCode.join('')
        delNotice(id, code).then(res => {
          this.$message({
            type: 'success',
            message: res.msg,
            duration: 1000,
            onClose: () => {
              this.googleDialog = false
              this.noticeDialog = false
              this.$loading().close()
              this.getAnnouncementList()
            }
          })
        }).catch(_ => {
          this.googleDialog = false
          this.$loading().close()
        })
      }
    },
    delNotice(scope) {
      this.$confirm('是否删除该公告？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.dialogTitle = '删除公告'
        this.operateType = 3
        this.noticeForm.id = scope.row.id
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
