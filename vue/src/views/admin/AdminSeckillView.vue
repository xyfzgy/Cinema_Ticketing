<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { listSeckill, deleteSeckill } from '@/api/adminSeckill'
const rows=ref([]),loading=ref(false)
async function load(){loading.value=true;try{const page=await listSeckill({current:1,size:100});rows.value=page?.records||[]}catch{rows.value=[]}finally{loading.value=false}}
async function remove(row){try{await ElMessageBox.confirm('确认删除该秒杀活动？','提示',{type:'warning'});await deleteSeckill(row.id);ElMessage.success('已删除');load()}catch{}}
onMounted(load)
</script>
<template><div><div class="toolbar"><h2>秒杀活动管理</h2><span>共 {{ rows.length }} 个活动</span></div><el-table v-loading="loading" :data="rows"><el-table-column prop="id" label="ID" width="80"/><el-table-column prop="scheduleId" label="排片ID"/><el-table-column prop="seckillPrice" label="秒杀价"/><el-table-column prop="stock" label="库存"/><el-table-column prop="startTime" label="开始时间"/><el-table-column prop="endTime" label="结束时间"/><el-table-column label="状态"><template #default="{row}"><el-tag :type="row.status===1?'success':'info'">{{row.status===1?'启用':'停用'}}</el-tag></template></el-table-column><el-table-column label="操作"><template #default="{row}"><el-button type="danger" size="small" @click="remove(row)">删除</el-button></template></el-table-column></el-table><el-empty v-if="!loading&&!rows.length" description="暂无秒杀活动"/></div></template>
<style scoped>.toolbar{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px}.toolbar span{color:#999}</style>
