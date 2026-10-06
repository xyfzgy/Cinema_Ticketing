<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { listMovies } from '@/api/movie'
import { getUser, isLoggedIn } from '@/utils/auth'

const router = useRouter()
const records = ref([])
const total = ref(0)
const current = ref(1)
const size = ref(12)
const keyword = ref('')
const loading = ref(false)

const loggedIn = computed(() => isLoggedIn())
const user = computed(() => getUser())

const statusText = { SHOWING: '热映中', COMING_SOON: '即将上映', OFFLINE: '已下架' }

async function load() {
  loading.value = true
  try {
    const data = await listMovies({
      keyword: keyword.value || undefined,
      current: current.value,
      size: size.value,
    })
    records.value = data.records || []
    total.value = data.total || 0
  } catch (e) {
    // 已提示
  } finally {
    loading.value = false
  }
}

function search() {
  current.value = 1
  load()
}

function goDetail(movie) {
  router.push(`/movies/${movie.id}`)
}

function posterStyle(movie) {
  if (movie.poster) {
    return { backgroundImage: `url(${movie.poster})` }
  }
  return {}
}

onMounted(load)
</script>

<template>
  <div class="page">
    <!-- 用户首页：登录后展示专属功能入口，未登录提示登录 -->
    <div v-if="loggedIn" class="welcome">
      <div class="welcome-text">
        你好，<b>{{ user ? user.username : '' }}</b>，欢迎回来
      </div>
      <div class="quick-actions">
        <el-button type="primary" @click="router.push('/screenings')">选场次</el-button>
        <el-button @click="router.push('/orders')">我的订单</el-button>
        <el-button @click="router.push('/ai')">AI 客服</el-button>
        <el-button @click="router.push('/profile')">个人中心</el-button>
      </div>
    </div>
    <div v-else class="welcome guest">
      <div class="welcome-text">欢迎来到影院售票系统，登录后即可选座购票</div>
      <div class="quick-actions">
        <el-button type="primary" @click="router.push('/login')">登录 / 注册</el-button>
      </div>
    </div>

    <div class="toolbar">
      <h2 class="page-title">正在热映</h2>
      <el-input
        v-model="keyword"
        placeholder="搜索电影"
        clearable
        class="search"
        @keyup.enter="search"
        @clear="search"
      >
        <template #append>
          <el-button @click="search">搜索</el-button>
        </template>
      </el-input>
    </div>

    <div v-loading="loading" class="card-grid">
      <el-card v-for="movie in records" :key="movie.id" class="movie-card" shadow="hover" @click="goDetail(movie)">
        <div class="poster" :style="posterStyle(movie)">
          <span v-if="!movie.poster">{{ movie.title }}</span>
        </div>
        <div class="info">
          <div class="movie-title">{{ movie.title }}</div>
          <div class="meta">
            <el-tag v-if="movie.rating" size="small" type="warning">{{ movie.rating }} 分</el-tag>
            <el-tag size="small">{{ movie.duration }} 分钟</el-tag>
            <el-tag size="small" type="success">{{ statusText[movie.status] || movie.status }}</el-tag>
          </div>
        </div>
      </el-card>
    </div>

    <el-empty v-if="!loading && records.length === 0" description="暂无电影" />

    <div class="pager">
      <el-pagination
        v-if="total > 0"
        background
        layout="prev, pager, next"
        :total="total"
        :current-page="current"
        :page-size="size"
        @current-change="(p) => { current = p; load() }"
      />
    </div>
  </div>
</template>

<style scoped>
.welcome {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  background: linear-gradient(90deg, #e5484d 0%, #f0787c 100%);
  color: #fff;
  border-radius: 10px;
  padding: 18px 24px;
  margin-bottom: 20px;
}
.welcome.guest {
  background: linear-gradient(90deg, #2b2d42 0%, #4a4e69 100%);
}
.welcome-text {
  font-size: 16px;
}
.quick-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.search {
  width: 320px;
}
.movie-card {
  cursor: pointer;
}
.poster {
  height: 260px;
  background-color: #f0f0f0;
  background-size: cover;
  background-position: center;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #909399;
  font-weight: 600;
}
.info {
  margin-top: 12px;
}
.movie-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
}
.meta {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
.pager {
  margin-top: 24px;
  display: flex;
  justify-content: center;
}
</style>

