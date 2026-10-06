<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { adminListCinemas, adminCreateCinema, adminUpdateCinema } from '@/api/cinema'

const list = ref([])
const loading = ref(false)
const dialogVisible = ref(false)
const saving = ref(false)
const isEdit = ref(false)
const form = reactive({ id: null, name: '', address: '', phone: '', status: 1 })

async function load() {
  loading.value = true
  try {
    list.value = (await adminListCinemas()) || []
  } catch (e) {
    // 已提示
  } finally {
    loading.value = false
  }
}

function openCreate() {
  isEdit.value = false
  Object.assign(form, { id: null, name: '', address: '', phone: '', status: 1 })
  dialogVisible.value = true
}

function openEdit(row) {
  isEdit.value = true
  Object.assign(form, { id: row.id, name: row.name, address: row.address, phone: row.phone, status: row.status })
  dialogVisible.value = true
}

async function save() {
  if (!form.name) {
    ElMessage.warning('请输入影院名称')
    return
  }
  saving.value = true
  try {
    const payload = { id: form.id, name: form.name, address: form.address, phone: form.phone, status: form.status }
    if (isEdit.value) {
      await adminUpdateCinema(payload)
      ElMessage.success('更新成功')
    } else {
      await adminCreateCinema(payload)
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

onMounted(load)
</script>

<template>
  <div>
    <div class="toolbar">
      <span class="count">共 {{ list.length }} 家影院</span>
      <el-button type="primary" @click="openCreate">新增影院</el-button>
    </div>

    <el-table v-loading="loading" :data="list">
      <el-table-column prop="id" label="ID" width="70" />
      <el-table-column prop="name" label="名称" width="220" />
      <el-table-column prop="address" label="地址" />
      <el-table-column prop="phone" label="电话" width="150" />
      <el-table-column label="状态" width="100">
        <template #default="{ row }">
          <el-tag size="small" :type="row.status === 1 ? 'success' : 'info'">
            {{ row.status === 1 ? '营业中' : '已停业' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button size="small" @click="openEdit(row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑影院' : '新增影院'" width="480px">
      <el-form label-width="80px">
        <el-form-item label="名称">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="form.address" />
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="form.phone" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio :value="1">营业</el-radio>
            <el-radio :value="0">停业</el-radio>
          </el-radio-group>
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
.count {
  color: #909399;
}
</style>

