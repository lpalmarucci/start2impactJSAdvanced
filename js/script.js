const searchBox = document.getElementById('search-box');
const searchImg = document.getElementById('search-img');
const gpsImg = document.getElementById('gps-img');
const loader = document.getElementById('loader');
const clear = document.getElementById('clear-searchbox');

const API_KEY = "a2ef6934b6a41dc2345540701548d8a539da7cb9";
const BASE_URL = "https://api.waqi.info/feed";

//Customizzazione errore risposta API
class ResponseError extends Error{
    constructor(message){
        super(message);
        this.name = "ResponseError";
        this.message = `[Error] ${message}`
    }
}
//Per gestire più semplicemente lo show e l'hide di un elemento
Element.prototype.hide = function() {
    this.style.display = "none";
}

Element.prototype.show = function(type) {
    this.style.display = type;
}

//Nascondo la tabella
document.querySelector('#data-container').hide();

function callService(sendCoords){
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition((position) => {
            let {latitude: lat, longitude: lng} = position.coords; 
            resolve([lat,lng]);
        })
    }).then(([lat, lng]) => {
        return sendCoords ? 
            fetch(`${BASE_URL}/geo:${lat};${lng}/?token=${API_KEY}`) :
            fetch(`${BASE_URL}/${searchBox.value.toLowerCase()}/?token=${API_KEY}`)
    })
}

//Funzione che effettua la chiamata all'API
function searchAQI(sendCoords){
    
    loader.show("block");
    //Mostrare immagine di caricamento
    callService(sendCoords)
        .then(res => {
            //Ho ricevuto i dati, nascondo il loader
            loader.hide();
            document.querySelector('#data-container').show("flex");
            return res.json()
        })
        .then(res => {
            console.log(res);
            if(res.status != "ok"){
                throw new ResponseError(res.data);
            }
            //Posso mostrare i dati
            drawData(res.data);
        })
        .catch(err => {
            console.error(err);
            loader.hide();
            document.getElementById('data-container').hide();
            //Disegno alert con messaggio d'errore
            drawAlert(err.message);
        });
}

//Draw function for data
function drawData(data){
    document.querySelector('.table-data > tbody')?.remove();
    document.querySelector('.data-title-info')?.remove();
    //Titolo contenente nome della stazione trovata
    let span = document.createElement('span');
    span.className = "data-title-info";
    span.innerHTML = `Information about <b>${data.city.name}</b>`;
    document.getElementById('data-container').insertAdjacentElement('afterbegin', span);
    
    populateTable(data);
    updatedAt(new Date(data.time.s));

    console.log(data);
    let forecastSection = document.getElementById('forecast-section');
    //indico che non ci sono previsioni
    let h1 = document.querySelector('.title-section > h1');
    h1.className = "forecast-title";
    //Svuoto le tabelle con dentro i valori del forecast 
    while(forecastSection.firstChild)
        forecastSection.firstChild.remove();
    //Controllo se ci sono dei valori forecast da mostrare
    if(data.forecast.daily && Object.keys(data.forecast.daily).length > 0){
        h1.innerText = "Forecast";
        showForecast(data.forecast.daily);
    } else{
        h1.innerText = "No forecast available";
    }
    
}

function showForecast(forecastObj){
    let forecastSection = document.getElementById('forecast-section');
    for(let indicator in forecastObj){

        let divWrapper = document.createElement("div");
        divWrapper.classList.add('forecast-subsection');
        let h3 = document.createElement('h3');
        h3.innerText = indicator.toUpperCase();
        divWrapper.append(h3);
        forecastSection.append(divWrapper)

        // let table = document.createElement('table');
        let div = document.createElement('div');
        div.className = "forecast-wrapper";
        let table = document.createElement('table');
        table.className = "single-forecast";
        let thead = document.createElement('thead');
        let tr = document.createElement('tr');

        let th = createTH('Date');
        tr.append(th);
        th = createTH('Min');
        tr.append(th);
        th = createTH('Max');
        tr.append(th);
        thead.append(tr);
        table.append(thead);
        
        let tbody = document.createElement('tbody');
        
        for(let {min, max, day} of forecastObj[indicator]){
            let tr = document.createElement('tr');
            let date = new Date(day);
            let str = date.getFullYear() + '/' + date.getMonth() + '/' + date.getDate();
            let td = createTD(str);
            tr.append(td);
            
            td = createTD(`${min}`);
            tr.append(td);
            
            td = createTD(`${max}`);
            tr.append(td);
            tbody.append(tr);
        }
        table.append(tbody);
        div.append(table);
        divWrapper.append(div);
    }
}

//Mostro la data a cui risalgono i dati
function updatedAt(date){
    document.querySelector('.updated-at')?.remove();
    let span = document.createElement('span');
    span.classList.add('updated-at');
    let months = date.getMonth();
    months = months < 10 ? `0${months}` : months;

    let days = date.getDate();
    days = days < 10 ? `0${days}` : days;

    let hours = date.getHours();
    hours = hours < 10 ? `0${hours}` : hours;

    let minutes = date.getMinutes();
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    span.innerHTML = `Last update at ${date.getFullYear()}/${months}/${days} ${hours}:${minutes}`;
    document.getElementById('data-container').insertAdjacentElement('beforeend',span);
}

function populateTable(data){
    let tbody = document.createElement('tbody');

    for(let key in data.iaqi){
        let tr = document.createElement('tr');


        let td = createTD(key.toUpperCase());
        tr.append(td);
        td = createTD(data.iaqi[key].v);
        tr.append(td);
        
        tbody.append(tr);
    }

    document.querySelector('.table-data').append(tbody);
}

document.addEventListener('DOMContentLoaded', () => {
    searchBox.focus();

    //Quando premo ENTER oppure quando premo sull'icona, vado ad effettuare la ricerca
    document.querySelector('form').addEventListener('submit', searchAQI)

    searchImg.addEventListener('click', () => {
        if(searchBox.value === ""){
            showErrorSearch();
            return;
        }
        searchAQI()
    });
    gpsImg.addEventListener('click', (e) => {
        searchAQI(true);
    })

    clear.addEventListener('click', () => {
        searchBox.value ="";
    });

})

searchBox.addEventListener('keydown', e => {
    //Impedisco di inserire caratteri che non siano lettere
    let keyCode = e.code.toLowerCase();
    if(keyCode.indexOf('key') === -1 && keyCode != "space" && keyCode != "backspace" && keyCode != "tab" || keyCode ==  "enter")
        e.preventDefault();

    //Occorre il setTimeout perchè altrimenti non mi prenderebbe correttamente il value dell'input
    setTimeout(() => {
        if(e.target.value != ""){
            if(e.target.classList.contains('search-box-error')){

                document.querySelector('.search-box-error-message').style.opacity = 0;
                searchBox.classList.remove('search-box-error');
            }
            let errorContainer = document.querySelector('.error-container');
            if(errorContainer){
                let errorContainer = document.querySelector('.error-container')
                errorContainer.style.opacity = 0;
                setTimeout(() => errorContainer.remove(),1000);
            } else{
                //Se premo enter vuol dire che sto ricercando una città
                if(keyCode === "enter")
                searchAQI();
            }
        }
    },1);
})

//Mostra l'errore di ricerca
function showErrorSearch(){
    searchBox.focus();
    searchBox.classList.add('search-box-error');
    let errorMessage = document.querySelector('.search-box-error-message');
    errorMessage.style.display = 'inline-block';
    errorMessage.style.opacity = 1;
}

function drawAlert(text) {
    alertShowInPage = true;

    //creating alert
    let alert =  document.createElement('footer');
    alert.setAttribute('id','alert');

    let span = document.createElement('span');
    span.textContent = text;
    span.classList.add('text-alert');
    alert.append(span);

    let line = document.createElement('div');
    line.className = "line";
    alert.append(line);
    document.getElementById('head-section').append(alert);

    //posizionamento alert al fondo (alzato di 10 pixel) e al centro della pagina
    let coordsAlert = alert.getBoundingClientRect();
    alert.style.position = 'absolute';
    alert.style.top = window.innerHeight - coordsAlert.height - 10 + 'px';
    alert.style.left = (window.innerWidth - coordsAlert.width)/2 + "px";

    //Gestione animazione a scomparsa con il setInterval + CustomEvent
    let timerEvent = new CustomEvent('timerExpired');
    line.addEventListener('timerExpired', () => {
        document.getElementById('alert').style.opacity = 0;
        clearInterval(interval);
        //Posso permettere di disegnare un altro alert
        alertShowInPage = false;
        //Per permettere l'animazione dell'alert
        setTimeout(() => document.getElementById('alert').remove(),400);
    })

    let timerInterval = setInterval(() => {
        let width = line.getBoundingClientRect().width;
        if(width - 1 === 0){
            interval = timerInterval;
            line.dispatchEvent(timerEvent);
        } 
        line.style.width =  `${width - 1}px`;
    }, 6);
}

function createTD(text){
    let td = document.createElement('td');
    td.innerText = text;
    return td;
}

function createTH(txt){
    let th = document.createElement('th');
    th.innerText = txt;
    return th;
}