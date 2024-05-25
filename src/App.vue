<template>
  <div id="app">
    <ImageExample />
    <ViewerExample />
  </div>
</template>

<script setup>
import ImageExample from './components/ImageExample.vue';
import ViewerExample from './components/ViewerExample.vue';
</script>

<style lang="less" scoped>
#app {
  display: flex;
  flex-direction: column;
  gap: 30px;
  padding: 30px 0 50px 0;
}
</style>
