import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter);

let router = new VueRouter({
    mode: 'history',
    routes: [
        {
            path: '/login', 
            name: 'GettingStarted', 
            component: () => import('@/views/GettingStarted/GettingStarted.vue'),
            meta: {
                guest: true
            }
        },
        {
            path: '/', 
            name: 'Overview', 
            component: () => import('@/views/Overview/Overview.vue'),
            meta: {
                requiresAuth: true
            },
            children: [
                {
                    path: '',
                    name: 'NewsFeed',
                    component: () => import('@/views/NewsFeed/NewsFeed.vue'),
                },
                {
                    path: '/personal',
                    name: 'Personal',
                    component: () => import('@/views/Personal/PersonalPage.vue'),
                }
            ]
        },
    ]
})

// Meta Handling
router.beforeEach((to, from, next) => {
    // Check router bắt buộc phải có Authen
    let token = Vue.cookie.get('jwtToken');
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (token == null) {
            next({
                path: '/login',
                params: { nextUrl: to.fullPath }
            })
        } else {
            next();
        }
    } else if (to.matched.some(record => record.meta.guest)) {
        if (token == null) {
            next()
        } else {
            next({ name: 'Overview' })
        }
    } else {
        next()
    }
})

export default router