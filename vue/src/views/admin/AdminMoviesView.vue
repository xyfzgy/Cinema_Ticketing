<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import {
  adminListMovies,
  adminCreateMovie,
  adminUpdateMovie,
  adminUpdateMovieStatus,
} from '@/api/movie'

const records = ref([])
const total = ref(0)
const current = ref(1)
const size = ref(10)
const keyword = ref('')
const statusFilter = ref('')
const loading = ref(false)

const dialogVisible = ref(false)
const saving = ref(false)
const isEdit = ref(false)
const form = reactive({
  id: null,
  title: '',
  duration: null,
  poster: '',
  synopsis: '',
  rating: null,
  releaseDate: '',
  status: 'SHOWING',
})

const statusText = { SHOWING: '热映中', COMING_SOON: '即将上映', OFFLINE: '已下架' }
const statusOptions = [
  { value: 'SHOWING', label: '热映中' },
  { value: 'COMING_SOON', label: '即将上映' },
  { value: 'OFFLINE', label: '已下架' },
]

async function load() {
  loading.value = true
  try {
    const data = await adminListMovies({
      keyword: keyword.value || undefined,
      status: statusFilter.value || undefined,
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

function openCreate() {
  isEdit.value = false
  Object.assign(form, {
    id: null, title: '', duration: null, poster: '', synopsis: '',
    rating: null, releaseDate: '', status: 'SHOWING',
  })
  dialogVisible.value = true
}

function openEdit(row) {
  isEdit.value = true
  Object.assign(form, {
    id: row.id, title: row.title, duration: row.duration, poster: row.poster,
    synopsis: row.synopsis, rating: row.rating, releaseDate: row.releaseDate, status: row.status,
  })
  dialogVisible.value = true
}

async function save() {
  if (!form.title) {
    ElMessage.warning('请输入电影名称')
    return
  }
  saving.value = true
  try {
    const payload = {
      id: form.id || undefined,
      title: form.title,
      duration: form.duration,
      poster: form.poster || undefined,
      synopsis: form.synopsis || undefined,
      rating: form.rating,
      releaseDate: form.releaseDate || undefined,
      status: form.status,
    }
    if (isEdit.value) {
      await adminUpdateMovie({ id: form.id, ...payload })
      ElMessage.success('更新成功')
    } else {
      await adminCreateMovie(payload)
      ElMessage.success('新增成功')
    }
    dialogVisible.value = false
    load()
  } catch (e) {
    // 已提示
  } finally {
    saving.value = false
  }
}

async function toggleStatus(row) {
  const next = row.status === 'OFFLINE' ? 'SHOWING' : 'OFFLINE'
  await adminUpdateMovieStatus({ id: row.id, status: next })
  ElMessage.success('状态已更新')
  load()
}

function search() {
  current.value = 1
  load()
}

onMounted(load)
</script>

<template>
  <div>
    <div class="toolbar">
      <div class="filters">
        <el-input v-model="keyword" placeholder="关键字" clearable style="width: 200px" @keyup.enter="search" />
        <el-select v-model="statusFilter" placeholder="状态" clearable style="width: 150px">
          <el-option v-for="s in statusOptions" :key="s.value" :label="s.label" :value="s.value" />
        </el-select>
        <el-button type="primary" @click="search">查询</el-button>
      </div>
      <el-button type="primary" @click="openCreate">新增电影</el-button>
    </div>

    <el-table v-loading="loading" :data="records">
      <el-table-column prop="id" label="ID" width="70" />
      <el-table-column prop="title" label="名称" width="200" />
      <el-table-column prop="duration" label="时长(分)" width="100" />
      <el-table-column prop="rating" label="评分" width="90" />
      <el-table-column prop="releaseDate" label="上映日期" width="130" />
      <el-table-column label="状态" width="110">
        <template #default="{ row }">
          <el-tag size="small" :type="row.status === 'SHOWING' ? 'success' : row.status === 'COMING_SOON' ? 'warning' : 'info'">
            {{ statusText[row.status] || row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <el-button size="small" @click="openEdit(row)">编辑</el-button>
          <el-button size="small" :type="row.status === 'OFFLINE' ? 'success' : 'warning'" @click="toggleStatus(row)">
            {{ row.status === 'OFFLINE' ? '上架' : '下架' }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

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

    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑电影' : '新增电影'" width="520px">
      <el-form label-width="90px">
        <el-form-item label="名称">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="时长(分)">
          <el-input-number v-model="form.duration" :min="1" />
        </el-form-item>
        <el-form-item label="评分">
          <el-input-number v-model="form.rating" :min="0" :max="10" :precision="1" />
        </el-form-item>
        <el-form-item label="上映日期">
          <el-date-picker v-model="form.releaseDate" type="date" value-format="YYYY-MM-DD" placeholder="选择日期" />
        </el-form-item>
        <el-form-item label="海报 URL">
          <el-input v-model="form.poster" placeholder="海报图片路径（可选）" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.status">
            <el-option v-for="s in statusOptions" :key="s.value" :label="s.label" :value="s.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="简介">
          <el-input v-model="form.synopsis" type="textarea" :rows="4" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="save">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.toolbar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
}
.filters {
  display: flex;
  gap: 10px;
}
.pager {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>

