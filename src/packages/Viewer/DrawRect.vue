<template>
  <!-- 画图的框 -->
  <div class="v3iv-draw-mark" :style="drawStyle"></div>
</template>

<script>
export default {
  inject: ['getMarkStyle'],
  props: {
    drawable: { type: Boolean, default: false },
    drawMark: { type: Object, default: () => ({}) },
  },
  computed: {
    drawStyle() {
      const { drawable, drawMark } = this;
      if (!drawable || !drawMark.active) {
        return {
          display: 'none',
        };
      }
      return this.getMarkStyle(drawMark, 'lightpink');
    }
  },
};
</script>
<style lang='less' scoped>
.v3iv-draw-mark {
  box-sizing: border-box;
  position: absolute;
  z-index: 30;
  box-sizing: border-box;
  pointer-events: none;
  z-index: 50;
}
</style>
