<template>
  <Card>
    <template #content>
      <div id="map"></div>
    </template>
  </Card>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import * as L from 'leaflet'
import Card from 'primevue/card'
import { useLocationStore } from '@/stores/locations'

const markers = ref([])
const polygons = ref([])

onMounted(async () => {
  // Map setup
  let southWestBoundsCoords = L.latLng(43.203642, 2.3594)
  let northEastBoundsCoords = L.latLng(43.209367, 2.368358)
  let bounds = new L.LatLngBounds(southWestBoundsCoords, northEastBoundsCoords)
  let options = { maxBounds: bounds, minZoom: 17 }
  var map = L.map('map', options).setView([43.206496, 2.363834], 17)

  // Define tile layer
  var geoportailFranceTileLayer = L.tileLayer(
    'https://data.geopf.fr/wmts?REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0&STYLE={style}&TILEMATRIXSET=PM&FORMAT={format}&LAYER=ORTHOIMAGERY.ORTHOPHOTOS&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}',
    {
      attribution:
        '<a target="_blank" href="https://www.geoportail.gouv.fr/">Geoportail France</a>',
      bounds: [
        [-75, -180],
        [81, 180],
      ],
      minZoom: 2,
      maxZoom: 19,
      format: 'image/jpeg',
      style: 'normal',
    },
  )
  geoportailFranceTileLayer.addTo(map)

  // Display pinPoint or area for each location
  const locationsStore = useLocationStore()
  await locationsStore.getAllLocations()

  for (let location of locationsStore.locations) {
    let marker = L.marker(location['coord']).addTo(map)
    // marker.bindPopup(
    //   "<b>Nom de l'activité</b><br><span>Quelques informations</span><br><button>Plus d'informations</button>",
    // )

    marker.on('mouseover', () => {
      map.closePopup()
      marker.bindPopup(
        "<b>Nom de l'activité</b><br><span>Quelques informations</span><br><button>Plus d'informations</button>",
      ).openPopup()
      // var latlng = L.latLng(marker.getLatLng())
      // var popup = L.popup().setLatLng(latlng).setContent("<b>Nom de l'activité</b><br><span>Quelques informations</span><br><button>Plus d'informations</button>").openOn(map)
    })
    // marker.on('mouseout', () => {
    //   map.closePopup()
    // })
    markers.value.push(marker)
    // TODO : Pour les prestataires, afficher les zones !
    // let polygon = L.polygon(location['area']).addTo(map)
    // polygons.value.push(polygon)
  }
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
