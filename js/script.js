
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
            loader.style.display = "none";
            return res.json()
        })
        .then(res => {
            console.log(res);
            if(res.status != "ok"){
                throw new ResponseError(res.data);
            }
            //Posso mostrare i dati
        })
        .catch(err => {
            console.error(err);
            showResponseError(err);
            //Disegnare container con messaggio d'errore
        });
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

function showResponseError(errorObj){
    let errorContainer = document.createElement('div');
    errorContainer.classList.add('error-container');
    errorContainer.innerText = errorObj.message;
    errorContainer.style.opacity = 1;

    document.getElementById('data-container').append(errorContainer);
}

//Mostra l'errore di ricerca
function showErrorSearch(){
    searchBox.focus();
    searchBox.classList.add('search-box-error');
    let errorMessage = document.querySelector('.search-box-error-message');
    errorMessage.style.display = 'inline-block';
    errorMessage.style.opacity = 1;
}