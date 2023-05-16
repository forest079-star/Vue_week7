<template>
  <div class="container">
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
      <div class="container-fluid">
        <router-link class="navbar-brand me-4" to="/admin/products">
          <img src="/src/assets/images/logo.png" width="100" alt="啾可愛-logo" srcset="">
        </router-link>
        <!-- </a> -->
        <button class="navbar-toggler" type="button" @click="toggleNavbar"
          aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" :id="navbarId">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <router-link class="nav-link" to="/admin/products" @click="collapseNavbar">產品管理</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/admin/orders" @click="collapseNavbar">訂單管理</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/admin/coupons" @click="collapseNavbar">優惠券管理</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/admin/articles" @click="collapseNavbar">文章管理</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/user" >回到前台</router-link>
            </li>
          </ul>
          <ul class="navbar-nav mb-2 me-3 mb-lg-0">
            <li class="nav-item">
              <router-link class="nav-link" to="/user/articles" @click="collapseNavbar">Blog</router-link>
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
import Collapse from 'bootstrap/js/dist/collapse'
import { Toast } from '@/methods/swalToast'
const { VITE_URL } = import.meta.env
export default {
  data () {
    return {
      checkSuccess: false,
      navbarId: 'navbarSupportedContent'
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
            Toast.fire({
              icon: 'error',
              title: err.data.message
            })
            this.$router.push('/login')
          })
      } else {
        Toast.fire({
          icon: 'error',
          title: '驗證錯誤, 請重新登入'
        })
        this.$router.push('/login')
      }
    },
    toggleNavbar () {
      const navbar = document.getElementById(this.navbarId)
      const bsCollapse = new Collapse(navbar, { toggle: false })
      if (navbar.classList.contains('show')) {
        bsCollapse.hide()
      } else {
        bsCollapse.show()
      }
    },
    collapseNavbar () {
      const navbar = document.getElementById(this.navbarId)
      const bsCollapse = new Collapse(navbar, { toggle: false })
      if (window.innerWidth <= 992 && navbar.classList.contains('show')) {
        bsCollapse.hide()
      }
    }
  },
  // 原本是mounted，改為created 可避免登入驗證錯誤
  created () {
    this.checkLogin()
  }
}
</script>
