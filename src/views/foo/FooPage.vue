<template>
  <div>
    <h1 class="title">Foo Page</h1>
    <router-link to="/home">Back Home</router-link>
    <router-link to="/foo/edit">Go Edit</router-link>
    <a-button>我是一个按钮</a-button>
    <div>
      <a-radio-group default-value="a" button-style="solid">
        <a-radio-button value="a">
          Hangzhou
        </a-radio-button>
        <a-radio-button value="b">
          Shanghai
        </a-radio-button>
        <a-radio-button value="c">
          Beijing
        </a-radio-button>
        <a-radio-button value="d">
          Chengdu
        </a-radio-button>
      </a-radio-group>
    </div>
  </div>
</template>
<script lang="ts" setup>
</script>
<style scoped>
.title {
  color: lightgreen;
}
</style>
