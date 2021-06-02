
let searchBox = document.getElementById('search-box');
let searchImg = document.getElementById('search-img');

const API_KEY = "a2ef6934b6a41dc2345540701548d8a539da7cb9";
const BASE_URL = "https://api.waqi.info/feed";

class ResponseError extends Error{
    constructor(message){
        super(message);
        this.name = "ResponseError";
        this.message = `[Error] ${message}`
    }
}

function searchAQI(e){
    //Fermo il submit del form
    e.preventDefault();
    if(searchBox.value === ""){
        showErrorSearch();
        return;
    }

    let cityName = searchBox.value.toLowerCase();
    fetch(`${BASE_URL}/${cityName}/?token=${API_KEY}`)
        .then(res => res.json())
        .then(res => {
            console.log(res);
            if(res.status != "ok"){
                let err = new ResponseError(res.data);
                console.log(err);
                // showResultError(err);
            }
        })
        .catch(err => console.error(err));
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
        if(e.target.value != "" && e.target.classList.contains('search-box-error')){
            searchBox.classList.remove('search-box-error');
            document.querySelector('.search-box-error-message').style.opacity = 0;
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