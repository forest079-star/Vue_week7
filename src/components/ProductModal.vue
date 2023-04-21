<template>
  <div class="modal fade" id="productModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true"
    ref="modal">
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header bg-dark text-white">
          <h5 class="modal-title" id="exampleModalLabel">
            <span v-if="isNew">新增產品</span>
            <span v-else>編輯產品</span>

          </h5>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form action="" class="row">
            <div class="col-4">
              <div class="col">
                <label class="form-label mt-2" for="">主要圖片</label>
                <input type="text" class="form-control mb-2" id="" placeholder="請輸入圖片連結" v-model="temProduct.imageUrl">
                <img :src="temProduct.imageUrl" alt="" class="img-fluid">
              </div>
              <p class="fs-4 mt-2">多圖新增</p>
              <template v-if="Array.isArray(temProduct.imagesUrl)">
                <div class="mb-1" v-for="(image, key) in temProduct.imagesUrl" :key="key">
                  <div class="mb-3">
                    <label for="" class="form-label">圖片網址</label>
                    <input type="text" v-model="temProduct.imagesUrl[key]" class="form-control" placeholder="請輸入圖片連結">
                  </div>
                  <img :src="temProduct.imagesUrl[key]" class="img-fluid mb-1">
                  <div class=" mb-3">
                    <button class="btn btn-outline-danger btn-sm d-block w-100" style="padding: 0.25rem 0.5rem;"
                      @click="() => temProduct.imagesUrl.splice(key, 1)">
                      刪除圖片
                    </button>
                  </div>
                </div>
                <div v-if="!temProduct.imagesUrl.length || temProduct.imagesUrl[temProduct.imagesUrl.length - 1]">
                  <button class="btn btn-outline-primary btn-sm d-block w-100"
                    @click="() => temProduct.imagesUrl.push('')">
                    新增圖片
                  </button>
                </div>
              </template>
              <div v-else>
                <button class="btn btn-outline-primary btn-sm d-block w-100"
                @click="() => temProduct.imagesUrl.push('')">
                  新增圖片
                </button>
              </div>
              <div class="col mt-5">
                <label for="customFile" class="fs-4 form-label hstack">上傳圖檔
                  <div v-if="imgUploading" class="ms-2 spinner-border spinner-border-sm" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </label>
                <input @change="uploadFile" ref="file" type="file" name="file-to-upload" id="customFile"
                  class="form-control mb-2" />
                <label for="fileLink" class="form-label mt-2">檔案生成網址</label>
                <input v-model="temProduct.tempImage" type="text" class="form-control mb-2" id="fileLink"
                  placeholder="請複製用於上方圖片連結">
                <img :src="temProduct.tempImage" class="img-fluid rounded" alt="">
              </div>
            </div>
            <div class="col-8">
              <div class="row">
                <div class="col-12">
                  <label class="form-label mt-2" for="pd-title">產品名稱</label>
                  <input v-model="temProduct.title" type="text" class="form-control" id="pd-title" placeholder="請輸入產品名稱">
                </div>

              </div>
              <div class="row">
                <div class="col-6">
                  <label class="form-label mt-2" for="main-category">類別</label>
                  <select v-model="temProduct.category" id="main-category" class="form-select" name="">
                    <option value="請選擇類別" disabled selected>請選擇類別</option>
                    <option v-for="item in productCategories.infantCategories" :key="item" :value="item">{{ item }}
                    </option>
                  </select>
                </div>
                <div class="col-6">
                  <label class="form-label mt-2" for="unit">單位</label>
                  <input v-model="temProduct
                    .unit" type="text" class="form-control" id="unit" placeholder="請輸入單位">
                </div>
              </div>
              <div class="row">
                <div class="col-6">
                  <label class="form-label mt-2" for="origin_price">原價</label>
                  <input v-model="temProduct.origin_price" type="number" min="0" class="form-control" id="origin_price"
                    placeholder="請輸入原價">
                </div>
                <div class="col-6">
                  <label class="form-label mt-2" for="price">售價</label>
                  <input v-model="temProduct.price" type="number" min="0" class="form-control" id="price"
                    placeholder="請輸入售價">
                </div>
              </div>
              <label class="form-label mt-2" for="description">產品描述</label>
              <textarea v-model="temProduct.description" class="form-control" id="description" cols="30" rows="2"
                placeholder="請輸入產品描述"></textarea>
              <label class="form-label mt-2" for="content">說明內容</label>
              <textarea v-model="temProduct.content" class="form-control" id="content" cols="30" rows="2"
                placeholder="請輸入說明內容"></textarea>
              <div class="col mt-2">
                <input :checked="isEnabled"
    @change="onIsEnabledChange" type="checkbox" class="form-check-input" id="is_enabled">
                <label class="form-label ms-2" for="is_enabled">是否啟用</label>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-gray" @click="() => $emit('cancel-product','edit')">取消</button>
          <button type="button" class="btn btn-primary" @click="()=> $emit('update-product')">確認</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import modalMixin from '@/mixins/modalMixin'
const { VITE_PATH, VITE_URL } = import.meta.env
export default {
  props: {
    isNew: {},
    productCategories: {
      type: Object,
      default: () => {
        return {
          infantCategories: []
        }
      }
    },
    product: {
      type: Object,
      default: () => {
        return {
          imagesUrl: []
        }
      }
    },
    'is-enabled': {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      temProduct: {
        imagesUrl: [],
        tempImage: ''
      },
      modal: '',
      imgUploading: false
    }
  },
  mixins: [modalMixin],
  emits: ['update-product', 'cancel-product', 'update:is-enabled'],
  watch: {
    product () {
      this.temProduct = this.product
      if (!this.temProduct.imagesUrl) {
        this.temProduct.imagesUrl = []
      }
      if (!this.temProduct.tempImage) {
        this.temProduct.tempImage = ''
      }
    },
    isEnabled () {
      this.temProduct.is_enabled = this.isEnabled
    }
  },
  methods: {
    onIsEnabledChange (event) {
      this.$emit('update:is-enabled', event.target.checked)
    },
    uploadFile () {
      // 取得第一個檔案
      const uploadedFile = this.$refs.file.files[0]
      // 建立一個新的 FormData 物件
      const formData = new FormData()
      // 將檔案加入到 form data
      formData.append('file-to-upload', uploadedFile)
      // 設定上傳中的狀態為 true
      this.imgUploading = true
      // 建立 URL
      const url = `${VITE_URL}/api/${VITE_PATH}/admin/upload`
      // 發送 POST 請求到 URL
      this.axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then((res) => {
        // 處理回應
        if (res.data.success) {
          this.imgUploading = false
          this.temProduct.tempImage = res.data.imageUrl
          this.$refs.file.value = ''
          // this.temProduct.tempImage = '';
        } else {
          this.$refs.file.value = ''
          alert(res.data.message)
        }
      }).catch((error) => {
        // 處理錯誤
        console.log(error.response)
        alert(error.response.message)
        this.imgUploading = false
      })
    }
  }

}
</script>
