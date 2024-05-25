<template>
  <div
    class="v3iv-viewer"
    @mousewheel="onWheel"
    @mousedown="onMousedown"
    @mouseup="onMouseup"
    @mousemove="onMousemove"
    @mouseleave="onMouseleave"
    @contextmenu.stop.prevent
    :class="{ 'v3iv-has-toolbar': toolbar, 'v3iv-mousedown': mouseActive }"
  >
    <div class="v3iv-viewer-clip" ref="clipper">
      <div class="v3iv-viewer-img-wrap" :style="wrapStyle">
        <!-- 图片 -->
        <Image
          height="100%"
          width="100%"
          :base="base"
          :src="URL"
          :token="token"
          @mousedown="onDrawStart"
          @mouseup="onDrawEnd"
          @mousemove="onDrawMove"
          @mouseleave="onDrawEnd"
          @contextmenu.stop.prevent
          @load="onLoad"
          @error="onError"
          :fit="fit"
        >
          <template #loading>
            <slot name="loading"></slot>
          </template>
          <template #error>
            <slot name="error"></slot>
          </template>
        </Image>
      </div>
      <DrawRect :drawable="drawable" :drawMark="drawMark" />
      <ImgMarks
        v-if="loadStatus.success"
        :marks="marksFormat"
        :drawing="drawing"
        :focus="focus"
        :deleteable="deleteable"
        :location="location"
        :renderRecord="renderRecord"
        @resize="onMarkResize"
        @delete="onMarkDelete"
      />
      <Navigation
        v-if="navigation"
        :currentIndex="currentIndex"
        :images="images"
        :base="base"
        :token="token"
        @switch="switchIndex"
      />
    </div>
    <ToolBar
      v-if="toolbar"
      :fitMode="fitMode"
      :scaleFit="scaleFit"
      :imgRecord="imgRecord"
      @switchMode="onSwitchMode"
      @prev="onPrev"
      @next="onNext"
      @zoomOut="onZoomOut"
      @zoomIn="onZoomIn"
      @reset="onReset"
      ref="toolbar"
    />
    <Preload
      :base="base"
      :token="token"
      :preload="preload"
      :images="images"
      :currentIndex="currentIndex"
    />
  </div>
</template>

<script>
// TODO: 处理原始大小没获取到的bug、缩放功能、画图功能、框图的大小定位以及增删改focus、focus模式、可滚动
// 不限制边界
import Image from '../Image/index.vue';
import DrawRect from './DrawRect.vue';
import ImgMarks from './ImgMarks.vue';
import Navigation from './Navigation.vue';
import ToolBar from './ToolBar.vue';
import Preload from './Preload.vue';
const fitMode = {
  contain: 1,
  cover: 2,
};
export default {
  emits: ['resize', 'delete', 'load', 'drawEnd', 'zoom', 'error', 'switch'],
  provide() {
    return {
      getMarkStyle: this.getMarkStyle,
      getMarkLRTBWH: this.getMarkLRTBWH,
    };
  },
  components: {
    Image,
    DrawRect,
    ImgMarks,
    Navigation,
    ToolBar,
    Preload,
  },
  props: {
    base: { type: String, default: '' },
    token: { type: String, default: '' },
    fit: { type: String, default: 'contain' },
    loop: { type: Boolean, default: false },
    initialIndex: { type: Number, default: 0 },
    preload: { type: Array || Boolean, default: [0, 2] },
    // ---
    scaleMax: { type: Number, default: 15 },
    scaleMin: { type: Number, default: 1 },
    scaleStep: { type: Number, default: 1.2 },
    initialScale: { type: Number, default: 1 },
    // ---
    imageList: { type: Array, default: null },
    markList: { type: Array, default: null },
    // ---
    navigation: { type: Boolean, default: false },
    toolbar: { type: Boolean, default: false },
    keyboard: {
      type: Array,
      default: ['A', 'D', 'Space', 'Esc'],
    },
    fixed: { type: Boolean, default: false },
    // focus锁定缺陷位置|normal正常情况
    focus: { type: Boolean, default: false },
    drawable: { type: Boolean, default: false },
    deleteable: { type: Boolean, default: false },
    // focus模式
    image: { type: Object, default: null },
    mark: { type: Object, default: null },
  },
  data() {
    return {
      fitMode,
      loadStatus: {
        loading: false,
        failure: false,
        success: false,
      },
      // 当前查看的下标
      currentIndex: this.initialIndex,
      // 空格锁定的下标
      focusIndex: 0,
      drawing: false,
      drag: {
        dragPreX: 0,
        dragPreY: 0,
        active: false,
      },
      location: {
        translateX: 0,
        translateY: 0,
        curScale: this.initialScale,
      },
      imgRecord: {
        wrapW: 0,
        wrapH: 0,
        imgSizeW: 0,
        imgSizeH: 0,
        trueSrc: '',
      },
      // 绘图框的信息
      drawMark: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        active: false,
      },
      scaleFit: fitMode.contain,
      resizeTimer: null,
      marksFormat: [],
    };
  },
  computed: {
    URL() {
      const { current } = this;
      return current.url;
    },
    currentMarks() {
      const { current } = this;
      return current.marks || [];
    },
    images() {
      const { imageList, image } = this;
      // 支持两种模式
      if (imageList) {
        return imageList;
      }
      if (image) {
        return [image];
      }
      return [];
    },
    marks() {
      const { markList, mark, currentMarks } = this;
      if (markList) {
        return markList;
      }
      if (mark) {
        return [mark];
      }
      if (currentMarks) {
        return currentMarks;
      }
      return [];
    },
    wrapStyle() {
      let { translateX: tx, translateY: ty, curScale: scale } = this.location;
      const style = {
        transform: `translate(${tx}px,${ty}px) scale(${scale})`,
      };
      return style;
    },
    mouseActive() {
      const { drawing } = this;
      const { active } = this.drag;
      return drawing || active;
    },
    current() {
      const { images, currentIndex } = this;
      const item = images[currentIndex];
      return item || {};
    },
    renderRecord() {
      // 图片宽度和高度用于计算缺陷应该缩放的比例，实际拿到的可能是缩小后的，可能不准
      const { imgSizeW, imgSizeH, wrapW, wrapH } = this.imgRecord;
      if (!imgSizeW || !imgSizeH || !wrapW || !wrapH) {
        return null;
      }
      const { imgW, imgH } = this.current;
      // 如果传了宽高信息，则按实际的为准，用于压缩图片处理
      const trueImgW = imgW || imgSizeW;
      const trueImgH = imgH || imgSizeH;
      const rder = {
        // 初始显示时黑边大小
        TDEdge: 0,
        LREdge: 0,
        // 图片显示的宽高
        imgW: 0,
        imgH: 0,
        // 图片初始缩小比例，盒子/图片
        scale: 0,
        // object-fit为contain时的缩放值
        containScale: 0,
        trueImgW,
        trueImgH,
      };
      const art1 = trueImgH / trueImgW;
      const art2 = wrapH / wrapW;
      if (art1 > art2) {
        // 左右黑边
        rder.scale = this.toFixed(wrapH / trueImgH, 5);
        rder.imgH = wrapH;
        rder.imgW = Math.round(rder.imgH / art1);
        rder.LREdge = (wrapW - rder.imgW) / 2;
        rder.containScale = this.toFixed(wrapW / (rder.imgW - 1), 5);
      } else {
        // 上下黑边
        rder.scale = this.toFixed(wrapW / trueImgW, 5);
        rder.imgW = wrapW;
        rder.imgH = Math.round(rder.imgW * art1);
        rder.TDEdge = (wrapH - rder.imgH) / 2;
        rder.containScale = this.toFixed(wrapH / (rder.imgH - 1), 5);
      }
      return rder;
    },
  },
  watch: {
    // 用watch是因为resize的时候需要改变属性
    marks: {
      handler(marks) {
        this.marksFormat = marks.map((item) => {
          const { left, top, width, height, id } = item;
          const l = left;
          const t = top;
          const r = left + width;
          const b = top + height;
          const m = {
            id,
            storage: [l, t, r, b],
            left: l,
            top: t,
            right: r,
            bottom: b,
            target: item,
          };
          return m;
        });
      },
      immediate: true,
      deep: true,
    },
    URL: {
      handler() {
        this.loadStatus = {
          loading: true,
          failure: false,
          success: false,
        };
      },
      immediate: true,
    },
    drawable() {
      this.drawMark.active = false;
      this.drawing = false;
    },
    'location.curScale'(val) {
      if (val !== this.renderRecord.containScale) {
        this.scaleFit = fitMode.contain;
      }
    },
    currentIndex() {
      this.onReset();
    },
  },
  mounted() {
    window.addEventListener('keyup', this.handleKeyboard);
    window.addEventListener('resize', this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener('keyup', this.handleKeyboard);
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    zoomOut() {
      this.onZoomOut();
    },
    zoomIn() {
      this.onZoomIn();
    },
    onMarkDelete(params) {
      this.$emit('delete', params);
    },
    onMarkResize(params) {
      this.$emit('resize', params);
    },
    handleResize() {
      if (this.resizeTimer) {
        return;
      }
      this.resizeTimer = setTimeout(() => {
        this.freshWrapWH();
        this.resizeTimer = null;
      }, 100);
    },
    handleKeyboard(event) {
      const { code } = event;
      const { keyboard } = this;
      if (keyboard.includes('Space') && code === 'Space') {
        event.preventDefault();
      }
      if (keyboard.includes('Esc') && code === 'Escape') {
        event.preventDefault();
      }
      switch (code) {
        case 'Space':
          if (keyboard.includes('Space')) {
            this.focusMark();
          }
          break;
        case 'Escape':
          if (keyboard.includes('Esc')) {
            this.unFocusMark();
          }
          break;
        case 'KeyA':
          if (keyboard.includes('A')) {
            this.onPrev();
          }
          break;
        case 'KeyD':
          if (keyboard.includes('D')) {
            this.onNext();
          }
          break;
      }
    },
    // =======================标记物相关函数-start=======================
    getMarkStyle(item, color = 'lightblue') {
      if (this.focus) {
        this.focusMark();
      }
      // 将实际坐标转换成渲染坐标
      const { width, height, left, top } = this.getRenderMark(item);
      let { translateX: tx, translateY: ty, curScale: scale } = this.location;
      const { wrapW, wrapH } = this.imgRecord;
      const centerX = wrapW / 2;
      const centerY = wrapH / 2;
      const newLeft = centerX - scale * centerX + scale * left;
      const newTop = centerY - scale * centerY + scale * top;
      const style = {
        width: `${width * scale}px`,
        height: `${height * scale}px`,
        border: `2px solid ${color}`,
        left: `${newLeft}px`,
        top: `${newTop}px`,
        transform: `translate(${tx}px,${ty}px)`,
      };
      return style;
    },
    getRenderMark(item) {
      let { left, top, width, height } = this.getMarkLRTBWH(item);
      const { scale, TDEdge, LREdge } = this.renderRecord || {};
      width = width * scale;
      height = height * scale;
      left = left * scale + LREdge;
      top = top * scale + TDEdge;
      return { left, top, width, height };
    },
    // =======================标记物相关函数-start=======================

    // =======================工具函数-start=======================
    toFixed(number, degree) {
      // 保留degree位小数
      const factor = Math.pow(10, degree);
      return Math.round(number * factor) / factor;
    },
    limitBoundary(value, dir) {
      value = this.toFixed(value, 2);
      const { wrapW, wrapH } = this.imgRecord;
      const { curScale } = this.location;
      // 横向溢出的像素，既是允许移动的边界
      let limit = 0;
      if (dir === 'horizontal') {
        limit = (wrapW * (curScale - 1)) / 2;
      }
      if (dir === 'vertical') {
        limit = (wrapH * (curScale - 1)) / 2;
      }
      limit = Math.abs(limit);
      value = Math.max(-limit, value);
      value = Math.min(limit, value);
      return value;
    },
    getMarkLRTBWH(item) {
      const { left: l, right: r, top: t, bottom: b } = item;
      const left = Math.floor(Math.min(l, r));
      const top = Math.floor(Math.min(t, b));
      const right = Math.floor(Math.max(l, r));
      const bottom = Math.floor(Math.max(t, b));
      const width = right - left;
      const height = bottom - top;
      return { left, top, right, bottom, width, height };
    },
    // =======================工具函数-end=======================
    // =======================缺陷锁定功能-start=======================
    unFocusMark() {
      this.onReset();
    },
    focusMark(index) {
      if (!this.loadStatus.success) {
        return;
      }
      if (index !== undefined) {
        this.focusIndex = index;
      }
      const focusItem = this.marksFormat[this.focusIndex] || null;
      if (!focusItem || !this.renderRecord) {
        return;
      }
      // 记录当前激活项的位置
      if (this.focusIndex >= this.marksFormat.length - 1) {
        this.focusIndex = 0;
      } else {
        this.focusIndex++;
      }
      const { width, height, left, top } = this.getRenderMark(focusItem);
      const { wrapW, wrapH } = this.imgRecord;
      const { imgW, imgH, TDEdge, LREdge } = this.renderRecord;
      const wrapRatio = wrapH / wrapW;
      // 比较宽的盒子
      let layerX = left + width / 2;
      let layerY = top + height / 2;
      let scale = 0;
      if (height / width < wrapRatio) {
        let x = left;
        let y = top - (width * wrapRatio - height) / 2;
        if (width * 1.1 < imgW) {
          scale = wrapW / (width * 1.1);
          x = left - width * 0.05;
          y = top - wrapRatio * width * 0.05;
        } else {
          scale = wrapW / width;
        }
        if (x < LREdge) {
          layerX = layerX - x + LREdge;
        }
        if (y < TDEdge) {
          layerY = layerY - y + TDEdge;
        }
      } else {
        // 外扩不会超界，可以外扩，否则不能外扩
        let x = left - (height / wrapRatio - width) / 2;
        let y = top;
        if (height * 1.1 < imgH) {
          scale = wrapH / (height * 1.1);
          x = x - (height * 0.05) / wrapRatio;
          y = y - height * 0.05;
        } else {
          scale = wrapH / height;
        }
        if (x < LREdge) {
          layerX = layerX - x + LREdge;
        }
        if (y < TDEdge) {
          layerY = layerY - y + TDEdge;
        }
      }
      scale = Math.min(scale, this.scaleMax);
      this.centerScale(layerX, layerY, scale);
    },
    centerScale(x, y, scale) {
      const { wrapW, wrapH } = this.imgRecord;
      const wrapCenterX = wrapW / 2;
      const wrapCenterY = wrapH / 2;
      let TX = wrapCenterX - x;
      let TY = wrapCenterY - y;
      TX = TX * scale;
      TY = TY * scale;
      this.location.curScale = scale;
      this.location.translateX = this.limitBoundary(TX, 'horizontal');
      this.location.translateY = this.limitBoundary(TY, 'vertical');
    },
    // =======================缺陷锁定功能-end=======================
    // =======================标记功能-start=======================
    onDrawStart(event) {
      event.preventDefault();
      const { drawable, focus } = this;
      const { which } = event;
      // 距容器左上角的坐标
      if (which != 3 || !drawable || focus) {
        return;
      }
      const { trueImgW: imgW, trueImgH: imgH } = this.renderRecord;
      const { layerX, layerY } = event;
      // 转换为相对图片左上角的坐标
      const { x, y } = this.convertCoords(layerX, layerY);
      // 起点在图片之外
      if (x < 0 || x > imgW || y < 0 || y > imgH) {
        return;
      }
      this.drawMark = {
        left: x,
        right: x,
        top: y,
        bottom: y,
        active: true,
      };
      this.drawing = true;
    },
    onDrawMove(event) {
      if (!this.drawing) {
        return;
      }
      const { trueImgW: imgW, trueImgH: imgH } = this.renderRecord;
      // 相对主容器左上角的位置
      const { layerX, layerY } = event;
      const { x, y } = this.convertCoords(layerX, layerY);
      if (x < 0 || x > imgW || y < 0 || y > imgH) {
        return;
      }
      this.drawMark.right = x;
      this.drawMark.bottom = y;
    },
    onDrawEnd(event) {
      event.preventDefault();
      if (!this.drawing) {
        return;
      }
      this.drawing = false;
      const mark = this.getMarkLRTBWH(this.drawMark);
      this.$emit('drawEnd', mark);
      this.clearDraw();
    },
    clearDraw() {
      this.drawMark.active = false;
      this.drawing = false;
    },
    convertCoords(lx, ly) {
      const { wrapW, wrapH } = this.imgRecord;
      const { scale, TDEdge, LREdge } = this.renderRecord;
      const { translateX: tx, translateY: ty, curScale } = this.location;
      const leftOpsImgBox =
        (wrapW * (curScale - 1)) / 2 - tx + lx - LREdge * curScale;
      const topOpsImgBox =
        (wrapH * (curScale - 1)) / 2 - ty + ly - TDEdge * curScale;
      const left = leftOpsImgBox / curScale / scale;
      const top = topOpsImgBox / curScale / scale;
      return {
        x: left,
        y: top,
      };
    },
    // =======================标记功能-end=======================
    // =======================拖拽功能-start=======================
    onMousedown(event) {
      event.preventDefault();
      if (this.fixed || this.focus) {
        return;
      }
      const { which, layerX, layerY } = event;
      // 左键移动图片
      if (which != 1) {
        return;
      }
      this.drag.dragPreX = layerX;
      this.drag.dragPreY = layerY;
      this.drag.active = true;
    },
    onMousemove(event) {
      const { active, dragPreX, dragPreY } = this.drag;
      if (!active) {
        return;
      }
      const { layerX, layerY } = event;
      const { translateX, translateY } = this.location;
      // 相对鼠标上一个位置的移动量
      let TX = layerX - dragPreX;
      let TY = layerY - dragPreY;
      // 更新上一次位置，才能准确计算下一次的移动量
      this.drag.dragPreX = layerX;
      this.drag.dragPreY = layerY;
      // 累加拖动量
      TX = translateX + TX;
      TY = translateY + TY;
      // 更新偏移量
      this.location.translateX = this.limitBoundary(TX, 'horizontal');
      this.location.translateY = this.limitBoundary(TY, 'vertical');
    },
    onMouseup(event) {
      this.drag.active = false;
    },

    onMouseleave(event) {
      this.drag.active = false;
    },
    // =======================拖拽功能-end=======================
    // =======================工具栏功能-start=======================
    toggleFit() {
      this.onSwitchMode();
    },
    prev() {
      this.onPrev();
    },
    next() {
      this.onNext();
    },
    reset() {
      this.onReset();
    },
    download() {
      this.$refs.toolbar.download();
    },
    onSwitchMode() {
      this.location.translateX = 0;
      this.location.translateY = 0;
      if (this.scaleFit === fitMode.contain) {
        this.scaleFit = fitMode.cover;
        if (this.renderRecord) {
          this.location.curScale = this.renderRecord.containScale;
        }
      } else {
        this.location.curScale = this.initialScale;
        this.scaleFit = fitMode.contain;
      }
    },
    onPrev() {
      this.switchIndex(this.currentIndex - 1);
    },
    onNext() {
      this.switchIndex(this.currentIndex + 1);
    },
    onZoomIn() {
      const scale = this.handleZoom(1);
      const { wrapW, wrapH } = this.imgRecord;
      this.flollowTheMouse(wrapW / 2, wrapH / 2, scale);
    },
    onZoomOut() {
      const scale = this.handleZoom(-1);
      const { wrapW, wrapH } = this.imgRecord;
      this.flollowTheMouse(wrapW / 2, wrapH / 2, scale);
    },
    onReset() {
      this.location.translateX = 0;
      this.location.translateY = 0;
      this.location.curScale = this.initialScale;
      this.scaleFit = fitMode.contain;
      this.focusIndex = 0;
      this.drawMark.active = false;
    },
    switchIndex(index) {
      const { images } = this;
      const len = images.length - 1;
      if (this.loop) {
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
      this.currentIndex = index;
    },
    // =======================工具栏功能-end=======================
    // =======================放大缩小功能-start=======================
    flollowTheMouse(x, y, scale) {
      const { wrapW, wrapH } = this.imgRecord;
      const { translateX, translateY, curScale: preScale } = this.location;
      // 图片移动后的中心点
      const wrapCenterX = wrapW / 2 + translateX;
      const wrapCenterY = wrapH / 2 + translateY;
      // 鼠标位置距离实际中心点的距离
      let TX = wrapCenterX - x;
      let TY = wrapCenterY - y;
      // 放大之后距离也会成倍放大，先回归原始像素
      // 此步计算后，TX和TY表示最原始状态下两点之间的像素距离
      TX = TX / preScale;
      TY = TY / preScale;
      // 由于放大导致的偏移，此步是修正[此次]缩放带来的偏移量
      TX = TX * (scale - preScale);
      TY = TY * (scale - preScale);
      // 原来的偏移加上[此次]修正量等于实际需要偏移量
      TX = translateX + TX;
      TY = translateY + TY;
      this.location.curScale = scale;
      this.location.translateX = this.limitBoundary(TX, 'horizontal');
      this.location.translateY = this.limitBoundary(TY, 'vertical');
    },
    handleZoom(dir) {
      const { scaleMax, scaleMin, scaleStep } = this;
      // 指数缩放
      let scaleNow = this.location.curScale;
      if (dir > 0) {
        scaleNow = scaleNow * scaleStep;
      } else {
        scaleNow = scaleNow / scaleStep;
      }
      scaleNow = Math.min(scaleNow, scaleMax);
      scaleNow = Math.max(scaleNow, scaleMin);
      scaleNow = this.toFixed(scaleNow, 3);
      this.$emit('zoom', scaleNow);
      return Number(scaleNow);
    },
    onWheel(event) {
      // 没加载完
      if (!this.loadStatus.success) {
        return;
      }
      if (this.fixed || this.focus) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      const { wheelDelta, layerX, layerY } = event;
      let scale = this.location.curScale;
      if (wheelDelta > 0) {
        scale = this.handleZoom(1);
      } else {
        scale = this.handleZoom(-1);
      }
      this.flollowTheMouse(layerX, layerY, scale);
    },
    // =======================放大缩小功能-end=======================
    // =======================初始化功能-start=======================
    onLoad(event) {
      const { naturalWidth, naturalHeight, src } = event.target;
      this.loadStatus = {
        loading: false,
        failure: false,
        success: true,
      };
      this.imgRecord.imgSizeW = naturalWidth;
      this.imgRecord.imgSizeH = naturalHeight;
      this.imgRecord.trueSrc = src;
      // 如果外层盒子没有设置height
      // 不加nextTick获取的高度可能不对
      this.$nextTick(() => {
        this.freshWrapWH();
        this.imageLoaded();
      });
      this.$emit('load', event);
    },
    onError(event) {
      this.loadStatus = {
        loading: false,
        failure: true,
        success: false,
      };
      this.$emit('error', event);
    },
    freshWrapWH() {
      const wrap = this.$refs.clipper;
      if (wrap) {
        const { clientWidth, clientHeight } = wrap;
        this.imgRecord.wrapW = clientWidth;
        this.imgRecord.wrapH = clientHeight;
      } else {
        console.error('DOM not found');
      }
    },
    imageLoaded() {
      if (this.focus) {
        this.focusMark();
      }
    },
    // =======================初始化功能-end=======================
  },
};
</script>
<style lang="less" scoped>
.v3iv-viewer-clip {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  background-color: black;
}
.v3iv-viewer-img-wrap {
  width: 100%;
  height: 100%;
}
.v3iv-mousedown {
  .v3iv-navigation-item {
    pointer-events: none;
  }
  &:deep(.v3iv-mark-delete) {
    pointer-events: none !important;
  }
  &:deep(.v3iv-drag-anchor) {
    pointer-events: none !important;
  }
  &:deep(.v3iv-drag-border) {
    pointer-events: none !important;
  }
}
.v3iv-viewer {
  width: 100%;
  height: 100%;
  position: relative;
}
.v3iv-has-toolbar {
  .v3iv-viewer-clip {
    width: 100%;
    height: calc(100% - 50px);
    overflow: hidden;
    background-color: black;
  }
}
</style>
