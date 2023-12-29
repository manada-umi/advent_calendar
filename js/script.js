// 定数
var STORAGE_NAME = 'manada_umi-holiday_advent_calendar_sd';
var ICON_LIST = ['task/box',
    'task/home', 'task/hammer', 'task/gardening', 'task/beer', 'task/cook', 'task/clothes',
    'task/book', 'task/note', 'task/document', 'task/PC', 'task/PC2', 'task/game', 'task/microphone',
    'task/park', 'task/sea', 'task/sport', 'task/camp', 'task/painting', 'task/trip', 'task/bag', 'task/hospital',
    'task/bed', 'task/broom', 'task/dustcloth', 'task/laundry', 'task/hanger', 'task/garbage',
    'task/bank',
];
var PANEL_LIST = ['Main', 'List', 'Edit', 'Setting', 'Config'];

// global変数
var data = null;
var panel = 'Main';
var editIndex = 0;

// クラス
var SaveData = function () {
    this.title = 'Holiday Advent Calendar';
    this.holidaysList = [];
    this.color = '#000000';
    this.backgroundcolor = '#ffffff';
    this.colorpalette = ['#cccccc', '#99dddd', '#ffcc99', '#99dd99', '#eeee99', '#aaaaee', '#ee9999', '#ffaacc', '#ccee99', '#99ccee'];
    this.isFirst = true;
    this.holidayNumber = 0;
    this.dateNumber = 0;

    // サンプルデータの登録
    this.holidaysList.push(new Holidays());
};

var Holidays = function () {
    this.dayList = [];
    this.dayList.push(new Holiday(0, getDateString(null), null));
};

var Holiday = function (index, date, itemList) {
    this.date = date;
    this.itemList = itemList;
    if (this.itemList === null) {
        this.itemList = [];
        this.itemList.push(new Item(index, 'タスク', 1, 'task/box'));
    } else {
        this.itemList.forEach(function (item) {
            item.dateNumber = index;
        });
    }
};

var Item = function (dateNumber, name, color, image) {
    this.dateNumber = dateNumber;
    this.name = name;
    this.color = color;
    this.image = image;
    this.on = false;
};

function setItem(item, name, color, image) {
    item.name = name;
    item.color = color;
    item.image = image;
    return item;
}

// json共通クラス
function load() {
    var sd = JSON.parse(localStorage.getItem(STORAGE_NAME));
    if (sd == null) {
        sd = new SaveData();
    }
    return sd;
}

function save(sd) {
    localStorage.setItem(STORAGE_NAME, JSON.stringify(sd));
}

function clearData() {
    localStorage.removeItem(STORAGE_NAME);
}

// javascript共通クラス
function getDateString(d) {
    if (d == null) {
        d = new Date();
    }
    var yy = d.getFullYear();
    var mm = ('00' + (d.getMonth() + 1)).slice(-2);
    var dd = ('00' + d.getDate()).slice(-2);
    var dow = ["日", "月", "火", "水", "木", "金", "土"][d.getDay()];
    return yy + '-' + mm + '-' + dd + '-' + dow;
}

function getDate(value) {
    return new Date(value.slice(0, 4), value.slice(5, 7) - 1, value.slice(8, 10));
}

function addDate(d, value) {
    d.setDate(d.getDate() + 1);
    return d;
}

function diffDate(d1, d2) {
    return ((getDate(d2).getTime() - getDate(d1).getTime()) / (1000 * 60 * 60 * 24));
}

function getElement(id) {
    return document.getElementById(id);
}

function getElementByClass(className) {
    return document.getElementsByClassName(className)[0];
}

function getElementListByClass(className) {
    return Array.prototype.slice.call(document.getElementsByClassName(className));
}

function getElementListByTagName(tagName) {
    return Array.prototype.slice.call(document.getElementsByTagName(tagName));
}

function getStyle(id) {
    return document.getElementById(id).style;
}

function inputCheck(str) {
    str = str.replace('<', '');
    str = str.replace('>', '');
    return str;
}

function drow(id, str) {
    getElement(id).innerHTML = str;
}

function select(element, cssName) {
    if (getElementByClass(cssName + 'A')) {
        getElementByClass(cssName + 'A').className = cssName;
    }
    element.className = cssName + 'A';
}

function movePanel(nextPanel) {
    switch (panel) {
        case 'Main':
            getElementListByClass('menu-button').forEach(function (element) {
                element.style.visibility = 'hidden';
            });
            break;
        case 'Add':
            nextPanel = 'Main';
            break;
        case 'Edit':
            nextPanel = 'List';
            break;
    }
    panel = nextPanel;
    switch (nextPanel) {
        case 'Main':
            drowItemGrid();
            getElementListByClass('menu-button').forEach(function (element) {
                element.style.visibility = 'visible';
            });
            break;
        case 'List':
            drowItemList();
            break;
        case 'Add':
            drowEditPanel('', 1, 'task/box');
            nextPanel = 'Edit';
            break;
        case 'Edit':
            editIndex = Number(getElementByClass('list-itemA').id.slice(9));
            var item = data.holidaysList[data.holidayNumber].dayList[data.dateNumber].itemList[editIndex];
            drowEditPanel(item.name, item.color, item.image);
            break;
        case 'Setting':
            drowSettingPanel();
            break;
        case 'Config':
            drowConfigColor();
            break;
    }

    PANEL_LIST.forEach(function (value) {
        getStyle(value + 'Panel').visibility = 'hidden';
    });
    getStyle(nextPanel + 'Panel').visibility = 'visible';
}

// drow
function drowTitle() {
    drow('menu-title', data.title);
}

function drowItemGrid() {
    var str = '';
    data.holidaysList[data.holidayNumber].dayList.forEach(function (holiday, index) {
        str += drowDayBox(holiday, index);
    });
    drow('MainPanel', str);
}

function drowDayBox(holiday, index) {
    var str = '';
    str += '<div class="main-holidays">';
    str += '<div class="main-day">';
    str += '<div class="main-month">' + holiday.date.slice(5, 7) + '</div>';
    str += '<div class="main-date">' + holiday.date.slice(8, 10) + '<span class="main-dow"> [' + holiday.date.slice(11, 12) + ']</span></div>';
    str += '</div>';
    str += '<div class="main-items">';
    holiday.itemList.forEach(function (item, index) {
        str += drowItemBox(item, index);
    });
    str += '</div>';
    str += '<div class="main-menu">';
    str += '<img class="main-button" src="img/system/add.png" onclick="data.dateNumber=' + index + ';movePanel(\'Add\')">';
    str += '<img class="main-button" src="img/system/sort.png" onclick="data.dateNumber=' + index + ';movePanel(\'List\')">';
    str += '</div>';
    str += '</div>';
    return str;
}

function drowItemBox(item, index) {
    var color = data.colorpalette[0];
    if (item.on) {
        color = data.colorpalette[item.color];
    }

    var str = '';
    str += '<div class="main-item" id="main-item' + item.dateNumber + '-' + index + '" style="background-color:' + color + '"';
    str += ' onclick="pushItem(\'' + item.dateNumber + '\',\'' + index + '\')">';
    str += '<img class="main-item" src="img/' + item.image + '.png">';
    str += '<div class="main-item-name">' + item.name.replace(',', '<br>') + '</div>';
    str += '</div>';
    return str;
}

function drowItemList() {
    var str = '';
    data.holidaysList[data.holidayNumber].dayList[data.dateNumber].itemList.forEach(function (item, index) {
        var cssClass = (index == 0) ? 'A' : '';
        str += '<div class="list-item' + cssClass + '" id="list-item' + index + '"';
        str += ' onclick="select(this,\'list-item\')">';
        str += drowItemLine(item, index) + '</div>';
    });
    drow('list-content', str);
}

function drowItemLine(item, index) {
    var str = '';
    str += '<div class="list-item-box"';
    str += ' style="background-color:' + data.colorpalette[item.color] + '">';
    str += '<img class="list-item-box" src="img/' + item.image + '.png" align="left">';
    str += item.name.replace(',', '');
    str += '</div>';
    return str;
}

function drowEditPanel(name, color, img) {
    getElement('edit-name').value = name;
    select(getElement('edit-color' + color), 'edit-color');
    select(getElement('edit-icon' + img), 'edit-icon');
}

function drowColorList() {
    var str = '';
    data.colorpalette.forEach(function (value, index) {
        var cssClass = (index == 1) ? 'A' : '';
        if (index != 0) {
            str += '<div class="edit-color' + cssClass + '" id="edit-color' + index + '"';
            str += ' onclick="select(this,\'edit-color\')">';
            str += '<img src="img/system/color.png"';
            str += ' alt="' + index + '" style="background-color:' + value + '"></div>';
        }
    });
    drow('edit-color', str);
}

function drowIconList() {
    var str = '';
    ICON_LIST.forEach(function (value, index) {
        var cssClass = (index == 0) ? 'A' : '';
        str += '<div class="edit-icon' + cssClass + '" id="edit-icon' + value + '"';
        str += ' onclick="select(this,\'edit-icon\')">';
        str += '<img class="edit-icon" src="img/' + value + '.png" alt="' + value + '"></div>';
    });
    drow('edit-icon', str);
}

function drowConfig() {
    document.body.style.color = data.color;
    getElementListByTagName('button').forEach(function (element) {
        element.style.color = data.color;
    });
    document.body.style.backgroundColor = data.backgroundcolor;
    drowTitle();
}

function drowConfigColor() {
    getElement('config-title').value = data.title;
    getElement('config-color').value = data.color;
    getElement('config-backgroundcolor').value = data.backgroundcolor;
    data.colorpalette.forEach(function (value, index) {
        getElement('config-color' + index).value = data.colorpalette[index];
    });
}

function drowSettingPanel() {
    var str = '';
    data.holidaysList.forEach(function (holidays, index) {
        var cssClass = (index == data.holidayNumber) ? 'A' : '';
        str += '<div class="setting-number' + cssClass + '" id="setting-number' + index + '"';
        str += ' onclick="select(this,\'setting-number\')">';
        str += (index + 1) + '</div>';
        str += '<input id="s' + index + '" type="date" value="' + holidays.dayList[0].date.slice(0, 10) + '">～';
        str += '<input id="e' + index + '" type="date" value="' + holidays.dayList[holidays.dayList.length - 1].date.slice(0, 10) + '"><br>';
    });
    drow('setting-content', str);
}

// 処理
function initialize() {
    data = load();
    drowConfig();
    drowItemGrid();
    drowIconList();
    drowColorList();
}

function cancel() {
    data = load();
    movePanel('Main');
}

function pushItem(id1, id2) {
    var item = data.holidaysList[data.holidayNumber].dayList[id1].itemList[id2];
    if (!item.on) {
        getStyle('main-item' + id1 + '-' + id2).backgroundColor = data.colorpalette[item.color];
    } else {
        getStyle('main-item' + id1 + '-' + id2).backgroundColor = data.colorpalette[0];
    }
    item.on = !item.on;
    save(data);
}

function deleteItem() {
    var index = Number(getElementByClass('list-itemA').id.slice(9));
    var itemList = data.holidaysList[data.holidayNumber].dayList[data.dateNumber].itemList;
    itemList.splice(index, 1);
    drowItemList();
}

function upItem() {
    var index = Number(getElementByClass('list-itemA').id.slice(9));
    if (index == 0) return;
    var itemList = data.holidaysList[data.holidayNumber].dayList[data.dateNumber].itemList;
    var item = itemList[index];
    itemList[index] = itemList[index - 1];
    itemList[index - 1] = item;
    drow('list-item' + (index - 1), drowItemLine(itemList[index - 1], index - 1));
    drow('list-item' + index, drowItemLine(itemList[index], index));
    select(getElement('list-item' + (index - 1)), 'list-item');
}

function downItem() {
    var index = Number(getElementByClass('list-itemA').id.slice(9));
    var itemList = data.holidaysList[data.holidayNumber].dayList[data.dateNumber].itemList;
    if (index == itemList.length - 1) return;
    var item = itemList[index];
    itemList[index] = itemList[index + 1];
    itemList[index + 1] = item;
    drow('list-item' + (index + 1), drowItemLine(itemList[index + 1], index + 1));
    drow('list-item' + index, drowItemLine(itemList[index], index));
    select(getElement('list-item' + (index + 1)), 'list-item');
}

function saveItemList() {
    save(data);
    movePanel('Main');
}

function saveItem() {
    var dateNumber = data.dateNumber;
    var name = inputCheck(getElement('edit-name').value);
    var color = getElementByClass('edit-colorA').children[0].getAttribute('alt');
    var image = getElementByClass('edit-iconA').children[0].getAttribute('alt');
    var itemList = data.holidaysList[data.holidayNumber].dayList[data.dateNumber].itemList;
    if (panel == 'Add') {
        var item = new Item(dateNumber, name, color, image);
        itemList.push(item);
        save(data);
    } else {
        itemList[editIndex] = setItem(itemList[editIndex], name, color, image);
        drow('list-item' + editIndex, drowItemLine(itemList[editIndex], editIndex));
    }
    movePanel();
}

function saveConfig() {
    data.title = inputCheck(getElement('config-title').value);
    data.color = getElement('config-color').value;
    data.backgroundcolor = getElement('config-backgroundcolor').value;
    data.colorpalette.forEach(function (value, index) {
        data.colorpalette[index] = getElement('config-color' + index).value;
    });
    drowConfig();
    drowColorList();
    save(data);
    movePanel('Main');
}

function initColorConfig() {
    var initData = new SaveData();
    data.color = initData.color;
    data.backgroundcolor = initData.backgroundcolor;
    data.colorpalette.forEach(function (value, index) {
        data.colorpalette[index] = initData.colorpalette[index];
    });
    drowConfigColor();
}

function saveSetting() {
    data.holidaysList.forEach(function (holidays, index) {
        var dmap = new Map();
        holidays.dayList.forEach(function (holiday) {
            dmap.set(holiday.date, holiday.itemList);
        });
        var dayList = [];
        var sd = getElement('s' + index).value;
        var ed = getElement('e' + index).value;
        var diff = diffDate(sd, ed) + 1;
        var d = getDate(sd);
        if (diff > 0) {
            if (diff > 30) diff = 30;
            for (var i = 0; i < diff; i++) {
                if (dmap.has(getDateString(d))) {
                    dayList.push(new Holiday(i, getDateString(d), dmap.get(getDateString(d))));
                } else {
                    dayList.push(new Holiday(i, getDateString(d), null));
                }
                d.setDate(d.getDate() + 1);
            }
        }
        holidays.dayList = dayList;
    });
    data.holidayNumber = getElementByClass('setting-numberA').id.slice(14);
    save(data);
    movePanel('Main');
}

function addSetting() {
    data.holidaysList.push(new Holidays());
    drowSettingPanel();
}