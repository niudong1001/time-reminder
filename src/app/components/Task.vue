<template>
  <div>
    <h1 class="c-title">
      <i class="el-icon-back c-title__back" :class="task.state=='started'||task.state=='break'?'c-title__back--hide':''"  @click="task.state!='started'&&task.state!='break'&&$router.go(-1)"></i> 
      <span class="c-color--primary">{{task.title}}<span v-if="task.state=='break'">(Breaking...)</span> </span>  
    </h1>
    <div class="task">
      <el-row>
        <el-col :span="5" class="task-item f-tc">
          <span class="icon-stop-circle task-item__icon" title="stop" v-if="task.state=='started'||task.state=='break'" @click="changeTaskState('prepare')">
          </span>
          <span class="icon-play-circle task-item__icon" title="start" v-else @click="changeTaskState('started')"></span>
          <el-popover
            placement="bottom-start"
            width="50"
            trigger="click"
            v-if="task.state!='started'&&task.state!='break'"
            >
            <div class="popper-list">
              <a class="popper-list__item" @click="changeTaskState('break', 'long')">
                <i class="icon-forkandspoon popper-list__item-icon"></i> Long break
              </a>
              <a class="popper-list__item" @click="changeTaskState('break', 'short')">
                <i class="icon-forkandknife popper-list__item-icon"></i> Short break
              </a>
            </div>
            <span  class="el-icon-arrow-down task-item__restIcon" slot="reference"></span>
          </el-popover>
        </el-col>
        <el-col :span="7" class="task-item">
          <span class="task-item__time" id="countdown">
            <count-down :callbackConfig="countdownConfig" :enable="enableCountdown" :timeUnit="countUnitTime" :endTime="endTime" :callback="timeEndCallback" endText="00:00">
            </count-down>  
          </span>  
        </el-col>
        <el-col :span="5" class="task-item">
          <span class="task-item__desc">{{task.desc}}</span>
        </el-col>
        <el-col :span="7" class="task-item">
          <div class="task-item__statistics">
            <div class="task-item__statistics__item">
              <i class="el-icon-circle-check-outline task-item__statistics__item-icon"></i>
              <span>Estimated  {{task.estimate}}</span>
            </div>
            <div class="task-item__statistics__item">
              <i class="el-icon-circle-check task-item__statistics__item-icon"></i>
              <span>Completed  {{task.finished}}</span>
            </div>
            <div class="task-item__statistics__item">
              <i class="icon-forkandspoon task-item__statistics__item-icon" style="font-size:18px;margin-left:4px;margin-right:3px"></i>
              <span>Breaked  {{task.break||0}}</span>
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
        _task:{},
        myAudio:null,
        notificationId: null,
        enableCountdown:false,
        countStartTime:miment().stamp(),
        countUnitTime:45,
        countdownConfig:{
          title:"Time is up!",
          message:"Your task time is up.",
          taskClass:"task"
        },
        longBreakTime:15,
        shortBreakTime:10,
        taskClass:"task"  // "longBreak" || "shortBreak"
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
        // 寻找task
        todayTasks.forEach(elem => {
          if(elem.id == taskId){temp = elem}
        });
        this._task = temp;
        return temp;
      },
      endTime(){
        return (this.countStartTime + 1 * this.countUnitTime * 60 * 1000 + 1*1000).toString();
      }
    },
    mounted () { 
    },
    beforeDestroy(){
      if(this.myAudio){
        this.closeNotif();
      }
    },
    methods: {
      startCountdown(minutes){
        this.closeNotif();
        this.countStartTime = miment().stamp();
        this.countUnitTime = minutes||this._task.basicTimeUnit;
        this.enableCountdown = true;
      },
      // 更新coundown config
      updateCDConfig(taskClass){
        let message = "Hi, your task time is up~";
        if(taskClass == "long"){
          message = "Hi, your long break time is up~";
        }
        else if(taskClass=="short"){
          message = "Hi, your short break time is up~"; 
        }
        this.countdownConfig.message = message;
        this.countdownConfig.taskClass = taskClass;
      },
      changeTaskState(state, option=null){
        let vm=this;
        if(state=="prepare"){
          this.$confirm('You want stop the task?', 'Warning', {
            confirmButtonText: 'ensure',
            cancelButtonText: "cancel",
            type: 'warning'
          }).then(() => {
            vm.task.state = state;
            vm.countUnitTime = this._task.basicTimeUnit;
            vm.enableCountdown = false;
          }).catch(() => {});
        }
        else if(state=="break"){
          vm.task.state = state;
          this.updateCDConfig(option);
          let minutes = option=="long"?this.longBreakTime:this.shortBreakTime;
          this.startCountdown(minutes);
        }
        else{
          vm.task.state = state;
          vm.startCountdown();
        }
      },
      closeNotif(){
        if(this.myAudio){
          this.myAudio.pause();
          this.myAudio.load();
        }
        if(this.notificationId){
          chrome.notifications.clear(this.notificationId);
        }
      },
      timeEndCallback(config){
        // option
        // this.$forceUpdate();
        let {taskClass,message,title} = config;
        var opt = {
            type: 'basic',
            title: title,
            message: message,
            priority: 1,
            iconUrl:'../images/timeUp.jpg',
            requireInteraction:true
        };
        // store更新
        if(taskClass=="task"){
          this._task.finished += 1;
        }
        else {
          this._task.break += 1;
        }
        this.enableCountdown = false;
        this._task.state = "finished";
        this.$store.commit("updateTask",{taskId:this.taskId, task:this._task});
        this.$store.dispatch("saveTasks");
        this.countUnitTime = this._task.basicTimeUnit;
        // Audio控制
        this.myAudio = new Audio();
        this.myAudio.src = "../audios/audio.aac";
        this.myAudio.play();
        // 通知控制
        chrome.notifications.create(null, opt, (id)=>{
          this.notificationId = id;
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
  .el-popover {
    border-radius: 2px;
    color:#000;
    font-size: 15px;
    padding: 0;
  }
  .popper-list {
      &__item {
        display: block;
        padding: 10px;
        border-bottom: 1px solid #eee;
        cursor: pointer;
        &:last-of-type{
          border-bottom: none;
        }
        &:hover {
          background: #eee;
        }
        &-icon {
          position: relative;
          top:2px;
          width: 20px;
          display: inline-block;
        }
      }
    }
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
      &__restIcon {
        font-size: 30px;
        margin-left: 18%;
        position: relative;
        bottom: 5px;
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
        margin: 75px 0;
        text-align: left;
        &__item {
          text-align: left;
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
