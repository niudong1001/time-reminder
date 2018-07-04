import miment from 'miment'
export default {
    getGUID(){
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (d + Math.random()*16)%16 | 0;
            d = Math.floor(d/16);
            return (c=='x' ? r : (r&0x3|0x8)).toString(16);
        });
        return uuid; 
    },
    checkTask(task){
        if(task && task.title){
            return true;
        }
        return false;
    },
    // 两个都需要为miment格式
    isSameDay(eData, tData){
        if(eData.format("YYYY")!=tData.format("YYYY") || 
          eData.format("MM")!=tData.format("MM") ||
          eData.format("DD")!=tData.format("DD")
          ){
            return false;
          }
          return true;
    },
    // list中是否有attr为value的item
    haveItem(list, attr, value){
        if(!list.length||!list[0][attr]){
            return null;
        }
        let l = list.length;
        for(let i =0; i<l;i++){
            if(list[i][attr] == value){
                return list[i];
            }
        }
        return null;
    },
    findItem(list, attr, value){
        if(!list.length||!list[0][attr]){
            return -1;
        }
        let l = list.length;
        for(let i =0; i<l;i++){
            if(list[i][attr] == value){
                return i;
            }
        }
        return -1;
    }
}