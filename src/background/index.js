'use strict';
import storage from "../ext/storage"
let is_running = false;  // 避免连续点击

// 移除存入storage的window
function rm_window(){
  storage.rmLocalStorage(['TimeReminderWinId'])
}

chrome.runtime.onInstalled.addListener(function (details) {
  console.log('previousVersion', details.previousVersion);
  rm_window()
});


// 点击图标执行
chrome.browserAction.onClicked.addListener(function (tab) {
  // 首先获得window_id
  storage.getLocalStorage(['TimeReminderWinId'], function(res){
    // console.log(window_id)
    let windowId = res['TimeReminderWinId']
    if(windowId){
      // 获得焦点
      chrome.windows.update(windowId, {
        'focused': true
      })
    }
    else if (!is_running){
      is_running = true
      chrome.windows.create({ url: chrome.runtime.getURL('pages/app.html'), type:"popup"}, function(win){  // 回传创建的window对象
        // window_id = win.id;
        let saved_data = {
          'TimeReminderWinId': win.id
        }
        storage.setLocalStorage(saved_data, function(){
          is_running = false
        })
      });
    }
  });
});

// 目标窗口被移除
chrome.windows.onRemoved.addListener((winid)=>{
  // console.log(winid)
  storage.getLocalStorage(['TimeReminderWinId'], function(res){
    let windowId = res['TimeReminderWinId']
    if(windowId == winid){
      rm_window()
    }
  })
})

// router
chrome.webRequest.onBeforeRequest.addListener(function (info) {
  console.log(info.url)
  var runtimeId = chrome.runtime.id
  var urlWithoutProtocol = info.url.split('//')[1]
  var path = urlWithoutProtocol.substring(runtimeId.length)
  if(info.url.indexOf("#") < 0){  // 不用跳转
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
},
{
  urls: ["chrome-extension://" + chrome.runtime.id + "/*"]
},
["blocking"]
);