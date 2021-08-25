<template>
  <div class="home">
    <button @click="save">保存</button>
    <button @click="addMarker">添加标记</button>
    <div id="container" style="width: 100%; height: 500"></div>
    <!-- <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js App" />
    <test /> -->
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

// 线路数据
var geometries = [
    {
        id: 111,
        'styleId': 'style_blue',//绑定样式名
        paths: [new window.TMap.LatLng(39.095787,117.147111), new window.TMap.LatLng(39.095066,117.148579), new window.TMap.LatLng(39.093696,117.149032)]
    },
    {
        id: 222,
        'styleId': 'style_blue',//绑定样式名
        paths: [new window.TMap.LatLng(39.095513,117.145919), new window.TMap.LatLng(39.093349,117.143896)]
    }
];

// 点标记
var markerPaths = [];
for(let i=0; i<geometries.length; i++) {
    const item = geometries[i].paths;
    for(let j=0; j<item.length; j++) {
        markerPaths.push({
            position: item[j],
            content: '站点'
        })
    }
}

export default {
  name: 'home',
  components: {
    // HelloWorld
  },
  data() {
    return {
      map: null,
      center: {
        lat: '39.095787',
        lng: '117.147111'
      },
      mapConfig: {
        zoom: 17.2,
        pitch: 43.5,
        rotation: 45
      },
      TMap: window.TMap,
      mapKey: '',
      editor: null, // 图层编辑器
      markerLayer: null, // 点标记图层
      polylineLayer: null, // 折线图层
      infoWindow: null, // 信息窗口
      editLineGeometries: null, // 折线编辑数据
      markerArr: [
        {
          id: 0,
          position: new window.TMap.LatLng(39.133228,117.132267),
          styleId: 'circle_marker'
        },
        {
          id: 1,
          position: new window.TMap.LatLng(39.087986,117.121756),
          styleId: 'circle_marker'
        }
      ]
    }
  },
  mounted() {
    this.initMap()
    this.initMapCenter()
    this.initMarker()
    this.initPolyLine(geometries)
    this.initLabel()
    this.initEditor()
    this.initInfoWindow()
    this.initKeyPress()
  },
  beforeDestroy() {
    this.destroy()
  },
  methods: {
    //地图初始化函数，本例取名为init，开发者可根据实际情况定义
    initMap() {
      // 定义地图中心点坐标
      const center = this.LATLNG(this.center.lat, this.center.lng)
      const mapConfig = {
        center, // 设置地图中心点坐标
        zoom: 15.2, // 设置地图缩放级别
        pitch: 43.5, // 设置俯仰角
        rotation: 45 // 设置地图旋转角度
      };
      const dom = document.getElementById('container')
      // 调用 TMap.Map() 构造函数创建地图
      this.map = new this.TMap.Map(dom, mapConfig)
      // Map实例创建后，通过on方法绑定点击事件
      this.map.on("click",  this.clickMapHandler)
    },
    // 设置地图中心点
    initMapCenter() {
      // 获取地图中心点
      const centerLatLng = this.map.getCenter();
      this.map.setCenter(this.LATLNG(centerLatLng.lat, centerLatLng.lng))
    },
    // 销毁地图
    destroy() {
      if (this.map) this.map.destroy();
    },
    // 点标记
    initMarker() {
      console.log('markerPaths---', markerPaths)
      const config = {
        map: this.map,
        draggable: true,
        //样式定义
        styles: this.setMarkerStyle(),
        //点标记数据数组
        geometries: markerPaths,
        pointGeometry: this.markerArr
      }
      this.markerLayer = this.MULTIMARKER(config);
      //监听marker点击事件
      this.markerLayer.on("mousemove", this.mouseMoveMarkerHandler)
    },
    // 折线
    initPolyLine(geometries) {
      const config = {
        map: this.map,
        styles: this.setLineStyle(),
        geometries
      }
      this.polylineLayer = this.MULTIPOLYLINE(config)
    },
    // 文本
    initLabel() {
      const config = {
        id: 'label-layer',
        map: this.map,
        styles: this.setLabelStyle(),
        geometries: markerPaths
      }
      new this.TMap.MultiLabel(config);
    },
    // 初始化infoWindow
    initInfoWindow() {
      this.infoWindow = this.INFOWINDOW({
          map: this.map,
          position: this.LATLNG(0, 0),
          offset: { x: 0, y: -32 } //设置信息窗相对position偏移像素
      });
      this.infoWindow.close() // 初始关闭信息窗关闭
    },
    // 设置点标记样式
    setMarkerStyle() {
      return {
        "marker": this.MARKERSTYLE({}),
        "marker_active": this.MARKERSTYLE({
          "src": "https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/marker-pink.png"
        }),
        'circle_marker': this.MARKERSTYLE({
          "src": "https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/marker-pink.png"
        })
      }
    },
    // 设置线样式
    setLineStyle() {
      return {
        'style_blue_active': this.LINESTYLE({
          'color': '#2b9ce0', //线填充色
          'width': 9, //折线宽度
          'borderWidth': 5, //边线宽度
          'borderColor': '#FFF', //边线颜色
          'lineCap': 'round', //线端头方式
        }),
        'style_blue': this.LINESTYLE({
          'color': '#3777FF', //线填充色
          'width': 8, //折线宽度
          'borderWidth': 5, //边线宽度
          'borderColor': '#FFF', //边线颜色
          'lineCap': 'round', //线端头方式
        })
      }
    },
    // 设置label
    setLabelStyle() {
      return {
        'label': this.LABELSTYLE({
            'color': '#3777FF', //颜色属性
            'size': 24, //文字大小属性
            'offset': { x: 200, y: 0 }, //文字偏移属性单位为像素
            'angle': 0, //文字旋转属性
            'alignment': 'center', //文字水平对齐属性
            'verticalAlignment': 'middle' //文字垂直对齐属性
        })
      }
    },
    // 绘制点标记
    MULTIMARKER(config) {
      return new this.TMap.MultiMarker(config)
    },
    // 绘制折线
    MULTIPOLYLINE(config) {
      return new this.TMap.MultiPolyline(config)
    },
    INFOWINDOW(config) {
      return new this.TMap.InfoWindow(config)
    },
    // 返回latlng坐标实例
    LATLNG(lat, lng) {
      return new this.TMap.LatLng(lat, lng)
    },
    // 返回line style实例
    LINESTYLE(style) {
      return new this.TMap.PolylineStyle(style)
    },
    // 返回marker style实例
    MARKERSTYLE(style) {
      return new this.TMap.MarkerStyle(style)
    },
    // 返回label style实例
    LABELSTYLE(style) {
      return new this.TMap.LabelStyle(style)
    },
    // 返回几何图形及编辑器实例
    TOOLGEOMETRYEDITOR(config) {
      return new this.TMap.tools.GeometryEditor(config)
    },
    // 地图点击事件
    clickMapHandler(evt) {
      this.setClickEsc(27)
      this.closeInfoWindow()
      var lat = evt.latLng.getLat().toFixed(6);
      var lng = evt.latLng.getLng().toFixed(6);
      console.log("您点击map的坐标是："+ lat + "," + lng, evt);
      // 添加点标记
      //监听点击事件添加marker
      // markerLayer.add({
      // 	position: evt.latLng,
      //     "title": "站点"
      // });  
    },
    // 鼠标点击点标记，显示弹窗信息
    mouseMoveMarkerHandler(evt) {
      const content = `<div class="infoContent">
        <p class="infoContent_title">坐标</p>
        <p class="infoContent_text">${evt.geometry.position.toString()}</p>
      </div>`
      this.infoWindow.close()
      this.infoWindow.open() // 打开信息窗
      this.infoWindow.setPosition(evt.geometry.position) // 设置信息窗位置
      this.infoWindow.setContent(content) // 设置信息窗内容
    },
    // 关闭信息窗口
    closeInfoWindow() {
      this.infoWindow.close()
    },
    // 编辑图层
    initEditor() {
      // 初始化几何图形及编辑器
      this.editor = this.TOOLGEOMETRYEDITOR({
        map: this.map, // 编辑器绑定的地图对象
        overlayList: [ // 可编辑图层
          {
            overlay: this.polylineLayer,
            id: 'polyline',
            selectedStyleId: "style_blue_active"  // 被选中的line会变为高亮样式
          }
        ],
        actionMode: this.TMap.tools.constants.EDITOR_ACTION.INTERACT, // 编辑器的工作模式 编辑
        // actionMode: TMap.tools.constants.EDITOR_ACTION.DRAW, // 编辑器的工作模式 画线
        activeOverlayId: 'polyline', // 激活图层
        selectable: true, // 开启点选功能
        snappable: true // 开启吸附
      })
      
      // 激活编辑
      this.editor.setActiveOverlay('polyline');
      // 监听绘制结束事件，获取绘制几何图形
      this.editor.on('draw_complete', this.editorDraw);
      // 修改完成结束事件
      this.editor.on('adjust_complete', this.editorEdit)
      // 删除完成结束事件
      this.editor.on('delete_complete', this.editorRemove)
    },
    // 删除线路
    removePolyline(id) {
      this.polylineLayer.remove(id)
    },
    // 图层比那集-绘制完成回调
    editorDraw(geometry) {
      console.log('监听绘制结束事件---', geometry);
    },
    // 图层编辑-修改完成回调
    editorEdit(geometry) {
      console.log('修改结束事件---', geometry);
      this.editLineGeometries = geometry
      this.closeInfoWindow()
      // this.removePolyline(geometry.id);
      if (geometry.paths) {
        this.routePlan(geometry)
      }
    },
    // 图层编辑删除完成回调
    editorRemove(geometry) {
      console.log('editorRemove---', geometry)
    },
    // 图层编辑得到的线路坐标，处理成api需要的数据格式
    routePlan(geometry) {
      // https://apis.map.qq.com/ws/direction/v1/driving/?from=39.915285,116.403857&to=39.915285,116.803857&waypoints=39.111,116.112;39.112,116.113&output=json&callback=cb&key=OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77
      // from 起点，终点
      // to 起点，终点
      // waypoints 途径点，最大支持16个 lat1,lng1; lat2, lng2
      // plate_number 车牌号，对限行区域进行避让
      const { paths } = geometry;
      const pathLen = paths.length;
      const from = `${paths[0].lat},${paths[0].lng}`;
      const to = `${paths[pathLen-1].lat},${paths[pathLen-1].lng}`;
      const waypointsTmp = paths.slice(1, pathLen-1);
      let waypoints = '';
      for(let i=0; i< waypointsTmp.length; i++) {
        waypoints += `${waypointsTmp[i].lat},${waypointsTmp[i].lng};`
      }
      waypoints = waypoints.replace(/;$/gi, '')
      const policy = 'LEAST_TIME' // [默认]参考实时路况，时间最短

      this.sendAjax({from, to, waypoints, policy})
    },
    // 调用api 根据修改后的坐标参数，获取路线规划的坐标数据
    async sendAjax({ from, to, waypoints, policy}) {
      const url = `/api/?from=${from}&to=${to}&output=json&key=${this.mapKey}&waypoints=${waypoints}&policy=${policy}`;
      // Make a request for a user with a given ID
      const res = await this.$get(url);
      if (res.status == 500) {
        alert(res.message)
        return
      }
      const routeResult = res.result.routes;
     
      // const routeResult = [
      //   {
      //       "mode":"DRIVING",
      //       "distance":736,
      //       "duration":3,
      //       "traffic_light_count":1,
      //       "toll":0,
      //       "restriction":{
      //           "status":1
      //       },
      //       "polyline":[
      //           39.096318,
      //           117.147845,
      //           -20,
      //           -19,
      //           -19,
      //           -80,
      //           -9,
      //           -228,
      //           4,
      //           -439,
      //           -12,
      //           -223,
      //           -46,
      //           -238,
      //           -53,
      //           -63,
      //           -182,
      //           0,
      //           0,
      //           0,
      //           -6,
      //           -639,
      //           10,
      //           -209,
      //           0,
      //           0,
      //           -241,
      //           24,
      //           -144,
      //           1,
      //           -523,
      //           -15,
      //           -67,
      //           0,
      //           0,
      //           0,
      //           2,
      //           997,
      //           -21,
      //           1321,
      //           0,
      //           0,
      //           -106,
      //           -11,
      //           -185,
      //           -25,
      //           0,
      //           0,
      //           -17,
      //           775,
      //           -26,
      //           109,
      //           -37,
      //           24,
      //           -311,
      //           13,
      //           -430,
      //           7,
      //           -183,
      //           0
      //       ],
      //       "steps":[
      //           {
      //               "instruction":"沿内部道路行驶136米,右转",
      //               "polyline_idx":[
      //                   0,
      //                   17
      //               ],
      //               "road_name":"内部道路",
      //               "dir_desc":"",
      //               "distance":136,
      //               "act_desc":"右转",
      //               "accessorial_desc":""
      //           },
      //           {
      //               "instruction":"沿内部道路向西行驶73米,左转",
      //               "polyline_idx":[
      //                   18,
      //                   23
      //               ],
      //               "road_name":"内部道路",
      //               "dir_desc":"西",
      //               "distance":73,
      //               "act_desc":"左转",
      //               "accessorial_desc":""
      //           },
      //           {
      //               "instruction":"沿内部道路向南行驶108米,左转",
      //               "polyline_idx":[
      //                   24,
      //                   33
      //               ],
      //               "road_name":"内部道路",
      //               "dir_desc":"南",
      //               "distance":108,
      //               "act_desc":"左转",
      //               "accessorial_desc":""
      //           },
      //           {
      //               "instruction":"沿堤南道向东行驶200米,右转",
      //               "polyline_idx":[
      //                   34,
      //                   39
      //               ],
      //               "road_name":"堤南道",
      //               "dir_desc":"东",
      //               "distance":200,
      //               "act_desc":"右转",
      //               "accessorial_desc":""
      //           },
      //           {
      //               "instruction":"沿内部道路向南行驶32米,左转",
      //               "polyline_idx":[
      //                   40,
      //                   45
      //               ],
      //               "road_name":"内部道路",
      //               "dir_desc":"南",
      //               "distance":32,
      //               "act_desc":"左转",
      //               "accessorial_desc":""
      //           },
      //           {
      //               "instruction":"沿内部道路行驶184米,",
      //               "polyline_idx":[
      //                   46,
      //                   59
      //               ],
      //               "road_name":"内部道路",
      //               "dir_desc":"",
      //               "distance":184,
      //               "act_desc":"",
      //               "accessorial_desc":""
      //           }
      //       ],
      //       "tags":[

      //       ],
      //       "taxi_fare":{
      //           "fare":9
      //       }
      //   }
      // ]
      this.dealPolyLineList(routeResult[0].polyline)
    },
    // 处理修改线路返回的坐标数据集合
    dealPolyLineList(coors) {
      //从结果中取出路线坐标串
      const pl = [], paths = [];
      //坐标解压（返回的点串坐标，通过前向差分进行压缩，因此需要解压）
      const kr = 1000000;
      for (let i = 2; i < coors.length; i++) {
        coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr;
      }
      //将解压后的坐标生成LatLng数组
      for (let i = 0; i < coors.length; i += 2) {
        paths.push(this.LATLNG(coors[i], coors[i+1]))
      }
      pl.push({
        id: this.editLineGeometries.id,
        'styleId': 'style_blue',//绑定样式名
        paths
      })
      // 过滤原来的线路图层，得到未激活的图层数据
      const newOriginGeometries = geometries.filter(i => i.id != this.editLineGeometries.id)
      // 将旧图层和新图层重新赋值给坐标变量
      geometries = [
        ...newOriginGeometries,
        ...pl
      ]
      
      // 更新标注点数据
      this.polylineLayer.setGeometries(geometries)
      // 激活编辑图层
      this.editor.setActiveOverlay('polyline')
      // 删除激活图层
      this.setClickEsc(27)
    },
    // 自定义添加键盘事件
    initKeyPress() {
      if (HTMLElement && !HTMLElement.prototype.pressKey) {
        HTMLElement.prototype.pressKey = function(code) {
            var evt = document.createEvent('UIEvents');
            evt.keyCode = code;
            evt.initEvent('keydown', true, true);
            // 出发自定义事件
            this.dispatchEvent(evt);
        };
      }
    },
    // 模拟键盘的esc事件
    setClickEsc(code) {
      document.body.pressKey(code);
    },
    // 保存线路数据
    save() {
      // console.log('editor--', this.editor, this.editor.getOverlayList(), this.editor.getActiveOverlay())
      // 获取图层信息
      const overlayList = this.editor.getOverlayList()
      // 获取折线图层
      const polylineLayer = overlayList.filter(i => i.id === 'polyline')
      // 获取折线坐标集合
      const polylineLatLngList = polylineLayer[0].overlay.geometries
      console.log('获取折线坐标集合---', polylineLatLngList)
    },
    // 添加marker
    addMarker() {
      this.markerLayer.setGeometries([...markerPaths, ...this.markerArr])
    }
  }
}
</script>
<style>
p {
  margin: 0;
  padding: 0;
  text-align: left;
}
.infoContent {
  width: 140px;
  height: 50px;
}
.infoContent_title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}
.infoContent_text {
  font-size: 14px;
  color: #282828;
}
</style>
