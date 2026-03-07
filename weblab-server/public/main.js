// current route kept for the consistency between editing and deleting
let currentRoute = "/api/stores";

function fetchStores(route = "/api/stores") {
  const storesContainer = document.getElementById("stores");
  storesContainer.innerHTML = "";

  fetch("/api/auth/status")
    .then((response) => response.json())
    .then((authData) => {
      fetch(route)
        .then((response) => response.json())
        .then((data) => {
          for (const item of data) {
            let storeDiv = document.createElement("div");
            storeDiv.id = "storeDiv"
            storeDiv.classList.add("store");

            let storeName = document.createElement("h2");
            let storeDistrict = document.createElement("p");
            let phoneNumber = document.createElement("p");

            storeName.innerText = item.name;
            storeDistrict.innerText = item.district;
            phoneNumber.innerText = item.phone_number;
            storeDiv.setAttribute("storeId", item.id);

            storeDiv.appendChild(storeName);
            storeDiv.appendChild(storeDistrict);
            storeDiv.appendChild(phoneNumber);

            // adding the link button only if item.url exists
            if (item.url) {
              let storeUrl = document.createElement("a");
              storeUrl.innerText = "Click me!";

              if (item.url.startsWith("https://")) {
                storeUrl.href = item.url;
              } else {
                storeUrl.href = `https://${item.url}`;
              }

              storeDiv.appendChild(storeUrl);
            }

            if (authData.loggedIn) {
              let deleteBtn = document.createElement("button");
              let editBtn = document.createElement("button");

              deleteBtn.innerText = "Delete";
              deleteBtn.classList.add("btn", "btn--delete");
              deleteBtn.addEventListener("click", () => deleteStore(item.id));

              editBtn.innerText = "Edit";
              editBtn.classList.add("btn", "btn--edit");
              editBtn.addEventListener("click", () => editStore(item.id));

              storeDiv.appendChild(deleteBtn);
              storeDiv.appendChild(editBtn);
            }

            storesContainer.appendChild(storeDiv);
          }
        });
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
    fetchStores(currentRoute); // store list refresh after adding new store
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
    fetchStores(currentRoute); // refresh store list after update
  });
}

function deleteStore(id) {
fetch(`/api/store/${id}`, {
  method: "DELETE"
})
  .then((response) => response.json())
  .then((data) => { 
    console.log("Store deleted:", data);
    fetchStores(currentRoute); // refresh store list after deletion
  });
}

const form = document.getElementById("addStoreForm");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const id = document.getElementById("storeId").value;
  const name = document.getElementById("storeName").value.trim();
  const url = document.getElementById("storeUrl").value.trim();
  const phone = document.getElementById("storePhone").value.trim();
  const district = document.getElementById("storeDistrict").value.trim();

  if (id) {
    updateStore(id, name, url, district, phone);
  } else {
    addStore(name, url, district, phone);
  }

  form.reset();
  document.getElementById("storeId").value = "";
  document.getElementById("formBtn").innerText = "Add store";
});

function editStore(id) {
  const storeDiv = document.querySelector(`[storeId="${id}"]`);

  document.getElementById("storeId").value = id;
  document.getElementById("storeName").value = storeDiv.querySelector("h2").innerText;
  document.getElementById("storeDistrict").value = storeDiv.querySelector("p:nth-child(2)").innerText;
  document.getElementById("storePhone").value = storeDiv.querySelector("p:nth-child(3)").innerText;

  // Check if the store has a URL before trying to access it
  const link = storeDiv.querySelector("a");
  document.getElementById("storeUrl").value = link ? link.href : "";

  document.getElementById("formBtn").innerText = "Update store";

  // scroll to the form when edit button is clicked
  document.getElementById("addStoreForm").scrollIntoView({ behavior: "smooth" });
}

document.getElementById("sortNameAsc").addEventListener("click", () => {
  currentRoute = "/api/stores/sortNameAsc";
  fetchStores(currentRoute);
});


document.getElementById("sortNameDesc").addEventListener("click", () =>{
  currentRoute = "/api/stores/sortNameDesc";
  fetchStores(currentRoute);
});

document.getElementById("sortDistrictAsc").addEventListener("click", () => {
  currentRoute = "/api/stores/sortDistrictAsc";
  fetchStores(currentRoute);
});

document.getElementById("sortDistrictDesc").addEventListener("click", () => {
  currentRoute = "/api/stores/sortDistrictDesc";
  fetchStores(currentRoute);
});

function checkAuth() {
fetch("/api/auth/status")
  .then((response) => response.json())
  .then((data) => {
    document.getElementById("formPanel").style.display = data.loggedIn ? "block" : "none";
    document.getElementById('login').style.display = data.loggedIn ? "none" : "inline";
    document.getElementById('logout').style.display = data.loggedIn ? "inline" : "none";
  });
}

checkAuth();
fetchStores(currentRoute);