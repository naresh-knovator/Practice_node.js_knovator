const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const dotenv = require("dotenv").config();
const dbConnect = require("./config/dbConnect");
dbConnect(); //Database
const port = process.env.PORT || 8080;
const userRoutes = require("./routes/userRoutes");
const { notFound, errorHandle } = require("./middleware/errorHandler");


app.set("view engine", "ejs");
app.use(express.static("/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/user", userRoutes);

app.use(notFound);
app.use(errorHandle);

app.listen(8080, () => console.log(`Listening on port ${port}`));
