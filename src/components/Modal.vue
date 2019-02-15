<template>
    <div>                                                       
     <!-- 这里的mdShow参数是通过props从父组件传递过来的，vue的机制本质上不允许在子组件改变父组件的值，只可以使用props读取 -->
     <!-- 如果一定要改变这个值，则先要在父组件定义一个事件，然后在子组件通过this.$emit触发这个事件 -->
    <div class="md-modal modal-msg md-modal-transition" v-bind:class="{'md-show':mdShow}" >
          <div class="md-modal-inner">
            <div class="md-top">
              <button class="md-close" @click="closeModal">Close</button>
            </div>
            <div class="md-content">
              <div class="confirm-tips">
                <slot name="message"></slot>
              </div>
              <div class="btn-wrap">
                <slot name="btnGroup" ></slot>
              </div>
            </div>
          </div>
    </div>
        <div class="md-overlay" v-if="mdShow" @click="closeModal"></div>
    </div>
</template>
<style>

</style>
<script>
import './../assets/css/login.css'
import axios from 'axios';
export default {
  data(){
    return{
      
    }
  },
  props:['mdShow'],
  methods:{
    closeModal(){
        this.$emit("close")   //触发父组件定义的事件
    }
  }
}
</script>
