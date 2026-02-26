const { Client } = require("pg");
// Configure the client to connect to your containerized PostgreSQL

const client = new Client({
  host: "localhost", // since the container's port is mapped to localho
  port: 5432,
  user: "postgres", // default user
  password: "12345", // password set in the container command
  database: "postgres", // default database
});

async function connectDB() {
  try {
    await client.connect();
    console.log("Connected to PostgreSQL database with async/await");
  } catch (err) {
    console.error("Connection error", err.stack);
  }
}
connectDB(); // should be called before any other function

async function selectRecords() {
  const selectQuery = "SELECT * FROM employees;";
  try {
    const res = await client.query(selectQuery);
    console.log("All employees:", res.rows);
  } catch (err) {
    console.error("Error selecting records", err.stack);
  }
}

function insertRecord(insertValues) {
  const insertQuery = `
INSERT INTO employees (first_name, last_name, email, hire_date)
VALUES ($1, $2, $3, $4)
RETURNING *;
`;
  client
    .query(insertQuery, insertValues)
    .then((res) => console.log("Inserted record:", res.rows[0]))
    .catch((err) => console.error("Error inserting record", err.stack));
}
const insertValues = [
  "You",
  "YourLastame",
  "you.yourlastnamel@example.com",
  "2023-01-15",
];
insertRecord(insertValues);

selectRecords();
