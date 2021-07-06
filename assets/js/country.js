function getCountries() {
    fetch('https://api.covid19api.com/countries').then(function(response) {
        if(response.ok) {
            return response.json().then(function(json) {
                addCountryOptions(json);
            });
        } else {
            console.log('Network response was not ok.');
        }
    })
    .catch(function(error) {
        console.log('There has been a problem with your fetch operation: ' + error.message);
    });
};

function addCountryOptions(options) {
    options.sort((a, b) => {
        return a.Country.localeCompare(b.Country);
    });
    const select = document.getElementById("combo");
    options.forEach(item => {
        const option = document.createElement("option");
        option.text = item.Country;
        option.value = item.Slug;
        select.add(option);
    });
}

getCountries();

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

    document.getElementById("tconfirmed").innerHTML = '';
    document.getElementById("tdeath").innerHTML = '';
    document.getElementById("trecovered").innerHTML = '';
    document.getElementById("tactive").innerHTML = '';
};

function showData(data) {
    const confirmed = document.getElementById("confirmed");
    const death = document.getElementById("death");
    const recovered = document.getElementById("recovered");
    const active = document.getElementById("active");
    const actives = document.getElementById("actives");
    const today = document.getElementById("today");
    
    var todayDate = new Date();
    var date = todayDate.getDate().toString().padStart(2, '0') + '/'+(todayDate.getMonth()+1).toString().padStart(2, '0') + '/' + todayDate.getFullYear();
    var time = todayDate.getHours().toString().padStart(2, '0') + ":" + todayDate.getMinutes().toString().padStart(2, '0') + ":" + todayDate.getSeconds().toString().padStart(2, '0');
    var dateTime = date+' '+time;

    confirmed.innerHTML = (new Intl.NumberFormat().format(data.TotalConfirmed));
    death.innerHTML = (new Intl.NumberFormat().format(data.TotalDeaths));
    recovered.innerHTML = (new Intl.NumberFormat().format(data.TotalRecovered));

    active.innerHTML = dateTime;
    actives.innerHTML = 'Atualização';
    today.value = todayDate.getFullYear() + '-'+(todayDate.getMonth()+1).toString().padStart(2, '0') + '-' + todayDate.getDate().toString().padStart(2, '0');
}

getGlobalSummary();

function getCountryData(country, date) {
    let less1day = new Date(date);
    less1day.setDate(less1day.getDate()-1);
    less1day = less1day.getFullYear() + '-'+(less1day.getMonth()+1).toString().padStart(2, '0') + '-' + less1day.getDate().toString().padStart(2, '0');

    fetch(`https://api.covid19api.com/country/${country}?from=${less1day}T00:00:00Z&to=${date}T00:00:00Z`).then(function(response) {
        if(response.ok) {
            return response.json().then(function(json) {
                showDailyData(json);
            });
        } else {
            console.log('Network response was not ok.');
        }
    })
    .catch(function(error) {
        console.log('There has been a problem with your fetch operation: ' + error.message);
    });
};

function showDailyData(data) {
    if(data.length < 3) {
        alert('Dados indisponíveis');
        return;
    }

    const confirmed = document.getElementById("confirmed");
    const death = document.getElementById("death");
    const recovered = document.getElementById("recovered");
    const active = document.getElementById("active");

    confirmed.innerHTML = (new Intl.NumberFormat().format(data[2].Confirmed));
    death.innerHTML = (new Intl.NumberFormat().format(data[2].Deaths));
    recovered.innerHTML = (new Intl.NumberFormat().format(data[2].Recovered));
    active.innerHTML = (new Intl.NumberFormat().format(data[2].Active));

    const tconfirmed = document.getElementById("tconfirmed");
    const tdeath = document.getElementById("tdeath");
    const trecovered = document.getElementById("trecovered");
    const tactive = document.getElementById("tactive");

    confirmedToday = data[2].Confirmed - data[1].Confirmed;
    confirmedYesterday = data[1].Confirmed - data[0].Confirmed;
    tconfirmed.innerHTML = (confirmedToday > confirmedYesterday ? '▲' : '▼') + ' Diário: ' + (new Intl.NumberFormat().format(confirmedToday));

    deathsToday = data[2].Deaths - data[1].Deaths;
    deathsYesterday = data[1].Deaths - data[0].Deaths;
    tdeath.innerHTML = (deathsToday > deathsYesterday ? '▲' : '▼') + ' Diário: ' + (new Intl.NumberFormat().format(deathsToday));

    recoveredToday = data[2].Recovered - data[1].Recovered;
    recoveredYesterday = data[1].Recovered - data[0].Recovered;
    trecovered.innerHTML = (recoveredToday > recoveredYesterday ? '▲' : '▼') + ' Diário: ' + (new Intl.NumberFormat().format(recoveredToday));

    activeToday = data[2].Active - data[1].Active;
    activeYesterday = data[1].Active - data[0].Active;
    tactive.innerHTML = (activeToday > activeYesterday ? '▲' : '▼') + ' Diário: ' + (new Intl.NumberFormat().format(activeToday));
}

function handleChange() {
    country = document.getElementById("combo").value;
    date = document.getElementById("today").value;

    if(country !== 'Global') {
        getCountryData(country, date);
    } else {
        getGlobalSummary();
    }
}

document.getElementById("combo").addEventListener("change", handleChange);
document.getElementById("today").addEventListener("change", handleChange);
