const express = require("express");
const { Client } = require("pg");
const app = express();
const PORT = 3000;

const client = new Client({
  host: "localhost", // since the container's port is mapped to localhost
  port: 5432,
  user: "postgres", // default user
  password: "12345", // password set in the container command
  database: "stores", // stores database
});

app.use("/", express.static("public"));

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
  const insertQuery = `INSERT INTO stores (name, url, district)
                        VALUES ($1, $2, $3)
                        RETURNING *;`;
  const insertValues = [req.body.name, req.body.url, req.body.district];
  try {
    const dbresult = await client.query(insertQuery, insertValues);
    res.json(dbresult.rows[0]);
  } catch {
    console.error("Error inserting records", err.stack);
  }
});

// Update
app.put("/api/store/:id", express.json(), async (req, res) => {
  const { name, url, district } = req.body;
  const { id } = req.params;

  try {
    const result = await client.query(
      `UPDATE stores SET name=$1, url=$2, district=$3 WHERE id=$4 RETURNING *`,
      [name, url, district, id],
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
