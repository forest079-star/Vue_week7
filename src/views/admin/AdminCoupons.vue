<template>
  <div class="mt-4">
    <div class="d-flex justify-content-between">
      <p class="mb-0 px-2">本頁有 <span>{{ coupons.length }}</span> 項產品</p>
      <button type="button" class="btn btn-primary text-light" @click="openCoupon('new', item)">新增優惠券</button>
    </div>
    <table class="table table-hover mt-2">
      <thead>
        <tr>
          <th width="150">優惠券名稱</th>
          <th width="120">折扣百分比</th>
          <th width="120">到期日</th>
          <th width="120">是否啟用</th>
          <th width="120">編輯</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in coupons" v-bind:key="item.id">
          <td width="150">{{ item.title }}</td>
          <td width="120">{{ item.percent }} %</td>
          <td width="120">
            {{ $filters.date(item.due_date) }}
          </td>
          <td width="120">
            <span class="text-success" v-if="item.is_enabled">啟用</span>
            <span v-else>未啟用</span>
          </td>
          <td width="120">
            <button type="button" class="btn btn-outline-primary btn-sm me-2 backendBtn"
              @click="openCoupon('edit', item)">編輯</button>
            <button type="button" class="btn btn-outline-danger btn-sm"
              @click="openCoupon('delete', item)">刪除</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="d-flex justify-content-center mt-4">
      <PaginationView :pagination="pagination" @change-page="getCoupons" :isLoading="isLoading"></PaginationView>
    </div>
  </div>

  <!-- NEW/EDIT Modal -->
  <CouponModal ref="couponModal" :coupon="temCoupon" :is-new="isNew" @update-coupon="updateCoupon" @cancel-coupon="handleCancelProduct"></CouponModal>

  <!-- del modal -->
  <DelModal ref="delModal" :tem-product="temCoupon" @cancel-product="handleCancelProduct" @del-product="deleteCoupon"></DelModal>
</template>

<script>
import PaginationView from '@/components/PaginationView.vue'
import CouponModal from '../../components/CouponModal.vue'
import DelModal from '@/components/DelModal.vue'
const { VITE_PATH, VITE_URL } = import.meta.env
export default {
  inject: ['$filters'],
  data () {
    return {
      coupons: [],
      pagination: {},
      isLoading: false,
      temCoupon: {},
      isNew: false,
      isEnabled: false
    }
  },
  components: {
    PaginationView,
    CouponModal,
    DelModal
  },
  methods: {
    getCoupons (page = 1) {
      const url = `${VITE_URL}/api/${VITE_PATH}/admin/coupons?page=${page}`
      this.isLoading = true
      this.axios.get(url).then((res) => {
        console.log(res.data)
        this.coupons = res.data.coupons
        this.pagination = res.data.pagination
        this.isLoading = false
      })
    },
    openCoupon (action, item) {
      if (action === 'new') {
        this.temCoupon = {}
        this.isNew = true
        this.temCoupon = {
          due_date: new Date().getTime() / 1000
        }
        this.isEnabled = false
        this.$refs.couponModal.openModal()
      } else if (action === 'edit') {
        this.temCoupon = { ...item }
        this.isNew = false
        this.isEnabled = item.is_enabled === 1
        this.$refs.couponModal.openModal()
      } else if (action === 'delete') {
        console.log('delete', item)
        this.temCoupon = { ...item }
        this.$refs.delModal.openModal()
      }
    },

    updateCoupon () {
      if (this.temCoupon.percent > 100 || this.temCoupon.percent < 0) {
        alert('折扣百分比需介於0~100之間')
        return
      }
      let url = `${VITE_URL}/api/${VITE_PATH}/admin/coupon`
      let httpMethod = 'post'
      if (!this.isNew) {
        url = `${VITE_URL}/api/${VITE_PATH}/admin/coupon/${this.temCoupon.id}`
        httpMethod = 'put'
      }
      this.axios[httpMethod](url, { data: this.temCoupon }).then((res) => {
        if (res.data.success) {
          alert('優惠券已更新')
          this.$refs.couponModal.hideModal()
          this.getCoupons()
        } else {
          alert(res.data.message)
        }
      })
        .catch((err) => {
          console.log(err.response.data.message)
        })
    },

    deleteCoupon () {
      const url = `${VITE_URL}/api/${VITE_PATH}/admin/coupon/${this.temCoupon.id}`
      this.axios.delete(url).then((res) => {
        console.log(res.data)
        if (res.data.success) {
          alert('優惠券已刪除')
          this.$refs.delModal.hideModal()
          this.getCoupons()
        } else {
          alert(res.data.message)
        }
      })
        .catch((err) => {
          console.log(err.response.data.message)
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
      this.temCoupon = {}
      console.log('cancelCouponModal', this.temCoupon)
      this.$refs.couponModal.hideModal()
    },
    cancelProductForDel () {
      console.log('cancelDelModal')
      this.temCoupon = {}
      console.log('cancelDelModal', this.temCoupon)
      this.$refs.delModal.hideModal()
    }
  },
  mounted () {
    this.getCoupons()
  }
}
</script>
