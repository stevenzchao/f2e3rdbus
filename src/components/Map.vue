<template>
    <div id="map">
        
    </div>
</template>

<script>
import L from 'leaflet'
console.log(L)
let osmMap ={};

export default {
    name: "Map",
    data() {
        return {
            osmMap:{}
            
        }
    },
      mounted() {
    // OSM
    osmMap = L.map('map', {
      center: [25.03, 121.55],
      zoom: 15,
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '<a target="_blank" href="https://www.openstreetmap.org/">© OpenStreetMap 貢獻者</a>',
      maxZoom: 18,
    }).addTo(osmMap);
    // this.$http.get('https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json')
    //   .then((res) => {
    //     this.data = res.data.features;
    //     // this.updateMarker();
    //   });
  },

}
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
html,body{
  width: 100%;
  height: 100%;
}
#map { width: 800px;height: 500px; }
</style>