/**
 * Created by gxx on 16/6/2.
 */
var FRIST_DATE = null;//初始年月日
var YEAR_NOW = null;//当前年
var MONTH_NOW = null;//当前月
var DAY_NOW = null;//当前日
var ISCLICK = true;//是否可以点击切换日期
var ISCLICKDAY = true;//是否可以点击选择日期
var CLICKTYPE = 'click';//点击类型
var INPUTTYPE = 'checkbox';//点击日期是否可以选择多个
var DATAARR = null;//传参日期数组
var ISACTOIN = false;//是否显示日期高亮
var HASARGUMENT = false;//判断有没有传参
var IS_SHOW_DAY_NOW = true;//默认当前日高亮
var DATAINTERVAL = null;//设置时间间隔(多少天可以点击)
var IS_SHOW_BTN = true;//显示不显示取消确定按钮
var clickArr = [];//高亮日期的集合
var IsClickArr = false// 判断有没有点击


function jyDate(ca) {
    var _date = new Date();
    this._year = _date.getFullYear();//年
    this._month = _date.getMonth();//月
    this._day = _date.getDate();//日
    this._week = _date.getDay();//星期
    var self = this;
    var odiv = document.querySelector(ca || '#jyDate');

    function init(config) {
        YEAR_NOW = self._year;
        MONTH_NOW = self._month + 1;
        DAY_NOW = self._day;
        FRIST_DATE = DATAARR = (YEAR_NOW + '-' + MONTH_NOW + '-' + DAY_NOW).split();
        clickArr = clickArr.concat(FRIST_DATE);
        if (config) {
            self._config(config);
            odiv.appendChild(self._create());
            change();
            return
        }
        odiv.appendChild(self._create());
        change();
    }

    function change() {
        if (!ISCLICK) {
            return false
        }
        click();
        var prev = document.querySelector('.jydaDe-prev');
        var next = document.querySelector('.jydaDe-next');
        var cancel = document.querySelectorAll('.jydaDe-btn a')[0];
        var ensure = document.querySelectorAll('.jydaDe-btn a')[1];
        next.addEventListener(CLICKTYPE, function () {
            odiv.innerHTML = '';
            odiv.appendChild(self._create(self.getYear(1), self.getMonth(1)));
            change()
        }, false);
        prev.addEventListener(CLICKTYPE, function () {
            odiv.innerHTML = '';
            odiv.appendChild(self._create(self.getYear(0), self.getMonth(0)));
            change()
        }, false);
        if (IS_SHOW_BTN) {
            cancel.addEventListener(CLICKTYPE, function () {
                console.log(clickArr);
            }, false)
            ensure.addEventListener(CLICKTYPE, function () {
                console.log(clickArr);
            }, false)
        }
    }


    function click() {
        var oinput = document.querySelectorAll('.day-row-div input');
        for (var i = 0, len = oinput.length; i < len; i++) {
            oinput[i].addEventListener(CLICKTYPE, function () {
                //if(clickArr.length==1){
                //    var data = clickArr[0].split('-');
                //    if (data[0] == YEAR_NOW && data[1] == MONTH_NOW && data[2] == DAY_NOW) {
                //        return false;
                //    }
                //}
                var clickDOM = YEAR_NOW + '-' + MONTH_NOW + '-' + this.value;
                var num = clickArr.indexOf(clickDOM);
                var indexOf = num == -1 ? true : false;
                this.checked && indexOf ? clickArr.push(clickDOM) : clickArr.splice(num, 1);
                IsClickArr = true;
            }, false)
        }

    }

    return {
        init: function (config) {
            init(config);
            return this
        },
        click: function (ca) {
            ca && ca()
        }
    };


}

/**
 * 简单的函数封装，执行callback
 * @param callback 执行的函数
 */
function next(callback) {
    callback && callback();
}


/**
 * 创建规则
 * @param config 规则
 * @returns
 */

jyDate.prototype._config = function (config) {
    if (config.data) {
        FRIST_DATE = DATAARR = config.data.split();
        var data = this.setData(FRIST_DATE)();
        YEAR_NOW = data.year[0];
        MONTH_NOW = data.month[0];
        DAY_NOW = data.day[0];

    }
    if (config.dataArr) {
        HASARGUMENT = true;
        DATAARR = config.dataArr;
        clickArr = clickArr.concat(DATAARR);
    }
    if (config.dataInterval) {
        HASARGUMENT = true;
        DATAINTERVAL = config.dataInterval;
    }
    ISCLICK = config.isChangMonth === false ? false : true;
    ISCLICKDAY = config.isClickDay === false ? false : true;
    IS_SHOW_DAY_NOW = config.isActiveToday === false ? false : true;
    IS_SHOW_BTN = config.isShowBtn === false ? false : true;
    CLICKTYPE = config.clickType || 'click';
    INPUTTYPE = config.inputType || 'checkbox';
};

/**
 * 设置年月日
 * @param dateArr 年月日数组
 */

jyDate.prototype.setDay = function (data) {
    var frist_year = FRIST_DATE[0].split('-')[0];
    var frist_month = FRIST_DATE[0].split('-')[1];
    var frist_day = FRIST_DATE[0].split('-')[2];
    if (!IsClickArr) {
        if (frist_year != YEAR_NOW) {
            return []
        }
        if (frist_month != MONTH_NOW) {
            return []
        }
        if (!HASARGUMENT || FRIST_DATE.length == 1) {
            return [DAY_NOW]
        }
    } else {
        var odataArr = {};
        if (!!data) {
            odataArr = new Date().date_to_timestamp(FRIST_DATE)();
        } else {
            odataArr = this.setData(clickArr)();
        }
        var year_now = odataArr.year;
        var month_now = odataArr.month;
        var day_now = odataArr.day;
        year_now.forEach(function (t, i) {
            if (YEAR_NOW != t) {
                delete day_now[i];
                return []
            }
        });
        month_now.forEach(function (t, i) {
            if (MONTH_NOW != t) {
                delete day_now[i];
                return []
            }
        });
        return day_now
    }
    ;

};

/**
 * 获取传过来的时间进行处理
 * @param data
 */
jyDate.prototype.setData = function (data) {
    var _dataArr_year = [], _dataArr_month = [], _dataArr_day = [];
    //var arr = ['-', ' ', ','];
    //for (var i = 0, len = arr.length; i < len; i++) {
    for (var j = 0, len = data.length; j < len; j++) {
        _dataArr_year.push(data[j].split('-')[0]);
        _dataArr_month.push(data[j].split('-')[1]);
        _dataArr_day.push(data[j].split('-')[2]);
        //if (data[j].split(arr[i]).length === 3) {
        //    break
        //}
    }
    //}
    return function () {
        return {
            year: _dataArr_year,
            month: _dataArr_month,
            day: _dataArr_day
        }
    };
    //console.log(_dataArr_year + '\n' + _dataArr_month + '\n' + _dataArr_day)
};

/**
 * 获得年份
 * @param type 年份
 * @returns {number}
 */

jyDate.prototype.getYear = function (type) {
    if (!type) {
        if (MONTH_NOW == 1) {
            YEAR_NOW--;
            return
        }
    } else {
        if (MONTH_NOW == 12) {
            YEAR_NOW++;
        }
    }
    return YEAR_NOW
};


/**
 * 获得月份
 * @param month 月份
 * @returns {number}
 */

jyDate.prototype.getMonth = function (type) {
    if (!type) {
        if (MONTH_NOW == 1) {
            MONTH_NOW = 12;
            return
        }
        MONTH_NOW--;
    } else {
        if (MONTH_NOW == 12) {
            MONTH_NOW = 1;
            return
        }
        MONTH_NOW++;
    }
    return MONTH_NOW
};

/**
 * 判断时间区域内能不能点击
 * @param year 年份
 * @returns {number}
 */

jyDate.prototype.is_click = function () {
};


/**
 * 获取时间戳
 * @param data
 * @returns {number}
 */
Date.prototype.date_to_timestamp = function (data) {
    var str = data.toString();
    var _dataArr_year = [], _dataArr_month = [], _dataArr_day = [];
    for (var i = 1; i <= DATAINTERVAL; i++) {
        _dataArr_year.push(new Date().get_to_timestamp(str, i, 1));
        _dataArr_month.push(new Date().get_to_timestamp(str, i, 2));
        _dataArr_day.push(new Date().get_to_timestamp(str, i, 3));
    }
    return function () {
        return {
            year: _dataArr_year,
            month: _dataArr_month,
            day: _dataArr_day
        }
    };
};

/**
 * 提取时间
 * @param data
 * @returns {Function}
 */
Date.prototype.get_to_timestamp = function (str, data, num) {
    var newdata = new Date(new Date(str.replace(/-/g, '/')).getTime() + (24 * 60 * 60 * 1000) * data);
    if (num == 1) {
        return newdata.getFullYear();
    }
    if (num == 2) {
        return newdata.getMonth() + 1;
    }
    else {
        return newdata.getDate();
    }
};

/**
 * 判断是不是润年
 * @param year 年份
 * @returns {number}
 */

jyDate.prototype.is_leap = function () {
    return (YEAR_NOW % 100 == 0 ? res = (YEAR_NOW % 400 == 0 ? 1 : 0) : res = (YEAR_NOW % 4 == 0 ? 1 : 0));
};

/**
 * 定义个数组取得每个月的总天数
 * @param year 年份
 * @returns {Array}
 */
jyDate.prototype.m_days = function () {
    return [31, 28 + this.is_leap(YEAR_NOW), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
};

/**
 * 获取当前月的第一天是星期几
 * @param year 年份
 * @param month 月份
 * @returns {number}
 */
jyDate.prototype.firstday = function () {
    return new Date(YEAR_NOW, (MONTH_NOW - 1), 1).getDay();
};


/**
 * 设置当前行数
 * @param year 年份
 * @param month 月份
 * @returns {number}
 */
jyDate.prototype.tr_str = function () {
    return Math.ceil((this.m_days()[MONTH_NOW - 1] + this.firstday()) / 7);
};

/**
 * 对比2个数组,取相同的数
 * @param arr1
 * @param arr2
 * @private
 */
jyDate.prototype._comparArr = function (arry1, arry2) {

};

/**
 * 创建取消按钮和点击按钮
 * @returns {DocumentFragment}
 * @private
 */
jyDate.prototype._createBtn = function () {
    var fragment = document.createDocumentFragment();
    var odiv = document.createElement('div');
    odiv.setAttribute('class', 'jydaDe-btn');
    odiv.innerHTML = '<div><a href="javascript:void(0)">取消</a><a href="javascript:void(0)">确定</a></div>';
    fragment.appendChild(odiv);
    return fragment;
}

/**
 * 创建标题文档
 * @param year 年份
 * @param month 月份
 * @private
 */
jyDate.prototype._createTitle = function () {
    var fragment = document.createDocumentFragment();
    var otitle = document.createElement('div');
    otitle.setAttribute('class', 'jydaDe-head');
    otitle.innerHTML = '<div class="jydaDe-prev"> < </div><div id="jydaDe-head">' + YEAR_NOW + '年' + (MONTH_NOW) + '月' + '</div><div class="jydaDe-next"> > </div>';
    fragment.appendChild(otitle);
    return fragment;
};


/**
 * 创建文档
 * @param year 年份
 * @param month 月份
 * @private
 */
jyDate.prototype._create = function () {
    var num = -(this.firstday() - 1);
    var len_row = this.tr_str();
    var fragment = document.createDocumentFragment();
    var odiv = document.createElement('div');
    var ohtml = '';
    var arr = !!DATAINTERVAL ? this.setDay(1) : this.setDay();
    console.log(arr);
    var isDisabled = 'disabled';
    odiv.setAttribute('class', 'jydaDe');
    ohtml += '<div class=\"week-row\"><div>周日</div><div>周一</div><div>周二</div><div>周三</div><div>周四</div><div>周五</div><div>周六</div></div>';
    for (var i = 0; i < len_row; i++) {
        ohtml += '<div class=\"day-row\">';
        for (var j = 0; j < 7; j++) {
            var ohtml1 = '<div><p class="day-row-div"><input type=' + INPUTTYPE + '  value=' + num + ' name="input" checked >' + '<label>' + num + '</label>' + '</p></div>';//设置高亮
            var ohtml2 = '<div><p class="day-row-div"><input type=' + INPUTTYPE + '  value=' + num + ' name="input" >' + '<label>' + num + '</label>' + '</p></div>';//设置不高亮
            var ohtml3 = '<div>&nbsp;</div>';//设置空值
            var ohtml4 = '<div class="jydaDe-disabled"><label>' + num + '</label>' + '</div>';//设置不可点击
            if (num > this.m_days()[MONTH_NOW - 1]) {
                break
            }
            if (num <= 0) {
                ohtml += ohtml3;
            } else {
                var arrNum = {};
                var len = arr.length;
                if (len > 0) {
                    for (var k = 0; k < len; k++) {
                        arrNum[arr[k]] = '';
                    }
                }
                if (!ISCLICKDAY) {
                    ohtml += ohtml4;
                }
                else if (!!DATAINTERVAL) {
                    if (arrNum.hasOwnProperty(num)) {
                        ohtml += ohtml1;
                    } else {
                        ohtml += ohtml4;
                    }
                }
                else {
                    if (HASARGUMENT || IsClickArr) {
                        if (arrNum.hasOwnProperty(num)) {
                            ohtml += ohtml1;
                        } else {
                            ohtml += ohtml2;
                        }
                    } else {
                        if (IS_SHOW_DAY_NOW && num == DAY_NOW && len > 0) {
                            ohtml += ohtml1;
                        } else {
                            ohtml += ohtml2;
                        }
                    }
                }
            }
            num++;
        }
        ohtml += "</div>";
    }
    odiv.innerHTML = ohtml;
    fragment.appendChild(this._createTitle());
    fragment.appendChild(odiv);
    IS_SHOW_BTN ? fragment.appendChild(this._createBtn()) : '';
    return fragment;
};


module.exports = function (ca) {
    return new jyDate(ca);
};

