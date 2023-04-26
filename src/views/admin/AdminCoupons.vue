<template>
  <div class="mt-4">
    <div class="d-flex justify-content-between">
      <p class="mb-0 px-2">本頁有 <span>{{ coupons.length }}</span> 項產品</p>
      <button type="button" class="btn btn-primary text-light" @click="() => openCoupon('new', item)">新增優惠券</button>
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
          <td width="120">{{ item.percent }}</td>
          <td width="120">
            {{ $filters.date(item.due_date) }}
          </td>
          <td width="120">
            <span class="text-success" v-if="item.is_enabled">啟用</span>
            <span v-else>未啟用</span>
          </td>
          <td width="120">
            <button type="button" class="btn btn-outline-primary btn-sm me-2 backendBtn"
              @click="() => openCoupon('edit', item)">編輯</button>
            <button type="button" class="btn btn-outline-danger btn-sm" @click="() => openCoupon('delete', item)"
              style="padding: 0.25rem 0.5rem;">刪除</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="row">
      <div class="col">
        <!-- <Pagination ></Pagination> -->
      </div>

    </div>
  </div>

  <!-- del modal -->
  <!-- <DelModal></DelModal> -->
</template>

<script>
// import Pagination from '@/components/Pagination.vue'
// import DelModal from '@/components/DelModal.vue'
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
    // Pagination,
    // DelModal
  },
  methods: {
    getCoupons (page = 1) {
      const url = `${VITE_URL}/api/${VITE_PATH}/admin/coupons?page=${page}`
      this.isLoading = true
      this.axios.get(url).then((res) => {
        this.coupons = res.data.coupons
        this.pagination = res.data.pagination
        this.isLoading = false
      })
    }
  },
  mounted () {
    this.getCoupons()
  }
}
</script>
