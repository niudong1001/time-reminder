<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  mounted(){
    // this.$store.dispatch('rmAllTasks')
    this.$store.dispatch('loadTodayTasks',()=>{
    }) 
  }
}
</script>

<style>
</style>