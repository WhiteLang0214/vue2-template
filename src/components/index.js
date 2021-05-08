
function changStr(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
export default {
  install(Vue) {
    const requireAll = require.context('.', true, /\.vue$/)
    requireAll.keys().forEach((item) => {
      Vue.component(
        changStr(item.replace(/\.\//, '').replace(/\.vue$/, '')),
        requireAll(item).default
      )
    })
  },
}
