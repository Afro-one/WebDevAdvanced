//const { response } = require("express");

console.log("static file loaded!");

function fetchProducts() {
  fetch("/api/products")
    .then((response) => response.json())
    .then((data) => {
      console.log("Products:", data);
    })
    .catch((error) => console.error("Error fetching products:", error));
}

fetchProducts();

function fetchProductsById(productId) {
  fetch(`/api/products/${productId}`)
    .then((response) => response.json())
    .then((data) => {
      console.log(`Product with Id ${productId}:`, data);
    })
    .catch((error) => console.error("Error fetching product by ID:", error));
}

fetchProductsById(1);

//assignment 1
function addProduct(name, price) {
  fetch("/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, price }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("Product added:", data);
      fetchProducts();
    });
}

addProduct("Tablet", 9344);

//assignment 2
function updateProduct(id, name, price) {
  fetch(`/api/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, price }),
  })
    .then((res) => res.json())
    .then((data) => console.log("Product added:", data));
}

updateProduct(1, "Updated Laptop", 6538);

/*

const source = "http://localhost:3000//api/products";
fetch(source)
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    data.forEach((c) => {
      let new_li = document.createElement("li");
      new_li.innerText = c.name;
      document.querySelector("#mylist").appendChild(new_li);
    });
  })
  .catch((error) => console.log("Error: ", error));

//here 


function facto(n) {
  // iterative
  let prod = 1;
  for (let i = n; i > 0; i--) {
    prod = prod * i;
  }
  return prod;
}

*/
