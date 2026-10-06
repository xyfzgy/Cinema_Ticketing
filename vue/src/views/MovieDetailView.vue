<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getMovie } from '@/api/movie'
import { listScreenings } from '@/api/screening'

const route = useRoute()
const router = useRouter()
const movie = ref(null)
const screenings = ref([])

const statusText = { SHOWING: '热映中', COMING_SOON: '即将上映', OFFLINE: '已下架' }

const myScreenings = computed(() =>
  screenings.value.filter(
    (s) => String(s.movieId) === String(movie.value.id) && s.status === 'ON_SALE',
  ),
)

async function load() {
  movie.value = await getMovie(route.params.id)
}

async function loadScreenings() {
  screenings.value = await listScreenings()
}

function goSeats(s) {
  router.push(`/screenings/${s.id}/seats`)
}

onMounted(() => {
  load()
  loadScreenings()
})
</script>

<template>
  <div v-if="movie" class="page">
    <el-card>
      <div class="detail">
        <div class="poster" :style="movie.poster ? { backgroundImage: `url(${movie.poster})` } : {}">
          <span v-if="!movie.poster">{{ movie.title }}</span>
        </div>
        <div class="content">
          <h2 class="movie-title">{{ movie.title }}</h2>
          <p class="meta">
            <el-tag v-if="movie.rating" type="warning">{{ movie.rating }} 分</el-tag>
            <el-tag>{{ movie.duration }} 分钟</el-tag>
            <el-tag type="success">{{ statusText[movie.status] || movie.status }}</el-tag>
            <span v-if="movie.releaseDate">上映日期：{{ movie.releaseDate }}</span>
          </p>
          <p class="synopsis">{{ movie.synopsis || '暂无简介' }}</p>
        </div>
      </div>
    </el-card>

    <h3 class="section-title">可售场次</h3>
    <el-table :data="myScreenings" v-if="myScreenings.length">
      <el-table-column prop="startTime" label="开场时间" width="220" />
      <el-table-column prop="endTime" label="散场时间" width="220" />
      <el-table-column prop="price" label="票价（元）" width="120" />
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="goSeats(row)">选座购票</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-empty v-else description="暂无场次" />
  </div>
</template>

<style scoped>
.detail {
  display: flex;
  gap: 24px;
}
.poster {
  width: 220px;
  height: 300px;
  flex-shrink: 0;
  background-color: #f0f0f0;
  background-size: cover;
  background-position: center;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #909399;
  font-weight: 600;
}
.content {
  flex: 1;
}
.movie-title {
  margin: 0 0 16px;
}
.meta {
  display: flex;
  gap: 8px;
  align-items: center;
  color: #909399;
  flex-wrap: wrap;
}
.synopsis {
  margin-top: 20px;
  line-height: 1.8;
  color: #606266;
}
.section-title {
  margin: 24px 0 16px;
}
</style>

