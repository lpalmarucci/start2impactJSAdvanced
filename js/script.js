
let searchBox = document.getElementById('search-box')
let searchImg = document.getElementById('search-img');

document.addEventListener('DOMContentLoaded', () => {
    searchBox.focus();
})

searchBox.addEventListener('keydown', e => {
    if(e.target.value != "" && e.target.classList.contains('search-box-error')){
        searchBox.classList.remove('search-box-error');
        document.querySelector('.search-box-error-message');.style.opacity = 0;
    }
})

searchBox.addEventListener('blur', e => {
    if(e.target.value === ""){
        searchBox.focus();
        searchBox.classList.add('search-box-error');
        let errorMessage = document.querySelector('.search-box-error-message');
        errorMessage.style.display = 'inline-block';
        errorMessage.style.opacity = 1;
    }
})

searchImg.addEventListener('click', e => {

})

fetch(`https://api.waqi.info/feed/rome/?token=a2ef6934b6a41dc2345540701548d8a539da7cb9`).then(res => res.json()).then(dati => console.log(dati));