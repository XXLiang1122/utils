var e=Object.assign;import{_ as a}from"./Wrapper.30c6c947.js";import{d as l,r as t,k as i,l as n,t as r,p as o,a as s,b as d,o as f,c,w as g,e as u,f as m,m as p,i as v,n as h}from"./index.81a38c2f.js";var y=l({name:"SketchGif",components:{Wrapper:a},setup:()=>{let a;const l=t({video:null,canvas:null,file:null,videoSrc:"",fileName:"",size:0,gifUrl:"",config:{frame:8,quality:10},loading:!1});let o;const s=i((()=>1e3/l.config.frame)),d=n(null),f=n(null),c=(e,a,l)=>{const t=(l=l||{}).blurRadius||2,i=l.lowThreshold||20,n=l.highThreshold||50,r=e.width||e.videoWidth,o=e.height||e.videoHeight;let s=r,d=o;r>400&&(s=400,d=Math.round(o*s/r));const f=a.getContext("2d");a.width=e.width=s,a.height=e.height=d,f.clearRect(0,0,s,d),f.drawImage(e,0,0,s,d);const c=f.getImageData(0,0,s,d),g=new jsfeat.matrix_t(s,d,jsfeat.U8C1_t);jsfeat.imgproc.grayscale(c.data,s,d,g);const u=2*(t+1);jsfeat.imgproc.gaussian_blur(g,g,u,0),jsfeat.imgproc.canny(g,g,i,n);const m=new Uint32Array(c.data.buffer);let p=g.cols*g.rows,v=0;for(;--p>=0;)v=255-g.data[p],m[p]=-16777216|v<<16|v<<8|v;f.putImageData(c,0,0)},g=()=>{let e=(new Date).getTime(),l=(new Date).getTime(),t=0;c(d.value,f.value),u(),a=setInterval((()=>{e=(new Date).getTime(),c(d.value,f.value),u(),l=(new Date).getTime(),t=l-e,console.log(s.value>t?s.value-t:0)}),s.value>t?s.value-t:0)},u=()=>{const e=new Image;e.src=f.value.toDataURL("image/png"),e.width=f.value.width,e.height=f.value.height,o.addFrame(e,{delay:1e3/l.config.frame})},m=()=>{o=new GIF({workers:4,quality:l.config.quality,workerScript:"https://xxliang1122.github.io/utils/dist/gif.worker.js"}),o.on("finished",(e=>{l.gifUrl=URL.createObjectURL(e),l.loading=!1,o=null}))};return e(e({},r(l)),{expectDelay:s,refVideoEle:d,refCanvasEle:f,fileChange:e=>{l.videoSrc=URL.createObjectURL(e.target.files[0]),l.fileName=e.target.files[0].name,l.size=Math.round(e.target.files[0].size/1024)},play:()=>{g()},ended:()=>{clearInterval(a);try{o.render()}catch(e){l.loading=!1,console.log(e)}},playVideo:()=>{l.videoSrc&&(m(),l.loading=!0,console.log(d),d.value.play())}})}});const b=g("data-v-2496bc07");o("data-v-2496bc07");const w={ref:"refCanvasEle"},U={class:"controls"},k={class:"btn-group"},j=u("label",{class:"btn-upload button-l",for:"file"},"选择视频",-1),C={key:0,class:"btn-transform button-l"},I={class:"config"},D=u("span",null,"选择帧率：",-1),V=u("label",{for:"frame8"},"8帧",-1),_=u("label",{for:"frame16"},"16帧",-1),x=u("label",{for:"frame32"},"24帧",-1),R={key:0,class:"file-name"},S={key:1},T=u("p",{class:"tips"},"点击图片下载",-1);s();const E=b(((e,a,l,t,i,n)=>{const r=d("Wrapper");return f(),c(r,{title:"线稿 GIF 生成器",width:"600"},{default:b((()=>[u("video",{ref:"refVideoEle",src:e.videoSrc,onPlay:a[1]||(a[1]=(...a)=>e.play&&e.play(...a)),onEnded:a[2]||(a[2]=(...a)=>e.ended&&e.ended(...a)),controls:"",muted:""},null,40,["src"]),u("canvas",w,null,512),u("div",U,[u("div",k,[j,u("input",{id:"file",type:"file",accept:"video/*",onChange:a[3]||(a[3]=(...a)=>e.fileChange&&e.fileChange(...a)),ref:"file"},null,544),e.loading?(f(),c("div",C,"正在生成...")):(f(),c("div",{key:1,class:"btn-transform button-l",onClick:a[4]||(a[4]=(...a)=>e.playVideo&&e.playVideo(...a))},"开始"))]),u("div",I,[D,m(u("input",{id:"frame8",type:"radio",name:"frame",value:"8","onUpdate:modelValue":a[5]||(a[5]=a=>e.config.frame=a)},null,512),[[p,e.config.frame]]),V,m(u("input",{id:"frame16",type:"radio",name:"frame",value:"16","onUpdate:modelValue":a[6]||(a[6]=a=>e.config.frame=a)},null,512),[[p,e.config.frame]]),_,m(u("input",{id:"frame32",type:"radio",name:"frame",value:"24","onUpdate:modelValue":a[7]||(a[7]=a=>e.config.frame=a)},null,512),[[p,e.config.frame]]),x])]),e.fileName?(f(),c("p",R,"已选："+v(e.fileName)+"， 大小："+v(e.size)+"kb",1)):h("",!0),e.gifUrl&&!e.loading?(f(),c("div",S,[T,u("a",{href:e.gifUrl,target:"_blank"},[u("img",{class:"result-gif",src:e.gifUrl},null,8,["src"])],8,["href"])])):(f(),c("div",{key:2,class:["boy",{snoring:e.loading}]},null,2))])),_:1})}));y.render=E,y.__scopeId="data-v-2496bc07";export default y;