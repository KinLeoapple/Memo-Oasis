import {createRouter, createWebHistory} from "vue-router";
import Home from "@/components/home/Home.vue";
import Admin from "@/components/admin/Admin.vue";

// 2. 定义一些路由
// 每个路由都需要映射到一个组件。
// 我们后面再讨论嵌套路由。
const routes = [
    { path: '/', component: Home },
    { path: '/admin', component: Admin },
]

// 3. 创建路由实例并传递 `routes` 配置
// 你可以在这里输入更多的配置，但我们在这里
// 暂时保持简单
const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router;