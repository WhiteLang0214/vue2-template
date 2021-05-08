import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import globalComponent from '@/components'
import utils from '@/utils'

console.log('globalComponent----', globalComponent);

Vue.use(globalComponent)
Vue.use(utils)

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
