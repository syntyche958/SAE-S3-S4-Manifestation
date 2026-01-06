<template>
  <div class="statistics-container">
    <h2 class="text-2xl font-bold mb-6">{{ $t('message.statistics') }}</h2>
    <p class="text-gray-600 mb-8">
      Graphiques et visualisations basés sur les données publiées par les prestataires.
    </p>

    <!-- Loading state -->
    <div v-if="statsStore.loading" class="flex justify-center items-center h-64">
      <ProgressSpinner />
    </div>

    <!-- No data -->
    <div v-else-if="statsStore.totalSurveys === 0" class="text-center py-8">
      <p class="text-gray-500">Aucune donnée de sondage disponible pour afficher les statistiques.</p>
    </div>

    <!-- Stats cards -->
    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <Card class="text-center">
        <template #content>
          <div class="text-3xl font-bold text-blue-600">{{ statsStore.totalSurveys }}</div>
          <div class="text-gray-600 mt-2">Sondages totaux</div>
        </template>
      </Card>

      <Card class="text-center">
        <template #content>
          <div class="text-3xl font-bold text-green-600">{{ statsStore.averageSatisfaction }}</div>
          <div class="text-gray-600 mt-2">Satisfaction moyenne (/ 5)</div>
        </template>
      </Card>

      <Card class="text-center">
        <template #content>
          <div class="text-3xl font-bold text-purple-600">
            {{ Object.keys(statsStore.surveyStats?.reactionStats || {}).length }}
          </div>
          <div class="text-gray-600 mt-2">Types de réactions</div>
        </template>
      </Card>
    </div>

    <!-- Charts -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Satisfaction Distribution Chart -->
      <Card>
        <template #title>Distribution de la satisfaction</template>
        <template #content>
          <div style="position: relative; height: 300px">
            <canvas id="satisfactionChart"></canvas>
          </div>
        </template>
      </Card>

      <!-- Reactions Chart -->
      <Card>
        <template #title>Réactions des visiteurs</template>
        <template #content>
          <div style="position: relative; height: 300px">
            <canvas id="reactionsChart"></canvas>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import { useStatisticsStore } from '@/stores/statistics'
import { useSurveyStore } from '@/stores/surveys'
import { Card, ProgressSpinner } from 'primevue'
import { Chart, registerables } from 'chart.js'

// Enregistrer tous les composants Chart.js
Chart.register(...registerables)

const statsStore = useStatisticsStore()
const surveyStore = useSurveyStore()

let satisfactionChart = null
let reactionsChart = null

onMounted(async () => {
  // Charger les statistiques
  await statsStore.loadSurveyStatistics()
  
  // Dessiner les graphiques
  setTimeout(() => {
    drawCharts()
  }, 100)
})

// Redessiner les graphiques quand les statistiques changent
watch(
  () => statsStore.surveyStats,
  () => {
    drawCharts()
  }
)

function drawCharts() {
  if (!statsStore.surveyStats) return

  // Détruire les anciens graphiques s'ils existent
  if (satisfactionChart) {
    satisfactionChart.destroy()
  }
  if (reactionsChart) {
    reactionsChart.destroy()
  }

  const distribution = statsStore.surveyStats.ratingsDistribution || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  const reactions = statsStore.surveyStats.reactionStats || {}

  // Graphique 1: Distribution de satisfaction
  const satisfactionCtx = document.getElementById('satisfactionChart')
  if (satisfactionCtx) {
    satisfactionChart = new Chart(satisfactionCtx, {
      type: 'bar',
      data: {
        labels: ['Excellent (5)', 'Bon (4)', 'Neutre (3)', 'Mauvais (2)', 'Très mauvais (1)'],
        datasets: [
          {
            label: 'Nombre de réponses',
            data: [
              distribution[5] || 0,
              distribution[4] || 0,
              distribution[3] || 0,
              distribution[2] || 0,
              distribution[1] || 0,
            ],
            backgroundColor: ['#22c55e', '#84cc16', '#eab308', '#f97316', '#ef4444'],
            borderColor: ['#16a34a', '#65a30d', '#ca8a04', '#ea580c', '#dc2626'],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'x',
        plugins: {
          legend: {
            display: true,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
            },
          },
        },
      },
    })
  }

  // Graphique 2: Réactions
  const reactionsCtx = document.getElementById('reactionsChart')
  if (reactionsCtx && Object.keys(reactions).length > 0) {
    const reactionLabels = Object.keys(reactions)
    const reactionCounts = Object.values(reactions)

    reactionsChart = new Chart(reactionsCtx, {
      type: 'doughnut',
      data: {
        labels: reactionLabels.map((r) => `${r} (${reactions[r]})`),
        datasets: [
          {
            data: reactionCounts,
            backgroundColor: [
              '#ff6b6b',
              '#4ecdc4',
              '#45b7d1',
              '#96ceb4',
              '#ffeaa7',
              '#dfe6e9',
              '#a29bfe',
              '#fd79a8',
            ],
            borderColor: '#fff',
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
          },
        },
      },
    })
  }
}
</script>

<style scoped>
.statistics-container {
  padding: 2rem;
}
</style>