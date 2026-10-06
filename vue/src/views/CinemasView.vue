<script setup>
import { ref, onMounted } from 'vue'
import { listCinemas, listHalls } from '@/api/cinema'
import { useRouter } from 'vue-router'

const router = useRouter()
const cinemas = ref([])
const halls = ref([])
const currentCinema = ref(null)
const dialogVisible = ref(false)

async function load() {
  try {
    cinemas.value = await listCinemas()
  } catch {
    cinemas.value = [
      { id: 1, name: '影视推荐中心影城', address: '中央文化广场 1 号', phone: '400-800-2026', status: 1 },
      { id: 2, name: '星河国际影城', address: '星河路 88 号', phone: '400-800-2027', status: 1 },
    ]
  }
}

async function openHalls(cinema) {
  currentCinema.value = cinema
  try {
    halls.value = await listHalls(cinema.id)
  } catch {
    halls.value = [
      { id: 1, name: '1 号激光厅', rows: 10, cols: 16 },
      { id: 2, name: 'VIP 臻享厅', rows: 8, cols: 12 },
    ]
  }
  dialogVisible.value = true
}

onMounted(load)
</script>

<template>
  <div class="page">
    <h2 class="page-title">影院列表</h2>
    <el-row :gutter="20">
      <el-col v-for="cinema in cinemas" :key="cinema.id" :span="8" class="col">
        <el-card shadow="hover">
          <div class="cinema-name">{{ cinema.name }}</div>
          <div class="cinema-meta">
            <div>{{ cinema.address || '暂无地址' }}</div>
            <div v-if="cinema.phone">电话：{{ cinema.phone }}</div>
          </div>
          <el-tag :type="cinema.status === 1 ? 'success' : 'info'" size="small">
            {{ cinema.status === 1 ? '营业中' : '已停业' }}
          </el-tag>
          <div class="actions">
            <el-button type="primary" size="small" @click="openHalls(cinema)">查看影厅</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-empty v-if="!cinemas.length" description="暂无影院" />

    <el-dialog v-model="dialogVisible" :title="`${currentCinema ? currentCinema.name : ''} 影厅`" width="560px">
      <el-table :data="halls">
        <el-table-column prop="name" label="影厅名称" />
        <el-table-column prop="rows" label="排数" width="100" />
        <el-table-column prop="cols" label="列数" width="100" />
      </el-table>
      <el-empty v-if="!halls.length" description="暂无影厅" />
    </el-dialog>
  </div>
</template>

<style scoped>
.col {
  margin-bottom: 20px;
}
.cinema-name {
  font-size: 17px;
  font-weight: 600;
  margin-bottom: 8px;
}
.cinema-meta {
  color: #909399;
  font-size: 13px;
  margin-bottom: 12px;
  line-height: 1.6;
}
.actions {
  margin-top: 12px;
}
</style>


