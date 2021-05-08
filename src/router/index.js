import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const routerList = []

function importAll(r) {
    r.keys().forEach((key) => {
        routerList.push(r(key).default)
    })
}

importAll(require.context('./', true, /\.router\.js/))
const routes = [
    ...routerList,
]

const router = new Router({
    routes,
})

export default router
