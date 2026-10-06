<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getUser, isAdmin, clearAuth } from '@/utils/auth'
import request from '@/utils/request'
import PageBack from '@/components/PageBack.vue'
import HistoryOrdersView from './HistoryOrdersView.vue'
const route=useRoute(),router=useRouter(),user=ref(getUser()||{})
const admin=computed(()=>route.path==='/adminPersonal'||isAdmin())
const activeTab=computed({get:()=>route.query.tab==='orders'?'orders':'profile',set:tab=>router.replace({query:{...route.query,tab}})})
onMounted(async()=>{try{const profile=await request.get('/auth/me');user.value={...user.value,...profile}}catch{}})
function logout(){clearAuth();router.push('/login')}
</script>
<template><main class="account-page"><div class="account-wrap"><PageBack/><header><span>MY ACCOUNT</span><h1>{{ admin?'管理员中心':'个人中心' }}</h1></header><div class="profile-header"><div class="avatar">{{ (user.username||'影').slice(0,1) }}</div><div><h2>{{ user.username||user.name||'影迷' }}</h2><span>{{ admin?'管理员':'普通用户' }}</span></div><el-button class="logout" @click="logout">退出登录</el-button></div><el-radio-group v-model="activeTab" class="account-tabs"><el-radio-button value="profile">基本资料</el-radio-button><el-radio-button value="orders">历史订单</el-radio-button></el-radio-group><HistoryOrdersView v-if="activeTab === 'orders'" embedded/><template v-else><div class="profile-section"><h3>基本资料</h3><div class="facts"><div><span>用户名</span><strong>{{ user.username||user.name||'未填写' }}</strong></div><div><span>年龄</span><strong>{{ user.age||'未填写' }}</strong></div><div><span>个人简介</span><strong>{{ user.introduction||'这个人很神秘，暂未填写简介。' }}</strong></div></div></div><div v-if="admin" class="profile-section"><h3>管理入口</h3><div class="admin-links"><button @click="router.push('/admin/movies')">电影管理 ↗</button><button @click="router.push('/admin')">运营数据 ↗</button></div></div></template></div></main></template>
<style scoped>.account-tabs{margin-bottom:18px}.account-page{min-height:100vh;background:linear-gradient(135deg,#667eea,#764ba2 60%,#87ceeb);padding:25px 16px 70px}.account-wrap{max-width:920px;margin:auto}header{color:white;padding:22px 0}header span{font-size:12px;letter-spacing:1px}header h1{font-size:32px}.profile-header,.profile-section{background:white;border-radius:9px;padding:25px;margin-bottom:18px;box-shadow:0 8px 25px #24175b20}.profile-header{display:flex;align-items:center;gap:18px}.avatar{width:66px;height:66px;border-radius:50%;display:grid;place-items:center;background:linear-gradient(135deg,#667eea,#b798d9);color:white;font-size:27px}.profile-header h2{margin:0 0 6px}.profile-header span{color:#777}.logout{margin-left:auto}.profile-section h3{margin:0 0 18px}.facts{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}.facts div{display:grid;gap:8px}.facts span{color:#999;font-size:13px}.facts strong{color:#333;font-size:14px}.section-row{display:flex;justify-content:space-between}.mini-order{display:flex;gap:12px;justify-content:space-between;padding:13px 0;border-top:1px solid #eee}.mini-order span{color:#999}.mini-order b{color:#ff6b6b}.empty{color:#999;padding:28px;text-align:center}.admin-links{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.admin-links button{padding:20px;border:1px solid #e8e2fa;border-radius:7px;background:#faf9ff;text-align:left;color:#5b4daa;cursor:pointer}.admin-links button:hover{background:#eeebfa}@media(max-width:650px){.facts,.admin-links{grid-template-columns:1fr}.mini-order{flex-wrap:wrap}.profile-header,.profile-section{padding:18px}}
</style>





