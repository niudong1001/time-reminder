<template>
  <div>
    <h1 class="c-title">
      <!-- <i class="el-icon-back c-title__back "></i>  -->
      <span class="c-color--primary" style="margin-left:15px">For Today</span>  
      <span >
        <span class="c-title__btn" @click="addTask">
          <i class="el-icon-circle-plus-outline c-title__btn-icon"></i>
          Add Task
        </span>
        <span class="f-ml05 c-title__btn" @click="tellHistory" >
          <i class="icon-database c-title__btn-icon"></i>
          Tell history
        </span>
      </span>
    </h1>
    <div v-if="!todayTasks.length" class="todayTasks-list-placeholder">
        It’s very clean today, let’s start a task~
    </div>
     
    <el-row class="todayTasks-list" id="todayTasks-list">
      <el-col :span="6" v-for="task in todayTasks" :key="task.id" v-if="task.show">
        <div @contextmenu="clickRightBtn(task, $event)"  class="todayTasks-list__item">
          <div class="todayTasks-list__item-title c-color--primary" @click="router({name:'Task',params:{taskId:task.id}})">{{task.title}}</div>
          <div class="todayTasks-list__item-desc" @click="router({name:'Task',params:{taskId:task.id}})">{{task.desc}}</div>
          <div class="todayTasks-list__item-icons">
            <i class="el-icon-circle-check-outline todayTasks-list__item-icons__item"></i>{{task.estimate}}<i class="el-icon-circle-check todayTasks-list__item-icons__item"></i>{{task.finished}}<i style="font-size:15px" class="icon-forkandspoon todayTasks-list__item-icons__item"></i>{{task.break}}  
          </div>
          <!-- <context-menu class="right-menu" 
            :targets="contextMenuTarget" 
            :show="contextMenuVisible" 
            @update:show="(show) => contextMenuVisible = show">
              <a @click="deleteTask($event, task)"><i class="el-icon-delete"></i> Delete</a>
          </context-menu>  -->
        </div>    
        <div class="right-menu" v-if="task.contextMenuVisible"  :style="task.contextStyle">
              <a class="right-menu__item" @click="deleteTask(task)"><i class="el-icon-delete"></i> Delete</a>  
        </div>
      </el-col>
    </el-row>
    <el-dialog title="Add Task" :visible.sync="dialogVisible">
      <el-form :model="form" :rules="rules" ref="form" label-position="top">
        <el-form-item label="Title" prop="title" :label-width="formLabelWidth">
          <el-input v-model="form.title" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="Description" prop="desc" :label-width="formLabelWidth">
          <el-input v-model="form.desc" auto-complete="off" type="textarea"
          :rows="4"></el-input>
        </el-form-item>
        <el-form-item :label="'Estimate:'+form.estimate" prop="estimate" :label-width="formLabelWidth">
          <el-slider
            :min="0"
            :max="5"
            v-model="form.estimate"
            :step="1"
            show-stops>
          </el-slider>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="ensureAddTask('form')">Add</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import miment from 'miment'
  import utils from "../../ext/utils"
  var validatePass = (rule, value, callback) => {
    if(value < 1){
      callback(new Error('The estimate must ranges from 1 to 5'));
    }
    else {
      callback();
    }
  };
  export default {
    data: () => ({
      // contextMenuTarget: document.getElementsByClassName("todayTasks-list__item"),
      // contextMenuVisible: false,
      dialogVisible: false,
      formLabelWidth: '120px',
      form: {
        title: '',
        desc: '',
        estimate: 1
      },
      rules: {
        title: [
          { required: true, message: 'You must input task title', trigger: 'blur' },
        ],
        desc: [
          // { required: true, message: '请选择活动区域', trigger: 'change' }
        ],
        estimate: [
          { validator: validatePass, trigger: 'change' },
          { required: true, message: 'You must input task estimate', trigger: 'blur'},
        ],
      }
    }),
    computed: { 
      todayTasks(){
        let tasks=this.$store.getters.allTasks.filter((elem)=>{
          let eData = miment(elem.createdTime);
          let tData = miment();
          // 判断是否为今天的任务
          return utils.isSameDay(eData, tData);
        })
        tasks.forEach(elem=>{
          elem.contextMenuVisible = false;
          elem.contextStyle = {
            "left": 0,
            "top": 0
          }
          elem.show = true;
        })
        // console.log(tasks);
        return tasks;
      }
    },
    created () {
      // console.log('New tab')
    },
    mounted () { 
      document.addEventListener("click",()=>{
        this.todayTasks.forEach((elem)=>{
          elem.contextMenuVisible = false;
        })
        this.$forceUpdate();
      })
      // console.log(this.$route)
      // this.contextMenuTarget = document.getElementsByClassName("todayTasks-list__item");
      // console.log(document.body, document.getElementsByClassName("todayTasks-list__item"))
    },
    methods: {
      clickRightBtn(task, e){
        this.todayTasks.forEach((elem)=>{
          elem.contextMenuVisible = false;
        })
        task.contextMenuVisible = true;
        task.contextStyle.left = e.clientX + "px"
        task.contextStyle.top = e.clientY + "px"
        this.$forceUpdate();
      },
      deleteTask(task){
        let vm = this;
        this.$confirm('You want delete the task?', 'Warning', {
            confirmButtonText: 'ensure',
            cancelButtonText: "cancel",
            type: 'warning'
          }).then(() => {
            task.show = false;
            vm.$store.commit("deleteTask",task);
            vm.$store.dispatch("saveTasks");
            vm.$forceUpdate();

          }).catch(() => {
                     
          });
      },
      tellHistory(){
        this.$router.push({name:"History"})
      },
      router(route){
        this.$router.push(route)
        // var curUrl = window.location.href;
        // console.log(curUrl);
      },
      ensureAddTask(formName){
        let vm = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let task = {
              id: utils.getGUID(),
              title: vm.form.title,
              desc:vm.form.desc,
              estimate:vm.form.estimate,
              basicTimeUnit: 45,
              finished: 0,
              state:"prepare",
              createdTime:new Date().getTime(),
              break:0
            }
            vm.form.title = "";
            vm.form.desc = "";
            // console.log(task);
            if(utils.checkTask(task)){
              vm.$store.dispatch('addTask',task)
              vm.$store.dispatch('saveTasks')
              vm.dialogVisible = false;
            }
            return true;
          } else {
            return false;
          }
        });
      },
      addTask(){
        this.dialogVisible = true;
      }

    }
  }
</script>
<style lang="scss">
  $bg-color:rgb(18, 62, 60);
  $primary-color:rgb(57, 122, 109);
  $font-family:'Courier New', Courier, monospace;
  // dialog相关
  .el-dialog {
    font-weight: 600;
  }
  .el-input__inner,.el-textarea__inner {
    font-family: $font-family;
    border-color: #888;
    color: #000;
  }
  .el-input__inner:hover, .el-textarea__inner:hover {
    border-color: #666;
  }
  .el-slider__runway {
    background-color: #aaa;
  }
  .el-form-item__label {
    color: #000;
  }
  // contextmenu
  a {
    color:#333;
    text-decoration: none;
  }
  .right-menu {
    position: fixed;
    background: #999;
    border: solid 1px #999;
    border-radius: 1px;
    z-index: 999;
    box-shadow: 0 0.5em 1em 0 rgba(0,0,0,.1);
    &__item {
      cursor: pointer;
    }
  }
  .right-menu a {
    padding: 2px;
    width: 75px;
    height: 28px;
    line-height: 28px;
    text-align: center;
    display: block;
    color: #1a1a1a;
  }
  .right-menu a:hover {
    background: #bbb;
  }
  // task相关
  .todayTasks {
    &-list {
      &-placeholder {
        font-size: 25px;
        text-align: center;
        margin-top: 15%;
      }
      margin-top: 10px;
      &__item {
        cursor: pointer;
        margin: 10px 0 0 10px;
        padding: 0 10px;
        background: rgb(7, 27, 25);
        height: 300px;
        position: relative;
        border:2px solid rgb(7, 27, 25);
        &:hover {
          border:2px solid $primary-color;
        }
        &-title {
            font-size: 20px;
            margin: 10px 0;
        }
        &-desc {
          font-size: 14px;
          min-height: 200px;
        }
        &-icons {
          position: absolute;
          width: 100%;
          bottom: 10px;
          right: 10px;
          font-size: 18px;
          text-align: right;
          &__item {
            margin-left: 5px;
          }
        }
      }
    }
  }
</style>
