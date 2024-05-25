<template>
  <div
    class="v3iv-mark-item"
    v-for="(item, index) in marks"
    :key="getMarkKey(item, index)"
    :style="getMarkStyle(item)"
    v-drag-resize="{
      disabled: drawing || focus,
    }"
    @resize-start.native="resizeStart(item)"
    @resize-move.native="
      (event) => {
        resizeMove(item, event);
      }
    "
    @resize-end.native="resizeEnd(item)"
  >
    <div
      v-if="deleteable && !focus"
      class="v3iv-mark-delete"
      @mousewheel.stop
      @mousedown.stop
      @click="deleteMark(item)"
    >
      <svg
        t="1655567649321"
        class="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="17221"
        width="16"
        height="16"
      >
        <path d="M512 1255.489906" p-id="17222" fill="#ffffff"></path>
        <path
          d="M718.519288 688.227064 543.827304 513.637418l174.180292-174.180292c8.801119-8.801119 8.801119-23.128523 0-31.827304-8.801119-8.801119-23.128523-8.801119-31.827304 0L512 481.810114 337.819708 307.629822c-8.801119-8.801119-23.230861-8.596442-31.929642 0.102339l0.102339-0.102339c-8.801119 8.801119-8.698781 23.026184 0.102339 31.827304l174.180292 174.180292L305.58305 688.227064c-8.801119 8.801119-8.801119 23.128523 0 31.827304 8.801119 8.801119 23.128523 8.801119 31.827304 0L512 545.464721 686.691985 720.054367c8.801119 8.801119 22.923846 8.903458 31.724965 0.102339l0.102339-0.102339C727.218069 711.355587 727.218069 697.028183 718.519288 688.227064z"
          p-id="17223"
          fill="#ffffff"
        ></path>
      </svg>
    </div>
  </div>
</template>

<script>
import dragResize from '../directives/dragResize.ts';
export default {
  inject: ['getMarkStyle', 'getMarkLRTBWH'],
  emits: ['resize', 'delete'],
  directives: {
    dragResize,
  },
  props: {
    marks: { type: Array, default: () => [] },
    drawing: { type: Boolean, default: false },
    focus: { type: Boolean, default: false },
    deleteable: { type: Boolean, default: false },
    location: { type: Object, default: () => ({}) },
    renderRecord: { type: Object, default: () => ({}) },
  },
  data() {
    return {};
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    getMarkKey(item, index) {
      return `${item.id}-${index}`;
    },
    resizeStart(item) {},
    resizeMove(target, event) {
      let {
        left: moveL,
        top: moveT,
        right: moveR,
        bottom: moveB,
        key,
      } = event.detail;
      // 计算实际移动的距离(相对容器)
      const { curScale } = this.location;
      // 计算相对原图移动的距离
      const { scale } = this.renderRecord;
      moveL = moveL / curScale / scale;
      moveT = moveT / curScale / scale;
      moveR = moveR / curScale / scale;
      moveB = moveB / curScale / scale;
      // 计算新的坐标,用缓存的坐标加上移动的坐标
      const [left, top, right, bottom] = target.storage;
      const { trueImgW: imgW, trueImgH: imgH } = this.renderRecord;
      let l = left + moveL;
      let t = top + moveT;
      let r = right + moveR;
      let b = bottom + moveB;
      if (key === 'mm') {
        const w = target.right - target.left;
        const h = target.bottom - target.top;
        if (l > 0 && r < imgW) {
          target.left = l;
          target.right = r;
        } else if (l < 0) {
          target.left = 0;
          target.right = w;
        } else if (r > imgW) {
          target.left = imgW - w;
          target.right = imgW;
        }
        if (t > 0 && b < imgH) {
          target.top = t;
          target.bottom = b;
        } else if (t < 0) {
          target.top = 0;
          target.bottom = h;
        } else if (b > imgH) {
          target.top = imgH - h;
          target.bottom = imgH;
        }
        return;
      }

      l = Math.max(0, l);
      t = Math.max(0, t);
      r = Math.max(0, r);
      b = Math.max(0, b);

      l = Math.min(imgW, l);
      t = Math.min(imgH, t);
      r = Math.min(imgW, r);
      b = Math.min(imgH, b);

      target.left = l;
      target.top = t;
      target.right = r;
      target.bottom = b;
    },
    resizeEnd(item) {
      const info = this.getMarkLRTBWH(item);
      const { left, top, right, bottom } = info;
      const { target } = item;
      item.left = left;
      item.top = top;
      item.right = right;
      item.bottom = bottom;
      item.storage = [left, top, right, bottom];
      this.$emit('resize', {
        target,
        detail: info,
      });
    },
    deleteMark(item) {
      this.$emit('delete', item);
    },
  },
};
</script>
<style lang="less" scoped>
.v3iv-mark-item {
  box-sizing: border-box;
  position: absolute;
  z-index: 30;
  box-sizing: border-box;
  border-radius: 2px;
  pointer-events: none;
}
.v3iv-mark-delete {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  position: absolute;
  right: -8px;
  top: -8px;
  z-index: 50;
  cursor: pointer;
  pointer-events: auto;
  background-color: #333;
}
</style>
