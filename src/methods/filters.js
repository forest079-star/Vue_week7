export function date (time) {
  const localDate = new Date(time * 1000)
  return localDate.toLocaleDateString()
}

export function unixTime (time) {
  const localTime = Math.floor(new Date(time) / 1000)
  return localTime
}

// export const filtersPlugin = {
//   install(app) {
//     app.config.globalProperties.$filters = {
//       unixDate
//     }
//   }
// }
