<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <div class="panel-title">
        {{ device.name }}
        <button class="close-btn" @click="$emit('close')">×</button>
      </div>
      
      <div class="device-details">
        <div class="detail-row">
          <span class="label">设备ID：</span>
          <span class="value">{{ device.dtId }}</span>
        </div>
        <div class="detail-row">
          <span class="label">设备类型：</span>
          <span class="value">{{ device.type }}</span>
        </div>
        <div class="detail-row">
          <span class="label">所处位置：</span>
          <span class="value">{{ device.room }}</span>
        </div>
        <div class="detail-row">
          <span class="label">坐标位置：</span>
          <span class="value">[{{ device.location.join(', ') }}]</span>
        </div>
        <div class="detail-row">
          <span class="label">安装日期：</span>
          <span class="value">{{ device.installDate }}</span>
        </div>
        <div class="detail-row">
          <span class="label">设备能耗：</span>
          <span class="value">{{ device.energy || '—' }} kWh</span>
        </div>
        <div class="detail-row">
          <span class="label">设备效益：</span>
          <span class="value">{{ device.benefit || '—' }} 万</span>
        </div>
        <div class="detail-row">
          <span class="label">使用状态：</span>
          <span class="tag" :class="getStatusClass(device.status)">
            {{ device.status }}
          </span>
        </div>
      </div>
      
      <div class="modal-actions" v-if="device.status === '使用中'">
        <button class="btn btn-primary" @click="handleOperate('upgrade')">
          <span class="icon">⬆</span> 设备升级
        </button>
        <button class="btn btn-danger" @click="handleOperate('remove')">
          <span class="icon">✕</span> 设备卸载
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps(['device'])
const emit = defineEmits(['close', 'operate'])

function getStatusClass(status) {
  const map = {
    '使用中': 'tag-success',
    '空闲中': 'tag-warning',
    '维护中': 'tag-danger',
    '已卸载': 'tag-danger',
    '已升级': 'tag-warning'
  }
  return map[status] || ''
}

function handleOperate(action) {
  emit('operate', { device: props.device, action })
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: rgba(10, 22, 40, 0.95);
  border: 1px solid rgba(0, 255, 255, 0.3);
  border-radius: 8px;
  width: 400px;
  max-width: 90%;
}

.close-btn {
  float: right;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  font-size: 24px;
  cursor: pointer;
  line-height: 1;
}

.close-btn:hover {
  color: #ff4444;
}

.device-details {
  padding: 20px;
}

.detail-row {
  margin-bottom: 14px;
  display: flex;
  align-items: center;
}

.detail-row:last-child {
  margin-bottom: 0;
}

.detail-row .label {
  color: rgba(255, 255, 255, 0.6);
  width: 90px;
  flex-shrink: 0;
}

.detail-row .value {
  color: #00ffff;
  flex: 1;
}

.tag {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
}

.tag-success {
  background: rgba(0, 255, 100, 0.2);
  color: #00ff64;
}

.tag-warning {
  background: rgba(255, 165, 0, 0.2);
  color: #ffa500;
}

.tag-danger {
  background: rgba(255, 50, 50, 0.2);
  color: #ff3232;
}

.modal-actions {
  display: flex;
  gap: 12px;
  padding: 0 20px 20px;
}

.modal-actions .btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px;
}

.modal-actions .icon {
  font-size: 18px;
}
</style>
