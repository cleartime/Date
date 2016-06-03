/**
 * Created by gxx on 16/6/2.
 */

function jyDate(jyDate) {
    var _date = new Date();
    this._year = _date.getFullYear();//年
    this._month = _date.getMonth();//月
    this._day = _date.getDate();//日
    this._week = _date.getDay();//星期
    var self = this;
    var odiv = document.getElementById('jyDate');
    odiv.appendChild(self._createTitle());
    var prev = document.querySelector('#jydaDe-head');
    var next = document.querySelector('.jydaDe-next');

    function init() {
        odiv.appendChild(self._create());
    }

    next.addEventListener('click', function () {
        odiv.appendChild(self._create(self._year, (self._month)));
    }, false);


    return init();
}


/**
 * 简单的函数封装，执行callback
 * @param callback 执行的函数
 */
function next(callback) {
    callback && callback();
}

/**
 * 判断是不是润年
 * @param year 年份
 * @returns {number}
 */

jyDate.prototype.is_leap = function (year) {
    return ( year || this._year % 100 == 0 ? res = (year || this._year % 400 == 0 ? 1 : 0) : res = (year || this._year % 4 == 0 ? 1 : 0));
};

/**
 * 定义个数组取得每个月的总天数
 * @param year 年份
 * @returns {Array}
 */
jyDate.prototype.m_days = function (year) {
    return [31, 28 + this.is_leap(year || this._year), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
};

/**
 * 获取当前月的第一天是星期几
 * @param year 年份
 * @param month 月份
 * @returns {number}
 */
jyDate.prototype.firstday = function (year, month) {
    return year && month ?
        new Date(year, month, 1).getDay() :
        new Date(this._year, this._month, 1).getDay();
};


/**
 * 设置当前行数
 * @param year 年份
 * @param month 月份
 * @returns {number}
 */
jyDate.prototype.tr_str = function (year, month) {
    return year && month ?
        Math.ceil((this.m_days(year)[month] + this.firstday(year, month)) / 7) :
        Math.ceil((this.m_days()[this._month] + this.firstday()) / 7);
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
    otitle.innerHTML = '<div class="jydaDe-prev"> < </div><div id="jydaDe-head">' + (year || this._year ) + '年' + (month || this._month + 1) + '月' + '</div><div class="jydaDe-next"> > </div>';
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
    var num = -(this.firstday(year, month - 1) - 1) || -(this.firstday() - 1);
    var len_row = this.tr_str(year, month) || this.tr_str();
    var fragment = document.createDocumentFragment();
    var odiv = document.createElement('div');
    var ohtml = '';
    odiv.setAttribute('class', 'jydaDe');
    ohtml += '<div class=\"week-row\"><div>周日</div><div>周一</div><div>周二</div><div>周三</div><div>周四</div><div>周五</div><div>周六</div></div>';
    for (var i = 0; i < len_row; i++) {
        ohtml += '<div class=\"day-row\">';
        for (var j = 0; j < 7; j++) {
            if (num > (this.m_days(year, month)[month] || this.m_days()[this._month])) {
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
    fragment.appendChild(odiv);
    return fragment;
};


(function () {
    return new jyDate();
}());

