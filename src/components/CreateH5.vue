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
          <img @click="removeBtn(index)" class="btn-del" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACHElEQVRYR+1WPYgTQRT+ZmfINlY22thoY2OjxdkIYqOFNpK7IhGMZJmQhbT+VGrlTxvYMMMG0twdXOQaLbQ5Dq65K7SxsdHGRhsrm4WdPBnYg5jMbfb0jkFw23lvvm/f9817j8Hzxzzj4z+BuQpEUXSVc36XiFoAHimlXjDG6E+kIiLW6XSeA7gP4OlkMtlO03R7+q45AlLKJwAeTwVthmHY6Pf72WFI9Hq9MMuyNQC39/MYYyOl1L1FBFx/+1oI0UiS5GcVEnEcnzDGrBPRzdl4rfVvP+2qwEMAzxxAb40xzeFw+KOMRLvdPimEWCOi6464l1rrB6UVKHR7NV26/QQi2iKiRpqm310kWq3W6TAMV4nomuN8UylVn/WT8xkW+o0B3Jq9iDG2wzlvJknydfosjuMzxhgLfsWR86ZWq9VdPjqwD1gd8zy3JG44LtwNgqA5GAy+2DMp5TkAqwCWHLHvOOf1g/xT2oisnkEQjBljrpK+B3CnALTgFx3gW3meL5f5ZmEnjKLoFOd87CotgI8F6AWXVFmWrYxGo29lpl1IwCYX+m4Q0eUqzxDAnhBiedYnrtxKBGxit9s9a4zZAHBpAYkPAFa01p+rkK1MoDDbeQCWxFzJCzAriQX/VAXcxvw7BLxK4NWEXp+h10bktRV7HUbex7GU0u9CIqX0vpL5XUq9r+VVh8hRxR1qGB0VaOlWfBwgf70RHSepXzG9ZjB+CHOvAAAAAElFTkSuQmCC">
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
          <img @click="removeFixedBtn(index)" class="btn-del" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACHElEQVRYR+1WPYgTQRT+ZmfINlY22thoY2OjxdkIYqOFNpK7IhGMZJmQhbT+VGrlTxvYMMMG0twdXOQaLbQ5Dq65K7SxsdHGRhsrm4WdPBnYg5jMbfb0jkFw23lvvm/f9817j8Hzxzzj4z+BuQpEUXSVc36XiFoAHimlXjDG6E+kIiLW6XSeA7gP4OlkMtlO03R7+q45AlLKJwAeTwVthmHY6Pf72WFI9Hq9MMuyNQC39/MYYyOl1L1FBFx/+1oI0UiS5GcVEnEcnzDGrBPRzdl4rfVvP+2qwEMAzxxAb40xzeFw+KOMRLvdPimEWCOi6464l1rrB6UVKHR7NV26/QQi2iKiRpqm310kWq3W6TAMV4nomuN8UylVn/WT8xkW+o0B3Jq9iDG2wzlvJknydfosjuMzxhgLfsWR86ZWq9VdPjqwD1gd8zy3JG44LtwNgqA5GAy+2DMp5TkAqwCWHLHvOOf1g/xT2oisnkEQjBljrpK+B3CnALTgFx3gW3meL5f5ZmEnjKLoFOd87CotgI8F6AWXVFmWrYxGo29lpl1IwCYX+m4Q0eUqzxDAnhBiedYnrtxKBGxit9s9a4zZAHBpAYkPAFa01p+rkK1MoDDbeQCWxFzJCzAriQX/VAXcxvw7BLxK4NWEXp+h10bktRV7HUbex7GU0u9CIqX0vpL5XUq9r+VVh8hRxR1qGB0VaOlWfBwgf70RHSepXzG9ZjB+CHOvAAAAAElFTkSuQmCC">
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

<script>
import { insertConfig } from '../utils/template'

const initBtn = {
  link: '',
  width: '140',
  height: '40',
  top: 0,
  left: 0
}

export default {
  name: 'Demo',

  data: function () {
    return {
      config: {
        title: '',
        image: '',
        btn: [],
        fixedbtn: []
      },
      curIndex: 0,
      curX: 0,
      curY: 0,
      isFixed: false
    }
  },

  methods: {
    fileChange (e) {
      const reader = new FileReader()
      reader.readAsDataURL(e.target.files[0])
      reader.onload = el => {
        this.config.image = el.target.result
      }
    },

    drop (e) {
      e.preventDefault()
      const offsetX = Math.abs(this.curX - e.screenX)
      const offsetY = Math.abs(this.curY - e.screenY)
      if (this.isFixed) {
        if (this.curX - e.screenX > 0) {
          this.config.fixedbtn[this.curIndex].left -= offsetX
        } else {
          this.config.fixedbtn[this.curIndex].left += offsetX
        }
        if (this.curY - e.screenY > 0) {
          this.config.fixedbtn[this.curIndex].top -= offsetY
        } else {
          this.config.fixedbtn[this.curIndex].top += offsetY
        }

        if (this.config.fixedbtn[this.curIndex].left > 375) {
          this.config.fixedbtn[this.curIndex].left = 365
        }
      } else {
        if (this.curX - e.screenX > 0) {
          this.config.btn[this.curIndex].left -= offsetX
        } else {
          this.config.btn[this.curIndex].left += offsetX
        }
        if (this.curY - e.screenY > 0) {
          this.config.btn[this.curIndex].top -= offsetY
        } else {
          this.config.btn[this.curIndex].top += offsetY
        }
      }
    },

    dragstart (e) {
      this.curIndex = e.target.dataset.index
      this.isFixed = e.target.dataset.type === 'fixed'
      console.log(e.target.dataset.type)
      this.curX = e.screenX
      this.curY = e.screenY
    },

    dragover (e) {
      e.preventDefault()
    },

    resize (e) {
      console.log(e.target.clientWidth, e.target.clientHeight)
      this.curIndex = e.target.dataset.index
      this.config.btn[this.curIndex].width = e.target.clientWidth
      this.config.btn[this.curIndex].height = e.target.clientHeight
    },

    resizeFixed (e) {
      console.log(e.target.clientWidth, e.target.clientHeight)
      this.curIndex = e.target.dataset.index
      this.config.fixedbtn[this.curIndex].width = e.target.clientWidth
      this.config.fixedbtn[this.curIndex].height = e.target.clientHeight
    },

    addBtn () {
      this.config.btn.push(JSON.parse(JSON.stringify(initBtn)))
    },

    addFixedBtn () {
      this.config.fixedbtn.push(JSON.parse(JSON.stringify(initBtn)))
    },

    removeBtn (index) {
      this.config.btn.splice(index, 1)
    },

    removeFixedBtn (index) {
      this.config.fixedbtn.splice(index, 1)
    },

    download () {
      const config = this.px2rem()
      this.funDownload(insertConfig(config), 'test.html')
    },

    px2rem () {
      const config = JSON.parse(JSON.stringify(this.config))
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
    },

    funDownload (content, filename) {
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
  },

  mounted () {
    // console.log(insertConfig(this.config))
  }
}
</script>

<style lang="stylus" scoped>
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
    background-image: url('data:image/jpg;base64,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')
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
