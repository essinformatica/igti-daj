function getGlobalSummary() {
  fetch('https://api.covid19api.com/summary').then(function(response) {
      if(response.ok) {
          return response.json().then(function(json) {
              showData(json.Global);
          });
      } else {
          console.log('Network response was not ok.');
      }
  })
  .catch(function(error) {
      console.log('There has been a problem with your fetch operation: ' + error.message);
  });
};

function showData(data) {
  const confirmed = document.getElementById("confirmed");
  const death = document.getElementById("death");
  const recovered = document.getElementById("recovered");
  const today = document.getElementById("today");

  var todayDate = new Date();
  var date = todayDate.getDate().toString().padStart(2, '0') + '/'+(todayDate.getMonth()+1).toString().padStart(2, '0') + '/' + todayDate.getFullYear();
  var time = todayDate.getHours().toString().padStart(2, '0') + ":" + todayDate.getMinutes().toString().padStart(2, '0') + ":" + todayDate.getSeconds().toString().padStart(2, '0');
  var dateTime = date+' '+time;

  confirmed.innerHTML = (new Intl.NumberFormat().format(data.TotalConfirmed));
  death.innerHTML = (new Intl.NumberFormat().format(data.TotalDeaths));
  recovered.innerHTML = (new Intl.NumberFormat().format(data.TotalRecovered));

  today.innerHTML = dateTime;

  new Chart(document.getElementById("pizza"), {
      type: 'pie',
      data: {
          labels: ["Confirmados", "Recuperados", "Mortes"],
          datasets: [{
              label: "Casos",
              backgroundColor: [
                  'rgb(255, 99, 132)',
                  'rgb(54, 162, 235)',
                  'rgb(255, 205, 86)'
              ],
              data: [data.TotalConfirmed, data.TotalDeaths, data.TotalRecovered]
          }]
      },
      options: {
          plugins: {
              title: {
                  display: true,
                  text: 'Distribuição de novos casos'
              }
          }
      }
  });
}

getGlobalSummary();
