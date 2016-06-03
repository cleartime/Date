/**
 * Created by gxx on 16/6/2.
 */
var YEAR_NOW = null;
var MONTH_NOW = null;
var DAY_NOW = null;
var ISCLICK = true;
var ISCLICKDAY = true;
var CLICKTYPE = 'click';
var INPUTTYPE = 'checkbox';
var DATAARR = null;

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


    function getDay() {

        var olabel = document.querySelector('label');
        olabel.addEventListener(CLICKTYPE, function () {

        }, false)

    }

    return {
        init: function (config) {
            init(config);
        },
        getDay: function () {
            return getDay();
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
        this.setData(config.data);
    }
    if (config.dateArr) {
        this.setDay(config.dateArr);
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

jyDate.prototype.setDay = function (dateArr) {
    DATAARR = dateArr;
    return true
};

/**
 * 获取传过来的时间进行处理
 * @param data
 */
jyDate.prototype.setData = function (data) {
    var arr = ['-', ' ', ','];
    for (var i = 0, len = arr.length; i < len; i++) {
        YEAR_NOW = data.split(arr[i])[0];
        MONTH_NOW = data.split(arr[i])[1];
        DAY_NOW = data.split(arr[i])[2];
        if (data.split(arr[i]).length === 3) {
            break
        }
    }
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
                }
                else {
                    ohtml += '<div><input type=' + INPUTTYPE + '  value=' + num + ' name="input">' + '<label>' + num + '</label>' + '</div>';
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

