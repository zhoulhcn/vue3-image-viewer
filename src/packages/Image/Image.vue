<template>
  <div :style="imgRatioWrapStyle" @click="handleImageClick">
    <!-- 图片盒子大小 -->
    <div
      class="v3iv-img-wrap"
      :class="{
        'v3iv-fix-ratio': aspectRatio,
        'v3iv-loading': loading,
        'v3iv-failure': failure,
      }"
    >
      <div class="v3iv-status-slot" v-if="failure">
        <slot name="error"></slot>
      </div>
      <div class="v3iv-status-slot" v-if="loading">
        <slot name="loading"></slot>
      </div>
      <div class="v3iv-slot-footer">
        <slot name="footer"></slot>
      </div>
      <img
        class="v3iv-image"
        :style="{ objectFit: fit }"
        :class="{
          'object-fit-style': !!fit,
        }"
        :alt="alt"
        :referrer-policy="referrerPolicy"
        @load="onLoaded"
        @error="onError"
        @startLoad="onStartLoad"
        :key="src"
        v-lazy-load="{
          src: src,
          active: lazy,
        }"
      />
    </div>
  </div>
</template>

<script>
import lazyLoad from '../directives/lazyLoad';
export default {
  directives: {
    lazyLoad,
  },
  props: {
    src: { type: String, default: '' },
    aspectRatio: { type: Number, default: 0 },
    fit: { type: String, default: '' },
    lazy: { type: Boolean, default: false },
    bgColor: { type: String, default: 'black' },
    alt: { type: String, default: '' },
    referrerPolicy: { type: String, default: '' },
  },
  data() {
    return {
      loading: false,
      failure: false,
      success: false,
    };
  },
  computed: {
    imgRatioWrapStyle() {
      const { bgColor, aspectRatio } = this;
      const style = {
        position: 'relative',
      };
      // 设置背景色
      style.backgroundColor = bgColor;
      // 如果没有设置固定宽高比，图片盒子宽高等于外层设置的宽高
      if (!aspectRatio) {
        style.width = '100%';
        style.height = '100%';
      } else {
        // 使用padding-bottom实现固定宽高比的功能
        style.width = '100%';
        style.paddingBottom = `${aspectRatio * 100}%`;
      }
      return style;
    },
  },
  methods: {
    onStartLoad(event) {
      // undefined会显示加载错误的图标，只有不设置src才不会加载图片
      this.loading = true;
      this.failure = false;
      this.$emit('startLoad', event);
    },
    onLoaded(event) {
      this.loading = false;
      this.failure = false;
      this.success = true;
      this.$emit('load', event);
    },
    onError(event) {
      this.loading = false;
      this.failure = true;
      this.success = false;
      this.$emit('error', event);
    },
    handleImageClick(event) {
      this.$emit('click', event);
    },
  },
};
</script>
<style lang="less" scoped>
// 定义常量
@textColor: #f5f5f5;
#ellipsis1r {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;
}
.v3iv-preview-active {
  .v3iv-img-wrap {
    filter: blur(2px);
  }
}
.v3iv-img-wrap {
  &.v3iv-failure {
    img {
      display: none;
    }
  }
}
.v3iv-img-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  &.v3iv-fix-ratio {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
  }
  // 居中显示错误或者加载中信息
  .v3iv-status-slot {
    position: absolute;
    width: 100%;
    height: 100%;
    color: @textColor;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  // 底部插槽
  .v3iv-slot-footer {
    #ellipsis1r;
    position: absolute;
    bottom: 0;
    font-size: 14px;
    color: white;
    line-height: 32px;
    left: 0;
    right: 0;
    padding: 0 10px;
  }
  .v3iv-image {
    display: block;
    max-width: 100%;
    max-height: 100%;
  }
  .object-fit-style {
    width: 100%;
    height: 100%;
  }
}
</style>
