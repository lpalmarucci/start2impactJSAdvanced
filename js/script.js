
fetch(`https://api.waqi.info/feed/rome/?token=a2ef6934b6a41dc2345540701548d8a539da7cb9`).then(res => res.json()).then(dati => console.log(dati));