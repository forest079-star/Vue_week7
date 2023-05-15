<template>
  <div class="container">
    <div class="row row-cols-1 row-cols-md-2 g-4">
      <template v-for="article in articles" :key="article.id">
        <div class="col" v-if="article.isPublic">
          <div class="card">
            <img :src="article.imageUrl" class="card-img-top" />
            <div class="card-body">
              <h5 class="card-title">{{ article.title }}</h5>
              <div v-html="article.description"></div>
            </div>
            <div class="card-footer">
              <router-link :to="`/user/article/${article.id}`" v-if="article.isPublic" class="btn btn-outline-primary">
                文章頁面
              </router-link>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
const { VITE_URL, VITE_PATH } = import.meta.env
export default {
  data () {
    return {
      articles: [],
      isLoading: false,
      isNew: false,
      tempArticle: {}
    }
  },
  methods: {
    getArticles (page = 1) {
      const api = `${VITE_URL}/api/${VITE_PATH}/articles?page=${page}`
      this.isLoading = true
      this.axios.get(api).then((response) => {
        console.log('response', response)
        this.articles = response.data.articles
        console.log('🚀 ~ file: UserArticles.vue:45 ~ this.$http.get ~ this.articles:', this.articles)
        this.pagination = response.data.pagination
        this.isLoading = false
      }).catch((error) => {
        this.isLoading = false
        this.$httpMessageState(error.response, '錯誤訊息')
      })
    }
  },
  mounted () {
    this.getArticles()
  }
}
</script>
