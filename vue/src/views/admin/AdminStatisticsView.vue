<script setup>
import { ref, onMounted } from 'vue'
import { getOverview } from '@/api/statistics'

const data = ref(null)

async function load() {
  data.value = await getOverview()
}

onMounted(load)
</script>

<template>
  <div v-if="data">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card>
          <div class="stat-label">订单量</div>
          <div class="stat-value">{{ data.orderCount }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="stat-label">销售额（元）</div>
          <div class="stat-value">{{ data.salesAmount }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="stat-label">退款额（元）</div>
          <div class="stat-value">{{ data.refundAmount }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="stat-label">上座率</div>
          <div class="stat-value">{{ data.occupancyRate }}</div>
        </el-card>
      </el-col>
    </el-row>
  </div>
  <el-empty v-else description="暂无统计数据" />
</template>

<style scoped>
.stat-label {
  color: #909399;
  font-size: 14px;
}
.stat-value {
  font-size: 28px;
  font-weight: 700;
  margin-top: 8px;
}
</style>

