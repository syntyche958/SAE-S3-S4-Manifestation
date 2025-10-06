<template>
  <Card>
    <template #content>
      <div id="map"></div>
    </template>
  </Card>
</template>

<script setup>
import { onMounted } from 'vue';
import * as L from 'leaflet';
import Card from 'primevue/card';


onMounted(() => {
  // Map setup
  let southWestBoundsCoords = L.latLng(43.203642, 2.359400);
  let northEastBoundsCoords = L.latLng(43.209367, 2.368358);
  let bounds = new L.LatLngBounds(southWestBoundsCoords, northEastBoundsCoords);
  let options = { maxBounds: bounds, minZoom: 17 };
  var map = L.map('map', options).setView([43.206496, 2.363834], 17);

  // Define tile layer
  var geoportailFranceTileLayer = L.tileLayer('https://data.geopf.fr/wmts?REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0&STYLE={style}&TILEMATRIXSET=PM&FORMAT={format}&LAYER=ORTHOIMAGERY.ORTHOPHOTOS&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}', {
    attribution: '<a target="_blank" href="https://www.geoportail.gouv.fr/">Geoportail France</a>',
    bounds: [[-75, -180], [81, 180]],
    minZoom: 2,
    maxZoom: 19,
    format: 'image/jpeg',
    style: 'normal'
  });
  geoportailFranceTileLayer.addTo(map);

  // Display pinPoint for each location
  

  // let polygonDefaultColor = "black";
  // let polygonSelectedColor = "blue";

  // var topAreaLatLong = [[43.208413, 2.364308], [43.207302, 2.365821], [43.205386, 2.365081], [43.207756, 2.362989]]
  // var topArea = L.polygon(topAreaLatLong, { color: polygonDefaultColor });
  // topArea.addTo(map);

  // topArea.on("mouseover", () => {
  //   topArea.setStyle({ color: polygonSelectedColor })
  // })

  // topArea.on("mouseout", () => {
  //   if (!topArea.isPopupOpen())
  //     topArea.setStyle({ color: polygonDefaultColor })
  // })

  // topArea.bindPopup("<b>Emplacement libre!</b><br> Accès à l'eau 10m² blablabla")

  // topArea.getPopup().on("remove", () => {
  //   topArea.setStyle({ color: polygonDefaultColor });
  // })

  // var bottomAreaLatLong = [[43.207756, 2.362989], [43.205386, 2.365081], [43.204417, 2.361594]];
  // var bottomArea = L.polygon(bottomAreaLatLong, { color: polygonDefaultColor });

  // bottomArea.on("mouseover", () => {
  //   bottomArea.setStyle({ color: polygonSelectedColor })
  // })

  // bottomArea.on("mouseout", () => {
  //   if (!bottomArea.isPopupOpen())
  //     bottomArea.setStyle({ color: polygonDefaultColor })
  // })

  // bottomArea.bindPopup("<b>Emplacement libre!</b><br> Accès à l'eau 10m² blablabla")

  // bottomArea.getPopup().on("remove", () => {
  //   bottomArea.setStyle({ color: polygonDefaultColor });
  // })
  // bottomArea.addTo(map);

})
</script>

<style scoped>
#map {
  height: 80vh;
  width: 50vw;
}

@media only screen and (max-width: 950px) {
  #map {
    height: 90vh;
    width: 90vw;
  }
}
</style>
