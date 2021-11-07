<template>
  <div>
    <div style="display: flex">
      <div style="margin: 5px">
        <div class="form-group row">
          <label for="inputEmail3" class="col-sm-4 col-form-label">城市</label>
          <div class="col-sm-8">
            <input
              type="text"
              class="form-control"
              id="inputEmail3"
              placeholder="輸入城市"
              value="台北"
              disabled
            />
          </div>
        </div>
        <div class="form-group row">
          <label for="inputPassword3" class="col-sm-4 col-form-label"
            >公車路線</label
          >
          <div class="col-sm-8">
            <input
              type="text"
              class="form-control"
              id="inputPassword3"
              placeholder="輸入公車路線"
              v-model="busRoute"
            />
          </div>
        </div>
        <div class="form-group row">
          <div class="col-sm-4">
            <button class="btn btn-primary" @click="searchRoute()">搜尋</button>
          </div>
        </div>
      </div>
      <div id="map"></div>
    </div>
  </div>
</template>

<script>
import L from "leaflet";
import jsSHA from "jssha";
console.log(L);
let osmMap = {};

//綠色的icon 圖標
var greenIcon = new L.Icon({
  iconUrl:
    "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default {
  name: "Map",
  data() {
    return {
      busRoute: "",
      data: "",
      osmMap: {},
    };
  },
  methods: {
    getAuthorizationHeader() {
      //  填入自己 ID、KEY 開始
      let AppID = "FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF";
      let AppKey = "FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF";
      //  填入自己 ID、KEY 結束
      let GMTString = new Date().toGMTString();
      let ShaObj = new jsSHA("SHA-1", "TEXT");
      ShaObj.setHMACKey(AppKey, "TEXT");
      ShaObj.update("x-date: " + GMTString);
      let HMAC = ShaObj.getHMAC("B64");
      let Authorization =
        'hmac username="' +
        AppID +
        '", algorithm="hmac-sha1", headers="x-date", signature="' +
        HMAC +
        '"';
      return { Authorization: Authorization, "X-Date": GMTString };
    },
    searchRoute() {
      //清除地圖上的標記
      if (this.data != "") {
        console.log("in here!!!!!!!!!!!!!");
        let layers = [];
        for (let i = 0;i< this.data[0].Stops.length  ; i++) {
          var layer = new L.marker([
            this.data[0].Stops[i].StopPosition.PositionLat,
            this.data[0].Stops[i].StopPosition.PositionLon,
          ]);
          console.log("layer",layer)
          layers.push(layer);
        }
        var myGroup = L.layerGroup(layers);
        osmMap.addLayer(myGroup);
        myGroup.clearLayers();
      }

      //搜尋公車路線的axios 方法
      let busRouNum = this.busRoute;
      this.$http
        .get(
          `https://ptx.transportdata.tw/MOTC/v2/Bus/DisplayStopOfRoute/City/Taipei/${busRouNum}?&$format=JSON`,
          {
            headers: this.getAuthorizationHeader(),
          }
        )
        .then((res) => {
          this.data = res.data;
          console.log(this.data);
          for (let i = 0; this.data[0].Stops.length > i; i++) {
            L.marker(
              [
                this.data[0].Stops[i].StopPosition.PositionLat,
                this.data[0].Stops[i].StopPosition.PositionLon,
              ],
              { icon: greenIcon }
            )
              .addTo(osmMap)
              .bindPopup("<p>" + this.data[0].Stops[i].StopName.Zh_tw + "</p>");
          }
        });
    },
  },
  mounted() {
    // OSM
    osmMap = L.map("map", {
      center: [25.03, 121.55],
      zoom: 12,
    });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '<a target="_blank" href="https://www.openstreetmap.org/">© OpenStreetMap 貢獻者</a>',
      maxZoom: 18,
    }).addTo(osmMap);
  },
};
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
html,
body {
  width: 100%;
  height: 100%;
}
#map {
  width: 800px;
  height: 500px;
}
</style>