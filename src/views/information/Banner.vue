<template>
  <div class="app-container">
    <!-- Tools -->
    <el-row :gutter="20" class="tools-wrapper">
      <el-col :lg="4" :xs="8">
        <el-button class="tools-item" type="primary" icon="el-icon-plus" @click="openOperateWindow()">创建Banner</el-button>
      </el-col>
    </el-row>

    <!-- Table -->
    <el-table v-loading="isloading" :data="dataList" stripe border>
      <el-table-column prop="create_time" width="180" label="创建时间" align="center" />
      <el-table-column prop="expire_date" width="180" label="有效时间" align="center" />
      <el-table-column prop="title" label="标题" align="center" />
      <el-table-column label="图片" align="center">
        <template slot-scope="scope">
          <el-popover placement="right" width="200" trigger="hover">
            <img :src="domain + scope.row.image_url" class="artwork">
            <img slot="reference" :src="domain + scope.row.image_url" class="mini-img">
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="client" label="平台" align="center" />
      <el-table-column prop="language" label="语言" align="center" />
      <el-table-column prop="web_url" label="链接" align="center" />
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
            <el-button type="text" @click="delBanner(scope)"><i class="el-icon-delete" /></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <v-pagination v-if="total" :pg="page" :size="pageSize" :total="total" :views="5" @page-change="pageChange" @size-change="sizeChange" />

    <!-- 创建/修改Banner -->
    <el-dialog :visible.sync="bannerDialog" :close-on-click-modal="false" :title="dialogTitle" :before-close="beforeClose" width="600px">
      <!-- Form -->
      <el-form ref="bannerForm" :model="bannerForm" :rules="productRules" status-icon label-width="100px">
        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item prop="title" label="标题:">
              <el-input v-model="bannerForm.title" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="url" label="页面链接:">
              <el-input v-model="bannerForm.url" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="client" label="平台:">
              <el-checkbox-group v-model="bannerForm.client">
                <el-checkbox label="ios" />
                <el-checkbox label="android" />
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="language" label="语言:">
              <el-checkbox-group v-model="bannerForm.language">
                <el-checkbox label="en-US">英文</el-checkbox>
                <el-checkbox label="zh-CN">中文</el-checkbox>
                <el-checkbox label="zh-HK">繁体</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="图片:" required>
              <qiniuFile :hashval="bannerForm.imgUrl" edited @childByValue="resolveImgUrl" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="status" label="是否显示:">
              <el-radio-group v-model="bannerForm.status">
                <el-radio v-for="(item, index) in visibleTypes.TypesArray" :key="index" :label="item.key">{{ item.value }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item>
              <el-button @click="bannerDialog = false">取消</el-button>
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
import { getBannerList, addBanner, editBanner, delBanner } from '@/api/information'
import { VisibleTypes } from '@/utils/enums'
import qiniuFile from '@/components/qiniu/singleFile.vue'

export default {
  name: 'Banner',
  components: {
    qiniuFile
  },
  data() {
    return {
      domain: 'https://pub.cia.niubit.com/',
      dataList: [],
      isloading: false,
      total: 0,
      page: 1,
      pageSize: 10,
      operateType: '', // type: {1:新建；2:修改; 3:删除}
      visibleTypes: VisibleTypes,
      dialogTitle: '',
      bannerDialog: false,
      bannerForm: {
        id: '', // 修改时使用
        title: '',
        url: '', // 链接
        client: [], // 平台
        language: [], // 语言
        imgUrl: '', // 图片地址
        status: '', // 是否可见
        code: '' //	google验证码
      },
      productRules: {
        title: [{ required: true, message: '请输入Banner标题', trigger: 'blur' }],
        url: [{ required: true, message: '请输入页面链接', trigger: 'blur' }],
        client: [{ required: true, message: '请选择发布平台', trigger: 'blur' }],
        language: [{ required: true, message: '请选择发布语言', trigger: 'blur' }],
        status: [{ required: true, message: '请选择是否显示', trigger: 'blur' }]
      },
      googleDialog: false,
      hackReset: true, // 用来强制刷新验证码输入组件
      googleCode: []
    }
  },
  mounted() {
    this.getBannerList()
  },
  methods: {
    getBannerList() {
      this.isloading = true
      getBannerList(this.page, this.pageSize).then(res => {
        this.dataList = res.data.list || []
        this.total = res.data.total
        this.isloading = false
      }).catch(_ => {
        this.isloading = false
      })
    },
    pageChange(pg) {
      this.page = pg
      this.getBannerList()
    },
    sizeChange(size) {
      this.page = 1
      this.pageSize = size
      this.getBannerList()
    },
    search() {
      this.page = 1
      this.getBannerList()
    },
    openOperateWindow(scope = null) {
      if (!scope) {
        this.operateType = 1
        this.dialogTitle = '创建Banner'
        this.bannerDialog = true
        this.$nextTick(() => {
          this.bannerForm.id = ''
          this.$refs.bannerForm.resetFields()
        })
      } else {
        this.operateType = 2
        this.dialogTitle = '修改Banner'
        this.bannerDialog = true
        this.$nextTick(() => {
          this.bannerForm.id = scope.row.id
          this.bannerForm.title = scope.row.title
          this.bannerForm.client = scope.row.client.split(',') || []
          this.bannerForm.language = scope.row.language.split(',') || []
          this.bannerForm.content = scope.row.content
          this.bannerForm.status = scope.row.status
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
      if (!this.bannerForm.imgUrl) {
        this.$message.error('请上传Banner图片')
        return false
      }
      this.$refs.bannerForm.validate(valid => {
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
          title: this.bannerForm.title,
          url: this.bannerForm.url,
          client: this.bannerForm.client.toString(),
          language: this.bannerForm.language.toString(),
          imgUrl: this.bannerForm.imgUrl,
          status: this.bannerForm.status,
          code: this.googleCode.join('')
        }
        addBanner(params).then(res => {
          this.$message({
            type: 'success',
            message: res.msg,
            duration: 1000,
            onClose: () => {
              this.googleDialog = false
              this.bannerDialog = false
              this.$loading().close()
              this.getBannerList()
            }
          })
        }).catch(_ => {
          this.googleDialog = false
          this.$loading().close()
        })
      } else if (this.operateType === 2) { // 修改
        const params = {
          id: this.bannerForm.id,
          title: this.bannerForm.title,
          url: this.bannerForm.url,
          client: this.bannerForm.client.toString(),
          language: this.bannerForm.language.toString(),
          imgUrl: this.bannerForm.imgUrl,
          status: this.bannerForm.status,
          code: this.googleCode.join('')
        }
        editBanner(params).then(res => {
          this.$message({
            type: 'success',
            message: res.msg,
            duration: 1000,
            onClose: () => {
              this.googleDialog = false
              this.bannerDialog = false
              this.$loading().close()
              this.getBannerList()
            }
          })
        }).catch(_ => {
          this.googleDialog = false
          this.$loading().close()
        })
      } else { // 删除
        const id = this.bannerForm.id
        const code = this.googleCode.join('')
        delBanner(id, code).then(res => {
          this.$message({
            type: 'success',
            message: res.msg,
            duration: 1000,
            onClose: () => {
              this.googleDialog = false
              this.bannerDialog = false
              this.$loading().close()
              this.getBannerList()
            }
          })
        }).catch(_ => {
          this.googleDialog = false
          this.$loading().close()
        })
      }
    },
    delBanner(scope) {
      this.$confirm('是否删除该Banner？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.dialogTitle = '删除Banner'
        this.operateType = 3
        this.bannerForm.id = scope.row.id
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
      this.bannerForm.imgUrl = val
    }
  }
}
</script>

<style lang="scss">
.artwork {
  display: block;
  max-width: 100%;
  max-height: 100%;
}
.mini-img {
  display: block;
  margin: auto;
  width: 50px;
  height: 50px;
}
</style>
