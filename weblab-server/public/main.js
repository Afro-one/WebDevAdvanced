// To fetch by sorted by district ascenidcng
function fetchStores(route = "/api/stores") {
  const storesContainer = document.getElementById("stores");

  fetch(route)
    .then((response) => response.json())
    .then((data) => {
      for (const item of data) {
        let storeDiv = document.createElement("div");
        storeDiv.classList.add("store");

        let storeName = document.createElement("h2");
        let storeUrl = document.createElement("a");
        let storeDistrict = document.createElement("p");

        storeName.innerText = item.name;
        storeUrl.href = `https://${item.url}`;
        storeUrl.innerText = "Click me!";
        storeDistrict.innerText = item.district;
        storeDiv.setAttribute("storeId", item.id);

        storeDiv.appendChild(storeName);
        storeDiv.appendChild(storeDistrict);
        storeDiv.appendChild(storeUrl);
        storesContainer.appendChild(storeDiv);
      }
    });
}

function addStore(name, url, district) {
  fetch("/api/store", {
    method: "POST",
    headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
          },
    body: JSON.stringify({
            "name": name,
            "url": url,
            "district": district
        })   
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("New store added:", data);
      fetchStores(); // store list refresh after adding new store
    });
}

function updateStore(id, name, url, district) {
  fetch(`/api/store/${id}`, {
    method: "PUT",
    headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
          },
    body: JSON.stringify({
            "name": name,
            "url": url,
            "district": district
        })   
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Store updated:", data);
      fetchStores(); // refresh store list after update
    });
}

function deleteStore(id) {
  fetch(`/api/store/${id}`, {
    method: "DELETE"
  })
    .then((response) => response.json())
    .then((data) => { 
      console.log("Store deleted:", data);
      fetchStores(); // refresh store list after deletion
    });
  }


fetchStores();
// fetchStores("/api/stores/sortByDstrictAscending");


document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("addStoreForm");

  form.addEventListener("submit", function (e) {
    e.preventDefault();  // 🚨 THIS IS CRITICAL

    const name = document.getElementById("storeName").value.trim();
    const url = document.getElementById("storeUrl").value.trim();
    const phone = document.getElementById("storePhone").value.trim();
    const district = document.getElementById("storeDistrict").value.trim();

    addStore(name, url, district, phone);
  });

});

