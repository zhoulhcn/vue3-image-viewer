<template>
  <div class="v3iv-image-preview">
    <div
      class="v3iv-preview-center"
      :class="{
        'v3iv-loading': loading,
        'v3iv-failure': failure,
      }"
    >
      <div class="v3iv-preview-error" v-if="failure">
        <slot name="error"></slot>
      </div>
      <div class="v3iv-preview-loading" v-if="loading">
        <slot name="loading"></slot>
      </div>
      <!-- <Transition name="bounce"> -->
        <img
          v-show="!loading && !failure"
          class="v3iv-preview-img"
          @load="onPreviewLoad"
          @error="onPreviewError"
          :src="src"
        />
      <!-- </Transition> -->
      <!-- 预加载相邻的图片 -->
      <div
        v-show="false"
        v-for="(url, index) in preloadList"
        :key="getPreloadKey(url, index)"
      >
        <img :src="jointUrl(url)" />
      </div>
      <!-- 底部信息 -->
      <div class="v3iv-img-append">
        <div class="v3iv-title">
          {{ currentItem.title }}
        </div>
        <div class="v3iv-desc">
          {{ currentItem.desc }}
        </div>
      </div>
    </div>
    <!-- 工具栏 -->
    <div class="v3iv-preview-close" @click.stop="closePreview(true)">
      <i class="zlhiconfont v3iv-icon icon-v3iv-guanbi"></i>
    </div>
    <div class="v3iv-preview-sl" @click.stop="handleSwitch(-1)">
      <i class="zlhiconfont v3iv-icon icon-v3iv-left-arrow"></i>
    </div>
    <div class="v3iv-preview-sr" @click.stop="handleSwitch(1)">
      <i class="zlhiconfont v3iv-icon icon-v3iv-right-arrow"></i>
    </div>
  </div>
</template>

<script>
export default {
  inject: ['jointUrl', 'closePreview'],
  props: {
    preload: {
      type: Array || Boolean,
      default() {
        return [0, 2];
      },
    },
    images: {
      type: Array,
      default() {
        return [];
      },
    },
    curIndex: {
      type: Number,
      default: 0,
    },
    loop: { type: Boolean, default: false },
  },
  data() {
    return {
      loading: false,
      failure: false,
      success: false,
    };
  },
  watch: {
    src: {
      handler(val) {
        this.loading = true;
        this.failure = false;
        this.success = false;
      },
      immediate: true,
    },
  },
  computed: {
    // undefined不会触发图片加载
    src() {
      return this.currentItem.url || '';
    },
    currentItem() {
      const { images, curIndex } = this;
      return images[curIndex] || {};
    },
    preloadList() {
      const { images, preload, curIndex } = this;
      if (!preload) {
        return [];
      }
      const total = images.length;
      const cur = curIndex;
      const l = preload[0];
      const r = preload[1];
      const start = Math.max(cur - l, 0);
      const end = Math.min(cur + r, total - 1);
      const arr = images.slice(start, end + 1);
      return arr.map((item) => {
        return item.url;
      });
    },
  },
  // mounted() {
  //   document.addEventListener('keydown', this.onPreviewKeydown);
  // },
  // beforeUnmount() {
  //   document.removeEventListener('keydown', this.onPreviewKeydown);
  // },
  methods: {
    onPreviewKeydown(event) {
      if (event.code === 'Escape') {
        this.closePreview(true);
      }
      // 左或A
      if (event.code === 'ArrowLeft' || event.code === 'KeyA') {
        this.handleSwitch(-1);
      }
      // 右或D
      if (event.code === 'ArrowRight' || event.code === 'KeyD') {
        this.handleSwitch(1);
      }
    },
    handleSwitch(dir) {
      if (!this.switchClickable(dir)) {
        return;
      }
      const { loop, curIndex, images } = this;
      let index = curIndex + dir;
      const len = images.length - 1;
      if (loop) {
        if (index < 0) {
          index = len;
        }
        if (index > len) {
          index = 0;
        }
      } else {
        index = Math.max(0, index);
        index = Math.min(len, index);
      }
      this.$emit('switch', index);
    },
    switchClickable(dir) {
      const { loop, curIndex, images } = this;
      if (loop) {
        return true;
      }
      if (dir == -1 && !curIndex) {
        return false;
      }
      const len = images.length - 1;
      if (dir == 1 && curIndex == len) {
        return false;
      }
      return true;
    },
    getPreloadKey(url, index) {
      return `${url}-${index}`;
    },
    onPreviewLoad() {
      this.loading = false;
      this.failure = false;
      this.success = true;
    },
    onPreviewError() {
      this.loading = false;
      this.failure = true;
      this.success = false;
    },
  },
};
</script>
<style lang="less" scoped>
@textColor: #f5f5f5;
#ellipsis1r {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;
}

.bounce-enter-active,
.bounce-leave-active {
  transform: scale(1);
  transition: transform 0.3s ease;
}

.bounce-enter-from,
.bounce-leave-to {
  transform: scale(0);
}

.v3iv-image-preview {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 1000;
  overflow: hidden;
  background: rgba(36, 38, 41, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.v3iv-preview-center {
  &.v3iv-loading,
  &.v3iv-failure {
    width: 400px;
    height: 300px;
    overflow: hidden;
  }
  &.v3iv-failure {
    img {
      display: none;
    }
  }
}

.v3iv-preview-center {
  .v3iv-preview-error,
  .v3iv-preview-loading {
    color: @textColor;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #333;
  }
  min-width: 400px;
  min-height: 300px;
  max-width: 100%;
  max-height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  cursor: default;
  overflow: hidden;
  background-color: #333;
  border-radius: 4px;
  .v3iv-preview-img {
    object-fit: contain;
    width: 100%;
    height: 100%;
  }
  .v3iv-img-append {
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    padding: 0 20px 20px 20px;
    color: #eee;
    transition: color 0.3s ease-in-out;
    &:hover {
      color: white;
    }
    .v3iv-title {
      #ellipsis1r;
      margin-bottom: 8px;
      font-size: 18px;
      color: lightblue;
    }
    .v3iv-desc {
      #ellipsis1r;
      color: lightblue;
      font-style: oblique;
    }
  }
}
@icon-bg: rgba(0, 0, 0, 0.1);
.v3iv-preview-close {
  display: inline-block;
  width: 120px;
  height: 120px;
  position: absolute;
  top: -60px;
  right: -60px;
  font-size: 18px;
  cursor: pointer;
  background-color: @icon-bg;
  border-radius: 50%;
  // transition: all 0.3s ease-in-out;
  visibility: hidden;
  .v3iv-icon {
    position: absolute;
    left: 35px;
    bottom: 35px;
    margin-left: -6px;
    margin-bottom: -6px;
  }
}
.v3iv-preview-sl,
.v3iv-preview-sr {
  display: inline-block;
  width: 60px;
  height: 100px;
  position: absolute;
  top: 50%;
  margin-top: -50px;
  line-height: 100px;
  text-align: center;
  cursor: pointer;
  background-color: @icon-bg;
  // transition: all 0.3s ease-in-out;
  visibility: hidden;
  .v3iv-icon {
    font-size: 30px;
  }
}
.v3iv-preview-sl {
  border-radius: 0 10px 10px 0;
  left: 0;
  .zlhiconfont {
    margin-left: -5px;
  }
}
.v3iv-preview-sr {
  border-radius: 10px 0 0 10px;
  right: 0;
  .zlhiconfont {
    margin-right: -5px;
  }
}
.v3iv-icon {
  color: white;
  user-select: none;
}
.v3iv-image-preview:hover {
  .v3iv-preview-close,
  .v3iv-preview-sl,
  .v3iv-preview-sr {
    visibility: visible;
  }
}
</style>
