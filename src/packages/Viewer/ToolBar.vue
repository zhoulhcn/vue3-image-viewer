<template>
  <div class="v3iv-toolbar">
    <slot name="toolbar">
      <div @click="containOrCover" class="zlhiconfont">
        <span
          class="icon-v3iv-quanping"
          v-if="scaleFit == fitMode.contain"
        ></span>
        <span class="icon-v3iv-fullfill" v-else></span>
      </div>
      <div @click="prev" class="zlhiconfont icon-v3iv-zhixiang-zuo" />
      <div @click="zoomOut" class="zlhiconfont icon-v3iv-jian" />
      <div @click="zoomIn" class="zlhiconfont icon-v3iv-jia" />
      <div @click="next" class="zlhiconfont icon-v3iv-zhixiang-you" />
      <div @click="reset" class="zlhiconfont icon-v3iv-zhongzhi-circle" />
      <div @click="download()" class="zlhiconfont icon-v3iv-xiazai" />
    </slot>
  </div>
</template>

<script>
export default {
  emits: ['switchMode', 'prev', 'zoomOut', 'zoomIn', 'next', 'reset'],
  props: {
    fitMode: {
      type: Object,
      default: () => ({}),
    },
    scaleFit: {
      type: Number,
      default: 1,
    },
    imgRecord: {
      type: Object,
      default: () => ({}),
    },
  },
  methods: {
    containOrCover() {
      this.$emit('switchMode');
    },
    prev() {
      this.$emit('prev');
    },
    zoomOut() {
      this.$emit('zoomOut');
    },
    zoomIn() {
      this.$emit('zoomIn');
    },
    next() {
      this.$emit('next');
    },
    reset() {
      this.$emit('reset');
    },
    download() {
      const { trueSrc } = this.imgRecord;
      const link = document.createElement('a');
      link.href = trueSrc;
      if (!name) {
        name = trueSrc.split('/').pop() || 'download';
      }
      link.setAttribute('target', '_blank');
      link.setAttribute('download', name);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
  },
};
</script>
<style lang="less" scoped>
.v3iv-toolbar {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  width: 100%;
  box-sizing: border-box;
  background-color: #101010;
  .zlhiconfont {
    background-color: lightblue;
    width: 30px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    color: white;
    border-radius: 4px;
    margin: 0 5px;
    cursor: pointer;
  }
}
</style>
