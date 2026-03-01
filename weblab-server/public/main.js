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

        storeDiv.appendChild(storeName);
        storeDiv.appendChild(storeDistrict);
        storeDiv.appendChild(storeUrl);
        storesContainer.appendChild(storeDiv);
      }
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

fetchStores();
// fetchStores("/api/stores/sortByDstrictAscending");

document.addEventListener("DOMContentLoaded", loadStores);

