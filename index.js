import express from "express";
import bodyParser from "body-parser";
import ejs from "ejs";
import pg from "pg";
import cors from "cors";
import env from "dotenv";

const app = express();
const port = 3000;
env.config();

const db = new pg.Client({
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cors());

app.get("/", async (req, res) => {
    const result = await db.query("SELECT * FROM todolist ORDER BY id ");

    const atividades = result.rows.map((item) => item);

    res.render("index.ejs", { atividades: atividades });
});

app.post("/add", (req, res) => {
    const atividade = req.body.activity;

    if (atividade.trim().length) {
        db.query("INSERT INTO todolist (activity) VALUES ($1)", [atividade]);
    }

    res.redirect("/");
});

app.post("/delete", (req, res) => {
    const deletado = req.body.deletado;
    console.log(deletado);
    db.query("DELETE FROM todolist WHERE id = $1", [deletado]);

    res.redirect("/");
});

app.post("/edit", (req, res) => {
    const editado = req.body.editado;
    const id = req.body.idEditado;

    console.log(editado);

    if (editado.length > 0) {
        db.query("UPDATE todolist SET activity = $1 WHERE id = $2", [
            editado,
            id,
        ]);
    }

    res.redirect("/");
});

app.listen(port, () => {
    console.log(`Server on port ${port}`);
});
