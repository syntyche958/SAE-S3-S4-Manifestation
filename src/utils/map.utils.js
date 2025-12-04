import * as L from 'leaflet'
import { useLocationStore } from '@/stores/locations'
import { ref } from 'vue'
import { MapModeEnum } from '@/enums/Map.enums'
import { useActivityStore } from '@/stores/activities'
import { useProviderStore } from '@/stores/providers'
import { useRouter } from 'vue-router'

const defaultPolygonWeight = 2

export function setupMap(mapId) {
  // Map setup
  let southWestBoundsCoords = L.latLng(43.203642, 2.3594)
  let northEastBoundsCoords = L.latLng(43.209367, 2.368358)
  let bounds = new L.LatLngBounds(southWestBoundsCoords, northEastBoundsCoords)
  let options = { maxBounds: bounds, minZoom: 17 }
  const map = L.map(mapId, options).setView([43.206496, 2.363834], 17)

  // Define tile layer
  const geoportailFranceTileLayer = L.tileLayer(
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
    displayLegends(map, mapMode)
    displayUnselectPanel(map, emit, mapMode, route)
  } else {
    displayAreas(map, emit, mapMode, route)
    displayLegends(map, mapMode)
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

function bindPopupVisitor(map, marker, locationId) {
  const activityStore = useActivityStore()
  const providerStore = useProviderStore()
  const router = useRouter()

  let mouseOnPopUp = false
  let mouseOneMarker = false

  let activity = activityStore.activities.find((a) => a.locationId === locationId)
  let activityName = activity.name
  let provider = providerStore.get(activity.providerId)
  let providerName = provider.name

  // Add popup with needed event to open and close it
  marker.on('mouseover', () => {
    marker.on('mouseout', () => {
      mouseOneMarker = false
      setTimeout(() => {
        if (!mouseOnPopUp && !mouseOneMarker) marker.closePopup()
      }, 200)
    })

    map.closePopup()
    mouseOneMarker = true
    marker
      .bindPopup(
        `<b>Prestataire : </b><span>${providerName}</span><br><b>Activité : </b><span>${activityName}</span>`,
      )
      .openPopup()

    let popupElement = marker.getPopup().getElement()
    popupElement.addEventListener('mouseenter', () => (mouseOnPopUp = true))
    popupElement.addEventListener('mouseleave', () => {
      mouseOnPopUp = false
      marker.closePopup()
    })
    popupElement.style.cursor = 'pointer'
    popupElement.onclick = function () {
      router.push(`/provider/${provider.id}/activity/${activity.id}`)
    }
  })
}

function displayPinPoints(map) {
  const markers = ref([])
  const locationStore = useLocationStore()
  const activityStore = useActivityStore()

  for (let location of locationStore.locations) {
    // Do not display if no activity assigned to location
    if (!activityStore.activities.find((a) => a.locationId === location.id)) continue

    let marker = L.marker(location['coord']).addTo(map)
    bindPopupVisitor(map, marker)
    markers.value.push(marker)
  }
}

function getAreaColor(locationId, mapMode, route) {
  const activityStore = useActivityStore()

  if (mapMode === MapModeEnum.PROVIDER) {
    const currentActivityId = Number(route.params.activity_id)
    const isAskedByCurrentActivity =
      activityStore.get(currentActivityId).requestedLocationId === locationId

    const isAssignedToCurrentActivity =
      activityStore.get(currentActivityId).locationId === locationId
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
      activityStore.activities.filter((a) => a.requestedLocationId === locationId).length > 0

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

    const areaColor = getAreaColor(locationId, mapMode, route)

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

function displayLegends(map, mapMode) {
  const legend = L.control({ position: 'bottomright' })
  let labels
  let colors
  if (mapMode === MapModeEnum.PROVIDER) {
    labels = [
      'Emplacement libre',
      'Emplacement demandé',
      'Emplacement assigné',
      'Emplacement occupé',
    ]
    colors = ['orange', 'yellow', 'green', 'blue']
  } else {
    labels = ['Emplacement libre', 'Emplacement demandé', 'Emplacement occupé']
    colors = ['orange', 'yellow', 'blue']
  }

  legend.onAdd = function () {
    let div = L.DomUtil.create('div', 'info legend')
    div.style.padding = '15px'
    div.style.backgroundColor = 'rgba(255, 255, 255, 0.8)'
    div.style.borderRadius = '5px'

    for (let i = 0; i < labels.length; i++) {
      div.innerHTML += `<span style="background:${colors[i]}">${labels[i]}</span><br>`
    }

    return div
  }

  legend.addTo(map)
}

function displayUnselectPanel(map, emit, mapMode, route) {
  const customControl = L.control({ position: 'topright' })
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

    const label = L.DomUtil.create('div', 'custom-button', container)
    label.innerHTML = 'Déselectionner'

    // Empêche la carte de zoomer/déplacer lorsqu’on clique
    L.DomEvent.disableClickPropagation(container)

    return container
  }
  customControl.addTo(map)
}
