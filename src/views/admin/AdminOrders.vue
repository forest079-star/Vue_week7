<template>
  <div>訂單管理</div>
</template>
<!-- <template>
  <h1 class="h3">訂單管理</h1>
  <div class="d-flex justify-content-between align-content-center mt-4">
    <p>本頁有{{ products.length }}項產品</p>
    <button type="button" class="btn btn-primary" @click="openModal('new')">建立新的產品</button>
  </div>
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

        <li class="page-item" :class="{ active: pagination.current_page === page }" v-for="page in pagination.total_pages"
          :key="page + `page`">
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
</template>
<script>
const {VITE_URL, VITE_PATH} = import.meta.env
export default {
  data() {
    return {
      orders: [],
      pagination: {},
      isLoading: false,
      tempOrder: {},
    }
  },
  methods: {


  },
  mounted() {

  },
}
</script>
<style lang="scss"></style> -->