<script setup>
import {ref,computed,onMounted,onUnmounted} from 'vue'
import request from '@/utils/request'
const activity=ref(null),loading=ref(false),failed=ref(false),busy=ref(false),result=ref(null),now=ref(Date.now())
let timer,disposed=false
const available=computed(()=>activity.value?.status===1&&now.value>=new Date(activity.value.startTime).getTime()&&now.value<new Date(activity.value.endTime).getTime())
async function load(){loading.value=true;failed.value=false;try{activity.value=await request.get('/seckill/activity')}catch{failed.value=true}finally{loading.value=false}}
async function buy(){busy.value=true;try{result.value=await request.post('/seckill/'+activity.value.id);if(result.value?.status==='QUEUING')poll(0)}catch{}finally{busy.value=false}}
function poll(attempt){if(disposed)return;timer=setTimeout(async()=>{try{const data=await request.get('/seckill/result/'+activity.value.id);if(disposed)return;if(data?.status==='SUCCESS'){result.value=data;return}if(attempt<14)poll(attempt+1);else result.value={status:'PENDING',message:'结果仍在确认中，请稍后查询或查看历史订单。'}}catch{if(!disposed)result.value={status:'PENDING',message:'查询失败，请重试。'}}},2000)}
function check(){result.value={status:'QUEUING',message:'正在查询抢购结果…'};poll(0)}
const clock=setInterval(()=>now.value=Date.now(),1000)
onMounted(load)
onUnmounted(()=>{disposed=true;clearTimeout(timer);clearInterval(clock)})
</script>
<template><main class="activity-page"><div class="wrap"><header><span>LIMITED TIME OFFER</span><h1>秒杀活动</h1><p>限时优惠，每人每场活动限购一张。</p></header><el-card v-loading="loading"><template v-if="!loading&&activity"><h2>限时电影票 · 场次 {{ activity.scheduleId }}</h2><el-tag :type="available?'danger':'info'">{{ available?'抢购进行中':'活动未开始或已结束' }}</el-tag><div class="price">¥{{ Number(activity.seckillPrice).toFixed(2) }} <small>/ 张</small></div><p>活动名额：{{ activity.stock }} 张（是否抢到以结果为准）</p><p>开始时间：{{ activity.startTime?.replace('T',' ') }}</p><p>结束时间：{{ activity.endTime?.replace('T',' ') }}</p><el-alert v-if="result" :title="result.message" :type="result.status==='SUCCESS'?'success':result.status==='FAIL'?'error':'info'" :closable="false"/><p v-if="result?.orderNo">订单号：{{ result.orderNo }}</p><div class="actions"><el-button type="danger" :loading="busy||result?.status==='QUEUING'" :disabled="!available||['SUCCESS','PENDING'].includes(result?.status)" @click="buy">立即抢购</el-button><el-button v-if="result?.status==='PENDING'" @click="check">查询结果</el-button><el-button @click="$router.push('/personal?tab=orders')">查看我的订单</el-button></div></template><el-empty v-else-if="!loading" :description="failed?'活动加载失败，请重试':'暂无进行中的秒杀活动'"><el-button @click="load">刷新活动</el-button></el-empty></el-card></div></main></template>
<style scoped>.activity-page{min-height:calc(100vh - 60px);background:linear-gradient(135deg,#667eea,#764ba2 65%,#87ceeb);padding:35px 16px 70px}.wrap{max-width:980px;margin:auto}header{color:white;margin-bottom:28px}header span{font-size:12px;letter-spacing:2px}h1{font-size:32px}.price{font-size:44px;font-weight:700;color:#e5484d;margin:24px 0}.price small{font-size:15px}.actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:24px}.actions .el-button{margin-left:0}p{line-height:1.7}</style>
