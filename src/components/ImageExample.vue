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
        lazy
      >
        <template #footer>footer</template>
        <template #loading>LOADING</template>
        <template #error>ERROR</template>
      </Image>
    </div>
    <div @click="changeLink"><button>改变链接</button></div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import Image from '../packages/Image/index.vue';
// import { Image } from 'vue3-image-viewer'
const images = reactive([
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
  {
    title: 'title',
    desc: 'desc',
    url: undefined,
  },
]);
function changeLink() {
  images[0].url =
    'https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg';
}
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
