import ChatHall from './components/chat-hall.vue';
import Login from './components/login.vue';

export default [
    {
        path: '/',
        component: ChatHall,
        meta: {
            requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
        }
    },
    {
        path: '/login',
        component: Login,
        meta: {
            requireAuth: false // 添加该字段，表示进入这个路由是需要登录的
        }
    },
    {
        path: '/register',
        component: Login,
        meta: {
            requireAuth: false // 添加该字段，表示进入这个路由是需要登录的
        }
    }
];
