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
        
        const selectCountry = document.getElementById('cmbCountry');
        
        selectCountry.appendChild(option);

        if(item === 'Brazil') {
            selectCountry.value = item;
        }
    });
};

const updatedCountryTotal = async (lastData) => {
    const deaths = document.getElementById('kpideaths');
    const recovered = document.getElementById('kpirecovered');
    const confirmed = document.getElementById('kpiconfirmed');

    deaths.innerText = parseFloat(lastData.Deaths).toLocaleString('br');
    recovered.innerText = parseFloat(lastData.Recovered).toLocaleString('br');
    confirmed.innerText = parseFloat(lastData.Confirmed).toLocaleString('br');
}

const getCountryData = async (country = 'Brazil', startDate = new Date('2020-01-01'), endDate = new Date()) => {
    
    console.log(country);

    const result = await getData(`country/${country}?from=${startDate.toISOString()}&to=${endDate.toISOString()}`);

    updatedCountryTotal(result[result.length - 1]);
} 

const updateData = () => {
    const startDate = document.getElementById('date_start');
    const country = document.getElementById('cmbCountry');
    const endDate = document.getElementById('date_end');

    getCountryData(country.value);
}

// const loadDefaultValues = () => {
//     country = 'Brazil', startDate = new Date('2020-01-01'), endDate = new Date()
// }

window.addEventListener('load', getCountries());
window.addEventListener('load', getCountryData());
