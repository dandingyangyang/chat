export default {
    setUserInfo: (state, userInfo) => {
        state.userInfo = userInfo;
    },
    setLoginState: (state, loginState) => {
        state.isLogin = loginState;
    }
};
