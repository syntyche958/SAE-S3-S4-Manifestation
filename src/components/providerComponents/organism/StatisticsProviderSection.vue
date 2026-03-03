<script setup>
import { ref, onMounted, computed } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useRoute } from 'vue-router';
import ProviderStatisticsService from '@/services/providerStatistics.service';

import Card from 'primevue/card';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';
import ProgressSpinner from 'primevue/progressspinner';

const props = defineProps({
  providerId: {
    type: [String, Number],
    required: false
  }
});

const route = useRoute();
const toast = useToast();
//const authStore = useAuthStore();

const activities = ref([]);
const registrations = ref([]);
const loading = ref(true);

const totalRegistrations = computed(() => registrations.value.length);

const registrationsByActivity = computed(() => 
  ProviderStatisticsService.calculateRegistrationsByActivity(activities.value, registrations.value)
);

const registrationsByDay = computed(() => 
  ProviderStatisticsService.calculateRegistrationsByDay(activities.value, registrations.value)
);

const registrationsByActivityAndDay = computed(() => 
  ProviderStatisticsService.calculateRegistrationsByActivityAndDay(activities.value, registrations.value)
);

const loadData = async () => {
  try {
    loading.value = true;

    const providerId = props.providerId || route.params.provider_id;

    console.log('📊 Provider ID:', providerId);

    if (!providerId) {
      throw new Error('Aucun ID de prestataire fourni');
    }
    
    const result = await ProviderStatisticsService.getProviderStatistics(providerId);
    
    if (result.success) {
      activities.value = result.data.activities;
      registrations.value = result.data.registrations;
    } else {
      throw new Error(result.error);
    }
    
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error);
    toast.add({
      severity: 'error',
      summary: 'Erreur',
      detail: 'Impossible de charger les statistiques',
      life: 3000
    });
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadData();
});
</script>

<template>
  <div class="statistics-container">
    <h1 class="page-title">Statistiques des inscriptions</h1>
    
    <ProgressSpinner v-if="loading" class="spinner" />
    
    <div v-else class="statistics-content">
      <Card class="summary-card">
        <template #title>
          <i class="pi pi-chart-line"></i> Vue d'ensemble
        </template>
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

      <Card class="stats-card">
        <template #title>
          <i class="pi pi-calendar"></i> Inscriptions par activité
        </template>
        <template #content>
          <DataTable 
            :value="registrationsByActivity" 
            :rows="10"
            :paginator="registrationsByActivity.length > 10"
            responsiveLayout="scroll"
            class="stats-table"
          >
            <Column field="name" header="Activité" sortable></Column>
            <Column field="count" header="Nombre d'inscrits" sortable>
              <template #body="slotProps">
                <Tag :value="slotProps.data.count" severity="info" />
              </template>
            </Column>
          </DataTable>
          
          <div v-if="registrationsByActivity.length === 0" class="no-data">
            <i class="pi pi-info-circle"></i>
            <p>Aucune inscription pour le moment</p>
          </div>
        </template>
      </Card>

      <Card class="stats-card">
        <template #title>
          <i class="pi pi-calendar-plus"></i> Inscriptions par jour
        </template>
        <template #content>
          <DataTable 
            :value="registrationsByDay" 
            :rows="10"
            :paginator="registrationsByDay.length > 10"
            responsiveLayout="scroll"
            class="stats-table"
          >
            <Column field="date" header="Date" sortable></Column>
            <Column field="count" header="Nombre d'inscrits" sortable>
              <template #body="slotProps">
                <Tag :value="slotProps.data.count" severity="success" />
              </template>
            </Column>
          </DataTable>
          
          <div v-if="registrationsByDay.length === 0" class="no-data">
            <i class="pi pi-info-circle"></i>
            <p>Aucune inscription pour le moment</p>
          </div>
        </template>
      </Card>

      <Card class="stats-card">
        <template #title>
          <i class="pi pi-table"></i> Détail par activité et par jour
        </template>
        <template #content>
          <DataTable 
            :value="registrationsByActivityAndDay" 
            :rows="10"
            :paginator="registrationsByActivityAndDay.length > 10"
            responsiveLayout="scroll"
            class="stats-table"
            sortField="activityName"
            :sortOrder="1"
          >
            <Column field="activityName" header="Activité" sortable></Column>
            <Column field="date" header="Date" sortable></Column>
            <Column field="count" header="Nombre d'inscrits" sortable>
              <template #body="slotProps">
                <Tag :value="slotProps.data.count" severity="warning" />
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
  color: var(--primary-color);
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
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-600) 100%);
  color: white;
}

.summary-card :deep(.p-card-title) {
  color: white;
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
}

.summary-stat:last-child {
  margin-bottom: 0;
}

.stat-label {
  font-size: 1.1rem;
  font-weight: 500;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
}

.stats-card :deep(.p-card-title) {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-color);
}

.stats-table {
  margin-top: 1rem;
}

.no-data {
  text-align: center;
  padding: 3rem 2rem;
  color: var(--text-color-secondary);
}

.no-data i {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.no-data p {
  font-size: 1.1rem;
  margin: 0;
}

@media (max-width: 768px) {
  .statistics-container {
    padding: 1rem;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .stat-value {
    font-size: 1.5rem;
  }
}
</style>