<template>
  <div class="statistics-container">
    <!-- Header centré -->
    <div class="text-center mb-10">
      <h2 class="text-3xl font-bold mb-3">{{ $t('message.statistics') }}</h2>
      <p class="text-gray-600 text-lg">
        Graphiques et visualisations basés sur les données des sondages de satisfaction.
      </p>
    </div>

    <!-- Loading state -->
    <div v-if="statsStore.loading" class="flex justify-center items-center h-64">
      <ProgressSpinner />
    </div>

    <!-- No data -->
    <div v-else-if="statsStore.totalSurveys === 0" class="text-center py-12">
      <div class="text-6xl mb-4">📊</div>
      <p class="text-gray-500 text-lg">Aucune donnée de sondage disponible pour afficher les statistiques.</p>
      <p class="text-gray-400 text-sm mt-2">Les graphiques apparaîtront une fois que des visiteurs auront rempli le formulaire de satisfaction.</p>
    </div>

    <!-- Stats content -->
    <div v-else>
      <!-- Stats cards -->
      <div class="flex justify-center mb-12">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl w-full">
          <Card class="text-center shadow-lg hover:shadow-xl transition-shadow">
            <template #content>
              <div class="py-4">
                <div class="text-5xl font-bold text-blue-600 mb-2">{{ statsStore.totalSurveys }}</div>
                <div class="text-gray-600 text-lg">Sondages totaux</div>
              </div>
            </template>
          </Card>

          <Card class="text-center shadow-lg hover:shadow-xl transition-shadow">
            <template #content>
              <div class="py-4">
                <div class="text-5xl font-bold text-green-600 mb-2">{{ statsStore.averageSatisfaction }}</div>
                <div class="text-gray-600 text-lg">Satisfaction moyenne <span class="text-sm text-gray-400">(sur 5)</span></div>
              </div>
            </template>
          </Card>
        </div>
      </div>

      <!-- Chart centré -->
      <div class="flex justify-center">
        <div class="w-full max-w-4xl">
          <Card class="shadow-lg">
            <template #title>
              <div class="text-center text-2xl">Distribution de la satisfaction</div>
            </template>
            <template #content>
              <div style="position: relative; height: 400px" class="px-4">
                <canvas id="satisfactionChart"></canvas>
              </div>
            </template>
          </Card>
        </div>
      </div>
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

  // Détruire l'ancien graphique s'il existe
  if (satisfactionChart) {
    satisfactionChart.destroy()
  }

  const distribution = statsStore.surveyStats.ratingsDistribution || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }

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
            backgroundColor: ['#22c55e', '#84cc16', '#f97316', '#f97316', '#ef4444'],
            borderColor: ['#16a34a', '#65a30d', '#ea580c', '#ea580c', '#dc2626'],
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
}
</script>

<style scoped>
.statistics-container {
  padding: 3rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
  min-height: 100vh;
}

@media (max-width: 768px) {
  .statistics-container {
    padding: 2rem 1rem;
  }
}
</style>