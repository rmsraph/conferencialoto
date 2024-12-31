document.getElementById("limpar-jogos").addEventListener("click", function () {
    document.getElementById("jogos-armazenados").innerHTML = "";
    localStorage.removeItem('jogos');
    atualizarJogosArmazenados();
});

document.getElementById('form-numeros-sorteados').addEventListener('submit', function (event) {
    event.preventDefault();
    const numerosSorteadosInput = document.getElementById('selected-numbers');
    if (!numerosSorteadosInput) {
        alert('Elemento de entrada não encontrado.');
        return;
    }
    let numerosSorteados = numerosSorteadosInput.value ? numerosSorteadosInput.value.split(',').map(Number).sort((a, b) => a - b) : [];
    if (numerosSorteados.length === 0) {
        numerosSorteados = JSON.parse(localStorage.getItem('numeros-sorteados')) || [];
    }
    if (numerosSorteados.length === 6 && numerosSorteados.every(num => num >= 1 && num <= 60)) {
        renderizarNumerosSorteados(numerosSorteados);
        // toggleNone('add-sorted');

        // toggleDisplay('form-numeros-sorteados', 'numeros-sorteados-container');
        localStorage.setItem('numeros-sorteados', JSON.stringify(numerosSorteados));
    } else {
        alert('Por favor, insira exatamente 6 números entre 1 e 60.');
    }
    colorirJogos();
});

document.getElementById('excluir-numeros-sorteados').addEventListener('click', function () {
    document.getElementById('numeros-sorteados').innerText = '';
    toggleDisplay('numeros-sorteados-container', 'form-numeros-sorteados');
    localStorage.removeItem('numeros-sorteados');
    document.getElementById('numeros-sorteados-manual').value = '';
    document.getElementById('numeros-sorteados-manual').focus();
    document.getElementById('selected-numbers').value = '';
    const selectedButtons = document.querySelectorAll('.btn-primary');
    selectedButtons.forEach(button => {
        button.classList.remove('btn-primary');
        button.classList.add('btn-outline-primary');
    });
    toggleNone('add-sorted');
    colorirJogos();
});

document.getElementById('form-jogo').addEventListener('submit', function (event) {
    event.preventDefault();
    const numerosJogoInput = document.getElementById('numeros-jogo');
    if (!numerosJogoInput) {
        alert('Elemento de entrada não encontrado.');
        return;
    }
    const numerosJogo = numerosJogoInput.value.split(',').map(Number).sort((a, b) => a - b);
    if (numerosJogo.length >= 6 && numerosJogo.every(num => num >= 1 && num <= 60)) {
        let jogos = JSON.parse(localStorage.getItem('jogos')) || [];
        jogos.push(numerosJogo);
        localStorage.setItem('jogos', JSON.stringify(jogos));
        atualizarJogosArmazenados();
        numerosJogoInput.value = ''; // Clear input after storing
    } else {
        alert('Por favor, insira pelo menos 6 números entre 1 e 60.');
    }

    // clearSelection();
    const selectedGameButtons = document.querySelectorAll("[id^='jogo-selected-']");
    selectedGameButtons.forEach(button => {
        button.classList.remove('btn-primary');
        button.classList.add('btn-outline-primary');
    });
    const gameCounterElement = document.getElementById('game-counter');
    if (gameCounterElement) {
        gameCounterElement.innerText = 0;
    }
    atualizarJogosArmazenados();
    colorirJogos();
});

function removerJogoPorId(id) {
    let jogos = JSON.parse(localStorage.getItem('jogos')) || [];
    jogos = jogos.filter(jogo => jogo.id !== id);
    localStorage.setItem('jogos', JSON.stringify(jogos));
    atualizarJogosArmazenados();
    colorirJogos();
}

function removerJogoPorIndex(index) {
    let jogos = JSON.parse(localStorage.getItem('jogos')) || [];
    if (index >= 0 && index < jogos.length) {
        jogos.splice(index, 1);
        localStorage.setItem('jogos', JSON.stringify(jogos));
        atualizarJogosArmazenados();
        colorirJogos();
    } else {
        alert('Índice inválido.');
    }
}

function removerTodosOsJogos() {
    localStorage.removeItem('jogos');
    atualizarJogosArmazenados();
    colorirJogos();
}

function renderizarNumerosSorteados(numerosSorteados) {
    const numerosSorteadosDiv = document.getElementById('numeros-sorteados');
    numerosSorteadosDiv.innerHTML = '';
    numerosSorteadosDiv.classList.add('row'); // Add Bootstrap flex classes
    numerosSorteados.forEach(num => {
        const div = document.createElement('div');
        div.innerText = num;
        div.classList.add('col', 'p-1', 'm-1', 'border', 'rounded', 'bg-light'); // Add Bootstrap classes
        numerosSorteadosDiv.appendChild(div);
    });
}

function verificarNumerosSorteados() {
    if (localStorage.getItem('numeros-sorteados')) {
        const numerosSorteados = JSON.parse(localStorage.getItem('numeros-sorteados'));
        renderizarNumerosSorteados(numerosSorteados);
        // toggleDisplay('form-numeros-sorteados', 'numeros-sorteados-container');
        numerosSorteados.forEach(num => {
            const button = document.getElementById(`select-${num}`);
            if (button) {
                button.classList.remove('btn-outline-primary');
                button.classList.add('btn-primary');
            }
        });
    }
}

function atualizarJogosArmazenados() {
    const jogos = JSON.parse(localStorage.getItem('jogos')) || [];
    const jogosArmazenadosDiv = document.getElementById('jogos-armazenados');
    if (!jogosArmazenadosDiv) {
        alert('Elemento de armazenamento não encontrado.');
        return;
    }
    jogosArmazenadosDiv.innerHTML = '';
    jogos.forEach((jogo, index) => {
        const jogoDiv = criarJogoDiv(jogo, index);
        jogosArmazenadosDiv.appendChild(jogoDiv);
    });
}

function colorirJogos() {
    const numerosSorteados = JSON.parse(localStorage.getItem('numeros-sorteados')) || [];
    const jogos = JSON.parse(localStorage.getItem('jogos')) || [];
    const jogosArmazenadosDiv = document.getElementById('jogos-armazenados');
    if (!jogosArmazenadosDiv) {
        alert('Elemento de armazenamento não encontrado.');
        return;
    }
    jogosArmazenadosDiv.innerHTML = '';
    jogos.forEach((jogo, index) => {
        const jogoDiv = criarJogoDiv(jogo, index, numerosSorteados);
        jogosArmazenadosDiv.appendChild(jogoDiv);
    });
}

function criarJogoDiv(jogo, index, numerosSorteados = []) {
    const jogoDiv = document.createElement('div');
    jogoDiv.classList.add('mb-2', 'row'); // Add Bootstrap margin-bottom and flex classes
    let count = 0;

    jogo.forEach(num => {
        const div = document.createElement('div');
        if (numerosSorteados.flat().includes(num)) {
            div.classList.add('bg-success');
            div.style.backgroundColor = 'green';
            count++;
        }
        div.innerText = num;
        div.classList.add('col', 'p-1', 'm-1', 'border', 'rounded', 'fixed-width'); // Add Bootstrap classes
        jogoDiv.appendChild(div);
    });

    if (numerosSorteados.length > 0) {
        const countSpan = document.createElement('div');
        countSpan.classList.add('col', 'text-nowrap');
        countSpan.innerText = ` - ${count}`;
        jogoDiv.appendChild(countSpan);
    }

    const removeButton = document.createElement('button');
    removeButton.innerText = 'Remover';
    removeButton.classList.add('col-2', 'btn', 'btn-danger', 'ml-2', 'ms-auto');
    removeButton.onclick = function () {
        console.log(index);
        removerJogoPorIndex(index);
    };
    jogoDiv.appendChild(removeButton);

    return jogoDiv;
}

// Armazena os números selecionados pelo usuário dentro de uma input hidden, os número são separados por vírgula
function selectNumber(num) {
    const selectedNumbersInput = document.getElementById('selected-numbers');
    let selectedNumbers = selectedNumbersInput.value ? selectedNumbersInput.value.split(',').map(Number) : [];
    const numValue = Number(num.innerText);
    if (selectedNumbers.length < 6 && !selectedNumbers.includes(numValue)) {
        selectedNumbers.push(numValue);
        selectedNumbers.sort((a, b) => a - b); // Ordena os números
        selectedNumbersInput.value = selectedNumbers.join(',');
        num.classList.remove('btn-outline-primary');
        num.classList.add('btn-primary');
    } else if (selectedNumbers.includes(numValue)) {
        selectedNumbers = selectedNumbers.filter(n => n !== numValue);
        selectedNumbersInput.value = selectedNumbers.join(',');
        num.classList.remove('btn-primary');
        num.classList.add('btn-outline-primary');
    } else if (selectedNumbers.length >= 6) {
        alert('Você só pode selecionar até 6 números.');
    }
    const counterElement = document.getElementById('selected-counter');
    if (counterElement) {
        counterElement.innerText = selectedNumbers.length;
    }
}

function selectGameNumber(num) {
    const numerosJogoInput = document.getElementById('numeros-jogo');
    let numerosJogo = numerosJogoInput.value ? numerosJogoInput.value.split(',').map(Number) : [];
    const numValue = Number(num.innerText);
    if (numerosJogo.length < 15 && !numerosJogo.includes(numValue)) {
        numerosJogo.push(numValue);
        numerosJogo.sort((a, b) => a - b); // Ordena os números
        numerosJogoInput.value = numerosJogo.join(',');
        num.classList.remove('btn-outline-primary');
        num.classList.add('btn-primary');
    } else if (numerosJogo.includes(numValue)) {
        numerosJogo = numerosJogo.filter(n => n !== numValue);
        numerosJogoInput.value = numerosJogo.join(',');
        num.classList.remove('btn-primary');
        num.classList.add('btn-outline-primary');
    } else if (numerosJogo.length >= 15) {
        alert('Você só pode selecionar até 6 números.');
    }
    const counterElement = document.getElementById('game-counter');
    if (counterElement) {
        counterElement.innerText = numerosJogo.length;
    }
}

function clearSelection() {
    const selectedNumbersInput = document.getElementById('selected-numbers');
    selectedNumbersInput.value = '';
    const selectedButtons = document.querySelectorAll('.btn-primary');
    selectedButtons.forEach(button => {
        button.classList.remove('btn-primary');
        button.classList.add('btn-outline-primary');
    });
    localStorage.removeItem('numeros-sorteados');
    colorirJogos();
    // toggleNone('add-sorted');
}

function toggleDisplay(hideId, showId) {
    document.getElementById(hideId).style.display = 'none';
    document.getElementById(showId).style.display = 'block';
}

function toggleNone(elementId) {
    const element = document.getElementById(elementId);
    console.log(element, elementId);
    if (element.classList.contains('d-none')) {
        element.classList.remove('d-none');
    } else {
        element.classList.remove('d-block');
        element.classList.add('d-none');
    }
}

function unsetMode(mode) {
    let maxNumbers;
    let button;
    const activeButton = document.querySelector(".btn-outline-primary.active");
    if (activeButton) {
        activeButton.classList.remove("active");
    }
    switch (mode) {
        case "mega-sena":
            button = document.getElementById("mega");
            document.getElementById("selection-title").innerText = "Selecione 6 Números";
            maxNumbers = 60;
            break;
        case "lotofacil":
            button = document.getElementById("loto");
            document.getElementById("selection-title").innerText = "Selecione 15 Números";
            maxNumbers = 25;
            break;
        case "quina":
            button = document.getElementById("quina");
            document.getElementById("selection-title").innerText = "Selecione 5 Números";
            maxNumbers = 80;
            break;
    }
    button.classList.add("active");
    const buttons = document.querySelectorAll("[id^='select-']");
    buttons.forEach((button, index) => {
        button.style.display = index < maxNumbers ? "inline-block" : "none";
    });
    const buttonsGame = document.querySelectorAll("[id^='jogo-selected-']");
    buttonsGame.forEach((button, index) => {
        button.style.display = index < maxNumbers ? "inline-block" : "none";
    });
    console.log(game.getMinSelect(), game.getMaxSelect());
}


function generateNumberButtons() {
    const selectedNumbersContainer = document.getElementById('selected-numbers-container');
    selectedNumbersContainer.innerHTML = '';
    for (let i = 1; i <= game.getMaxNumber(); i++) {
        if (i % 10 === 1) {
            var rowDiv = document.createElement('div');
            rowDiv.className = 'row';
            selectedNumbersContainer.appendChild(rowDiv);
        }
        const button = document.createElement('button');
        button.id = `select-${i}`;
        button.className = 'btn btn-outline-primary m-1 p-0 fixed-width text-nowrap text-center';
        button.innerText = i;
        button.onclick = function () {
            selectNumber(this);
        };
        rowDiv.appendChild(button);
    }
}

const game = {
    mode: 'mega-sena',
    drawnNumbers: JSON.parse(localStorage.getItem('drawn-numbers')) || [],
    modes: {
        'mega-sena': { minSelect: 6, maxSelect: 15, maxNumber: 60 },
        'quina': { minSelect: 5, maxSelect: 15, maxNumber: 80 },
        'lotofacil': { minSelect: 15, maxSelect: 18, maxNumber: 25 }
    },
    getMinSelect() {
        return this.modes[this.mode].minSelect;
    },
    getMaxSelect() {
        return this.modes[this.mode].maxSelect;
    },
    getMaxNumber() {
        return this.modes[this.mode].maxNumber;
    },
    setMode(newMode) {
        if (this.modes[newMode]) {
            this.mode = newMode;
            this.drawnNumbers = [];
            localStorage.setItem('game-mode', newMode); // Save the game mode in local storage
            localStorage.removeItem('drawn-numbers');
            unsetMode(newMode); // Call the existing setMode function to update UI
            colorirJogos();
        } else {
            alert('Invalid mode.');
        }
        generateNumberButtons();
    },
    getMode() {
        return this.mode;
    }
};



document.addEventListener('DOMContentLoaded', function () {
    const savedMode = localStorage.getItem('game-mode');
    if (savedMode) {
        game.setMode(savedMode);
    } else {
        game.setMode('mega-sena');
    }
    
    atualizarJogosArmazenados();
    verificarNumerosSorteados();
    colorirJogos();
    // generateNumberButtons();
    // const selectedNumbersContainer = document.getElementById('selected-numbers-container');
    // selectedNumbersContainer.innerHTML = '';
    // for (let i = 1; i <= game.getMaxNumber(); i++) {
    //     const button = document.createElement('button');
    //     button.id = `select-${i}`;
    //     button.className = 'btn btn-outline-primary m-1 p-0 fixed-width text-nowrap text-center';
    //     button.innerText = i;
    //     button.onclick = function () {
    //         selectNumber(this);
    //     };
    //     selectedNumbersContainer.appendChild(button);
    // }
    console.log(game.mode);
});