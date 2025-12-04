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
    displayAreas(map, emit, mapMode, route)
    displayLegendsAdmin(map)
    displayUnselectPanel(map, emit, mapMode, route)
  } else {
    displayAreas(map, emit, mapMode, route)
    displayLegendsProvider(map)
    displayUnselectPanel(map, emit, mapMode, route)
  }
}

export function refreshLocations(map, emit, mapMode, route) {
  // Remove all previous polygons on map
  map.eachLayer((layer) => {
    if (layer instanceof L.Polygon) {
      map.removeLayer(layer)
    }
  })

  if (mapMode === MapModeEnum.ADMIN) {
    displayAreas(map, emit, mapMode, route)
  } else if (mapMode === MapModeEnum.PROVIDER) {
    displayAreas(map, emit, mapMode, route)
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

function getAreaColor(locationId, mapMode, route) {
  const activityStore = useActivityStore()

  if (mapMode == MapModeEnum.PROVIDER) {
    const currentActivityId = Number(route.params.activity_id)
    const isAskedByCurrentActivity =
      activityStore.get(currentActivityId).requestedLocationId == locationId

    const isAssignedToCurrentActivity =
      activityStore.get(currentActivityId).locationId == locationId
    const isAssigned =
      activityStore.activities.filter((a) => a.locationId === locationId).length === 1

    let areaColor = 'orange'
    if (isAssignedToCurrentActivity) areaColor = 'green'
    else if (isAskedByCurrentActivity) areaColor = 'yellow'
    else if (isAssigned) areaColor = 'blue'

    return areaColor
  } else {
    const isAssigned =
      activityStore.activities.filter((a) => a.locationId === locationId).length === 1
    const isAskedByProviders =
      activityStore.activities.filter((a) => a.requestedLocationId == locationId).length > 0

    let areaColor = 'orange'
    if (isAssigned) areaColor = 'blue'
    else if (isAskedByProviders) areaColor = 'yellow'
    return areaColor
  }
}

function displayAreas(map, emit, mapMode, route) {
  const polygons = ref([])
  const locationStore = useLocationStore()

  for (let location of locationStore.locations) {
    const locationId = location.id

    var areaColor = getAreaColor(locationId, mapMode, route)

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

function displayUnselectPanel(map, emit, mapMode, route) {
  var customControl = L.control({ position: 'topright' })
  customControl.onAdd = function () {
    const container = L.DomUtil.create('div', 'custom-panel')
    container.style.padding = '15px'
    container.style.backgroundColor = 'rgba(31, 189, 136, 0.95)'
    container.style.borderRadius = '5px'
    container.style.black = 'black'
    container.style.cursor = 'pointer'
    container.onclick = function () {
      emit('changeSelectedLocation', undefined)
      refreshLocations(map, emit, mapMode, route)
    }

    const button = L.DomUtil.create('div', 'custom-button', container)
    button.innerHTML = 'Déselectionner'

    // Empêche la carte de zoomer/déplacer lorsqu’on clique
    L.DomEvent.disableClickPropagation(container)

    return container
  }
  customControl.addTo(map)
}
