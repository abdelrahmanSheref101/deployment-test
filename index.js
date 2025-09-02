//
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors("http://localhost:5173/"));

let notes = [
        {
                id: "1",
                content: "HTML is easy",
                important: true,
        },
        {
                id: "2",
                content: "Browser can execute only JavaScript",
                important: false,
        },
        {
                id: "3",
                content: "GET and POST are the most important methods of HTTP protocol",
                important: true,
        },
];

app.get("/", (request, response) => {
        response.send("<h1>Hello World!!!</h1>");
});

app.get("/api/notes", (request, response) => {
        response.json(notes);
});

app.get("/api/notes/:id", (request, response) => {
        const id = request.params.id;
        const note = notes.find((n) => n.id === id);

        if (note) response.json(note);
        else response.status(404).end();
});

app.delete("/api/notes/:id", (request, response) => {
        const id = request.params.id;
        const newNotes = notes.filter((n) => n.id !== id);
        if (JSON.stringify(newNotes) === JSON.stringify(notes))
                return response.status(404).end();
        notes = newNotes;
        response.status(204).end();
});

app.use(express.json());

function generateId() {
        const maxId =
                notes.length > 0 ? Math.max(...notes.map((n) => Number(n.id))) : 0;

        return String(maxId + 1);
}

app.post("/api/notes", (request, response) => {
        const body = request.body;

        if (!body.content) {
                return response.status(400).json({
                        errr: "note's content is missing",
                });
        }
        const note = {
                content: body.content,
                important: body.important || false,
                id: generateId(),
        };

        notes = notes.concat(note);

        console.log("created a new note yaaay ::: ", note);

        response.json(note);
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
        console.log(`oy mate server is running on prot ${PORT}`);
});
