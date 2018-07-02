<template>
  <div>
    <h1 class="c-title">
      <i class="el-icon-back c-title__back" @click="$router.go(-1)"></i> 
      <span class="c-color--primary">测试</span>  
    </h1>
    <div class="task">
      <el-row>
        <el-col :span="4" class="task-item f-tc">
          <span class="icon-play-circle task-item__icon"></span>
        </el-col>
        <el-col :span="6" class="task-item">
          <span class="task-item__time" id="countdown">
            <count-down :endTime="endTime" :timeUnit="task.basicTimeUnit" :callback="timeEndCallback" endText="00:00">
                
            </count-down>  
          </span>  
        </el-col>
        <el-col :span="4" class="task-item">
          <span class="task-item__desc">学习</span>
        </el-col>
        <el-col :span="10" class="task-item"></el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
  import miment from 'miment'
  import Countdown from "js-countdown";
  export default {
    data: () => (
    {
      task:{
        id: 1,
        title:"学习Nengo",
        desc:"今天要学习nengo",
        startTime:miment().stamp(),
        basicTimeUnit:1,  // 45分钟
        estimate:1
      },
      myAudio:null,
      notification_id: null
    }),
    computed: { 
      endTime(){
        return (this.task.startTime + this.task.estimate * this.task.basicTimeUnit * 1 * 1000).toString();
      }
    },
    created () {
      console.log('New tab')
    },
    mounted () { 
      // let lastTime = this.task.startTime + this.task.estimate * this.task.basicTimeUnit * 60 * 1000;
      // let count = new Countdown(document.getElementById('countdown'),{
      //   format: "mm:ss",
      //   lastTime: lastTime
      // });
    },
    beforeDestroy(){
      this.closeSound();
    },
    methods: {
      closeSound(){
        this.myAudio.pause();
        this.myAudio.load();
        console.log(this.notification_id)
        chrome.notifications.clear(this.notification_id);
      },
      timeEndCallback(){
        console.log("倒计时到了！")
        // type, iconUrl, title and message.
        var opt = {
            type: 'basic',
            title: 'Time is up!',
            message: 'The time of task "' + this.task.title + '" is up.',
            priority: 1,
            // items: [{ title: '', message: ''}],
            iconUrl:'../images/timeUp.jpg',
            requireInteraction:true
        };
        this.myAudio = new Audio();
        this.myAudio.src = "../audios/audio.aac";
        this.myAudio.play();
        chrome.notifications.create(null, opt, (id)=>{
          console.log(id);
          this.notification_id = id;
        });
        chrome.notifications.onClosed.addListener(()=>{
          this.closeSound();
        })
      }
    }
  }
</script>
<style lang="scss">
  $bg-color:rgb(18, 62, 60);
  $primary-color:rgb(57, 122, 109);
  .task {
    margin: 20px;
    background: rgb(7, 27, 25);
    min-height: 250px;
    &-item {
      &__icon {
        font-size: 50px;
        line-height: 240px;
        color:#ccc;
      }
      &__time {
        font-size: 100px;
        line-height: 250px;
        color:#ccc;
      }
      &__desc {
        font-size: 14px;
        display: inline-block;
        margin: 90px 0;
      }
    }
  }
</style>
