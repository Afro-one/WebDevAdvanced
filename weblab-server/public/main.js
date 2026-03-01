// To fetch by sorted by district ascenidcng
function fetchStores(route = "/api/stores") {
  const storesContainer = document.getElementById("stores"); // ← use existing div

  fetch(route)
    .then((response) => response.json())
    .then((data) => {
      storesContainer.innerHTML = ""; // clear before re-rendering
      for (const item of data) {
        let storeDiv = document.createElement("div");
        storeDiv.classList.add("store"); // ← add the CSS class!

        let storeName = document.createElement("h2"); // h2 matches your CSS
        let storeUrl = document.createElement("a");
        let storeDistrict = document.createElement("p");

        storeName.innerText = item.name;
        storeUrl.href = item.url;
        // storeUrl.innerText = item.url;
        storeUrl.innerText = "Click me!";
        storeDistrict.innerText = item.district;

        storeDiv.appendChild(storeName);
        storeDiv.appendChild(storeUrl);
        storeDiv.appendChild(storeDistrict);
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

// fetchStores();
fetchStores("/api/stores/sortByDstrictAscending");

document.addEventListener("DOMContentLoaded", loadStores);

