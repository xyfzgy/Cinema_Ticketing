<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getProfile, updateProfile } from '@/api/auth'
import { setUser } from '@/utils/auth'

const profile = ref(null)
const phone = ref('')
const loading = ref(false)

async function load() {
  profile.value = await getProfile()
  phone.value = profile.value.phone || ''
}

async function save() {
  loading.value = true
  try {
    const updated = await updateProfile(phone.value)
    setUser(updated)
    profile.value = updated
    ElMessage.success('保存成功')
  } catch (e) {
    // 已提示
  } finally {
    loading.value = false
  }
}

const roleText = { CUSTOMER: '普通用户', ADMIN: '管理员' }

onMounted(load)
</script>

<template>
  <div class="page">
    <el-card class="card">
      <template #header>
        <span class="title">个人中心</span>
      </template>
      <el-descriptions v-if="profile" :column="1" border>
        <el-descriptions-item label="用户名">{{ profile.username }}</el-descriptions-item>
        <el-descriptions-item label="角色">{{ roleText[profile.role] || profile.role }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          {{ profile.status === 1 ? '正常' : '禁用' }}
        </el-descriptions-item>
      </el-descriptions>

      <el-form label-width="80px" class="form">
        <el-form-item label="手机号">
          <el-input v-model="phone" placeholder="请输入手机号" style="width: 280px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="save">保存</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped>
.card {
  max-width: 520px;
}
.title {
  font-size: 16px;
  font-weight: 600;
}
.form {
  margin-top: 20px;
}
</style>

