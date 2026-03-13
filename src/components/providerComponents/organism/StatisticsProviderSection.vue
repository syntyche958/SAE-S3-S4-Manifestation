<script setup>
import { ref, onMounted, computed, watch } from 'vue'
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
    required: false
  }
})

const route = useRoute()
const toast = useToast()

const activities = ref([])
const registrations = ref([])
const loading = ref(true)

let chartByActivity = null
let chartByDay = null

const totalRegistrations = computed(() => registrations.value.length)

const registrationsByActivity = computed(() => 
  ProviderStatisticsService.calculateRegistrationsByActivity(activities.value, registrations.value)
)

const registrationsByDay = computed(() => 
  ProviderStatisticsService.calculateRegistrationsByDay(activities.value, registrations.value)
)

const registrationsByActivityAndDay = computed(() => 
  ProviderStatisticsService.calculateRegistrationsByActivityAndDay(activities.value, registrations.value)
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
      summary: 'Erreur',
      detail: 'Impossible de charger les statistiques',
      life: 3000
    })
  } finally {
    loading.value = false
  }
}

const drawCharts = () => {
  // Détruire anciens graphiques
  if (chartByActivity) chartByActivity.destroy()
  if (chartByDay) chartByDay.destroy()

  // Graphique par activité
  const ctxActivity = document.getElementById('chartActivity')
  if (ctxActivity && registrationsByActivity.value.length > 0) {
    chartByActivity = new Chart(ctxActivity, {
      type: 'bar',
      data: {
        labels: registrationsByActivity.value.map(item => item.name),
        datasets: [{
          label: 'Nombre d\'inscrits',
          data: registrationsByActivity.value.map(item => item.count),
          backgroundColor: '#3b82f6',
          borderColor: '#2563eb',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: { beginAtZero: true, ticks: { stepSize: 1 } }
        }
      }
    })
  }

  // Graphique par jour
  const ctxDay = document.getElementById('chartDay')
  if (ctxDay && registrationsByDay.value.length > 0) {
    chartByDay = new Chart(ctxDay, {
      type: 'line',
      data: {
        labels: registrationsByDay.value.map(item => item.date),
        datasets: [{
          label: 'Nombre d\'inscrits',
          data: registrationsByDay.value.map(item => item.count),
          backgroundColor: 'rgba(34, 197, 94, 0.2)',
          borderColor: '#22c55e',
          borderWidth: 2,
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: { beginAtZero: true, ticks: { stepSize: 1 } }
        }
      }
    })
  }
}

onMounted(() => {
  loadData().then(() => {
    setTimeout(() => drawCharts(), 200)
  })
})

watch([registrationsByActivity, registrationsByDay], () => {
  setTimeout(() => drawCharts(), 100)
})
</script>

<template>
  <div class="statistics-container">
    <h1 class="page-title">Statistiques des inscriptions</h1>
    
    <ProgressSpinner v-if="loading" class="spinner" />
    
    <div v-else class="statistics-content">
      <Card class="summary-card">
        <template #title><i class="pi pi-chart-line"></i> Vue d'ensemble</template>
        <template #content>
          <div class="summary-stat">
            <span class="stat-label">Total des inscriptions :</span>
            <span class="stat-value">{{ totalRegistrations }}</span>
          </div>
          <div class="summary-stat">
            <span class="stat-label">Nombre d'activités :</span>
            <span class="stat-value">{{ activities.length }}</span>
          </div>
        </template>
      </Card>

      <!-- Graphiques -->
      <div class="charts-grid">
        <Card class="chart-card">
          <template #title><i class="pi pi-chart-bar"></i> Inscriptions par activité</template>
          <template #content>
            <div v-if="registrationsByActivity.length > 0" class="chart-wrapper">
              <canvas id="chartActivity"></canvas>
            </div>
            <div v-else class="no-data">
              <i class="pi pi-info-circle"></i>
              <p>Aucune inscription</p>
            </div>
          </template>
        </Card>

        <Card class="chart-card">
          <template #title><i class="pi pi-calendar"></i> Inscriptions par jour</template>
          <template #content>
            <div v-if="registrationsByDay.length > 0" class="chart-wrapper">
              <canvas id="chartDay"></canvas>
            </div>
            <div v-else class="no-data">
              <i class="pi pi-info-circle"></i>
              <p>Aucune inscription</p>
            </div>
          </template>
        </Card>
      </div>

      <!-- Tableaux détaillés -->
      <Card class="stats-card">
        <template #title><i class="pi pi-table"></i> Détail par activité et par jour</template>
        <template #content>
          <DataTable 
            :value="registrationsByActivityAndDay" 
            :rows="10"
            :paginator="registrationsByActivityAndDay.length > 10"
            sortField="activityName"
            :sortOrder="1"
          >
            <Column field="activityName" header="Activité" sortable></Column>
            <Column field="date" header="Date" sortable></Column>
            <Column field="count" header="Nombre d'inscrits" sortable>
              <template #body="slotProps">
                <Tag :value="slotProps.data.count" severity="info" />
              </template>
            </Column>
          </DataTable>
          
          <div v-if="registrationsByActivityAndDay.length === 0" class="no-data">
            <i class="pi pi-info-circle"></i>
            <p>Aucune inscription pour le moment</p>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<style scoped>
.statistics-container {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.page-title {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 2rem;
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
  gap: 2rem;
}

.summary-card {
  background: white;
  color: inherit;
  border: 1px solid #e5e7eb;
}

.summary-card :deep(.p-card-title) {
  color: inherit;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.summary-stat {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  margin-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.summary-stat:last-child {
  margin-bottom: 0;
  border-bottom: none;
}

.stat-label {
  font-size: 1.1rem;
  font-weight: 500;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
  gap: 2rem;
}

.chart-card :deep(.p-card-title) {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.chart-wrapper {
  position: relative;
  height: 300px;
  padding: 1rem;
}

.stats-card :deep(.p-card-title) {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.no-data {
  text-align: center;
  padding: 3rem 2rem;
  color: #9ca3af;
}

.no-data i {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

@media (max-width: 768px) {
  .statistics-container {
    padding: 1rem;
  }
  .charts-grid {
    grid-template-columns: 1fr;
  }
}
</style>