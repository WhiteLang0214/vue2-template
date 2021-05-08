
import { get, post } from './axios'
import { debounce, throttle } from './loash'

export default {
  install(Vue) {
    Vue.prototype.$get = get
    Vue.prototype.$post = post
    Vue.prototype.$debounce = debounce
    Vue.prototype.$throttle = throttle
  }
}
