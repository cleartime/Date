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

function jyDate() {
    var _date = new Date();
    this._year = _date.getFullYear();//年
    this._month = _date.getMonth();//月
    this._day = _date.getDate();//日
    this._week = _date.getDay();//星期
    var self = this;
    var odiv = document.getElementById('jyDate');

    function init(config) {
        YEAR_NOW = self._year;
        MONTH_NOW = self._month + 1;
        DAY_NOW = self._day;
        FRIST_DATE = DATAARR = (YEAR_NOW + '-' + MONTH_NOW + '-' + DAY_NOW).split();
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
        var prev = document.querySelector('.jydaDe-prev');
        var next = document.querySelector('.jydaDe-next');
        next.addEventListener(CLICKTYPE, function () {
            odiv.innerHTML = '';
            odiv.appendChild(self._create(self.getYear(1), self.getMonth(1)));
            change()
        }, false);
        prev.addEventListener(CLICKTYPE, function () {
            odiv.innerHTML = '';
            odiv.appendChild(self._create(self.getYear(0), self.getMonth(0)));
            change()
        }, false)
    }


    return {
        init: function (config) {
            init(config);
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
        YEAR_NOW = data.year;
        MONTH_NOW = data.month;
        DAY_NOW = data.day;
    }
    if (config.dataArr) {
        HASARGUMENT = true;
        DATAARR = config.dataArr;
    }
    ISCLICK = config.isClick === false ? false : true;
    ISCLICKDAY = config.isClickDay === false ? false : true;
    CLICKTYPE = config.clickType || 'click';
    INPUTTYPE = config.inputType || 'checkbox';
};

/**
 * 设置年月日
 * @param dateArr 年月日数组
 */

jyDate.prototype.setDay = function () {
    if(!HASARGUMENT || FRIST_DATE.length==1){
        return DAY_NOW
    }
    //var data = this.setData(DATAARR)();
    console.log(DATAARR);
};

/**
 * 获取传过来的时间进行处理
 * @param data
 */
jyDate.prototype.setData = function (data) {
    var _dataArr_year = _dataArr_month = _dataArr_day = [];
    var arr = ['-', ' ', ','];
    for (var i = 0, len = arr.length; i < len; i++) {
        for (var j = 0, len = data.length; j < len; j++) {
            _dataArr_year = (data[j].split(arr[i])[0]);
            _dataArr_month = (data[j].split(arr[i])[1]);
            _dataArr_day = (data[j].split(arr[i])[2]);
            if (data[j].split(arr[i]).length === 3) {
                break
            }
        }
    }
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
    odiv.setAttribute('class', 'jydaDe');
    ohtml += '<div class=\"week-row\"><div>周日</div><div>周一</div><div>周二</div><div>周三</div><div>周四</div><div>周五</div><div>周六</div></div>';
    for (var i = 0; i < len_row; i++) {
        ohtml += '<div class=\"day-row\">';
        for (var j = 0; j < 7; j++) {
            if (num > this.m_days()[MONTH_NOW - 1]) {
                break
            }
            if (num <= 0) {
                ohtml += '<div>&nbsp;</div>';
            } else {
                if (!ISCLICKDAY) {
                    ohtml += '<div><label>' + num + '</label>' + '</div>';
                    return
                }
                if (num == this.setDay()) {
                    ohtml += '<div><input type=' + INPUTTYPE + '  value=' + num + ' name="input" checked >' + '<label>' + num + '</label>' + '</div>';
                } else {
                    ohtml += '<div><input type=' + INPUTTYPE + '  value=' + num + ' name="input" >' + '<label>' + num + '</label>' + '</div>';
                }
            }
            num++;
        }
        ohtml += "</div>";
    }
    odiv.innerHTML = ohtml;
    fragment.appendChild(this._createTitle());
    fragment.appendChild(odiv);
    return fragment;
};


module.exports = function () {
    return new jyDate();
};

