<template>
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
        <td>{{ item.orderDate }}</td>
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
            <input class="form-check-input" type="checkbox" :id="`paidSwitch${item.id}`" v-model="item.is_paid" />
            <label class="form-check-label" :for="`paidSwitch${item.id}`">
              <span v-if="item.is_paid">已付款</span>
              <span v-else>未付款</span>
            </label>
          </div>
        </td>
        <td>
          <button type="button" class="btn btn-outline-primary btn-sm me-2" @click="openOrder('edit', item)">編輯</button>
          <button type="button" class="btn btn-outline-danger btn-sm" @click="openOrder('delete', item)">刪除</button>
        </td>
      </tr>
    </tbody>
  </table>
  <div class="d-flex justify-content-center mt-4">
    <!-- 分頁 -->
    <PaginationView :pagination="pagination" @change-page="getOrders" :isLoading="isLoading"></PaginationView>
  </div>
</template>
<script>
import PaginationView from '@/components/PaginationView.vue'
// import DelModal from '@/components/DelModal'

const { VITE_URL, VITE_PATH } = import.meta.env
export default {
  data () {
    return {
      orders: [],
      pagination: {},
      isLoading: false,
      tempOrder: {}
    }
  },
  components: {
    PaginationView
    // DelModal,
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
        })
        .catch(error => {
          alert(error.response.data.message)
          this.isLoading = false
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
