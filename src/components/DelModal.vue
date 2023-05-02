<template>
  <div class="modal fade" id="delProductModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true"
      ref="modal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title">
              <span>刪除</span>
            </h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p class="fs-6">是否要刪除<span class="text-danger mx-1 fw-bold">{{ temProduct.title}}</span>(刪除後將無法恢復)。</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-gray" @click="$emit('cancel-product', 'del')">取消</button>
            <button type="button" class="btn btn-outline-danger" @click="$emit('del-product')">確認</button>
          </div>
        </div>
      </div>
    </div>
</template>
<script>
import modalMixin from '@/mixins/modalMixin'
export default {
  props: ['temProduct'],
  data () {
    return {
      modal: ''
    }
  },
  emits: ['cancel-product', 'del-product'],
  mixins: [modalMixin]
}
</script>
<style lang="scss">

</style>
