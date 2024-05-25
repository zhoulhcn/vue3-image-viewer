<template>
  <div class="viewer">
    <div class="viewer-wrap">
      <!-- 如果传入了markList则不取images中的marks -->
      <Viewer
        ref="viewerRef"
        :imageList="viewers"
        navigation
        toolbar
        drawable
        deleteable
        :scaleMin="1"
        @drawEnd="drawEnd"
        @resize="onResize"
        @delete="onDelete"
        @switch="onSwitch"
        :initialIndex="currentIndex"
      >
        <template #loading>LOADING</template>
        <template #error>ERROR</template>
      </Viewer>
      <!-- 自定义 -->
      <div class="tools">
        <div @click="toolBtn('fit')">适应窗口</div>
        <div @click="toolBtn('prev')">上一个</div>
        <div @click="toolBtn('next')">下一个</div>
        <div @click="toolBtn('reset')">重置</div>
      </div>
    </div>
    <div class="preview">
      <div class="item" v-for="(item, index) in current.marks" :key="index">
        <Viewer :image="current" :mark="item" focus>
          <template #loading>LOADING</template>
          <template #error>ERROR</template>
        </Viewer>
      </div>
    </div>
  </div>
</template>

<script setup>
import Viewer from '../packages/Viewer/index.vue';
// import { Viewer } from 'vue3-image-viewer'
import { reactive, ref, computed, unref } from 'vue';
const viewers = reactive([
  {
    title: 'title',
    desc: 'desc',
    url: 'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
    thumbnail:
      'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
    marks: [],
  },
  {
    title: 'title',
    desc: 'desc',
    url: 'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg',
    thumbnail:
      'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg',
    marks: [
      {
        width: 220,
        height: 220,
        left: 470,
        top: 230,
      },
    ],
  },
  {
    title: 'title',
    desc: 'desc',
    url: 'https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg',
    thumbnail:
      'https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg',
    marks: [
      {
        width: 80,
        height: 40,
        left: 320,
        top: 220,
      },
    ],
  },
  {
    title: 'title',
    desc: 'desc',
    url: '',
    thumbnail: '',
    marks: [],
  },
]);
const currentIndex = ref(1);
const current = computed(() => viewers[currentIndex.value]);
const viewerRef = ref(null);

function onSwitch(index) {
  currentIndex.value = index;
}
function onResize({ target, detail }) {
  const { left, top, width, height } = detail;
  const mark = { ...target };
  mark.left = left;
  mark.top = top;
  mark.width = width;
  mark.height = height;
  const idx = current.value.marks.indexOf(target);
  if (idx > -1) {
    current.value.marks.splice(idx, 1, mark);
  }
}
function onDelete({ target }) {
  const idx = current.value.marks.indexOf(target);
  if (idx > -1) {
    current.value.marks.splice(idx, 1);
  }
}
function drawEnd(item) {
  const { left, top, width, height } = item;
  if (!current.value.marks) {
    current.value.marks = [];
  }
  const newMark = {
    id: current.value.marks.length + 1 + '',
    left,
    top,
    width,
    height,
  };

  current.value.marks.unshift(newMark);
}
function toolBtn(type) {
  const viewer = unref(viewerRef);
  if (!viewer) {
    return;
  }
  if (type === 'fit') {
    viewer.toggleFit();
  }
  if (type === 'next') {
    viewer.next();
  }
  if (type === 'prev') {
    viewer.prev();
  }
  if (type === 'reset') {
    viewer.reset();
  }
}
</script>

<style lang="less" scoped>
.viewer {
  width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  .viewer-wrap {
    width: 1000px;
    height: 600px;
    .tools {
      display: flex;
      justify-content: center;
      gap: 10px;
      margin-top: 10px;
      div {
        border: 1px solid #ccc;
        border-radius: 4px;
        cursor: pointer;
        padding: 0 5px;
        font-size: 14px;
        line-height: 22px;
      }
    }
  }
  .preview {
    &::-webkit-scrollbar {
      display: none;
    }
    width: 200px;
    margin-left: 20px;
    height: 600px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 10px;
    .item {
      width: 100%;
      height: 150px;
    }
  }
}
</style>
