<template>
  <q-layout view="lHh Lpr lFf">
    <app-header />

    <q-page-container class="page-container" style="padding-top: 0">
      <q-page class="q-pa-md">
        <router-view />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import AppHeader from 'src/components/layout/AppHeader.vue'
</script>

<style lang="scss">
@import '/src/css/setup/variables.scss';
.page-container {
  min-height: 100vh;
  max-width: $max-width-screen;
  margin: auto;
  padding-top: $header-height !important;

  .q-page {
    max-width: $max-width-screen;
  }
}
</style>
