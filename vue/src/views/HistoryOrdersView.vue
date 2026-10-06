<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '@/utils/request'
import { getUser, isLoggedIn } from '@/utils/auth'
import PageBack from '@/components/PageBack.vue'
import ContentState from '@/components/ContentState.vue'
defineProps({embedded:Boolean})
const orders=ref([]),page=ref(1),total=ref(0),loading=ref(false),failed=ref(false)
const statusText={UNPAID:'待支付',PAID:'已支付',CANCELLED:'已取消',REFUNDED:'已退款'}
async function load(){loading.value=true;failed.value=false;try{const data=await request.get('/order/list',{params:{current:page.value,size:6}});orders.value=data?.records||[];total.value=Number(data?.total)||0}catch{orders.value=[];failed.value=true}finally{loading.value=false}}
onMounted(load)
async function remove(id){try{await ElMessageBox.confirm('删除后将无法恢复该订单记录。','确认删除订单',{type:'warning',confirmButtonText:'删除',cancelButtonText:'取消'});await request.delete(`/order/${id}`);await load();ElMessage.success('订单已删除')}catch{}}
</script>
<template><main class="orders-page" :class="{embedded}"><div class="orders-wrap"><PageBack v-if="!embedded"/><header v-if="!embedded"><span>MY BOOKINGS</span><h1>历史订单</h1><p>每一次观影，都值得珍藏。</p></header><div class="orders-panel"><ContentState :loading="loading" :empty="!loading&&!orders.length" :label="failed?'订单加载失败，请重试':'暂无订单记录'"><el-button v-if="!isLoggedIn()" @click="$router.push('/login')">前往登录</el-button></ContentState><el-button v-if="failed" @click="load">重新加载</el-button><div v-for="order in orders" :key="order.id" class="order-row"><div class="ticket-mark">▤</div><div class="order-main"><strong>{{ order.movieName }}</strong><span>{{ order.createTime?.replace('T',' ') }}</span></div><span class="order-status">{{ statusText[order.status] || order.status }}</span><b>¥{{ Number(order.totalAmount).toFixed(2) }}</b><el-button type="danger" text @click="remove(order.id)">删除</el-button></div><el-pagination v-if="total>6" v-model:current-page="page" background layout="prev,pager,next" :page-size="6" :total="total" @current-change="load" class="pagination"/></div></div></main></template>
<style scoped>.orders-page.embedded{padding:0;background:none;min-height:0}.orders-page{min-height:100vh;background:linear-gradient(135deg,#667eea,#764ba2 65%,#87ceeb);padding:25px 16px 70px}.orders-wrap{max-width:980px;margin:auto}header{color:white;padding:26px 0}header span{font-size:12px;letter-spacing:1px}header h1{font-size:32px;margin:9px 0}header p{opacity:.85}.orders-panel{background:white;border-radius:10px;padding:24px;min-height:250px}.order-row{display:flex;align-items:center;gap:16px;border-bottom:1px solid #eee;padding:18px 0}.ticket-mark{display:grid;place-items:center;width:50px;height:50px;background:#efecfa;color:#6653ab;border-radius:6px;font-size:22px}.order-main{display:grid;gap:6px;flex:1}.order-main span{color:#999;font-size:13px}.order-status{color:#52c41a}.order-row b{color:#ff6b6b}.pagination{justify-content:center;margin:22px 0 0}@media(max-width:600px){.orders-panel{padding:16px}.order-row{flex-wrap:wrap}.order-main{min-width:50%}}
</style>

