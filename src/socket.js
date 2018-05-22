import io from 'socket.io-client';

const socket = io('ws://localhost:8111');

export const getMessageFromServer = callback => {
    socket.on('message-from-server', data => {
        callback(data);
    });
};

export const sendMessageToServer = data => {
    socket.send(data);
};

export const emitUserAddIn = userInfo => {
    socket.emit('user-add-in', userInfo);
};

export const listenUserAddIn = callback => {
    socket.on('user-add-in', data => {
        callback(data);
    });
};

export const emitUserOut = userInfo => {
    socket.emit('user-out', userInfo);
};

export const listenUserOut = callback => {
    socket.on('user-out', data => {
        callback(data);
    });
};

export const offUserAddIn = () => {
    socket.removeAllListeners('user-add-in');
};

export const offUserOut = () => {
    socket.removeAllListeners('user-out');
};
