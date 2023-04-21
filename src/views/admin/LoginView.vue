<template>
  <div class="container h-100vh d-flex justify-content-center align-items-center">
    <div class="row justify-content-center align-items-center w-100">
      <div class="col-md-auto">
        <div class="w-100">
          <img class="img-fluid d-none d-lg-block"
               src="https://images.unsplash.com/photo-1477239439998-839196943351?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8Y2hpbGQlMjBjbG90aHxlbnwwfDF8MHx8&auto=format&fit=crop&w=500&q=60"
               alt="">
        </div>
      </div>
      <div class="col-lg-6">
        <div class="card w-100">
          <div class="card-body">
            <h2 class="card-title mb-4">啾可愛登入</h2>
            <form @submit.prevent="login">
              <div class="mb-3">
                <label for="email" class="form-label">電子郵件</label>
                <input type="email" class="form-control" id="email" v-model="user.username" placeholder="請輸入電子郵件">
              </div>
              <div class="mb-5">
                <label for="password" class="form-label">密碼</label>
                <input type="password" class="form-control" id="password" v-model="user.password" placeholder="請輸入密碼">
              </div>
              <button type="submit" class="btn btn-primary">登入</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const { VITE_URL } = import.meta.env
export default {
  data () {
    return {
      user: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    // 登入功能
    login () {
      const api = `${VITE_URL}/v2/admin/signin`

      this.axios.post(api, this.user).then((response) => {
        console.log(response)
        if (response.data.success) {
          const { token, expired } = response.data
          // 將 token 存入 cookie
          document.cookie = `ryanpro=${token}; expires=${new Date(expired)};`
          // // 將 token 存入 localStorage
          // localStorage.setItem('ryanpro', token)
          // // 將 token 存入 sessionStorage
          // sessionStorage.setItem('ryanpro', token)
          // 跳轉到後台首頁
          this.$router.push('/admin/products')
        }
      })
        .catch((error) => {
          console.log(error)
          alert(error.response.data.message)
        })
    }
  }
}
</script>
<style>
  img{
    display: block;
  }
</style>
