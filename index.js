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
    connectionString: process.env.PG_URL,
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cors());

app.set("view engine", "ejs");

app.get("/", async (req, res) => {
    const result = await db.query("SELECT * FROM todolist ORDER BY id ");

    const atividades = result.rows.map((item) => item);
    console.log(atividades);
    res.render("index", { atividades: atividades });
});

app.post("/add", (req, res) => {
    const atividade = req.body.activity;

    if (atividade.trim().length) {
        db.query("INSERT INTO todolist (atividade) VALUES ($1)", [atividade]);
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
        db.query("UPDATE todolist SET atividade = $1 WHERE id = $2", [
            editado,
            id,
        ]);
    }

    res.redirect("/");
});

app.listen(port, () => {
    console.log(`Server on port ${port}`);
});
