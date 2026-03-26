// 楼宇台账数据
export const buildingData = [
  { dtId: 10001, name: '门诊F1', eid: '-9150751316199235648', building: '门诊部', area: 209.49, rooms: 12, utilization: 85 },
  { dtId: 10002, name: '门诊F2', eid: '-9150751316199237814', building: '门诊部', area: 187.25, rooms: 15, utilization: 91 },
  { dtId: 10003, name: '门诊F3', eid: '-9150751316199240314', building: '门诊部', area: 209.49, rooms: 18, utilization: 95 },
  { dtId: 10004, name: '门诊F4', eid: '-9150751316199244348', building: '门诊部', area: 187.25, rooms: 13, utilization: 88 },
  { dtId: 10005, name: '门诊Roof', eid: '-9150751316199286231', building: '门诊部', area: 148.02, rooms: 3, utilization: 47 },
]

// 房间台账数据
export const roomData = [
  { dtId: 10006, name: '手术室01', elementId: 3167369, roomId: 2047, location: [147.58, -130.92, 27.19], area: 30.71, dept: '普外科', energy: 1472, type: '手术室', devices: ['手术台1', '呼吸机1'] },
  { dtId: 10007, name: '配电室01', elementId: 3167347, roomId: 2034, location: [161.72, -145.10, 27.19], area: 11.05, dept: '后勤管理部', energy: 426, type: '配电室', devices: ['配电柜1', '配电柜2', '配电柜3', '配电柜4'] },
  { dtId: 10008, name: '手术室02', elementId: 3167343, roomId: 2033, location: [161.71, -132.20, 27.19], area: 26.17, dept: '普外科', energy: 1525, type: '手术室', devices: ['手术台2', '呼吸机2'] },
  { dtId: 10009, name: '彩超室01', elementId: 3167349, roomId: 2036, location: [161.71, -110.22, 27.19], area: 22.44, dept: '内科', energy: 305, type: '彩超室', devices: ['诊疗床1', '彩超仪1'] },
  { dtId: 10010, name: '手术室03', elementId: 3167329, roomId: 2016, location: [174.35, -120.31, 27.19], area: 23.45, dept: '心胸外科', energy: 1864, type: '手术室', devices: ['手术台3', '呼吸机3'] },
  { dtId: 10011, name: '配电室02', elementId: 3167520, roomId: 2018, location: [145.59, -45.87, 27.19], area: 12.71, dept: '后勤管理部', energy: 318, type: '配电室', devices: ['配电柜5', '配电柜6', '配电柜7', '配电柜8'] },
  { dtId: 10012, name: '彩超室02', elementId: 3167504, roomId: 2070, location: [162.35, -72.23, 27.19], area: 20.18, dept: '妇科', energy: 400, type: '彩超室', devices: ['诊疗床2', '彩超仪2'] },
  { dtId: 10013, name: 'CT室01', elementId: 3167500, roomId: 2069, location: [162.39, -56.56, 27.19], area: 21.57, dept: '放射线科', energy: 500, type: 'CT室', devices: ['核磁共振1'] },
  { dtId: 10014, name: '彩超室03', elementId: 3167498, roomId: 2068, location: [173.83, -61.47, 27.19], area: 21.05, dept: '普外科', energy: 316, type: '彩超室', devices: ['诊疗床3', '彩超仪3'] },
  { dtId: 10015, name: 'CT室02', elementId: 3167480, roomId: 2065, location: [166.93, -44.22, 27.19], area: 20.16, dept: '放射线科', energy: 526, type: 'CT室', devices: ['核磁共振2'] },
]

// 空闲房间
export const idleRooms = [
  { dtId: 10038, name: '房间001', roomId: 2046, location: [146.86, -121.51, 27.19] },
  { dtId: 10039, name: '房间002', roomId: 2035, location: [161.71, -123.83, 27.19] },
]

// 存量设备台账（初始可见）
export const existingDevices = [
  { dtId: 10016, name: '核磁共振机1', eid: '-9150469841133242715', location: [160.62, -55.39, 25.43], room: 'CT室01', installDate: '2025.08.15', energy: 300, benefit: 300, status: '使用中', type: '核磁共振机' },
  { dtId: 10017, name: '核磁共振机2', eid: '-9151032791025589942', location: [168.77, -42.59, 24.99], room: 'CT室02', installDate: '2025.08.15', energy: 200, benefit: 200, status: '使用中', type: '核磁共振机' },
  { dtId: 10018, name: '彩超仪1', eid: '-9150469841133235582', location: [159.10, -109.10, 24.64], room: '彩超室01', installDate: '2025.08.14', energy: 100, benefit: 100, status: '使用中', type: '彩超仪' },
  { dtId: 10019, name: '彩超仪2', eid: '-9151032791025478672', location: [159.55, -72.47, 25.04], room: '彩超室02', installDate: '2025.08.14', energy: 100, benefit: 100, status: '使用中', type: '彩超仪' },
  { dtId: 10020, name: '彩超仪3', eid: '-9151030592002120283', location: [170.72, -56.06, 25.16], room: '彩超室03', installDate: '2025.08.14', energy: 100, benefit: 100, status: '使用中', type: '彩超仪' },
  { dtId: 10021, name: '呼吸机1', eid: '-9150469841133229682', location: [144.66, -130.02, 25.36], room: '手术室01', installDate: '2025.08.13', energy: 150, benefit: 150, status: '使用中', type: '呼吸机' },
  { dtId: 10022, name: '呼吸机2', eid: '-9151032791027229389', location: [159.36, -130.92, 25.00], room: '手术室02', installDate: '2025.08.13', energy: 150, benefit: 150, status: '使用中', type: '呼吸机' },
  { dtId: 10023, name: '呼吸机3', eid: '-9151030592004226254', location: [173.58, -114.19, 25.25], room: '手术室03', installDate: '2025.08.13', energy: 150, benefit: 150, status: '使用中', type: '呼吸机' },
  { dtId: 10024, name: '手术台1', eid: '-9150469841133232515', location: [145.71, -134.13, 25.25], room: '手术室01', installDate: '2025.08.12', energy: 20, benefit: 20, status: '使用中', type: '手术台' },
  { dtId: 10025, name: '手术台2', eid: '-9151030592003973837', location: [160.00, -135.12, 25.06], room: '手术室02', installDate: '2025.08.12', energy: 20, benefit: 20, status: '使用中', type: '手术台' },
  { dtId: 10026, name: '手术台3', eid: '-9151032791027481806', location: [174.38, -118.69, 25.33], room: '手术室03', installDate: '2025.08.12', energy: 20, benefit: 20, status: '使用中', type: '手术台' },
  { dtId: 10027, name: '诊疗床1', eid: '-9150469841133238982', location: [161.77, -106.14, 24.09], room: '彩超室01', installDate: '2025.08.11', energy: 0, benefit: 20, status: '使用中', type: '诊疗床' },
  { dtId: 10028, name: '诊疗床2', eid: '-9151030592002223120', location: [162.22, -74.90, 24.41], room: '彩超室02', installDate: '2025.08.11', energy: 0, benefit: 20, status: '使用中', type: '诊疗床' },
  { dtId: 10029, name: '诊疗床3', eid: '-9151032791025375835', location: [173.45, -53.64, 24.51], room: '彩超室03', installDate: '2025.08.11', energy: 0, benefit: 20, status: '使用中', type: '诊疗床' },
  { dtId: 10030, name: '配电柜1', eid: '-9151032791027053417', location: [159.15, -147.70, 25.00], room: '配电室01', installDate: '2025.08.10', energy: 600, benefit: 100, status: '使用中', type: '配电柜' },
  { dtId: 10031, name: '配电柜2', eid: '-9151032791025927496', location: [159.20, -142.83, 25.00], room: '配电室01', installDate: '2025.08.10', energy: 600, benefit: 100, status: '使用中', type: '配电柜' },
  { dtId: 10032, name: '配电柜3', eid: '-9151032791026931173', location: [161.48, -147.66, 25.00], room: '配电室01', installDate: '2025.08.10', energy: 600, benefit: 100, status: '使用中', type: '配电柜' },
  { dtId: 10033, name: '配电柜4', eid: '-9151032791025997998', location: [161.45, -142.79, 25.00], room: '配电室01', installDate: '2025.08.10', energy: 600, benefit: 100, status: '使用中', type: '配电柜' },
  { dtId: 10034, name: '配电柜5', eid: '-9151026193956009058', location: [144.19, -47.16, 25.00], room: '配电室02', installDate: '2025.08.10', energy: 600, benefit: 100, status: '使用中', type: '配电柜' },
  { dtId: 10035, name: '配电柜6', eid: '-9151028392979264610', location: [144.24, -42.29, 25.00], room: '配电室02', installDate: '2025.08.10', energy: 600, benefit: 100, status: '使用中', type: '配电柜' },
  { dtId: 10036, name: '配电柜7', eid: '-9151032791025775714', location: [146.51, -47.11, 25.00], room: '配电室02', installDate: '2025.08.10', energy: 600, benefit: 100, status: '使用中', type: '配电柜' },
  { dtId: 10037, name: '配电柜8', eid: '-9151030592002520162', location: [146.49, -42.25, 25.00], room: '配电室02', installDate: '2025.08.10', energy: 600, benefit: 100, status: '使用中', type: '配电柜' },
]

// 预置设备台账（初始隐藏，用于新增/升级）
export const presetDevices = [
  { dtId: 10038, name: '新型诊疗床1', eid: '-9150751315692797689', location: [175.60, -68.20, 24.69], room: '彩超室01', type: '新型诊疗床' },
  { dtId: 10039, name: '新型诊疗床2', eid: '-9150751315691667478', location: [161.51, -68.75, 24.62], room: '彩超室02', type: '新型诊疗床' },
  { dtId: 10040, name: '新型诊疗床3', eid: '-9150751315691581342', location: [175.60, -68.20, 24.66], room: '彩超室03', type: '新型诊疗床' },
  { dtId: 10041, name: 'X射线机1', eid: '-9150751315692279337', location: [149.49, -134.05, 25.59], room: '手术室01', type: 'X射线机' },
  { dtId: 10042, name: 'X射线机2', eid: '-9150751315692563013', location: [163.59, -135.11, 25.10], room: '手术室02', type: 'X射线机' },
  { dtId: 10043, name: 'X射线机3', eid: '-9150751315692192587', location: [171.95, -120.96, 25.18], room: '手术室03', type: 'X射线机' },
  { dtId: 10044, name: '手术机器人1', eid: '-9150751315692607348', location: [147.51, -130.70, 25.36], room: '手术室01', type: '手术机器人' },
  { dtId: 10045, name: '手术机器人2', eid: '-9150751315691932619', location: [161.89, -131.51, 24.92], room: '手术室02', type: '手术机器人' },
  { dtId: 10046, name: '手术机器人3', eid: '-9150751315691867284', location: [176.11, -115.70, 25.13], room: '手术室03', type: '手术机器人' },
  { dtId: 10047, name: '新型核磁共振机1', eid: '-9150751315692705152', location: [164.23, -55.68, 25.20], room: 'CT室01', type: '新型核磁共振机' },
  { dtId: 10048, name: '新型核磁共振机2', eid: '-9150751315691145492', location: [164.94, -43.79, 25.23], room: 'CT室02', type: '新型核磁共振机' },
]

// 房间类型
export const roomTypes = ['手术室', '彩超室', 'CT室', '配电室']

// 房间类型对应的颜色（高亮用）
export const roomTypeColors = {
  '手术室': [1, 0.2, 0.2, 0.6],
  '彩超室': [0.2, 0.8, 0.2, 0.6],
  'CT室': [0.2, 0.4, 1, 0.6],
  '配电室': [1, 0.8, 0.2, 0.6],
}

// 楼宇 POI 坐标（待确认，当前使用临时坐标）
export const buildingPOIs = [
  { id: 'outpatient', name: '门诊楼', location: [252, -145, 80] }
]

// 相机漫游路径
export const tourPath = [
  { pos: [252, -145, 68], pitch: -20, yaw: -152, duration: 5 },
  { pos: [280, -175, 100], pitch: -22, yaw: -154, duration: 5 },
  { pos: [280, 37, 100], pitch: -21, yaw: 132, duration: 5 },
  { pos: [-8, 37, 100], pitch: -25, yaw: 36, duration: 5 },
  { pos: [-8, -281, 100], pitch: -10, yaw: -51, duration: 5 },
  { pos: [252, -145, 68], pitch: -20, yaw: -152, duration: 5 },
]

// 楼层 EID 配置
export const floorEids = {
  F1: '-9150751316199235648',
  F2: '-9150751316199237814',
  F3: '-9150751316199240314',
  F4: '-9150751316199244348',
  Roof: '-9150751316199286231',
}

// 楼层偏移配置
export const floorOffsets = {
  F1: 0,
  F2: 10,
  F3: 20,
  F4: 30,
  Roof: 0,
}

// 综合统计面板数据
export const overviewStats = {
  space: { totalArea: 941.50, utilization: 81, totalRooms: 61 },
  security: { alarmCount: 0, checkRate: 100 },
  equipment: { total: 22, active: 22, maintenance: 0 },
  energy: { today: 4523, month: 135680, trend: -5.2 },
  elevator: { running: 4, standby: 2 },
  service: { pending: 3, completed: 47 },
}
