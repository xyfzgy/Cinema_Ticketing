<script setup>
import { ref, nextTick, onBeforeUnmount } from 'vue'
import { getToken } from '@/utils/auth'

const messages = ref([])
const input = ref('')
const sending = ref(false)
const chatId = ref(generateId())
const listEl = ref(null)
let aborted = false

function generateId() {
  return `web-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

async function send() {
  const text = input.value.trim()
  if (!text || sending.value) return
  input.value = ''
  messages.value.push({ role: 'user', content: text })
  const assistant = { role: 'assistant', content: '' }
  messages.value.push(assistant)
  sending.value = true
  scrollBottom()

  try {
    const url = `/ai/chat?prompt=${encodeURIComponent(text)}&chatId=${encodeURIComponent(chatId.value)}`
    const res = await fetch(url, {
      method: 'GET',
      headers: { Authorization: `Bearer ${getToken()}` },
    })
    if (!res.ok || !res.body) {
      throw new Error('AI 服务暂不可用')
    }
    const reader = res.body.getReader()
    const decoder = new TextDecoder('utf-8')
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      assistant.content += decoder.decode(value, { stream: true })
      scrollBottom()
    }
    if (!assistant.content) assistant.content = '（无回复）'
  } catch (e) {
    assistant.content = e.message || '请求失败'
  } finally {
    sending.value = false
    scrollBottom()
  }
}

function scrollBottom() {
  nextTick(() => {
    if (listEl.value) listEl.value.scrollTop = listEl.value.scrollHeight
  })
}

onBeforeUnmount(() => {
  aborted = true
})
</script>

<template>
  <div class="page">
    <h2 class="page-title">AI 客服</h2>
    <div class="chat">
      <div ref="listEl" class="msg-list">
        <div v-for="(m, i) in messages" :key="i" :class="['msg', m.role]">
          <div class="bubble">{{ m.content || (sending && i === messages.length - 1 ? '思考中…' : '') }}</div>
        </div>
        <el-empty v-if="!messages.length" description="向我咨询影片、场次等问题" :image-size="80" />
      </div>
      <div class="input-bar">
        <el-input
          v-model="input"
          placeholder="输入您的问题，回车发送"
          :disabled="sending"
          @keyup.enter="send"
        />
        <el-button type="primary" :loading="sending" @click="send">发送</el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chat {
  border: 1px solid #ebeef5;
  border-radius: 8px;
  background: #fff;
  overflow: hidden;
}
.msg-list {
  height: 480px;
  overflow-y: auto;
  padding: 20px;
  background: #f7f8fa;
}
.msg {
  display: flex;
  margin-bottom: 12px;
}
.msg.user {
  justify-content: flex-end;
}
.msg.assistant {
  justify-content: flex-start;
}
.bubble {
  max-width: 70%;
  padding: 10px 14px;
  border-radius: 10px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
}
.msg.user .bubble {
  background: #e5484d;
  color: #fff;
}
.msg.assistant .bubble {
  background: #fff;
  border: 1px solid #ebeef5;
}
.input-bar {
  display: flex;
  gap: 12px;
  padding: 16px;
}
</style>