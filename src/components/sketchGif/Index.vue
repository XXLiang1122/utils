<template>
<div class="wrapper">
  <header>线稿 GIF 生成器</header>
  <div class="content">
    <video ref="refVideoEle" :src="videoSrc" @play="play" @ended="ended" controls muted></video>
    <canvas ref="refCanvasEle"></canvas>
    <div class="controls">
      <div class="btn-group">
        <label class="btn-upload" for="file">选择视频</label>
        <input id="file" type="file" accept="video/*" @change="fileChange" ref="file">
        <div class="btn-transform" v-if="loading">正在生成...</div>
        <div class="btn-transform" @click="playVideo" v-else>开始</div>
      </div>
      <div class="config">
        <span>选择帧率：</span>
        <input id="frame8" type="radio" name="frame" value="8" v-model="config.frame">
        <label for="frame8">8帧</label>
        <input id="frame16" type="radio" name="frame" value="16" v-model="config.frame">
        <label for="frame16">16帧</label>
        <input id="frame32" type="radio" name="frame" value="24" v-model="config.frame">
        <label for="frame32">24帧</label>
      </div>
    </div>
    <p v-if="fileName" class="file-name">已选：{{ fileName }}， 大小：{{ size }}kb</p>
    <div v-if="gifUrl && !loading">
      <p class="tips">点击图片下载</p>
      <a :href="gifUrl" target="_blank"><img class="result-gif" :src="gifUrl"></a>
    </div>
    <div class="boy" :class="{ 'snoring': loading }" v-else></div>
  </div>
</div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed, toRefs, onMounted } from 'vue'

export default defineComponent({
  name: 'SketchGif',

  setup: () => {

    let timer: undefined | number
    const data = reactive({
      video: null,
      canvas: null,
      file: null,
      videoSrc: '',
      fileName: '',
      size: 0,
      gifUrl: '',
      config: {
        frame: 8,
        quality: 10
      },
      loading: false
    })
    let gif: any

    const expectDelay = computed(() => 1000 / data.config.frame)

    const refVideoEle = ref<null | HTMLVideoElement>(null)
    const refCanvasEle = ref<null | HTMLCanvasElement>(null)

    const fileChange =  (e: { target: { files: { size: number, name: string }[] } }) => {
      data.videoSrc = URL.createObjectURL(e.target.files[0])
      data.fileName = e.target.files[0].name
      data.size = Math.round(e.target.files[0].size / 1024)
    }

    const playVideo = () => {
      if (!data.videoSrc) return
      initGif()
      data.loading = true;
      console.log(refVideoEle);
      (refVideoEle.value as HTMLVideoElement).play()
    }

    const play = () => {
      renderVideo()
    }

    const ended = () => {
      clearInterval(timer)
      try {
        gif.render()
      } catch (e) {
        data.loading = false
        console.log(e)
      }
    }

    // 将图片转成线稿
    const fnCannyEdge = (source: HTMLVideoElement, canvas: HTMLCanvasElement, options?: any) => {
      options = options || {}
      // 可选参数
      const blurRadius = options.blurRadius || 2
      const lowThreshold = options.lowThreshold || 20
      const highThreshold = options.highThreshold || 50
      // 资源的尺寸
      // 图片/视频 原始尺寸
      const originWidth = source.width || source.videoWidth
      const originHeight = source.height || source.videoHeight
      // 最大尺寸限制
      const maxWidth = 400
      // 目标尺寸
      let width = originWidth
      let height = originHeight
      // 尺寸宽超过最大限制
      if (originWidth > maxWidth) {
        width = maxWidth
        height = Math.round(originHeight * width / originWidth)
      }
      const context = canvas.getContext('2d') as CanvasRenderingContext2D
      // canvas视觉展示
      canvas.width = source.width = width
      canvas.height = source.height = height
      // 清除内容
      context.clearRect(0, 0, width, height)
      // 获取图片信息
      context.drawImage(source, 0, 0, width, height)

      // 处理成黑白线稿
      const imageData = context.getImageData(0, 0, width, height)
      // 图像边缘查找处理
      // 原理为：
      // 1. 灰度
      // 2. 高斯模糊
      // 3. canny边缘检测
      // eslint-disable-next-line new-cap
      const imgU8 = new jsfeat.matrix_t(width, height, jsfeat.U8C1_t)
      jsfeat.imgproc.grayscale(imageData.data, width, height, imgU8)
      const kernelSize = (blurRadius + 1) * 2
      jsfeat.imgproc.gaussian_blur(imgU8, imgU8, kernelSize, 0)
      jsfeat.imgproc.canny(imgU8, imgU8, lowThreshold, highThreshold)

      // 渲染结果重新绘制到canvas
      const dataU32 = new Uint32Array(imageData.data.buffer)
      const alpha = 0xff << 24
      let i = imgU8.cols * imgU8.rows
      let pix = 0
      while (--i >= 0) {
        pix = 255 - imgU8.data[i]
        dataU32[i] = alpha | (pix << 16) | (pix << 8) | pix
      }
      context.putImageData(imageData, 0, 0)
    }

    const renderVideo = () => {
      let start = new Date().getTime()
      let end = new Date().getTime()
      let timeDiff = 0
      fnCannyEdge(refVideoEle.value as HTMLVideoElement, refCanvasEle.value as HTMLCanvasElement)
      add2gif()
      timer = setInterval(() => {
        start = new Date().getTime()
        fnCannyEdge(refVideoEle.value as HTMLVideoElement, refCanvasEle.value as HTMLCanvasElement)
        add2gif()
        end = new Date().getTime()
        timeDiff = end - start
        console.log(expectDelay.value > timeDiff ? expectDelay.value - timeDiff : 0)
      }, expectDelay.value > timeDiff ? expectDelay.value - timeDiff : 0) // 时间校正
      // const render = () => {
      //   requestAnimationFrame(() => {
      //     this.fnCannyEdge(this.video, this.canvas)
      //     this.add2gif()
      //     render()
      //   })
      // }
      // render()
    }

    // 添加当前帧到gif
    const add2gif = () => {
      const Img = new Image()
      Img.src = (refCanvasEle.value as HTMLCanvasElement).toDataURL('image/png')
      Img.width = (refCanvasEle.value as HTMLCanvasElement).width
      Img.height = (refCanvasEle.value as HTMLCanvasElement).height
      gif.addFrame(Img, { delay: 1000 / data.config.frame })
    }

    // 初始化gif
    const initGif = () => {
      gif = new GIF({
        workers: 4,
        quality: data.config.quality,
        workerScript: 'https://xxliang1122.github.io/utils/dist/gif.worker.js'
        // workerScript: process.env.NODE_ENV === 'production' ? './gif.worker.js' : './public/gif.worker.js'
      })
      gif.on('finished', (blob: Blob) => {
        data.gifUrl = URL.createObjectURL(blob)
        data.loading = false
        gif = null
      })
    }

    return {
      ...toRefs(data),
      expectDelay,
      refVideoEle,
      refCanvasEle,
      fileChange,
      play,
      ended,
      playVideo
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
    width: 40%;
    display: flex;
    justify-content: space-around;
  }

  .config {
    width: 60%;
    font-size: 18px;
    color: #666;
    line-height: 40px;

    label {
      margin-right: 10px;
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

  .file-name {
    margin: 0;
    text-align: left;
    color: #999;
    font-size: 14px;
    padding: 4px 10px;
  }

  .tips {
    margin: 20px 0 6px;
    color: #999;
  }

  .boy {
    width: 400px;
    height: 400px;
    margin: 0 auto;
    background-image: url(../../assets/boy.png);
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
  }

  .snoring {
    animation: snoring 1s linear infinite;
  }

  @keyframes snoring {
    0% { background-image: url(../../assets/boy.png); }
    25% { background-image: url(../../assets/boy1.png); }
    50% { background-image: url(../../assets/boy2.png); }
    75% { background-image: url(../../assets/boy3.png); }
  }
}

video,
canvas,
input[type="file"] {
  display: none;
}
</style>