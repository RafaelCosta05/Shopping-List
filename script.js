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

const btnNewProduct = document.querySelector(".btn-add");
const btnDeleteAll =  document.querySelector(".btn-deleteAll");
const textNewProduct = document.querySelector(".add-product");
const listProducts = document.querySelector('.list-products');
const message = document.querySelector(".message");
const textCountProducts = document.querySelector(".products-missing");
const textTotalProducts = document.querySelector(".total-products");
const alert = document.querySelector('.alert');
let textProductEdit = "";
let countTotal = 0;
let countProducts = 0;

window.onload = function () {
    carregaTarefasLocal();
}

//Função para adicionar produto 
function addProduct() {
    let valueProduct = textNewProduct.value;
    let addProduct = false;

    //verifica se está Adicionar ou a atualizar
    if (btnNewProduct.textContent.trim() == "Adicionar") {
        // Verifica se o input está vazio
        if (valueProduct === "") {
            message.innerHTML = `<i class="bx bx-error-circle error-message"></i> O produto não pode estar vazio`;
            apresentamessage(2000);
            return;
        } 
        //senao estiver vazio
        else {
            message.innerHTML = `<i class="bx bx-check-circle success-message"></i> Produto '${valueProduct}' adicionado com sucesso`;
            apresentamessage(2000);
            addProduct = true;
        }
    }
    //se estiver a atualizar o nome do produto
    else if(btnNewProduct.textContent.trim() == "Atualizar") {
        //verifica se esta o campo está vazio
        if (valueProduct === "") {
            message.innerHTML = `<i class="bx bx-error-circle error-message"></i> O produto não pode estar vazio`;
            apresentamessage(2000);
            textNewProduct.value = textProductEdit;
            textNewProduct.focus();
            return;
        }
        //senao houver alterações   
        else if(valueProduct === textProductEdit) {
            message.innerHTML = `<i class="bx bx-check-circle success-message"></i> A tarefa foi reposta, não foram feitas alterações`;
            apresentamessage(9000);
            addProduct = true;
            textProductEdit = "";
        }
        //se houver atualização do nome do produto
        else
        {
            //APRESENTA message DE SUCESSO COM O VALOR DA TAREFA ANTERIOR E O VALOR ATUALIZADO
            //OCULTA A message APÓS 3000ms
            //HABILITA A INSERÇÃO DA TAREFA COM O addProduct E REINICIA O TEXTO A EDITAR
            message.innerHTML = `<i class="bi bi-check success-message"></i> Tarefa '${textProductEdit}' atualizada com sucesso para '${valueProduct}'`;
            apresentamessage(7000)
            addProduct = true;
            textProductEdit = "";
        }
    }
    //se o produto chegar ao else a flag passa a true e vai adicionar o produto a lista
    if (addProduct) {
        addProduct = false;

        // Cria um novo div para o produto
        let div = document.createElement('div');
        div.setAttribute('class', 'produto');

        // Adiciona o conteúdo do produto dentro da div
        div.innerHTML = `
        <input type="checkbox" class="verifica-tarefa" onclick="verificaEstado(this)" />
        <span class="valor-tarefa">${valueProduct}</span>
        <button class="editar" onclick="editarTarefa(this)">
            <i class='bx bx-edit-alt'></i>
        </button>
        <button class="remover" onclick="apagarTarefa(this)">
            <i class='bx bx-trash'></i>
        </button>
        `;

        // Adiciona o produto à lista de produtos
        listProducts.append(div);
        countProducts++;
        countTotal++;
        textTotalProducts.innerText = countTotal;
        textCountProducts.innerText = countProducts;
        textNewProduct.value = "";

        // Salva as tarefas localmente
        guardarTarefas();
    }
}

function apagarTarefa(button) {
    const tarefa = button.parentElement;
    const spanTarefa = tarefa.querySelector('.valor-tarefa');
    let valorAtual = spanTarefa.textContent;

    //se estiver comprado vai retirar ao produtos em falta
    //SENAO vai aparecer na mesma que falta
    if (!spanTarefa.classList.contains('completed')) {
        countProducts--;
    }

    //remove o produto da lista e atualiza produtos em falta e
    //total de produtos da lista
    listProducts.removeChild(tarefa);
    countTotal--;
    textTotalProducts.innerText = countTotal;
    textCountProducts.innerText = countProducts;
    message.innerHTML = `<i class="bx bx-check-circle success-message"></i> Produto '${valorAtual}' removido com sucesso`;
    apresentamessage(2000);

    //atualiza localmente os dados
    guardarTarefas();
}

function alertMessage() {
    // if (alert.style.display = "none")
    // {
    //     alert.style.display = "flex";
    // }
    // else if (alert.style.display = "flex")
    // {
    //     alert.style.display = "none";
    // }

    alert.style.display = "flex";
}

function closeAlert() {
    alert.style.display = "none";
}

function deleteAll() {
    const tarefas = document.querySelectorAll('.produto'); // Seleciona todas as tarefas/produtos
    let produtosRemovidos = [];

    tarefas.forEach(tarefa => {
        const spanTarefa = tarefa.querySelector('.valor-tarefa');
        let valorAtual = spanTarefa.textContent;

        // Se o produto não estiver marcado como completo, diminui a contagem de produtos em falta
        if (!spanTarefa.classList.contains('completed')) {
            countProducts--;
        }

        // Adiciona o produto removido à lista para exibir a mensagem posteriormente
        produtosRemovidos++;

        // Remove o produto da lista
        listProducts.removeChild(tarefa);
    });

    // Atualiza o total de produtos
    countTotal = 0;  // Todos foram removidos
    textTotalProducts.innerText = countTotal;
    textCountProducts.innerText = countProducts;

    if (produtosRemovidos > 0) {
        message.innerHTML = `<i class="bx bx-check-circle success-message"></i> Todos os produtos foram removidos com sucesso`;
    } else {
        message.innerHTML = `<i class="bx bx-check-circle success-message"></i> Não há produtos para remover.`;
    }

    alert.style.display = "none";
    apresentamessage(3000);

    // Atualiza os dados localmente
    guardarTarefas();
}

function deleteAllChecked() {
    const tarefas = document.querySelectorAll('.produto'); // Seleciona todas as tarefas/produtos
    let produtosRemovidos = [];

    tarefas.forEach(tarefa => {
        const checkbox = tarefa.querySelector('input[type="checkbox"]');
        const spanTarefa = tarefa.querySelector('.valor-tarefa');

        // Verifica se o checkbox está marcado
        if (checkbox.checked) {
            // Se o produto não estiver marcado como completo, diminui a contagem de produtos em falta
            if (!spanTarefa.classList.contains('completed')) {
                countProducts--;
            }

            // Adiciona o produto removido à lista para exibir a mensagem posteriormente
            produtosRemovidos++;

            // Remove o produto da lista
            listProducts.removeChild(tarefa);
        }
    });

    // Atualiza o total de produtos
    countTotal -= produtosRemovidos;
    textTotalProducts.innerText = countTotal;
    textCountProducts.innerText = countProducts;

    if (produtosRemovidos > 0) {
        message.innerHTML = `<i class="bx bx-check-circle success-message"></i> Todos os produtos selecionados foram removidos com sucesso`;
    } else {
        message.innerHTML = `<i class="bx bx-check-circle success-message"></i> Não há produtos selecionados para remover.`;
    }

    alert.style.display = "none";
    apresentamessage(3000);

    // Atualiza os dados localmente
    guardarTarefas();
}


function editarTarefa(button) {
    const tarefa = button.parentElement;
    const spanTarefa = tarefa.querySelector('.valor-tarefa');
    let valorAtual = spanTarefa.textContent;

    //verifica se o input enquanto esta em modo de editar está vazio
    if (textProductEdit === "") {
        apagarTarefa(button);
        textNewProduct.value = valorAtual;
        textNewProduct.focus();
        btnNewProduct.innerHTML = `<span class="text-add">Atualizar</span> <i class='bx bx-refresh' ></i>`;
        message.innerHTML = `<i class="bx bx-check-circle success-message"></i> Produto '${valorAtual}' em modo edição`;
        apresentamessage(4000);
        textProductEdit = valorAtual;
    } 
    //senao estiver devolve uma mensagem 
    else {
        message.innerHTML = `<i class="bx bx-error-circle error-message"></i> Produto '${textProductEdit}' em modo edição, não pode editar outro produto`;
        apresentamessage(5000);
    }
}

//função para mudar o estado do produto (comprado ou em falta)
function verificaEstado(checkbox) {
    const tarefa = checkbox.parentElement;
    const spanTarefa = tarefa.querySelector('.valor-tarefa');

    if (checkbox.checked) {
        //se estiver comprado, adiciona a class completed e
        //atualiza contador produtos em falta
        spanTarefa.classList.add('completed');
        countProducts--;
    } else {
        //caso contrário elimina o completed e atualiza contador produtos em falta
        spanTarefa.classList.remove('completed');
        countProducts++;
    }

    //atualiza a label dos produtos em falta e atualiza localemente
    textCountProducts.innerText = countProducts;
    guardarTarefas();
}

//função para apresentar mensagens
function apresentamessage(tempo) {
    //apresenta a imagem mudando o display para block pois estava como none
    message.style.display = "block";
    //apos o settime volta ao display none
    setTimeout(() => {
        message.style.display = "none";
    }, tempo);
}

//funcao para guardar no localstorage a lista de produtos
function guardarTarefas() {
    const todasTarefas = [];

    listProducts.querySelectorAll('.produto').forEach(tarefa => {
        let textoTarefa = tarefa.querySelector('.valor-tarefa').textContent;
        let tarefaConcluida = tarefa.querySelector('.valor-tarefa').classList.contains('completed');
        todasTarefas.push({ texto_tarefa: textoTarefa, tarefa_feita: tarefaConcluida });
    });

    localStorage.setItem('lista-tarefas', JSON.stringify(todasTarefas));
}

//carrefao local storage
function carregaTarefasLocal() {
    textCountProducts.textContent = countProducts;
    textTotalProducts.textContent = countTotal;

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

            listProducts.append(div);
            countTotal++;
            if (!tarefaCheck) {
                countProducts++;
            }
        });

        textTotalProducts.innerText = countTotal;
        textCountProducts.innerText = countProducts;
    }
}
