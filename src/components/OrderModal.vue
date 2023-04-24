<template>
  <div class="modal fade" id="orderModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" ref="modal">
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header bg-dark text-white">
            <h5 class="modal-title" id="exampleModalLabel">
              <span>訂單細節</span>
            </h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-4">
                <h3>用戶資料</h3>
                <table class="table">
                  <tbody v-if="tempOrder.user">
                    <tr>
                      <th>姓名</th>
                      <td>{{ tempOrder.user.name }}</td>
                    </tr>
                    <tr>
                      <th>Email</th>
                      <td>{{ tempOrder.user.email }}</td>
                    </tr>
                    <tr>
                      <th>電話</th>
                      <td>{{ tempOrder.user.tel }}</td>
                    </tr>
                    <tr>
                      <th>地址</th>
                      <td>{{ tempOrder.user.address }}</td>
                    </tr>
                    <tr v-if="tempOrder.message">
                      <th>留言</th>
                      <td>{{ tempOrder.message }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="col-8">
                <h3>訂單細節</h3>
                <table class="table">
                  <tbody>
                    <tr>
                      <th>訂單編號</th>
                      <td>{{ tempOrder.id }}</td>
                    </tr>
                    <tr>
                      <th>下單時間</th>
                      <td>{{ $filters.date(tempOrder.create_at) }}</td>
                    </tr>
                    <tr>
                      <th>付款時間</th>
                      <td>
                        <span v-if="tempOrder.paid_date">
                          {{ tempOrder.paid_date }}
                        </span>
                        <span v-else>時間不正確</span>
                      </td>
                    </tr>
                    <tr>
                      <th>付款狀態</th>
                      <td>
                        <template class="form-check form-switch">
                          <label class="form-check-label" :for="`paidSwitch${tempOrder.id}`">
                            <strong v-if="tempOrder.is_paid" class="text-success">已付款</strong>
                            <strong v-else class="text-danger">未付款</strong>
                          </label>
                          <input
                            class="form-check-input"
                            type="checkbox"
                            :id="`paidSwitch${tempOrder.id}`"
                            v-model="tempOrder.is_paid"
                          />
                        </template>
                      </td>
                    </tr>
                    <tr>
                      <th>總金額</th>
                      <td>
                        ${{tempOrder.total}}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <h3>購買品項</h3>
                <table class="table">
                  <tbody>
                    <tr v-for="item in tempOrder.products" :key="item.id">
                      <th>
                        {{ item.product.title }}
                      </th>
                      <td>{{ item.qty }} / {{ item.product.unit }}</td>
                      <td class="text-end">
                        $ {{ tempOrder.total }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-gray" data-bs-dismiss="modal" @click="() => $emit('cancel-order')">取消</button>
            <button type="button" class="btn btn-primary" @click="() => $emit('update-order')">確認</button>
          </div>
        </div>
      </div>
    </div>
</template>
<script>
import modalMixin from '@/mixins/modalMixin'
// const { VITE_PATH, VITE_URL } = import.meta.env
export default {
  inject: ['$filters'],
  props: {
    order: {}
  },
  data () {
    return {
      isLoading: false,
      modal: '',
      tempOrder: {}
    }
  },
  emits: ['cancel-product', 'update-order'],
  mixins: [modalMixin],
  watch: {
    order () {
      this.tempOrder = this.order
    }
  }

}
</script>
