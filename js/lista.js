let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];

const formulario = document.querySelector("#form-tarefa");
const campo = document.querySelector("#tarefa");
const prioridade = document.querySelector("#prioridade");
const filtro = document.querySelector("#filtro");
const lista = document.querySelector("#lista");
const aviso = document.querySelector("#aviso");

function salvar() {
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

function mostrar() {
    lista.innerHTML = "";

    let totalFeitas = 0;

    for (let tarefa of tarefas) {
        if (tarefa.feita) {
            totalFeitas++;
        }

        if (filtro.value == "Pendentes" && tarefa.feita) {
            continue;
        }

        if (filtro.value == "Concluídas" && !tarefa.feita) {
            continue;
        }

        let item = document.createElement("div");
        item.className = "item";

        let nome = document.createElement("span");
        nome.textContent = tarefa.texto;

        if (tarefa.feita) {
            nome.className = "feita";
        }

        let marcar = document.createElement("input");
        marcar.type = "checkbox";
        marcar.checked = tarefa.feita;

        marcar.addEventListener("change", function() {
            tarefa.feita = marcar.checked;
            salvar();
            mostrar();
        });

        let textoPrioridade = document.createElement("p");
        textoPrioridade.textContent = "Prioridade: " + tarefa.prioridade;

        let excluir = document.createElement("button");
        excluir.textContent = "Excluir";

        excluir.addEventListener("click", function() {
            tarefas = tarefas.filter(function(t) {
                return t.id != tarefa.id;
            });

            salvar();
            mostrar();
            aviso.textContent = "Tarefa excluída.";
        });

        item.appendChild(marcar);
        item.appendChild(nome);
        item.appendChild(textoPrioridade);
        item.appendChild(excluir);

        lista.appendChild(item);
    }

    document.querySelector("#t-total").textContent = tarefas.length;
    document.querySelector("#t-feitas").textContent = totalFeitas;
    document.querySelector("#t-pendentes").textContent = tarefas.length - totalFeitas;

    if (lista.innerHTML == "") {
        lista.textContent = "Nenhuma tarefa encontrada.";
    }
}

formulario.addEventListener("submit", function(event) {
    event.preventDefault();

    let texto = campo.value.trim();

    if (texto == "") {
        aviso.textContent = "Digite uma tarefa.";
        return;
    }

    let tarefa = {
        id: Date.now(),
        texto: texto,
        prioridade: prioridade.value,
        feita: false
    };

    tarefas.push(tarefa);

    salvar();
    mostrar();

    campo.value = "";
    prioridade.value = "Média";
    aviso.textContent = "Tarefa adicionada.";
});

filtro.addEventListener("change", mostrar);

mostrar();
