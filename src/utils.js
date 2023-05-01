const aggregateHitsByYear = (data) => {
  const hitsByYear = {};

  data.forEach((player) => {
    const year = player.year;
    const hits = player.hits;

    if (!hitsByYear[year]) {
      hitsByYear[year] = 0;
    }

    hitsByYear[year] += hits;
  });

  return hitsByYear;
};

export const generateRandomColor = () => {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgba(${r}, ${g}, ${b}, 1)`;
};

export const preparePlayerHitsData = (hitsData) => {
  const playersByYear = hitsData.reduce((accumulator, player) => {
    if (!accumulator[player.year]) {
      accumulator[player.year] = player;
    } else if (accumulator[player.year].hits < player.hits) {
      accumulator[player.year] = player;
    }
    return accumulator;
  }, {});

  const datasets = [
    {
      label: 'Hits',
      data: Object.values(playersByYear).map((player) => ({
        x: player.year,
        y: player.hits,
      })),
      backgroundColor: generateRandomColor(),
      borderWidth: 1,
    },
  ];

  return {
    labels: Object.keys(playersByYear).map((year) => year),
    datasets,
  };
};



export const prepareBatsData = (hitsData) => {
  const leftHand = hitsData.filter((player) => player.bats === 'L').length;
  const bothHands = hitsData.filter((player) => player.bats === 'B').length;
  const rightHand = hitsData.filter((player) => player.bats === 'R').length;

  return {
    labels: ['Left', 'Both', 'Right'],
    datasets: [
      {
        label: 'Bats',
        data: [leftHand, bothHands, rightHand],
        backgroundColor: [
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(255, 206, 86, 0.2)',
        ],
        borderColor: [
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };
};

export const prepareHitsByYearData = (hitsData) => {
  const hitsByYear = aggregateHitsByYear(hitsData);

  return {
    labels: Object.keys(hitsByYear).sort((a, b) => a - b),
    datasets: [
      {
        label: "Hits por Ano",
        data: Object.values(hitsByYear),
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };
};


