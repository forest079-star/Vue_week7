<template>
  <div>
    <div class="d-flex justify-content-between align-content-center mt-4">
      <p>本頁有{{ products.length }}項產品</p>
      <button type="button" class="btn btn-primary" @click="openModal('new')">建立新的產品</button>
    </div>
    <!-- 產品列表和編輯和刪除 -->
    <table class="table table-hover mt-4 pb-4" style="min-height:calc(100% - 137px)">
      <thead>
        <tr>
          <th width="120">分類</th>
          <th width="150">產品名稱</th>
          <th width="120"> 原價 </th>
          <th width="120"> 售價 </th>
          <th width="150"> 是否啟用 </th>
          <th width="120"> 編輯 </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in products" :key="item.id">
          <td width="120">{{ item.category }}</td>
          <td width="150">{{ item.title }}</td>
          <td width="120">{{ item.origin_price }}</td>
          <td width="120">{{ item.price }}</td>
          <td width="150">
            <span v-if="!item.is_enabled">未啟用</span>
            <span v-else class="text-success">啟用</span>
          </td>
          <td width="120">
            <button type="button" class="btn btn-outline-primary btn-sm me-2" @click="openModal('edit', item)">編輯</button>
            <button type="button" class="btn btn-outline-danger btn-sm" @click="openModal('delete', item)">刪除</button>
          </td>
        </tr>

      </tbody>
    </table>
    <div class="d-flex justify-content-center mt-4">
      <nav aria-label="Page navigation example">
        <ul class="pagination">

          <li class="page-item" :class="{ disabled: !pagination.has_pre }">
            <a class="page-link" href="#" aria-label="Previous" @click.prevent="getProducts(pagination.current_page - 1)"
              :disabled="isLoading">
              <span aria-hidden="true">&laquo;</span>
            </a>
          </li>

          <li class="page-item" :class="{ active: pagination.current_page === page }"
            v-for="page in pagination.total_pages" :key="page + `page`">
            <span class="page-link" v-if="page === pagination.current_page">{{ page }}</span>
            <a class="page-link" href="#" v-else @click.prevent="getProducts(page)">{{ page }}</a>
          </li>

          <li class="page-item" :class="{ disabled: !pagination.has_next }" :disabled="isLoading">
            <a class="page-link" href="#" aria-label="Next" @click.prevent="getProducts(pagination.current_page + 1)">
              <span aria-hidden="true">&raquo;</span>
            </a>
          </li>

        </ul>
      </nav>
    </div>
  </div>

  <!-- edit modal -->
  <div class="modal fade" id="productModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true"
    ref="productModal">
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
                <button class="btn btn-outline-primary btn-sm d-block w-100">
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
                <input v-model="isEnabled" type="checkbox" class="form-check-input" id="is_enabled">
                <label class="form-label ms-2" for="is_enabled">是否啟用</label>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-gray" @click="cancelProduct">取消</button>
          <button type="button" class="btn btn-primary" @click="updateProduct">確認</button>
        </div>
      </div>
    </div>
  </div>

  <!-- del-modal -->
  <div class="modal fade" id="delProductModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true"
    ref="delProductModal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header bg-danger text-white">
          <h5 class="modal-title">
            <span>刪除產品</span>
          </h5>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <p class="fs-6">請確認刪除此產品？</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-gray" @click="cancelProduct">取消</button>
          <button type="button" class="btn btn-outline-danger" @click="delProduct">確認</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import modalMixin from '@/mixins/modalMixin';
import Modal from "bootstrap/js/dist/modal";

// data
import { productFormData } from '@/data/adminFormData.js'
const { VITE_URL, VITE_PATH } = import.meta.env
export default {
  data() {
    return {
      isLoading: false,
      products: [],
      temProduct: {
        imagesUrl: [],
        tempImage: ''
      },
      imgUploading: false,
      pagination: {},
      modal: '',
      delModal: '',
      isNew: false,
      productCategories: {},
    }
  },
  // mixins: [modalMixin],
  methods: {
    getProducts(page = 1) {
      this.isLoading = true;
      const api = `${VITE_URL}/api/${VITE_PATH}/admin/products/?page=${page}`
      this.axios.get(api).then((res) => {
        console.log("🚀 ~ file: res.data:", res.data.products)
        if (res.data.success) {
          this.products = res.data.products
          this.pagination = res.data.pagination
        } else {
          alert(res.data.message)
          this.$router.push('/login')
        }
      }).catch((error) => {
        console.log(error.response)
        alert(error.response.data.message)
        this.$router.push('/login')
      })
        .finally(() => {
          this.isLoading = false; // 無論成功或失敗，請求完成後將 isLoading 設為 false
        });
    },
    openModal(event, item) {
      if (event === 'new') {
        this.isNew = true
        this.temProduct = { imagesUrl: [] }
        this.createModal('productModal');
        this.modal.show()
      } else if (event === 'edit') {
        this.isNew = false
        this.temProduct = { ...item }
        console.log("🚀 ~ file: this.temProduct:", this.temProduct);
        this.createModal('productModal');
        this.modal.show()
      } else if (event === 'delete') {
        this.isNew = false
        this.temProduct = { ...item }
        this.createModal('delProductModal');
        this.modal.show()
      }
    },
    cancelProduct() {
      this.temProduct = { imagesUrl: [] }
      console.log("cancelProduct", this.temProduct);
      this.modal.hide();
    },
    closeModal() {
      this.modal.hide()
    },
    createModal(refName) {
      this.modal = new Modal(this.$refs[refName], {
        backdrop: 'static',
        keyboard: false,
      });
    },
    updateProduct() {
      let api = `${VITE_URL}/api/${VITE_PATH}/admin/product`;
      let httpMethod = 'post';
      if (!this.isNew) {
        api = `${VITE_URL}/api/${VITE_PATH}/admin/product/${this.temProduct.id}`;
        httpMethod = 'put';
      }
      // 更新後 刪除 temProduct.tempImage 圖片
      // this.temProduct.tempImage = ''
      this.axios[httpMethod](api, { data: this.temProduct }).then((res) => {
        if (res.data.success) {
          this.temProduct = {
            imagesUrl: [],
            tempImage: ""
          }
          this.getProducts();
          alert(res.data.message);
          this.modal.hide();
        } else {
          alert(res.data.message);
        }
        this.$refs.file.value = '';
      }).catch((error) => {
        console.log(error.response);
        alert(error);
      });
    },
    uploadFile() {
      // 取得第一個檔案
      const uploadedFile = this.$refs.file.files[0];
      // 建立一個新的 FormData 物件
      const formData = new FormData();
      // 將檔案加入到 form data
      formData.append('file-to-upload', uploadedFile);
      // 設定上傳中的狀態為 true
      this.imgUploading = true;
      // 建立 URL
      const url = `${VITE_URL}/api/${VITE_PATH}/admin/upload`;
      // 發送 POST 請求到 URL
      this.axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }).then((res) => {
        // 處理回應
        if (res.data.success) {
          this.imgUploading = false;
          this.temProduct.tempImage = res.data.imageUrl
          this.$refs.file.value = '';
          // this.temProduct.tempImage = '';
        } else {
          this.$refs.file.value = '';
          alert(res.data.message);
        }

      }).catch((error) => {
        // 處理錯誤
        console.log(error.response);
        alert(error.response.data.message);
        this.imgUploading = false;
      });
    },
    delProduct() {
      const url = `${VITE_URL}/api/${VITE_PATH}/admin/product/${this.temProduct.id}`;
      this.axios.delete(url).then((res) => {
        if (res.data.success) {
          alert(res.data.message);
          this.getProducts();
          this.modal.hide();
        } else {
          alert(res.data.message);
        }
      }).catch((error) => {
        console.log(error.response);
        alert(error.response.data.message);
      });
    },
  },
  mounted() {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)ryanpro\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    this.axios.defaults.headers.common.Authorization = token;
    this.getProducts();

    this.productCategories = productFormData.productCategories;

  },
  computed: {
    isEnabled: {
      get() {
        return this.temProduct.is_enabled === 1 || this.temProduct.is_enabled === true;
      },
      set(newValue) {
        if (typeof newValue === 'boolean') {
          this.temProduct.is_enabled = newValue ? 1 : 0;
        } else {
          throw new Error('isEnabled accepts only boolean values');
        }
      }
    }
  }

}
</script>
<style lang="">
</style>