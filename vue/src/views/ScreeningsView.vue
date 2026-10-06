<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { listScreenings } from '@/api/screening'
import { listMovies } from '@/api/movie'

const router = useRouter()
const screenings = ref([])
const movies = ref([])
const movieId = ref(null)

const movieMap = computed(() => {
  const m = {}
  movies.value.forEach((mv) => (m[mv.id] = mv.name || mv.title))
  return m
})

const filtered = computed(() => {
  return screenings.value.filter((s) => {
    if (!(s.status === 1 || s.status === 'ON_SALE')) return false
    if (movieId.value && String(s.movieId) !== String(movieId.value)) return false
    return true
  })
})

async function load() {
  try {
    screenings.value = await listScreenings()
    const page = await listMovies({ current: 1, size: 100 })
    movies.value = page.records || []
  } catch {
    movies.value = [
      { id: 1, title: '肖申克的救赎' },
      { id: 2, title: '千与千寻' },
      { id: 3, title: '奥本海默' },
    ]
    screenings.value = [
      { id: 1, movieId: 1, hallId: 1, startTime: '今天 14:30', endTime: '今天 17:02', price: 40, status: 'ON_SALE' },
      { id: 2, movieId: 2, hallId: 2, startTime: '今天 16:10', endTime: '今天 18:05', price: 38, status: 'ON_SALE' },
      { id: 3, movieId: 3, hallId: 1, startTime: '今天 19:20', endTime: '今天 22:05', price: 48, status: 'ON_SALE' },
    ]
  }
}

function goSeats(s) {
  router.push(`/screenings/${s.id}/seats`)
}

onMounted(load)
</script>

<template>
  <div class="page">
    <h2 class="page-title">场次列表</h2>
    <div class="filters">
      <el-select v-model="movieId" placeholder="按电影筛选" clearable style="width: 240px">
        <el-option v-for="mv in movies" :key="mv.id" :label="mv.name || mv.title" :value="mv.id" />
      </el-select>
    </div>

    <el-table :data="filtered">
      <el-table-column label="电影" width="220">
        <template #default="{ row }">{{ movieMap[row.movieId] || ('# ' + row.movieId) }}</template>
      </el-table-column>
      <el-table-column label="影厅" width="120">
        <template #default="{ row }">{{ row.hallId }} 号厅</template>
      </el-table-column>
      <el-table-column prop="startTime" label="开场时间" width="200" />
      <el-table-column prop="endTime" label="散场时间" width="200" />
      <el-table-column label="票价（元）" width="120">
        <template #default="{ row }">{{ row.price }}</template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="goSeats(row)">选座购票</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-empty v-if="!filtered.length" description="暂无场次" />
  </div>
</template>

<style scoped>
.filters {
  margin-bottom: 16px;
  display: flex;
  gap: 12px;
}
</style>


