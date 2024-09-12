
const _elements = {
    loading: document.querySelector(".loading"),
    switch: document.querySelector(".switch__track"),
    stateSelectToggle: document.querySelector(".state-select-toggle"),
    selectOptions: document.querySelectorAll(".state-select-list__item"),
    selectList: document.querySelector(".state-select-list"),
    selectToggleIcon: document.querySelector(".state-select-toggle__icon"),
    selectSearchBox: document.querySelector(".state-select-list__search"),
    selectStateSelected: document.querySelector(".state-select-toggle__label"),
    confirmed: document.querySelector(".info__total--confirmed"),
    deaths: document.querySelector(".info__total--deaths"),
    deathsDescription: document.querySelector(".data-box__description"),
    vaccinated1: document.querySelector(".info__total--vaccinated-1"),
    vaccinated2: document.querySelector(".info__total--vaccinated-2"),

}


const _data = {
    id: "brasil=true",
    vaccinatedInfo: undefined,
    vaccinated: undefined,
    confirmed: undefined,
    deaths: undefined,
}

const _charts = {};

_elements.switch.addEventListener("click", () => {
    const isDark = _elements.switch.classList.toggle("switch__track--dark");

    if (isDark)

        document.documentElement.setAttribute("data-theme", "dark");
    else
        document.documentElement.setAttribute("data-theme", "light");

});

_elements.stateSelectToggle.addEventListener("click", () => {
    _elements.selectToggleIcon.classList.toggle("state-select-toggle__icon--rotate");
    _elements.selectList.classList.toggle("state-select-list--show");
});



_elements.selectOptions.forEach(item => {

    const _elements = {
        selectStateSelected: document.querySelector('#selectedState'), // Atualize o seletor conforme necessário
        selectOptions: document.querySelectorAll('.state-select-list__item'),
        stateSelectToggle: document.querySelector('#toggleButton') // Se necessário, ajuste o seletor
    };

    // Verifique se os elementos foram encontrados
    console.log(_elements.selectStateSelected); // Deve exibir o elemento
    console.log(_elements.selectOptions); // Deve exibir a lista de opções

    item.addEventListener("click", () => {
        //  _elements.selectStateSelected.innerText = item.innerText;
        //  _data.id = item.getAttribute("data-id");
        //_elements.stateSelectToggle.dispatchEvent(new Event("click"));
        // _elements.selectStateSelected = document.querySelector('state-select-list__item');

        // loadData(_data.id);

        // const _elements = {
        //     selectStateSelected: document.querySelector('#selectedState'),
        //     selectOptions: document.querySelectorAll('.state-select-list__item')
        // };

        // // Verifique se os elementos foram encontrados
        // console.log(_elements.selectStateSelected); // Deve exibir o elemento
        // console.log(_elements.selectOptions); // Deve exibir a lista de opções
        // if (_elements.selectStateSelected) {
        //     _elements.selectStateSelected.innerText = item.innerText;
        // } else {
        //     console.error("Elemento 'selectStateSelected' não encontrado.");
        // }
        // // Atualizar o estado selecionado
        // const selectedId = item.getAttribute("data-id");
        // console.log("ID selecionado:", selectedId);


        if (_elements.selectStateSelected) {
            _elements.selectStateSelected.innerText = item.innerText;
        } else {
            console.error("Elemento 'selectStateSelected' não encontrado.");
        }

        // Atualize o ID selecionado
        const selectedId = item.getAttribute("data-id");
        console.log("ID selecionado:", selectedId);

        // Feche o menu de seleção se necessário
        if (_elements.stateSelectToggle) {
            _elements.stateSelectToggle.dispatchEvent(new Event("click"));
        }

        // Carregue os dados com base no ID selecionado
        loadData(selectedId);

    });
});




_elements.selectSearchBox.addEventListener("keyup", (e) => {
    const search = e.target.value.toLowerCase();

    for (const item of _elements.selectOptions) {
        const state = item.innerText.toLowerCase();

        if (state.includes(search)) {
            item.classList.remove("state-select-list__item--hide");
        }
        else {
            item.classList.add("state-select-list__item--hide");
        }
    }
});

// const request = async (api, id) => {
//     try {

//         const url = api + id;

//         const data = await fetch(url);
//         const json = await data.json();

//         return json;
//     }

//     catch (e) {
//         console.log(e);
//     }
// }

const request = async (api, id) => {
    try {
        const url = api + id;
        const data = await fetch(url);
        const json = await data.json();
        console.log('Resposta da API:', json);// Adicione isso para depuração
        return json;
    } catch (e) {
        console.log(e);
    }
}


const loadData = async (id) => {
    _elements.loading.classList.remove("loading--hide");

    _data.confirmed = await request(_api.confirmed, id);
    _data.deaths = await request(_api.deaths, id);
    _data.vaccinated = await request(_api.vaccinated, id);
    _data.vaccinatedInfo = await request(_api.vaccinatedInfo, "");

    console.log('Dados confirmados após carregamento:', _data.confirmed);
    console.log('Dados de mortes após carregamento:', _data.deaths);
    console.log('Dados vacinados após carregamento:', _data.vaccinated);
    console.log('Informações de vacinação após carregamento:', _data.vaccinatedInfo);

    updateCards();

    _elements.loading.classList.add("loading--hide");
}


const createBasicChart = (element, config) => {
    const options = {
        chart: {
            background: "transparent"
        },

        xaxis: {
            type: "datetime"
        },
        series: []
    }

    const chart = new ApexCharts(document.querySelector(element), options);
    chart.render();

    return chart;

}

const createDonutChart = (element, series, labels) => {
    const options = {
        chart: {
            type: 'donut',
            background: "transparent"
        },
        series: series, // Os dados que você irá passar para o gráfico
        labels: labels, // Os rótulos (nomes dos estados ou doses)
        legend: {
            position: 'bottom'
        },
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 300
                },
                legend: {
                    position: 'bottom'
                }
            }
        }]
    };

    const chart = new ApexCharts(document.querySelector(element), options);
    chart.render();

    return chart;
}

const createStackedColumnsChart = (element, series, categories) => {
    const options = {
        chart: {
            type: 'bar',
            stacked: true,
            background: "transparent"
        },
        series: series, // Dados de cada estado
        xaxis: {
            categories: categories // Datas ou regiões
        },
        fill: {
            opacity: 1
        },
        legend: {
            position: 'bottom'
        },
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 300
                },
                legend: {
                    position: 'bottom'
                }
            }
        }]
    };

    const chart = new ApexCharts(document.querySelector(element), options);
    chart.render();

    return chart;
}

const createCharts = () => {
    _charts.confirmed = createBasicChart(".data-box--confirmed .data-box__body");
    _charts.deaths = createBasicChart(".data-box--deaths .data-box__body");
    _charts.confirmed30 = createBasicChart(".data-box--30 .data-box__body");
    _charts.vaccinatedAbs = createBasicChart(".data-box--vaccinated-abs .data-box__body");



}

const updateCards = () => {
    console.log('Dados confirmados:', _data.confirmed);
    console.log('Dados de mortes:', _data.deaths);
    console.log('Dados vacinados:', _data.vaccinated);
    console.log('Informações de vacinação:', _data.vaccinatedInfo);

    const uf = _ufs[_data.id];

    // Atualizando dados confirmados
    if (_data.confirmed.length > 0) {
        const lastConfirmedData = _data.confirmed[_data.confirmed.length - 1];
        _elements.confirmed.innerText = lastConfirmedData["total_de_casos"];
    } else {
        _elements.confirmed.innerText = 'Dados não disponíveis';
    }

    // Atualizando dados de mortes
    if (_data.deaths.length > 0) {
        const lastDeathsData = _data.deaths[_data.deaths.length - 1];
        _elements.deaths.innerText = lastDeathsData["total_de_mortes"];
    } else {
        _elements.deaths.innerText = 'Dados não disponíveis';
    }

    // Atualizando informações de vacinação
    if (_data.vaccinatedInfo && _data.vaccinatedInfo.extras && _data.vaccinatedInfo.extras[uf]) {
        _elements.vaccinated1.innerText = _data.vaccinatedInfo.extras[uf].info["total-hoje-dose-1"] || 0;
        _elements.vaccinated2.innerText = (_data.vaccinatedInfo.extras[uf].info["total-hoje-dose-2"] || 0) +
            (_data.vaccinatedInfo.extras[uf].info["total-hoje-dose-unica"] || 0);
    } else {
        _elements.vaccinated1.innerText = 'Dados não disponíveis';
        _elements.vaccinated2.innerText = 'Dados não disponíveis';
    }

    // Formatar números
    _elements.confirmed.innerText = Number(_elements.confirmed.innerText).toLocaleString();
    _elements.deaths.innerText = Number(_elements.deaths.innerText).toLocaleString();
    _elements.vaccinated1.innerText = Number(_elements.vaccinated1.innerText).toLocaleString();
    _elements.vaccinated2.innerText = Number(_elements.vaccinated2.innerText).toLocaleString();
}


const updateCharts = () => {
    // Exemplo de gráfico Donut para vacinação
    createDonutChart(".data-box--vaccinated-abs .data-box__body", [_data.vaccinated1, _data.vaccinated2], ['1ª Dose', '2ª Dose + Dose Única']);

    // Exemplo de gráfico de colunas empilhadas para casos confirmados
    createStackedColumnsChart(".data-box--confirmed .data-box__body", _data.confirmed, _data.confirmedDates);
}


const getChartOptions = (series, labels, colors) => {

}

const getDonutChartOptions = (value, name, colors) => {

}

loadData(_data.id);
// import ApexCharts from 'apexcharts';
createCharts();