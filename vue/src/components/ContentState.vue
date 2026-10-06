<script setup>defineProps({ loading: Boolean, error: String, empty: Boolean, label: { type: String, default: '暂无内容' } })</script>
<template><div v-if="loading || error || empty" class="content-state"><span class="state-symbol">{{ loading ? '◌' : error ? '!' : '◇' }}</span><p>{{ loading ? '正在加载...' : error || label }}</p><slot /></div></template>
<style scoped>.content-state{min-height:180px;display:grid;place-content:center;text-align:center;color:#666}.state-symbol{font-size:38px;color:#b798d9}.content-state p{margin:8px 0}</style>
