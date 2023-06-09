<template>
  <Loading v-model:active="isLoading" :can-cancel="true" :is-full-page="fullPage"></Loading>
  <div class="d-flex justify-content-between align-content-center mt-4">
    <p>本頁有{{ orders.length }}筆訂單</p>
  </div>
  <table class="table table-hover mt-4 pb-4" style="min-height:calc(100% - 137px)">
    <thead>
      <tr>
        <th>購買時間</th>
        <th>Email</th>
        <th class="d-none d-sm-table-cell">購買品項</th>
        <th class="d-none d-sm-table-cell">應付金額</th>
        <th>是否付款</th>
        <th class="text-center">編輯</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in orders" :key="item.id">
        <td>{{ $filters.date(item.create_at) }}</td>
        <td>{{ item.user.email }}</td>
        <td class="d-none d-sm-table-cell">
          <ul class="list-unstyled">
            <li v-for="(product, i) in item.products" :key="i" class="row mb-1">
              <span class="col">
                {{ product.product.title }}
              </span>
              <span class="col">
                數量 : {{ product.qty }}
              </span>
            </li>
          </ul>
        </td>
        <td class="d-none d-sm-table-cell"> $ {{ item.total }}</td>
        <td>
          <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" :id="`paidSwitch${item.id}`" v-model="item.is_paid" @change="updatePaid(item)" />
            <label class="form-check-label" :for="`paidSwitch${item.id}`">
              <span v-if="item.is_paid">已付款</span>
              <span v-else>未付款</span>
            </label>
          </div>
        </td>
        <td>
          <button type="button" class="btn btn-outline-primary btn-sm me-sm-2" @click="openOrder('view', item)">檢視</button>
          <button type="button" class="btn btn-outline-danger btn-sm" @click="openOrder('delete', item)">刪除</button>
        </td>
      </tr>
    </tbody>
  </table>
  <div class="d-flex justify-content-center mt-4">
    <!-- 分頁 -->
    <PaginationView :pagination="pagination" @change-page="getOrders" :isLoading="isLoading"></PaginationView>
  </div>

  <!-- View Modal -->
  <OrderModal ref="orderModal" :order="tempOrder" @update-order="updateOrder" @cancel-product="handleCancelProduct" :is-loading="isLoading"></OrderModal>
  <!-- delModal -->
  <DelModal ref="delModal" :tem-product="tempOrder" @cancel-product="handleCancelProduct" @del-product="deleteOrder"></DelModal>
</template>
<script>
import PaginationView from '@/components/PaginationView.vue'
import OrderModal from '@/components/OrderModal.vue'
import DelModal from '@/components/DelModal.vue'

import { Toast } from '@/methods/swalToast'

import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css'

const { VITE_URL, VITE_PATH } = import.meta.env
export default {
  inject: ['$filters'],
  data () {
    return {
      orders: [],
      pagination: {},
      isLoading: false,
      fullPage: true,
      tempOrder: {}
    }
  },
  components: {
    PaginationView,
    OrderModal,
    DelModal,
    Loading
  },
  methods: {
    getOrders (page = 1) {
      this.isLoading = true
      this.axios.get(`${VITE_URL}/api/${VITE_PATH}/admin/orders/?page=${page}`)
        .then((res) => {
          // console.log('orders', res.data)
          // console.log('pagination', res.data.pagination)
          this.orders = res.data.orders
          this.pagination = res.data.pagination
          this.isLoading = false
          console.log('this.orders', this.orders)
        })
        .catch(error => {
          Toast.fire({
            icon: 'error',
            title: error.response.data.message
          })
          // alert(error.response.data.message)
          this.isLoading = false
        })
    },
    openOrder (action, item) {
      if (action === 'view') {
        this.tempOrder = { ...item }
        this.$refs.orderModal.openModal(item)
      } else if (action === 'delete') {
        this.tempOrder = { ...item }
        console.log('tempOrder', this.tempOrder)
        this.$refs.delModal.openModal(item)
      }
    },
    deleteOrder () {
      // console.log('deleteOrder', this.tempOrder)
      const deleteUrl = `${VITE_URL}/api/${VITE_PATH}/admin/order/${this.tempOrder.id}`
      this.axios.delete(deleteUrl)
        .then((res) => {
          Toast.fire({
            icon: 'success',
            title: res.data.message
          })
          // alert(res.data.message)
          this.$refs.delModal.hideModal()
          this.getOrders()
        })
        .catch(error => {
          Toast.fire({
            icon: 'error',
            title: error.response.data.message
          })
          // alert(error.response.data.message)
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
      this.tempOrder = {}
      console.log('cancelOrderModal', this.tempOrder)
      this.$refs.orderModal.hideModal()
    },
    cancelProductForDel () {
      this.tempOrder = {}
      console.log('cancelDelModal', this.tempOrder)
      this.$refs.delModal.hideModal()
    },
    updatePaid (item) {
      console.log('updatePaid', item)
      // update-item-edit-time
      if (item.is_paid) {
        const paidDate = new Date().toLocaleDateString()
        item.paid_date = paidDate
      } else {
        item.paid_date = ''
      }

      const paidData = {
        is_paid: item.is_paid,
        paid_date: item.paid_date
      }
      const updateUrl = `${VITE_URL}/api/${VITE_PATH}/admin/order/${item.id}`
      this.axios.put(updateUrl, { data: paidData })
        .then((res) => {
          Toast.fire({
            icon: 'success',
            title: res.data.message
          })
          // alert(res.data.message)
          this.getOrders()
        })
        .catch(error => {
          Toast.fire({
            icon: 'error',
            title: error.response.data.message
          })
          // alert(error.response.data.message)
        })
    },
    updateOrder () {
      // console.log('updateOrder', this.tempOrder)
      const updateUrl = `${VITE_URL}/api/${VITE_PATH}/admin/order/${this.tempOrder.id}`
      if (this.tempOrder.is_paid) {
        const paidDate = new Date().toLocaleDateString()
        this.tempOrder.paid_date = paidDate
      } else {
        this.tempOrder.paid_date = ''
      }
      this.axios.put(updateUrl, { data: this.tempOrder })
        .then((res) => {
          Toast.fire({
            icon: 'success',
            title: res.data.message
          })
          // alert(res.data.message)
          this.$refs.orderModal.hideModal()
          this.getOrders()
        })
        .catch(error => {
          Toast.fire({
            icon: 'error',
            title: error.response.data.message
          })
          // alert(error.response.data.message)
        })
    }

  },
  mounted () {
    this.getOrders()
  }
}
</script>
<style lang="scss">
</style>
