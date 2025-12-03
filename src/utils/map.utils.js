import * as L from 'leaflet'
import { useLocationStore } from '@/stores/locations'
import { ref } from 'vue'
import { MapModeEnum } from '@/enums/Map.enums'
import { useActivityStore } from '@/stores/activities'

const defaultPolygonWeight = 2

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

export async function displayLocations(map, mapMode, emit, route) {
  if (mapMode === MapModeEnum.VISITOR) {
    displayPinPoints(map)
  } else if (mapMode === MapModeEnum.ADMIN) {
    displayAreasAdmin(map, emit)
    displayLegendsAdmin(map)
  } else {
    displayAreasProvider(map, emit, route)
    displayLegendsProvider(map)
  }
}

export async function refreshLocations(map, emit, mapMode, route) {
  // Remove all previous polygons on map
  map.eachLayer((layer) => {
    if (layer instanceof L.Polygon) {
      map.removeLayer(layer)
    }
  })

  if (mapMode === MapModeEnum.ADMIN) {
    displayAreasAdmin(map, emit)
  } else if (mapMode === MapModeEnum.PROVIDER) {
    displayAreasProvider(map, emit, route)
  }
}

function bindPopupVisitor(map, marker) {
  var mouseOnPopUp = false
  var mouseOneMarker = false
  // Add popup with needed event to open and close it
  marker.on('mouseover', () => {
    map.closePopup()
    mouseOneMarker = true
    marker
      .bindPopup(
        // TODO : Use real values (different depending on the display mode)
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
      mouseOneMarker = false
      setTimeout(() => {
        if (!mouseOnPopUp && !mouseOneMarker) marker.closePopup()
      }, 200)
    })
  })
}

function displayPinPoints(map) {
  const markers = ref([])
  const locationStore = useLocationStore()

  for (let location of locationStore.locations) {
    let marker = L.marker(location['coord']).addTo(map)

    bindPopupVisitor(map, marker)
    markers.value.push(marker)
  }
}

// TODO : Refactor with displayAreasAdmin
async function displayAreasProvider(map, emit, route) {
  const polygons = ref([])
  const locationStore = useLocationStore()
  const activityStore = useActivityStore()
  const currentActivityId = Number(route.params.activity_id)

  for (let location of locationStore.locations) {
    const locationId = location.id

    const isAskedByCurrentActivity =
      activityStore.get(currentActivityId).requestedLocationId == locationId
    const isAssignedToCurrentActivity =
      activityStore.get(currentActivityId).locationId == locationId
    const isAssigned =
      activityStore.activities.filter((a) => a.locationId === locationId).length === 1

    var areaColor = 'orange'
    if (isAssignedToCurrentActivity) areaColor = 'green'
    else if (isAskedByCurrentActivity) areaColor = 'yellow'
    else if (isAssigned) areaColor = 'green'

    let polygon = L.polygon(location['area'], {
      color: areaColor,
      weight: defaultPolygonWeight,
    }).addTo(map)

    polygon.on('click', () => {
      emit('changeSelectedLocation', locationId)

      // Reset all polygons weights
      map.eachLayer(function (layer) {
        if (layer instanceof L.Polygon) {
          layer.setStyle({
            weight: defaultPolygonWeight,
          })
        }
      })

      polygon.setStyle({ weight: defaultPolygonWeight + 4 })
    })
    polygons.value.push(polygon)
  }
}

function displayAreasAdmin(map, emit) {
  const polygons = ref([])
  const locationStore = useLocationStore()
  const activityStore = useActivityStore()

  for (let location of locationStore.locations) {
    const locationId = location.id
    const isAssigned =
      activityStore.activities.filter((a) => a.locationId === locationId).length === 1
    const isAskedByProviders =
      activityStore.activities.filter((a) => a.requestedLocationId == locationId).length > 0

    var areaColor = 'orange'
    if (isAssigned) areaColor = 'blue'
    else if (isAskedByProviders) areaColor = 'yellow'

    let polygon = L.polygon(location['area'], {
      color: areaColor,
      weight: defaultPolygonWeight,
    }).addTo(map)

    polygon.on('click', () => {
      emit('changeSelectedLocation', locationId)

      // Reset all polygons weights
      map.eachLayer(function (layer) {
        if (layer instanceof L.Polygon) {
          layer.setStyle({
            weight: defaultPolygonWeight,
          })
        }
      })

      polygon.setStyle({ weight: defaultPolygonWeight + 4 })
    })
    polygons.value.push(polygon)
  }
}

// TODO : Améliorer le visuel de la légende
function displayLegendsAdmin(map) {
  var legend = L.control({ position: 'bottomright' })

  legend.onAdd = function () {
    let div = L.DomUtil.create('div', 'info legend')
    div.style.padding = '15px'
    div.style.backgroundColor = 'rgba(255, 255, 255, 0.8)'
    div.style.borderRadius = '5px'

    let labels = ['Emplacement libre', 'Emplacement demandé', 'Emplacement occupé']
    let colors = ['orange', 'yellow', 'blue']

    for (let i = 0; i < labels.length; i++) {
      div.innerHTML += `<span style="background:${colors[i]}">${labels[i]}</span><br>`
    }

    return div
  }

  legend.addTo(map)
}

// TODO : Améliorer le visuel de la légende
function displayLegendsProvider(map) {
  var legend = L.control({ position: 'bottomright' })

  legend.onAdd = function () {
    let div = L.DomUtil.create('div', 'info legend')
    div.style.padding = '15px'
    div.style.backgroundColor = 'rgba(255, 255, 255, 0.8)'
    div.style.borderRadius = '5px'

    let labels = [
      'Emplacement libre',
      'Emplacement demandé',
      'Emplacement assigné',
      'Emplacement occupé',
    ]
    let colors = ['orange', 'yellow', 'green', 'blue']

    for (let i = 0; i < labels.length; i++) {
      div.innerHTML += `<span style="background:${colors[i]}">${labels[i]}</span><br>`
    }

    return div
  }

  legend.addTo(map)
}
