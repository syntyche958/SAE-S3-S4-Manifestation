import { ref } from 'vue'
import * as L from 'leaflet'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useLocationStore } from '@/stores/locations'
import { useActivityStore } from '@/stores/activities'
import { useProviderStore } from '@/stores/providers'
import { MapModeEnum } from '@/enums/Map.enums'
import { EVENT_DAYS, EVENT_END_HOUR, EVENT_START_HOUR } from '@/constants/event.constants'

const defaultPolygonWeight = 2

export function setupMap(mapId) {
  // Map setup
  let southWestBoundsCoords = L.latLng(43.203642, 2.36)
  let northEastBoundsCoords = L.latLng(43.209367, 2.37)
  let bounds = new L.LatLngBounds(southWestBoundsCoords, northEastBoundsCoords)
  let options = { maxBounds: bounds, minZoom: 17 }
  const map = L.map(mapId, options).setView([43.206496, 2.364834], 17)

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

export async function displayLocations(map, mapMode, emit, route, selectedLocationId) {
  if (mapMode === MapModeEnum.VISITOR) {
    displayPinPoints(map)
  } else {
    // ADMIN + PROVIDER
    displayAreas(map, emit, mapMode, route, selectedLocationId)
    displayLegends(map, mapMode)
    displayUnselectPanel(map, emit, mapMode, route)
  }
}

export function refreshLocations(map, emit, mapMode, route, selectedLocationId) {
  // Remove all previous polygons on map
  map.eachLayer((layer) => {
    if (layer instanceof L.Polygon) {
      map.removeLayer(layer)
    }
  })

  if (mapMode === MapModeEnum.ADMIN || mapMode === MapModeEnum.PROVIDER) {
    displayAreas(map, emit, mapMode, route, selectedLocationId)
  }
}

function bindPopupVisitor(map, marker, locationId) {
  const { t } = useI18n()

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
        `<b>${t('message.provider')} : </b><span>${providerName}</span><br><b>${t('message.activity')} : </b><span>${activityName}</span>`,
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
    bindPopupVisitor(map, marker, location.id)
    markers.value.push(marker)
  }
}

function getAreaColor(locationId, mapMode, route) {
  const activityStore = useActivityStore()

  if (mapMode === MapModeEnum.PROVIDER) {
    const currentActivityId = Number(route.params.activity_id)
    const currentActivity = activityStore.get(currentActivityId)

    const hasAssignedSlotInCurrentActivity =
      (currentActivity?.spotIds || []).some((spot) => spot.locationId === locationId)

    const hasRequestedSlotInCurrentActivity =
      (currentActivity?.requestedSpotIds || []).some((spot) => spot.locationId === locationId)

    const isAssignedByOtherActivities = activityStore.activities.some(
      (a) =>
        a.id !== currentActivityId &&
        (a.spotIds || []).some((spot) => spot.locationId === locationId),
    )

    let areaColor = 'orange'
    if (hasAssignedSlotInCurrentActivity) areaColor = 'green'
    else if (hasRequestedSlotInCurrentActivity) areaColor = 'yellow'
    else if (isAssignedByOtherActivities) areaColor = 'blue'

    return areaColor
  } else {
    const totalSlots = EVENT_DAYS.length * (EVENT_END_HOUR - EVENT_START_HOUR + 1)

    let assignedCount = 0
    let hasRequest = false
    for (const activity of activityStore.activities) {
      for (const spot of activity.spotIds || []) {
        if (spot.locationId === locationId) assignedCount++
      }
      for (const req of activity.requestedSpotIds || []) {
        if (req.locationId === locationId) hasRequest = true
      }
    }

    if (assignedCount >= totalSlots) return 'green'
    if (hasRequest) return 'yellow'
    if (assignedCount > 0) return 'orange'
    return 'red'
  }
}

function displayAreas(map, emit, mapMode, route, selectedLocationId) {
  const polygons = ref([])
  const locationStore = useLocationStore()

  for (let location of locationStore.locations) {
    const locationId = location.id

    const areaColor = getAreaColor(locationId, mapMode, route)
    const initialWeight =
      selectedLocationId != undefined && Number(locationId) === Number(selectedLocationId)
        ? defaultPolygonWeight + 4
        : defaultPolygonWeight

    let polygon = L.polygon(location['area'], {
      color: areaColor,
      weight: initialWeight,
    }).addTo(map)

    polygon.on('click', () => {
      emit('changeSelectedLocation', locationId)

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
  const { t } = useI18n()

  const legend = L.control({ position: 'topleft' })
  let labels, colors, colorsRGBA

  if (mapMode === MapModeEnum.PROVIDER) {
    labels = [
      t('message.available'),
      t('message.pendingRequest'),
      t('message.yourLocation'),
      t('message.occupied'),
    ]
    colors = ['orange', 'yellow', 'green', 'blue']
    colorsRGBA = [
      'rgba(255, 165, 0, 0.5)',
      'rgba(255, 255, 0, 0.5)',
      'rgba(0, 255, 0, 0.5)',
      'rgba(0, 0, 255, 0.5)',
    ]
  } else {
    labels = ['Complètement occupé', 'Demande en attente', 'Partiellement occupé', 'Non occupé']
    colors = ['green', 'yellow', 'orange', 'red']
    colorsRGBA = [
      'rgba(0, 200, 0, 0.5)',
      'rgba(255, 255, 0, 0.5)',
      'rgba(255, 165, 0, 0.5)',
      'rgba(255, 0, 0, 0.5)',
    ]
  }

  legend.onAdd = function () {
    let legendContainer = L.DomUtil.create('div', 'info-legend')
    L.DomEvent.disableClickPropagation(legendContainer)

    legendContainer.style.setProperty('background-color', '#1a1a1a', 'important')
    legendContainer.style.setProperty('display', 'flex', 'important')
    legendContainer.style.setProperty('flex-direction', 'column', 'important')
    legendContainer.style.setProperty('padding', '15px', 'important')
    legendContainer.style.setProperty('gap', '10px', 'important')
    legendContainer.style.setProperty('border', '1px solid rgba(250, 250, 250, 0.2)', 'important')
    legendContainer.style.setProperty('border-radius', '12px', 'important')
    legendContainer.style.setProperty('margin', '20px', 'important')
    legendContainer.style.setProperty('z-index', '9999', 'important')
    legendContainer.style.setProperty('min-width', '150px', 'important')

    for (let i = 0; i < labels.length; i++) {
      let lineContainer = L.DomUtil.create('div', '', legendContainer)
      lineContainer.style.display = 'flex'
      lineContainer.style.alignItems = 'center'
      lineContainer.style.gap = '10px'

      let colorBox = L.DomUtil.create('div', '', lineContainer)
      colorBox.style.setProperty('background-color', colorsRGBA[i], 'important')
      colorBox.style.setProperty('width', '20px', 'important')
      colorBox.style.setProperty('height', '20px', 'important')
      colorBox.style.setProperty('border', `2px solid ${colors[i]}`, 'important')
      colorBox.style.flexShrink = '0'

      let span = L.DomUtil.create('span', '', lineContainer)
      span.innerText = labels[i]
      span.style.setProperty('color', '#fafafa', 'important')
      span.style.setProperty('font-size', '14px', 'important')
    }

    return legendContainer
  }

  legend.addTo(map)
}

function displayUnselectPanel(map, emit, mapMode, route) {
  const { t } = useI18n()

  const customControl = L.control({ position: 'topright' })
  customControl.onAdd = function () {
    const container = L.DomUtil.create('div', 'custom-panel')
    container.style.padding = '15px'
    container.style.backgroundColor = '#1fbd88'
    container.style.zIndex = '1000'
    container.style.backdropFilter = 'blur(8px)'
    container.style.color = '#fafafa'
    container.style.cursor = 'pointer'
    container.onclick = function () {
      emit('changeSelectedLocation', undefined)
      refreshLocations(map, emit, mapMode, route, undefined)
    }

    const label = L.DomUtil.create('b', 'custom-button', container)
    label.innerHTML = t('message.deselect')

    L.DomEvent.disableClickPropagation(container)

    return container
  }
  customControl.addTo(map)
}
