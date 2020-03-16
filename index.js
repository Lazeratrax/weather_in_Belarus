moment.locale('ru');
const url = `https://gist.githubusercontent.com/alex-oleshkevich/6946d85bf075a6049027306538629794/raw/3986e8e1ade2d4e1186f8fee719960de32ac6955/by-cities.json`;

const selectRegionString = document.querySelector('.selectRegion');
const selectCityString = document.querySelector('.selectCity');
const regionButton = document.querySelector('.regionButton');
const cityButton = document.querySelector('.cityButton');
const selectWrapper = document.querySelector('.select-wrapper-2');
const group = document.querySelector('.group_2');
const menu = document.querySelector('.menu');

const openMenuButton = document.createElement('a');
const p = document.createElement('p');


async function getData(){
    const response = await fetch(url);
    const data = await response.json();
    return data
}


getData().then((data) => {

    data[0].regions.forEach((element, index) => {
        const option = document.createElement('option');
        option.innerHTML = element.name;
        option.value = index;
        selectRegionString.appendChild(option)
    });

    selectRegionString.addEventListener('change', () => {

        while (selectCityString.querySelectorAll("option")[1]) {
            selectCityString.removeChild(selectCityString.lastChild)
        }
        selectCityString.removeAttribute("disabled")
        const regionId = selectRegionString.value;
        data[0].regions[regionId].cities.forEach((element, index) => {
            const option = document.createElement('option');
            option.innerHTML = element.name;
            option.value = index;
            selectCityString.appendChild(option);
        });
    });



    cityButton.addEventListener('click', () => {
        const cityId = selectCityString.value;
        const regionId = selectRegionString.value;
        const {lat, lng} = data[0].regions[regionId].cities[cityId];
        const key = `f9d201d552071275ea89b4b295f14402`;
        fetch(`https://api.openweathermap.org/data/2.5/forecast/?&lat=${lat}&lon=${lng}&lang=ru&units=metric&appid=${key}`).then((response) => {
            return response.json()
        }).then((response) => {
            showInformation(response);
        })
    })

    function showInformation(obj) {
        p.className = "city";
        console.log(obj);
        p.innerHTML = obj.city.name;
        document.body.appendChild(p);
        hideMenu();
        renderDailyWeather(obj.list);
    }

    function hideMenu() {
        menu.classList += ' hide';
    }

    function renderDailyWeather(obj) {
        let daysContainer = document.createElement('div');
        daysContainer.className = "days-container";
        obj.map((el) => {
            if (el.dt_txt.indexOf("12:00:00") > 0) {
                const dayContainer = document.createElement('div');
                const weekDay = document.createElement('p');
                const weatherImage = document.createElement('img');
                const temperatureGroup = document.createElement('div');
                const dayHumidity = document.createElement('div');
                const dayHumidityImg = document.createElement('img');
                const dayHumidityNumber = document.createElement('p');
                const temp = document.createElement('p');
                const tempFeel = document.createElement('p');

                dayHumidity.className = 'day-humidity-group';
                dayHumidityNumber.innerHTML = el.main.humidity + "%";
                dayHumidityNumber.className = "day-humidity-group__number";

                dayHumidityImg.src = "https://pngimage.net/wp-content/uploads/2018/06/humedad-png-8.png";
                dayHumidityImg.className = "day-humidity-group__image";
                dayHumidity.appendChild(dayHumidityNumber);
                dayHumidity.appendChild(dayHumidityImg);
                temperatureGroup.className = 'temperature-group';

                temp.className = 'temperature-group__temp';

                tempFeel.className = 'temperature-group__temp-feel';
                temp.innerHTML = Math.round(el.main.temp)  + '&deg;';
                // tempFeel.innerHTML = Math.round(el.main.feels_like)  + '&deg;';
                dayContainer.className = "day";
                weekDay.className = "day__number";
                weekDayText = moment(new Date(el.dt_txt)).format('DD MMM dd');
                // weekDayText = new Date(el.dt_txt.replace(/(\d+)-(\d+)-(\d+)/, '$2/$3/$1'));
                // weekDay.innerHTML = String(weekDayText).slice(0, 3) + " " + String(weekDayText).slice(4, 8);
                weekDay.innerHTML = String(weekDayText);
                dayContainer.appendChild(weekDay);
                weatherImage.src = `http://openweathermap.org/img/wn/${el.weather[0].icon}@2x.png`
                dayContainer.appendChild(weatherImage);
                temperatureGroup.appendChild(temp);
                temperatureGroup.appendChild(tempFeel);
                dayContainer.appendChild(temperatureGroup);
                dayContainer.appendChild(dayHumidity);
                daysContainer.appendChild(dayContainer);
            }
        })
        openMenuButton.classList = "btn-2 anotherCityButton";
        openMenuButton.innerHTML = "выбрать другой город";
        openMenuButton.addEventListener('click', () => {
            menu.classList = 'menu';
            openMenuButton.classList += " hide";
            daysContainer.parentNode.removeChild(p);
            document.body.removeChild(daysContainer);
        })
        document.body.appendChild(daysContainer);
        document.body.appendChild(openMenuButton);
    }


    // =============keypress===========//

    // function runWeather(e) {
    //     //See notes about 'which' and 'key'
    //     if (e.keyCode == 13) {
    //         var tb = document.getElementById("btn-2");
    //         tb.click();
    //         // eval(tb.value);
    //         return false;
    //     }
    // }


})

