export function date (time) {
  const localDate = new Date(time * 1000)
  return localDate.toLocaleDateString()
}

// export const filtersPlugin = {
//   install(app) {
//     app.config.globalProperties.$filters = {
//       unixDate
//     }
//   }
// }
