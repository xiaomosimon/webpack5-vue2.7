<template>
  <div>
    <h1>Home</h1>
    <TestCom />
    <TestView />
    <Button :text="text" />
  </div>
</template>
<script lang="ts" setup>
import Button from '@/components/TFButton.vue';
import {ref} from 'vue';
import TestView  from './TestView';
import TestCom from './TestCom';

const text = ref<string>('提交123');
</script>
