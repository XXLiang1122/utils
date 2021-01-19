<template>
<div class="wrapper" :style="{'width': `${ width }px`}">
  <header class="header">{{ title }}</header>
  <div class="content">
    <slot></slot>
  </div>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Wrapper',

  props: {
    title: String,
    width: {
      type: [Number, String],
      default: 600
    }
  }
})
</script>

<style lang="less" scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  width: 600px;
  margin-top: 30px;
  margin-bottom: 30px;
  text-align: center;
}

.header {
  background: #006600;
  line-height: 60px;
  color: #fff;
  font-size: 20px;
  text-align: center;
  border-radius: 5px 5px 0 0;
}

.content {
  flex: auto;
  padding: 20px;
  background: #CCFF99;
  border-radius: 0 0 5px 5px;
}
</style>