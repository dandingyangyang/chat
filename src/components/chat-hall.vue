<template>
    <div class="chat-hall">
        <logout></logout>
        <div class="icon"></div>
        <input ref="input" v-model="inputValue" class="my-input" type="text" @keypress="submit" placeholder="请输入聊天内容">
        <div class="total">当前在线人数：{{total}}人</div>
        <div class="list-wrapper">
            <template v-for="(msg, index) in msgList">
                <p :key="index" v-if="msg.type === 'chat'"><span class="user-name">{{msg.name}}:</span>{{msg.content}}</p>
                <p :key="index" v-else-if="msg.type === 'join'"><span class="user-name">{{msg.name}}:</span>加入了群聊</p>
                <p :key="index" v-else-if="msg.type === 'out'"><span class="user-name">{{msg.name}}:</span>退出了群聊</p>
            </template>
        </div>
    </div>
</template>

<script>
import {
    getMessageFromServer,
    sendMessageToServer,
    emitUserAddIn,
    listenUserAddIn,
    emitUserOut,
    listenUserOut,
    offUserAddIn,
    offUserOut
} from '../socket';
import Logout from './logout.vue';
import utils from '../utils';
const { chat, join, out } = utils;
export default {
    data () {
        return {
            inputValue: '',
            msgList: [],
            chat: chat,
            join: join,
            out: out,
            userInfo: this.$store.state.userInfo,
        };
    },
    computed: {
        total () {
            return this.$store.state.userInfo.total;
        }
    },
    components: {
        Logout
    },
    mounted () {
        this.initEvent();
        if (!JSON.parse(localStorage.getItem('hasEmitAddIn'))) {
            emitUserAddIn(this.userInfo);
            localStorage.setItem('hasEmitAddIn', 1);
        }
        this.getChatListory();
    },
    beforeDestroy () {
        //  刷新页面不会执行 beforeDestroy
        emitUserOut(this.userInfo);
        localStorage.setItem('hasEmitAddIn', 0);
        localStorage.setItem('chatHistory', 0);
        offUserAddIn();
        offUserOut();
    },
    methods: {
        initEvent () {
            getMessageFromServer((data) => {
                this.addChatHistory(data);
            });
            listenUserAddIn(this.userAddIn);
            listenUserOut(this.userOut);
        },
        submit (event) {
            if (event.keyCode === 13) {
                this.sendData();
                this.collectInput();
                this.clearInput();
            }
        },
        sendData () {
            sendMessageToServer({
                type: this.chat,
                name: this.userInfo.name,
                content: this.$refs.input.value
            });
        },
        collectInput () {
            this.addChatHistory({
                type: this.chat,
                name: this.userInfo.name,
                content: this.inputValue
            });
        },
        clearInput () {
            this.inputValue = '';
        },
        userAddIn (userInfo) {
            this.addChatHistory({
                type: this.join,
                name: userInfo.name
            });
            this.$store.commit('setUserInfo', userInfo);
        },
        userOut (userInfo) {
            this.addChatHistory({
                type: this.out,
                name: userInfo.name
            });
            this.$store.commit('setUserInfo', userInfo);
        },
        getChatListory () {
            this.msgList = JSON.parse(localStorage.getItem('chatHistory')) || [];
        },
        addChatHistory (msg) {
            this.msgList.push(msg);
            const chatHistoryStr = localStorage.getItem('chatHistory');
            const chatHistoryArr = chatHistoryStr && JSON.parse(chatHistoryStr) || [];
            chatHistoryArr.push(msg);
            const newHistoryStr = JSON.stringify(chatHistoryArr);
            localStorage.setItem('chatHistory', newHistoryStr);
        }
    }
};
</script>

<style lang="scss">
.chat-hall {
    .icon {
        float: left;
        margin-top: 4px;
        width: 20px;
        height: 20px;
        background-size: 20px 20px;
        background-image: url('../assets/images/keyboard.png');
    }
    .chat-hall {
        padding: 10px;
        width: 100%;
        height: 500px;
        background: white;
        overflow: auto;
    }
    .list-wrapper {
        margin-top: 20px;
        padding: 10px;
        min-height: 300px;
        border: 1px solid #e3e3e3;
        p {
            padding: 5px;
        }
        .user-name {
            font-weight: bold;
            margin-right: 4px;
        }
    }
   .my-input {
        background-color: #d2eafb;
        height: 30px;
        line-height: 30px;
        margin-left: 10px;
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
    .total {
        margin-top: 10px;
    }
}
    
</style>

