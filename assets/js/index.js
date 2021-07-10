import {getData} from './api.js';

// get the summary from the covid 19 API
(async () => {
    const result = await getData('summary');

    showDataAndDrawPieChart(result.Global);
    drawBarChart(result.Countries);
})();

// print the data and draw the pie chart
function showDataAndDrawPieChart(data) {
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
                        '#ffc107',
                        '#007bff',
                        '#dc3545',
                    ],
                    data: [
                        data.NewConfirmed,
                        data.NewRecovered,
                        data.NewDeaths
                    ],
                    borderWidth: 0
                },
            ],
        },
        options: {
            aspectRatio: 1.5,
            plugins: {
                legend: {
                    position: 'right'
                },
            },
        },
    });
}

// draw the bar chart
function drawBarChart(data) {
    let oCountries = data.map((country) => {
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
    for (let index in countries.slice(0, 10)) {
        totalDeath.push(countries[index].TotalDeaths);
        nCountries.push(countries[index].Country);
    }

    new Chart(document.getElementById('barras'), {
        type: 'bar',
        data: {
            labels: [...nCountries],
            datasets: [
                {
                    data: [...totalDeath],
                    backgroundColor: '#dc3545',
                },
            ],
        },
        options: {
            indexAxis: 'y',
            aspectRatio: 3,
            reponsive: true,
            plugins: {
                legend: {
                    position: 'top',
                    display: false,
                },
            },
            scales: {
                x: {
                    ticks: {
                        autoSkip: false,
                        maxRotation: 0,
                        minRotation: 0
                    }
                }
            }
        },
    });

    const loading = document.getElementById('loading');
    loading.classList.remove("d-flex");
    loading.classList.add("d-none");
}
