<template>
  <div class="container">
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><router-link to="/user/articles">部落格列表</router-link></li>
        <li class="breadcrumb-item active" aria-current="page">{{ article.title }}</li>
      </ol>
    </nav>
    <div class="row justify-content-center">
      <article class="col-8">
        <h2>{{ article.title }}</h2>
        <p>
          <small class="text-muted">{{ $filters.date(article.create_at) }}</small> -
          <small class="text-muted">作者：{{ article.author }}</small>
        </p>
        <img :src="article.imageUrl" alt="" class="img-fluid mb-3">
        <div v-html="article.content"></div>
      </article>
    </div>
  </div>
</template>
<script>
const { VITE_PATH, VITE_URL } = import.meta.env
export default {
  data () {
    return {
      article: {},
      isLoading: false
    }
  },
  inject: ['$filters'],
  methods: {
    getArticle (id) {
      const api = `${VITE_URL}/api/${VITE_PATH}/article/${id}`
      this.isLoading = true
      this.axios.get(api).then((response) => {
        console.log('response', response)
        this.article = response.data.article
        this.isLoading = false
      }).catch((error) => {
        this.isLoading = false
        this.$httpMessageState(error.response, '錯誤訊息')
      })
    }
  },
  mounted () {
    this.getArticle(this.$route.params.articleId)
  }
}
</script>
