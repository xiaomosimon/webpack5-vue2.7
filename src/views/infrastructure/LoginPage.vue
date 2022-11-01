<template>
  <div id="components-form-demo-normal-login">
    <a-form-model ref="LoginForm" class="login-form" :model="form" :rules="rules">
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
        <a-checkbox>Remember me</a-checkbox>
        <a class="login-form-forgot" href="">
          Forgot password
        </a>
        <a-button class="login-form-button" type="primary" @click="login">登录</a-button>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { FormModel, message } from 'ant-design-vue';
import { useRouter } from 'vue-router/composables';

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
  LoginForm.value?.validate(valid => {
    if (valid) {
      if (form.value.username === 'admin' && form.value.password === '666666') {
        router.replace('/');
      } else {
        message.error('登录失败');
      }
    }
  });
}
</script>

<style lang="less">
#components-form-demo-normal-login {
  margin: 300px auto;
  display: flex;
  justify-content: center;

  .login-form {
    max-width: 300px;
  }

  .login-form-forgot {
    float: right;
  }

  .login-form-button {
    width: 100%;
  }
}
</style>
