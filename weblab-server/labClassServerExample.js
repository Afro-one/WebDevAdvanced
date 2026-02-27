const express = require("express");
const app = express();
const port = 3000;

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("welcome to the REST API!");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

let products = [
  {
    id: 1,
    name: "labtop",
    price: 4286,
  },
  {
    id: 2,
    name: "phone",
    price: 2379,
  },
];

app.get("/api/products", (req, res) => {
  //const pNames = products.map((product) => product.name);

  //res.json(pNames);

  res.json(products);
});

app.get("/api/products/:id", (req, res) => {
  const pId = parseInt(req.params.id, 10);
  const product = products.find((p) => p.id === pId);

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: "Product not found" });
  }
});

// part 2

// assignment 1
app.post("/api/products", express.json(), (req, res) => {
  const { name, price } = req.body;

  if (!name || !price) {
    return res.status(400).json({ error: "Name and Price are required" });
  }

  const newProduct = { id: products.length + 1, name, price };
  products.push(newProduct);

  console.log("Updated products", products);

  res.status(201).json(newProduct);
});

// assignment 2
app.put("/api/products/:id", express.json(), (req, res) => {
  const id = parseInt(req.params.id);
  const { name, price } = req.body;

  if (!name || !price) {
    return res.status(400).json({ error: "Name and Price are required" });
  }

  const product = products.find((p) => p.id === id);
  if (!product) return res.status(404).send("Product not found");

  product.name = name;
  product.price = price;

  res.json(product);
});

/*

function fetchProducts() {
  fetch("/api/products")
    .then(response.json())
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
*/
