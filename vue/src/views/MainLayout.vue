<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getUser, isLoggedIn, isAdmin, clearAuth } from '@/utils/auth'
import { logout } from '@/api/auth'

const router = useRouter()
const route = useRoute()
const user = computed(() => getUser())
const loggedIn = computed(() => isLoggedIn())
const admin = computed(() => isAdmin())

const activeMenu = computed(() => {
  if (route.path.startsWith('/screenings')) return '/screenings'
  if (route.path.startsWith('/orders')) return '/orders'
  if (route.path === '/seckill') return '/seckill'
  if (route.path === '/ranking') return '/ranking'
  if (['/personal', '/adminPersonal', '/historyOrders'].includes(route.path)) return ''
  if (route.path.startsWith('/ai')) return '/ai'
  return '/index'
})

function onSelect(key) {
  router.push(key)
}

async function onLogout() {
  try {
    await logout()
  } catch (e) {
    // 忽略登出接口错误，仍清理本地状态
  }
  clearAuth()
  router.push('/login')
}
</script>

<template>
  <div>
    <header class="topbar">
      <div class="topbar-inner">
        <div class="brand" @click="router.push('/index')">影视推荐平台</div>
        <el-menu
          mode="horizontal"
          :default-active="activeMenu"
          :ellipsis="false"
          class="nav-menu"
          @select="onSelect"
        >
          <el-menu-item index="/index">电影</el-menu-item>
          <el-menu-item index="/ranking">排行榜</el-menu-item>
          <el-menu-item index="/screenings">场次</el-menu-item>
          <el-menu-item index="/seckill">秒杀活动</el-menu-item>
        </el-menu>

        <div class="right">
          <template v-if="loggedIn">
            <el-button v-if="admin" text @click="router.push('/admin')">后台管理</el-button>
            <el-dropdown>
              <span class="user-name">{{ user ? user.username : '' }}</span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="router.push(admin ? '/adminPersonal' : '/personal')">个人中心</el-dropdown-item>
                  <el-dropdown-item @click="onLogout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
          <template v-else>
            <el-button type="primary" text @click="router.push('/login')">登录 / 注册</el-button>
          </template>
        </div>
      </div>
    </header>

    <RouterView />
    <button v-if="route.path !== '/customerService'" class="service-float" type="button" @click="router.push('/customerService')" aria-label="打开智能客服">
      <span>✦</span><em>智能客服</em>
    </button>
  </div>
</template>

<style scoped>
.topbar {
  background: #fff;
  border-bottom: 1px solid #ebeef5;
}
.topbar-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  padding: 0 16px;
  height: 60px;
  gap: 24px;
}
.brand {
  font-size: 20px;
  font-weight: 700;
  color: #667eea;
  cursor: pointer;
  white-space: nowrap;
}
.nav-menu {
  flex: 1;
  border-bottom: none;
}
.right {
  display: flex;
  align-items: center;
  gap: 8px;
}
.user-name {
  cursor: pointer;
  outline: none;
  color: #303133;
}
@media(max-width:750px){.topbar-inner{height:auto;min-height:60px;flex-wrap:wrap;gap:0}.brand{font-size:17px;margin-right:auto}.nav-menu{order:3;width:100%;overflow-x:auto}.nav-menu :deep(.el-menu-item){padding:0 12px;font-size:13px}.right{margin-left:auto}}
.service-float{position:fixed;right:24px;bottom:24px;z-index:20;display:flex;align-items:center;gap:8px;border:0;border-radius:999px;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;padding:12px 17px;box-shadow:0 10px 25px #31206b45;cursor:pointer}.service-float:hover{transform:translateY(-2px);box-shadow:0 13px 28px #31206b5c}.service-float span{font-size:18px}.service-float em{font-style:normal;font-size:13px}@media(max-width:600px){.service-float{right:15px;bottom:15px;padding:12px;border-radius:50%}.service-float em{display:none}}
</style>



