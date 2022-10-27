<template>
  <button>{{ props.text }}</button>
</template>
<script lang="ts" setup>
const props = defineProps<{ text: string }>();
defineExpose({
  test: '123'
});
</script>
