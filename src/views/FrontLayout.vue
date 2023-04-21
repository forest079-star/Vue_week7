<template>
  <div>
    這是前台頁面
    <router-link to="/admin/products">回到後台</router-link>
    <router-view />
  </div>
</template>

<script>
import { RouterView } from 'vue-router'
export default {
  comments: {
    RouterView
  }
}
</script>
