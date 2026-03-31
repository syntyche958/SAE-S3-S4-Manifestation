<script setup>
import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useRoute } from 'vue-router'
import ProviderStatisticsService from '@/services/providerStatistics.service'
import { Chart, registerables } from 'chart.js'
import Card from 'primevue/card'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import ProgressSpinner from 'primevue/progressspinner'

Chart.register(...registerables)

const props = defineProps({
  providerId: {
    type: [String, Number],
    required: false,
  },
})

const { t } = useI18n()
const route = useRoute()
const toast = useToast()

const activities = ref([])
const registrations = ref([])
const loading = ref(true)

let chartByActivity = null
let chartByDay = null

const destroyCharts = () => {
  if (chartByActivity) {
    chartByActivity.destroy()
    chartByActivity = null
  }
  if (chartByDay) {
    chartByDay.destroy()
    chartByDay = null
  }
}

const totalRegistrations = computed(() => registrations.value.length)

const registrationsByActivity = computed(() =>
  ProviderStatisticsService.calculateRegistrationsByActivity(activities.value, registrations.value),
)

const registrationsByDay = computed(() =>
  ProviderStatisticsService.calculateRegistrationsByDay(activities.value, registrations.value),
)

const registrationsByActivityAndDay = computed(() =>
  ProviderStatisticsService.calculateRegistrationsByActivityAndDay(
    activities.value,
    registrations.value,
  ),
)

const loadData = async () => {
  try {
    loading.value = true
    const providerId = props.providerId || route.params.provider_id

    if (!providerId) {
      throw new Error('Aucun ID de prestataire fourni')
    }

    const result = await ProviderStatisticsService.getProviderStatistics(providerId)

    if (result.success) {
      activities.value = result.data.activities
      registrations.value = result.data.registrations
    } else {
      throw new Error(result.error)
    }
  } catch (error) {
    console.error('Erreur:', error)
    toast.add({
      severity: 'error',
      summary: t('message.error'),
      detail: t('message.cannotLoadStats'),
      life: 3000,
    })
  } finally {
    loading.value = false
  }
}

const axisStyle = {
  y: {
    beginAtZero: true,
    ticks: { stepSize: 1, color: '#fafafa' },
    grid: { color: 'rgba(250, 250, 250, 0.1)' },
  },
  x: {
    ticks: { color: '#fafafa' },
    grid: { color: 'rgba(250, 250, 250, 0.1)' },
  },
}

const drawCharts = () => {
  if (chartByActivity) chartByActivity.destroy()
  if (chartByDay) chartByDay.destroy()

  const ctxActivity = document.getElementById('chartActivity')
  if (ctxActivity && registrationsByActivity.value.length > 0) {
    chartByActivity = new Chart(ctxActivity, {
      type: 'bar',
      data: {
        labels: registrationsByActivity.value.map((item) => item.name),
        datasets: [
          {
            label: t('message.registrationCount'),
            data: registrationsByActivity.value.map((item) => item.count),
            backgroundColor: '#3b82f6',
            borderColor: '#2563eb',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
        },
        scales: axisStyle,
      },
    })
  }

  const ctxDay = document.getElementById('chartDay')
  if (ctxDay && registrationsByDay.value.length > 0) {
    chartByDay = new Chart(ctxDay, {
      type: 'line',
      data: {
        labels: registrationsByDay.value.map((item) => item.date),
        datasets: [
          {
            label: t('message.registrationCount'),
            data: registrationsByDay.value.map((item) => item.count),
            backgroundColor: 'rgba(34, 197, 94, 0.2)',
            borderColor: '#22c55e',
            borderWidth: 2,
            tension: 0.4,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
        },
        scales: axisStyle,
      },
    })
  }
}

onMounted(async () => {
  await loadData()
  drawCharts()
})

watch([registrationsByActivity, registrationsByDay], () => {
  drawCharts()
})

onBeforeUnmount(() => {
  destroyCharts()
})
</script>

<template>
  <div class="statistics-container">
    <h1 class="page-title">{{ $t('message.registrationStats') }}</h1>

    <ProgressSpinner v-if="loading" class="spinner" />

    <div v-else class="statistics-content">
      <Card class="summary-card">
        <template #title><i class="pi pi-chart-line"></i> {{ $t('message.overview') }}</template>
        <template #content>
          <div class="summary-stat">
            <span class="stat-label">{{ $t('message.totalRegistrationsLabel') }}</span>
            <span class="stat-value">{{ totalRegistrations }}</span>
          </div>
          <div class="summary-stat">
            <span class="stat-label">{{ $t('message.numberOfActivitiesLabel') }}</span>
            <span class="stat-value">{{ activities.length }}</span>
          </div>
        </template>
      </Card>

      <div class="charts-grid">
        <Card class="chart-card shadow-lg !bg-[#1A1A1A] !border-surface-700/50">
          <template #title>
            <div class="chart-title"><i class="pi pi-chart-bar"></i> {{ $t('message.registrationsPerActivity') }}</div>
          </template>
          <template #content>
            <div v-if="registrationsByActivity.length > 0" class="chart-wrapper">
              <canvas id="chartActivity"></canvas>
            </div>
            <div v-else class="no-data">
              <i class="pi pi-info-circle"></i>
              <p>{{ $t('message.noRegistration') }}</p>
            </div>
          </template>
        </Card>

        <Card class="chart-card shadow-lg !bg-[#1A1A1A] !border-surface-700/50">
          <template #title>
            <div class="chart-title"><i class="pi pi-calendar"></i> {{ $t('message.registrationsPerDay') }}</div>
          </template>
          <template #content>
            <div v-if="registrationsByDay.length > 0" class="chart-wrapper">
              <canvas id="chartDay"></canvas>
            </div>
            <div v-else class="no-data">
              <i class="pi pi-info-circle"></i>
              <p>{{ $t('message.noRegistration') }}</p>
            </div>
          </template>
        </Card>
      </div>

      <Card class="stats-card">
        <template #title><i class="pi pi-table"></i> {{ $t('message.detailPerActivity') }}</template>
        <template #content>
          <DataTable
            :value="registrationsByActivityAndDay"
            :rows="10"
            :paginator="registrationsByActivityAndDay.length > 10"
            sortField="activityName"
            :sortOrder="1"
          >
            <Column field="activityName" :header="$t('message.activity')" sortable></Column>
            <Column field="date" :header="$t('message.date')" sortable></Column>
            <Column
              field="count"
              :header="$t('message.registrationCount')"
              sortable
              bodyClass="count-col"
              headerClass="count-col-header"
              style="width: 180px"
            >
              <template #body="slotProps">
                <Tag :value="slotProps.data.count" class="stats-count-tag" />
              </template>
            </Column>
          </DataTable>

          <div v-if="registrationsByActivityAndDay.length === 0" class="no-data">
            <i class="pi pi-info-circle"></i>
            <p>{{ $t('message.noRegistrationYet') }}</p>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<style scoped>
.statistics-container {
  padding: 0.5rem;
  max-width: 1400px;
  margin: 0 auto;
}

.page-title {
  font-size: clamp(1.5rem, 2.8vw, 2rem);
  font-weight: 700;
  margin-bottom: 1.25rem;
  line-height: 1.2;
}

.spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.statistics-content {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.summary-card {
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.summary-card :deep(.p-card-title) {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.summary-stat {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.95rem 1rem;
  background: #1a1a1a;
  border-radius: 12px;
  margin-bottom: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.summary-stat:last-child {
  margin-bottom: 0;
}

.stat-label {
  font-size: 1rem;
  font-weight: 500;
  color: #d4d4d8;
}

.stat-value {
  font-size: clamp(1.6rem, 2.4vw, 2rem);
  font-weight: 700;
  color: #fafafa;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.25rem;
}

.chart-card,
.stats-card {
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.chart-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #fafafa;
  text-align: center;
}

.chart-wrapper {
  position: relative;
  height: 340px;
  padding: 0.25rem 0.75rem 0.75rem;
}

.stats-card :deep(.p-card-title) {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.no-data {
  text-align: center;
  padding: 2rem 1.5rem;
  color: #a1a1aa;
}

.no-data i {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

@media (max-width: 768px) {
  .statistics-container {
    padding: 0.2rem;
  }

  .charts-grid {
    grid-template-columns: 1fr;
  }

  .chart-wrapper {
    height: 300px;
    padding: 0;
  }
}

.stats-card :deep(.p-datatable-table) {
  font-size: 0.92rem;
}

.stats-card :deep(.p-datatable-thead > tr > th),
.stats-card :deep(.p-datatable-tbody > tr > td) {
  padding: 0.65rem 0.75rem;
}

.stats-card :deep(.count-col-header),
.stats-card :deep(.count-col) {
  text-align: center;
}

.stats-card :deep(.count-col .stats-count-tag) {
  margin: 0 auto;
  min-width: 2.1rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.95rem;
  color: #f8fbff;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  border: 1px solid rgba(191, 219, 254, 0.55);
  border-radius: 999px;
  box-shadow: 0 2px 10px rgba(37, 99, 235, 0.35);
}

.stats-card :deep(.p-datatable-tbody > tr:hover > td) {
  background-color: rgba(255, 255, 255, 0.06);
}
</style>
