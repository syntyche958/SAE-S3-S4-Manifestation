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
    <div v-else-if="statsStore.totalSurveys === 0 && statsStore.totalRegistrations === 0" class="text-center py-12">
      <div class="text-6xl mb-4">📊</div>
      <p class="text-gray-500 text-lg">Aucune donnée disponible pour afficher les statistiques.</p>
      <p class="text-gray-400 text-sm mt-2">Les graphiques apparaîtront une fois que des interactions auront eu lieu sur le site.</p>
    </div>

    <!-- Stats content -->
    <div v-else>
      <!-- Stats cards -->
      <div class="flex justify-center mb-12">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
          <Card class="text-center shadow-lg hover:shadow-xl transition-shadow">
            <template #content>
              <div class="py-4">
                <div class="text-5xl font-bold text-emerald-600 mb-2">{{ statsStore.totalSurveys }}</div>
                <div class="text-gray-600 text-lg">Sondages totaux</div>
              </div>
            </template>
          </Card>

          <Card class="text-center shadow-lg hover:shadow-xl transition-shadow relative overflow-hidden">
            <template #content>
              <div class="py-4">
                <div class="text-5xl font-bold text-purple-600 mb-2">
                  {{ statsStore.totalRegistrations }}
                </div>
                <div class="text-gray-600 text-lg">Inscriptions totales</div>
              </div>

              <!-- Bande déroulante (Marquee) -->
              <div
                v-if="statsStore.generalStats?.registrationsPerActivity?.length"
                class="absolute bottom-0 left-0 w-full bg-purple-50 py-1 border-t border-purple-100 overflow-hidden"
              >
                <div class="marquee-content flex whitespace-nowrap gap-8">
                  <div
                    v-for="i in 2"
                    :key="i"
                    class="flex gap-8 items-center marquee-track"
                  >
                    <span
                      v-for="act in statsStore.generalStats.registrationsPerActivity"
                      :key="act.id"
                      class="text-xs font-semibold text-purple-700 uppercase tracking-wider"
                    >
                      {{ act.name }} :
                      <span class="text-purple-900">{{ act.count }}</span>
                    </span>
                  </div>
                </div>
              </div>
            </template>
          </Card>

          <Card class="text-center shadow-lg hover:shadow-xl transition-shadow">
            <template #content>
              <div class="py-4">
                <div class="text-5xl font-bold text-green-600 mb-2">
                  {{ statsStore.averageSatisfaction }}
                </div>
                <div class="text-gray-600 text-lg">
                  Satisfaction moyenne <span class="text-sm text-gray-400">(sur 5)</span>
                </div>
              </div>
            </template>
          </Card>
        </div>
      </div>

      <!-- Main Chats Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <!-- Satisfaction Chart -->
        <Card class="shadow-lg">
          <template #title>
            <div class="text-center text-xl">Distribution de la satisfaction</div>
          </template>
          <template #content>
            <div v-if="statsStore.totalSurveys > 0" style="position: relative; height: 350px" class="px-4">
              <canvas id="satisfactionChart"></canvas>
            </div>
            <div v-else class="flex justify-center items-center h-64 text-gray-400">
              Aucune donnée de satisfaction.
            </div>
          </template>
        </Card>

        <!-- User Distribution Chart -->
        <Card class="shadow-lg">
          <template #title>
            <div class="text-center text-xl">Utilisateurs inscrits (avec email)</div>
          </template>
          <template #content>
            <div style="position: relative; height: 350px" class="px-4">
              <canvas id="usersChart"></canvas>
            </div>
          </template>
        </Card>
      </div>

      <!-- Activities Per Day Chart -->
      <div class="flex justify-center">
        <div class="w-full max-w-3xl">
          <Card class="shadow-lg">
            <template #title>
              <div class="text-center text-xl">Nombre d'activités par jour</div>
            </template>
            <template #content>
              <div style="position: relative; height: 350px" class="px-4">
                <canvas id="activitiesChart"></canvas>
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
import { Card, ProgressSpinner } from 'primevue'
import { Chart, registerables } from 'chart.js'

// Enregistrer tous les composants Chart.js
Chart.register(...registerables)

const statsStore = useStatisticsStore()

let satisfactionChart = null
let usersChart = null
let activitiesChart = null

onMounted(async () => {
  // Charger les statistiques
  await Promise.all([statsStore.loadSurveyStatistics(), statsStore.loadGeneralStatistics()])

  // Dessiner les graphiques
  setTimeout(() => {
    drawCharts()
  }, 100)
})

// Redessiner les graphiques quand les statistiques changent
watch(
  () => [statsStore.surveyStats, statsStore.generalStats],
  () => {
    drawCharts()
  },
  { deep: true },
)

function drawCharts() {
  // Détruire les anciens graphiques s'ils existent
  if (satisfactionChart) satisfactionChart.destroy()
  if (usersChart) usersChart.destroy()
  if (activitiesChart) activitiesChart.destroy()

  // 1. Graphique: Distribution de satisfaction
  if (statsStore.surveyStats) {
    const distribution = statsStore.surveyStats.ratingsDistribution || {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    }
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
          plugins: {
            legend: { display: false },
          },
          scales: {
            y: { beginAtZero: true, ticks: { stepSize: 1 } },
          },
        },
      })
    }
  }

  // 2. Graphique: Répartition des inscrits (Prestataires vs Visiteurs)
  if (statsStore.generalStats) {
    const userCounts = statsStore.generalStats.userCounts || { provider: 0, visitor: 0 }
    const usersCtx = document.getElementById('usersChart')
    if (usersCtx) {
      usersChart = new Chart(usersCtx, {
        type: 'pie',
        data: {
          labels: ['Prestataires', 'Visiteurs'],
          datasets: [
            {
              data: [userCounts.provider || 0, userCounts.visitor || 0],
              backgroundColor: ['#10b981', '#f59e0b'],
              hoverOffset: 4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
          },
        },
      })
    }

    // 3. Graphique: Activités par jour
    const activitiesPerDay = statsStore.generalStats.activitiesPerDay || {
      Samedi: 0,
      Dimanche: 0,
    }
    const activitiesCtx = document.getElementById('activitiesChart')
    if (activitiesCtx) {
      activitiesChart = new Chart(activitiesCtx, {
        type: 'bar',
        data: {
          labels: Object.keys(activitiesPerDay),
          datasets: [
            {
              label: "Nombre d'activités",
              data: Object.values(activitiesPerDay),
              backgroundColor: '#8b5cf6',
              borderColor: '#7c3aed',
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
          scales: {
            y: { beginAtZero: true, ticks: { stepSize: 1 } },
          },
        },
      })
    }
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

.marquee-content {
  display: flex;
  width: max-content;
}

.marquee-track {
  animation: scroll 30s linear infinite;
}

@keyframes scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100%);
  }
}

/* Pause scroll on hover for readability */
.marquee-content:hover .marquee-track {
  animation-play-state: paused;
}
</style>
