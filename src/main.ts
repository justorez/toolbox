import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router/auto'
import App from './App.vue'
import './style.scss'
import eruda from 'eruda'

const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    extendRoutes(routes) {
        // routes.push({
        //     path: '/',
        //     redirect: '/codec'
        // })
        return routes
    }
})

const title = document.title
router.afterEach((to) => {
    if (to.meta?.title) {
        document.title = `${to.meta.title} | ${title}`
    }
})

createApp(App).use(router).mount('#app')

console.log(router.getRoutes())

if (import.meta.env.DEV) {
    eruda.init()
}
