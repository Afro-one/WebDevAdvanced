function fetchStores() {
  let storesContainer = document.createElement("div");
  storesContainer.classList.add("storesContainer");
  document.body.appendChild(storesContainer);

  fetch("/api/stores")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      for (const item of data) {
        let storeDiv = document.createElement("div");
        let storeName = document.createElement("h1");
        let storeUrl = document.createElement("p");
        let storeDistrict = document.createElement("p");

        storeName.innerText = item.name;
        storeDiv.appendChild(storeName);

        storeUrl.innerText = item.url;
        storeDiv.appendChild(storeUrl);

        storeDistrict.innerText = item.district;
        storeDiv.appendChild(storeDistrict);

        storesContainer.appendChild(storeDiv);
      }

      console.log(data);
    });
}

// To fetch by sorted by district ascenidcng
function fetchStoresByDistrictAsc() {
  let storesContainer = document.createElement("div");
  storesContainer.classList.add("storesContainer");
  document.body.appendChild(storesContainer);

  fetch("/api/stores/sortByDstrictAscending")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      for (const item of data) {
        let storeDiv = document.createElement("div");
        let storeName = document.createElement("h1");
        let storeUrl = document.createElement("p");
        let storeDistrict = document.createElement("p");

        storeName.innerText = item.name;
        storeDiv.appendChild(storeName);

        storeUrl.innerText = item.url;
        storeDiv.appendChild(storeUrl);

        storeDistrict.innerText = item.district;
        storeDiv.appendChild(storeDistrict);

        storesContainer.appendChild(storeDiv);
      }

      console.log(data);
    });
}

// Interaction with the put and delete

async function editStore(id) {
  const name = prompt("Enter new name:");
  const url = prompt("Enter new URL:");
  const district = prompt("Enter new district:");

  if (!name) return;

  const updatedStore = { name, url, district };

  try {
    const res = await fetch(`/api/store/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedStore),
    });
    if (!res.ok) throw new Error("Failed to update store");

    loadStores(); // refresh table
  } catch (err) {
    console.error("Error updating store:", err);
  }
}

async function deleteStore(id) {
  if (!confirm("Are you sure you want to delete this store?")) return;

  try {
    const res = await fetch(`/api/store/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete store");

    loadStores(); // refresh table
  } catch (err) {
    console.error("Error deleting store:", err);
  }
}

fetchStoresByDistrictAsc();
//fetchStores();

document.addEventListener("DOMContentLoaded", loadStores);
