const semana = document.getElementById("semana");
let diaSemana = [...document.getElementsByClassName("dia")];
let containerDiaSemana = [...document.getElementsByClassName("container-dia-semana")];
let ulListaItens = [...document.getElementsByClassName("lista-itens")];
let liItens = [...document.getElementsByClassName("li-tarefas")];
const modal = document.getElementById("modal-input");
const btnAddItem = document.getElementById("btn-add-form");
let novaTarefa = document.getElementById("input-novo-item");
let selectDiaSemana = document.querySelector("select");
let btnsAdd = [...document.getElementsByClassName("btn-add")];
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

function recuperarDados() {
    Object.keys(tarefas).forEach((key)=>{ //_ Mostra todas as chaves primárias do objeto
        let valueKey = localStorage.getItem(key);
        tarefas[key] = JSON.parse(valueKey) ?? [];
        let recuperaTarefas = tarefas[key];

        // criando Tarefas =
        recuperaTarefas.forEach((objetoTarefa)=>{
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

//@ FAZER O MODAL APARECER EM TODOS OS DIAS PARA ADICIONAR ITENS
btnsAdd.forEach((btn) => {
    btn.addEventListener("click", (evento) => {
        evento.preventDefault();
        let dia = evento.target.parentElement.firstElementChild;
        let indexDia = diaSemana.indexOf(dia);
        mostraModal(indexDia);
    })
})

// FUNÇÃO PARA EXIBIR O MODAL
function mostraModal(indexDia) {
    modal.style.display = "block";
    selectDiaSemana.selectedIndex = indexDia;
}

//@ CAPTURAR INPUT DO MODAL E ADICIONAR NO DIA DA SEMANA
btnAddItem.addEventListener("click", (e) => {
    e.preventDefault();
    let nomeNovaTarefa = novaTarefa.value;
    let diaNovaTarefa = selectDiaSemana.value;
    criarTarefa(nomeNovaTarefa, diaNovaTarefa, false, true); //_REVISAR P/ VER SE FUNCIONA

    //removendo o modal =
    modal.style.display = "none";  

    //limpando o texto do input =
    novaTarefa.value = "";
})

// FUNÇÃO PARA CRIAR TAREFA =
function criarTarefa(nomeNovaTarefa, diaNovaTarefa, isCheck, precisaSalvar) {
    let diaSemanaAdd = document.getElementById(`${diaNovaTarefa}`);
    //criando a li =
    const li = document.createElement("li");
    li.className = "li-tarefas";

    //criando o botão de check =
    const checkButton = document.createElement("input");
    checkButton.className = "btn-check";
    checkButton.setAttribute("type", "checkbox");
    checkButton.addEventListener("click", checar);
    li.appendChild(checkButton);
    isCheck? checkButton.checked : !checkButton.checked; //_REVISAR P/ VER SE FUNCIONA

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

    //precisaSalvar = essa li ela já existiu antes e foi salva? se sim, não salvar ela novamente
    //precisaSalvar = se não, ou seja, se ela está sendo criada agora, logo ela não foi salva, portanto precisa salvar

    if(precisaSalvar){
        const tarefa = {
            nomeTarefa: nomeNovaTarefa,
            isCheck: false, //_sempre que tem booleano escreva de forma com que facilite a leitura como se estivesse fazendo um ternário "está checado?"
        }
        tarefas[`${diaNovaTarefa}`].push(tarefa)
        localStorage.setItem(`${diaNovaTarefa}`, JSON.stringify(tarefas[`${diaNovaTarefa}`]))
    }

    // Armazenamento localstorage
 }

//@ FAZER O BOTÃO DE CLOSE DO MODAL FUNCIONAR
const btnCloseModal = document.querySelector("span");

btnCloseModal.addEventListener("click", evento => {
    evento.preventDefault();
    modal.style.display = "none";
})

//@ FAZER OS BOTÕES DAS LI'S FUNCIONAREM
function checar() {
    this.checked? !this.checked : this.checked;
}
const editContainer = document.getElementById("editContainer");

function criarCaixaEditar(evento) {
    editContainer.style.display = "flex";
    let posicaoAltura = this.offsetTop;
    let posicaoLargura = this.offsetLeft;

    editContainer.style.top = `${posicaoAltura + 30}px`;
    editContainer.style.left = `${posicaoLargura - 280}px`;

    editDiaSemana = evento.target.parentElement;
    let nomeTarefaAtual = evento.target.parentElement.querySelector(".nome-tarefa").textContent;
    let textoLi = editContainer.firstElementChild;
    textoLi.value = nomeTarefaAtual;
}

let editInput = document.getElementById("editInput");

function editar(event) {
    
    let textoLi = editDiaSemana.querySelector(".nome-tarefa");
    
    if (editInput.value) {
        textoLi.textContent = editInput.value;
        editContainer.style.display = "none";
    } else {
        alert("Para continuar, por favor adicione um nome para sua Tarefa");
        throw Error("Para continuar, por favor adicione um nome para sua Tarefa");
    }
    textoLi.textContent = editInput.value;
}

function cancelar(event) {
    console.log(event.target)
    event.target.parentElement.style.display = "none";
}

function deletar(event) {
    this.parentElement.remove();
    editContainer.style.display = "none";
}

//@ LIMITAR ATÉ NO MÁX. 30 CARACTERES ANTES DE QUEBRAR A LINHA NA LI
//@ LOCALSTORAGE => Criação, Leitura, Atualização e Remoção (CRUD)
// (REMOÇÃO)
