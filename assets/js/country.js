import {getData} from './api.js';

const getCountries = async () => {
    const result = await getData('countries');

    const countries = result.map(country => { return {
        name: country.Country,
        slug: country.Slug
    }});

    countries.sort((a, b) => {
        return a.name.localeCompare(b.name);
    });

    countries.forEach((item) => {
        const option = document.createElement('option');
        option.textContent = item.name;
        option.value = item.slug;
        
        const selectCountry = document.getElementById('selectCountry');
        
        selectCountry.appendChild(option);

        if(item.slug === 'brazil') {
            selectCountry.value = item.slug;
        }
    });
};

const updatedCountryTotal = async (lastData) => {
    const deaths = document.getElementById('totalDeaths');
    const recovered = document.getElementById('totalRecovered');
    const confirmed = document.getElementById('totalConfirmed');

    deaths.innerText = parseFloat(lastData.TotalDeaths).toLocaleString('br');
    recovered.innerText = parseFloat(lastData.TotalRecovered).toLocaleString('br');
    confirmed.innerText = parseFloat(lastData.TotalConfirmed).toLocaleString('br');
}

const getCountryData = async (startDate, endDate, type, country = 'brazil') => {

    const summary = await getData('summary');
    const countries = summary.Countries;

    await updatedCountryTotal(countries.find(crty => crty.Slug == country));

    const result = await getData(`country/${country}?from=${startDate}&to=${endDate}`);

    if(result.length === 0) {
        const loading = document.getElementById('loading');

        loading.classList.add("d-flex");
        loading.classList.remove("d-none");
    }

    const days = _.uniqBy(result, 'Date');

    // To sum when separated provinces
    const summedResult = _.map(days, day => {
        return {
            Date: day.Date,
            Deaths: _.sumBy(result, item => {
                return item.Date === day.Date ? item.Deaths : 0;
            }),
            Recovered: _.sumBy(result, item => {
                return item.Date === day.Date ? item.Recovered : 0;
            }),
            Confirmed: _.sumBy(result, item => {
                return item.Date === day.Date ? item.Confirmed : 0;
            }),
        }
    });

    let typeName = '';

    let chart = summedResult.map((item, index) => {
        var date = new Date(item.Date);
        var offset = date.getTimezoneOffset();
        date.setTime(date.getTime() + offset*60*1000);
        date = date.getDate().toString().padStart(2, '0') + '/' + (date.getMonth() + 1).toString().padStart(2, '0') + '/' + date.getFullYear();

        if(index == 0) {
            return null;
        }

        switch(type) {
            case 'Deaths':
                typeName = 'Óbitos';
                return {
                    day: date,
                    value: item.Deaths - result[index-1].Deaths
                };
            case 'Recovered':
                typeName = 'Recuperados'
                return {
                    day: date,
                    value: item.Recovered - result[index-1].Recovered
                };
            case 'Confirmed':
                typeName = 'Casos Confirmados'
                return {
                    day: date,
                    value: item.Confirmed - result[index-1].Confirmed
                };
            default:
                return {
                    day: null,
                    value: null
                };
        }
    });

    chart.shift(); // Remove first element (only used for calculus purpose)

    const average = _.meanBy(chart, (c) => c.value);
    
    chart = chart.map(item => { return {...item, average} } )

    await loadChart(chart, typeName);
} 

const updateData = () => {
    const loading = document.getElementById('loading');
    loading.classList.add("d-flex");
    loading.classList.remove("d-none");

    const today = new Date();
    var offset = today.getTimezoneOffset();
    today.setTime(today.getTime() - offset*60*1000);

    const endDate = new Date(document.getElementById('dateEnd').value);
    const startDate = new Date(document.getElementById('dateStart').value);
    const country = document.getElementById('selectCountry').value;
    const type = document.getElementById('selectData').value;

    endDate.setTime(endDate.getTime() + (24*60*60*1000)-1000); // Get the full day (up to 23:59:59)
    startDate.setTime(startDate.getTime() - (24*60*60*1000)); // Get an extra day to calculate only the numbers of the day

    if(!country) {
        getCountryData(
            startDate.toISOString(), 
            endDate > today ? today.toISOString() : endDate.toISOString(),
            type,
        );
    } else {
        getCountryData(
            startDate.toISOString(), 
            endDate > today ? today.toISOString() : endDate.toISOString(),
            type,
            country,
        );
    }
}

const loadDefaultDateValues = () => {
    const startDate = document.getElementById('dateStart');
    const endDate = document.getElementById('dateEnd');

    const today = new Date();
    var offset = today.getTimezoneOffset();
    today.setTime(today.getTime() - offset*60*1000);

    const aWeekAgo = new Date();
    aWeekAgo.setTime(aWeekAgo.getTime() - offset*60*1000 - 7*24*60*60*1000);

    startDate.value = aWeekAgo.toISOString().substring(0, 10);
    endDate.value = today.toISOString().substring(0, 10);
}

let chart = null;
const loadChart = async (data, type) => {
    const xDays = data.map(item => item.day);
    const yNumbers = data.map(item => item.value);
    const yAverage = data.map(item => item.average);

    if(chart !== null)
        chart.destroy();

    chart = new Chart(document.getElementById('linhas'), {
        type: 'line',
        data: {
            labels: xDays,
            datasets: [
                {
                    label: 'Número de '+type,
                    data: yNumbers,
                    borderColor: '#dc3545',
                    backgroundColor: '#dc3545'
                },
                {
                    label: 'Média de '+type,
                    data: yAverage,
                    borderColor: '#ffc107',
                    backgroundColor: '#ffc107',
                    pointRadius: 0
                },
            ]
        },
        options: {
            aspectRatio: 1.75,
            plugins: {
                legend: {
                    position: 'bottom'
                },
            },
        }
    });

    const loading = document.getElementById('loading');
    loading.classList.remove("d-flex");
    loading.classList.add("d-none");
}

const applyButton = document.getElementById('aplicar');
applyButton.addEventListener('click', updateData);

window.addEventListener('load', loadDefaultDateValues());
window.addEventListener('load', getCountries());
window.addEventListener('load', updateData());
// window.addEventListener('load', loadChart());