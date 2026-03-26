<template>
  <div class="space-manager">
    <button class="back-btn btn" @click="$emit('back')">← 返回综合首页</button>
    <div class="left-control panel">
      <div class="panel-title">空间管理</div>
      <div class="section">
        <div class="section-title">环境导览</div>
        <button class="btn btn-primary" style="width: 100%;" @click="startTour" :disabled="touring">{{ touring ? '导览中...' : '开始环境导览' }}</button>
        <button v-if="touring" class="btn btn-danger" style="width: 100%; margin-top: 8px;" @click="stopTour">停止导览</button>
      </div>
      <div class="section">
        <div class="section-title">楼宇拆解</div>
        <button class="btn btn-primary" style="width: 100%;" @click="startBuildingSplit" :disabled="splitting">{{ splitting ? '拆解中...' : '门诊楼拆解' }}</button>
        <div v-if="splitting" class="floor-buttons">
          <button v-for="floor in ['F1', 'F2', 'F3', 'F4']" :key="floor" class="floor-btn" :class="{ active: selectedFloor === floor, disabled: floor !== 'F3' }" :disabled="floor !== 'F3'" @click="handleFloorClick(floor)">{{ floor }}</button>
        </div>
      </div>
      <div class="section">
        <div class="section-title">房间管理</div>
        <div class="room-filters">
          <button v-for="type in roomTypes" :key="type" class="filter-btn" :class="{ active: selectedRoomType === type }" @click="filterRooms(type)" :style="getRoomTypeStyle(type)">{{ type }}</button>
          <button class="filter-btn" :class="{ active: selectedRoomType === null }" @click="filterRooms(null)">全部</button>
        </div>
      </div>
    </div>
    <div v-if="showRoomInfo" class="right-info panel">
      <div class="panel-title">
        {{ selectedRoom ? selectedRoom.name : '楼层信息' }}
        <button class="close-btn" @click="showRoomInfo = false">×</button>
      </div>
      <div v-if="selectedRoom" class="room-details">
        <div class="detail-row"><span class="label">类型：</span><span class="value">{{ selectedRoom.type }}</span></div>
        <div class="detail-row"><span class="label">面积：</span><span class="value">{{ selectedRoom.area }} ㎡</span></div>
        <div class="detail-row"><span class="label">所属部门：</span><span class="value">{{ selectedRoom.dept }}</span></div>
        <div class="detail-row"><span class="label">能耗：</span><span class="value">{{ selectedRoom.energy }} kWh</span></div>
        <div class="detail-row"><span class="label">设备：</span><div class="device-list"><span v-for="device in selectedRoom.devices" :key="device" class="device-tag">{{ device }}</span></div></div>
      </div>
      <div v-else-if="selectedFloor" class="floor-details">
        <div class="detail-row"><span class="label">楼层：</span><span class="value">{{ selectedFloor }}</span></div>
        <div class="detail-row"><span class="label">房间数：</span><span class="value">{{ getFloorRoomCount(selectedFloor) }} 间</span></div>
      </div>
    </div>
    <div v-if="filteredRooms.length > 0" class="room-list panel">
      <div class="panel-title">房间列表 ({{ filteredRooms.length }})</div>
      <div class="list-content">
        <div v-for="room in filteredRooms" :key="room.dtId" class="list-item" :class="{ active: selectedRoom?.dtId === room.dtId }" @click="selectRoom(room)">
          <div class="room-name">{{ room.name }}</div>
          <div class="room-info">
            <span class="tag" :style="getRoomTypeStyle(room.type)">{{ room.type }}</span>
            <span class="room-area">{{ room.area }}㎡</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps([
  'buildingData', 'roomData', 'roomTypes', 'roomTypeColors',
  'floorEids', 'floorOffsets', 'tourPath'
])
const emit = defineEmits(['back', 'focusRoom', 'highlightRooms', 'tourPoint', 'splitFloor', 'resetSplit', 'clearRoomHighlight'])

const touring = ref(false)
const splitting = ref(false)
const selectedFloor = ref(null)
const selectedRoomType = ref(null)
const selectedRoom = ref(null)
const showRoomInfo = ref(false)
const tourIndex = ref(0)
let tourTimer = null

const filteredRooms = computed(() => {
  if (!selectedRoomType.value) return props.roomData
  return props.roomData.filter(r => r.type === selectedRoomType.value)
})

function getRoomTypeStyle(type) {
  const colors = { '手术室': '#ff4444', '彩超室': '#44ff44', 'CT室': '#4444ff', '配电室': '#ffaa00' }
  return { background: colors[type] ? `${colors[type]}33` : 'rgba(128,128,128,0.2)', borderColor: colors[type] || '#888', color: colors[type] || '#888' }
}

function startTour() { touring.value = true; tourIndex.value = 0; playTourPath() }

function playTourPath() {
  if (!touring.value || tourIndex.value >= props.tourPath.length) { stopTour(); return }
  const point = props.tourPath[tourIndex.value]
  emit('tourPoint', point)
  tourTimer = setTimeout(() => { tourIndex.value++; playTourPath() }, point.duration * 1000)
}

function stopTour() { touring.value = false; if (tourTimer) { clearTimeout(tourTimer); tourTimer = null } }

function startBuildingSplit() { splitting.value = true; selectedFloor.value = null }

function handleFloorClick(floor) {
  if (floor !== 'F3') return
  if (selectedFloor.value === 'F3') { selectedFloor.value = null; showRoomInfo.value = false; emit('resetSplit') }
  else { selectedFloor.value = 'F3'; showRoomInfo.value = true; emit('splitFloor', 'F3') }
}

function filterRooms(type) {
  selectedRoomType.value = type
  if (type) { const rooms = props.roomData.filter(r => r.type === type); emit('highlightRooms', rooms, props.roomTypeColors[type]) }
}

// (1) 点击已选中的房间取消高亮
function selectRoom(room) {
  if (selectedRoom.value?.dtId === room.dtId) {
    // 再次点击同一房间 - 取消高亮
    emit('clearRoomHighlight', room.roomId)
    selectedRoom.value = null
    showRoomInfo.value = false
  } else {
    selectedRoom.value = room
    showRoomInfo.value = true
    emit('focusRoom', room)
    emit('highlightRooms', [room], props.roomTypeColors[room.type])
  }
}

function getFloorRoomCount(floor) { return floor === 'F3' ? props.roomData.length : 0 }
</script>

<style scoped>
.space-manager { position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; }
.space-manager > * { pointer-events: auto; }
.panel { background: rgba(10, 22, 40, 0.25); border: 1px solid rgba(0, 255, 255, 0.1); border-radius: 12px; backdrop-filter: blur(4px); display: flex; flex-direction: column; overflow: hidden; }
.panel-title { font-size: 18px; font-weight: bold; color: #00ffff; text-shadow: 0 0 10px rgba(0, 255, 255, 0.3); padding: 16px 20px; border-bottom: 1px solid rgba(0, 255, 255, 0.08); background: linear-gradient(90deg, rgba(0, 255, 255, 0.08) 0%, transparent 100%); }
.back-btn { position: fixed; top: 80px; left: 20px; z-index: 101; background: rgba(0, 255, 255, 0.08); border: 1px solid rgba(0, 255, 255, 0.15); color: #00ffff; padding: 10px 20px; border-radius: 8px; font-size: 14px; transition: all 0.3s ease; }
.back-btn:hover { background: rgba(0, 255, 255, 0.15); border-color: rgba(0, 255, 255, 0.3); transform: translateY(-2px); }
.left-control { position: fixed; top: 130px; left: 20px; width: 300px; max-height: calc(100vh - 160px); }
.section { padding: 16px 20px; border-bottom: 1px solid rgba(0, 255, 255, 0.06); }
.section:last-child { border-bottom: none; }
.section-title { font-size: 13px; color: rgba(255, 255, 255, 0.8); font-weight: 500; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
.section-title::before { content: ''; width: 3px; height: 14px; background: linear-gradient(180deg, #00ffff, rgba(0, 255, 255, 0.3)); border-radius: 2px; }
.section .btn-primary { width: 100%; background: rgba(0, 150, 255, 0.15); border: 1px solid rgba(0, 150, 255, 0.3); color: #0096ff; padding: 12px; border-radius: 8px; font-size: 14px; transition: all 0.3s ease; margin-bottom: 8px; }
.section .btn-primary:last-child { margin-bottom: 0; }
.section .btn-primary:hover:not(:disabled) { background: rgba(0, 150, 255, 0.3); transform: translateY(-2px); }
.section .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
.section .btn-danger { width: 100%; background: rgba(255, 50, 50, 0.15); border: 1px solid rgba(255, 50, 50, 0.3); color: #ff3232; padding: 12px; border-radius: 8px; font-size: 14px; transition: all 0.3s ease; }
.section .btn-danger:hover { background: rgba(255, 50, 50, 0.3); transform: translateY(-2px); }
.floor-buttons { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-top: 12px; }
.floor-btn { padding: 10px; background: rgba(0, 255, 255, 0.03); border: 1px solid rgba(0, 255, 255, 0.1); color: rgba(255, 255, 255, 0.7); border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 500; transition: all 0.3s ease; }
.floor-btn:hover:not(:disabled) { background: rgba(0, 255, 255, 0.08); border-color: rgba(0, 255, 255, 0.2); }
.floor-btn.active { background: rgba(0, 255, 255, 0.15); border-color: rgba(0, 255, 255, 0.3); color: #00ffff; box-shadow: 0 0 10px rgba(0, 255, 255, 0.1); }
.floor-btn:disabled { opacity: 0.3; cursor: not-allowed; background: rgba(128, 128, 128, 0.1); border-color: rgba(128, 128, 128, 0.2); color: rgba(255, 255, 255, 0.3); }
.room-filters { display: flex; flex-wrap: wrap; gap: 8px; }
.filter-btn { padding: 8px 14px; background: rgba(0, 255, 255, 0.03); border: 1px solid rgba(0, 255, 255, 0.1); color: rgba(255, 255, 255, 0.7); border-radius: 20px; cursor: pointer; font-size: 12px; font-weight: 500; transition: all 0.3s ease; }
.filter-btn:hover { background: rgba(0, 255, 255, 0.06); border-color: rgba(0, 255, 255, 0.2); }
.filter-btn.active { background: rgba(0, 255, 255, 0.1); border-color: rgba(0, 255, 255, 0.3); color: #00ffff; }
.right-info { position: fixed; top: 80px; right: 20px; width: 300px; max-height: calc(100vh - 100px); }
.right-info .panel-title { display: flex; justify-content: space-between; align-items: center; background: linear-gradient(-90deg, rgba(0, 255, 255, 0.08) 0%, transparent 100%); }
.close-btn { background: none; border: none; color: rgba(255, 255, 255, 0.5); font-size: 24px; cursor: pointer; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 6px; transition: all 0.3s ease; }
.close-btn:hover { color: #ff4444; background: rgba(255, 68, 68, 0.1); }
.room-details, .floor-details { padding: 20px; }
.detail-row { margin-bottom: 14px; display: flex; align-items: center; padding: 10px 12px; background: rgba(0, 255, 255, 0.02); border-radius: 8px; }
.detail-row:last-child { margin-bottom: 0; }
.detail-row .label { color: rgba(255, 255, 255, 0.5); width: 80px; flex-shrink: 0; font-size: 13px; }
.detail-row .value { color: #00ffff; font-size: 14px; font-weight: 500; }
.device-list { display: flex; flex-wrap: wrap; gap: 8px; flex: 1; }
.device-tag { padding: 4px 10px; background: rgba(0, 255, 255, 0.08); border: 1px solid rgba(0, 255, 255, 0.15); border-radius: 12px; font-size: 11px; color: #00ffff; }
.room-list { position: fixed; top: 80px; right: 340px; width: 320px; height: calc(100vh - 100px); }
.room-list .panel-title { background: linear-gradient(90deg, rgba(0, 255, 255, 0.08) 0%, transparent 100%); }
.list-content { flex: 1; overflow-y: auto; padding: 12px; }
.list-item { padding: 14px 16px; margin-bottom: 10px; background: rgba(0, 255, 255, 0.03); border: 1px solid rgba(0, 255, 255, 0.06); border-radius: 10px; cursor: pointer; transition: all 0.3s ease; }
.list-item:last-child { margin-bottom: 0; }
.list-item:hover { background: rgba(0, 255, 255, 0.06); border-color: rgba(0, 255, 255, 0.12); transform: translateX(-4px); }
.list-item.active { background: rgba(0, 255, 255, 0.1); border-color: rgba(0, 255, 255, 0.2); box-shadow: 0 0 15px rgba(0, 255, 255, 0.1); }
.room-name { font-size: 15px; font-weight: 600; color: #fff; margin-bottom: 8px; }
.room-info { display: flex; gap: 10px; align-items: center; }
.room-area { font-size: 12px; color: rgba(255, 255, 255, 0.5); }
.tag { padding: 3px 10px; border-radius: 12px; font-size: 11px; font-weight: 500; border: 1px solid; }
.list-content::-webkit-scrollbar, .left-control::-webkit-scrollbar { width: 4px; }
.list-content::-webkit-scrollbar-track, .left-control::-webkit-scrollbar-track { background: transparent; }
.list-content::-webkit-scrollbar-thumb, .left-control::-webkit-scrollbar-thumb { background: rgba(0, 255, 255, 0.15); border-radius: 2px; }
.list-content::-webkit-scrollbar-thumb:hover, .left-control::-webkit-scrollbar-thumb:hover { background: rgba(0, 255, 255, 0.3); }
</style>