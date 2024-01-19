import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router/auto'
import './style.scss'
import App from './App.vue'

const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    extendRoutes(routes) {
        // routes.push({
        //     path: '/',
        //     redirect: '/codec'
        // })
        return routes
    },
})

console.log(router.getRoutes())

createApp(App)
    .use(router)
    .mount('#app')
