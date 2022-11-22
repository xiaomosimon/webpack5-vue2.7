<template>
  <div>
    <h1>404</h1>
    <a-button type="link" @click="backPage">返回</a-button>
  </div>
</template>
<script lang="ts" setup>
import { useRouter } from 'vue-router/composables';

const router = useRouter();

function backPage() {
  router.push({
    path: '/'
  });
}
</script>
