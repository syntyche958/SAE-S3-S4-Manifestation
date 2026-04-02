import * as L from 'leaflet'
import { useLocationStore } from '@/stores/locations'
import { useActivityStore } from '@/stores/activities'
import { useProviderStore } from '@/stores/providers'
import { MapModeEnum } from '@/enums/Map.enums'
import { EVENT_DAYS, EVENT_END_HOUR, EVENT_START_HOUR } from '@/constants/event.constants'

const visitorMapClickCloseBound = new WeakSet()

function translateOrIdentity(t) {
  return t || ((key) => key)
}

function buildEventDateHours() {
  const dateHours = []
  for (const day of EVENT_DAYS) {
    for (let h = EVENT_START_HOUR; h <= EVENT_END_HOUR; h++) {
      const hourLabel = `${String(h).padStart(2, '0')}:00`
      dateHours.push(`${day}T${hourLabel}`)
    }
  }
  return dateHours
}

function hasAnySpotForLocationAndDateHour(activity, locationId, dateHour) {
  return (activity.spotIds || []).some(
    (spot) => spot.locationId === locationId && String(spot.dateHour) === dateHour,
  )
}

function hasAnyRequestedSpotForLocationAndDateHour(activity, locationId, dateHour) {
  return (activity.requestedSpotIds || []).some(
    (spot) => spot.locationId === locationId && String(spot.dateHour) === dateHour,
  )
}

function hasAtLeastOneFreeSlotForLocation(activities, locationId) {
  const eventDateHours = buildEventDateHours()
  for (const dateHour of eventDateHours) {
    const occupied = activities.some(
      (activity) =>
        hasAnySpotForLocationAndDateHour(activity, locationId, dateHour) ||
        hasAnyRequestedSpotForLocationAndDateHour(activity, locationId, dateHour),
    )
    if (!occupied) return true
  }
  return false
}

function getLocationSlotSummaryForAdmin(activities, locationId) {
  const totalSlots = EVENT_DAYS.length * (EVENT_END_HOUR - EVENT_START_HOUR + 1)

  let assignedCount = 0
  let hasRequest = false

  for (const activity of activities) {
    for (const spot of activity.spotIds || []) {
      if (spot.locationId === locationId) assignedCount++
    }
    if (!hasRequest) {
      hasRequest = (activity.requestedSpotIds || []).some((req) => req.locationId === locationId)
    }
  }

  return { totalSlots, assignedCount, hasRequest }
}

export function setupMap(mapId) {
  // Map setup
  const southWestBoundsCoords = L.latLng(43.203642, 2.36)
  const northEastBoundsCoords = L.latLng(43.209367, 2.37)
  const bounds = new L.LatLngBounds(southWestBoundsCoords, northEastBoundsCoords)
  const options = { maxBounds: bounds, minZoom: 17 }
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
  t,
  router,
) {
  if (mapMode === MapModeEnum.VISITOR) {
    displayPinPoints(map, visitorDateHour, t, router)
  } else {
    // ADMIN + PROVIDER
    displayAreas(map, emit, mapMode, route, selectedLocationId)
    displayLegends(map, mapMode, t)
    displayUnselectPanel(map, emit, mapMode, route, t, router)
  }
}

export function refreshLocations(
  map,
  emit,
  mapMode,
  route,
  selectedLocationId,
  visitorDateHour,
  t,
  router,
) {
  if (mapMode === MapModeEnum.VISITOR) {
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer)
      }
    })
    displayPinPoints(map, visitorDateHour, t, router)
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

function bindPopupVisitor(map, marker, activitiesAtLocation, t, router) {
  const translate = translateOrIdentity(t)
  const popupCloseDelayMs = 500

  let mouseOnPopUp = false
  let mouseOnMarker = false
  let closeTimer = null

  function clearCloseTimer() {
    if (closeTimer) {
      clearTimeout(closeTimer)
      closeTimer = null
    }
  }

  function schedulePopupClose() {
    clearCloseTimer()
    closeTimer = setTimeout(() => {
      if (!mouseOnPopUp && !mouseOnMarker) {
        marker.closePopup()
      }
    }, popupCloseDelayMs)
  }

  const popupContent = activitiesAtLocation
    .map(({ activity, provider }) => {
      return `<div class="visitor-popup-line" data-provider-id="${provider.id}" data-activity-id="${activity.id}" style="padding: 6px 2px; cursor: pointer;">
        <b>${translate('message.provider')} : </b><span>${provider.name}</span><br>
        <b>${translate('message.activity')} : </b><span>${activity.name}</span>
      </div>`
    })
    .join('<div style="border-top: 1px solid rgba(0,0,0,0.1);"></div>')

  marker.bindPopup(popupContent)

  // Open on hover and close only when mouse leaves both marker and popup.
  marker.on('mouseover', () => {
    clearCloseTimer()
    map.closePopup()
    mouseOnMarker = true
    marker.openPopup()
  })

  marker.on('mouseout', () => {
    mouseOnMarker = false
    if (!mouseOnPopUp) schedulePopupClose()
  })

  marker.on('popupopen', () => {
    const popupElement = marker.getPopup()?.getElement()
    if (!popupElement) return

    popupElement.onmouseenter = () => {
      clearCloseTimer()
      mouseOnPopUp = true
    }
    popupElement.onmouseleave = () => {
      mouseOnPopUp = false
      if (!mouseOnMarker) schedulePopupClose()
    }

    const clickables = popupElement.querySelectorAll('.visitor-popup-line')
    clickables.forEach((line) => {
      line.onclick = () => {
        const providerId = line.getAttribute('data-provider-id')
        const activityId = line.getAttribute('data-activity-id')
        if (!providerId || !activityId || !router) return
        router.push(`/provider/${providerId}/activity/${activityId}`)
      }
    })
  })

  marker.on('popupclose', () => {
    mouseOnPopUp = false
    clearCloseTimer()
  })
}

function getVisitorActivitiesForLocation(locationId, visitorDateHour) {
  const activityStore = useActivityStore()
  const providerStore = useProviderStore()

  return (activityStore.activities || [])
    .filter((activity) => {
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

function displayPinPoints(map, visitorDateHour, t, router) {
  const locationStore = useLocationStore()

  if (!visitorMapClickCloseBound.has(map)) {
    map.on('click', () => {
      map.closePopup()
    })
    visitorMapClickCloseBound.add(map)
  }

  for (let location of locationStore.locations) {
    const activitiesAtLocation = getVisitorActivitiesForLocation(location.id, visitorDateHour)
    if (activitiesAtLocation.length === 0) continue

    let marker = L.marker(location['coord']).addTo(map)
    bindPopupVisitor(map, marker, activitiesAtLocation, t, router)
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

    const hasFreeSlot = hasAtLeastOneFreeSlotForLocation(activityStore.activities, locationId)
    if (hasFreeSlot) return 'dodgerblue'
    return 'crimson'
  }

  const { totalSlots, assignedCount, hasRequest } = getLocationSlotSummaryForAdmin(
    activityStore.activities,
    locationId,
  )
  if (assignedCount >= totalSlots) return 'green'
  if (hasRequest) return 'yellow'
  if (assignedCount > 0) return 'orange'
  return 'red'
}

function displayAreas(map, emit, mapMode, route, selectedLocationId) {
  const defaultPolygonWeight = 2
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
  }
}

function displayLegends(map, mapMode, t) {
  const translate = translateOrIdentity(t)

  const legend = L.control({ position: 'topleft' })
  let labels, colors, colorsRGBA

  if (mapMode === MapModeEnum.PROVIDER) {
    labels = [
      translate('message.providerLegendFree'),
      translate('message.providerLegendSelf'),
      translate('message.providerLegendPendingMap'),
      translate('message.providerLegendOther'),
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

function displayUnselectPanel(map, emit, mapMode, route, t, router) {
  const translate = translateOrIdentity(t)

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
      refreshLocations(map, emit, mapMode, route, undefined, undefined, t, router)
    }

    const label = L.DomUtil.create('b', 'custom-button', container)
    label.innerHTML = translate('message.deselect')

    L.DomEvent.disableClickPropagation(container)

    return container
  }
  customControl.addTo(map)
}
