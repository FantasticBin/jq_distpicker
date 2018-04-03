var distpicker = new Distpicker();
function Distpicker() {
  var disp = this;
  var _currentCity = {
    provinceId: "",
    cityId: "",
    areaId: "",
    provinceName: "",
    cityName: "",
    areaName: ""
  };
  /**
   *
   * @param {el,city,click} params
   */
  this.init = function(params) {
    this.clickCallback = params.click;
    $(params.el).click(function(e) {
      disp._setCity($(params.el)[0], e);
    });
    $.getScript("./components/distpicker/js/cityJson.js", function(result) {
      disp._initCity(params.el, params.city);
    });
    $("<link>")
      .attr({
        rel: "stylesheet",
        type: "text/css",
        href: "./components/distpicker/addr.css"
      })
      .appendTo("head");
  };
  this._setCity = function(obj, e) {
    var ths = obj;
    var dal =
      '<div class="dp_outer">' +
      '<ul id="tab_select" class="dp_tab"></ul>' +
      '<div id="provinces" class="dp_content"></div>' +
      '<div style="display:none" id="citys" class="dp_content"></div>' +
      '<div style="display:none" id="areas" class="dp_content"></div>' +
      "</div>";
    Iput.show({ id: ths, event: e, content: dal, width: "470" });
    this._reloadTab();
    $("#provinces").append(this._getProvince());
    var cityHtml = this._getCity();
    if (cityHtml) {
      $("#citys").append(cityHtml);
      $(".dp_content").hide();
      $(".dp_content:eq(1)").show();
      $("#tab_select li").removeClass("active");
      $("#tab_select li:eq(1)").addClass("active");
      var areaHtml = this._getArea();
      if (areaHtml) {
        $("#areas").append(areaHtml);
        $(".dp_content").hide();
        $(".dp_content:eq(2)").show();
        $("#tab_select li").removeClass("active");
        $("#tab_select li:eq(2)").addClass("active");
      }
    }

    //省份点击事件
    $("#provinces a").click(function() {
      var g = disp._getCity($(this));
      $("#citys a").remove();
      $("#citys").append(g);
      $(".dp_content").hide();
      $(".dp_content:eq(1)").show();
      $("#tab_select li").removeClass("active");
      $("#tab_select li:eq(1)").addClass("active");
      $("#provinces a,#citys a,#areas a").removeClass("active");
      $(this).addClass("active");
      ths.value = $(this).data("name");
      _currentCity = {
        provinceId: $(this).data("id"),
        provinceName: $(this).data("name"),
        cityId: "",
        cityName: "",
        areaId: "",
        areaName: ""
      };
      disp._reloadTab();
      disp.clickCallback(ths,_currentCity);
    });

    //城市点击事件
    $("#citys").on("click", "a", function() {
      $("#tab_select li").removeClass("active");
      $("#tab_select li:eq(2)").addClass("active");
      $("#citys a,#areas a").removeClass("active");
      $(this).addClass("active");
      _currentCity.cityId = $(this).data("id");
      _currentCity.cityName = $(this).data("name");
      _currentCity.areaId = '';
      _currentCity.areaName = '';
      ths.value = _currentCity.provinceName + "-" + $(this).data("name");
      var ar = disp._getArea($(this));
      if (ar) {
        $("#areas a").remove();
        $("#areas").append(ar);
        $(".dp_content").hide();
        $(".dp_content:eq(2)").show();
        disp._reloadTab();
      } else {
        Iput.colse();
      }
      disp.clickCallback(ths,_currentCity);
    });
    //区县点击事件
    $("#areas").on("click", "a", function() {
      $("#areas a").removeClass("active");
      $(this).addClass("active");
      _currentCity.areaId = $(this).data("id");
      _currentCity.areaName = $(this).data("name");
      ths.value =
        _currentCity.provinceName +
        "-" +
        _currentCity.cityName +
        "-" +
        $(this).data("name");
      Iput.colse();
      disp.clickCallback(ths,_currentCity);
    });

    //tab点击事件
    $("#tab_select").on("click", "li", function() {
      $("#tab_select li").removeClass("active");
      $(this).addClass("active");
      var s = $("#tab_select li").index(this);
      $(".dp_content").hide();
      $(".dp_content:eq(" + s + ")").show();
    });
  };

  this._reloadTab = function () {
    function _getName(arr,id) {
      for (var i = 0; i < arr.length; i++) {
        if (id == arr[i].id) {
          return arr[i];
        }
      }
    }
    $('#tab_select').empty();
    var ids = [{id:'provinceId',name:'provinceName'},{id:'cityId',name:'cityName'},{id:'areaId',name:'areaName'}];
    for (var j = 0; j < ids.length; j++) {
      var sel = ids[j];
      var tab = $('<li>');
      if (_currentCity[sel.id]) {
        tab.html(_currentCity[sel.name]);
        tab.appendTo('#tab_select');
      }else{
        tab.html('请选择');
        tab.attr('class','active');
        tab.appendTo('#tab_select');
        break;
      }
    }
  }

  /**
   *初始化省市区
    * @param {*} el
    * @param
    * {
          provinceId:'',
          cityId:'',
          areaId:'',
        }
    */
  this._initCity = function(el, curCity) {
    var inputText = "";
    if (!curCity) {
      return;
    } else {
      _currentCity = {
        provinceId: curCity.provinceId || "",
        provinceName: curCity.provinceName || "",
        cityId: curCity.cityId || "",
        cityName: curCity.cityName || "",
        areaId: curCity.areaId || "",
        areaName: curCity.areaName || ""
      };
    }
    for (var i = 0; i < province.length; i++) {
      var provinceItem = province[i];
      if (provinceItem.id == curCity.provinceId) {
        inputText += provinceItem.name;
        _currentCity.provinceName = provinceItem.name;
        _currentCity.provinceId = provinceItem.id;
        for (var j = 0; j < provinceItem.city.length; j++) {
          var cityItem = provinceItem.city[j];
          if (curCity.cityId == cityItem.id) {
            inputText += "-" + cityItem.name;
            _currentCity.cityName = cityItem.name;
            _currentCity.cityId = cityItem.id;
            for (var k = 0; k < area.length; k++) {
              var areaItem = area[k];
              if (curCity.areaId == areaItem.id) {
                inputText += "-" + areaItem.name;
                _currentCity.areaName = areaItem.name;
                _currentCity.areaId = areaItem.id;
              }
            }
          }
        }
      }
    }
    $(el).val(inputText);
  };

  /**
   * 返回所有省份
   */
  this._getProvince = function() {
    var tb_province = [];
    var prov = province;
    for (var i = 0, len = prov.length; i < len; i++) {
      tb_province.push(
        this._getTagA(prov[i], 0, _currentCity.provinceId == prov[i]["id"])
      );
    }
    return tb_province.join("");
  };

  /**
   * 返回省份下所有城市标签
   */
  this._getCity = function(obj) {
    var provId = obj ? obj.data("id") : _currentCity.provinceId;
    if (!provId) {
      return "";
    }
    var e = province;
    var f;
    var g = "";
    for (var i = 0, plen = e.length; i < plen; i++) {
      if (e[i]["id"] == parseInt(provId)) {
        f = e[i]["city"];
        break;
      }
    }
    for (var j = 0, clen = f.length; j < clen; j++) {
      g += this._getTagA(f[j], 1, f[j]["id"] == _currentCity.cityId);
    }
    return g;
  };
  /**
   * 返回所有的区/县
   */
  this._getArea = function(obj) {
    var c = obj ? obj.data("id") : _currentCity.cityId;
    if (!c) {
      return "";
    }
    var e = area;
    var f = [];
    var g = "";
    for (var i = 0, plen = e.length; i < plen; i++) {
      if (e[i]["pid"] == parseInt(c)) {
        f.push(e[i]);
      }
    }
    for (var j = 0, clen = f.length; j < clen; j++) {
      g += this._getTagA(f[j], 1, f[j]["id"] == _currentCity.areaId);
    }
    return g;
  };

  this._getTagA = function(obj, level, isSelected) {
    var start =
      '<a data-level="' +
      level +
      '" data-id="' +
      obj["id"] +
      '" data-name="' +
      obj["name"] +
      '" title="' +
      obj["name"] +
      '"';
    var end = ">" + obj["name"] + "</a>";
    var className = "";
    if (isSelected) {
      className = ' class="active"';
    }
    return start + className + end;
  };

  this.getCity = function() {
    return _currentCity;
  };
}

Array.prototype.unique = function() {
  //去数组重复
  return this.sort()
    .join(",,")
    .replace(/(,|^)([^,]+)(,,\2)+(,|$)/g, "$1$2$4")
    .replace(/,,+/g, ",")
    .replace(/,$/, "")
    .split(",");
};
var Iput = {
  confg: {
    hand: "0", //0对像位置1鼠标位置divID滚动位置
    idIframe: "PoPx", //默认可不用改
    idBox: "PoPy", //默认可不用改
    content: "", //传过来的内容
    ok: null, //弹出框之后执行的函数
    id: null, //不能为空一般传this对像而不是对像ID
    event: window.event, //这个必写一般为e就可以了
    top: 0, //顶部偏移位置
    left: 0, //左部偏移位置
    bodyHeight: 0, //在被position:absolute元素下得到HTML真实高度
    bodyWidth: 0,
    width: 0,
    soll: null,
    pop: null //指定ID点击时不关闭
  },
  get: function(obj) {
    return document.getElementById(obj);
  },
  lft: function(e) {
    var l = 0;
    while (e) {
      l += e.offsetLeft;
      e = e.offsetParent;
    }
    return l;
  },
  ltp: function(e) {
    var t = 0;
    while (e) {
      t += e.offsetTop;
      e = e.offsetParent;
    }
    return t;
  },
  clear: function() {
    Iput.confg.hand = "0";
    Iput.confg.ok = null;
    Iput.confg.top = 0;
    Iput.confg.left = 0;
    Iput.confg.bodyHeight = 0;
    Iput.confg.bodyWidth = 0;
    Iput.confg.width = 0;
    Iput.confg.pop = null;
  },
  stopBubble: function(e) {
    if (e && e.stopPropagation) {
      e.stopPropagation(); //w3c
    } else {
      window.event.cancelBubble = true; //IE
    }
  },
  pop: function() {
    var $a = document.getElementsByTagName("body").item(0);
    var $c = document.createElement("iframe");
    var $b = document.createElement("div");
    $c.setAttribute("id", Iput.confg.idIframe);
    $c.setAttribute("src", "about:blank");
    $c.style.zindex = "100";
    $c.frameBorder = "0";
    $c.style.width = "0px";
    $c.style.height = "0px";
    $c.style.position = "absolute";
    $b.setAttribute("id", Iput.confg.idBox);
    $b.setAttribute("align", "left");
    $b.style.position = "absolute";
    $b.style.background = "transparent";
    $b.style.zIndex = "20000";
    if ($a) {
      if (Iput.get(Iput.confg.idIframe)) {
        Iput.colse();
      }
      $a.appendChild($c);
      if ($c) {
        $c.ownerDocument.body.appendChild($b);
      }
      Iput.get(Iput.confg.idBox).innerHTML = Iput.confg.content;
      Iput.drice(Iput.confg.event);
    }

    if (!document.all) {
      window.document.addEventListener("click", Iput.hide, false);
    } else {
      window.document.attachEvent("onclick", Iput.hide);
    }
  },
  drice: function(e) {
    var bodyHith =
      Iput.confg.bodyHeight == 0
        ? document.body.scrollHeight
        : Iput.confg.bodyHeight;
    var bodywidth =
      Iput.confg.bodyWidth == 0
        ? document.body.scrollWidth
        : Iput.confg.bodyWidth;
    if (!e) e = window.event;
    var top = 0,
      left = 0;
    var a = Iput.get(Iput.confg.idBox);
    var b = Iput.get(Iput.confg.idIframe);
    var c = Iput.confg.id.offsetHeight;
    var d = Iput.confg.id.offsetWidth;
    var w = 0;
    var st = 0;
    var sl = 0;
    if (Iput.confg.soll != null) {
      st = document.getElementById(Iput.confg.soll).scrollTop;
      sl = document.getElementById(Iput.confg.soll).scrollLeft;
    }
    if (Iput.get(Iput.confg.idIframe)) {
      if (Iput.confg.hand == "1") {
        top =
          Iput.confg.top +
          document.body.scrollTop +
          document.documentElement.scrollTop +
          e.clientY;
        left =
          Iput.confg.left +
          e.clientX +
          document.body.scrollLeft +
          document.documentElement.scrollLeft;
        if (a.offsetHeight + top > bodyHith) {
          top =
            top -
            a.offsetHeight +
            Iput.get(Iput.confg.idBox).firstChild.offsetHeight;
        }
        if (a.offsetWidth + left > bodywidth) {
          left =
            left -
            a.offsetWidth +
            Iput.get(Iput.confg.idBox).firstChild.offsetWidth;
        }
        a.style.top = top - st + "px";
        b.style.top = top - st + "px";
        a.style.left = left - sl + "px";
        b.style.left = left - sl + "px";
      } else if (Iput.confg.hand == "0") {
        w = Iput.confg.id.offsetWidth + "px";
        a.style.width = w;
        b.style.width = w;
        height = c;
        top = Iput.confg.top + Iput.ltp(Iput.confg.id);
        left = Iput.confg.left + Iput.lft(Iput.confg.id);
        if (a.firstChild.offsetHeight + top + c > bodyHith) {
          top = top - a.firstChild.offsetHeight - c;
        }
        if (a.firstChild.offsetWidth + left > bodywidth) {
          left = left - a.firstChild.offsetWidth + d;
        }
        b.style.top = top - st + "px";
        a.style.top = top - st + height + "px";
        b.style.left = left - sl + "px";
        a.style.left = left - sl + "px";
      } else {
        height = c;
        top =
          Iput.confg.top -
          Iput.get(Iput.confg.hand).scrollTop +
          Iput.ltp(Iput.confg.id);
        left =
          Iput.confg.left -
          Iput.get(Iput.confg.hand).scrollLeft +
          Iput.lft(Iput.confg.id);

        if (a.offsetHeight + top > bodyHith) {
          top = top - a.offsetHeight - c;
        }
        if (a.offsetWidth + left > bodywidth) {
          left = left - a.offsetWidth - d;
        }

        b.style.top = top - st + height + "px";
        a.style.top = top - st + height + "px";
        b.style.left = left - sl + "px";
        a.style.left = left - sl + "px";
      }
    }
  },
  show: function() {
    var config = arguments[0];
    var that = Iput.confg;
    Iput.clear();
    for (var i in that) {
      if (config[i] != undefined) {
        that[i] = config[i];
      }
    }
    Iput.pop();
    if (Iput.confg.ok != null) {
      Iput.action(Iput.confg.ok());
    }
  },
  colse: function() {
    if (Iput.get(Iput.confg.idIframe)) {
      document.body.removeChild(Iput.get(Iput.confg.idBox));
      document.body.removeChild(Iput.get(Iput.confg.idIframe));
    }
    if (Iput.get(Iput.confg.pop)) {
      Iput.get(Iput.confg.pop).style.display = "none";
    }
  },
  $colse: function() {
    Iput.colse();
  },
  hide: function(e) {
    //点击任何处关闭层
    e = window.event || e;
    var srcElement = e.srcElement || e.target;
    if (Iput.confg.event == undefined) {
      //输入时用,般在没传入Iput.confg.event请况下使用
      Iput.colse();
    } else {
      var a = Iput.confg.event.srcElement || Iput.confg.event.target;
      var b = Iput.get(Iput.confg.pop);
      if (a != srcElement) {
        Iput.colse();
      }
      if (b != null) {
        if (b != srcElement && a != srcElement) {
          Iput.colse();
        }
      }
    }
    if (Iput.get(Iput.confg.idIframe)) {
      Iput.get(Iput.confg.idIframe).onclick = function(e) {
        Iput.stopBubble(e);
      };
      Iput.get(Iput.confg.idBox).onclick = function(e) {
        Iput.stopBubble(e);
      };
    }
    if (Iput.get(Iput.confg.pop)) {
      Iput.get(Iput.confg.pop).onclick = function(e) {
        Iput.stopBubble(e);
      };
    }
  },
  action: function(obj) {
    eval(obj);
  },
  cookie: {
    Set: function(name, val) {
      var Days = 30; //此 cookie 将被保存 30 天
      var exp = new Date(); //new Date("December 31, 9998");
      exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
      document.cookie =
        name + "=" + escape(val) + ";expires=" + exp.toGMTString() + "; path=/";
    },
    Get: function(name) {
      var start = document.cookie.indexOf(name);
      var end = document.cookie.indexOf(";", start);
      return start == -1
        ? null
        : unescape(
            document.cookie.substring(
              start + name.length + 1,
              end > start ? end : document.cookie.length
            )
          );
    },
    Del: function(name) {
      var exp = new Date();
      exp.setTime(exp.getTime() - 1);
      var cval = this.GetCookie(name);
      if (cval != null)
        document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
    }
  },
  ischeck: function(bol) {
    var objs = form1.getElementsByTagName("input");
    if (bol) {
      for (var i = 0; i < objs.length; i++) {
        if (objs[i].type.toLowerCase() == "checkbox") {
          objs[i].checked = true;
        }
      }
    } else {
      for (var i = 0; i < objs.length; i++) {
        if (objs[i].type.toLowerCase() == "checkbox") {
          objs[i].checked = false;
        }
      }
    }
  },
  contains: function(star, end, isIgnoreCase) {
    if (isIgnoreCase) {
      star = star.toLowerCase();
      end = end.toLowerCase();
    }
    var startChar = end.substring(0, 1);
    var strLen = end.length;
    for (var j = 0; j < star.length - strLen + 1; j++) {
      if (star.charAt(j) == startChar) {
        //如果匹配起始字符,开始查找
        if (star.substring(j, j + strLen) == end) {
          //如果从j开始的字符与str匹配，那ok
          return true;
        }
      }
    }
    return false;
  },
  gData: function(name, value) {
    var top = window.top,
      cache = top["_CACHE"] || {};
    top["_CACHE"] = cache;
    return value ? (cache[name] = value) : cache[name];
  },
  rData: function(name) {
    var cache = window.top["_CACHE"];
    if (cache && cache[name]) delete cache[name];
  }
};
