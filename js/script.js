
let searchBox = document.getElementById('search-box');
let searchImg = document.getElementById('search-img');

function searchAQI(e){
    //Fermo il submit del form
    e.preventDefault();
    if(searchBox.value === ""){
        showErrorSearch();
        return;
    }
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
        console.log(e.target.value);
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