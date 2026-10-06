<script setup>
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { login, register } from '@/api/auth'
import { saveAuth } from '@/utils/auth'

const route = useRoute()
const router = useRouter()

const mode = ref('login')
const loading = ref(false)

const form = reactive({
  username: '',
  password: '',
  confirmPassword: '',
  phone: '',
})

function switchMode(m) {
  mode.value = m
}

// 登录/注册成功后按角色分流：管理员进后台，普通用户进用户首页
function afterLoginTarget(user) {
  if (user && user.role === 'ADMIN') return '/admin'
  const redirect = route.query.redirect
  if (typeof redirect === 'string' && redirect.startsWith('/') && redirect !== '/login') {
    return redirect
  }
  return '/'
}

async function onSubmit() {
  if (!form.username || !form.password) {
    ElMessage.warning('请输入用户名和密码')
    return
  }
  if (mode.value === 'register') {
    if (form.password !== form.confirmPassword) {
      ElMessage.warning('两次输入的密码不一致')
      return
    }
    if (!form.phone) {
      ElMessage.warning('请输入手机号')
      return
    }
  }
  loading.value = true
  try {
    if (mode.value === 'login') {
      const data = await login({ username: form.username, password: form.password })
      saveAuth(data)
      ElMessage.success('登录成功')
      router.push(afterLoginTarget(data && data.user))
    } else {
      await register({ username: form.username, password: form.password, phone: form.phone })
      const data = await login({ username: form.username, password: form.password })
      saveAuth(data)
      ElMessage.success('注册成功，已自动登录')
      router.push(afterLoginTarget(data && data.user))
    }
  } catch (e) {
    // 错误已由请求层提示
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-card">
      <h2 class="title">影院售票系统</h2>
      <el-tabs v-model="mode" stretch>
        <el-tab-pane label="登录" name="login" />
        <el-tab-pane label="注册" name="register" />
      </el-tabs>

      <el-form label-position="top" @submit.prevent="onSubmit">
        <el-form-item label="用户名">
          <el-input v-model="form.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password" type="password" show-password placeholder="请输入密码" />
        </el-form-item>
        <el-form-item v-if="mode === 'register'" label="确认密码">
          <el-input v-model="form.confirmPassword" type="password" show-password placeholder="请再次输入密码" />
        </el-form-item>
        <el-form-item v-if="mode === 'register'" label="手机号">
          <el-input v-model="form.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-button type="primary" :loading="loading" class="submit" @click="onSubmit">
          {{ mode === 'login' ? '登 录' : '注 册' }}
        </el-button>
      </el-form>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #2b2d42 0%, #e5484d 100%);
}
.login-card {
  width: 380px;
  background: #fff;
  border-radius: 10px;
  padding: 32px;
}
.title {
  text-align: center;
  margin: 0 0 16px;
}
.submit {
  width: 100%;
}
</style>

