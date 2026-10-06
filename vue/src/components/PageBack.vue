<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
</script>
<template><button class="page-back" type="button" @click="router.back()" aria-label="返回上一页">← <span>返回</span></button></template>
<style scoped>.page-back{border:0;background:#ffffffd9;color:#493c85;padding:9px 14px;border-radius:6px;cursor:pointer;font-size:14px;font-weight:600}.page-back:hover{background:white}.page-back:active{transform:scale(.97)}</style>
