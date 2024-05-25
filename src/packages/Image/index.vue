<template>
  <div
    :style="wrapStyle"
    class="v3iv-image-wrap"
    :class="{
      'v3iv-preview-active': previewVisible,
    }"
  >
    <Image
      :src="_src"
      :aspectRatio="aspectRatio"
      :fit="fit"
      :lazy="lazy"
      :bgColor="bgColor"
      :alt="alt"
      :referrerPolicy="referrerPolicy"
      @click="handleImageClick"
      @load="onLoaded"
      @error="onError"
      style="{
        cursor: preview ? 'pointer' : 'default',
      }"
      :class="{ 'v3iv-clickable': preview }"
    >
      <template #loading> <slot name="loading"></slot> </template>
      <template #error> <slot name="error"></slot> </template>
      <template #footer> <slot name="footer"></slot> </template>
    </Image>
    <Preview
      v-if="previewVisible"
      :class="{ 'v3iv-clickable': hideOnClickModal }"
      @click="closePreview(hideOnClickModal)"
      :preload="preload"
      :images="images"
      :curIndex="previewIndex"
      :loop="loop"
      @switch="handleSwitch"
    >
      <template #loading> <slot name="loading"></slot> </template>
      <template #error> <slot name="error"></slot> </template>
    </Preview>
  </div>
</template>

<script>
// TODO: 处理移动端样式、处理按键冲突
import Image from './Image.vue';
import Preview from './Preview.vue';
export default {
  emits: ['switch', 'close', 'load', 'error'],
  provide() {
    return {
      jointUrl: this.jointUrl,
      closePreview: this.closePreview,
    };
  },
  components: {
    Image,
    Preview,
  },
  props: {
    // 当前组件
    base: { type: String, default: '' },
    src: { type: String, default: '' },
    token: { type: String, default: '' },
    width: { type: String, default: '' },
    height: { type: String, default: '' },
    // image组件
    fit: { type: String, default: 'cover' },
    aspectRatio: { type: Number },
    lazy: { type: Boolean },
    bgColor: { type: String },
    alt: { type: String },
    referrerPolicy: { type: String },
    // viewer组件
    hideOnClickModal: { type: Boolean, default: false },
    images: {
      type: Array,
      default() {
        return [];
      },
    },
    loop: { type: Boolean, default: false },
    preload: {
      type: Array || Boolean,
      default() {
        return [0, 2];
      },
    },
    initialIndex: { type: Number, default: 0 },
    preview: { type: Boolean, default: false },
  },
  data() {
    return {
      previewVisible: false,
      previewIndex: this.initialIndex,
    };
  },
  computed: {
    wrapStyle() {
      const { width, height } = this;
      const style = {};
      if (width) {
        style.width = width;
      }
      if (height) {
        style.height = height;
      }
      return style;
    },
    _src() {
      const { src } = this;
      return this.jointUrl(src);
    },
  },
  methods: {
    handleSwitch(index) {
      this.previewIndex = index;
      this.$emit('switch', index);
    },
    closePreview(close) {
      if (close) {
        this.$emit('close');
        this.previewVisible = false;
      }
    },
    onLoaded(event) {
      this.$emit('load', event);
    },
    onError(event) {
      this.$emit('error', event);
    },
    handleImageClick() {
      if (!this.preview) {
        return;
      }
      this.previewVisible = true;
      this.previewIndex = this.initialIndex;
    },
    jointUrl(src) {
      if (!src) return '';
      const { base, token } = this;
      const query = token ? `?token=${token}` : '';
      if (
        src.startsWith('data:') ||
        src.startsWith('http:') ||
        src.startsWith('https:') ||
        src.startsWith('blob:')
      ) {
        return `${src}${query}`;
      }
      return `${base}${src}${query}`;
    },
  },
};
</script>

<style lang="less" scoped>
.v3iv-clickable {
  cursor: pointer;
}
</style>
