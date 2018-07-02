/**
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Storage/LocalStorage}
 */
export default {
  getSyncStorage(key, callback){
    chrome.storage.sync.get(key, function(result) {
      console.log(key +' value currently is(sync): ');
      console.log(result)
      if(callback){
        callback(result)
      }
    });
  },
  setSyncStorage(obj, callback){
    chrome.storage.sync.set(obj, function() {
      console.log('Obj is saved(sync):');
      console.log(obj)
      if(callback){
        callback()
      } 
    });
  },
  rmSyncStorage(key, callback){
    chrome.storage.sync.remove(key, function() {
      // console.log(key + ' is removed from storage');
      if(callback){
        callback()
      }
    });
  },
  getLocalStorage(key, callback){
    chrome.storage.local.get(key, function(result) {
      console.log(key +' value currently is(local): ');
      console.log(result)
      if(callback){
        callback(result)
      }
    });
  },
  setLocalStorage(obj, callback){
    chrome.storage.local.set(obj, function() {
      console.log('Obj is saved(local):');
      console.log(obj)
      if(callback){
        callback()
      } 
    });
  },
  rmLocalStorage(key, callback){
    chrome.storage.local.remove(key, function() {
      // console.log(key + ' is removed from storage');
      if(callback){
        callback()
      }
    });
  }
}
