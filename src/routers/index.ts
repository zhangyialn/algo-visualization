import { createRouter, createWebHistory } from "vue-router";

const routes = [
    {
        path: "/",
        name: "root",
        component: () => import('../components/root.vue')
    },
    {
        path: "/bubbleSort",
        name: "bubbleSort",
        component: () => import('../components/BubbleSort.vue'),
    },
    {
        path: "/mst",
        name: "mst",
        component: () => import('../components/Mst.vue'),
    },
    {
        path: "/huffman",
        name: "huffman",
        component: () => import('../components/Huffman.vue'),
    },
    {
        path: "/hanoi",
        name: "hanoi",
        component: () => import('../components/Hanoi.vue'),
    },
    {
        path: "/checkerboardCover",
        name: "checkerboardCover",
        component: () => import('../components/checkerboardCover.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!isLoggedIn()) {
            next({
                path: '/',
                query: { redirect: to.fullPath }
            })
        } else {
            next()
        }
    } else {
        next()
    }
})

const isLoggedIn = () => {
    return !!localStorage.getItem('account')
}


export default router