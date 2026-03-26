<template>
  <div class="right-panel">
    <div class="panel-header">
      <div class="panel-title">运营监控</div>
      <div class="panel-subtitle">Operation Monitor</div>
    </div>
    
    <div class="panel-content">
      <!-- 能源管理 -->
      <div class="stat-section">
        <div class="section-header">
          <span class="section-icon">⚡</span>
          <span class="section-title">能源管理</span>
        </div>
        <div class="energy-cards">
          <div class="energy-card" @mouseenter="highlightEnergy('today')" @mouseleave="unhighlightEnergy">
            <div class="energy-icon">📅</div>
            <div class="energy-info">
              <div class="energy-value">{{ stats.energy.today }}</div>
              <div class="energy-label">今日用电 (kWh)</div>
            </div>
          </div>
          <div class="energy-card" @mouseenter="highlightEnergy('month')" @mouseleave="unhighlightEnergy">
            <div class="energy-icon">📊</div>
            <div class="energy-info">
              <div class="energy-value">{{ stats.energy.month }}</div>
              <div class="energy-label">本月用电 (kWh)</div>
            </div>
          </div>
        </div>
        <div class="trend-bar" :class="stats.energy.trend < 0 ? 'down' : 'up'">
          <span class="trend-label">环比</span>
          <span class="trend-value">{{ stats.energy.trend > 0 ? '+' : '' }}{{ stats.energy.trend }}%</span>
        </div>
      </div>

      <!-- 电梯管理 -->
      <div class="stat-section">
        <div class="section-header">
          <span class="section-icon">🛗</span>
          <span class="section-title">电梯管理</span>
        </div>
        <div class="elevator-status">
          <div class="elevator-item running">
            <div class="elevator-visual">
              <div class="elevator-shaft">
                <div class="elevator-car"></div>
              </div>
            </div>
            <div class="elevator-info">
              <div class="elevator-count">{{ stats.elevator.running }}</div>
              <div class="elevator-label">运行中</div>
            </div>
          </div>
          <div class="elevator-item standby">
            <div class="elevator-visual">
              <div class="elevator-shaft">
                <div class="elevator-car stopped"></div>
              </div>
            </div>
            <div class="elevator-info">
              <div class="elevator-count">{{ stats.elevator.standby }}</div>
              <div class="elevator-label">待机中</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 后勤服务 -->
      <div class="stat-section">
        <div class="section-header">
          <span class="section-icon">🔧</span>
          <span class="section-title">后勤服务</span>
        </div>
        <div class="service-list">
          <div class="service-item pending" @mouseenter="highlightService('pending')" @mouseleave="unhighlightService">
            <div class="service-dot"></div>
            <div class="service-content">
              <span class="service-name">待处理工单</span>
              <span class="service-count">{{ stats.service.pending }}</span>
            </div>
          </div>
          <div class="service-item completed" @mouseenter="highlightService('completed')" @mouseleave="unhighlightService">
            <div class="service-dot"></div>
            <div class="service-content">
              <span class="service-name">已完成工单</span>
              <span class="service-count">{{ stats.service.completed }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ECharts 实时能耗图表 -->
      <div class="chart-section">
        <div class="section-header">
          <span class="section-icon">📈</span>
          <span class="section-title">实时能耗趋势</span>
        </div>
        <div ref="chartRef" class="chart-container"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'

const props = defineProps(['stats'])
const chartRef = ref(null)
let chart = null

function highlightEnergy(type) {
  console.log('Highlight energy:', type)
}

function unhighlightEnergy() {
  console.log('Unhighlight energy')
}

function highlightService(type) {
  console.log('Highlight service:', type)
}

function unhighlightService() {
  console.log('Unhighlight service')
}

function initChart() {
  if (!chartRef.value) return
  
  chart = echarts.init(chartRef.value)
  
  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`)
  const data = Array.from({ length: 24 }, () => Math.floor(150 + Math.random() * 200))
  
  const option = {
    backgroundColor: 'transparent',
    grid: {
      top: 20,
      left: 0,
      right: 0,
      bottom: 0,
      containLabel: false
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0,0,0,0.8)',
      borderColor: '#00ffff',
      textStyle: { color: '#00ffff', fontSize: 10 },
      formatter: '{b}: {c} kWh'
    },
    xAxis: {
      type: 'category',
      data: hours,
      show: false
    },
    yAxis: {
      type: 'value',
      show: false
    },
    series: [{
      type: 'bar',
      data: data,
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#00ffff' },
          { offset: 1, color: 'rgba(0,255,255,0.1)' }
        ]),
        borderRadius: [2, 2, 0, 0]
      },
      emphasis: {
        itemStyle: {
          color: '#00ff64'
        }
      }
    }]
  }
  
  chart.setOption(option)
  
  // 实时更新
  setInterval(() => {
    const newData = data.map(v => {
      const change = (Math.random() - 0.5) * 50
      return Math.max(100, Math.min(400, v + change))
    })
    chart.setOption({ series: [{ data: newData }] })
  }, 2000)
}

onMounted(() => {
  initChart()
  window.addEventListener('resize', () => chart && chart.resize())
})

onUnmounted(() => {
  chart && chart.dispose()
})
</script>

<style scoped>
.right-panel {
  position: fixed;
  top: 70px;
  right: 10px;
  width: 300px;
  height: calc(100vh - 80px);
  background: rgba(10, 22, 40, 0.25);
  border: 1px solid rgba(0, 255, 255, 0.1);
  border-radius: 12px;
  backdrop-filter: blur(4px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 50;
}

.panel-header {
  padding: 16px 20px;
  border-bottom: 1px solid rgba(0, 255, 255, 0.08);
  background: linear-gradient(-90deg, rgba(0, 255, 255, 0.08) 0%, transparent 100%);
  text-align: right;
}

.panel-title {
  font-size: 18px;
  font-weight: bold;
  color: #00ffff;
  text-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
}

.panel-subtitle {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.4);
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-top: 4px;
}

.panel-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.stat-section { margin-bottom: 16px; }

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.section-title {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
}

.energy-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 10px;
}

.energy-card {
  background: rgba(0, 255, 255, 0.03);
  border: 1px solid rgba(0, 255, 255, 0.08);
  border-radius: 8px;
  padding: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.energy-card:hover {
  background: rgba(0, 255, 255, 0.08);
  border-color: rgba(0, 255, 255, 0.2);
  transform: translateY(-2px);
}

.energy-icon { font-size: 18px; margin-bottom: 6px; }

.energy-value {
  font-size: 16px;
  font-weight: bold;
  color: #00ffff;
}

.energy-label {
  font-size: 9px;
  color: rgba(255, 255, 255, 0.5);
}

.trend-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 11px;
}

.trend-bar.up {
  background: rgba(255, 100, 100, 0.08);
}

.trend-bar.down {
  background: rgba(0, 255, 100, 0.08);
}

.trend-value { font-weight: bold; }
.trend-bar.up .trend-value { color: #ff6464; }
.trend-bar.down .trend-value { color: #00ff64; }

.elevator-status {
  display: flex;
  gap: 16px;
  padding: 10px;
  background: rgba(0, 255, 255, 0.02);
  border-radius: 10px;
}

.elevator-item {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
}

.elevator-visual {
  width: 20px;
  height: 40px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 3px;
  padding: 2px;
}

.elevator-shaft {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 2px;
  position: relative;
  overflow: hidden;
}

.elevator-car {
  width: 100%;
  height: 40%;
  background: linear-gradient(180deg, #00ff64, #00cc50);
  border-radius: 2px;
  position: absolute;
  animation: elevatorMove 3s ease-in-out infinite;
}

.elevator-car.stopped {
  background: linear-gradient(180deg, #ffa500, #cc8400);
  animation: none;
  bottom: 10%;
}

@keyframes elevatorMove {
  0%, 100% { bottom: 10%; }
  50% { bottom: 50%; }
}

.elevator-count {
  font-size: 18px;
  font-weight: bold;
  color: #00ffff;
}

.elevator-label {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.5);
}

.service-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.service-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background: rgba(0, 255, 255, 0.02);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.service-item:hover {
  background: rgba(0, 255, 255, 0.06);
  transform: translateX(4px);
}

.service-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.service-item.pending .service-dot {
  background: #ffa500;
  animation: blink 1.5s infinite;
}

.service-item.completed .service-dot {
  background: #00ff64;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.service-content {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.service-name {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.7);
}

.service-count {
  font-size: 15px;
  font-weight: bold;
  color: #00ffff;
}

.chart-section { margin-top: 10px; }

.chart-container {
  height: 100px;
  background: rgba(0, 255, 255, 0.02);
  border-radius: 8px;
}

.panel-content::-webkit-scrollbar { width: 3px; }
.panel-content::-webkit-scrollbar-track { background: transparent; }
.panel-content::-webkit-scrollbar-thumb {
  background: rgba(0, 255, 255, 0.15);
  border-radius: 2px;
}
</style>