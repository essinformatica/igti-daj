// function getGlobalSummary() {
//   fetch('https://api.covid19api.com/summary').then(function(response) {
//       if(response.ok) {
//           return response.json().then(function(json) {
//               showData(json.Global);
//           });
//       } else {
//           console.log('Network response was not ok.');
//       }
//   })
//   .catch(function(error) {
//       console.log('There has been a problem with your fetch operation: ' + error.message);
//   });
// };

// function showData(data) {
//   const confirmed = document.getElementById("confirmed");
//   const death = document.getElementById("death");
//   const recovered = document.getElementById("recovered");
//   const today = document.getElementById("today");

//   var todayDate = new Date();
//   var date = todayDate.getDate().toString().padStart(2, '0') + '/'+(todayDate.getMonth()+1).toString().padStart(2, '0') + '/' + todayDate.getFullYear();
//   var time = todayDate.getHours().toString().padStart(2, '0') + ":" + todayDate.getMinutes().toString().padStart(2, '0') + ":" + todayDate.getSeconds().toString().padStart(2, '0');
//   var dateTime = date+' '+time;

//   confirmed.innerHTML = (new Intl.NumberFormat().format(data.TotalConfirmed));
//   death.innerHTML = (new Intl.NumberFormat().format(data.TotalDeaths));
//   recovered.innerHTML = (new Intl.NumberFormat().format(data.TotalRecovered));

//   today.innerHTML = dateTime;

//   new Chart(document.getElementById("pizza"), {
//       type: 'pie',
//       data: {
//           labels: ["Confirmados", "Recuperados", "Mortes"],
//           datasets: [{
//               label: "Casos",
//               backgroundColor: [
//                   'rgb(255, 99, 132)',
//                   'rgb(54, 162, 235)',
//                   'rgb(255, 205, 86)'
//               ],
//               data: [data.TotalConfirmed, data.TotalDeaths, data.TotalRecovered]
//           }]
//       },
//       options: {
//           plugins: {
//               title: {
//                   display: true,
//                   text: 'Distribuição de novos casos'
//               }
//           }
//       }
//   });
// }

// getGlobalSummary();

function getGlobalSummary() {
  fetch('https://api.covid19api.com/summary')
    .then(function (response) {
      if (response.ok) {
        return response.json().then(function (json) {
          showData(json.Global);
        });
      } else {
        console.log('Network response was not ok.');
      }
    })
    .catch(function (error) {
      console.log(
        'There has been a problem with your fetch operation: ' + error.message
      );
    });
}

function showData(data) {
  const confirmed = document.getElementById('confirmed');
  const death = document.getElementById('death');
  const recovered = document.getElementById('recovered');
  const today = document.getElementById('today');

  var todayDate = new Date();
  var date =
    todayDate.getDate().toString().padStart(2, '0') +
    '/' +
    (todayDate.getMonth() + 1).toString().padStart(2, '0') +
    '/' +
    todayDate.getFullYear();
  var time =
    todayDate.getHours().toString().padStart(2, '0') +
    ':' +
    todayDate.getMinutes().toString().padStart(2, '0') +
    ':' +
    todayDate.getSeconds().toString().padStart(2, '0');
  var dateTime = date + ' ' + time;

  confirmed.innerHTML = new Intl.NumberFormat().format(data.TotalConfirmed);
  death.innerHTML = new Intl.NumberFormat().format(data.TotalDeaths);
  recovered.innerHTML = new Intl.NumberFormat().format(data.TotalRecovered);

  today.innerHTML = dateTime;

  new Chart(document.getElementById('pizza'), {
    type: 'pie',
    data: {
      labels: ['Confirmados', 'Recuperados', 'Mortes'],
      datasets: [
        {
          label: 'Casos',
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)',
          ],
          data: [data.TotalConfirmed, data.TotalRecovered, data.TotalDeaths],
        },
      ],
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: 'Distribuição de novos casos',
        },
      },
    },
  });
}

getGlobalSummary();

(async () => {
  let response = await Promise.allSettled([
    fetch('https://api.covid19api.com/summary'),
  ]);

  if (response[0].status == 'fulfilled') {
    loadChartBar(await response[0].value.json());
  }
})();
function loadChartBar(data) {
  let oCountries = data.Countries.map((country) => {
    const { Country, TotalDeaths } = country;

    return {
      Country: Country,
      TotalDeaths: TotalDeaths,
    };
  });
  let dataSorted = oCountries;
  let countries = dataSorted.sort((a, b) => {
    if (a.TotalDeaths < b.TotalDeaths) {
      return 1;
    }
    if (a.TotalDeaths > b.TotalDeaths) {
      return -1;
    }
    // a must be equal to b
    return 0;
  });
  let totalDeath = [];
  let nCountries = [];
  for (index in countries.slice(0, 10)) {
    totalDeath.push(countries[index].TotalDeaths);
    nCountries.push(countries[index].Country);
  }

  let bar = new Chart(document.getElementById('barras'), {
    type: 'bar',
    data: {
      labels: [...nCountries],
      datasets: [
        {
          data: [...totalDeath],
          backgroundColor: '#9966FF',
        },
      ],
    },
    options: {
      reponsive: true,
      plugins: {
        legend: {
          position: 'top',
          display: false,
        },
        title: {
          display: true,
          text: 'Total de Mortes por País - Top 10',
        },
      },
    },
  });
}
