// To fetch by sorted by district ascenidcng
function fetchStores(route = "/api/stores") {
  const storesContainer = document.getElementById("stores");
  storesContainer.innerHTML = ""; // Clear existing stores (fix for delete)
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
        let editBtn = document.createElement("button");

        storeName.innerText = item.name;
        storeUrl.href = `https://${item.url}`;
        storeUrl.innerText = "Click me!";
        storeDistrict.innerText = item.district;
        phoneNumber.innerText = item.phone_number;
        storeDiv.setAttribute("storeId", item.id);

        deleteBtn.innerText = "Delete";
        deleteBtn.classList.add("btn", "btn--delete");
        deleteBtn.addEventListener("click", () => deleteStore(item.id));

        editBtn.innerText = "Edit";
        editBtn.classList.add("btn", "btn--edit");
        editBtn.addEventListener("click", () => editStore(item.id));

        storeDiv.appendChild(storeName);
        storeDiv.appendChild(storeDistrict);
        storeDiv.appendChild(phoneNumber);
        storeDiv.appendChild(storeUrl);
        storeDiv.appendChild(deleteBtn);
        storeDiv.appendChild(editBtn);
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
  document.querySelector("#addStoreForm .btn[type='submit']").innerText = "Add store";
});

function editStore(id) {
  // Find the store div and read its data back out
  const storeDiv = document.querySelector(`[storeId="${id}"]`);

  // Populate the form fields
  document.getElementById("storeId").value = id;
  document.getElementById("storeName").value = storeDiv.querySelector("h2").innerText;
  document.getElementById("storeDistrict").value = storeDiv.querySelector("p:nth-child(2)").innerText;
  document.getElementById("storePhone").value = storeDiv.querySelector("p:nth-child(3)").innerText;
  document.getElementById("storeUrl").value = storeDiv.querySelector("a").href.replace("https://", "");

  // Update button label so user knows they're editing
  document.querySelector("#addStoreForm .btn[type='submit']").innerText = "Update store";

  // Scroll up to the form
  document.getElementById("addStoreForm").scrollIntoView({ behavior: "smooth" });
}