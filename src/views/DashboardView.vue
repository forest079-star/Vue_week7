<template>
  <div class="container">
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
      <div class="container-fluid">
        <router-link class="navbar-brand me-4" to="/admin/products">
          <img src="/src/assets/images/logo.png" width="100" alt="啾可愛-logo" srcset="">
        </router-link>
        <!-- </a> -->
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <router-link class="nav-link" to="/admin/products">產品管理</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/admin/orders">訂單管理</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/admin/coupons">優惠券管理</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/admin/articles">文章管理</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/user">回到前台</router-link>
            </li>
          </ul>
          <form class="d-flex" @submit.prevent="logout">
            <button class="btn btn-outline-primary flex-shrink-0" type="submit">登出</button>
          </form>
        </div>
      </div>
    </nav>
    <!-- <HelloWorld /> -->
    <RouterView></RouterView>
  </div>
</template>

<script>
import { RouterView } from 'vue-router'
const { VITE_URL } = import.meta.env
export default {
  data () {
    return {
      checkSuccess: false
    }
  },
  components: {
    RouterView
  },
  methods: {
    logout () {
      document.cookie = 'ryanpro=; expires=;'
      this.$router.push('/login')
    },
    checkLogin2 () {
      // 取得cookie 這兩個ˊ要一起寫
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)ryanpro\s*=\s*([^;]*).*$)|^.*$/, '$1')
      this.axios.defaults.headers.common.Authorization = token
      // console.log(token);
      const url = `${VITE_URL}/api/user/check`
      // 判斷cookie是否存在
      if (token) {
        // 設定header
        // 呼叫後端驗證
        this.axios.post(url).then(() => {
          this.checkSuccess = true
          console.log('驗證成功')
        }).catch((err) => {
          console.log(err)
          alert('您尚未登入請重新登入')
          // this.$router.push('/login')
        })
      } else {
        alert('您尚未登入請重新登入')
        this.$router.push('/login')
      }
    },
    checkLogin () {
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)ryanpro\s*=\s*([^;]*).*$)|^.*$/, '$1')
      if (token) {
        this.axios.defaults.headers.common.Authorization = `${token}`
        this.axios.post(`${VITE_URL}/api/user/check`, { api_token: this.token })
          .then((res) => {
            this.checkSuccess = true
            if (!res.data.success) {
              this.$router.push('/login')
            }
          })
          .catch((err) => {
            console.log(err)
            alert('您尚未登入請重新登入')
            // this.$router.push('/login')
          })
      } else {
        alert('您尚未登入請重新登入')
        this.$router.push('/login')
      }
    }
  },
  // 原本是mounted，改為created 可避免登入驗證錯誤
  created () {
    this.checkLogin()
  }
}
</script>
