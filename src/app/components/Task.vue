<template>
  <div>
    <h1 class="c-title">
      <i class="el-icon-back c-title__back" :class="task.state=='started'?'c-title__back--hide':''"  @click="task.state!='started'&&$router.go(-1)"></i> 
      <span class="c-color--primary">{{task.title}}</span>  
    </h1>
    <div class="task">
      <el-row>
        <el-col :span="4" class="task-item f-tc">
          <span class="icon-stop-circle task-item__icon" title="stop" v-if="task.state=='started'" @click="changeTaskState('prepare')"></span>
          <span class="icon-play-circle task-item__icon" title="start" v-else @click="changeTaskState('started')"></span>
        </el-col>
        <el-col :span="6" class="task-item">
          <span class="task-item__time" id="countdown">
            <count-down v-if="task.state=='started'" :endTime="endTime" :timeUnit="task.basicTimeUnit" :callback="timeEndCallback" endText="00:00">
            </count-down>  
            <span v-else>
              00:00
            </span>
          </span>  
        </el-col>
        <el-col :span="4" class="task-item">
          <span class="task-item__desc">{{task.desc}}</span>
        </el-col>
        <el-col :span="10" class="task-item">
          <div class="task-item__statistics">
            <div class="task-item__statistics__item">
              <i class="el-icon-circle-check-outline task-item__statistics__item-icon"></i>
              <span>Estimated  {{task.estimate}}</span>
            </div>
            <div class="task-item__statistics__item">
              <i class="el-icon-circle-check task-item__statistics__item-icon"></i>
              <span>Completed  {{task.finished}}</span>
            </div>
          </div>
        </el-col>
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
        myAudio:null,
        notification_id: null,
        startCountdown:false,
        startTime:miment().stamp(),
        _task:{}
      }
    ),
    computed: { 
      taskId(){
        return this.$route.params.taskId;
      },
      task(){
        let taskId = this.$route.params.taskId;
        let todayTasks = this.$store.getters.allTasks;
        let temp = {}
        todayTasks.forEach(elem => {
          if(elem.id == taskId){
            temp = elem
          }
        });
        this._task = temp;
        return temp;
      },
      endTime(){
        return (this.startTime + 1 * this.task.basicTimeUnit * 60 * 1000 + 1*1000).toString();
      }
    },
    created () {
      // console.log('New tab')
    },
    mounted () { 
    },
    beforeDestroy(){
      if(this.myAudio){
        this.closeNotif();
      }
    },
    methods: {
      changeTaskState(state){
        let vm=this;
        if(state=="prepare"){
          this.$confirm('You want stop the task?', 'Info', {
            confirmButtonText: 'ensure',
            cancelButtonText: "cancel",
            type: 'warning'
          }).then(() => {
            vm.task.state = state;
            vm.startTime = miment().stamp();
          }).catch(() => {
                     
          });
        }
        else{
          vm.task.state = state;
          vm.startTime = miment().stamp();
        }
      },
      closeNotif(){
        this.myAudio.pause();
        this.myAudio.load();
        chrome.notifications.clear(this.notification_id);
      },
      timeEndCallback(){
        // console.log("倒计时到了！")
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
        // console.log(this._task)
        // store更新
        this._task.finished += 1;
        this._task.state = "finished";
        this.$store.commit("updateTask",{taskId:this.taskId, task:this._task});
        this.$store.dispatch("saveTasks");
        // Audio控制
        this.myAudio = new Audio();
        this.myAudio.src = "../audios/audio.aac";
        this.myAudio.play();
        chrome.notifications.create(null, opt, (id)=>{
          this.notification_id = id;
        });
        chrome.notifications.onClosed.addListener(()=>{
          this.closeNotif();
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
    // height: 250px;
    // overflow: hidden;
    &-item {
      &__icon {
        font-size: 50px;
        line-height: 240px;
        color:#ccc;
        cursor: pointer;
        &:hover {
          color: #eee;
        }
      }
      &__time {
        font-size: 100px;
        line-height: 250px;
        color:#ccc;
      }
      &__desc {
        font-size: 14px;
        display: inline-block;
        padding: 90px 0;
      }
      &__statistics {
        color:#eee;
        margin: 85px 0;
        text-align: left;
        &__item {
          width: 35%;
          text-align: right;
          font-size: 18px;
          font-weight: 600;
          margin-top: 10px;
          &-icon {
            font-size: 24px;
          }
        }
      }
    }
  }
</style>
