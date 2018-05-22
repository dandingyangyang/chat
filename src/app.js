import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import routes from './routes';
import './socket';
import mutations from './mutation';
import checkLogin from './check-login';
Vue.use(VueRouter);
Vue.use(Vuex);

async function init () {
    const loginInfo = await checkLogin();
    console.log('loginInfo', loginInfo);
    const store = new Vuex.Store({
        state: {
            userInfo: {
                name: loginInfo.name,
                total: loginInfo.total
            },
            isLogin: loginInfo.is_login
        },
        mutations
    });
    const router = new VueRouter({
        mode: 'history',
        routes
    });
    router.beforeEach((to, from, next) => {
        if (to.meta.requireAuth && !store.state.isLogin) {
            next({
                path: '/login'
            });
        } else {
            next();
        }
    });
    new Vue({
        router,
        store,
        el: '#app',
        template: '<router-view :key="key"></router-view>',
        computed: {
            key () {
                // 使用key才能避免在复用组件的时候发生不执行生命周期函数的情况
                return this.$route.path;
            }
        },
        methods: {
            checkeLogin () {
                if (!this.$store.state.userInfo.name) {
                    this.$router.push('/login');
                }
            }
        }
    });
}

init();
