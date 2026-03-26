<template>
  <div id="app">
    <div id="player"></div>
    <div class="ui-layer">
      <NavBar :currentModule="currentModule" @switchModule="switchModule" />
      <LoadingOverlay v-if="loading" :progress="loadProgress" />
      <template v-if="currentModule === 'overview' && sceneReady">
        <LeftPanel :stats="overviewStats" />
        <RightPanel :stats="overviewStats" />
      </template>
      <template v-if="currentModule === 'space' && sceneReady">
        <SpaceManager
          :buildingData="buildingData" :roomData="roomData" :roomTypes="roomTypes"
          :roomTypeColors="roomTypeColors" :floorEids="floorEids" :floorOffsets="floorOffsets"
          :tourPath="tourPath" @back="switchModule('overview')" @focusRoom="focusRoom"
          @highlightRooms="highlightRooms" @tourPoint="playTourPoint"
          @splitFloor="handleSplitFloor" @resetSplit="handleResetSplit"
          @clearRoomHighlight="clearRoomHighlight"
        />
      </template>
      <template v-if="currentModule === 'device' && sceneReady">
        <DeviceManager
          :devices="allDevices" :presetDevices="presetDevices" :roomData="roomData"
          :pendingSelectDevice="pendingSelectDevice"
          @back="switchModule('overview')" @focusDevice="focusDevice"
          @highlightDevice="highlightDevice" @clearDeviceOutline="clearDeviceOutline"
          @upgradeDevice="upgradeDevice"
          @removeDevice="removeDevice" @addDevice="addDevice"
          @clearPendingSelect="pendingSelectDevice = null"
        />
      </template>
      <DeviceDetailModal v-if="selectedDevice" :device="selectedDevice" @close="selectedDevice = null" @operate="handleDeviceOperate" />
      <!-- 通知弹窗 -->
      <div v-if="notification.show" class="notification-toast" :class="notification.type">
        <span class="notification-icon">{{ notification.type === 'success' ? '✓' : '!' }}</span>
        <span class="notification-text">{{ notification.message }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import './style.css'
import BimApi from '@wdp-api/bim-api'
import NavBar from './components/NavBar.vue'
import LoadingOverlay from './components/LoadingOverlay.vue'
import LeftPanel from './components/LeftPanel.vue'
import RightPanel from './components/RightPanel.vue'
import SpaceManager from './components/SpaceManager.vue'
import DeviceManager from './components/DeviceManager.vue'
import DeviceDetailModal from './components/DeviceDetailModal.vue'
import {
  buildingData, roomData, existingDevices, presetDevices, roomTypes,
  roomTypeColors, floorEids, floorOffsets, tourPath, overviewStats,
} from './data/mockData.js'

const wdpApi = ref(null)
const sceneReady = ref(false)
const loading = ref(true)
const loadProgress = ref(0)
const currentModule = ref('overview')
const selectedDevice = ref(null)
const highlightedRoomId = ref(null)
const f3Entity = ref(null)
const bimPluginInstalled = ref(false)
const outlinedDeviceEid = ref(null)
const pendingSelectDevice = ref(null)
const notification = ref({ show: false, message: '', type: 'success' })

const devicesState = ref([...existingDevices])
const presetDevicesState = ref([...presetDevices])

const allDevices = computed(() => [
  ...devicesState.value,
  ...presetDevicesState.value.filter(p => !p.hidden)
])

function showNotification(message, type = 'success') {
  notification.value = { show: true, message, type }
  setTimeout(() => { notification.value.show = false }, 3000)
}

onMounted(() => { initWdpScene() })
onUnmounted(() => { if (wdpApi.value) wdpApi.value.dispose() })

async function initWdpScene() {
  try {
    if (typeof window.WdpApi === 'undefined') { loading.value = false; return }
    wdpApi.value = new window.WdpApi({ id: 'player', url: 'https://dtp-api.51aes.com', order: 'xxxxxxxxxxxxxxxx' })   // your WDP Render Code
    await wdpApi.value.System.SetDefaultBrowserFunctionKeyboard(true)
    await wdpApi.value.System.SetTimeoutTime(30000)
    await wdpApi.value.Renderer.RegisterEvent([
      { name: 'onVideoReady', func: () => console.log('视频流已就绪') },
      { name: 'onRenderCloudConnected', func: () => console.log('云渲染已连接') }
    ])
    await wdpApi.value.Renderer.RegisterSceneEvent([
      {
        name: 'OnWdpSceneIsReady',
        func: async (res) => {
          const progress = res?.result?.progress || 0
          loadProgress.value = progress
          if (progress === 100 && !sceneReady.value) {
            sceneReady.value = true; loading.value = false
            await installBimPlugin(); await cacheF3Entity(); await flyToOverview(); await initPresetDevices()
          }
        }
      },
      {
        name: 'OnEntityClicked',
        func: async (res) => { handleSceneEntityClick(res) }
      }
    ])
    const startRes = await wdpApi.value.Renderer.Start()
    if (!startRes.success) throw new Error(`Renderer.Start 失败: ${startRes.message}`)
  } catch (error) { console.error('Init error:', error); loading.value = false }
}

async function installBimPlugin() {
  if (!wdpApi.value) return
  try {
    const res = await wdpApi.value.Plugin.Install(BimApi)
    if (res.success) { bimPluginInstalled.value = true; console.log('BIM 插件安装成功') }
    else console.error('BIM 插件安装失败:', res.message)
  } catch (error) { console.error('安装 BIM 插件错误:', error) }
}

async function cacheF3Entity() {
  if (!wdpApi.value) return
  try {
    const getRes = await wdpApi.value.Scene.GetByEids([floorEids.F3])
    if (getRes.success && getRes.result?.length > 0) f3Entity.value = getRes.result[0]
  } catch (error) { console.error('缓存F3实体失败:', error) }
}

async function initPresetDevices() {
  for (const device of presetDevicesState.value) { device.hidden = true; await hideEntity(device.eid) }
}

function switchModule(module) {
  currentModule.value = module
  if (module === 'overview') { flyToOverview(); showAllFloors() }
  else if (module === 'device') enterDeviceManagement()
}

async function flyToOverview() {
  if (!wdpApi.value) return
  try { await wdpApi.value.CameraControl.FlyTo({ targetPosition: [252, -145, 68], rotation: { pitch: -20, yaw: -152 }, flyTime: 2 }) } catch (e) { console.error(e) }
}

async function playTourPoint(point) {
  if (!wdpApi.value) return
  try { await wdpApi.value.CameraControl.FlyTo({ targetPosition: point.pos, rotation: { pitch: point.pitch, yaw: point.yaw }, flyTime: point.duration }) } catch (e) { console.error(e) }
}

async function handleSplitFloor(floor) {
  if (!wdpApi.value || floor !== 'F3') return
  await focusBuildingFloor(floorEids.F3)
  for (const [key, eid] of Object.entries(floorEids)) { if (key !== 'F3') await hideEntity(eid) }
}

async function handleResetSplit() { await flyToOverview(); await showAllFloors() }

// (1) 聚焦房间 - 支持取消高亮
async function focusRoom(room) {
  if (!wdpApi.value || !f3Entity.value) return
  try {
    if (highlightedRoomId.value === room.roomId) {
      await clearRoomHighlight(room.roomId)
      highlightedRoomId.value = null
      return
    }
    if (highlightedRoomId.value) await clearRoomHighlight(highlightedRoomId.value)
    highlightedRoomId.value = room.roomId
    await handleSplitFloor('F3')
    await wdpApi.value.CameraControl.FlyTo({ targetPosition: [room.location[0], room.location[1], room.location[2] + 8], rotation: { pitch: -90, yaw: 0 }, flyTime: 1.5 })
    await highlightRoom(room.roomId, 'FFFF0033')
  } catch (error) { console.error('FocusRoom 错误:', error) }
}

async function highlightRoom(roomId, color) {
  if (!f3Entity.value) return
  try {
    const res = await f3Entity.value.SetRoomHighLight({ roomIds: [String(roomId)], bVisible: true, colorStyle: { color, opacity: 0.2, bCanBeOccluded: false } })
    if (!res.success) console.error('SetRoomHighLight 失败:', res.message)
  } catch (error) { console.error('高亮房间错误:', error) }
}

async function clearRoomHighlight(roomId) {
  if (!f3Entity.value) return
  try {
    await f3Entity.value.SetRoomHighLight({ roomIds: [String(roomId)], bVisible: false, colorStyle: { color: 'FFFF0033', opacity: 0.2, bCanBeOccluded: false } })
  } catch (error) { console.error('清除高亮错误:', error) }
}

function highlightRooms(rooms, color) { console.log('高亮房间组:', rooms) }

// 场景中点击实体 → 匹配设备后通知 DeviceManager 选中
async function handleSceneEntityClick(res) {
  if (currentModule.value !== 'device') return
  try {
    const result = res?.result
    if (!result) return
    let clickedId = null
    // 优先从 object.Get() 获取实体 eid（object 是实体对象引用，非普通对象）
    if (result.object) {
      try {
        const info = await result.object.Get()
        console.log('[设备点击] object.Get() 返回:', info)
        clickedId = info?.result?.eid || info?.result?.Eid || info?.eid || info?.Eid
      } catch (e) {
        console.warn('[设备点击] object.Get() 失败:', e)
      }
    }
    // 回退到 nodeId（部分场景下 nodeId 可能等于 eid）
    if (!clickedId) clickedId = result.nodeId
    console.log('[设备点击] OnEntityClicked result:', result, '匹配ID:', clickedId)
    if (!clickedId) return
    const device = allDevices.value.find(d => String(d.eid) === String(clickedId) && d.status !== '已卸载')
    if (device) {
      console.log('[设备点击] 匹配成功:', device.name)
      pendingSelectDevice.value = device
    } else {
      console.log('[设备点击] 未匹配到设备，点击ID:', clickedId, '设备eids:', allDevices.value.filter(d => d.status !== '已卸载').map(d => d.eid))
    }
  } catch (error) { console.error('场景点击处理错误:', error) }
}

// (2) 设备描边 - 使用 SetEntityOutline
async function highlightDevice(device) {
  if (!wdpApi.value) return
  try {
    if (outlinedDeviceEid.value) await clearDeviceOutline(null)
    const getRes = await wdpApi.value.Scene.GetByEids([device.eid])
    if (!getRes.success || !getRes.result?.length) return
    const entity = getRes.result[0]
    await entity.SetEntityOutline({ bOutline: true, styleName: 'Blue' })
    outlinedDeviceEid.value = device.eid
  } catch (error) { console.error('设备描边错误:', error) }
}

async function clearDeviceOutline(_device) {
  if (!wdpApi.value || !outlinedDeviceEid.value) return
  try {
    const getRes = await wdpApi.value.Scene.GetByEids([outlinedDeviceEid.value])
    if (getRes.success && getRes.result?.length) {
      await getRes.result[0].SetEntityOutline({ bOutline: false, styleName: 'Blue' })
    }
    outlinedDeviceEid.value = null
  } catch (error) { console.error('清除描边错误:', error) }
}

async function focusDevice(device) {
  if (!wdpApi.value) return
  try {
    const getRes = await wdpApi.value.Scene.GetByEids([device.eid])
    if (!getRes.success || !getRes.result?.length) return
    await wdpApi.value.CameraControl.Focus({ entity: [getRes.result[0]], rotation: { pitch: -45, yaw: -152 }, distanceFactor: 0.4, flyTime: 1 })
  } catch (error) { console.error('FocusDevice 错误:', error) }
}

async function showAllFloors() {
  if (!wdpApi.value) return
  for (const eid of Object.values(floorEids)) {
    try { const r = await wdpApi.value.Scene.GetByEids([eid]); if (r.success && r.result?.length) await r.result[0].SetVisible(true) } catch (e) { console.error(e) }
  }
}

async function enterDeviceManagement() {
  if (!wdpApi.value) return
  await focusBuildingFloor(floorEids.F3)
  for (const [key, eid] of Object.entries(floorEids)) { if (key !== 'F3') await hideEntity(eid) }
}

async function focusBuildingFloor(eid) {
  if (!wdpApi.value) return
  try {
    const r = await wdpApi.value.Scene.GetByEids([eid]); if (!r.success || !r.result?.length) return
    await wdpApi.value.CameraControl.Focus({ entity: [r.result[0]], rotation: { pitch: -45, yaw: -152 }, distanceFactor: 0.6, flyTime: 1.5 })
  } catch (e) { console.error(e) }
}

async function showEntity(eid) {
  if (!wdpApi.value) return
  try { const r = await wdpApi.value.Scene.GetByEids([eid]); if (r.success && r.result?.length) await r.result[0].SetVisible(true) } catch (e) { console.error(e) }
}

async function hideEntity(eid) {
  if (!wdpApi.value) return
  try { const r = await wdpApi.value.Scene.GetByEids([eid]); if (r.success && r.result?.length) await r.result[0].SetVisible(false) } catch (e) { console.error(e) }
}

// (5) 修复设备升级 - 支持存量设备和预设设备
function upgradeDevice(device, upgradeType) {
  const upgradePreset = presetDevicesState.value.find(
    p => p.type === upgradeType && p.room === device.room
  )
  if (upgradePreset) {
    hideEntity(device.eid)
    const deviceIndex = devicesState.value.findIndex(d => d.dtId === device.dtId)
    if (deviceIndex > -1) {
      devicesState.value[deviceIndex].status = '已升级'
      devicesState.value[deviceIndex].name = upgradePreset.name
      devicesState.value[deviceIndex].type = upgradeType
    } else {
      const presetIndex = presetDevicesState.value.findIndex(d => d.dtId === device.dtId)
      if (presetIndex > -1) {
        presetDevicesState.value[presetIndex].status = '已升级'
        presetDevicesState.value[presetIndex].name = upgradePreset.name
        presetDevicesState.value[presetIndex].type = upgradeType
      }
    }
    upgradePreset.hidden = false
    showEntity(upgradePreset.eid)
    showNotification(`设备 "${device.name}" 已升级为 ${upgradeType}`, 'success')
  } else {
    showNotification(`未找到可用的${upgradeType}预设设备`, 'error')
  }
}

// (7) 修复设备卸载 - 支持存量设备和预设设备
function removeDevice(device) {
  hideEntity(device.eid)
  const deviceIndex = devicesState.value.findIndex(d => d.dtId === device.dtId)
  if (deviceIndex > -1) {
    devicesState.value[deviceIndex].status = '已卸载'
  } else {
    const presetIndex = presetDevicesState.value.findIndex(d => d.dtId === device.dtId)
    if (presetIndex > -1) presetDevicesState.value[presetIndex].status = '已卸载'
  }
  showNotification(`设备 "${device.name}" 已卸载`, 'success')
}

// (4) 修复新增设备 - 直接修改预设属性，避免列表重复
function addDevice(room, deviceType) {
  const preset = presetDevicesState.value.find(
    p => p.type === deviceType && p.room === room.name && p.hidden
  )
  if (preset) {
    preset.hidden = false
    preset.installDate = new Date().toISOString().split('T')[0].replace(/-/g, '.')
    preset.energy = null
    preset.benefit = null
    preset.status = '使用中'
    showEntity(preset.eid)
    pendingSelectDevice.value = preset
    showNotification(`已在 ${room.name} 新增 ${deviceType}`, 'success')
  } else {
    showNotification(`${room.name} 没有可用的${deviceType}预设`, 'error')
  }
}

function handleDeviceOperate({ device, action }) {
  selectedDevice.value = null
  switch (action) {
    case 'upgrade': console.log('Upgrade device:', device); break
    case 'remove': removeDevice(device); break
  }
}
</script>

<style scoped>
#app { width: 100vw; height: 100vh; position: relative; overflow: hidden; }
.ui-layer { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; }

.notification-toast {
  position: fixed; top: 80px; left: 50%; transform: translateX(-50%);
  pointer-events: auto;
  padding: 14px 28px; border-radius: 10px; font-size: 14px; color: #fff;
  display: flex; align-items: center; gap: 10px; z-index: 2000;
  backdrop-filter: blur(8px); animation: slideDown 0.3s ease;
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
}
.notification-toast.success {
  background: rgba(0, 200, 100, 0.25); border: 1px solid rgba(0, 255, 100, 0.3);
}
.notification-toast.error {
  background: rgba(255, 60, 60, 0.25); border: 1px solid rgba(255, 80, 80, 0.3);
}
.notification-icon {
  width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center;
  justify-content: center; font-size: 14px; font-weight: bold;
}
.notification-toast.success .notification-icon { background: rgba(0,255,100,0.2); color: #00ff64; }
.notification-toast.error .notification-icon { background: rgba(255,80,80,0.2); color: #ff5050; }
.notification-text { color: rgba(255,255,255,0.9); }

@keyframes slideDown {
  from { opacity: 0; transform: translateX(-50%) translateY(-20px); }
  to { opacity: 1; transform: translateX(-50%) translateY(0); }
}
</style>