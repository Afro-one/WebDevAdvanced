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
        let phoneNumber = document.createElement("p");
        let deleteBtn = document.createElement("button");

        storeName.innerText = item.name;
        storeUrl.href = `https://${item.url}`;
        storeUrl.innerText = "Click me!";
        storeDistrict.innerText = item.district;
        phoneNumber.innerText = item.phone_number;
        storeDiv.setAttribute("storeId", item.id);

        deleteBtn.innerText = "Delete";
        deleteBtn.classList.add("btn", "btn--delete");
        // deleteBtn.style.background = "linear-gradient(45deg, #e52e71, #8b0000)";
        deleteBtn.addEventListener("click", () => deleteStore(item.id));

        storeDiv.appendChild(storeName);
        storeDiv.appendChild(storeDistrict);
        storeDiv.appendChild(phoneNumber);
        storeDiv.appendChild(storeUrl);
        storeDiv.appendChild(deleteBtn);
        storesContainer.appendChild(storeDiv);
      }
    });
}

function addStore(name, url, district, phone) {
  fetch("/api/store", {
    method: "POST",
    headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
          },
    body: JSON.stringify({
            "name": name,
            "url": url,
            "district": district,
            "phone_number": phone
        })   
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("New store added:", data);
      fetchStores(); // store list refresh after adding new store
    });
}

function updateStore(id, name, url, district, phone) {
  fetch(`/api/store/${id}`, {
    method: "PUT",
    headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
          },
    body: JSON.stringify({
            "name": name,
            "url": url,
            "district": district,
            "phone_number": phone
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

// addStore("Test Store", "www.teststore.com", "Test District", "123456789");
