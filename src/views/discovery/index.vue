<template>
  <div class="app-container">
    <!-- Tools -->
    <el-row :gutter="20" class="tools-wrapper">
      <el-col :lg="6" :xs="24">
        <el-input v-model="query.title" class="tools-item" placeholder="输入手机号查询" clearable @keyup.enter.native="search" />
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
          <el-radio-button v-for="(state, index) in foundStautsTypes.TypesArray" :key="index" :label="state.key">{{ state.value }}</el-radio-button>
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
    <el-tabs v-model="language" type="border-card" @tab-click="getDiscoveryList">
      <el-tab-pane v-for="(lang, index) in langList" :key="index" :name="lang.key" :label="lang.value">
        <!-- 列表 -->
        <el-table v-loading="isloading" :data="dataList" stripe border>
          <el-table-column prop="found_utime" label="更新时间" align="center" width="180" />
          <el-table-column prop="found_title" label="标题" align="center" />
          <el-table-column label="图片" align="center">
            <template slot-scope="scope">
              <el-popover placement="right" trigger="hover">
                <img :src="domain + scope.row.found_img_url" class="artwork">
                <img slot="reference" :src="domain + scope.row.found_img_url" class="mini-img">
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="found_language" label="语言" align="center" />
          <el-table-column label="状态" align="center">
            <template slot-scope="scope">
              {{ foundStautsTypes[scope.row.found_status] }}
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" fixed="right">
            <template slot-scope="scope">
              <el-tooltip content="修改" placement="top">
                <el-button type="text" @click="openOperateWindow(scope)"><i class="el-icon-edit" /></el-button>
              </el-tooltip>
              <el-tooltip content="删除" placement="top">
                <el-button type="text" @click="delDiscovery(scope)"><i class="el-icon-delete" /></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <v-pagination v-if="total" :pg="page" :size="pageSize" :total="total" :views="5" @page-change="pageChange" @size-change="sizeChange" />
      </el-tab-pane>
    </el-tabs>

    <!-- 创建/修改 -->
    <el-dialog :visible.sync="discoveryDialog" :close-on-click-modal="false" :title="dialogTitle" :before-close="beforeClose" width="600px">
      <!-- Form -->
      <el-form ref="discoveryForm" :model="discoveryForm" :rules="productRules" status-icon label-width="100px">
        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item prop="title" label="标题:">
              <el-input v-model="discoveryForm.title" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="language" label="语言:">
              <el-radio-group v-model="discoveryForm.language">
                <el-radio v-for="(lang, index) in langList" :key="index" :label="lang.key">{{ lang.value }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="图片:" required>
              <qiniuFile :hashval="discoveryForm.imgUrl" edited @childByValue="resolveImgUrl" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="status" label="状态:">
              <el-radio-group v-model="discoveryForm.status">
                <el-radio v-for="(item, index) in foundStautsTypes.TypesArray" v-if="item.key >= 0" :key="index" :label="item.key">{{ item.value }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="url" label="app链接:">
              <el-input v-model="discoveryForm.url" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item>
              <el-button @click="discoveryDialog = false">取消</el-button>
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
import { getDiscoveryList, addDiscovery, editDiscovery, delDiscovery } from '@/api/discovery'
import { FoundStautsTypes } from '@/utils/enums'
import qiniuFile from '@/components/qiniu/singleFile.vue'

export default {
  name: 'Discovery',
  components: {
    qiniuFile
  },
  data() {
    return {
      domain: 'https://pub.cia.niubit.com/',
      language: 'all',
      langList: [
        {
          key: 'all',
          value: '所有'
        },
        {
          key: 'zh-CN',
          value: '中文'
        },
        {
          key: 'en-US',
          value: '英文'
        },
        {
          key: 'zh-HK',
          value: '繁体'
        }
      ],
      query: {
        title: '',
        time: '',
        status: '-1'
      },
      dataList: [],
      isloading: false,
      total: 0,
      page: 1,
      pageSize: 10,
      foundStautsTypes: FoundStautsTypes,
      dialogTitle: '',
      discoveryDialog: false,
      discoveryForm: {
        id: '', // 修改时使用
        title: '',
        url: '', // 链接
        language: '', // 语言
        imgUrl: '', // 图片地址
        status: '', // 是否可见
        code: '' //	google验证码
      },
      productRules: {
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        url: [{ required: true, message: '请输入app链接', trigger: 'blur' }],
        language: [{ required: true, message: '请选择语言', trigger: 'blur' }],
        status: [{ required: true, message: '请选择状态', trigger: 'blur' }]
      },
      googleDialog: false,
      hackReset: true, // 用来强制刷新验证码输入组件
      googleCode: []
    }
  },
  mounted() {
    this.getDiscoveryList()
  },
  methods: {
    getDiscoveryList() {
      this.isloading = true
      const params = {
        pageNum: this.page,
        pageSize: this.pageSize,
        startTime: this.query.time ? this.query.time[0] : '',
        endTime: this.query.time ? this.query.time[1] : '',
        title: this.query.title || '',
        status: this.query.status,
        language: this.language !== 'all' ? this.language : ''
      }
      getDiscoveryList(params).then(res => {
        this.dataList = res.data.list || []
        this.total = res.data.total
        this.isloading = false
      }).catch(_ => {
        this.isloading = false
      })
    },
    pageChange(pg) {
      this.page = pg
      this.getDiscoveryList()
    },
    sizeChange(size) {
      this.page = 1
      this.pageSize = size
      this.getDiscoveryList()
    },
    search() {
      this.page = 1
      this.getDiscoveryList()
    },
    openOperateWindow(scope = null) {
      if (!scope) {
        this.operateType = 1
        this.dialogTitle = '创建发现'
        this.discoveryDialog = true
        this.$nextTick(() => {
          this.discoveryForm.id = ''
          this.$refs.discoveryForm.resetFields()
        })
      } else {
        this.operateType = 2
        this.dialogTitle = '修改发现'
        this.discoveryDialog = true
        this.$nextTick(() => {
          this.discoveryForm.id = scope.row.found_id
          this.discoveryForm.title = scope.row.found_title
          this.discoveryForm.url = scope.row.found_jump_link
          this.discoveryForm.imgUrl = scope.row.found_img_url
          this.discoveryForm.language = scope.row.found_language
          this.discoveryForm.status = scope.row.found_status
        })
      }
    },
    beforeClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => { done() })
        .catch(_ => {})
    },
    validatorForm() {
      // 判断是否上传了图片
      if (!this.discoveryForm.imgUrl) {
        this.$message.error('请上传Discovery图片')
        return false
      }
      this.$refs.discoveryForm.validate(valid => {
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
          title: this.discoveryForm.title,
          url: this.discoveryForm.url,
          language: this.discoveryForm.language,
          imgUrl: this.discoveryForm.imgUrl,
          status: this.discoveryForm.status,
          code: this.googleCode.join('')
        }
        addDiscovery(params).then(res => {
          this.$message({
            type: 'success',
            message: res.msg,
            duration: 1000,
            onClose: () => {
              this.googleDialog = false
              this.discoveryDialog = false
              this.$loading().close()
              this.getDiscoveryList()
            }
          })
        }).catch(_ => {
          this.googleDialog = false
          this.$loading().close()
        })
      } else if (this.operateType === 2) { // 修改
        const params = {
          id: this.discoveryForm.id,
          title: this.discoveryForm.title,
          url: this.discoveryForm.url,
          language: this.discoveryForm.language,
          imgUrl: this.discoveryForm.imgUrl,
          status: this.discoveryForm.status,
          code: this.googleCode.join('')
        }
        editDiscovery(params).then(res => {
          this.$message({
            type: 'success',
            message: res.msg,
            duration: 1000,
            onClose: () => {
              this.googleDialog = false
              this.discoveryDialog = false
              this.$loading().close()
              this.getDiscoveryList()
            }
          })
        }).catch(_ => {
          this.googleDialog = false
          this.$loading().close()
        })
      } else { // 删除
        const id = this.discoveryForm.id
        const code = this.googleCode.join('')
        delDiscovery(id, code).then(res => {
          this.$message({
            type: 'success',
            message: res.msg,
            duration: 1000,
            onClose: () => {
              this.googleDialog = false
              this.discoveryDialog = false
              this.$loading().close()
              this.getDiscoveryList()
            }
          })
        }).catch(_ => {
          this.googleDialog = false
          this.$loading().close()
        })
      }
    },
    delDiscovery(scope) {
      this.$confirm('是否删除该发现？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.dialogTitle = '删除发现'
        this.operateType = 3
        this.discoveryForm.id = scope.row.found_id
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
    },
    resolveImgUrl(val) {
      this.discoveryForm.imgUrl = val
    }
  }
}
</script>

<style lang="scss">
.artwork {
  display: block;
  width: 318px;
  height: 180px;
  max-width: 100%;
  max-height: 100%;
}
.mini-img {
  display: block;
  margin: auto;
  width: 90px;
  height: 50px;
}
</style>
