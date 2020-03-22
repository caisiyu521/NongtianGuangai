//app.js

import mqtt from './utils/mqtt.js';

const host = 'wxs://n69ftrd.mqtt.iot.gz.baidubce.com:443/mqtt';   //host
// const host = 'wxs://118.178.59.37/mqtt';   //host
const options = {
    protocolVersion: 4, //MQTT连接协议版本
    clientId: randomString(5),  //随机ID
    clean: true,
    username: 'n69ftrd/admin',
    password: 'NKp9CWd2pzVmKdeO',
    reconnectPeriod: 1000,
    connectTimeout: 30 * 1000,
    resubscribe: true
};

App({
    onLaunch: function () {

    },
    globalData: {
        Timer_Jishi: 10000,
        client: mqtt.connect(host, options),
        // client_ID: "WeChat",
        // client: mqtt.connect(host, options)
    },
})

function randomString(len) {
    len = len || 32;
    var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    var maxPos = $chars.length;
    var pwd = '';
    for (let i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}