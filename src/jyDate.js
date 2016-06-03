/**
 * Created by gxx on 16/6/2.
 */
var YEAR_NOW = null;
var MONTH_NOW = null;
var DAY_NOW = null;

function jyDate(jyDate) {
    var _date = new Date();
    this._year = _date.getFullYear();//年
    this._month = _date.getMonth();//月
    this._day = _date.getDate();//日
    this._week = _date.getDay();//星期
    var self = this;
    var odiv = document.getElementById('jyDate');


    function init(year, month) {
        YEAR_NOW = self._year;
        MONTH_NOW = self._month + 1;
        if (year && month) {
            YEAR_NOW = year;
            MONTH_NOW = month;
            odiv.appendChild(self._create(year, month));
            return
        }
        odiv.appendChild(self._create());
        change();
    }

    function change() {
        var prev = document.querySelector('.jydaDe-prev');
        var next = document.querySelector('.jydaDe-next');
        next.addEventListener('click', function () {
            odiv.appendChild(self._create(self.getYear(1), self.getMonth(1)));
        }, false);
        prev.addEventListener('click', function () {
            odiv.appendChild(self._create(self.getYear(0), self.getMonth(0)));
        }, false)
    }

    function noClick() {

    }


    return {
        init: function (year, month) {
            init(year, month);
        },
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
 * 获得年份
 * @param year 年份
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

jyDate.prototype.is_leap = function (year) {
    return ( year || YEAR_NOW % 100 == 0 ? res = (year || YEAR_NOW % 400 == 0 ? 1 : 0) : res = (year || YEAR_NOW % 4 == 0 ? 1 : 0));
};

/**
 * 定义个数组取得每个月的总天数
 * @param year 年份
 * @returns {Array}
 */
jyDate.prototype.m_days = function (year) {
    return [31, 28 + this.is_leap(year || YEAR_NOW), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
};

/**
 * 获取当前月的第一天是星期几
 * @param year 年份
 * @param month 月份
 * @returns {number}
 */
jyDate.prototype.firstday = function (year, month) {
    return year && month ?
        new Date(year, (month - 1), 1).getDay() :
        new Date(YEAR_NOW, (MONTH_NOW - 1), 1).getDay();
};


/**
 * 设置当前行数
 * @param year 年份
 * @param month 月份
 * @returns {number}
 */
jyDate.prototype.tr_str = function (year, month) {
    return year && month ?
        Math.ceil((this.m_days(year)[month - 1] + this.firstday(year, month - 1)) / 7) :
        Math.ceil((this.m_days()[MONTH_NOW - 1] + this.firstday()) / 7);
};


/**
 * 创建标题文档
 * @param year 年份
 * @param month 月份
 * @private
 */
jyDate.prototype._createTitle = function (year, month) {
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
jyDate.prototype._create = function (year, month) {
    var num = -(this.firstday(year, month) - 1) || -(this.firstday() - 1);
    var len_row = this.tr_str(year, month) || this.tr_str();
    var fragment = document.createDocumentFragment();
    var odiv = document.createElement('div');
    var ohtml = '';
    odiv.setAttribute('class', 'jydaDe');
    ohtml += '<div class=\"week-row\"><div>周日</div><div>周一</div><div>周二</div><div>周三</div><div>周四</div><div>周五</div><div>周六</div></div>';
    for (var i = 0; i < len_row; i++) {
        ohtml += '<div class=\"day-row\">';
        for (var j = 0; j < 7; j++) {
            if (num > (this.m_days(year, month)[month - 1] || this.m_days()[MONTH_NOW - 1])) {
                break
            }
            if (num <= 0) {
                ohtml += '<div>&nbsp;</div>';
            } else {
                ohtml += '<div>' + num + '</div>';
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

