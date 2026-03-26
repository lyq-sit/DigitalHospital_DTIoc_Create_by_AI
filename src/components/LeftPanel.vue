<template>
  <div class="left-panel">
    <div class="panel-header">
      <div class="panel-title">空间管理</div>
      <div class="panel-subtitle">Space Management</div>
    </div>
    
    <div class="panel-content">
      <!-- 空间统计 -->
      <div class="stat-section">
        <div class="section-header">
          <span class="section-icon">📊</span>
          <span class="section-title">空间统计</span>
        </div>
        <div class="stat-grid">
          <div class="stat-card" @mouseenter="highlightStat('area')" @mouseleave="unhighlightStat">
            <div class="stat-value">{{ stats.space.totalArea }}</div>
            <div class="stat-label">总面积 (㎡)</div>
            <div class="stat-trend" :class="stats.space.utilization > 80 ? 'up' : 'down'">
              {{ stats.space.utilization }}% 利用率
            </div>
          </div>
          <div class="stat-card" @mouseenter="highlightStat('rooms')" @mouseleave="unhighlightStat">
            <div class="stat-value">{{ stats.space.totalRooms }}</div>
            <div class="stat-label">房间总数</div>
            <div class="stat-trend up">+3 本月新增</div>
          </div>
        </div>
      </div>

      <!-- 综合安全管理 -->
      <div class="stat-section">
        <div class="section-header">
          <span class="section-icon">🔒</span>
          <span class="section-title">综合安全管理</span>
        </div>
        <div class="safety-indicator">
          <div class="safety-ring" :class="{ 'safe': stats.security.alarmCount === 0 }">
            <div class="ring-inner">
              <div class="safety-status">{{ stats.security.alarmCount === 0 ? '安全' : '告警' }}</div>
              <div class="safety-count">{{ stats.security.alarmCount }} 个告警</div>
            </div>
          </div>
          <div class="safety-detail">
            <div class="detail-item">
              <span class="detail-label">巡检完成率</span>
              <span class="detail-value highlight">{{ stats.security.checkRate }}%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 医疗设备管理 -->
      <div class="stat-section">
        <div class="section-header">
          <span class="section-icon">🏥</span>
          <span class="section-title">医疗设备管理</span>
        </div>
        <div class="equipment-stats">
          <div class="equip-item" v-for="(item, index) in equipmentList" :key="index">
            <div class="equip-icon" :class="item.class">{{ item.icon }}</div>
            <div class="equip-info">
              <div class="equip-value">{{ item.value }}</div>
              <div class="equip-label">{{ item.label }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- ECharts 图表区域 -->
      <div class="chart-section">
        <div class="section-header">
          <span class="section-icon">📈</span>
          <span class="section-title">空间利用率趋势</span>
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
let updateTimer = null

const equipmentList = computed(() => [
  { icon: '🔧', value: props.stats.equipment.total, label: '设备总数', class: 'total' },
  { icon: '✅', value: props.stats.equipment.active, label: '运行中', class: 'active' },
  { icon: '🔧', value: props.stats.equipment.maintenance, label: '维护中', class: 'maintain' }
])

function highlightStat(type) {
  console.log('Highlight stat:', type)
}

function unhighlightStat() {
  console.log('Unhighlight stat')
}

function initChart() {
  if (!chartRef.value) return
  
  chart = echarts.init(chartRef.value)
  
  const option = {
    backgroundColor: 'transparent',
    grid: {
      top: 30,
      left: 10,
      right: 10,
      bottom: 20,
      containLabel: true
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0,0,0,0.8)',
      borderColor: '#00ffff',
      textStyle: { color: '#00ffff' }
    },
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月'],
      axisLine: { lineStyle: { color: 'rgba(0,255,255,0.3)' } },
      axisLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 10 }
    },
    yAxis: {
      type: 'value',
      max: 100,
      axisLine: { show: false },
      splitLine: { lineStyle: { color: 'rgba(0,255,255,0.1)' } },
      axisLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 10, formatter: '{value}%' }
    },
    series: [{
      name: '利用率',
      type: 'line',
      smooth: true,
      data: [75, 78, 82, 85, 88, 91],
      lineStyle: { color: '#00ffff', width: 2 },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(0,255,255,0.3)' },
          { offset: 1, color: 'rgba(0,255,255,0)' }
        ])
      },
      symbol: 'circle',
      symbolSize: 6,
      itemStyle: { color: '#00ffff' }
    }]
  }
  
  chart.setOption(option)
  
  // 自动更新数据动画
  updateTimer = setInterval(() => {
    if (!chart) return
    const newData = option.series[0].data.map(v => {
      const change = (Math.random() - 0.5) * 4
      return Math.max(70, Math.min(95, v + change))
    })
    chart.setOption({ series: [{ data: newData }] })
  }, 3000)
}

onMounted(() => {
  initChart()
  window.addEventListener('resize', () => chart && chart.resize())
})

onUnmounted(() => {
  if (updateTimer) {
    clearInterval(updateTimer)
    updateTimer = null
  }
  if (chart) {
    chart.dispose()
    chart = null
  }
})
</script>

<style scoped>
.left-panel {
  position: fixed;
  top: 70px;
  left: 10px;
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
  background: linear-gradient(90deg, rgba(0, 255, 255, 0.08) 0%, transparent 100%);
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

.stat-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.stat-card {
  background: rgba(0, 255, 255, 0.03);
  border: 1px solid rgba(0, 255, 255, 0.08);
  border-radius: 8px;
  padding: 12px 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.stat-card:hover {
  background: rgba(0, 255, 255, 0.08);
  border-color: rgba(0, 255, 255, 0.2);
  transform: translateY(-2px);
}

.stat-value {
  font-size: 20px;
  font-weight: bold;
  color: #00ffff;
}

.stat-label {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.5);
  margin: 4px 0;
}

.stat-trend {
  font-size: 9px;
  padding: 2px 6px;
  border-radius: 10px;
  display: inline-block;
}

.stat-trend.up {
  background: rgba(0, 255, 100, 0.1);
  color: #00ff64;
}

.stat-trend.down {
  background: rgba(255, 100, 100, 0.1);
  color: #ff6464;
}

.safety-indicator {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  background: rgba(0, 255, 255, 0.02);
  border-radius: 10px;
}

.safety-ring {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  border: 2px solid rgba(255, 100, 100, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pulse 2s infinite;
}

.safety-ring.safe {
  border-color: rgba(0, 255, 100, 0.4);
}

@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(0, 255, 100, 0.15); }
  50% { box-shadow: 0 0 0 8px rgba(0, 255, 100, 0); }
}

.safety-status {
  font-size: 13px;
  font-weight: bold;
  color: #00ff64;
}

.safety-count {
  font-size: 9px;
  color: rgba(255, 255, 255, 0.5);
}

.safety-detail { flex: 1; }

.detail-item {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
}

.detail-label {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.6);
}

.detail-value {
  font-size: 13px;
  color: #00ffff;
  font-weight: bold;
}

.equipment-stats {
  display: flex;
  justify-content: space-around;
  padding: 10px;
  background: rgba(0, 255, 255, 0.02);
  border-radius: 10px;
}

.equip-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.equip-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.equip-icon.total { background: rgba(0, 150, 255, 0.15); }
.equip-icon.active { background: rgba(0, 255, 100, 0.15); }
.equip-icon.maintain { background: rgba(255, 165, 0, 0.15); }

.equip-value {
  font-size: 15px;
  font-weight: bold;
  color: #00ffff;
}

.equip-label {
  font-size: 9px;
  color: rgba(255, 255, 255, 0.5);
}

.chart-section { margin-top: 10px; }

.chart-container {
  height: 140px;
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