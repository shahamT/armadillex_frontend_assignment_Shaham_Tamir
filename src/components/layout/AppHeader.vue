<template>
  <q-header elevated class="app-header bg-white no-shadow">
    <q-toolbar class="grid no-shadow q-px-md full-height">
      <app-logo />

      <user-menu />
    </q-toolbar>
  </q-header>
</template>

<script setup>
import AppLogo from '../common/AppLogo.vue'
import UserMenu from '../layout/UserMenu.vue'
</script>

<style lang="scss" >
@import '/src/css/setup/variables.scss';
.app-header {
  height: $header-height;
  z-index: 10000;
  border-bottom: 1px solid $clr-border;

  .q-toolbar {
    width: 100%;
    margin: 0 auto;
    max-width: $max-width-screen;
    grid-template-columns: 1fr auto;
    justify-content: space-between;
  }

  .q-layout__shadow:after {
    box-shadow: $main-shadow;
  }
}
</style>
