//index.js

var _wxcharts = require('../../plugins/wxcharts.js'); // 引入wx-charts.js文件
var util = require('../../utils/util.js');  
import mqtt from './../../utils/mqtt.js';
//获取应用实例
const app = getApp()

Page({
    data: {
        // client: null,
        value: {
            Humdlogo: './../images/shidu.png',
            HumdValue: 60,
            Templogo: './../images/temp.png',
            TempValue: 20,
        },
        Control_Value: [{
            Control_logo: './../images/lock_close.png',
            Control_Text: "点击开始灌溉",
            ButtonFlag: false
        }],
    },

    onReady: function () {
        var that = this;
        

        that.data.client = app.globalData.client;
        that.data.client.on('connect', that.ConnectCallback);
        that.data.client.on("message", that.MessageProcess);
        that.data.client.on("error", that.ConnectError);
        that.data.client.on("reconnect", that.ClientReconnect);
        that.data.client.on("offline", that.ClientOffline);

        that.graphShow()//展示一下数据

        console.log("ready")

        setTimeout(this.DaoJiShi, app.globalData.Timer_Jishi);      //设置每隔一秒执行一次倒计时函数。
        console.log("kaishi1jishi");
    },

    onLoad: function () {
        wx.setNavigationBarTitle({
            title: '农田灌溉系统'
        });
    },
    
    DaoJiShi: function () {
        var that = this;
        var time = util.formatTime(new Date());
        // console.log(Math.floor(Math.random()*100));
        this.graphShow()
        setTimeout(this.DaoJiShi, app.globalData.Timer_Jishi);
    },

    Guangai_Control: function() {
        var that = this;
        wx.vibrateLong();
        console.log("dainji");
        if (that.data.Control_Value[0].ButtonFlag == false){
            that.setData({
                'Control_Value[0].ButtonFlag': true,
                "Control_Value[0].Control_logo": './../images/lock_open.png',
                "Control_Value[0].Control_Text": '点击关闭灌溉',
            })
            that.data.client.publish('/cai/control', "{\"led\":1}", {
                qos: 1
            });
        }
        else {
            that.setData({
                'Control_Value[0].ButtonFlag': false,
                "Control_Value[0].Control_logo": './../images/lock_close.png',
                "Control_Value[0].Control_Text": '点击开启灌溉',
            })
            that.data.client.publish('/cai/control', "{\"led\":0}", {
                qos: 1
            });
        }

    },

    MessageProcess: function (topic, payload) {
        var that = this;
        var payload_string = payload.toString();
        console.log("收到的主题是：" + topic);
        console.log("内容是" + payload_string);

        var jsonObj = JSON.parse(payload_string);
        that.setData({
            'value.HumdValue': jsonObj.shidu,
            'value.TempValue': jsonObj.wendu,
        })
    },

    ConnectCallback: function (connack) {
        var that = this;
        wx.showToast({
            title: '连接成功'
        })
        wx.vibrateLong();
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!");
        that.data.client.subscribe('/cai/environment', {
            qos: 1
        });
    },

    ConnectError: function (error) {
        console.log(error)
    },

    ClientReconnect: function () {
        console.log("Client Reconnect")
    },

    ClientOffline: function () {
        console.log("Client Offline")
    },

    graphShow: function () {
        var random1 = Math.floor(Math.random() * 100),
            random2 = Math.floor(Math.random() * 100),
            random3 = Math.floor(Math.random() * 100),
            random4 = Math.floor(Math.random() * 100),
            random5 = Math.floor(Math.random() * 100),
            random6 = Math.floor(Math.random() * 100),
            random7 = Math.floor(Math.random() * 30),
            random8 = Math.floor(Math.random() * 30),
            random9 = Math.floor(Math.random() * 30),
            random10 = Math.floor(Math.random() * 30),
            random11 = Math.floor(Math.random() * 30),
            random12 = Math.floor(Math.random() * 30)
        let bar = {
            canvasId: 'yueEle',
            type: 'line',
            categories: ['11：10', '11：15', '11：20', '11：25', '11：30', '11：35'],
            series: [{
                name: '温度',
                data: [random1, random2, random3, random4, random5, random6],
                format: function (val) {
                    return val.toFixed(2) + '%';
                }
            }, {
                name: '湿度',
                    data: [random7, random8, random9, random10, random11, random12],
                format: function (val) {
                    return val.toFixed(2) + '℃';
                }
            }],
            yAxis: {
                title: '实时环境情况',
                format: function (val) {
                    return val.toFixed(2);
                },
                min: 0
            },
            width: 380,
            height: 200,
            dataLabel: true, // 是否在图表中显示数据内容值
            legend: true, // 是否显示图表下方各类别的标识
            extra: {
                lineStyle: 'curve' // (仅对line, area图表有效) 可选值：curve曲线，straight直线 (默认)
            }
        }
        new _wxcharts(bar)
    },
})
