const express = require("express");
const cookieParser = require("cookie-parser"); // for the login
const crypto = require("crypto"); // for the login cookie
const { Client } = require("pg");
const app = express();
const PORT = 3000;

const secret = "mySecretCookieToken"; // for the secret cookie
const sessions = {}; // for the login token

// for the login
app.use(cookieParser(secret));

const client = new Client({
  host: "localhost", // since the container's port is mapped to localhost
  // host: "host.docker.internal",
  port: 5432,
  user: "postgres", // default user
  password: "12345", // password set in the container command
  database: "stores", // stores database
});

app.use("/", express.static("public"));

// serve the login page with a form to login
app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/login/login.html");
});

// for the login
app.post("/login", express.urlencoded({ extended: true }), (req, res) => {
  //POST /login route for the form send above
  console.log("POST ROUTE /login called");
  const { username, password } = req.body;
  if (username === "admin" && password === "password") {
    // In a real-world validate credentials against a database
    const token = crypto.randomBytes(64).toString("hex"); // Generate a secure random token
    sessions[token] = { username }; // Store the token along with user data in our session store
    res.cookie("authToken", token, { signed: true, httpOnly: true }); // Set a signed, HTTP-only cookie with the token
    res.redirect("/"); // Redirect the user to the default route after successful login
  } else {
    res.status(401).send(`Login Error: Invalid credentials. Please try again.`);
  }
});

// protected route that can only be accessed if the user is logged in.
app.get("/protected", (req, res) => {
  const token = req.signedCookies.authToken; // Read the token out of the cookies
  if (token && sessions[token]) {
    // if there is a token at all and if we know that token in our session store
    res.send(` // send the protect protected content
<!DOCTYPE html><html><head><title>Protected</title></head>
<body>
<h1>Protected Page</h1>
<p>Welcome, ${sessions[token].username}! This page is only accessible if you are logged in.</p>
<p><a href="/">Back to Home</a></p>
</body></html>
`);
  } else {
    res.redirect("/login"); // else forward to login page
  }
});
// clear the cookies, remove session and redirect to default route (logging out)
app.get("/logout", (req, res) => {
  const token = req.signedCookies.authToken;
  if (token) {
    delete sessions[token];
  }
  res.clearCookie("authToken");
  res.redirect("/login");
});

app.get("/api/stores", async (req, res) => {
  const selectQuery = "SELECT * FROM stores;";
  try {
    const dbresult = await client.query(selectQuery);
    res.json(dbresult.rows);
  } catch (err) {
    console.error("Error selecting records", err.stack);
  }
});

// This is to sort
app.get("/api/stores/sortByDstrictAscending", async (req, res) => {
  const selectQuery = "SELECT * FROM stores ORDER BY district ASC;";
  try {
    const dbresult = await client.query(selectQuery);
    res.json(dbresult.rows);
  } catch (err) {
    console.error("Error selecting records", err.stack);
  }
});

app.post("/api/store", express.json(), async (req, res) => {
  const insertQuery = `INSERT INTO stores (name, url, district, phone_number)
                        VALUES ($1, $2, $3, $4)
                        RETURNING *;`;
  const insertValues = [req.body.name, req.body.url, req.body.district, req.body.phone_number];
  try {
    const dbresult = await client.query(insertQuery, insertValues);
    res.json(dbresult.rows[0]);
  } catch (err) {
    console.error("Error inserting records", err.stack);
  }
});

// Update
app.put("/api/store/:id", express.json(), async (req, res) => {
  const { name, url, district , phone_number} = req.body;
  const { id } = req.params;

  try {
    const result = await client.query(
      `UPDATE stores SET name=$1, url=$2, district=$3, phone_number=$4 WHERE id=$5 RETURNING *`,
      [name, url, district, phone_number, id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Store not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating store", err.stack);
    res.status(500).json({ error: "Database error" });
  }
});

//Delete
app.delete("/api/store/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await client.query(
      "DELETE FROM stores WHERE id=$1 RETURNING *",
      [id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Store not found" });
    }
    res.json({ message: "Store deleted" });
  } catch (err) {
    console.error("Error deleting store", err.stack);
    res.status(500).json({ error: "Database error" });
  }
});

const startServer = async () => {
  try {
    await client.connect();
    console.log("Connected to PostgreSQL database ");

    // ONE-TIME SEED
    /*     const fs = require("fs");
    const stores = JSON.parse(fs.readFileSync("stores.json", "utf-8"));
    for (const store of stores) {
      await client.query(
        "INSERT INTO stores (name, url, district) VALUES ($1, $2, $3)",
        [store.name, store.url, store.district],
      );
    }
    console.log(`seded ${stores.length} stores`); */
    // END SEED
  } catch (err) {
    console.error("Connection error", err.stack);
  }
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
};
startServer();
