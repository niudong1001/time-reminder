'use strict';
let is_running = false;  // 避免连续点击

// 获得user_data
function getSyncStorage(key, callback){
  chrome.storage.sync.get(key, function(result) {
    console.log(key +' value currently is: ');
    console.log(result)
    if(callback){
      callback(result)
    }
  });
}

// 设置user_data
function setSyncStorage(obj, callback){
  chrome.storage.sync.set(obj, function() {
    console.log('Obj is saved:');
    console.log(obj)
    if (chrome.runtime.lastError) 
    {
      console.log('存储出错！')
    }
    if(callback){
      callback()
    } 
  });
}

// 移除user_data
function rmStorage(key, callback){
  chrome.storage.sync.remove(key, function() {
    // console.log(key + ' is removed from storage');
    if(callback){
      callback()
    }
  });
}

// 移除存入storage的window
function rm_window(){
  rmStorage(['TimeReminder'])
}

chrome.runtime.onInstalled.addListener(function (details) {
  console.log('previousVersion', details.previousVersion);
  rm_window()
});

// chrome.browserAction.setBadgeText({ });

// 点击图标执行
chrome.browserAction.onClicked.addListener(function (tab) {
  console.log(is_running)
  // 首先获得window_id
  getSyncStorage(['TimeReminder'], function(res){
    // console.log(window_id)
    let windowId = res['TimeReminder']
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
          'TimeReminder': win.id
        }
        setSyncStorage(saved_data, function(){
          is_running = false
          getSyncStorage(['TimeReminder'])
        })
      });
    }
  });
});

// 目标窗口被移除
chrome.windows.onRemoved.addListener((winid)=>{
  // console.log(winid)
  getSyncStorage(['TimeReminder'], function(res){
    let windowId = res['TimeReminder']
    if(windowId == winid){
      rm_window()
    }
  })
})
