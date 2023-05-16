import Swal from 'sweetalert2'

const Toast = Swal.mixin({
  toast: true,
  showConfirmButton: false,
  position: 'top-end',
  timer: 2000
})
export { Toast, Swal }
