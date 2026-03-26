<template>
  <div class="device-manager">
    <button class="back-btn btn" @click="$emit('back')">← 返回综合首页</button>
    <div class="left-control panel">
      <div class="panel-title">设备管理</div>
      <div class="section">
        <div class="section-title">设备总览</div>
        <div class="stats-grid">
          <div class="stat-box"><div class="stat-number">{{ deviceStats.total }}</div><div class="stat-label">设备总数</div></div>
          <div class="stat-box"><div class="stat-number text-success">{{ deviceStats.active }}</div><div class="stat-label">运行中</div></div>
          <div class="stat-box"><div class="stat-number text-warning">{{ deviceStats.maintenance }}</div><div class="stat-label">维护中</div></div>
        </div>
      </div>
      <div class="section">
        <div class="section-title">设备查询</div>
        <div class="search-box">
          <input v-model="searchKeyword" type="text" class="input" placeholder="输入设备名称搜索..." @keyup.enter="searchDevice" />
          <button class="btn btn-primary" @click="searchDevice">搜索</button>
        </div>
      </div>
      <div class="section">
        <div class="section-title">新增设备</div>
        <button class="btn btn-primary" style="width: 100%;" @click="showAddModal = true">+ 新增设备</button>
      </div>
    </div>

    <div class="device-list panel">
      <div class="panel-title">设备列表<span class="subtitle">({{ filteredDevices.length }} 台)</span></div>
      <div class="list-content">
        <div v-for="device in filteredDevices" :key="device.dtId" class="list-item" :class="{ active: selectedDevice?.dtId === device.dtId }" @click="selectDevice(device)">
          <div class="device-header">
            <span class="device-name">{{ device.name }}</span>
            <span class="tag" :class="getStatusClass(device.status)">{{ device.status }}</span>
          </div>
          <div class="device-info">
            <span class="info-item">📍 {{ device.room }}</span>
            <span class="info-item">⚡ {{ device.energy || '-' }} kWh</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="selectedDevice" class="right-info panel">
      <div class="panel-title">
        {{ selectedDevice.name }}
        <button class="close-btn" @click="deselectDevice">×</button>
      </div>
      <div class="device-details">
        <div class="detail-row"><span class="label">设备类型：</span><span class="value">{{ selectedDevice.type }}</span></div>
        <div class="detail-row"><span class="label">所处位置：</span><span class="value">{{ selectedDevice.room }}</span></div>
        <div class="detail-row"><span class="label">安装日期：</span><span class="value">{{ selectedDevice.installDate }}</span></div>
        <div class="detail-row"><span class="label">设备能耗：</span><span class="value">{{ selectedDevice.energy || '-' }} kWh</span></div>
        <div class="detail-row"><span class="label">设备效益：</span><span class="value">{{ selectedDevice.benefit || '-' }} 万</span></div>
        <div class="detail-row"><span class="label">使用状态：</span><span class="tag" :class="getStatusClass(selectedDevice.status)">{{ selectedDevice.status }}</span></div>
      </div>
      <div class="device-actions" v-if="selectedDevice.status === '使用中'">
        <button class="btn btn-primary" @click="handleUpgrade">设备升级</button>
        <button class="btn btn-danger" @click="handleRemove">设备卸载</button>
      </div>
    </div>

    <!-- (3) 新增设备弹窗 - 关闭键右上角 -->
    <div v-if="showAddModal" class="modal-overlay" @click.self="showAddModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <span class="modal-title">新增设备</span>
          <button class="close-btn" @click="showAddModal = false">×</button>
        </div>
        <div class="modal-body">
          <div class="form-row">
            <label>选择房间：</label>
            <select v-model="addForm.room" class="input select-input">
              <option v-for="room in roomData" :key="room.dtId" :value="room">{{ room.name }} ({{ room.type }})</option>
            </select>
          </div>
          <div class="form-row">
            <label>设备类型：</label>
            <select v-model="addForm.deviceType" class="input select-input">
              <option value="新型诊疗床">新型诊疗床</option>
              <option value="X射线机">X射线机</option>
              <option value="手术机器人">手术机器人</option>
              <option value="新型核磁共振机">新型核磁共振机</option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn" @click="showAddModal = false">取消</button>
          <button class="btn btn-primary" @click="confirmAdd">确认新增</button>
        </div>
      </div>
    </div>

    <!-- 升级设备弹窗 -->
    <div v-if="showUpgradeModal" class="modal-overlay" @click.self="showUpgradeModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <span class="modal-title">设备升级</span>
          <button class="close-btn" @click="showUpgradeModal = false">×</button>
        </div>
        <div class="modal-body">
          <p>将 <strong>{{ selectedDevice?.name }}</strong> 升级为：</p>
          <div class="form-row">
            <label>升级型号：</label>
            <select v-model="upgradeForm.type" class="input select-input">
              <option v-if="selectedDevice?.type === '诊疗床'" value="新型诊疗床">新型诊疗床</option>
              <option v-if="selectedDevice?.type === '手术台'" value="手术机器人">手术机器人</option>
              <option v-if="selectedDevice?.type === '核磁共振机'" value="新型核磁共振机">新型核磁共振机</option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn" @click="showUpgradeModal = false">取消</button>
          <button class="btn btn-primary" @click="confirmUpgrade">确认升级</button>
        </div>
      </div>
    </div>

    <!-- (7) 卸载确认弹窗 -->
    <div v-if="showRemoveModal" class="modal-overlay" @click.self="showRemoveModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <span class="modal-title">设备卸载确认</span>
          <button class="close-btn" @click="showRemoveModal = false">×</button>
        </div>
        <div class="modal-body">
          <p>确认卸载设备 <strong>{{ selectedDevice?.name }}</strong> 吗？</p>
          <p class="warning-text">卸载后设备将从列表中移除，此操作不可撤销。</p>
        </div>
        <div class="modal-footer">
          <button class="btn" @click="showRemoveModal = false">取消</button>
          <button class="btn btn-danger" @click="confirmRemove">确认卸载</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps(['devices', 'presetDevices', 'roomData', 'pendingSelectDevice'])
const emit = defineEmits([
  'back', 'focusDevice', 'highlightDevice', 'clearDeviceOutline',
  'upgradeDevice', 'removeDevice', 'addDevice', 'clearPendingSelect'
])

// 监听外部传入的待选中设备（场景点击 / 新增设备后自动选中）
watch(() => props.pendingSelectDevice, (device) => {
  if (device) {
    selectDevice(device)
    emit('clearPendingSelect')
  }
})

const searchKeyword = ref('')
const selectedDevice = ref(null)
const showAddModal = ref(false)
const showUpgradeModal = ref(false)
const showRemoveModal = ref(false)

const addForm = ref({ room: null, deviceType: '' })
const upgradeForm = ref({ type: '' })

const deviceStats = computed(() => {
  const total = props.devices.filter(d => d.status !== '已卸载').length
  const active = props.devices.filter(d => d.status === '使用中').length
  const maintenance = props.devices.filter(d => d.status === '维护中').length
  return { total, active, maintenance }
})

const filteredDevices = computed(() => {
  if (!searchKeyword.value) return props.devices.filter(d => d.status !== '已卸载')
  return props.devices.filter(d => d.status !== '已卸载' && d.name.includes(searchKeyword.value))
})

function getStatusClass(status) {
  const map = { '使用中': 'tag-success', '空闲中': 'tag-warning', '维护中': 'tag-danger', '已卸载': 'tag-danger', '已升级': 'tag-warning' }
  return map[status] || ''
}

function searchDevice() {
  if (searchKeyword.value && filteredDevices.value.length > 0) selectDevice(filteredDevices.value[0])
}

// (2) 选择设备 - 聚焦+描边
function selectDevice(device) {
  selectedDevice.value = device
  emit('focusDevice', device)
  emit('highlightDevice', device)
}

// 取消选中 - 清除描边
function deselectDevice() {
  emit('clearDeviceOutline', selectedDevice.value)
  selectedDevice.value = null
}

function handleUpgrade() { upgradeForm.value.type = ''; showUpgradeModal.value = true }

// (5) 确认升级
function confirmUpgrade() {
  if (upgradeForm.value.type && selectedDevice.value) {
    emit('upgradeDevice', selectedDevice.value, upgradeForm.value.type)
    showUpgradeModal.value = false
  }
}

// (7) 卸载 - 弹窗确认
function handleRemove() { showRemoveModal.value = true }

function confirmRemove() {
  if (selectedDevice.value) {
    emit('clearDeviceOutline', selectedDevice.value)
    emit('removeDevice', selectedDevice.value)
    selectedDevice.value = null
    showRemoveModal.value = false
  }
}

// (4) 确认新增
function confirmAdd() {
  if (addForm.value.room && addForm.value.deviceType) {
    emit('addDevice', addForm.value.room, addForm.value.deviceType)
    showAddModal.value = false
    addForm.value = { room: null, deviceType: '' }
  }
}
</script>

<style scoped>
.device-manager { position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 101; }
.device-manager > * { pointer-events: auto; }
.panel { background: rgba(10, 22, 40, 0.25); border: 1px solid rgba(0, 255, 255, 0.1); border-radius: 12px; backdrop-filter: blur(4px); display: flex; flex-direction: column; overflow: hidden; }
.panel-title { font-size: 18px; font-weight: bold; color: #00ffff; text-shadow: 0 0 10px rgba(0, 255, 255, 0.3); padding: 16px 20px; border-bottom: 1px solid rgba(0, 255, 255, 0.08); background: linear-gradient(90deg, rgba(0, 255, 255, 0.08) 0%, transparent 100%); }
.back-btn { position: fixed; top: 80px; left: 20px; z-index: 101; background: rgba(0, 255, 255, 0.08); border: 1px solid rgba(0, 255, 255, 0.15); color: #00ffff; padding: 10px 20px; border-radius: 8px; font-size: 14px; transition: all 0.3s ease; }
.back-btn:hover { background: rgba(0, 255, 255, 0.15); border-color: rgba(0, 255, 255, 0.3); transform: translateY(-2px); }
.left-control { position: fixed; top: 130px; left: 20px; width: 300px; max-height: calc(100vh - 160px); }
.left-control .panel-title { background: linear-gradient(90deg, rgba(0, 255, 255, 0.08) 0%, transparent 100%); }
.section { padding: 16px 20px; border-bottom: 1px solid rgba(0, 255, 255, 0.06); }
.section:last-child { border-bottom: none; }
.section-title { font-size: 13px; color: rgba(255, 255, 255, 0.8); font-weight: 500; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
.section-title::before { content: ''; width: 3px; height: 14px; background: linear-gradient(180deg, #00ffff, rgba(0, 255, 255, 0.3)); border-radius: 2px; }
.stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.stat-box { text-align: center; padding: 14px 8px; background: rgba(0, 255, 255, 0.03); border: 1px solid rgba(0, 255, 255, 0.08); border-radius: 10px; transition: all 0.3s ease; }
.stat-box:hover { background: rgba(0, 255, 255, 0.06); border-color: rgba(0, 255, 255, 0.15); transform: translateY(-2px); }
.stat-number { font-size: 22px; font-weight: bold; color: #00ffff; margin-bottom: 6px; text-shadow: 0 0 8px rgba(0, 255, 255, 0.3); }
.stat-label { font-size: 10px; color: rgba(255, 255, 255, 0.5); }
.text-success { color: #00ff64; text-shadow: 0 0 8px rgba(0, 255, 100, 0.3); }
.text-warning { color: #ffa500; text-shadow: 0 0 8px rgba(255, 165, 0, 0.3); }
.search-box { display: flex; gap: 10px; }
.search-box .input { flex: 1; background: rgba(0, 255, 255, 0.03); border: 1px solid rgba(0, 255, 255, 0.1); border-radius: 8px; padding: 10px 12px; color: #fff; font-size: 13px; transition: all 0.3s ease; }
.search-box .input:focus { border-color: rgba(0, 255, 255, 0.3); background: rgba(0, 255, 255, 0.06); }
.search-box .input::placeholder { color: rgba(255, 255, 255, 0.3); }
.search-box .btn { background: rgba(0, 150, 255, 0.15); border: 1px solid rgba(0, 150, 255, 0.3); color: #0096ff; padding: 10px 16px; border-radius: 8px; font-size: 13px; transition: all 0.3s ease; }
.search-box .btn:hover { background: rgba(0, 150, 255, 0.3); }
.section .btn-primary { width: 100%; background: rgba(0, 255, 100, 0.1); border: 1px solid rgba(0, 255, 100, 0.2); color: #00ff64; padding: 12px; border-radius: 8px; font-size: 14px; transition: all 0.3s ease; }
.section .btn-primary:hover { background: rgba(0, 255, 100, 0.2); border-color: rgba(0, 255, 100, 0.4); }
.device-list { position: fixed; top: 80px; left: 340px; width: 320px; height: calc(100vh - 100px); }
.device-list .panel-title { display: flex; align-items: center; gap: 8px; }
.subtitle { font-size: 12px; color: rgba(255, 255, 255, 0.5); font-weight: normal; }
.list-content { flex: 1; overflow-y: auto; padding: 12px; }
.list-item { padding: 14px 16px; margin-bottom: 10px; background: rgba(0, 255, 255, 0.03); border: 1px solid rgba(0, 255, 255, 0.06); border-radius: 10px; cursor: pointer; transition: all 0.3s ease; }
.list-item:last-child { margin-bottom: 0; }
.list-item:hover { background: rgba(0, 255, 255, 0.06); border-color: rgba(0, 255, 255, 0.12); transform: translateX(4px); }
.list-item.active { background: rgba(0, 255, 255, 0.1); border-color: rgba(0, 255, 255, 0.2); box-shadow: 0 0 15px rgba(0, 255, 255, 0.1); }
.device-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.device-name { font-size: 15px; font-weight: 600; color: #fff; }
.tag { padding: 3px 10px; border-radius: 12px; font-size: 11px; font-weight: 500; }
.tag-success { background: rgba(0, 255, 100, 0.15); color: #00ff64; border: 1px solid rgba(0, 255, 100, 0.2); }
.tag-warning { background: rgba(255, 165, 0, 0.15); color: #ffa500; border: 1px solid rgba(255, 165, 0, 0.2); }
.tag-danger { background: rgba(255, 50, 50, 0.15); color: #ff3232; border: 1px solid rgba(255, 50, 50, 0.2); }
.device-info { display: flex; gap: 16px; font-size: 12px; color: rgba(255, 255, 255, 0.5); }
.info-item { display: flex; align-items: center; gap: 4px; }
.right-info { position: fixed; top: 80px; right: 20px; width: 300px; max-height: calc(100vh - 100px); }
.right-info .panel-title { display: flex; justify-content: space-between; align-items: center; background: linear-gradient(-90deg, rgba(0, 255, 255, 0.08) 0%, transparent 100%); }
.close-btn { background: none; border: none; color: rgba(255, 255, 255, 0.5); font-size: 24px; cursor: pointer; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 6px; transition: all 0.3s ease; flex-shrink: 0; }
.close-btn:hover { color: #ff4444; background: rgba(255, 68, 68, 0.1); }
.device-details { padding: 20px; }
.detail-row { margin-bottom: 14px; display: flex; align-items: center; padding: 10px 12px; background: rgba(0, 255, 255, 0.02); border-radius: 8px; }
.detail-row:last-child { margin-bottom: 0; }
.detail-row .label { color: rgba(255, 255, 255, 0.5); width: 80px; flex-shrink: 0; font-size: 13px; }
.detail-row .value { color: #00ffff; font-size: 14px; font-weight: 500; }
.device-actions { display: flex; gap: 10px; padding: 0 20px 20px; }
.device-actions .btn { flex: 1; font-size: 12px; padding: 10px 8px; border-radius: 8px; transition: all 0.3s ease; }
.device-actions .btn:hover { transform: translateY(-2px); }
.device-actions .btn-primary { background: rgba(0, 150, 255, 0.15); border: 1px solid rgba(0, 150, 255, 0.3); color: #0096ff; }
.device-actions .btn-primary:hover { background: rgba(0, 150, 255, 0.3); }
.device-actions .btn-danger { background: rgba(255, 50, 50, 0.15); border: 1px solid rgba(255, 50, 50, 0.3); color: #ff3232; }
.device-actions .btn-danger:hover { background: rgba(255, 50, 50, 0.3); }
.list-content::-webkit-scrollbar, .left-control::-webkit-scrollbar { width: 4px; }
.list-content::-webkit-scrollbar-track, .left-control::-webkit-scrollbar-track { background: transparent; }
.list-content::-webkit-scrollbar-thumb, .left-control::-webkit-scrollbar-thumb { background: rgba(0, 255, 255, 0.15); border-radius: 2px; }

/* ===== 模态框样式 ===== */
.modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.7); backdrop-filter: blur(4px); z-index: 1000; display: flex; align-items: center; justify-content: center; }
.modal-content { background: rgba(10, 22, 40, 0.95); border: 1px solid rgba(0, 255, 255, 0.15); border-radius: 12px; max-width: 450px; width: 90%; max-height: 80vh; overflow: auto; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5); }

/* (3) 弹窗头部 - 关闭键在右上角 */
.modal-header { display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; border-bottom: 1px solid rgba(0, 255, 255, 0.08); background: linear-gradient(90deg, rgba(0, 255, 255, 0.08) 0%, transparent 100%); }
.modal-title { font-size: 18px; font-weight: bold; color: #00ffff; text-shadow: 0 0 10px rgba(0, 255, 255, 0.3); }
.modal-header .close-btn { margin: -8px -8px -8px 0; }

.modal-body { padding: 20px; }
.modal-body p { color: rgba(255, 255, 255, 0.8); margin-bottom: 16px; }
.warning-text { color: rgba(255, 100, 100, 0.8) !important; font-size: 13px; }

.form-row { margin-bottom: 16px; }
.form-row label { display: block; margin-bottom: 8px; color: rgba(255, 255, 255, 0.7); font-size: 13px; }

/* (3) 下拉框背景色修复 - 深色背景 */
.select-input,
.form-row select,
.form-row input {
  width: 100%;
  background: rgba(10, 30, 60, 0.9) !important;
  border: 1px solid rgba(0, 255, 255, 0.15);
  border-radius: 8px;
  padding: 10px 12px;
  color: #fff !important;
  font-size: 14px;
  transition: all 0.3s ease;
  -webkit-appearance: none;
  appearance: none;
}

.select-input:focus,
.form-row select:focus,
.form-row input:focus {
  border-color: rgba(0, 255, 255, 0.3);
  background: rgba(15, 40, 75, 0.95) !important;
}

/* 下拉选项样式 */
.select-input option,
.form-row select option {
  background: rgba(10, 30, 60, 0.95);
  color: #fff;
  padding: 8px;
}

.modal-footer { display: flex; justify-content: flex-end; gap: 12px; padding: 16px 20px 20px; border-top: 1px solid rgba(0, 255, 255, 0.06); }
.modal-footer .btn { padding: 10px 20px; border-radius: 8px; font-size: 13px; transition: all 0.3s ease; }
.modal-footer .btn:hover { transform: translateY(-2px); }
.modal-footer .btn-danger { background: rgba(255, 50, 50, 0.15) !important; border: 1px solid rgba(255, 50, 50, 0.3) !important; color: #ff3232 !important; }
.modal-footer .btn-danger:hover { background: rgba(255, 50, 50, 0.3) !important; }
</style>