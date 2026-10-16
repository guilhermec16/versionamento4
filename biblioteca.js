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

function criarItem(livro) {
  const item = criar("div", "", "livro");

  item.appendChild(criar("h3", livro.titulo));
  item.appendChild(criar("p", "por " + livro.autor + " (" + livro.categoria + ")", "info"));

  if (livro.emprestado) {
    item.appendChild(criar("span", "Emprestado", "etiqueta emprestado"));
    item.appendChild(criar("p", "Com " + livro.leitor + ". Devolver até " + livro.devolucao + ".", "info"));
  } else {
    item.appendChild(criar("span", "Disponivel", "etiqueta disponivel"));
  }

  const botoes = criar("div", "", "botoes");
  const botaoPrincipal = criar("button", "", "botao");
  if (livro.emprestado) {
    botaoPrincipal.textContent = "Devolver";
    botaoPrincipal.addEventListener("click", function () {
      devolver(livro);
    });
  } else {
    botaoPrincipal.textContent = "Emprestar";
    botaoPrincipal.addEventListener("click", function () {
      emprestar(livro);
    });
  }

  const botaoExcluir = criar("button", "Excluir", "botao vermelho");
  botaoExcluir.addEventListener("click", function () {
    excluir(livro);
  });

  botoes.appendChild(botaoPrincipal);
  botoes.appendChild(botaoExcluir);
  item.appendChild(botoes);
  return item;
}

function mostrarLivros() {
  const busca = campoBusca.value.trim().toLowerCase();
  let encontrados = 0;

  listaLivros.innerHTML = ""; 

  for (const livro of livros) {
    const texto = (livro.titulo + " " + livro.autor).toLowerCase();
    if (texto.includes(busca)) {
      listaLivros.appendChild(criarItem(livro));
      encontrados++;
    }
  }

  if (livros.length === 0) {
    listaLivros.appendChild(criar("p", "Nenhum livro cadastrado ainda. Use o formulario acima para adicionar o primeiro.", "vazio"));
  } else if (encontrados === 0) {
    listaLivros.appendChild(criar("p", "Nenhum livro encontrado para essa pesquisa.", "vazio"));
  }

  atualizarContadores();
}

function cadastrarLivro(evento) {
  evento.preventDefault();

  const titulo = campoTitulo.value.trim();
  const autor = campoAutor.value.trim();

  if (titulo === "" || autor === "") {
    mostrarAviso("Preencha o titulo e o autor.", "erro");
    return;
  }

  livros.unshift({
    titulo: titulo,
    autor: autor,
    categoria: campoCategoria.value,
    emprestado: false,
    leitor: "",
    devolucao: ""
  });

  form.reset();
  salvar();
  mostrarLivros();
  mostrarAviso("Livro cadastrado.", "ok");
}

function emprestar(livro) {
  const nome = prompt("Quem vai levar o livro?");

  if (nome === null) {
    return;
  }
  if (nome.trim() === "") {
    mostrarAviso("Digite o nome de quem vai levar o livro.", "erro");
    return;
  }

  const prazo = new Date();
  prazo.setDate(prazo.getDate() + 7);

  livro.emprestado = true;
  livro.leitor = nome.trim();
  livro.devolucao = prazo.toLocaleDateString("pt-BR");

  salvar();
  mostrarLivros();
  mostrarAviso("Livro emprestado até " + livro.devolucao + ".", "ok");
}

function devolver(livro) {
  livro.emprestado = false;
  livro.leitor = "";
  livro.devolucao = "";
  salvar();
  mostrarLivros();
  mostrarAviso("Livro devolvido.", "ok");
}

function excluir(livro) {
  if (livro.emprestado) {
    mostrarAviso("Devolva o livro antes de excluir.", "erro");
    return;
  }
  if (!confirm("Deseja excluir \"" + livro.titulo + "\"?")) {
    return;
  }

  const posicao = livros.indexOf(livro);
  livros.splice(posicao, 1);

  salvar();
  mostrarLivros();
  mostrarAviso("Livro excluido.", "ok");
}

form.addEventListener("submit", cadastrarLivro);
campoBusca.addEventListener("input", mostrarLivros);
mostrarLivros();