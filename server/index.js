const Koa = require('koa');
const _ = require('koa-route');
const webpack = require('webpack');
var historyApiFallback = require('koa2-history-api-fallback');
const config = require('../build/config');
const devCongfig = require('../build/webpack.dev.config');
const koaWebpack = require('koa-webpack');
const socketIO = require('socket.io');
const _debug = require('debug')('info');
const { port, host } = config.dev;
const app = new Koa();
const bodyParser = require('koa-bodyparser');
const errNo = require('./err_no');
const fs = require('fs');
const path = require('path');
const cookieHelper = require('koa-ws-cookie-helper');

const utils = require('./utils');
const { getFileContentByPath, saveFileContentByPath } = utils;

const resolveDbPath = filename => {
    return path.resolve(__dirname, 'db', filename);
};

const userInfoURL = resolveDbPath('user-info.js');
const userNameListURL = resolveDbPath('user-name-list.js');
const userSessionListURL = resolveDbPath('user-session-list.js');
const accountURL = resolveDbPath('account.js');

const userInfoContent = getFileContentByPath(userInfoURL);
const userInfo = userInfoContent ? JSON.parse(userInfoContent) : {};

const userNameListContent = getFileContentByPath(userNameListURL);
const userNameList = userNameListContent ? JSON.parse(userNameListContent) : [];

const userSessionListContent = getFileContentByPath(userSessionListURL);
const userSessionList = userSessionListContent
    ? JSON.parse(userSessionListContent)
    : [];

const accountContent = getFileContentByPath(accountURL);
const account = accountContent ? JSON.parse(accountContent) : {};

// 如果_debug.enabled为false则不会打印
_debug.enabled = true;

var server = require('http').Server(app.callback());
// 注意挂载要写在所有app.use之前
var io = socketIO(server);

io.on('connection', socket => {
    socket.on('message', event => {
        _debug('server-side receive message:', event);
        socket.broadcast.emit('message-from-server', event);
    });
    socket.on('user-add-in', userInfo => {
        _debug('user add in');
        userInfo.total = userSessionList.length;
        io.emit('user-add-in', userInfo);
    });
    socket.on('user-out', userInfo => {
        _debug('user out');
        console.log('userSessionList', userSessionList);
        userInfo.total = userSessionList.length;
        io.emit('user-out', userInfo);
    });
    socket.on('disconnect', reason => {
        _debug('disconnected reason:', reason);
    });
});

app.use(bodyParser());
// 注册接口
app.use(
    _.post('/api/register/', function(ctx, next) {
        ctx.response.set('Content-Type', 'application/json');
        const name = ctx.request.body.name;
        const password = ctx.request.body.password;
        if (account[name]) {
            ctx.response.body = JSON.stringify({
                err_no: 3,
                err_tip: errNo[3]
            });
            return;
        } else {
            const newSessionId = new Buffer(name).toString('base64');
            account[name] = password;
            userSessionList.push(newSessionId);
            userNameList.push(name);
            userInfo[newSessionId] = name;

            saveFileContentByPath(userSessionListURL, userSessionList);
            saveFileContentByPath(userInfoURL, userInfo);
            saveFileContentByPath(userNameListURL, userNameList);
            saveFileContentByPath(accountURL, account);

            ctx.cookies.set('sessionId', newSessionId, {
                maxAge: 10 * 60 * 1000
            });

            ctx.response.body = JSON.stringify({
                err_no: 0,
                data: {
                    name,
                    total: userSessionList.length
                }
            });
        }
    })
);
// 登录接口
app.use(
    _.post('/api/login/', function(ctx, next) {
        ctx.response.set('Content-Type', 'application/json');
        const sessionId = ctx.cookies.get('sessionId');
        // 已经登陆过了
        if (userSessionList.indexOf(sessionId) > -1) {
            ctx.response.body = JSON.stringify({
                err_no: 1,
                err_tip: errNo[1]
            });
        } else {
            const name = ctx.request.body.name;
            const password = ctx.request.body.password;
            if (account[name] !== password) {
                ctx.response.body = JSON.stringify({
                    err_no: 2,
                    err_tip: errNo[2]
                });
                return;
            }
            const newSessionId = new Buffer(name).toString('base64');
            userSessionList.push(newSessionId);
            userNameList.push(name);
            userInfo[newSessionId] = name;

            saveFileContentByPath(userSessionListURL, userSessionList);
            saveFileContentByPath(userInfoURL, userInfo);
            saveFileContentByPath(userNameListURL, userNameList);
            ctx.cookies.set('sessionId', newSessionId, {
                // 单位是ms
                maxAge: 10 * 60 * 1000
            });

            ctx.response.body = JSON.stringify({
                err_no: 0,
                data: {
                    name: ctx.request.body.name,
                    total: userSessionList.length
                }
            });
        }
    })
);
// 登出接口
app.use(
    _.post('/api/logout', function(ctx, next) {
        ctx.response.set('Content-Type', 'application/json');
        const sessionId = ctx.cookies.get('sessionId');
        console.log('--logout--sessionId', sessionId);
        const index = userSessionList.indexOf(sessionId);
        console.log('index', index);
        if (index > -1) {
            userSessionList.splice(index, 1);
            const name = userInfo[sessionId];
            if (name) {
                delete userInfo[sessionId];
                const nameIndex = userNameList.indexOf(name);
                userNameList.splice(nameIndex, 1);
            }
            saveFileContentByPath(userSessionListURL, userSessionList);
            saveFileContentByPath(userInfoURL, userInfo);
            saveFileContentByPath(userNameListURL, userNameList);
        }
        ctx.cookies.set('sessionId', '');
        ctx.response.body = JSON.stringify({
            err_no: 0,
            data: {
                is_login: 0,
                name: ''
            }
        });
    })
);
// 检查登录状态接口
app.use(
    _.get('/api/check-login', function(ctx, next) {
        ctx.response.set('Content-Type', 'application/json');
        const sessionId = ctx.cookies.get('sessionId');
        if (userSessionList.indexOf(sessionId) > -1) {
            ctx.response.body = JSON.stringify({
                err_no: 0,
                data: {
                    is_login: 1,
                    name: userInfo[sessionId],
                    total: userSessionList.length
                }
            });
        } else {
            ctx.response.body = JSON.stringify({
                err_no: 0,
                data: {
                    is_login: 0,
                    name: '',
                    total: userSessionList.length
                }
            });
        }
    })
);

app.use(historyApiFallback());
if (process.env.NODE_ENV === 'development') {
    const compiler = webpack(devCongfig);
    app.use(
        koaWebpack({
            compiler,
            dev: {},
            hot: false
        })
    );
}
server.listen(port, err => {
    if (err) {
        _debug('err:', err);
    }
    _debug(`外网访问: http://${host}:${port}`);
    _debug(`本机测试: http://localhost:${port}`);
});
