<template>
  <a-card title="Card title">
    <h1 class="title">Dashboard Page</h1>
    <router-link to="/foo">Go to Foo</router-link>
    <a-button>我是另外个按钮</a-button>
  </a-card>
</template>
<script lang="ts" setup>
</script>
<style lang="less" scoped>
.title {
  color: red;
}
</style>