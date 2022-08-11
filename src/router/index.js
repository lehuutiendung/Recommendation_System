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
            path: '/change-password/:id', 
            name: 'ChangePassword', 
            component: () => import('@/views/GettingStarted/ChangePassword.vue'),
        },
        {
            path: '/', 
            component: () => import('@/views/Overview/Overview.vue'),
            meta: {
                requiresAuth: true
            },
            children: [
                {
                    path: '',
                    name: 'NewsFeed',
                    component: () => import('@/views/NewsFeed/NewsFeed.vue'),
                }
            ]
        },
        {
            path: '/personal',
            name: 'Personal',
            redirect: '/personal/:id',
            component: () => import('@/views/Personal/PersonalPage.vue'),
            meta: {
                requiresAuth: true
            },
            children: [
                {
                    path: '/personal/:id',
                    name: 'Personal.TabTimelinePersonal',
                    component: () => import('@/views/Personal/ListTabView/TabTimeline.vue'),
                },
                {
                    path: '/personal/:id/about',
                    name: 'Personal.TabAboutPersonal',
                    component: () => import('@/views/Personal/ListTabView/TabAbout.vue'),
                },
                {
                    path: '/personal/:id/library',
                    name: 'Personal.TabLibraryPersonal',
                    component: () => import('@/views/Personal/ListTabView/TabLibrary.vue'),
                },
                {
                    path: '/personal/:id/friends',
                    redirect: '/personal/:id/friends/all',
                    name: 'Personal.TabFriendPersonal',
                    component: () => import('@/views/Personal/ListTabView/TabFriend.vue'),
                    children: [
                        {
                            path: '/personal/:id/friends/all',
                            name: 'TabAllFriend',
                            component: () => import('@/views/Personal/ListTabView/SubTabFriend/TabAllFriend.vue'),
                        },
                    ]
                },
            ]
        },
        {
            path: '/group',
            name: 'OverviewGroup',
            component: () => import('@/views/Group/OverviewGroup.vue'),
            meta: {
                requiresAuth: true
            },
        },
        {
            path: '/group/create',
            name: 'AddGroup',
            component: () => import('@/views/Group/AddGroup.vue'),
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/group/:id',
            redirect: '/group/:id/about',
            name: 'GroupDetail',
            component: () => import('@/views/Group/GroupDetail.vue'),
            meta: {
                requiresAuth: true
            },
            children: [
                {
                    path: '/group/:id',
                    name: 'GroupDetail.TabDiscussionGroup',
                    component: () => import('@/views/Group/ListTabView/TabDiscussion.vue'),
                },
                {
                    path: '/group/:id/about',
                    name: 'GroupDetail.TabGeneralGroup',
                    component: () => import('@/views/Group/ListTabView/TabGeneral.vue'),
                },
                {
                    path: '/group/:id/member',
                    name: 'GroupDetail.TabMemberGroup',
                    component: () => import('@/views/Group/ListTabView/TabMember.vue'),
                },
            ]
        },
        {
            path: '/post/:id',
            name: 'DetailPost',
            component: () => import('@/views/DetailPost/DetailPost.vue'),
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/chat',
            name: 'ChatMonitor',
            component: () => import('@/views/Chat/ChatMonitor.vue'),
            meta: {
                requiresAuth: true
            },
        },
        {
            path: '/video-call',
            name: 'VideoCall',
            component: () => import('@/views/VideoCall/VideoCall.vue'),
            meta: {
                requiresAuth: true
            },
        },
        {
            path: '/setting',
            name: 'Setting',
            component: () => import('@/views/Setting/ChangePassword.vue'),
            meta: {
                requiresAuth: true
            },
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