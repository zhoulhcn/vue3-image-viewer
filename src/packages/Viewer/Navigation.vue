<template>
  <div class="v3iv-navigation-bar">
    <!-- 缩略图 -->
    <div class="v3iv-navigation-drawer" :style="drawerStyle">
      <div
        class="v3iv-navigation-item"
        v-for="(item, index) in images"
        :key="getKey(item, index)"
        :class="{ 'v3iv-active': index == currentIndex }"
        @click="switchIndex(index)"
        @mousedown.stop
        @mousewheel.stop
      >
        <Image
          height="100%"
          width="100%"
          :base="base"
          :src="item.thumbnail"
          :token="token"
          fit="cover"
          lazy
        >
          <template #loading> ... </template>
          <template #error>
            <i class="zlhiconfont icon-v3iv-error"></i>
          </template>
        </Image>
      </div>
    </div>
  </div>
</template>

<script>
import Image from '../Image/index.vue';
export default {
  components: {
    Image,
  },
  props: {
    currentIndex: {
      type: Number,
      default: 0,
    },
    images: {
      type: Array,
      default: () => [],
    },
    base: {
      type: String,
      default: '',
    },
    token: {
      type: String,
      default: '',
    },
  },
  data() {
    return {};
  },
  computed: {
    drawerStyle() {
      const move = this.currentIndex * 30 + 15;
      return {
        'margin-left': `-${move}px`,
      };
    },
  },
  methods: {
    switchIndex(index) {
      this.$emit('switch', index);
    },
    getKey(item, index) {
      return `${item.thumbnail}-v3iv-thumbnail-${index}`;
    },
  },
};
</script>
<style lang="less" scoped>
.v3iv-navigation-bar {
  position: absolute;
  bottom: 0px;
  width: 100%;
  z-index: 10;
  height: 50px;
  background-color: rgba(0, 0, 0, 0.5);
  overflow: hidden;
  pointer-events: none;

  .v3iv-navigation-drawer {
    height: 100%;
    position: absolute;
    left: 50%;
  }

  .v3iv-navigation-item {
    height: 100%;
    cursor: pointer;
    width: 30px;
    float: left;
    opacity: 0.7;
    pointer-events: auto;
    filter: grayscale(50%);

    &:hover {
      opacity: 1;
      filter: grayscale(0%);
    }

    &.v3iv-active {
      opacity: 1;
      filter: grayscale(0%);
      // 淡蓝色内部阴影
    }
  }
}
</style>
