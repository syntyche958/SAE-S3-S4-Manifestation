<template>
  <div class="flex flex-col sm:flex-row sm:items-center p-4 gap-3 bg-surface-50 rounded-border border border-surface-200">

    <div class="flex-1">
      <div class="flex items-center justify-between mb-2">
        <span class="font-bold text-lg">{{ activityName }}</span>
        <Tag :value="'Session #' + item.id" severity="info"></Tag>
      </div>

      <div class="flex flex-col gap-1 text-sm text-surface-600 dark:text-surface-300">
        <div class="flex items-center gap-2">
          <i class="pi pi-calendar"></i>
          <span>{{ item.beginingDate }}</span>
        </div>
        <div class="flex items-center gap-2">
            <i class="pi pi-clock"></i>
            <span>{{ item.beginingHour }} ({{ item.duration }} min)</span>
        </div>
      </div>
    </div>

    <div class="flex sm:flex-col gap-2 mt-2 sm:mt-0">
      <Button
        icon="pi pi-eye"
        text
        rounded
        v-tooltip.top="'Voir l\'activité'"
        @click="$emit('go-to-activity', item.activitiesId)"
      />
    </div>

  </div>
</template>

<script setup>
import Button from 'primevue/button'
import Tag from 'primevue/tag'

const props = defineProps({
  item: Object,
  activityName: String
})

defineEmits(['go-to-activity'])
</script>
