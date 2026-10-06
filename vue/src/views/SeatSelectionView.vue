<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getScreening, getScreeningSeats } from '@/api/screening'
import { createOrder } from '@/api/order'

const route = useRoute()
const router = useRouter()

const screening = ref(null)
const seats = ref([])
const selected = ref([])
const submitting = ref(false)
const idempotencyKey = ref(generateKey())

function generateKey() {
  return (crypto.randomUUID && crypto.randomUUID()) || `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

const totalPrice = computed(() => {
  const price = screening.value ? Number(screening.value.price || 0) : 0
  return (price * selected.value.length).toFixed(2)
})

const statusMeta = {
  AVAILABLE: { label: '可选', type: 'success' },
  LOCKED: { label: '锁定', type: 'warning' },
  SOLD: { label: '已售', type: 'info' },
}

function isSelectable(seat) {
  return seat.status === 'AVAILABLE'
}

function toggle(seat) {
  if (!isSelectable(seat)) return
  const idx = selected.value.indexOf(seat.seatId)
  if (idx >= 0) {
    selected.value.splice(idx, 1)
  } else {
    selected.value.push(seat.seatId)
  }
}

function seatClass(seat) {
  if (selected.value.includes(seat.seatId)) return 'seat-cell selected'
  if (seat.status === 'AVAILABLE') return 'seat-cell free'
  if (seat.status === 'LOCKED') return 'seat-cell locked'
  if (seat.status === 'SOLD') return 'seat-cell sold'
  return 'seat-cell locked'
}

// 每次修改选座生成新的幂等键，重试同一次选择则复用原键
watch(selected, () => {
  idempotencyKey.value = generateKey()
}, { deep: true })

async function load() {
  const id = route.params.id
  screening.value = await getScreening(id)
  const list = await getScreeningSeats(id)
  seats.value = Array.isArray(list?.seats) ? list.seats : []
}

async function onSubmit() {
  if (!selected.value.length) {
    ElMessage.warning('请至少选择一个座位')
    return
  }
  try {
    await ElMessageBox.confirm(
      `共 ${selected.value.length} 个座位，合计 ${totalPrice.value} 元，确认下单？`,
      '确认订单',
      { type: 'info' },
    )
  } catch (e) {
    return
  }
  submitting.value = true
  try {
    const order = await createOrder(
      { scheduleId: Number(screening.value.id), seatIds: [...selected.value] },
      idempotencyKey.value,
    )
    ElMessage.success('下单成功，请尽快支付')
    router.push(`/orders/${order.id}`)
  } catch (e) {
    // 已提示
  } finally {
    submitting.value = false
  }
}

onMounted(load)
</script>

<template>
  <div class="page">
    <el-card>
      <template #header>
        <div class="header">
          <span class="title">选择座位</span>
          <span v-if="screening">票价：{{ screening.price }} 元 / 张</span>
        </div>
      </template>

      <div v-if="screening && (!screening.startTime || new Date(screening.startTime) <= new Date())" class="tip">
        该场次已开场，仅供参考，请勿下单
      </div>

      <div class="legend">
        <span><i class="dot free"></i>可选</span>
        <span><i class="dot locked"></i>锁定</span>
        <span><i class="dot sold"></i>已售</span>
        <span><i class="dot selected"></i>已选</span>
      </div>

      <div class="seat-grid seat-grid-center">
        <div
          v-for="seat in seats"
          :key="seat.seatId"
          :class="seatClass(seat)"
          @click="toggle(seat)"
        >
          {{ seat.seatNo || `${seat.row}排${seat.col}座` }}
        </div>
      </div>

      <el-empty v-if="!seats.length" description="暂无座位数据" />
    </el-card>

    <div class="bar">
      <div>
        已选 <b>{{ selected.length }}</b> 个座位，合计
        <b class="price">¥{{ totalPrice }}</b>
      </div>
      <el-button type="primary" size="large" :loading="submitting" @click="onSubmit">确认下单</el-button>
    </div>
  </div>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
}
.title {
  font-size: 16px;
  font-weight: 600;
}
.tip {
  color: #e6a23c;
  margin-bottom: 12px;
}
.legend {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  font-size: 13px;
  color: #606266;
}
.dot {
  display: inline-block;
  width: 14px;
  height: 14px;
  border-radius: 3px;
  margin-right: 4px;
  vertical-align: middle;
}
.dot.free {
  background: #f0f9eb;
  border: 1px solid #67c23a;
}
.dot.locked {
  background: #fdf6ec;
  border: 1px solid #e6a23c;
}
.dot.sold {
  background: #f4f4f5;
  border: 1px solid #c0c4cc;
}
.dot.selected {
  background: #e5484d;
  border: 1px solid #e5484d;
}
.seat-grid-center {
  justify-content: center;
}
.seat-cell.free {
  background: #f0f9eb;
  border-color: #67c23a;
}
.seat-cell.locked {
  background: #fdf6ec;
  border-color: #e6a23c;
  cursor: not-allowed;
}
.seat-cell.sold {
  background: #f4f4f5;
  border-color: #c0c4cc;
  color: #c0c4cc;
  cursor: not-allowed;
}
.seat-cell.selected {
  background: #e5484d;
  border-color: #e5484d;
  color: #fff;
}
.bar {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  padding: 16px;
  border-radius: 8px;
}
.price {
  color: #e5484d;
  font-size: 18px;
}
</style>

