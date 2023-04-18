<template>
  <nav aria-label="Page navigation example">
    <ul class="pagination">

      <li class="page-item" :class="{ disabled: !pagination.has_pre }">
        <a class="page-link" href="#" aria-label="Previous" @click.prevent="updatePage(pagination.current_page - 1)"
          :disabled="isLoading">
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>

      <li class="page-item" :class="{ active: page === pagination.current_page  }" v-for="page in pagination.total_pages"
        :key="page + `page`">
        <span class="page-link" v-if="page === pagination.current_page">{{ page }}</span>
        <a class="page-link" href="#" v-else @click.prevent="() => $emit('change-page', page)">{{ page }}</a>
      </li>

      <li class="page-item" :class="{ disabled: !pagination.has_next }">
        <a class="page-link" href="#" aria-label="Next" @click.prevent="updatePage(pagination.current_page + 1)" :disabled="isLoading" >
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>

    </ul>
  </nav>
</template>

<script>
export default {
  props:['pagination' , 'isLoading'],
  methods: {
    updatePage(page){
      this.$emit('change-page', page)
    }
  },

}
</script>