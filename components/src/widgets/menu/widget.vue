<template>
  <div
    ref="menu"
    class="menu"
  >
    <div 
      class="menu-trigger" 
      @click.stop="toggle"
    >
      <slot name="trigger" />
    </div>
    
    <div class="menu-content-wrapper">
      <div 
        v-if="showMenu"
        class="menu-content"
        @click.stop
      >
        <slot name="content" />
      </div>
    </div>
  </div>
</template>

<script setup>
  import { onMounted, onUnmounted, ref } from 'vue'

  const showMenu = ref(false)
  const menu = ref(null)

  const toggle = () => {
    showMenu.value = !showMenu.value;
  }

  const handleClickOutside = (event) => {
    if (menu.value && !menu.value.contains(event.target)) {
      showMenu.value = false;
    }
  }

  onMounted(() => {
    document.addEventListener("click", handleClickOutside)
  })

  onUnmounted(() => {
    document.removeEventListener("click", handleClickOutside)
  })
</script>

<style lang="stylus" scoped>

  .menu-content-wrapper {
    position: relative;
  }

  .menu-content {
    position: absolute;
    top: 0;
    left: 0;
  }
</style>