<template>
<div class="wrapper">
  <header>H5 落地页生成</header>
  <div class="content">
    <div class="controls">
      <div class="btn-group">
        <label class="btn-upload" for="file">选择背景</label>
        <input id="file" type="file" accept="image/*" @change="fileChange" ref="file">
        <div class="btn-transform" @click="download">下载html</div>
      </div>
      <div class="config">
        <div>标题：<input class="title" type="text" v-model="config.title" placeholder="请输入页面标题"></div>
      </div>
    </div>
    <div class="btn-config">
      <div class="add-btn" @click="addBtn">添加固定按钮</div>
      <div class="url-list">
        <div
          class="url-item"
          v-for="(btn, index) in config.btn"
          :key="index">
          固定按钮({{index}})：<input class="href" type="text" v-model="btn.link" placeholder="请输入跳转链接">
          <img @click="removeBtn(index)" class="btn-del" src="../../assets/remove.png">
        </div>
      </div>
    </div>

    <div class="btn-config">
      <div class="add-btn" @click="addFixedBtn">添加悬浮按钮</div>
      <div class="url-list">
        <div
          class="url-item"
          v-for="(btn, index) in config.fixedbtn"
          :key="index">
          悬浮按钮({{index}})：<input class="href" type="text" v-model="btn.link" placeholder="请输入跳转链接">
          <img @click="removeFixedBtn(index)" class="btn-del" src="../../assets/remove.png">
        </div>
      </div>
    </div>

    <p class="tips">tips：增加的按钮是可点击的透明元素</p>

    <p class="preview">预览</p>
    <div class="phone">
      <div
        class="viewport"
        @drop="drop"
        @dragover="dragover">
        <img :src="config.image">
        <div
          v-for="(btn, index) in config.btn"
          :key="index"
          class="btn-draggable"
          draggable="true"
          :data-index="index"
          data-type="absolute"
          :style="{ 'left': btn.left + 'px', 'top': btn.top+ 'px' }"
          @dragstart="dragstart"
          @mouseup="resize">
          固定按钮({{index}})
        </div>
        <div
          v-for="(btn, index) in config.fixedbtn"
          :key="index"
          class="btn-draggable"
          draggable="true"
          :data-index="index"
          data-type="fixed"
          :style="{ 'left': btn.left + 'px', 'top': btn.top+ 'px' }"
          @dragstart="dragstart"
          @mouseup="resizeFixed">
          悬浮按钮({{index}})
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, toRefs } from 'vue'
import { insertConfig } from '../../utils/template'

const initBtn: Btn = {
  link: '',
  width: '140',
  height: '40',
  top: 0,
  left: 0
}

interface Config {
  config: {
    title: string;
    image: string;
    btn: Btn[];
    fixedbtn: Btn[];
  }
}

interface Btn {
  link: string;
  width: number | string;
  height: number | string;
  top: number;
  left: number;
}

export default defineComponent({
  name: 'SimpleH5',

  setup: () => {
    const data = reactive<Config>({
      config: {
        title: '',
        image: '',
        btn: [],
        fixedbtn: []
      }
    })
    let curIndex = 0
    let curX = 0
    let curY = 0
    let isFixed = false

    const fileChange = (e) => {
      console.log(e)
      const reader = new FileReader()
      reader.readAsDataURL(e.target.files[0])
      reader.onload = el => {
        data.config.image = el.target?.result as string
      }
    }

    const drop = (e) => {
      e.preventDefault()
      const offsetX = Math.abs(curX - e.screenX)
      const offsetY = Math.abs(curY - e.screenY)
      if (isFixed) {
        if (curX - e.screenX > 0) {
          data.config.fixedbtn[curIndex].left -= offsetX
        } else {
          data.config.fixedbtn[curIndex].left += offsetX
        }
        if (curY - e.screenY > 0) {
          data.config.fixedbtn[curIndex].top -= offsetY
        } else {
          data.config.fixedbtn[curIndex].top += offsetY
        }

        if (data.config.fixedbtn[curIndex].left > 375) {
          data.config.fixedbtn[curIndex].left = 365
        }
      } else {
        if (curX - e.screenX > 0) {
          data.config.btn[curIndex].left -= offsetX
        } else {
          data.config.btn[curIndex].left += offsetX
        }
        if (curY - e.screenY > 0) {
          data.config.btn[curIndex].top -= offsetY
        } else {
          data.config.btn[curIndex].top += offsetY
        }
      }
    }

    const dragstart = (e) => {
      curIndex = e.target.dataset.index
      isFixed = e.target.dataset.type === 'fixed'
      console.log(e.target.dataset.type)
      curX = e.screenX
      curY = e.screenY
    }

    const dragover = (e) => {
      e.preventDefault()
    }

    const resize = (e) => {
      console.log(e.target.clientWidth, e.target.clientHeight)
      curIndex = e.target.dataset.index
      data.config.btn[curIndex].width = e.target.clientWidth
      data.config.btn[curIndex].height = e.target.clientHeight
    }

    const resizeFixed = (e) => {
      console.log(e.target.clientWidth, e.target.clientHeight)
      curIndex = e.target.dataset.index
      data.config.fixedbtn[curIndex].width = e.target.clientWidth
      data.config.fixedbtn[curIndex].height = e.target.clientHeight
    }

    const addBtn = () => {
      data.config.btn.push(JSON.parse(JSON.stringify(initBtn)))
    }

    const addFixedBtn = () => {
      data.config.fixedbtn.push(JSON.parse(JSON.stringify(initBtn)))
    }

    const removeBtn = (index: number) => {
      data.config.btn.splice(index, 1)
    }

    const removeFixedBtn = (index: number) => {
      data.config.fixedbtn.splice(index, 1)
    }

    const download = () => {
      const config = px2rem()
      funDownload(insertConfig(config), 'test.html')
    }

    const px2rem = () => {
      const config = JSON.parse(JSON.stringify(data.config))
      config.btn.map(item => {
        item.width = `${item.width / 100}rem`
        item.height = `${item.height / 100}rem`
        item.top = `${item.top / 100}rem`
        item.left = `${item.left / 100}rem`
      })
      config.fixedbtn.map(item => {
        item.width = `${item.width / 100}rem`
        item.height = `${item.height / 100}rem`
        item.top = `${item.top / 100}rem`
        item.left = `${item.left / 100}rem`
      })
      return config
    }

    const funDownload = (content: string, filename: string) => {
      const eleLink = document.createElement('a')
      eleLink.download = filename
      eleLink.style.display = 'none'
      // 字符内容转变成blob地址
      const blob = new Blob([content])
      eleLink.href = URL.createObjectURL(blob)
      // 触发点击
      document.body.appendChild(eleLink)
      eleLink.click()
      // 然后移除
      document.body.removeChild(eleLink)
    }

    return {
      ...toRefs(data),
      fileChange,
      download,
      addBtn,
      removeBtn,
      addFixedBtn,
      drop,
      dragover,
      dragstart,
      resize,
      resizeFixed
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
  text-align: center;
}
header {
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

  .controls {
    display: flex;
    justify-content: space-between;
  }

  .btn-group {
    width: 38%;
    display: flex;
    justify-content: space-around;
  }

  .config {
    width: 62%;
    font-size: 18px;
    color: #666;
    line-height: 40px;

    &>div {
      display: flex;
      align-items: center;
      padding-left: 20px;
    }

    .title {
      height: 26px;
      width: 80%;
      border: none;
      background: #fff;
      color: #666;
      &:focus {
        outline: 1px solid #66CC66;
      }
    }
  }

  .btn-upload,
  .btn-transform {
    display: inline-block;
    width: 100px;
    height: 40px;
    color: #fff;
    font-size: 18px;
    text-align: center;
    line-height: 40px;
    border-radius: 6px;
    background: #66CC66;
    cursor: pointer;
  }

  input[type="file"] {
    display: none;
  }
}

div.btn-config {
  margin-top: 30px;
  display: flex;
  justify-content: space-between;

  .add-btn {
    flex: none;
    width: 120px;
    height: 35px;
    color: #fff;
    font-size: 16px;
    text-align: center;
    line-height: 35px;
    border-radius: 6px;
    background: #66CC66;
    cursor: pointer;
  }

  input.href {
    height: 23px;
    width: 70%;
    border: none;
    background: #fff;
    color: #666;
    &:focus {
      outline: 1px solid #66CC66;
    }
  }

  .url-list {
    flex: auto;
  }

  .url-item {
    font-size: 16px;
    text-align: right;
    color: #666;
    line-height: 36px;

    .btn-del {
      width: 18px;
      margin-bottom: -4px;
      opacity: 0.4;
      cursor: pointer;
    }
  }
}

.phone {
  width: 375px;
  margin: 60px auto 20px;
  overflow: hidden;
  &:before {
    content: '';
    position: absolute;
    z-index: 100;
    display: block;
    width: 375px;
    height: 24px;
    background-image: url(../../assets/nav.jpeg);
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
    margin-top: -23px;
  }
}

.tips {
  margin: 30px 0 0;
  font-size: 14px;
  color: #999;
  text-align: left;
}

.preview {
  padding-top: 30px;
  margin-top: 0;
  color: #666;
  font-size: 24px;
  border-top: 1px solid #999;
}

.viewport {
  position: relative;
  z-index: 100;
  width: 375px;
  height: 667px;
  background: #fff;
  box-sizing: border-box;
  overflow-y: auto;
  overflow-x: hidden;

  img {
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }

  .btn-draggable {
    position: absolute;
    width: 100px;
    padding: 10px 20px;
    background: transparent;
    border: 1px dashed red;
    resize: both;
    overflow: auto;
    font-size: 14px;
    color: red;
  }
}
</style>
