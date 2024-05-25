<template>
  <div
    v-show="false"
    v-for="(url, index) in preloadList"
    :key="getKey(url, index)"
  >
    <Image :base="base" :src="url" :token="token" />
  </div>
</template>

<script>
import Image from '../Image/index.vue';
export default {
  components: {
    Image,
  },
  props: {
    base: {
      type: String,
      default: '',
    },
    token: {
      type: String,
      default: '',
    },
    preload: {
      type: Array,
      default: () => [0, 2],
    },
    images: {
      type: Array,
      default: () => [],
    },
    currentIndex: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    preloadList() {
      const { preload, images, currentIndex: cur } = this;
      if (!preload) {
        return [];
      }
      const total = images.length;
      const l = preload[0];
      const r = preload[1];
      const start = Math.max(cur - l, 0);
      const end = Math.min(cur + r, total - 1);
      const arr = images.slice(start, end + 1);
      return arr.map((item) => {
        if (item) {
          return item.url;
        }
        return '';
      });
    },
  },
  methods: {
    getKey(url, index) {
      return `${url}-v3iv-preload-${index}`;
    },
  },
};
</script>
<style lang="less" scoped></style>
