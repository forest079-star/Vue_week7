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
      <!-- 分頁 -->
      <PaginationView :pagination="pagination" @change-page="getProducts" :isLoading="isLoading"></PaginationView>
    </div>
  </div>

  <!-- 新增 編輯 modal -->
  <ProductModal ref="productModal" :isNew="isNew" :product-categories="productCategories" :product="temProduct" @update-product="updateProduct" @cancel-product="handleCancelProduct" v-model:is-enabled="isEnabled"></ProductModal>

  <!-- 刪除 modal -->
  <DelModal ref="delModal" :tem-product="temProduct" @del-product="delProduct" @cancel-product="handleCancelProduct"></DelModal>

</template>
<script>
import modalMixin from '@/mixins/modalMixin';
import PaginationView from '@/components/PaginationView.vue';
import DelModal from '@/components/DelModal.vue';
import ProductModal from '@/components/ProductModal.vue';
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
      delModal: '',
      isNew: false,
      productCategories: {},
    }
  },
  components: {
    PaginationView,
    ProductModal,
    DelModal
  },
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
        this.$refs.productModal.openModal()
        // this.createModal('productModal');
        // this.modal.show()
      } else if (event === 'edit') {
        this.isNew = false
        this.temProduct = { ...item }
        console.log("🚀 ~ file: this.temProduct:", this.temProduct);
        this.$refs.productModal.openModal()
      } else if (event === 'delete') {
        this.isNew = false
        this.temProduct = { ...item }
        this.$refs.delModal.openModal()
      }
    },
    // cancelProduct() {
    //   this.temProduct = { imagesUrl: [] }
    //   console.log("cancelProduct", this.temProduct);
    //   this.modal.hide();
    // },
    handleCancelProduct(action) {
      if (action === 'edit' || action === 'new') {
        this.cancelProductForEditNew();
      } else if (action === 'del') {
        this.cancelProductForDel();
      }
    },
    cancelProductForEditNew() {
      this.temProduct = { imagesUrl: [] };
      console.log("cancelProduct", this.temProduct);
      this.$refs.productModal.hideModal();
    },
    cancelProductForDel() {
      this.temProduct = { imagesUrl: [] };
      console.log("cancelProduct", this.temProduct);
      this.$refs.delModal.hideModal();
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
      this.temProduct.tempImage = ''
      this.axios[httpMethod](api, { data: this.temProduct }).then((res) => {
        if (res.data.success) {
          this.temProduct = {
            imagesUrl: [],
            tempImage: ""
          }
          this.getProducts();
          alert(res.data.message);
          // this.modal.hide();
          this.$refs.productModal.hideModal()
        } else {
          alert(res.data.message);
        }
      }).catch((error) => {
        console.log(error.response.data.message);
        alert(error.response.data.message);
      });
    },
    delProduct() {
      const url = `${VITE_URL}/api/${VITE_PATH}/admin/product/${this.temProduct.id}`;
      this.axios.delete(url).then((res) => {
        if (res.data.success) {
          alert(res.data.message);
          this.getProducts();
          this.$refs.delModal.openModal()
          // this.modal.hide();
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