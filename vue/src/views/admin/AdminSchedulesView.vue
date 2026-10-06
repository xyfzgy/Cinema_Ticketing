<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { listAdminSchedules, deleteSchedule, changeScheduleStatus } from '@/api/adminSchedule'
const rows=ref([]),loading=ref(false)
async function load(){loading.value=true;try{const page=await listAdminSchedules({current:1,size:100});rows.value=page?.records||[]}catch{rows.value=[]}finally{loading.value=false}}
async function remove(row){try{await ElMessageBox.confirm('确认删除该排片？','提示',{type:'warning'});await deleteSchedule(row.id);ElMessage.success('已删除');load()}catch{}}
async function toggle(row){try{await changeScheduleStatus(row.id,row.status===1?0:1);ElMessage.success('状态已更新');load()}catch{}}
onMounted(load)
</script>
<template><div><div class="toolbar"><h2>排片管理</h2><span>共 {{ rows.length }} 条排片</span></div><el-table v-loading="loading" :data="rows"><el-table-column prop="movieName" label="电影"/><el-table-column prop="hallName" label="影厅"/><el-table-column prop="startTime" label="开始时间"/><el-table-column prop="price" label="票价"/><el-table-column label="状态"><template #default="{row}"><el-tag :type="row.status===1?'success':'info'">{{row.status===1?'售票中':'已停售'}}</el-tag></template></el-table-column><el-table-column label="操作" width="180"><template #default="{row}"><el-button size="small" @click="toggle(row)">{{row.status===1?'停售':'开售'}}</el-button><el-button size="small" type="danger" @click="remove(row)">删除</el-button></template></el-table-column></el-table><el-empty v-if="!loading&&!rows.length" description="暂无排片数据"/></div></template>
<style scoped>.toolbar{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px}.toolbar span{color:#999}</style>
