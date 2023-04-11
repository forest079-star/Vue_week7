<template>
  <div>
    <div class="d-flex justify-content-between align-content-center mt-4">
      <p>本頁有{{products.length}}項產品</p>
      <button type="button" class="btn btn-primary">建立新的產品</button>
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
          <td width="120">{{item.category}}</td>
          <td width="150">{{item.title}}</td>
          <td width="120">{{item.origin_price}}</td>
          <td width="120">{{item.price}}</td>
          <td width="150">
            <span v-if="!item.is_enabled">未啟用</span>
            <span v-else class="text-success">啟用</span>
          </td>
          <td width="120">
            <button type="button" class="btn btn-outline-primary btn-sm me-2" @click="openModal('edit')">編輯</button>
            <button type="button" class="btn btn-outline-danger btn-sm" @click="openModal('delete')">刪除</button>
          </td>
        </tr>

      </tbody>
    </table>
    <div class="d-flex justify-content-center mt-4">
      <nav aria-label="Page navigation example">
        <ul class="pagination">

          <li class="page-item" :class="{disabled: !pagination.has_pre}">
            <a class="page-link" href="#" aria-label="Previous"
               @click.prevent="getProducts(pagination.current_page - 1)" :disabled="isLoading">
              <span aria-hidden="true">&laquo;</span>
            </a>
          </li>

          <li class="page-item" :class="{active : pagination.current_page === page}"
              v-for="page in pagination.total_pages" :key="page + `page`">
            <span class="page-link" v-if="page === pagination.current_page">{{page}}</span>
            <a class="page-link" href="#" v-else @click.prevent="getProducts(page)">{{page}}</a>
          </li>

          <li class="page-item" :class="{disabled: !pagination.has_next}" :disabled="isLoading">
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
            <!-- <span v-if="isNew">新增產品</span> -->
            <span>編輯產品</span>
          </h5>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form action="" class="row">
            <div class="col-4">
              <div class="col">
                <label class="form-label mt-2" for="">主要圖片</label>
                <input type="text" class="form-control mb-2" id="" placeholder="請輸入圖片連結">
                <img alt="" class="img-fluid">
              </div>
              <p class="fs-4 mt-2">多圖新增</p>
              <template>
                <div class="mb-1">
                  <div class="mb-3">
                    <label for="" class="form-label">圖片網址</label>
                    <input type="text" class="form-control" placeholder="請輸入圖片連結">
                  </div>
                  <img class="img-fluid">
                </div>
                <div>
                  <button class="btn btn-outline-main btn-sm d-block w-100">
                    新增圖片
                  </button>
                </div>
                <div>
                  <button class="btn btn-outline-accent btn-sm d-block w-100" style="padding: 0.25rem 0.5rem;">
                    刪除圖片
                  </button>
                </div>
              </template>
              <div>
                <button class="btn btn-outline-primary btn-sm d-block w-100">
                  新增圖片
                </button>
              </div>
              <div class="col mt-5">
                <label for="customFile" class="fs-4 form-label">上傳圖檔
                  <i class="fas fa-spinner fa-spin"></i>
                </label>
                <input type="file" name="file-to-upload" id="customFile" class="form-control mb-2" />
                <label for="fileLink" class="form-label mt-2">檔案生成網址</label>
                <input type="text" class="form-control mb-2" id="fileLink" placeholder="請複製用於上方圖片連結">
              </div>
            </div>
            <div class="col-8">
              <div class="row">
                <div class="col-6">
                  <label class="form-label mt-2" for="">品名</label>
                  <input type="text" class="form-control" id="" placeholder="請輸入品名">
                </div>
                <div class="col-6">
                  <label class="form-label mt-2" for="">類別</label>
                  <input type="text" class="form-control" id="" placeholder="請輸入類別">
                </div>
              </div>
              <div class="row">
                <div class="col-6">
                  <label class="form-label mt-2" for="">產地</label>
                  <input type="text" class="form-control" id="" placeholder="請輸入產地">
                </div>
                <div class="col-6">
                  <label class="form-label mt-2" for="">品種</label>
                  <input type="text" class="form-control" id="" placeholder="請輸入品種">
                </div>
              </div>
              <div class="row">
                <div class="col-6">
                  <label class="form-label mt-2" for="">香氣</label>
                  <input type="text" class="form-control" id="" placeholder="請輸入香氣">
                </div>
                <div class="col-6">
                  <label class="form-label mt-2" for="">滋味</label>
                  <input type="text" class="form-control" id="" placeholder="請輸入滋味">
                </div>
              </div>
              <div class="row">
                <div class="col-6">
                  <label class="form-label mt-2" for="">茶乾</label>
                  <input type="text" class="form-control" id="" placeholder="請輸入茶乾">
                </div>
                <div class="col-6">
                  <label class="form-label mt-2" for="">單位</label>
                  <input type="text" class="form-control" id="" placeholder="請輸入單位">
                </div>
              </div>
              <div class="row">
                <div class="col-6">
                  <label class="form-label mt-2" for="">原價</label>
                  <input type="number" min="0" class="form-control" id="" placeholder="請輸入原價">
                </div>
                <div class="col-6">
                  <label class="form-label mt-2" for="">售價</label>
                  <input type="number" min="0" class="form-control" id="" placeholder="請輸入售價">
                </div>
              </div>
              <label class="form-label mt-2" for="">產品描述</label>
              <textarea class="form-control" id="" cols="30" rows="2" placeholder="請輸入產品描述"></textarea>
              <label class="form-label mt-2" for="">說明內容</label>
              <textarea class="form-control" id="" cols="30" rows="2" placeholder="請輸入說明內容"></textarea>
              <div class="col mt-2">
                <input type="checkbox" class="form-check-input" id="">
                <label class="form-label ms-2" for="">是否啟用</label>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-gray" data-bs-dismiss="modal">取消</button>
          <button type="button" class="btn btn-primary">確認</button>
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
          <button type="button" class="btn btn-outline-gray" data-bs-dismiss="modal">取消</button>
          <button type="button" class="btn btn-outline-danger">確認</button>
        </div>
      </div>
    </div>
  </div>

</template>
<script>
  import modalMixin from '@/mixins/modalMixin';
  import Modal from "bootstrap/js/dist/modal";
  const { VITE_URL, VITE_PATH } = import.meta.env
  export default {
    data() {
      return {
        isLoading: false,
        products: [],
        pagination: {},
        modal: '',
        delModal:'',
        isNew: false,
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
      openModal(event) {
        if (event === 'new') {
          this.isNew = true
          // this.modal.show()
        } else if (event === 'edit') {
          this.isNew = false
          this.modal.show()
          // this.$refs.delProductModal.openModal()
        } else if (event === 'delete') {
          this.isNew = false
          this.delModal.show()
        }
      },
      cancelProduct() {
        this.modal.hide()
      },
      closeModal() {
        this.modal.hide()
      },

    },
    mounted() {
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)ryanpro\s*\=\s*([^;]*).*$)|^.*$/, "$1");
      this.axios.defaults.headers.common.Authorization = token;
      this.getProducts();
      this.modal = new Modal(this.$refs.productModal, {
        backdrop: 'static',
        keyboard: false,
      });
      this.delModal = new Modal(this.$refs.delProductModal, {
        backdrop: 'static',
        keyboard: false,
      });
      // console.log('del', this.$refs.delProductModal);
    },
    
  }
</script>
<style lang="">
</style>