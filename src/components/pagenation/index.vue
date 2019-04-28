<template>
  <div class="v-paginavition">
    <!-- jump -->
    <div class="page-jump">
      共<span style="padding: 0 4px;">{{pages}}</span>页
      前往<div class="page-editor">
        <input type="text" ref="pageEditor" :value="jumpPage" :model="jumpPage" @blur="jumpToPage" @keyup.enter="jumpToPage" maxlength="4"/>
      </div>页
    </div>
    <!-- Pages -->
    <ul class="paginavition">
      <li class="page-item page-item--first" :class="{'page-item--disabled': index == 1}" @click="first">&lt;&lt;</li>
      <li class="page-item page-item--prev" :class="{'page-item--disabled': index == 1}" @click="prev">&lt;</li>
      <li class="page-item page-item--more" v-if="showPrevMore">...</li>
      <li class="page-item" :class="{'page-item--current': index == item}" v-for="(item, itemIndex) in pageList" :key="itemIndex" @click="go(item)">{{item}}</li>
      <li class="page-item page-item--more" v-if="showNextMore">...</li>
      <li class="page-item page-item--next" :class="{'page-item--disabled': index == pages}" @click="next">&gt;</li>
      <li class="page-item page-item--list" :class="{'page-item--disabled': index == pages}" @click="last">&gt;&gt;</li>
    </ul>
    <!-- Total -->
    <div class="total">
      共<span>{{total}}</span>条
    </div>
    <!-- PageSize -->
    <div class="page-size" :class="{'active': showSizeList}">
      <span class="page-size--current" @click="toggle">{{limit}}条/页</span>
      <i class="el-icon-arrow-down"></i>
      <ul class="page-size--list">
        <li class="page-size--list-item" :class="{'current': item == limit}" v-for="(item, index) in sizeList" :key="index" @click="changeSize(item)">{{item}}条/页</li>
      </ul>
      <div class="poper-arrow"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    // 可见页码
    views: {
      type: [Number, String],
      default: 5
    },
    // 当前页码
    pg: {
      type: [Number, String],
      default: 1
    },
    // 每页显示条数
    size: {
      type: [Number, String],
      default: 10
    },
    // 总数
    total: {
      type: [Number, String],
      default: 0
    }
  },
  data () {
    return {
      jumpPage: '1', // 前往的页码
      index: Number(this.pg), // 当前页码
      limit: Number(this.size), // 每页显示条数
      count: Number(this.total), // 总数
      sizeList: [10, 20, 30, 50, 100], // 每页显示条数选项
      showPrevMore: false, // 是否显示之前的页码
      showNextMore: false, // 是否显示之后的页码
      showSizeList: false // 是否显示可选页面显示条数
    }
  },
  methods: {
    // 上一页
    prev () {
      if (this.index > 1) {
        this.go(this.index - 1)
      }
    },
    // 下一页
    next () {
      if (this.index < this.pages) {
        this.go(this.index + 1)
      }
    },
    // 跳转至第一页
    first () {
      if (this.index !== 1) {
        this.go(1)
      }
    },
    // 跳转至最后一页
    last () {
      if (this.index !== this.pages) {
        this.go(this.pages)
      }
    },
    // 跳转至 @param: page 页
    go (page) {
      if (this.index !== page) {
        this.index = page
        this.$emit('page-change', this.index)
      }
    },
    // 改变页面显示条数下拉选项状态
    toggle () {
      this.showSizeList = !this.showSizeList
    },
    // 选择 @param: size 条
    changeSize (size) {
      // 先改变每页显示条数
      this.limit = size
      this.$emit('size-change', this.limit)
      // 再将当前页码重置为1
      this.index = 1
      this.$emit('page-change', this.index)
      this.showSizeList = false
    },
    // 前往到第几页
    jumpToPage (e) {
      let page = e.target.value - 0
      if (page || page === 0) {
        if (page < 1 || page > this.pages) {
          this.$refs.pageEditor.value = this.index
          this.jumpPage = this.index
          return false
        } else {
          this.jumpPage = page
          this.go(page)
        }
      } else {
        this.$refs.pageEditor.value = ''
        this.jumpPage = ''
        return false
      }
    }
  },
  computed: {
    // 计算总页码
    pages () {
      return Math.ceil(this.count / this.limit)
    },
    // 计算页码
    pageList () {
      const arr = []
      const views = this.views
      const pages = this.pages
      let current = this.index

      // 计算current前后可见页码个数
      const _offset = (views - 1) / 2
      const offset = {
        start: current - _offset,
        end: current + _offset
      }

      // 若 “可见页码开始数” 小于1，则将 “可见页码开始数” 置为1，结束数置为 “可见页码总数”
      if (offset.start < 1) {
        offset.start = 1
        offset.end = this.views
      }
      // 若 “可见页码结束数” 大于 “页码总数”，则将 “可见页码开始数” 置为 "可见页码开始数" 减去 “可见页码结束数” 与 “页码总数” 的差值，结束数置为 “页码总数”
      if (offset.end > pages) {
        offset.start = offset.start - (offset.end - pages)
        offset.end = pages
      }
      if (offset.start < 1) offset.start = 1

      // eslint-disable-next-line
      this.showPrevMore = (offset.start > 1)
      // eslint-disable-next-line
      this.showNextMore = (offset.end < pages)

      for (let i = offset.start; i <= offset.end; i++) {
        arr.push(i)
      }

      return arr
    }
  },
  watch: {
    pg (val) {
      this.index = val || 1
      this.jumpPage = val || 1
    },
    size (val) {
      this.limit = val || 10
    },
    total (val) {
      this.count = val || 0
    }
  }
}
</script>

<style lang="scss" scoped>
$active_color: #409eff;
$font_color: #666666;
$bg_color: #f9f9f9;
$border_color: #e9e9e9;

.v-paginavition{
  display: block;
  padding: 20px 0;
  &::before,
  &::after{
    content: '';
    display: table;
    clear: both;
    height: 0;
  }
  // pages
  .paginavition{
    list-style: none;
    float: right;
    font-size: 0;
    .page-item{
      display: inline-block;
      vertical-align: top;
      box-sizing: border-box;
      padding: 0 10px;
      min-width: 36px;
      height: 36px;
      line-height: 36px;
      font-size: 14px;
      color: $font_color;
      text-align: center;
      cursor: pointer;
      border: solid 1px $border_color;
      & + .page-item{
        border-left: 0;
      }
      &:first-child{
        border-radius: 4px 0 0 4px;
      }
      &:last-child{
        border-radius: 0 4px 4px 0;
      }
      &.page-item--more{
        line-height: 30px;
      }
      &.page-item--first,
      &.page-item--prev,
      &.page-item--next,
      &.page-item--last{
        line-height: 35px;
      }
      &:hover,
      &.page-item--current{
        color: $active_color;
        font-weight: bold;
        background: $bg_color;
      }
      //禁用
      &.page-item--disabled {
        cursor: not-allowed;
        opacity: .75;
        color: #cccccc;
        background: $bg_color;
      }
    }
  }
  // total
  .total {
    float: left;
    margin-right: 10px;
    height: 36px;
    line-height: 36px;
    font-size: 14px;
    color: $font_color;
    span {
      padding: 0 3px;
    }
  }
  // pageSize
  .page-size{
    position: relative;
    z-index: 999;
    float: left;
    box-sizing: border-box;
    width: 100px;
    height: 36px;
    font-size: 14px;
    color: $font_color;
    background: #ffffff;
    border: solid 1px $border_color;
    border-radius: 4px;
    cursor: pointer;
    .page-size--current{
      display: block;
      height: 100%;
      color: $font_color;
      line-height: 34px;
      text-indent: 15px;
    }
    .el-icon-arrow-down{
      position: absolute;
      top: 50%;
      right: 8px;
      transform: translateY(-50%) rotate(0);
      transition: all 0.2s;
    }
    .poper-arrow{
      display: none;
      position: absolute;
      bottom: calc(100% + 5px);
      left: 35px;
      width: 0;
      height: 0;
      border-top: solid 6px $border_color;
      border-left: solid 6px transparent;
      border-right: solid 6px transparent;
      &::after{
        content: '';
        position: absolute;
        bottom: calc(100% + 1px);
        left: -5px;
        width: 0;
        height: 0;
        border-top: solid 5px #ffffff;
        border-left: solid 5px transparent;
        border-right: solid 5px transparent;
      }
    }
    &.active .el-icon-arrow-down{
      transform: translateY(-50%) rotate(180deg);
    }
    &.active .page-size--list,
    &.active .poper-arrow{
      display: block;
    }
    .page-size--list{
      display: none;
      position: absolute;
      bottom: calc(100% + 10px);
      box-sizing: border-box;
      left: -1px;
      padding: 4px 0;
      width: calc(100% + 2px);
      list-style: none;
      background: #ffffff;
      border: solid 1px $border_color;
      border-radius: 4px;
      .page-size--list-item{
        height: 34px;
        line-height: 34px;
        text-indent: 15px;
        cursor: pointer;
        &:hover,
        &.current{
          color: $active_color;
          background: $bg_color;
        }
      }
    }
  }
  // jump
  .page-jump{
    float: right;
    margin-left: 20px;
    height: 36px;
    line-height: 36px;
    font-size: 14px;
    color: $font_color;
    .page-editor{
      display: inline-block;
      padding: 0 5px;
      height: 36px;
      vertical-align: top;
      input[type="text"]{
        display: block;
        box-sizing: border-box;
        padding: 0;
        margin: 0;
        width: 50px;
        height: 36px;
        font-size: 14px;
        color: $font_color;
        text-align: center;
        line-height: 36px;
        border: solid 1px $border_color;
        border-radius: 4px;
        outline: none;
        &:focus{
        border: solid 1px $active_color;
        }
      }
    }
  }
}
</style>
