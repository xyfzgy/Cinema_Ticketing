<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { listMyOrders, cancelOrder, confirmPay } from '@/api/order'

const router = useRouter()
const orders = ref([])
const loading = ref(false)

const statusText = {
  PENDING_PAYMENT: '待支付',
  PAID: '已支付',
  CANCELLED: '已取消',
  REFUNDING: '退款中',
  REFUNDED: '已退款',
  CLOSED: '已关闭',
}
const statusType = {
  PENDING_PAYMENT: 'warning',
  PAID: 'success',
  CANCELLED: 'info',
  REFUNDING: 'warning',
  REFUNDED: 'info',
  CLOSED: 'info',
}

async function load() {
  loading.value = true
  try {
    orders.value = (await listMyOrders()) || []
  } catch (e) {
    // 已提示
  } finally {
    loading.value = false
  }
}

async function pay(order) {
  try {
    await ElMessageBox.confirm('确认支付该订单？', '模拟支付', { type: 'warning' })
  } catch (e) {
    return
  }
  await confirmPay(order.id)
  ElMessage.success('支付成功')
  load()
}

async function cancel(order) {
  try {
    await ElMessageBox.confirm('确认取消该订单？', '取消订单', { type: 'warning' })
  } catch (e) {
    return
  }
  await cancelOrder(order.id)
  ElMessage.success('已取消')
  load()
}

function goDetail(order) {
  router.push(`/orders/${order.id}`)
}

onMounted(load)
</script>

<template>
  <div class="page">
    <h2 class="page-title">我的订单</h2>
    <el-table v-loading="loading" :data="orders">
      <el-table-column prop="orderNo" label="订单号" width="220" />
      <el-table-column prop="amount" label="金额（元）" width="120" />
      <el-table-column label="状态" width="120">
        <template #default="{ row }">
          <el-tag :type="statusType[row.status] || 'info'" size="small">
            {{ statusText[row.status] || row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="下单时间" width="200" />
      <el-table-column prop="expireAt" label="支付截止" width="200" />
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button size="small" @click="goDetail(row)">详情</el-button>
          <el-button
            v-if="row.status === 'PENDING_PAYMENT'"
            type="primary"
            size="small"
            @click="pay(row)"
          >
            支付
          </el-button>
          <el-button
            v-if="row.status === 'PENDING_PAYMENT'"
            type="danger"
            size="small"
            @click="cancel(row)"
          >
            取消
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-empty v-if="!loading && !orders.length" description="暂无订单" />
  </div>
</template>

