<template>
  <div class="h-screen flex flex-col justify-center items-center">
    <h2>Vue2.7管理后台模板</h2>
    <a-form-model ref="LoginForm" class="w-80" :model="form" :rules="rules">
      <a-form-model-item prop="username">
        <a-input v-model="form.username" placeholder="Username">
          <a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)" />
        </a-input>
      </a-form-model-item>
      <a-form-model-item prop="password">
        <a-input v-model="form.password" type="password" placeholder="Password">
          <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)" />
        </a-input>
      </a-form-model-item>
      <a-form-model-item>
        <a-button class="w-full" type="primary" @click="login">登录</a-button>
      </a-form-model-item>
      <p>账号:admin</p>
    </a-form-model>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { FormModel, message } from 'ant-design-vue';
import { useRouter } from 'vue-router/composables';
import { useUserStore } from '@/store/user';

const router = useRouter();

const form = ref<{
  username: string,
  password: string
}>({
  username: '',
  password: ''
});

const LoginForm = ref<FormModel | null>(null);

const rules = {
  username: [
    { required: true, message: 'Please input your username!', trigger: 'blur' },
    { min: 4, max: 16, message: 'Length should be 4 to 16' }
  ],
  password: [
    { required: true, message: 'Please input your Password!', trigger: 'blur' },
    { min: 6, max: 16, message: 'Length should be 6 to 16' }
  ]
};

function login() {
  LoginForm.value?.validate(async (valid) => {
    if (valid) {
      const userStore = useUserStore();
      const res = await userStore.fetchUserInfo(form.value);
      if (res.data.code === 0) {
        const { role } = userStore;
        if (role === 'shop') {
          router.replace('/dashboard');
        } else if (role) {
          router.replace('/mainDashboard');
        } else {
          message.error('无权限访问，请联系管理员');
        }
      }
    }
  });
}
</script>
