<template>
<Wrapper title="图片处理" width="1200">
  <div class="btn-group">
    <label class="btn-upload button-l" for="file">选择图片</label>
    <input id="file" type="file" accept="image/*" @change="imageChange">
    <div class="button-l" @click="downloadImage">下载图片</div>
    <div class="button-l" @click="resetStatus">重置</div>
  </div>

  <div class="contols-group">
    <div class="controls">
      <div>
        <span>R 红色 </span>
        <input v-model="r" type="range" min="-255" max="255" @change="rgbaChange" />
        <span class="value">{{ r }}</span>
      </div>
      <div>
        <span>G 绿色 </span>
        <input v-model="g" type="range" min="-255" max="255" @change="rgbaChange" />
        <span class="value">{{ g }}</span>
      </div>
      <div>
        <span>B 蓝色 </span>
        <input v-model="b" type="range" min="-255" max="255" @change="rgbaChange" />
        <span class="value">{{ b }}</span>
      </div>
      <div>
        <span>A 透明 </span>
        <input v-model="a" type="range" min="-255" max="255" @change="rgbaChange" />
        <span class="value">{{ a }}</span>
      </div>
    </div>
    <div class="controls">
      <div>
        <span>H 色相 </span>
        <input v-model="h" type="range" min="-1" max="1" step="0.01" @change="hslChange" />
        <span class="value">{{ parseInt(h * 100) }}%</span>
      </div>
      <div>
        <span>S 饱和 </span>
        <input v-model="s" type="range" min="-1" max="1" step="0.01" @change="hslChange" />
        <span class="value">{{ parseInt(s * 100) }}%</span>
      </div>
      <div>
        <span>L 亮度 </span>
        <input v-model="l" type="range" min="-1" max="1" step="0.01" @change="hslChange" />
        <span class="value">{{ parseInt(l * 100) }}%</span>
      </div>
    </div>
  </div>
  
  <div class="board">
    <div class="preview" ref="refCanvasContainer" @mousewheel.prevent>
      <div class="canvas" :style="{ 'transform': `scale(${scale})` }" @mousedown="dragStart" @mousemove="dragOver" @mouseup="dragEnd">
        <canvas ref="refCanvas" :width="canvas.width" :height="canvas.height"></canvas>
      </div>
    </div>
    <div class="right">
      <div class="origin" :style="{ 'background-image': `url(${imageUrl})` }"></div>
      <div class="scale-control">
        <span>{{ parseInt(scale * 100) }}%</span>
        <input v-model="scale" type="range" min="0.1" max="1.9" step="0.01" />
      </div>
    </div>
  </div>
</Wrapper>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, toRefs, onMounted, nextTick } from 'vue'
import Wrapper from '../common/Wrapper.vue'
import filterRgba from './filterRgba'
import filterHsl from './filterHsl'

interface Render {
  width: number; // 图片宽
  height: number; // 图片高
  originImgData: ImageData | {}; // 原始图片数据
}

export default defineComponent({
  name: 'Filter',

  components: {
    Wrapper
  },

  setup: () => {

    /** rgba控件 */
    const rgba = reactive({
      r: 0,
      g: 0,
      b: 0,
      a: 0
    })

    /** hsl控件 */
    const hsl = reactive({
      h: 0,
      s: 0,
      l: 0
    })

    /** 画布大小 */
    const canvas = reactive({
      width: 600,
      height: 480
    })

    /** 画布拖动位移数据 */
    const drag = {
      startMove: false,
      startX: 0,
      startY: 0
    }

    /** 渲染图片数据 */
    const render: Render = {
      width: 0,
      height: 0,
      originImgData: {}
    }

    /** 其他一些数据 */
    const data = reactive({
      imageUrl: '',
      imageName: 'img',
      mineType: 'image/png',
      scale: 1
    })

    const refCanvas = ref<HTMLCanvasElement>()
    const refCanvasContainer = ref<HTMLCanvasElement>()
    let context: CanvasRenderingContext2D | null

    /** 拷贝原始图像数据 */
    const originImgData = (): ImageData => {
      return new ImageData(new Uint8ClampedArray(render.originImgData.data), render.originImgData.width, render.originImgData.height)
    }

    /** 改变rgba回调 */
    const rgbaChange = () => {
      if (!data.imageUrl) return
      const { h, s, l } = hsl
      let imgData = originImgData()
      if (+h || +s || +l) {
        imgData = filterHsl(imgData, hsl)
      }
      imgData = filterRgba(imgData, rgba)
      context?.putImageData(imgData, 0, 0)
    }

    /** 改变hsl回调 */
    const hslChange = () => {
      if (!data.imageUrl) return
      const { r, g, b, a } = rgba
      let imgData = originImgData()
      if (+r || +g || +b || +a) {
        imgData = filterRgba(imgData, rgba)
      }
      imgData = filterHsl(imgData, hsl)
      context?.putImageData(imgData, 0, 0)
    }

    /** 图片上传 */
    const imageChange = (e: Event) => {
      const files = (e.target as HTMLInputElement).files || []
      if (files.length === 0) return
      const reader = new FileReader()
      reader.readAsDataURL(files[0])
      reader.onload = el => {
        data.imageUrl = el.target?.result as string
        drawImage()
      }
      data.imageName = files[0].name
      data.mineType = files[0].type
    }

    /** 画布绘制图片 */
    const drawImage = () => {
      const img = new Image()
      img.onload = () => {
        if (img.naturalWidth > 10000 || img.naturalHeight > 10000) {
          alert('图片太大了！')
          return
        }
        canvas.width = img.naturalWidth
        canvas.height = img.naturalHeight
        render.width = img.naturalWidth
        render.height = img.naturalHeight
        nextTick(() => {
          context?.drawImage(img, 0, 0, render.width, render.height)
          render.originImgData = context?.getImageData(0, 0, render.width, render.height) || {}
          reset()
        })
      }
      img.src = data.imageUrl
    }

    /** 画布拖拽（开始） */
    const dragStart = (e: MouseEvent) => {
      drag.startMove = true
      drag.startX = e.screenX
      drag.startY = e.screenY
    }
    /** 画布拖拽（过程） */
    const dragOver = (e: MouseEvent) => {
      if (drag.startMove) {
        if (e.screenX !== drag.startX || e.screenY !== drag.startY) {
          refCanvasContainer.value?.scrollBy((drag.startX - e.screenX) * 1, (drag.startY - e.screenY) * 1)
          drag.startX = e.screenX
          drag.startY = e.screenY
        }
      }
    }
    /** 画布拖拽（结束） */
    const dragEnd = (e: MouseEvent) => {
      drag.startMove = false
    }

    /** 重置 */
    const reset = () => {
      data.scale = 1
      rgba.r = 0
      rgba.g = 0
      rgba.b = 0
      rgba.a = 0
      hsl.h = 0
      hsl.s = 0
      hsl.l = 0
      refCanvasContainer.value?.scrollTo(4500, 4600) // 画布居中
    }

    /** 下载图片 */
    const downloadImage = () => {
      const url = (refCanvas.value as HTMLCanvasElement).toDataURL(data.mineType)
      const a = document.createElement('a')
      a.href = url
      a.download = data.imageName
      a.click()
    }

    /** 重置图片 */
    const resetStatus = () => {
      if (!data.imageUrl) return
      context?.putImageData(originImgData(), 0, 0)
      reset()
    }

    onMounted(() => {
      context = (refCanvas.value as HTMLCanvasElement).getContext('2d')
      reset()
    })

    return {
      ...toRefs(rgba),
      ...toRefs(hsl),
      ...toRefs(data),
      canvas,
      refCanvas,
      refCanvasContainer,
      rgbaChange,
      hslChange,
      imageChange,
      dragStart,
      dragOver,
      dragEnd,
      downloadImage,
      resetStatus
    }
  }
})
</script>

<style lang="less" scoped>
.btn-group {
  margin-bottom: 30px;
  text-align: left;
  input[type="file"] {
    display: none;
  }
  .button-l {
    margin-right: 20px;
  }
}
.contols-group {
  display: flex;
  justify-content: space-between;
}
.controls {
  width: 50%;
  display: flex;
  flex-direction: column;
  &>div {
    text-align: left;
    margin-bottom: 10px;
    input {
      width: 70%;
    }
    .value {
      margin-left: 10px;
    }
  }
}
.board {
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 800px;
  margin-top: 30px;
  .preview {
    flex: none;
    width: 1000px;
    height: 800px;
    overflow: scroll;
    background-color: #f0f2f5;
    &::-webkit-scrollbar {
      display: none; /* Chrome Safari */
    }
    .canvas {
      position: relative;
      display: inline-block;
      width: 10000px;
      height: 10000px;
      background: #fff url('../../assets/canvas-bg.png') repeat;
      transition: transform .3s;
      cursor: grab;
    }
    canvas {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      // background: #a7cafd;
    }
  }
  .right {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    .origin {
      width: 140px;
      height: 112px;
      background-color: #fff;
      background-position: center;
      background-size: contain;
      background-repeat: no-repeat;
    }
    .scale-control {
      position: relative;
      height: 100%;
      overflow: hidden;
      span {
        display: block;
        margin-top: 40px;
        font-size: 38px;
        font-weight: bold;
        color: #fff;
        text-shadow: 2px 2px 6px rgb(62, 168, 0);
      }
      input {
        position: absolute;
        left: 70px;
        top: 690px;
        width: 600px;
        transform: rotate(-90deg);
        transform-origin: left center;
        border-radius: 10px;
        -webkit-appearance: none;

        &::-webkit-slider-runnable-track {
          height: 10px;
          border-radius: 10px;
          &:hover {
            box-shadow: 0 0 10px 2px #66CC66;
          }
        }
        &::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 50px;
          width: 50px;
          margin-top: -20px;
          background: #fff;
          border-radius: 50%;
          cursor: pointer;
          &:hover {
            box-shadow: 0 0 10px 2px #66CC66;
          }
        }
        &:focus {
          outline: none;
        }
      }
    }
  }
}
</style>