const CHAVE = "biblioteca-livros";
const form = document.getElementById("form-livro");
const campoTitulo = document.getElementById("titulo");
const campoAutor = document.getElementById("autor");
const campoCategoria = document.getElementById("categoria");
const campoBusca = document.getElementById("busca");
const listaLivros = document.getElementById("lista-livros");
const aviso = document.getElementById("aviso");
const numTotal = document.getElementById("total");
const numDisponiveis = document.getElementById("disponiveis");
const numEmprestados = document.getElementById("emprestados");
let temporizador;
let livros = [];

try {
    livros = JSON.parse(localStorage.getItem(CHAVE)) || [];
} catch (erro) {
    livros = [];
}

function salvar() {
    localStorage.setItem(CHAVE, JSON.stringify(livros));
}

function mostrarAviso(texto, tipo) {
    aviso.textContent = texto;
    aviso.className = "aviso " + tipo;
    aviso.hidden = false;
    clearTimeout(temporizador);
    temporizador = setTimeout(function () {
        aviso.hidden = true;
    }, 3000);
}

function criar(tag, texto, classe) {
    const elemento = document.createElement(tag);
    elemento.textContent = texto;
    if (classe) {
        elemento.className = classe;
    }
    return elemento;
}

function atualizarContadores() {
    let emprestados = 0;
    for (const livro of livros) {
        if (livro.emprestado) {
            emprestados++;
        }
    }
    numTotal.textContent = livros.length;
    numDisponiveis.textContent = livros.length - emprestados;
    numEmprestados.textContent = emprestados;
}

