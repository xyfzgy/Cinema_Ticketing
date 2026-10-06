<script setup>
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const activeMenu = route.path.startsWith('/admin/movies') ? '/admin/movies' : route.path.startsWith('/admin/schedules') ? '/admin/schedules' : route.path.startsWith('/admin/seckill') ? '/admin/seckill' : '/admin'

function onSelect(key) {
  router.push(key)
}
</script>

<template>
  <el-container class="admin">
    <el-aside width="220px" class="aside">
      <div class="logo" @click="router.push('/')">影院后台</div>
      <el-menu :default-active="activeMenu" @select="onSelect">
        <el-menu-item index="/admin">统计概览</el-menu-item>
        <el-menu-item index="/admin/movies">电影管理</el-menu-item>
        <el-menu-item index="/admin/schedules">排片管理</el-menu-item>
        <el-menu-item index="/admin/seckill">秒杀活动</el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="header">
        <span>管理后台</span>
        <el-button text @click="router.push('/')">返回前台</el-button>
      </el-header>
      <el-main>
        <RouterView />
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
.admin {
  min-height: 100vh;
}
.aside {
  background: #001529;
}
.logo {
  color: #fff;
  font-size: 18px;
  font-weight: 700;
  padding: 20px 24px;
  cursor: pointer;
}
.aside :deep(.el-menu) {
  background: #001529;
  border-right: none;
}
.aside :deep(.el-menu-item) {
  color: #c0c4cc;
}
.aside :deep(.el-menu-item.is-active) {
  color: #fff;
  background: #e5484d;
}
.aside :deep(.el-menu-item:hover) {
  background: #1a2a3a;
}
.header {
  background: #fff;
  border-bottom: 1px solid #ebeef5;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
