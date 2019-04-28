<template>
  <div>
    <el-upload
      v-if="edited!==undefined"
      :multiple="false"
      :action="config.actionPath"
      :before-upload="beforeAvatarUpload"
      :data="postData"
      :hash="hashval"
      :on-success="handleAvatarSuccess"
      class="avatar-uploade"
      accept="image/jpeg,image/gif,image/png,image/bmp">
      <img v-if="imageUrl" :src="imageUrl" class="avatar" title="点击更换">
      <i v-else class="el-icon-plus avatar-uploader-icon" />
    </el-upload>
    <div v-else class="avatar-uploade">
      <img :src="imageUrl" :hash="hashval" class="avatar">
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { qiniuToken } from "@/components/qiniu/qiniuToken"

const config = {
  actionPath: 'https://upload-z2.qiniup.com',
  domainPublic: 'https://pub.cia.niubit.com/',
  domainPrivate: 'https://pri.cia.niubit.com/',
  bucketPublic: 'coininasia-public',
  bucketPrivate: 'coininasia-private',
  AK: 'gN_4dxEB1GKQQqBAWyKb0v6bdZopdTIXjWQTxSxR',
  SK: '678Rk36E0r5HmeEzdIpidltBE7rCm6a4Z8s26NBi'
}
export default {
  props: {
    edited: { type: String },
    private: { type: String },
    hashval: { type: String }
  },
  data() {
    return {
      config: config,
      postData: {},
      imageUrl: '',
      qiniuHash: ''
    }
  },
  created(){
    this.initData()
  },
  updated() {
    this.initData()
  },
  methods: {
    initData(){
      var domainUrl = config.domainPublic
      var bucketName = config.bucketPublic
      if (this.private !== undefined) {
        domainUrl = config.domainPrivate
        bucketName = config.bucketPrivate
      }
      var deadline = Math.round(new Date().getTime() / 1000) + 3600
      if (this.edited !== undefined) {
        var policy = {}
        policy.scope = bucketName
        policy.deadline = deadline
        this.postData.token = qiniuToken.getUpToken(config.AK, config.SK, policy)

      }
      if (!!this.hashval) {
        var url = domainUrl + this.hashval + '?e=' + deadline
        if (this.private !== undefined) {
          var token = qiniuToken.getDownToken(config.AK, config.SK, url)
          url += '&token=' + token
        }
        this.imageUrl = url
      }
      else {
        this.imageUrl = ''
      }
    },
    handleAvatarSuccess(res, file) {
      this.qiniuHash = res.hash
      this.imageUrl = URL.createObjectURL(file.raw)
      this.$emit('childByValue', this.qiniuHash)
    },
    beforeAvatarUpload(file) {
      const isJPG = (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/git')
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    }
  }
}

</script>

<style>
  .avatar-uploade .el-upload {
  border: 1px dashed #d9d9d9;
  cursor: pointer;
  width:200px;
  padding: 5px;
  text-align: center;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.avatar-uploade .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploade .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 190px;
  height: 190px;
  line-height: 190px;
  text-align: center;
}

.avatar-uploade .avatar {
  max-width: 100%;
  max-height: 100%;
  display: inline-block;
  margin: 0 auto;
}

.avatar-uploade .el-upload-list {
  display: none;
}

</style>
