import * as L from 'leaflet'
import { useLocationStore } from '@/stores/locations'
import { ref } from 'vue'
import { MapMode } from '@/enums/Map.enums'

export function setupMap(mapId) {
  // Map setup
  let southWestBoundsCoords = L.latLng(43.203642, 2.3594)
  let northEastBoundsCoords = L.latLng(43.209367, 2.368358)
  let bounds = new L.LatLngBounds(southWestBoundsCoords, northEastBoundsCoords)
  let options = { maxBounds: bounds, minZoom: 17 }
  var map = L.map(mapId, options).setView([43.206496, 2.363834], 17)

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

  return map
}

function displayPinPoints(map) {
  const markers = ref([])
  const locationStore = useLocationStore()

  for (let location of locationStore.locations) {
    let marker = L.marker(location['coord']).addTo(map)

    var mouseOnPopUp = false
    // Add popup with needed event to open and close it
    marker.on('mouseover', () => {
      map.closePopup()
      marker
        .bindPopup(
          // TODO : Use real values (different depending on the page)
          "<b>Nom de l'activité</b><br><span>Quelques informations</span><br><button>Plus d'informations</button>",
        )
        .openPopup()

      let markerElement = marker.getPopup().getElement()
      markerElement.addEventListener('mouseenter', () => (mouseOnPopUp = true))
      markerElement.addEventListener('mouseleave', () => {
        mouseOnPopUp = false
        marker.closePopup()
      })
      marker.on('mouseout', () => {
        setTimeout(() => {
          if (!mouseOnPopUp) marker.closePopup()
        }, 200)
      })
    })
    markers.value.push(marker)
  }
}

function displayAreas(map) {
  const polygons = ref([])
  const locationStore = useLocationStore()

  for (let location of locationStore.locations) {
    let polygon = L.polygon(location['area']).addTo(map)
    // TODO : Bind popup
    // TODO : Display proper informations in popup (surface area, water, electricity, ... )
    polygons.value.push(polygon)
  }
}

export async function displayLocations(map, mapMode) {
  if (mapMode === MapMode.VISITOR) {
    displayPinPoints(map)
  } else {
    displayAreas(map)
  }
}
