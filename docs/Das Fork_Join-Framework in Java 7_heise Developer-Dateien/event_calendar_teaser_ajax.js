var EventCalendar = {
    ti: null,
    oldPd: null,
    instance: null,
    hidePopup: function (day) {
        document.getElementById('popup_' + day).style.display = 'none';
    },
    showPopup: function (day, hide) {
        if (hide) {
            EventCalendar.ti = window.setTimeout("EventCalendar.hidePopup(" + day + ")", 100);
        } else {
            if (EventCalendar.oldPd == day) {
                window.clearInterval(EventCalendar.ti);
            }
            document.getElementById('popup_' + day).style.display = '';
            EventCalendar.oldPd = day;
        }
    },

    get_events_url : '/veranstaltungsdaten_ajax.html',

    cal_days_order : [1, 2, 3, 4, 5, 6, 0],
    cal_days_labels : ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
    cal_months_labels : ['Januar', 'Februar', 'M&auml;rz', 'April',
                         'Mai', 'Juni', 'Juli', 'August', 'September',
                         'Oktober', 'November', 'Dezember'],
    cal_days_in_month : [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    cal_current_date : new Date(),

    Calendar: function (month, year, channel) {
        this.month      = (isNaN(month) || month == null) ? EventCalendar.cal_current_date.getMonth() : month;
        this.year       = (isNaN(year) || year == null) ? EventCalendar.cal_current_date.getFullYear() : year;
        this.channel    = channel;
        this.events     = {};
        this.months_set = {};
        this.months_set[ this.year + "" +this.month ] = 1;

        this.setEvents = function (newEvents) {
            var i, newEvent, date1, date2, d1, d2, maximum, j, m, d, finalDate;
            for (i = 0; i < newEvents.entries.length; i++) {
                newEvent = newEvents.entries[i];
                date1 = newEvents.entries[i].datum.split('-');
                date2 = newEvents.entries[i].datum_2.split('-');
                d1 = new Date(date1[0], date1[1] - 1, date1[2]);
                d2 = new Date(date2[0], date2[1] - 1, date2[2]);
                maximum = 14;
                j = 0;

                while (j < maximum && d1.getTime() <= d2.getTime()) {
                    m = d1.getMonth() + 1;
                    if (m < 10) {
                        m = '0' + m;
                    }
                    d = d1.getDate();
                    if (d < 10) {
                        d = '0' + d;
                    }
                    finalDate = d1.getFullYear() + '-' + m + '-' + d;
                    if (!this.events[finalDate]) {
                        this.events[finalDate] = [];
                    }
                    this.events[finalDate].push(newEvents.entries[i]);
                    if (d1.getDate() < EventCalendar.cal_days_in_month[d1.getMonth()]) {
                        d1.setDate(d1.getDate() + 1);
                    } else {
                        d1.setDate(1);
                        if (d1.getMonth() < 11) {
                            d1.setMonth(d1.getMonth() + 1);
                        } else {
                            d1.setMonth(0);
                            d1.setFullYear(d1.getFullYear() + 1);
                        }
                    }
                    j++;
                }
            }
        };

        this.generateHTML = function () {
            var firstDay = new Date(this.year, this.month, 1);
            var startingDay = firstDay.getDay();
            var monthLength = EventCalendar.cal_days_in_month[this.month];
            if (this.month == 1) { // February only!
                if ((this.year % 4 == 0 && this.year % 100 != 0) || this.year % 400 == 0) {
                    monthLength = 29;
                }
            }

            var cal_today_date = new Date();
            var checkDay = (cal_today_date.getMonth() == this.month && cal_today_date.getFullYear() == this.year) ? true : false;
            var monthName = EventCalendar.cal_months_labels[this.month];
            var html, i, day, cal_days_order_string, j, ts, ds, popupCode, onmouseover, aClass, k;
            html = '<table class="calendar-table">';
            html += '<tr><th><a href="javascript:EventCalendar.instance.prevMonth()"><img alt="voriger Monat" src="/' + channel + '/icons/kalender_pfeil_links.png" /></a></th><th class="month_head" colspan="5">';
            if (channel == 'resale' || channel == 'foto') {
                html += '<a href="/' + channel + '/veranstaltungen/?monat=' + this.year + '_' + (this.month + 1) + '">' + monthName + "&nbsp;" + this.year + '</a>';
            } else if (channel == 'developer') {
                html += '<a href="/' + channel + '/termine/?monat=' + this.year + '_' + (this.month + 1) + '">' + monthName + "&nbsp;" + this.year + '</a>';
            } else if (channel == 'tr') {
                html += '<a href="/' + channel + '/veranstaltungen/?jahr=' + this.year + '&monat=' + (this.month + 1) + '">' + monthName + "&nbsp;" + this.year + '</a>';
            } else {
                html += '<a href="/' + channel + '/kalender/?monat=' + this.year + '_' + (this.month + 1) + '">' + monthName + "&nbsp;" + this.year + '</a>';
            }
            html += '</th><th><a href="javascript:EventCalendar.instance.nextMonth()"><img alt="n&auml;chster Monat" src="/' + channel + '/icons/kalender_pfeil_rechts.png" /></a></th></tr>';
            html += '<tr class="calendar-header">';
            for (i = 0; i <= 6; i++) {
                html += '<td class="calendar-header-day">';
                html += EventCalendar.cal_days_labels[EventCalendar.cal_days_order[i]];
                html += '</td>';
            }
            html += '</tr><tr>';

            // fill in the days
            day = 1;
            // this loop is for is weeks (rows)
            cal_days_order_string = EventCalendar.cal_days_order.join('');
            for (i = 0; i < 9; i++) {
                for (j = 0; j <= 6; j++) {
                    html += '<td class="calendar-day">';
                    if (day <= monthLength && (i > 0 || j >= cal_days_order_string.indexOf(startingDay))) {
                        ts = this.generateTimestamp(day);
                        ds = this.generateDateStr(day);
                        popupCode = '';
                        onmouseover = '';
                        aClass = (checkDay == true && day == cal_today_date.getDate()) ? 'class="today"' : '';
                        if (this.events[ds]) {
                            aClass = 'class="event-day"';
                            onmouseover = 'onmouseover="EventCalendar.showPopup(' + day + ', 0)" onmouseout="EventCalendar.showPopup(' + day + ', 1)"';
                            popupCode = '<span style="display:none;" id="popup_' + day + '" class="popup" onmouseover="EventCalendar.showPopup(' + day + ', 0)">';
                            for (k = 0; k < this.events[ds].length; k++) {
                                popupCode += '<a class="event" href="' + this.events[ds][k].url + '">' +
                                    this.events[ds][k].titel + (this.events[ds][k].ort ? ', ' + this.events[ds][k].ort : '') + '</a>';
                            }
                            popupCode += '</span>';
                        }
                        html += '<span ' + aClass + ' ' + onmouseover + '>' + day + popupCode + '</span>';
                        day++;
                    }
                    html += '</td>';
                }
                // stop making rows if we've run out of days
                if (day > monthLength) {
                    break;
                } else {
                    html += '</tr><tr>';
                }
            }
            html += '</tr></table>';
            document.getElementById('calendar-holder').innerHTML = html;
        };

        this.generateTimestamp = function (day) {
            month = this.month + 1;
            return "'" + day + "','" + month + "','" + this.year + "'";
        };
        this.generateDateStr = function (day) {
            month = this.month + 1;
            if (month < 10) { month = '0' + month; }
            if (day < 10) { day = '0' + day; }
            return this.year + '-' + month + '-' + day;
        };
        this.prevMonth = function () {
            if (this.month == 0) {
                this.month = 12;
                this.year = (this.year - 1);
            }
            this.month = (this.month - 1);
            EventCalendar.getEvents(this.year, this.month, this.channel);
        };
        this.nextMonth = function () {
            if (this.month == 11) {
                this.month = -1;
                this.year = (this.year + 1);
            }
            this.month = (this.month + 1);
            EventCalendar.getEvents(this.year, this.month, this.channel);
        };
    },

    getEvents : function (year, month, channel) {
        if (!EventCalendar.instance.months_set[year + "" + month]) {
            $.getJSON(EventCalendar.getEventsURL(year, month, channel), function(data) {
                EventCalendar.instance.months_set[year + "" + month] = 1;
                EventCalendar.instance.setEvents(data);
                EventCalendar.instance.generateHTML();
            });
        }
        else {
            EventCalendar.instance.generateHTML();
        }
    },

    getEventsURL : function(year, month, channel) {
        return EventCalendar.get_events_url +
            '?jahr=' + year +
            '&monat=' + (month+1) +
            '&channel=' + channel;
    }
};

