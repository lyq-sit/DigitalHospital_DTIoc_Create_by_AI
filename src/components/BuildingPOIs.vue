<template>
  <div class="building-pois">
    <div
      v-for="poi in pois"
      :key="poi.id"
      class="poi-marker"
      @click="$emit('focusBuilding', poi.id)"
    >
      <div class="poi-icon">🏢</div>
      <div class="poi-label">{{ poi.name }}</div>
    </div>
  </div>
</template>

<script setup>
defineProps(['pois'])
defineEmits(['focusBuilding'])
</script>

<style scoped>
.building-pois {
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 40px;
  z-index: 50;
}

.poi-marker {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: transform 0.3s;
}

.poi-marker:hover {
  transform: scale(1.1);
}

.poi-icon {
  width: 60px;
  height: 60px;
  background: rgba(0, 255, 255, 0.2);
  border: 2px solid #00ffff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
}

.poi-label {
  margin-top: 8px;
  padding: 4px 12px;
  background: rgba(0, 255, 255, 0.2);
  border: 1px solid #00ffff;
  border-radius: 4px;
  color: #00ffff;
  font-size: 14px;
  white-space: nowrap;
}
</style>
