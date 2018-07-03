<template>
  <div :style="style" style="display: block;" v-show="show"
    @mousedown.stop
    @contextmenu.prevent
  >
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'context-menu',
  data () {
    return {
      triggerShowFn: () => {},
      triggerHideFn: () => {},
      x: null,
      y: null,
      style: {},
      binded: false
    }
  },
  props: {
    targets:null,
    show: Boolean
  },
  mounted () {
    this.bindEvents()
  },
  watch: {
    show (show) {
      if (show) {
        this.bindHideEvents()
      } else {
        this.unbindHideEvents()
      }
    },
    targets (targets) {
      this.bindEvents()
    }
  },
  methods: {
    checkTargets(){
      if(this.targets && this.targets.length>0){
        return true;
      }
      return false;
    },
    // 初始化事件
    bindEvents () {
      this.$nextTick(() => {
        // console.log("binds")
        // console.log(this.targets)
        if (!this.checkTargets() || this.binded) return 
        // console.log("binds")
        this.triggerShowFn = this.contextMenuHandler.bind(this)
        let l = this.targets.length;
        for(let i=0;i<l;i++){
          this.targets[i].addEventListener('contextmenu', this.triggerShowFn)
        }
        this.binded = true
      })
    },

    // 取消绑定事件
    unbindEvents () {
      if (!this.checkTargets()) return
      let l = this.targets.length;
      for(let i=0;i<l;i++){
        this.targets[i].removeEventListener('contextmenu', this.triggerShowFn)
      }
    },

    // 绑定隐藏菜单事件
    bindHideEvents () {
      this.triggerHideFn = this.clickDocumentHandler.bind(this)
      document.addEventListener('mousedown', this.triggerHideFn)
      document.addEventListener('mousewheel', this.triggerHideFn)
    },

    // 取消绑定隐藏菜单事件
    unbindHideEvents () {
      document.removeEventListener('mousedown', this.triggerHideFn)
      document.removeEventListener('mousewheel', this.triggerHideFn)
    },

    // 鼠标按压事件处理器
    clickDocumentHandler (e) {
      this.$emit('update:show', false)
    },

    // 右键事件事件处理
    contextMenuHandler (e) {
      this.x = e.clientX
      this.y = e.clientY
      this.layout()
      this.$emit('update:show', true, e)
      e.preventDefault()
    },

    // 布局
    layout () {
      this.style = {
        left: this.x + 'px',
        top: this.y + 'px'
      }
    }
  }
}
</script>
