function fetchStores(){
    let storesContainer = document.createElement("div")
    storesContainer.classList.add("storesContainer")
    document.body.appendChild(storesContainer)

    fetch("/api/stores")
        .then((response) =>{ return response.json(); })
        .then((data) => {

            for(const item of data){
            let storeDiv = document.createElement("div")
            let storeName = document.createElement("h1")
            let storeUrl = document.createElement("p")
            let storeDistrict = document.createElement("p")

            storeName.innerText = item.name
            storeDiv.appendChild(storeName)

            storeUrl.innerText = item.url
            storeDiv.appendChild(storeUrl)

            storeDistrict.innerText = item.district
            storeDiv.appendChild(storeDistrict)

            storesContainer.appendChild(storeDiv)
            }

            console.log(data)
        });
}

fetchStores();