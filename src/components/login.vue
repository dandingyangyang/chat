<template>
    <div class="login-wrapper">
        <div class="login">
            <div class="hint mr-10">请输入你的昵称</div>
            <input type="text" class="nick-name login-input" v-model="nickName">
            <div class="hint mr-10">请输入密码</div>
            <input type="text" class="nick-name login-input" v-model="password">
            <div class="submit" @click="submit">确定</div>
            <router-link to="/register" v-if="!isRegister" class="register">注册</router-link>
        </div>
    </div>
</template>

<script>
import utils from '../utils';
const { post } = utils;
module.exports = {
    data () {
        return {
            nickName: '',
            password: '',
            isRegister: this.$route.path === '/register'
        };
    },
    beforeRouteEnter: (to, from, next) => {
        next(vm => {
            console.log('beforeRouteEnter');
            if (vm.$store.state.isLogin) {
                console.log('isLogin');
                vm.$router.push('/');
            }
        });
    },
    mounted () {
        console.log('isRegister', this.isRegister);
    },
    methods: {
        submit () {
            
            const URL = this.isRegister ? '/api/register/' : '/api/login/';
            const data = { name: this.nickName, password: this.password};
            post(URL, data).then((resp) => {
                console.log('resp', resp);
                this.$store.commit('setUserInfo', { name: this.nickName, total: resp.total });
                this.$store.commit('setLoginState', true);
                this.$router.push('/');
            });
        },
    }
};
</script>
<style  lang="scss">
    .login-wrapper {
        position: relative;
        width: 100%;
        height: 100%;
        .login {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
        .hint {
            text-align: center;
        }
        .submit {
            margin-top: 20px;
            width: 100%;
            height: 30px;
            line-height: 30px;
            color: white;
            background: #FF6534;
            border-radius: 2px;
            text-align: center;
            &:hover {
                opacity: 0.8;
                cursor: pointer;
            }
        }
        .login-input {
            background-color: #d2eafb;
            height: 30px;
            line-height: 30px;
            width: 300px;
            &::-webkit-input-placeholder { /* WebKit browsers */
                color: #f8f8f8;
            }
            &:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
                color: #f8f8f8;
            }
            &::-moz-placeholder { /* Mozilla Firefox 19+ */
                color: #f8f8f8;
            }
            &:-ms-input-placeholder { /* Internet Explorer 10+ */
                color: #f8f8f8;
            }
        }
        .register {
            float: right;
            text-decoration: none;
            margin-top: 10px;
        }
    }
   
</style>

