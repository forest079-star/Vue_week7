<template>
  <Loading v-model:active="isLoading" :can-cancel="true" :is-full-page="fullPage"></Loading>
  <div class="mt-4">
    <div class="d-flex justify-content-between">
      <p class="mb-0 px-2">本頁有 <span>{{ articles.length }}</span> 篇文章</p>
      <button type="button" class="btn btn-primary text-light" @click="openArticles('new', item)">新增文章</button>
    </div>
    <table class="table table-hover mt-2">
      <thead>
        <tr>
          <th width="150">標題</th>
          <th width="120">作者</th>
          <th width="120">建立日期</th>
          <th width="120">到期日</th>
          <th width="120">狀態</th>
          <th width="120">編輯</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in articles" :key="item.id">
          <td width="150">{{ item.title }}</td>
          <td width="120">{{ item.author }}</td>
          <td width="120">
            {{ $filters.date(item.create_at) }}
          </td>
          <td width="120">
            {{ $filters.date(item.due_date) }}
          </td>
          <td width="120">
            <span class="text-success" v-if="item.isPublic">啟用</span>
            <span v-else>未啟用</span>
          </td>
          <td width="120">
            <button type="button" class="btn btn-outline-primary btn-sm me-2 backendBtn"
              @click="openArticle(item)" >編輯</button>
            <button type="button" class="btn btn-outline-danger btn-sm" @click="openArticles('delete', item)">刪除</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="d-flex justify-content-center mt-4">
      <PaginationView :pagination="pagination" @change-page="getArticles" :isLoading="isLoading"></PaginationView>
    </div>
  </div>

  <!-- NEW/EDIT Modal -->
  <ArticleModal ref="articleModal" :article="temArticle" :is-new="isNew" :upload-image="uploadImage" @update-article="updateArticle" @cancel-article="handleCancelProduct" :img-uploading="imgUploading"></ArticleModal>

  <!-- del modal -->
  <DelModal ref="delModal" :tem-product="temArticle" @cancel-product="handleCancelProduct" @del-product="deleteArticle">
  </DelModal>
</template>

<script>
import PaginationView from '@/components/PaginationView.vue'
import ArticleModal from '@/components/ArticleModal.vue'
import DelModal from '@/components/DelModal.vue'

import { Toast } from '@/methods/swalToast'

import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css'
const { VITE_PATH, VITE_URL } = import.meta.env
export default {
  inject: ['$filters'],
  data () {
    return {
      articles: [],
      pagination: {},
      isLoading: false,
      fullPage: true,
      temArticle: {
        imagesUrl: [],
        tag: []
      },
      isNew: false,
      imgUploading: false
    }
  },
  components: {
    PaginationView,
    ArticleModal,
    DelModal,
    Loading
  },
  methods: {
    getArticles (page = 1) {
      const url = `${VITE_URL}/api/${VITE_PATH}/admin/articles?page=${page}`
      this.isLoading = true
      this.axios.get(url).then((res) => {
        console.log(res.data)
        this.articles = res.data.articles
        this.pagination = res.data.pagination
        this.isLoading = false
      })
    },
    openArticle (item) {
      const url = `${VITE_URL}/api/${VITE_PATH}/admin/article/${item.id}`
      this.axios.get(url).then((res) => {
        console.log('response', res)
        this.temArticle = { ...res.data.article }
        this.isNew = false
        this.$refs.articleModal.openModal()
      })
    },
    openArticles (action, item) {
      if (action === 'new') {
        this.isNew = true
        this.temArticle = {
          isPublic: false,
          due_date: new Date().getTime() / 1000,
          tag: []
        }
        this.isEnabled = false
        this.$refs.articleModal.openModal()
      } else if (action === 'edit') {
        this.temArticle = { ...item }
        console.log('this.temArticle', this.temArticle)
        this.isNew = false
        this.$refs.articleModal.openModal()
      } else if (action === 'delete') {
        console.log('delete', item)
        this.temArticle = { ...item }
        this.$refs.delModal.openModal()
      }
    },
    updateArticle () {
      let url = `${VITE_URL}/api/${VITE_PATH}/admin/article`
      let httpMethod = 'post'
      if (!this.isNew) {
        url = `${VITE_URL}/api/${VITE_PATH}/admin/article/${this.temArticle.id}`
        httpMethod = 'put'
      }
      console.log('this.temArticle.id', this.temArticle.id)
      this.axios[httpMethod](url, { data: this.temArticle }).then((res) => {
        console.log(res.data)
        if (res.data.success) {
          Toast.fire({
            icon: 'success',
            title: res.data.message
          })
          // alert('文章已更新')
          this.$refs.articleModal.hideModal()
          this.getArticles()
        } else {
          Toast.fire({
            icon: 'error',
            title: res.data.message
          })
          // alert(res.data.message)
        }
      })
        .catch((err) => {
          Toast.fire({
            icon: 'error',
            title: err.response.data.message
          })
          // console.log(err.response.data.message)
        })
    },
    deleteArticle () {
      const url = `${VITE_URL}/api/${VITE_PATH}/admin/article/${this.temArticle.id}`
      this.axios.delete(url).then((res) => {
        console.log(res.data)
        if (res.data.success) {
          Toast.fire({
            icon: 'success',
            title: '文章已刪除'
          })
          // alert('文章已刪除')
          this.$refs.delModal.hideModal()
          this.getArticles()
        } else {
          Toast.fire({
            icon: 'error',
            title: res.data.message
          })
          // alert(res.data.message)
        }
      })
        .catch((err) => {
          Toast.fire({
            icon: 'error',
            title: err.response.data.message
          })
          // console.log(err.response.data.message)
        })
    },
    uploadImage (event) {
      this.imgUploading = true
      const file = event.target.files[0]
      const formData = new FormData()
      formData.append('file-to-upload', file)
      const url = `${VITE_URL}/api/${VITE_PATH}/admin/upload`
      this.axios.post(url, formData).then((res) => {
        console.log(res.data)
        if (res.data.success) {
          this.temArticle.imageUrl = res.data.imageUrl
          this.imgUploading = false
        } else {
          Toast.fire({
            icon: 'error',
            title: res.data.message
          })
          // alert(res.data.message)
          this.imgUploading = false
        }
      })
        .catch((err) => {
          console.log(err.response.data.message)
          this.imgUploading = false
        })
    },
    handleCancelProduct (action) {
      if (action === 'edit' || action === 'view') {
        this.cancelProductForEditNew()
      } else if (action === 'del') {
        this.cancelProductForDel()
      }
    },
    cancelProductForEditNew () {
      console.log('cancelCouponModal', this.temArticle)
      this.temArticle = {
        imagesUrl: [],
        tag: []
      }
      this.$refs.articleModal.hideModal()
    },
    cancelProductForDel () {
      this.temArticle = {
        imagesUrl: [],
        tag: []
      }
      console.log('cancelDelModal', this.temArticle)
      this.$refs.delModal.hideModal()
    }
  },
  mounted () {
    this.getArticles()
  }
}
</script>
