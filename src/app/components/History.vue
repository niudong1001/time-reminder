<template>
  <div>
    <h1 class="c-title">
      <i class="el-icon-back c-title__back"  @click="$router.go(-1)"></i> 
      <span class="c-color--primary">My history</span>  
    </h1>
    <div class="history">
        <div v-if="!histories.length" class="todayTasks-list-placeholder">
            No history~
        </div>
        <div class="history-list" v-for="day in histories" :key="day.createdTime">
            <div class="history-list-title">{{day.createdTime}}</div>
            <el-row class="history-list-tasks">
                <el-col :span="6" class="history-list-tasks__item" v-for="task in day.list" :key="task.id">
                    <div class="history-list-tasks__item-title">{{task.title}}</div>
                    <div class="history-list-tasks__item-icons">
                        <i class="el-icon-circle-check-outline history-list-tasks__item-icons__item">{{task.estimate}}</i><i class="el-icon-circle-check history-list-tasks__item-icons__item">{{task.finished}}</i>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
  </div>
</template>
<script>
  import miment from 'miment'
  import utils from '../../ext/utils';
  export default {
    data(){
        return {}
    },
    computed: { 
        histories(){
            // console.log("shit");
            let histories = []
            let tasks = this.$store.getters.allTasks;
            // console.log(tasks);
            tasks.forEach(element => {
                let ev = miment(element.createdTime).format("YYYY-MM-DD")
                let item = utils.haveItem(histories,"createdTime", ev)
                // console.log(item);
                if(item){
                    // console.log(item);
                    item["list"].push(element);
                }
                else{
                    histories.push(
                        {
                            createdTime:ev,
                            list:[element]
                        }
                    )
                }
            });

            return histories.sort((a,b)=>{
                return a.createdTime < b.createdTime;
            });
        }
    },
    created () {
    },
    mounted () { 
        console.log(this.histories)
    },
    beforeDestroy(){

    },
    methods: {
        
    }
  }
</script>
<style lang="scss">
  $bg-color:rgb(18, 62, 60);
  $primary-color:rgb(57, 122, 109);
  .history {
      &-list {
          &-title {
              color:rgb(57, 122, 109);
              font-size: 30px;
              margin: 10px 0 0 20px;
          }
          &-tasks {
              &__item {
                margin: 10px 0 0 10px;
                padding: 0 10px;
                background: rgb(7, 27, 25);
                height: 150px;
                position: relative;
                border:2px solid rgb(7, 27, 25);
                &-title {
                    font-size: 15px;
                    margin: 10px 0;
                }
                &-icons {
                    position: absolute;
                    width: 100%;
                    bottom: 10px;
                    right: 10px;
                    font-size: 14px;
                    text-align: right;
                    &__item {
                        margin-left: 5px;
                    }
                }
              }
          }
      }
  }
</style>
