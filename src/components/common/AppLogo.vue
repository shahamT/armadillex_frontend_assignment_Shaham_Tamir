<template>
  <div class="logo-container relative" @click="goToHome">
    <q-icon name="img:/src/assets/logo.svg" class="cursor-pointer" />
    <span class="text-12 text-font-medium text-secondary">Companies DB </span>
  </div>
</template>

<script setup>
import { ROUTES } from 'src/router/const'
import { useRouter } from 'vue-router'

const router = useRouter()

const goToHome = () => {
  router.push(`/${ROUTES.COMPANY}`)
}
</script>

<style lang="scss">
.logo-container {
  i {
    height: 2.5rem;
    width: auto;
  }
  img {
    height: 2rem;
  }
  span {
    position: absolute;
    top: 1.625rem;
    left: 2.6rem;
  }
}
</style>