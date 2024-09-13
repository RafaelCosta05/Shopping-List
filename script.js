//Theme dark or light
const themeToggler = document.querySelector('.theme-toggler');

// Function to set theme based on localStorage value
function setTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark-mode-variables');
        themeToggler.querySelector('.light-mode').classList.remove('active');
        themeToggler.querySelector('.dark-mode').classList.add('active');
    } else {
        document.body.classList.remove('dark-mode-variables');
        themeToggler.querySelector('.dark-mode').classList.remove('active');
        themeToggler.querySelector('.light-mode').classList.add('active');
    }
}

// SAVE THEME WHEN CHANGE PAGE
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    setTheme(savedTheme);
}

// TOGGLE THEME
if (themeToggler) {
    themeToggler.addEventListener('click', () => {
        const isDarkMode = document.body.classList.toggle('dark-mode-variables');
        const newTheme = isDarkMode ? 'dark' : 'light';
        localStorage.setItem('theme', newTheme);
        setTheme(newTheme);
    });
}

const btnNovaTarefa = document.querySelector(".btn-add");
const textNovaTarefa = document.querySelector(".add-product");
const listaTarefas = document.querySelector('.list-products');
const mensagem = document.querySelector(".message");
const textContaTarefas = document.querySelector(".products-missing");
const textTotalTarefas = document.querySelector(".total-products");
let textTarefaEdit = "";
let contadorTotal = 0;
let contadorTarefas = 0;

window.onload = function () {
    carregaTarefasLocal();
}

function addProduct() {
    let valorTarefa = textNovaTarefa.value;
    let passouTarefa = false;

    if (btnNovaTarefa.textContent.trim() == "Adicionar") {
        // Verifica se o input está vazio
        if (valorTarefa === "") {
            mensagem.innerHTML = `<i class="bx bx-error-circle error-message"></i> O produto não pode estar vazio`;
            apresentaMensagem(2000);
            return;
        } 
        else {
            mensagem.innerHTML = `<i class="bx bx-check-circle success-message"></i> Produto '${valorTarefa}' adicionado com sucesso`;
            apresentaMensagem(2000);
            passouTarefa = true;
        }
    }
    else if(btnNovaTarefa.textContent.trim() == "Atualizar") {
        if (valorTarefa === "") {
            mensagem.innerHTML = `<i class="bx bx-error-circle error-message"></i> O produto não pode estar vazio`;
            apresentaMensagem(2000);
            textNovaTarefa.value = textTarefaEdit;
            textNovaTarefa.focus();
            return;
        }     
        else if(valorTarefa === textTarefaEdit) {
            mensagem.innerHTML = `<i class="bx bx-check-circle success-message"></i> A tarefa foi reposta, não foram feitas alterações`;
            apresentaMensagem(9000);
            passouTarefa = true;
            textTarefaEdit = "";
        }
        else
        {
            //APRESENTA MENSAGEM DE SUCESSO COM O VALOR DA TAREFA ANTERIOR E O VALOR ATUALIZADO
            //OCULTA A MENSAGEM APÓS 3000ms
            //HABILITA A INSERÇÃO DA TAREFA COM O passouTarefa E REINICIA O TEXTO A EDITAR
            mensagem.innerHTML = `<i class="bi bi-check success-message"></i> Tarefa '${textTarefaEdit}' atualizada com sucesso para '${valorTarefa}'`;
            apresentaMensagem(7000)
            passouTarefa = true;
            textTarefaEdit = "";
        }
    }

    if (passouTarefa) {
        passouTarefa = false;

        // Cria um novo div para o produto
        let div = document.createElement('div');
        div.setAttribute('class', 'produto');

        // Adiciona o conteúdo do produto dentro da div
        div.innerHTML = `
        <input type="checkbox" class="verifica-tarefa" onclick="verificaEstado(this)" />
        <span class="valor-tarefa">${valorTarefa}</span>
        <button class="editar" onclick="editarTarefa(this)">
            <i class='bx bx-edit-alt'></i>
        </button>
        <button class="remover" onclick="apagarTarefa(this)">
            <i class='bx bx-trash'></i>
        </button>
        `;

        // Adiciona o produto à lista de tarefas
        listaTarefas.append(div);
        contadorTarefas++;
        contadorTotal++;
        textTotalTarefas.innerText = contadorTotal;
        textContaTarefas.innerText = contadorTarefas;
        textNovaTarefa.value = "";

        // Salva as tarefas localmente
        guardarTarefas();
    }
}

function apagarTarefa(button) {
    const tarefa = button.parentElement;
    const spanTarefa = tarefa.querySelector('.valor-tarefa');
    let valorAtual = spanTarefa.textContent;

    if (!spanTarefa.classList.contains('completed')) {
        contadorTarefas--;
    }

    listaTarefas.removeChild(tarefa);
    contadorTotal--;
    textTotalTarefas.innerText = contadorTotal;
    textContaTarefas.innerText = contadorTarefas;
    mensagem.innerHTML = `<i class="bx bx-check-circle success-message"></i> Produto '${valorAtual}' removido com sucesso`;
    apresentaMensagem(2000);

    guardarTarefas();
}

function editarTarefa(button) {
    const tarefa = button.parentElement;
    const spanTarefa = tarefa.querySelector('.valor-tarefa');
    let valorAtual = spanTarefa.textContent;

    if (textTarefaEdit === "") {
        apagarTarefa(button);
        textNovaTarefa.value = valorAtual;
        textNovaTarefa.focus();
        btnNovaTarefa.innerHTML = `<span class="text-add">Atualizar</span> <i class='bx bx-refresh' ></i>`;
        mensagem.innerHTML = `<i class="bx bx-check-circle success-message"></i> Produto '${valorAtual}' em modo edição`;
        apresentaMensagem(4000);
        textTarefaEdit = valorAtual;
    } else {
        mensagem.innerHTML = `<i class="bx bx-error-circle error-message"></i> Produto '${textTarefaEdit}' em modo edição, não pode editar outro produto`;
        apresentaMensagem(5000);
    }
}

function verificaEstado(checkbox) {
    const tarefa = checkbox.parentElement;
    const spanTarefa = tarefa.querySelector('.valor-tarefa');

    if (checkbox.checked) {
        spanTarefa.classList.add('completed');
        contadorTarefas--;
    } else {
        spanTarefa.classList.remove('completed');
        contadorTarefas++;
    }

    textContaTarefas.innerText = contadorTarefas;
    guardarTarefas();
}

function apresentaMensagem(tempo) {
    mensagem.style.display = "block";
    setTimeout(() => {
        mensagem.style.display = "none";
    }, tempo);
}

function guardarTarefas() {
    const todasTarefas = [];

    listaTarefas.querySelectorAll('.produto').forEach(tarefa => {
        let textoTarefa = tarefa.querySelector('.valor-tarefa').textContent;
        let tarefaConcluida = tarefa.querySelector('.valor-tarefa').classList.contains('completed');
        todasTarefas.push({ texto_tarefa: textoTarefa, tarefa_feita: tarefaConcluida });
    });

    localStorage.setItem('lista-tarefas', JSON.stringify(todasTarefas));
}

function carregaTarefasLocal() {
    textContaTarefas.textContent = contadorTarefas;
    textTotalTarefas.textContent = contadorTotal;

    const tarefasEmStorage = localStorage.getItem('lista-tarefas');

    if (tarefasEmStorage) {
        const tarefas = JSON.parse(tarefasEmStorage);

        tarefas.forEach(item => {
            let div = document.createElement('div');
            div.setAttribute('class', 'produto');

            var tarefaCheck = item.tarefa_feita ? 'checked' : '';
            var tarefaCompleta = item.tarefa_feita ? 'completed' : '';

            div.innerHTML = `
            <input type="checkbox" class="verifica-tarefa" ${tarefaCheck} onclick="verificaEstado(this)" />
            <span class="valor-tarefa ${tarefaCompleta}">${item.texto_tarefa}</span>
            <button class="editar" onclick="editarTarefa(this)">
                <i class='bx bx-edit'></i>
            </button>
            <button class="remover" onclick="apagarTarefa(this)">
                <i class='bx bx-trash'></i>
            </button>
            `;

            listaTarefas.append(div);
            contadorTotal++;
            if (!tarefaCheck) {
                contadorTarefas++;
            }
        });

        textTotalTarefas.innerText = contadorTotal;
        textContaTarefas.innerText = contadorTarefas;
    }
}
