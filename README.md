### 安装/Installation

`npm i vue3-image-viewer`
或者/or
`yarn add vue3-image-viewer`

### 引入/Import

```js
import { Image } from 'vue3-image-viewer';
```

### 效果预览/Preview

![图片列表](https://github.com/zhoulhcn/vue3-image-viewer/blob/static/docs/15037371-4cf616068fe1198e.png?raw=true)
![图片预览](https://github.com/zhoulhcn/vue3-image-viewer/blob/static/docs/15037371-737fc352d5f16d14.png?raw=true)
![绘图](https://github.com/zhoulhcn/vue3-image-viewer/blob/static/docs/15037371-77c7ca4bd2dfc388.png?raw=true)
![调整大小](https://github.com/zhoulhcn/vue3-image-viewer/blob/static/docs/15037371-11e9889fd86bcb0d.png?raw=true)

### 使用示例/Example

```js
<template>
  <div class="image">
    <div class="item" v-for="(item, index) in images" :key="item.url">
      <Image
        width="270px"
        height="300px"
        :src="item.url"
        preview
        :images="images"
        :initialIndex="index"
      >
        <template #footer>footer</template>
        <template #loading>LOADING</template>
        <template #error>ERROR</template>
      </Image>
    </div>
  </div>
</template>

<script setup>
import { Image } from 'vue3-image-viewer'
import 'vue3-image-viewer/dist/style.css'
const images = [
  {
    title: 'title',
    desc: 'desc',
    url: 'http://iph.href.lu/800x540',
  },
  {
    title: 'title',
    desc: 'desc',
    url: 'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg',
  },
  {
    title: 'title',
    desc: 'desc',
    url: 'https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg',
  },
  {
    title: 'title',
    desc: 'desc',
    url: '',
  },
];
</script>

<style lang="less" scoped>
.image {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: space-between;
  width: 1200px;
  margin: 0 auto;
}
</style>
```

```js
<template>
  <div class="viewer">
    <div class="viewer-wrap">
      <!-- 如果传入了markList则不取images中的marks -->
      <Viewer
        ref="viewerRef"
        :imageList="images"
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
import { Viewer } from 'vue3-image-viewer'
import 'vue3-image-viewer/dist/style.css'
import { reactive, ref, computed, unref } from 'vue';
const images = reactive([
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
const current = computed(() => images[currentIndex.value]);
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
```

---

## Image 组件说明

### 传参/Props

| 参数             |                                                                                               说明 |             类型 |  默认值 |
| ---------------- | -------------------------------------------------------------------------------------------------: | ---------------: | ------: |
| base             |                                                                                           地址前缀 |           string |      "" |
| src              |                                                                                           图片地址 |           string |      "" |
| token            |                                                                                         token 参数 |           string |      "" |
| aspectRatio      |                                                                                         固定宽高比 |           number |       0 |
| fit              |                                      [object-fit](https:/www.runoob.com/cssref/pr-object-fit.html) |           string |  "fill" |
| lazy             |                                                                                             懒加载 |          boolean |   false |
| hideOnClickModal |                                                                                   点击遮罩关闭预览 |          boolean |   false |
| initialIndex     |                                                                                 在预览数组中的位置 |           number |       0 |
| preview          |                                                                                       是否开启预览 |          boolean |   false |
| images           |                                                                                           预览列表 |            array |      [] |
| loop             |                                                                                           开启循环 |          boolean |   false |
| preload          |                                                                                         预览预加载 | array or boolean |   [0,2] |
| width            |                                                                                           盒子宽度 |           string |      "" |
| height           |                                                                                           盒子高度 |           string |      "" |
| alt              |                                                [alt](https://www.runoob.com/tags/att-img-alt.html) |           string |      "" |
| referrerPolicy   | [referrerPolicy](https://developer.mozilla.org/zh-CNdocs/Web/API/HTMLImageElement/referrerPolicy) |           string |      "" |
| bgColor          |                                                                                           背景颜色 |           string | "black" |

### 参数说明/Props Explanation

- src: 如果 src 是绝对地址，则 base, token 不生效，如果是相对地址，返回 base+src+?token="abc"
- width&height: 可以设置固定 px 值或者百分比值，等同于原生 css 属性
- aspectRatio: 如果设置了 aspectRatio，则高度由宽度和 aspectRatio 决定，height 不再生效
- preload: 如果设置为 false 则关闭预加载，如果设置为[1,2]，则在查看当前图片的同时会同时加载左边 1 张右边 2 张图片

### 组件事件/Event

- error: 图片加载出错事件/ Same as native error
- load: 图片加载完成事件/ Same as native load
- close: 关闭预览事件 / Emit when close the preview
- switch: 切换预览图片事件，返回下标 / Emit when switch the preview, return current index

### 支持插槽/Slot

- error:加载出错占位/ Triggers when image load failed
- loading:加载中占位/ Triggers when image is loading
- footer:图片底部占位/ Placeholder on the bottom

---

## Viewer 组件说明

### 传参/Props

| 参数         |                                                          说明 |             类型 |     默认值 |
| ------------ | ------------------------------------------------------------: | ---------------: | ---------: |
| base         |                                                      地址前缀 |           string |         "" |
| token        |                                                    token 参数 |           string |         "" |
| scaleMax     |                                                  最大缩放倍数 |           number |         15 |
| scaleMin     |                                                  最小缩放倍数 |           number |          1 |
| scaleStep    |                                                      缩放步进 |           number |        1.1 |
| initialScale |                                                  初始缩放倍数 |           number |          1 |
| imageList    |                                                      图片列表 |            array |         [] |
| markList     |                                                    标记框列表 |            array |         [] |
| initialIndex |                                              初始展示图片下标 |           number |          0 |
| loop         |                                                      开启循环 |          boolean |          0 |
| navigation   |                                                    底部预览条 |          boolean |      false |
| toolbar      |                                                        工具栏 |          boolean |      false |
| keyboard     |                                                    开启快捷键 |            array | ['A', 'D'] |
| fit          | [object-fit](https:/www.runoob.com/cssref/pr-object-fit.html) |           string |  "contain" |
| preload      |                                                    图片预加载 | array or boolean |      [0,2] |
| fixed        |                                                      禁止缩放 |          boolean |      false |
| focus        |                                          锁定标记框的展示模式 |          boolean |      false |
| drawable     |                                              是否开启标记功能 |          boolean |      false |
| deleteable   |                                      是否显示移除标记框的按钮 |          boolean |      false |
| image        |                                                      单张图片 |           object |       null |
| mark         |                                                    单个标记框 |           object |       null |

### 参数说明/Props Explanation

- scaleStep: 按倍数缩进
- keyboard: 支持的快捷键有上一项: `A`，下一项: `D`，锁定标记框: `Space`，取消框图锁定: `Esc`
- imageList: 数据结构请参考示例代码，优先使用 imageList，其次使用 image
- markList: 数据结构请参考示例代码，标记框优先使用 markList，其次是 image 的 marks 字段，再次是 mark 字段
- focus: focus 模式下，不可缩放，锁定标记框，不可调整大小
- drawable: 开启绘制标记框的功能

### 组件事件/Event

- error: 图片加载出错事件/ Same as native error
- load: 图片加载完成事件/ Same as native load
- switch: 切换预览图片事件，返回下标 / Emit when switch the preview, return current index
- drawEnd: 绘制结束时的事件，返回标记框图的关键信息
- resize: 调整大小结束时的事件，返回 resize 的关键信息
- delete: 点击移除按钮时触发的事件，返回点击的对象
- zoom: 缩放时触发的事件，返回当前的缩放倍数

### 组件方法/Methods

- clearDraw: 清除绘制的标记框图
- switchIndex: 切换图片，传入图片下标值
- toggleFit: 切换 contain 和 cover 模式
- unFocusMark: 取消框图锁定
- focusMark: 锁定框图
- reset: 重置图片状态(缩放、移动等)
- download: 下载图片
- zoomOut: 放大
- zoomIn: 缩小
- prev: 上一张
- next: 下一张

### 支持插槽/Slot

- error: 加载出错占位/ Triggers when image load failed
- loading: 加载中占位/ Triggers when image is loading
- toolbar: 图片底部工具栏的占位

### 补充说明

### 联系我/Contact me

- QQ: 995413842
- 微信: zhoulh1994
- gmail: <meetzlh@gmail.com>
