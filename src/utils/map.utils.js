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

// TODO : FIx popup des mouseover de la carte en mode visiteur !

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

export function displayLocations(
  map,
  mapMode,
  emit,
  route,
  selectedLocationId,
  visitorDateHour,
  visitorActivityId,
) {
  if (mapMode === MapModeEnum.VISITOR) {
    displayPinPoints(map, visitorDateHour, visitorActivityId)
  } else {
    // ADMIN + PROVIDER
    displayAreas(map, emit, mapMode, route, selectedLocationId)
    displayLegends(map, mapMode)
    displayUnselectPanel(map, emit, mapMode, route)
  }
}

export function refreshLocations(
  map,
  emit,
  mapMode,
  route,
  selectedLocationId,
  visitorDateHour,
  visitorActivityId,
) {
  if (mapMode === MapModeEnum.VISITOR) {
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer)
      }
    })
    displayPinPoints(map, visitorDateHour, visitorActivityId)
    return
  }

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

function bindPopupVisitor(map, marker, activitiesAtLocation) {
  const { t } = useI18n()

  const router = useRouter()

  let mouseOnPopUp = false
  let mouseOneMarker = false

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

    const popupContent = activitiesAtLocation
      .map(({ activity, provider }) => {
        return `<div class="visitor-popup-line" data-provider-id="${provider.id}" data-activity-id="${activity.id}" style="padding: 6px 2px; cursor: pointer;">
          <b>${t('message.provider')} : </b><span>${provider.name}</span><br>
          <b>${t('message.activity')} : </b><span>${activity.name}</span>
        </div>`
      })
      .join('<div style="border-top: 1px solid rgba(0,0,0,0.1);"></div>')

    marker.bindPopup(popupContent).openPopup()

    let popupElement = marker.getPopup().getElement()
    popupElement.addEventListener('mouseenter', () => (mouseOnPopUp = true))
    popupElement.addEventListener('mouseleave', () => {
      mouseOnPopUp = false
      marker.closePopup()
    })

    const clickables = popupElement.querySelectorAll('.visitor-popup-line')
    clickables.forEach((line) => {
      line.addEventListener('click', () => {
        const providerId = line.getAttribute('data-provider-id')
        const activityId = line.getAttribute('data-activity-id')
        if (!providerId || !activityId) return
        router.push(`/provider/${providerId}/activity/${activityId}`)
      })
    })
  })
}

function getVisitorActivitiesForLocation(locationId, visitorDateHour, visitorActivityId) {
  const activityStore = useActivityStore()
  const providerStore = useProviderStore()

  const selectedActivityId =
    visitorActivityId == null || visitorActivityId === '' ? null : Number(visitorActivityId)

  return (activityStore.activities || [])
    .filter((activity) => {
      if (selectedActivityId != null && activity.id !== selectedActivityId) return false
      return (activity.spotIds || []).some((spot) => {
        if (String(spot.locationId) !== String(locationId)) return false
        if (!visitorDateHour) return true
        return String(spot.dateHour) === String(visitorDateHour)
      })
    })
    .map((activity) => ({
      activity,
      provider: providerStore.get(activity.providerId),
    }))
    .filter((entry) => entry.provider != null)
    .sort((a, b) => {
      const providerCompare = a.provider.name.localeCompare(b.provider.name)
      if (providerCompare !== 0) return providerCompare
      return a.activity.name.localeCompare(b.activity.name)
    })
}

function displayPinPoints(map, visitorDateHour, visitorActivityId) {
  const locationStore = useLocationStore()

  for (let location of locationStore.locations) {
    const activitiesAtLocation = getVisitorActivitiesForLocation(
      location.id,
      visitorDateHour,
      visitorActivityId,
    )
    if (activitiesAtLocation.length === 0) continue

    let marker = L.marker(location['coord']).addTo(map)
    bindPopupVisitor(map, marker, activitiesAtLocation)
  }
}

function getAreaColor(locationId, mapMode, route) {
  const activityStore = useActivityStore()

  if (mapMode === MapModeEnum.PROVIDER) {
    const currentActivityId = Number(route.params.activity_id)
    const currentActivity = activityStore.get(currentActivityId)

    const hasConfirmedSpot = (currentActivity?.spotIds || []).some(
      (spot) => spot.locationId === locationId,
    )
    const hasPendingRequest = (currentActivity?.requestedSpotIds || []).some(
      (spot) => spot.locationId === locationId,
    )
    if (hasConfirmedSpot) return 'limegreen'
    if (hasPendingRequest) return 'gold'

    let hasFreeSlot = false
    for (const day of EVENT_DAYS) {
      for (let h = EVENT_START_HOUR; h <= EVENT_END_HOUR; h++) {
        const hourLabel = `${String(h).padStart(2, '0')}:00`
        const dateHour = `${day}T${hourLabel}`
        const occupied = activityStore.activities.some(
          (a) =>
            (a.spotIds || []).some(
              (s) => s.locationId === locationId && String(s.dateHour) === dateHour,
            ) ||
            (a.requestedSpotIds || []).some(
              (s) => s.locationId === locationId && String(s.dateHour) === dateHour,
            ),
        )
        if (!occupied) {
          hasFreeSlot = true
          break
        }
      }
      if (hasFreeSlot) break
    }
    if (hasFreeSlot) return 'dodgerblue'
    return 'crimson'
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
      t('message.providerLegendFree'),
      t('message.providerLegendSelf'),
      t('message.providerLegendPendingMap'),
      t('message.providerLegendOther'),
    ]
    colors = ['dodgerblue', 'limegreen', 'gold', 'crimson']
    colorsRGBA = [
      'rgba(56, 189, 248, 0.45)',
      'rgba(34, 197, 94, 0.45)',
      'rgba(234, 179, 8, 0.45)',
      'rgba(244, 63, 94, 0.45)',
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
