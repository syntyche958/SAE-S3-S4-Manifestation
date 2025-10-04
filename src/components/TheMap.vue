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
  // let options = { doubleClickZoom: false, zoomControl: false, boxZoom: false, zoomDelta: 0, touchZoom: false, minZoom: 17, maxZoom: 17 };
  let southWestBoundsCoords = L.latLng(43.203642, 2.359400);
  let northEastBoundsCoords = L.latLng(43.209367, 2.368358);
  let bounds = new L.LatLngBounds(southWestBoundsCoords, northEastBoundsCoords);
  let options = { maxBounds: bounds, minZoom: 17 };
  var map = L.map('map', options).setView([43.206496, 2.363834], 17);
  map.on("zoom", () => {
    console.log(map.getZoom())
  })
  // Define tile layer
  // L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  //   maxZoom: 19,
  //   attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  // }).addTo(map);

  // L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  //   maxZoom: 19,
  //   attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  // }).addTo(map);

  var GeoportailFrance_orthos = L.tileLayer('https://data.geopf.fr/wmts?REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0&STYLE={style}&TILEMATRIXSET=PM&FORMAT={format}&LAYER=ORTHOIMAGERY.ORTHOPHOTOS&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}', {
    attribution: '<a target="_blank" href="https://www.geoportail.gouv.fr/">Geoportail France</a>',
    bounds: [[-75, -180], [81, 180]],
    minZoom: 2,
    maxZoom: 19,
    format: 'image/jpeg',
    style: 'normal'
  });

  GeoportailFrance_orthos.addTo(map);

  // Add marker with click event !
  // var marker = L.marker([43.206496, 2.363834]).addTo(map);
  // marker.bindPopup("<b>Emplacement libre!</b><br> Accès à l'eau 10m² blablabla");
  // marker.on('click', () => console.log("ouais mgl"));

  // var topArea = L.icon({
  //   iconUrl: 'src/assets/top.svg',
  // });

  // let topMarker = L.marker([43.2085, 2.3628], { icon: topArea });
  // topMarker.addTo(map);

  // var bottomArea = L.icon({
  //   iconUrl: 'src/assets/bottom.svg'
  // })
  // let bottomMarker = L.marker([43.2079, 2.3612], { icon: bottomArea });
  // bottomMarker.addTo(map);

  // bottomMarker.setZIndexOffset(0);
  // topMarker.setZIndexOffset(700);

  // bottomMarker.on("mouseover", () => {
  //   console.log("over bottom");
  // })
  // topMarker.on("mouseover", () => {
  //   console.log("over top");
  // })

  // bottomMarker.getIcon().iconUrl = 'src/assets/top.svg';
  let polygonDefaultColor = "black";
  let polygonSelectedColor = "blue";

  var topAreaLatLong = [[43.208413, 2.364308], [43.207302, 2.365821], [43.205386, 2.365081], [43.207756, 2.362989]]
  var topArea = L.polygon(topAreaLatLong, { color: polygonDefaultColor });
  topArea.addTo(map);

  topArea.on("mouseover", () => {
    topArea.setStyle({ color: polygonSelectedColor })
  })

  topArea.on("mouseout", () => {
    if (!topArea.isPopupOpen())
      topArea.setStyle({ color: polygonDefaultColor })
  })

  topArea.bindPopup("<b>Emplacement libre!</b><br> Accès à l'eau 10m² blablabla")

  topArea.getPopup().on("remove", () => {
    topArea.setStyle({ color: polygonDefaultColor });
  })

  var bottomAreaLatLong = [[43.207756, 2.362989], [43.205386, 2.365081], [43.204417, 2.361594]];
  var bottomArea = L.polygon(bottomAreaLatLong, { color: polygonDefaultColor });

  bottomArea.on("mouseover", () => {
    bottomArea.setStyle({ color: polygonSelectedColor })
  })

  bottomArea.on("mouseout", () => {
    if (!bottomArea.isPopupOpen())
      bottomArea.setStyle({ color: polygonDefaultColor })
  })

  bottomArea.bindPopup("<b>Emplacement libre!</b><br> Accès à l'eau 10m² blablabla")

  bottomArea.getPopup().on("remove", () => {
    bottomArea.setStyle({ color: polygonDefaultColor });
  })
  bottomArea.addTo(map);


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
