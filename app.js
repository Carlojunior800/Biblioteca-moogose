
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = 3000;


mongoose.connect("mongodb+srv://carlos_junior:carlos_junior@cluster0.smdgh.mongodb.net/?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });

app.set('view engine', 'ejs');
app.set('views', __dirname, 'views');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(express.json());

app.listen(PORT, () => {
    console.log(`Server is now running. PORT: ${PORT}`);
});

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/cadastro', (req, res) => {
    res.render('cadastro');
});

const livros = mongoose.model('livros', {
    titulo: String,
    autor: String,
    serie: String,
    edicao: Number,
    genero: String
});

app.post('/cadastro', (req, res) => {
    var livro = new livros();
    livro.titulo = req.body.titulo;
    livro.autor = req.body.autor;
    livro.serie = req.body.serie;
    livro.edicao = req.body.edicao;
    livro.genero = req.body.genero;
    livro.save((err) => {
        if (err) {
            return res.status(500).send('Erro ao cadastrar livro.');
        }
        return res.redirect('/listarLivros');
    })
});

app.get("/listarLivros", (req, res) => {
    let consultar = livros.find({}, (err, livro) => {
        if (err)
            return res.status(500).send("Erro ao visualizar livros.");
        res.render("listarLivros", { livros_add: livro });
    });
});

app.get("/deletarLivro/:id", (req, res) => {
    var id = req.params.id;
    livros.deleteOne({ _id: id }, (err, res) => {
        if (err)
            return res.status(500).send("Erro ao excluir livro.");
    });
    res.redirect("/listarLivros");
});

app.get("/editarLivro/:id", (req, res) => {
    livros.findById(req.params.id, (err, livro) => {
        if (err)
            return res.status(500).send("Erro ao consultar dados do livro.");
        res.render("formEditarLivro", { livros_add: livro });
    });
});

app.post("/editarLivro", (req, res) => {
    livros.findById(req.body.id, (err, livro) => {
        if (err)
            return res.status(500).send("Erro ao consultar dados do livro.");
        livro.titulo = req.body.titulo;
        livro.autor = req.body.autor;
        livro.serie = req.body.serie;
        livro.edicao = req.body.edicao;
        livro.genero = req.body.genero;
        livro.save(err => {
            if (err)
                return res.status(500).send("Erro ao consultar dados do livro.");
            return res.redirect("/listarLivros");
        });
    });
}); 