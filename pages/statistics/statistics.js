const app = getApp();
const checkInBiz = require('../../biz/checkInBiz.js');
const util = require('../../utils/util.js');

let that;
let checkInDate = []; // 已经签到的日期
Page({
    data: {
        selectedDate: '', //选中的几月几号
        selectedWeek: '', //选中的星期几
        curYear: 2017, //当前年份
        curMonth: 0, //当前月份
        daysCountArr: [ // 保存各个月份的长度，平年
            31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31
        ],
        weekArr: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
        days: ['日', '一', '二', '三', '四', '五', '六'],
        dateList: [],
        statistics: [],
    },
    onLoad: function(options) {
        that = this;
        console.log('options: ' + options.params);
        let hobby = JSON.parse(options.params);

        wx.setNavigationBarTitle({
            title: hobby.hobbyName + '统计'
        });

        that.getStatisticsInfo(hobby);
    },
    getStatisticsInfo: function(hobby) {
        checkInBiz.getCheckInDaysById(hobby,
            function success(checkInDays) {
                checkInDate = checkInDays.hobbyInfo.myCheckInDays;
                that.data.statistics.push(checkInDays.maximumDays);
                that.data.statistics.push(checkInDays.checkInAllDays);
                that.data.statistics.push(checkInDays.checkInContinuousDays);
                that.data.statistics.push(checkInDays.allUserCount);
                that.data.statistics.push(checkInDays.allUserTodayCheckInCount);
                that.setData({
                    statistics: that.data.statistics,
                });
                that.drawCalendar();
            });
    },
    drawCalendar: function() {
        var today = new Date(); //当前时间
        var y = today.getFullYear(); //年 
        var mon = today.getMonth() + 1; //月  
        var d = today.getDate(); //日  
        var i = today.getDay(); //星期  
        this.setData({
            curYear: y,
            curMonth: mon,
            selectedDate: y + '-' + mon + '-' + d,
            selectedWeek: this.data.weekArr[i]
        });
        this.getDateList(y, mon - 1);
    },
    getDateList: function(y, mon) {
        var vm = this;
        //如果是否闰年，则2月是29日
        var daysCountArr = this.data.daysCountArr;
        if (y % 4 == 0 && y % 100 != 0) {
            this.data.daysCountArr[1] = 29;
            this.setData({
                daysCountArr: daysCountArr
            });
        }
        //第几个月；下标从0开始实际月份还要再+1  
        var dateList = [];
        dateList[0] = [];
        var weekIndex = 0; //第几个星期
        for (var i = 0; i < vm.data.daysCountArr[mon]; i++) {
            var week = new Date(y, mon, (i + 1)).getDay();
            // 如果是新的一周，则新增一周
            if (week == 0) {
                weekIndex++;
                dateList[weekIndex] = [];
            }

            let value = y + '-' + (mon + 1) + '-' + (i + 1);
            let date = new Date();
            date.setFullYear(y);
            date.setMonth(mon);
            date.setDate((i + 1));
            date.setHours(0);
            date.setMinutes(0);
            date.setSeconds(0);
            date.setMilliseconds(0);
            let valueStamp = Date.parse(date) / 1000;

            // -1.未来日期 0.缺签到 1.已签到 
            let checkIn = valueStamp < util.formartTimestamp() ? 'inactive-date' : '';

            for (var index = 0; index < checkInDate.length; index++) {
                var cd = checkInDate[index];
                if (cd === valueStamp) {
                    checkIn = 'active-date';
                }
            }
            let item = {
                value: value,
                date: i + 1,
                week: week,
                isCheckIn: checkIn,
            };
            // 如果是第一行，则将该行日期倒序，以便配合样式居右显示
            if (weekIndex == 0) {
                dateList[weekIndex].unshift(item);
            } else {
                dateList[weekIndex].push(item);
            }
        }
        vm.setData({
            dateList: dateList
        });
    },
    selectDate: function(e) {
        var vm = this;
        vm.setData({
            selectedDate: e.currentTarget.dataset.date.value,
            selectedWeek: vm.data.weekArr[e.currentTarget.dataset.date.week]
        });
    },
    preMonth: function() {
        // 上个月
        var vm = this;
        var curYear = vm.data.curYear;
        var curMonth = vm.data.curMonth;
        curYear = curMonth - 1 ? curYear : curYear - 1;
        curMonth = curMonth - 1 ? curMonth - 1 : 12;
        vm.setData({
            curYear: curYear,
            curMonth: curMonth
        });

        vm.getDateList(curYear, curMonth - 1);
    },
    nextMonth: function() {
        // 下个月
        var vm = this;
        var curYear = vm.data.curYear;
        var curMonth = vm.data.curMonth;
        curYear = curMonth + 1 == 13 ? curYear + 1 : curYear;
        curMonth = curMonth + 1 == 13 ? 1 : curMonth + 1;
        // console.log('下个月', curYear, curMonth);
        vm.setData({
            curYear: curYear,
            curMonth: curMonth
        });

        vm.getDateList(curYear, curMonth - 1);
    }
});