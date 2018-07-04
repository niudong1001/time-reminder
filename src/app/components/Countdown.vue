<template>  
  <span :endTime="endTime" :callback="callback" :endText="endText">  
    <slot>  
      {{content||this.timeUnit+":00"}}  
    </slot>  
  </span>  
</template>  
<script>  
  export default {  
    data(){  
      return {  
        content: '', 
        timer:null
      }  
    },  
    props:{  
      enable:{
        type:Boolean,
        default:false
      },
      endTime:{  
        type: String,  
        default :''  
      },
      timeUnit:{
        type: Number,  
        default :45  
      },  
      endText:{  
        type : String,  
        default:'00:00'  
      },  
      callback : {  
        type : Function,  
        default :''  
      },
      callbackConfig:{
        type : Object,  
        default :{}
      } 
    },  
    watch:{
      enable(v){
        // console.log(v, this);
        if(!v){
          if(this.timer){
            clearInterval(this.timer);
            this.content = "";
          }
        }
        else{
          this.countdowm(this.endTime);
        }
      },
    },
    mounted () {  
      // console.log(this.enable);
      if(this.enable){
        this.countdowm(this.endTime)  
      }
    },  
    methods: {  
      countdowm(timestamp){  
      let self = this;  
      self.timer = setInterval(function(){  
        let nowTime = new Date();  
        let endTime = new Date(parseInt(timestamp));  
        // console.log(nowTime, endTime, timestamp)
        let t = endTime.getTime() - nowTime.getTime();  
        if(t>0){  
          let day = Math.floor(t/86400000);  
          let hour=Math.floor((t/3600000)%24);  
          let min=Math.floor((t/60000)%60);  
          let sec=Math.floor((t/1000)%60);  
          hour = hour < 10 ? "0" + hour : hour;  
          min = min < 10 ? "0" + min : min;  
          sec = sec < 10 ? "0" + sec : sec;  
          let format = '';  
          if(day > 0){  
            format = `${day}天${hour}小时${min}分${sec}秒`;  
          }   
          if(day <= 0 && hour > 0 ){  
            format = `${hour}:${min}:${sec}`;   
          }  
          if(day <= 0 && hour <= 0){  
            format =`${min}:${sec}`;  
          }  
          self.content = format;  
          }
          else{  
           clearInterval(self.timer);  
           self.content = self.endText;  
           self._callback();  
          }  
         },1000);  
        },  
        _callback(){  
        if(this.callback && this.callback instanceof Function){  
           this.callback(this.callbackConfig);  
         }  
      }  
    }  
  }  
</script> 