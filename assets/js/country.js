const api = axios.create({ baseURL: 'https://api.covid19api.com/' });

const getData = async (route) => {
    const response = await api.get(route);
    return response.data;
}

const getCountries = async () => {
    const result = await getData('countries');

    const countries = result.map(country => country.Country);

    countries.sort();

    countries.forEach((item) => {
        const option = document.createElement('option');
        option.textContent = item;
        option.value = item;
        
        const selectCountry = document.getElementById('selectCountry');
        
        selectCountry.appendChild(option);

        if(item === 'Brazil') {
            selectCountry.value = item;
        }
    });
};

const updatedCountryTotal = async (lastData) => {
    const deaths = document.getElementById('totalDeaths');
    const recovered = document.getElementById('totalRecovered');
    const confirmed = document.getElementById('totalConfirmed');

    deaths.innerText = parseFloat(lastData.Deaths).toLocaleString('br');
    recovered.innerText = parseFloat(lastData.Recovered).toLocaleString('br');
    confirmed.innerText = parseFloat(lastData.Confirmed).toLocaleString('br');
}
const getCountryData = async (startDate, endDate, country = 'Brazil') => {
    const result = await getData(`country/${country}?from=${startDate}&to=${endDate}`);

    console.log(result)

    const totalDeaths = result.forEach((item) => {
        console.log(item.Deaths);
    })

    await updatedCountryTotal(result[result.length - 1]);
    await loadChart();
} 

const updateData = () => {
    const endDate = document.getElementById('dateEnd');
    const startDate = document.getElementById('dateStart');
    const country = document.getElementById('selectCountry');

    if(!country.value) {
        getCountryData(
            new Date(startDate.value).toISOString(), 
            new Date(endDate.value).toISOString(), 
        );
    } else {
        getCountryData(
            new Date(startDate.value).toISOString(), 
            new Date(endDate.value).toISOString(), 
            country.value,
        );
    }
}

const loadDefaultDateValues = () => {
    const startDate = document.getElementById('dateStart');
    const endDate = document.getElementById('dateEnd');

    startDate.value = new Date().toISOString().substring(0, 10);
    endDate.value = new Date().toISOString().substring(0, 10);
}

const loadChart = async (xDays, yNumbers) => {
    new Chart(document.getElementById('linhas'), {
        type: 'line',
        data: {
            labels: xDays,
            datasets: [{
                label: 'Número de Mortes',
                data: yNumbers,
                backgroundColor: ['rgb(255, 116, 0)']
            }]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Curva Diária de Covid-19'
                }
            }
        }
    });
}

window.addEventListener('load', loadDefaultDateValues());
window.addEventListener('load', getCountries());
window.addEventListener('load', updateData());
// window.addEventListener('load', loadChart());