const semana = document.getElementById("semana");
const diaSemana = [...document.getElementsByClassName("dia")];
const containerDiaSemana = [...document.getElementsByClassName("container-dia-semana")];
const ulListaItens = [...document.getElementsByClassName("lista-itens")];
const liItens = [...document.getElementsByClassName("li-tarefas")];
const modal = document.getElementById("modal-overlay");
const btnAddItem = document.getElementById("btn-add-form");
const novaTarefa = document.getElementById("input-novo-item");
const selectDiaSemana = document.querySelector("select");
const btnsAdd = [...document.getElementsByClassName("btn-add")];
let editDiaSemana = null;

let tarefas = {
    "segunda": [],
    "terca": [],
    "quarta": [],
    "quinta": [],
    "sexta": [],
    "sabado": [],
    "domingo": [],
};

//@ Função para recuperar os dados armazenados no localstorage e passar os parâmetros para criar as li's =
function recuperarDados() {
    Object.keys(tarefas).forEach((key) => { //_ Mostra todas as chaves primárias do objeto
        let valueKey = localStorage.getItem(key);
        tarefas[key] = JSON.parse(valueKey) ?? [];
        let recuperaTarefas = tarefas[key];

        // criando Tarefas =
        recuperaTarefas.forEach((objetoTarefa) => {
            criarTarefa(
                objetoTarefa.nomeTarefa,
                key,
                objetoTarefa.isCheck,
                false
            )
        })
    })  
}
recuperarDados()


//@ Função para exibir o modal para criar novas tarefas (li's) =
btnsAdd.forEach((btn) => {
    btn.addEventListener("click", (evento) => {
        evento.preventDefault();
        let dia = evento.target.parentElement.firstElementChild;
        let indexDia = diaSemana.indexOf(dia);
        mostraModal(indexDia);
        cancelarEditTarefa()
    })
})

function mostraModal(indexDia) {
    modal.style.display = "block";
    selectDiaSemana.selectedIndex = indexDia;
}


//@ Função para capturar os dados do modal e criar as novas tarefas (li's) =
btnAddItem.addEventListener("click", (e) => {
    e.preventDefault();
    let nomeNovaTarefa = novaTarefa.value;
    let diaNovaTarefa = selectDiaSemana.value;
    criarTarefa(nomeNovaTarefa, diaNovaTarefa, false, true);
    modal.style.display = "none";  //removendo o modal
    novaTarefa.value = ""; //limpando o texto do input
})

function criarTarefa(nomeNovaTarefa, diaNovaTarefa, isCheck, precisaSalvar) {
    let diaSemanaAdd = document.getElementById(`${diaNovaTarefa}`);
    
    //criando a li =
    const li = document.createElement("li");
    li.className = "li-tarefas";
    li.setAttribute("dia-semana", diaNovaTarefa);

    //criando o botão de check =
    const checkButton = document.createElement("input");
    checkButton.className = "btn-check";
    checkButton.setAttribute("type", "checkbox");
    checkButton.addEventListener("click", checar);
    li.appendChild(checkButton);
    //isCheck? (checkButton.checked = isCheck) : (checkButton.checked = isCheck);//_Não precisa da condição
    checkButton.checked = isCheck;

    //criando o texto da li =
    const p = document.createElement("p");
    p.className = "nome-tarefa";
    if (!nomeNovaTarefa) {
        alert("Para continuar, por favor adicione um nome para sua Tarefa");
        throw Error("Para continuar, por favor adicione um nome para sua Tarefa");
    }
    p.textContent = nomeNovaTarefa;
    li.appendChild(p);

    //criando o botão de editar =
    const editButton = document.createElement("i");
    editButton.className = "fas fa-edit";
    editButton.addEventListener("click", criarCaixaEditar);
    li.appendChild(editButton);

    //criando o botão de excluir =
    const deleteButton = document.createElement("i");
    deleteButton.className = "fas fa-trash-alt";
    deleteButton.addEventListener("click", deletar);
    li.appendChild(deleteButton);

    //adicionando a li na ul correspondente =
    let adicionar = diaSemanaAdd.parentElement.nextElementSibling;
    adicionar.appendChild(li);

    salvarLocalstorage(precisaSalvar, nomeNovaTarefa, diaNovaTarefa)
}


//@ Função para salvar no localstorage em caso de nova tarefa =
function salvarLocalstorage(precisaSalvar, nomeNovaTarefa, diaNovaTarefa) {
    if (precisaSalvar) {
        const tarefa = {
            nomeTarefa: nomeNovaTarefa,
            isCheck: false, //_sempre que tem booleano escreva de forma com que facilite a leitura como se estivesse fazendo um ternário "está checado?"
        }
        tarefas[`${diaNovaTarefa}`].push(tarefa);
        localStorage.setItem(`${diaNovaTarefa}`, JSON.stringify(tarefas[diaNovaTarefa]));
    }
}


//@ Atribuindo funcionamento ao botão de "fechar" do modal =
const btnCloseModal = document.querySelector("span");
btnCloseModal.addEventListener("click", evento => {
    evento.preventDefault();
    modal.style.display = "none";
})


//@ Função para fechar o modal quando clicar fora do mesmo =
function fecharModal() {
    document.documentElement.onclick = (event) => {
        const overlay = document.getElementById("modal-overlay");
        if (event.target == overlay) {
            overlay.style.display = "none";
        }
    }
}
fecharModal()


//@ Atribuindo funcionamento aos botões das li's (check, edit, deleted) =
// CHECAR =
function checar() {
    const diaSemana = this.parentElement.getAttribute("dia-semana");
    const li = this.parentElement;
    const ul = li.parentElement;
    const indexUl = ulListaItens.indexOf(ul);
    const ulItens = [...ulListaItens[indexUl].children];
    const indexli = ulItens.indexOf(li);

    if (this.checked) {
        !this.checked;
        tarefas[diaSemana][indexli].isCheck = true;
    } else {
        this.checked;
        tarefas[diaSemana][indexli].isCheck = false;
    }
    cancelarEditTarefa()
    update(diaSemana)
}

// EDITAR =
const editContainer = document.getElementById("editContainer");
let editInput = document.getElementById("editInput");

function criarCaixaEditar(evento) {
    editContainer.style.display = "flex";
    let posicaoAltura = this.offsetTop;
    let posicaoLargura = this.offsetLeft;

    editContainer.style.top = `${posicaoAltura + 30}px`;
    editContainer.style.left = `${posicaoLargura - 265}px`;

    editDiaSemana = evento.target.parentElement;
    let nomeTarefaAtual = evento.target.parentElement.querySelector(".nome-tarefa").textContent;
    let textoLi = editContainer.firstElementChild;
    textoLi.value = nomeTarefaAtual;
}

function editar() {
    let textoLi = editDiaSemana.querySelector(".nome-tarefa");
    const diaSemana = textoLi.parentElement.getAttribute("dia-semana");
    const li = textoLi.parentElement;
    const ul = li.parentElement;
    const indexUl = ulListaItens.indexOf(ul);
    const ulItens = [...ulListaItens[indexUl].children];
    const indexli = ulItens.indexOf(li);
    
    if (editInput.value) {
        textoLi.textContent = editInput.value;
        cancelarEditTarefa()
    } else {
        alert("Para continuar, por favor adicione um nome para sua Tarefa");
        throw Error("Para continuar, por favor adicione um nome para sua Tarefa");
    }
    textoLi.textContent = editInput.value;
    tarefas[diaSemana][indexli].nomeTarefa = editInput.value;
    update(diaSemana)
}

function cancelar() {
    cancelarEditTarefa()
}

// DELETAR =
function deletar() {
    cancelarEditTarefa()
    const li = this.parentElement;
    const ul = li.parentElement;
    const indexUl = ulListaItens.indexOf(ul);
    const ulItens = [...ulListaItens[indexUl].children];
    const indexli = ulItens.indexOf(li);
    const diaSemana = li.getAttribute("dia-semana");

    tarefas[diaSemana].splice(indexli, 1);
    this.parentElement.remove();
    update(diaSemana);
}


//@ Função update (atualizar os dados do localstorage) =
function update(diaSemana) {
    localStorage.setItem(`${diaSemana}`, JSON.stringify(tarefas[diaSemana]));
}

function cancelarEditTarefa(){
    editContainer.style.display = "none";
}


//@ Alinhamento do footer =
const footerDiv = document.getElementById("footer");
document.addEventListener("scroll", () => {
    footerDiv.style.left = `${window.scrollX}px`;
})
