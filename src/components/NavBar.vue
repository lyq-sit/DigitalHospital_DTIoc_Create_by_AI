<template>
  <div class="nav-wrapper">
    <!-- 顶部栏 -->
    <nav class="navbar">
      <div class="nav-title">智慧医院数字孪生 IOC</div>
      <div class="nav-info">
        <div class="info-item">
          <span class="info-icon">📅</span>
          <span class="info-text">{{ currentDate }}</span>
        </div>
        <div class="info-item">
          <span class="info-icon">☀️</span>
          <span class="info-text">{{ weather }} 24°C</span>
        </div>
        <div class="info-item">
          <span class="info-icon">📆</span>
          <span class="info-text">{{ weekDay }}</span>
        </div>
      </div>
    </nav>

    <!-- 底部切换按钮 -->
    <div class="bottom-nav">
      <div class="nav-modules">
        <button 
          class="nav-btn" 
          :class="{ active: currentModule === 'overview' }"
          @click="$emit('switchModule', 'overview')"
        >
          <span class="btn-icon">🏠</span>
          <span class="btn-text">综合管理</span>
        </button>
        <button 
          class="nav-btn" 
          :class="{ active: currentModule === 'space' }"
          @click="$emit('switchModule', 'space')"
        >
          <span class="btn-icon">📐</span>
          <span class="btn-text">空间管理</span>
        </button>
        <button 
          class="nav-btn" 
          :class="{ active: currentModule === 'device' }"
          @click="$emit('switchModule', 'device')"
        >
          <span class="btn-icon">🔧</span>
          <span class="btn-text">设备管理</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

defineProps(['currentModule'])
defineEmits(['switchModule'])

const currentDate = ref('')
const weekDay = ref('')
const weather = ref('晴')

function updateDateTime() {
  const now = new Date()
  currentDate.value = now.toLocaleDateString('zh-CN', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit' 
  }).replace(/\//g, '-')
  
  const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  weekDay.value = weekDays[now.getDay()]
}

onMounted(() => {
  updateDateTime()
  setInterval(updateDateTime, 60000)
})
</script>

<style scoped>
.nav-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 100;
}

.navbar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50px;
  background: rgba(10, 22, 40, 0.25);
  border-bottom: 1px solid rgba(0, 255, 255, 0.1);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  pointer-events: auto;
}

.nav-title {
  font-size: 26px;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: 4px;
  text-shadow:
    0 0 10px rgba(255, 255, 255, 0.5),
    0 0 20px rgba(255, 255, 255, 0.3),
    0 0 40px rgba(0, 200, 255, 0.2);
}

.nav-info {
  display: flex;
  align-items: center;
  gap: 20px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: rgba(0, 255, 255, 0.05);
  border: 1px solid rgba(0, 255, 255, 0.1);
  border-radius: 20px;
}

.info-icon {
  font-size: 14px;
}

.info-text {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
}

.bottom-nav {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  pointer-events: auto;
}

.nav-modules {
  display: flex;
  gap: 16px;
  padding: 12px 20px;
  background: rgba(10, 22, 40, 0.25);
  border: 1px solid rgba(0, 255, 255, 0.1);
  border-radius: 30px;
  backdrop-filter: blur(4px);
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 24px;
  background: transparent;
  border: 1px solid rgba(0, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.7);
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-btn:hover {
  background: rgba(0, 255, 255, 0.1);
  border-color: rgba(0, 255, 255, 0.4);
  color: #00ffff;
  transform: translateY(-2px);
}

.nav-btn.active {
  background: rgba(0, 255, 255, 0.15);
  border-color: #00ffff;
  color: #00ffff;
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.2);
}

.btn-icon {
  font-size: 16px;
}

.btn-text {
  font-size: 14px;
  font-weight: 500;
}
</style>