<template>
  <div class="loading-overlay">
    <!-- 矩阵雨背景 -->
    <canvas ref="matrixCanvas" class="matrix-bg"></canvas>
    
    <!-- 扫描线效果 -->
    <div class="scan-lines"></div>
    
    <!-- 加载内容 -->
    <div class="loading-content">
      <!-- 核心加载环 -->
      <div class="core-container">
        <div class="core-ring ring-1"></div>
        <div class="core-ring ring-2"></div>
        <div class="core-ring ring-3"></div>
        <div class="core-center">
          <span class="core-icon">◉</span>
        </div>
      </div>
      
      <!-- 加载状态文字 -->
      <div class="status-text">
        <span class="typing-text">{{ displayText }}</span>
        <span class="cursor">_</span>
      </div>
      
      <!-- 进度数值 -->
      <div class="progress-value">
        <span class="percent">{{ progress }}</span>
        <span class="unit">%</span>
      </div>
      
      <!-- 进度条 -->
      <div class="progress-container">
        <div class="progress-track">
          <div class="progress-fill" :style="{ width: progress + '%' }">
            <div class="progress-glow"></div>
          </div>
        </div>
        <div class="progress-markers">
          <span v-for="n in 10" :key="n" class="marker" :class="{ active: progress >= n * 10 }"></span>
        </div>
      </div>
      
      <!-- 系统信息 -->
      <div class="system-info">
        <span class="info-line">System Initializing...</span>
        <span class="info-line">Loading Resources: [{{ progress }}/100]</span>
      </div>
    </div>
    
    <!-- 角落装饰 -->
    <div class="corner-decor top-left">◢</div>
    <div class="corner-decor top-right">◣</div>
    <div class="corner-decor bottom-left">◥</div>
    <div class="corner-decor bottom-right">◤</div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'

const props = defineProps(['progress'])
const matrixCanvas = ref(null)
const displayText = ref('LOADING SCENE')

// 打字效果文本
const texts = [
  'INITIALIZING...',
  'LOADING RESOURCES...',
  'BUILDING SCENE...',
  'CONNECTING...',
  'SYNCING DATA...'
]

let textIndex = 0
let charIndex = 0
let typingInterval = null

// 打字机效果
function typeText() {
  const currentText = texts[textIndex]
  if (charIndex < currentText.length) {
    displayText.value = currentText.substring(0, charIndex + 1)
    charIndex++
  } else {
    setTimeout(() => {
      charIndex = 0
      textIndex = (textIndex + 1) % texts.length
    }, 1000)
  }
}

// 矩阵雨效果
function initMatrixRain() {
  const canvas = matrixCanvas.value
  if (!canvas) return
  
  const ctx = canvas.getContext('2d')
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  
  const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンヴヵヶ'
  const fontSize = 14
  const columns = canvas.width / fontSize
  const drops = []
  
  for (let i = 0; i < columns; i++) {
    drops[i] = Math.random() * -100
  }
  
  let animationId = null
  let frameCount = 0
  
  function draw() {
    frameCount++
    // 每2帧绘制一次，降低渲染频率
    if (frameCount % 2 === 0) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      ctx.fillStyle = '#00ff41'
      ctx.font = fontSize + 'px monospace'
      
      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)]
        const alpha = Math.random() * 0.5 + 0.3
        ctx.globalAlpha = alpha
        ctx.fillText(text, i * fontSize, drops[i] * fontSize)
        ctx.globalAlpha = 1
        
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }
    }
    
    animationId = requestAnimationFrame(draw)
  }
  
  draw()
  
  return () => {
    if (animationId) cancelAnimationFrame(animationId)
  }
}

onMounted(() => {
  typingInterval = setInterval(typeText, 80)
  const cleanup = initMatrixRain()
  
  onUnmounted(() => {
    clearInterval(typingInterval)
    cleanup()
  })
})
</script>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #000000;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  overflow: hidden;
}

/* 矩阵雨背景 */
.matrix-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.15;
  pointer-events: none;
}

/* 扫描线效果 */
.scan-lines {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 255, 65, 0.03) 2px,
    rgba(0, 255, 65, 0.03) 4px
  );
  pointer-events: none;
  animation: scanMove 8s linear infinite;
}

@keyframes scanMove {
  0% { transform: translateY(0); }
  100% { transform: translateY(4px); }
}

/* 加载内容 */
.loading-content {
  position: relative;
  text-align: center;
  z-index: 10;
}

/* 核心加载环 */
.core-container {
  position: relative;
  width: 140px;
  height: 140px;
  margin: 0 auto 40px;
}

.core-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 2px solid transparent;
  border-radius: 50%;
}

.ring-1 {
  width: 140px;
  height: 140px;
  border-top-color: #00ff41;
  border-right-color: rgba(0, 255, 65, 0.3);
  animation: rotate1 3s linear infinite;
  box-shadow: 0 0 30px rgba(0, 255, 65, 0.2);
}

.ring-2 {
  width: 110px;
  height: 110px;
  border-bottom-color: #00ff41;
  border-left-color: rgba(0, 255, 65, 0.3);
  animation: rotate2 2s linear infinite reverse;
}

.ring-3 {
  width: 80px;
  height: 80px;
  border: 1px dashed rgba(0, 255, 65, 0.5);
  animation: rotate3 4s linear infinite;
}

@keyframes rotate1 {
  to { transform: translate(-50%, -50%) rotate(360deg); }
}

@keyframes rotate2 {
  to { transform: translate(-50%, -50%) rotate(-360deg); }
}

@keyframes rotate3 {
  to { transform: translate(-50%, -50%) rotate(360deg); }
}

.core-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.core-icon {
  font-size: 24px;
  color: #00ff41;
  text-shadow: 0 0 20px #00ff41;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(0.9); }
}

/* 状态文字 */
.status-text {
  font-family: 'Courier New', monospace;
  font-size: 14px;
  color: #00ff41;
  letter-spacing: 3px;
  margin-bottom: 30px;
  text-shadow: 0 0 10px rgba(0, 255, 65, 0.5);
}

.cursor {
  animation: blink 0.5s step-end infinite;
}

@keyframes blink {
  50% { opacity: 0; }
}

/* 进度数值 */
.progress-value {
  margin-bottom: 20px;
}

.percent {
  font-family: 'Courier New', monospace;
  font-size: 56px;
  font-weight: bold;
  color: #00ff41;
  text-shadow: 0 0 20px rgba(0, 255, 65, 0.8), 0 0 40px rgba(0, 255, 65, 0.4);
}

.unit {
  font-family: 'Courier New', monospace;
  font-size: 24px;
  color: #00ff41;
  margin-left: 4px;
}

/* 进度条容器 */
.progress-container {
  width: 400px;
  margin: 0 auto 24px;
}

.progress-track {
  width: 100%;
  height: 4px;
  background: rgba(0, 255, 65, 0.2);
  border-radius: 2px;
  overflow: hidden;
  position: relative;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #00ff41 0%, #00ff41 100%);
  box-shadow: 0 0 20px #00ff41;
  transition: width 0.3s ease;
  position: relative;
}

.progress-glow {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 20px;
  background: radial-gradient(ellipse at center, rgba(0, 255, 65, 0.8) 0%, transparent 70%);
}

/* 进度标记 */
.progress-markers {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  padding: 0 2px;
}

.marker {
  width: 2px;
  height: 6px;
  background: rgba(0, 255, 65, 0.3);
  transition: background 0.3s;
}

.marker.active {
  background: #00ff41;
  box-shadow: 0 0 5px #00ff41;
}

/* 系统信息 */
.system-info {
  font-family: 'Courier New', monospace;
  font-size: 11px;
  color: rgba(0, 255, 65, 0.6);
  letter-spacing: 1px;
  line-height: 1.8;
}

.info-line {
  display: block;
}

/* 角落装饰 */
.corner-decor {
  position: absolute;
  font-size: 20px;
  color: #00ff41;
  opacity: 0.6;
  text-shadow: 0 0 10px rgba(0, 255, 65, 0.5);
}

.top-left {
  top: 40px;
  left: 40px;
}

.top-right {
  top: 40px;
  right: 40px;
}

.bottom-left {
  bottom: 40px;
  left: 40px;
}

.bottom-right {
  bottom: 40px;
  right: 40px;
}

/* 响应式 */
@media (max-width: 768px) {
  .progress-container {
    width: 280px;
  }
  
  .percent {
    font-size: 40px;
  }
  
  .core-container {
    width: 120px;
    height: 120px;
  }
  
  .ring-1 {
    width: 120px;
    height: 120px;
  }
  
  .ring-2 {
    width: 90px;
    height: 90px;
  }
  
  .ring-3 {
    width: 60px;
    height: 60px;
  }
}
</style>