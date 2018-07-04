/* -------------------------------------------------- */
/*  Start of Webpack Chrome Hot Extension Middleware  */
/* ================================================== */
/*  This will be converted into a lodash templ., any  */
/*  external argument must be provided using it       */
/* -------------------------------------------------- */
var WebpackReloadPlugin = false;
(function (chrome, window) {
    const name = 'background';
    const id = parseInt('3');
    const wsHost = 'ws://localhost:9090/';
    const filename = 'js/background.js';
    const { runtime, tabs } = chrome;
    const logger = (msg, level = 'info') => console[level]('[ WCER: ' + msg + ' ]');
    const manifest = (runtime && runtime.getManifest) ? runtime.getManifest() : undefined;
    var path = (manifest ? manifest.name + ' | ' : '') + (name || filename);
    if (path.length > 43)
        path = path.slice(0, 20) + '...' + path.slice(-20);
    function init() {
        let timerId = null;
        let socket = null;
        try {
            socket = new WebSocket(wsHost + id.toString());
        }
        catch (err) {
            console.log(err);
        }
        let send = (type, data) => {
            if (typeof data === 'string') {
                data = (new Date()).toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1") + ' - ' + path + ' | ' + data;
            }
            socket.send(JSON.stringify({ type, data }));
        };
        socket.onopen = () => {
            logger(wsHost);
            clearTimeout(timerId);
            WebpackReloadPlugin = true;
        };
        socket.onmessage = ({ data: json }) => {
            const { type, data } = JSON.parse(json);
            if (runtime.reload && type === 'restart') {
                send('restart', 'successfully restart');
                runtime.reload();
                runtime.restart();
            }
            if (type === 'reload' && id === data.id) {
                send('reloaded', 'successfully reloaded');
                window.location.reload();
            }
        };
        socket.onclose = ({ code }) => {
            logger("Socket connection closed.", 'warn');
            timerId = setTimeout(() => {
                logger('WEPR Attempting to reconnect ...');
                init();
                logger('Reconnected. Reloading plugin');
            }, 2000);
        };
        window.onbeforeunload = () => socket.close();
    }
    !WebpackReloadPlugin ? init() : logger('WebpackReloadPlugin: Socket already started !');
})(chrome, window);
/* ----------------------------------------------- */
/* End of Webpack Chrome Hot Extension Middleware  */
/* ----------------------------------------------- */ 
var background =
webpackJsonp_name_([3],{

/***/ 206:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ext_storage__ = __webpack_require__(29);



var is_running = false; // 避免连续点击

// 移除存入storage的window
function rm_window() {
  __WEBPACK_IMPORTED_MODULE_0__ext_storage__["a" /* default */].rmLocalStorage(['TimeReminderWinId']);
}

chrome.runtime.onInstalled.addListener(function (details) {
  console.log('previousVersion', details.previousVersion);
  rm_window();
  document.oncontextmenu = function () {
    // 拒绝右键点击
    return false;
  };
});

// 点击图标执行
chrome.browserAction.onClicked.addListener(function (tab) {
  // 首先获得window_id
  __WEBPACK_IMPORTED_MODULE_0__ext_storage__["a" /* default */].getLocalStorage(['TimeReminderWinId'], function (res) {
    // console.log(window_id)
    var windowId = res['TimeReminderWinId'];
    if (windowId) {
      // 获得焦点
      chrome.windows.update(windowId, {
        'focused': true
      });
    } else if (!is_running) {
      is_running = true;
      chrome.windows.create({ url: chrome.runtime.getURL('pages/app.html'), type: "popup" }, function (win) {
        // 回传创建的window对象
        // window_id = win.id;
        var saved_data = {
          'TimeReminderWinId': win.id
        };
        __WEBPACK_IMPORTED_MODULE_0__ext_storage__["a" /* default */].setLocalStorage(saved_data, function () {
          is_running = false;
        });
      });
    }
  });
});

// 目标窗口被移除
chrome.windows.onRemoved.addListener(function (winid) {
  // console.log(winid)
  __WEBPACK_IMPORTED_MODULE_0__ext_storage__["a" /* default */].getLocalStorage(['TimeReminderWinId'], function (res) {
    var windowId = res['TimeReminderWinId'];
    if (windowId == winid) {
      rm_window();
    }
  });
});

// router
chrome.webRequest.onBeforeRequest.addListener(function (info) {
  console.log(info.url);
  var runtimeId = chrome.runtime.id;
  var urlWithoutProtocol = info.url.split('//')[1];
  var path = urlWithoutProtocol.substring(runtimeId.length);
  if (info.url.indexOf("#") < 0) {
    // 不用跳转
    return;
  }
  /**
   * We have to redirect every actual navigational request to index.html because we do not have a webserver
   * and cannot simply serve index.html with every request.
   * But we also want to keep the routing for the vue app, so we redirect to index.html with an additional parameter
   * 'route' that resembles the route for vue-router. We pickup this parameter in routes/index.js and redirect to
   * the actual vue component that we wanted to load.
   *
   * We do not want to redirect assets and static files, so we split the path at '.' to check if it has an extension.
   * Every path with an extension listed in STATIC_EXTENSIONS will not be redirected.
   *
   * Hint: this behavior is only triggered on page refresh (e.g. "F5"). Navigation normally will trigger vue-router
   * directly and is not handled by listener.
   */
  // var ext = path.split('.').pop()
  // var STATIC_EXTENSIONS = ['html', 'js', 'css', 'gz', 'png', 'woff2', 'ttf']
  // if (STATIC_EXTENSIONS.indexOf(ext) < 0) {
  //   return {redirectUrl: "chrome-extension://" + runtimeId + '/app.html' + '?route=' + path}
  // }
}, {
  urls: ["chrome-extension://" + chrome.runtime.id + "/*"]
}, ["blocking"]);

/***/ }),

/***/ 29:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Storage/LocalStorage}
 */
/* harmony default export */ __webpack_exports__["a"] = ({
  getSyncStorage: function getSyncStorage(key, callback) {
    chrome.storage.sync.get(key, function (result) {
      console.log(key + ' value currently is(sync): ');
      console.log(result);
      if (callback) {
        callback(result);
      }
    });
  },
  setSyncStorage: function setSyncStorage(obj, callback) {
    chrome.storage.sync.set(obj, function () {
      console.log('Obj is saved(sync):');
      console.log(obj);
      if (callback) {
        callback();
      }
    });
  },
  rmSyncStorage: function rmSyncStorage(key, callback) {
    chrome.storage.sync.remove(key, function () {
      // console.log(key + ' is removed from storage');
      if (callback) {
        callback();
      }
    });
  },
  getLocalStorage: function getLocalStorage(key, callback) {
    chrome.storage.local.get(key, function (result) {
      console.log(key + ' value currently is(local): ');
      console.log(result);
      if (callback) {
        callback(result);
      }
    });
  },
  setLocalStorage: function setLocalStorage(obj, callback) {
    chrome.storage.local.set(obj, function () {
      console.log('Obj is saved(local):');
      console.log(obj);
      if (callback) {
        callback();
      }
    });
  },
  rmLocalStorage: function rmLocalStorage(key, callback) {
    chrome.storage.local.remove(key, function () {
      // console.log(key + ' is removed from storage');
      if (callback) {
        callback();
      }
    });
  }
});

/***/ })

},[206]);
//# sourceMappingURL=background.js.map