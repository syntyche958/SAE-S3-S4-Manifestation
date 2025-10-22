<script setup>
import PresentationActivitySection from '@/components/activityComponents/PresentationActivitySection.vue'
import SideBarMenuActivity from '@/components/activityComponents/SideBarMenuActivity.vue'
import DescriptionActivitySection from '@/components/activityComponents/DescriptionActivitySection.vue'
import TheMap from '@/components/TheMap.vue'
import { MapModeEnum } from '@/enums/Map.enums.js'
</script>

<template>
  <div style="display: flex; gap: 20px">
    <div>
      <SideBarMenuActivity />
    </div>
    <div style="display: flex; flex-direction: column; justify-content: flex-start; gap: 20px">
      <PresentationActivitySection />

      <DescriptionActivitySection />

      <div style="margin: auto">
        <h2>Emplacement de l'activité</h2>
        <TheMap :display-mode="MapModeEnum.VISITOR" />
      </div>
    </div>
  </div>
</template>
