<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getOrder, cancelOrder, confirmPay } from '@/api/order'
import { createRefund, listRefunds } from '@/api/refund'
import { listTickets } from '@/api/ticket'

const route = useRoute()
const order = ref(null)
const tickets = ref([])
const refunds = ref([])
const loading = ref(false)

const statusText = {
  PENDING_PAYMENT: '待支付',
  PAID: '已支付',
  CANCELLED: '已取消',
  REFUNDING: '退款中',
  REFUNDED: '已退款',
  CLOSED: '已关闭',
}
const ticketStatusText = {
  VALID: '有效',
  USED: '已核验',
  REFUNDED: '已退款',
  INVALID: '已作废',
}
const refundStatusText = {
  APPLIED: '已申请',
  PROCESSING: '处理中',
  SUCCESS: '退款成功',
  FAILED: '退款失败',
}

async function load() {
  loading.value = true
  try {
    const id = route.params.id
    order.value = await getOrder(id)
    tickets.value = (await listTickets(id)) || []
    refunds.value = (await listRefunds(id)) || []
  } catch (e) {
    // 已提示
  } finally {
    loading.value = false
  }
}

async function pay() {
  try {
    await ElMessageBox.confirm('确认支付该订单？', '模拟支付', { type: 'warning' })
  } catch (e) {
    return
  }
  await confirmPay(order.value.id)
  ElMessage.success('支付成功')
  load()
}

async function cancel() {
  try {
    await ElMessageBox.confirm('确认取消该订单？', '取消订单', { type: 'warning' })
  } catch (e) {
    return
  }
  await cancelOrder(order.value.id)
  ElMessage.success('已取消')
  load()
}

async function refund() {
  let reason = ''
  try {
    const { value } = await ElMessageBox.prompt('请输入退款原因', '申请退款', {
      inputValue: '',
      confirmButtonText: '提交申请',
      cancelButtonText: '取消',
    })
    reason = value || ''
  } catch (e) {
    return
  }
  await createRefund({ orderId: Number(order.value.id), reason })
  ElMessage.success('退款已处理')
  load()
}

onMounted(load)
</script>

<template>
  <div v-loading="loading" class="page">
    <template v-if="order">
      <el-card>
        <template #header>
          <div class="header">
            <span class="title">订单详情</span>
            <span class="order-no">订单号：{{ order.orderNo }}</span>
          </div>
        </template>

        <el-descriptions :column="2" border>
          <el-descriptions-item label="订单状态">
            <el-tag>{{ statusText[order.status] || order.status }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="支付状态">{{ order.payStatus }}</el-descriptions-item>
          <el-descriptions-item label="订单金额">¥{{ order.amount }}</el-descriptions-item>
          <el-descriptions-item label="场次 ID">{{ order.screeningId }}</el-descriptions-item>
          <el-descriptions-item label="下单时间">{{ order.createdAt }}</el-descriptions-item>
          <el-descriptions-item label="支付截止">{{ order.expireAt }}</el-descriptions-item>
        </el-descriptions>

        <div class="actions">
          <el-button v-if="order.status === 'PENDING_PAYMENT'" type="primary" @click="pay">立即支付</el-button>
          <el-button v-if="order.status === 'PENDING_PAYMENT'" type="danger" @click="cancel">取消订单</el-button>
          <el-button v-if="order.status === 'PAID'" type="warning" @click="refund">申请退款</el-button>
        </div>
      </el-card>

      <el-card v-if="tickets.length" class="block">
        <template #header>票券</template>
        <el-table :data="tickets">
          <el-table-column prop="ticketNo" label="票券号" width="240" />
          <el-table-column label="状态" width="120">
            <template #default="{ row }">
              <el-tag size="small">{{ ticketStatusText[row.status] || row.status }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="checkedAt" label="核验时间" />
        </el-table>
      </el-card>

      <el-card v-if="refunds.length" class="block">
        <template #header>退款记录</template>
        <el-table :data="refunds">
          <el-table-column prop="refundNo" label="退款单号" width="240" />
          <el-table-column prop="amount" label="退款金额" width="120" />
          <el-table-column label="状态" width="120">
            <template #default="{ row }">
              <el-tag size="small">{{ refundStatusText[row.status] || row.status }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="reason" label="原因" />
        </el-table>
      </el-card>
    </template>
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
.order-no {
  color: #909399;
}
.actions {
  margin-top: 20px;
}
.block {
  margin-top: 20px;
}
</style>

