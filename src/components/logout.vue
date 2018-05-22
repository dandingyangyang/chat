<template>
    <div class="logout-wrapper clearfix">
        <div class="user">
            <span class="user-name">{{name}}</span>你好~
        </div>
        <div class="logout" @click="logout">退出登录</div>
    </div>
</template>

<script>
import utils from '../utils';
const { post } = utils;
module.exports = {
    data () {
        return {
            name: this.$store.state.userInfo.name
        };
    },
    methods: {
        logout () {
            post('/api/logout').then((data) => {
                this.$store.commit('setUserInfo', {name: ''});
                this.$store.commit('setLoginState', false);
                this.$router.push('/login');
            });
        }
    }
};
</script>
<style lang="scss">
    @import '../scss/index.scss';
    .user {
        float: left;
        .user-name {
            font-size: 20px;
            font-family: MyriadPro-BoldIt;
            color: #FF6534;
            margin-right: 10px;
            line-height: 36px;
            height: 36px;
        }
    }
    .logout {
        float: right;
        background: #999;
        padding: 7px 17px;
        border-radius: 2px;
        color: white;
        cursor: pointer;
    }
</style>
