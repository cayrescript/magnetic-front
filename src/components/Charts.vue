<template>
  <div>
    <h2>Hits por Jogador</h2>
    <BarChart :chart-data="playerHitsData" :options="columnChartOptions" />
    <h2>Distribuição de Jogadores Canhotos e Destros</h2>
    <BarChart :chart-data="batsData" :options="barChartOptions" />

    <h2>Hits por Ano</h2>
    <BarChart :chart-data="hitsByYearData" :options="barChartOptions" />
  </div>
</template>

<script>
import { defineComponent, ref, watch } from 'vue';
import { ScatterChart, BarChart } from 'vue-chart-3';
import {
  Chart,
  LineController,
  BarController,
  ScatterController,
  LineElement,
  PointElement,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';
import { preparePlayerHitsData, prepareBatsData, prepareHitsByYearData, } from '../utils';

Chart.register(
  LineController,
  BarController,
  ScatterController,
  LineElement,
  PointElement,
  BarElement,
  CategoryScale,
  LinearScale
);

export default defineComponent({
  components: {
    ScatterChart,
    BarChart,
  },
  props: {
    hitsSingleSeason: {
      type: Array,
      required: true,
    }
  },
  setup(props) {

    const playerHitsData = ref({ labels: [], datasets: [] });
    const batsData = ref({ labels: [], datasets: [] });
    const hitsByYearData = ref({ labels: [], datasets: [] });

    watch(
      () => props.hitsSingleSeason,
      (newValue) => {
        if (newValue && newValue.length) {
          playerHitsData.value = preparePlayerHitsData(newValue);
          batsData.value = prepareBatsData(newValue);
          hitsByYearData.value = prepareHitsByYearData(newValue);
        }
      },
      { immediate: true }
    );

    const chartOptions = ref({
      scales: {
        x: { type: 'linear', min: 0, ticks: { beginAtZero: true } },
        y: { type: 'linear', min: 0, ticks: { beginAtZero: true } },
      },
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
        },
      },
    });

    const barChartOptions = ref({
      plugins: {
        title: {
          display: true,
          text: 'Chart.js Stacked Line/Bar Chart'
        }
      },
      scales: {
        y: {
          stacked: true
        }
      }
    });

    const columnChartOptions = ref({
      ...barChartOptions.value,
    });

    return { playerHitsData, batsData, chartOptions, barChartOptions, hitsByYearData, columnChartOptions };
  },
});
</script>
