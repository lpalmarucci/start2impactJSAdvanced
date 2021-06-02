
let searchBox = document.getElementById('search-box');
let searchImg = document.getElementById('search-img');
const loader = document.getElementById('loader');

const API_KEY = "a2ef6934b6a41dc2345540701548d8a539da7cb9";
const BASE_URL = "https://api.waqi.info/feed";

class ResponseError extends Error{
    constructor(message){
        super(message);
        this.name = "ResponseError";
        this.message = `[Error] ${message}`
    }
}

//Funzione che effettua la chiamata all'API
function searchAQI(e){
    //Fermo il submit del form
    e.preventDefault();
    if(searchBox.value === ""){
        showErrorSearch();
        return;
    }

    let cityName = searchBox.value.toLowerCase();
    loader.style.display = "block";
    //Mostrare immagine di caricamento
    fetch(`${BASE_URL}/${cityName}/?token=${API_KEY}`)
        .then(res => {
            //Ho ricevuto i dati, nascondo il loader
            loader.style.display = "none";
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
            //Disegno alert con messaggio d'errore
            drawAlert(err.message);
        });
}

//Draw function for data
function drawData(data){
    updatedAt(new Date(data.time.s));
}

function updatedAt(date){
    let h1 = document.createElement('h1');
    let months = date.getMonth();
    months = months < 10 ? `0${months}` : months;

    let days = date.getDate();
    days = days < 10 ? `0${days}` : days;

    let hours = date.getHours();
    hours = hours < 10 ? `0${hours}` : hours;


    let minutes = date.getMinutes();
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    h1.innerHTML = `Last update at ${date.getFullYear()}/${months}/${days} ${hours}:${minutes}`;
    document.getElementById('data-container').append(h1);
}

document.addEventListener('DOMContentLoaded', () => {
    searchBox.focus();

    //Quando premo ENTER oppure quando premo sull'icona, vado ad effettuare la ricerca
    document.querySelector('form').addEventListener('submit', searchAQI)
    searchImg.addEventListener('click', searchAQI)
})

searchBox.addEventListener('keydown', e => {
    //Occorre il setTimeout perchè altrimenti non mi prenderebbe correttamente il value dell'input
    setTimeout(() => {
        if(e.target.value != ""){
            if(e.target.classList.contains('search-box-error')){

                document.querySelector('.search-box-error-message').style.opacity = 0;
                searchBox.classList.remove('search-box-error');
            }
            let errorContainer = document.querySelector('.error-container');
            console.log(`ErrorContainer --> `,errorContainer)
            if(errorContainer){
                let errorContainer = document.querySelector('.error-container')
                errorContainer.style.opacity = 0;
                setTimeout(() => errorContainer.remove(),1000);
            }
        }
    },1);
})

searchBox.addEventListener('blur', e => {
    if(e.target.value === ""){
        showErrorSearch();
    }
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