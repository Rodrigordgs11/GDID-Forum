const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { sequelize } = require('./src/config/database');
const userRoutes = require('./src/routes/userRoutes');
const authenticateRoutes = require('./src/routes/authenticateRoutes');
const seed = require('./src/seeders/seed');
require('./src/models/relationships');
const cookieParser = require('cookie-parser');

const app = express();

app.use(
    cors({
        origin: ["http://localhost:8282"],
        methods: "GET,POST,PUT,DELETE,OPTIONS",
        allowedHeaders: "Content-Type,Authorization",
        credentials: true,
    })
);

app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

sequelize.sync({ force: false }).then(() => {
    seed();
});

app.use("/", userRoutes);
app.use("/", authenticateRoutes);

app.get("/", function(req, res) {
    return res.send("Hello World - Forum!!!");
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => console.log(`Backend Forum is running on port ${PORT}`));