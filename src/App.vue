<template>
  <router-view />
</template>

<script setup>
import { onMounted } from 'vue'
import { notifyMsgs, notifyService } from './services/notify.service'

onMounted(() => {
  notifyService.success(notifyMsgs.loginSuccess)
})
</script>
