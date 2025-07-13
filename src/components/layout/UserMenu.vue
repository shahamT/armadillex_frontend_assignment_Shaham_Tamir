<template>
  <div class="user-menu">
    <q-btn round outline :color="menuOpen ? 'primary' : 'secondary'" class="user-avatar-btn">
      <q-avatar size="32px">
        <q-icon name="person" size="24px" :color="menuOpen ? 'primary' : 'secondary'" />
      </q-avatar>

      <q-menu
        v-model="menuOpen"
        transition-show="jump-down"
        transition-hide="jump-up"
        :offset="[0, 5]"
        class="user-menu-dropdown"
      >
        <q-list style="min-width: 200px" class="light-bordered light-radius">
          <q-item-label header class="text-primary text-font-light">
            Hello,
            <span class="text-font-medium">User</span>
          </q-item-label>

          <q-separator />

          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="account_circle" color="secondary" />
            </q-item-section>
            <q-item-section>Profile</q-item-section>
          </q-item>

          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="settings" color="secondary" />
            </q-item-section>
            <q-item-section>Settings</q-item-section>
          </q-item>

          <q-separator />

          <q-item clickable v-ripple @click="onLogout">
            <q-item-section avatar>
              <q-icon name="logout" color="negative" />
            </q-item-section>
            <q-item-section class="text-negative">Logout</q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { log } from 'src/services/log.service'
import { notifyMsgs, notifyService } from 'src/services/notify.service'

const menuOpen = ref(false)
const onLogout = async () => {
  try {
    log.info('Demo logout')
    notifyService.success(notifyMsgs.logoutSuccess)
  } catch (err) {
    log.error('Logout failed:', err)
    notifyService.error(notifyMsgs.logoutFailed)
  }
}
</script>

<style lang="scss">
@import 'src/css/setup/_functions.scss';
.user-menu {
  display: inline-block;
  .user-avatar-btn {
    min-width: rem(40px);
    min-height: rem(40px);
    transition: all 0.2s ease-in-out;
    &:hover {
      transform: scale(1.05);
    }
  }
}

.user-menu-dropdown {
  z-index: 100000;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);

  .q-list {
    .q-item__section--avatar {
      min-width: rem(40px);
    }
  }
}
</style>
