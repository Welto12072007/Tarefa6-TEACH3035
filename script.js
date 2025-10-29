let tarefas = [];
let filtroAtual = 'todas';

function adicionarTarefa() {
    const campoTarefa = document.getElementById('campoTarefa');
    const nomeTarefa = campoTarefa.value.trim();

    if (nomeTarefa === '') {
        alert('Por favor, digite o nome da tarefa!');
        return;
    }

    const novaTarefa = {
        id: Date.now(),
        nome: nomeTarefa,
        dataCriacao: new Date().toLocaleDateString('pt-BR'),
        horaCriacao: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        concluida: false
    };

    tarefas.push(novaTarefa);
    campoTarefa.value = '';
    renderizarTarefas();
    atualizarContador();
}

function alternarTarefa(id) {
    const tarefa = tarefas.find(t => t.id === id);
    
    if (tarefa) {
        tarefa.concluida = !tarefa.concluida;
        renderizarTarefas();
        atualizarContador();
    }
}

function removerTarefa(id) {
    const confirmacao = confirm('Deseja realmente excluir esta tarefa?');
    
    if (confirmacao) {
        tarefas = tarefas.filter(t => t.id !== id);
        renderizarTarefas();
        atualizarContador();
    }
}

function filtrarTarefas(filtro) {
    filtroAtual = filtro;
    
    document.querySelectorAll('.botao-filtro').forEach(botao => {
        botao.classList.remove('ativo');
    });
    
    if (filtro === 'todas') {
        document.getElementById('botaoTodas').classList.add('ativo');
    } else if (filtro === 'pendentes') {
        document.getElementById('botaoPendentes').classList.add('ativo');
    } else if (filtro === 'concluidas') {
        document.getElementById('botaoConcluidas').classList.add('ativo');
    }
    
    renderizarTarefas();
}

function listarTarefasPendentes() {
    const tarefasPendentes = tarefas.filter(t => !t.concluida);
    console.log('=== TAREFAS PENDENTES ===');
    console.log('Total:', tarefasPendentes.length);
    tarefasPendentes.forEach(tarefa => {
        console.log(`- ${tarefa.nome} (Criada em: ${tarefa.dataCriacao})`);
    });
    return tarefasPendentes;
}

function renderizarTarefas() {
    const listaTarefas = document.getElementById('listaTarefas');
    let tarefasFiltradas = tarefas;
    
    if (filtroAtual === 'pendentes') {
        tarefasFiltradas = tarefas.filter(t => !t.concluida);
    } else if (filtroAtual === 'concluidas') {
        tarefasFiltradas = tarefas.filter(t => t.concluida);
    }
    
    listaTarefas.innerHTML = '';
    
    if (tarefasFiltradas.length === 0) {
        listaTarefas.innerHTML = `
            <div class="mensagem-vazia">
                ${filtroAtual === 'todas' ? 'Nenhuma tarefa ainda. Adicione sua primeira tarefa!' : 
                  filtroAtual === 'pendentes' ? 'Parabéns! Não há tarefas pendentes.' : 
                  'Nenhuma tarefa concluída ainda.'}
            </div>
        `;
        return;
    }
    
    tarefasFiltradas.forEach(tarefa => {
        const itemTarefa = document.createElement('div');
        itemTarefa.className = `item-tarefa ${tarefa.concluida ? 'concluida' : ''}`;
        
        itemTarefa.innerHTML = `
            <input 
                type="checkbox" 
                class="caixa-tarefa" 
                ${tarefa.concluida ? 'checked' : ''} 
                onchange="alternarTarefa(${tarefa.id})"
            >
            <div class="informacoes-tarefa">
                <h3>${tarefa.nome}</h3>
                <div class="meta-tarefa">
                    <span>${tarefa.dataCriacao}</span>
                    <span>${tarefa.horaCriacao}</span>
                    <span>${tarefa.concluida ? 'Concluída' : 'Pendente'}</span>
                </div>
            </div>
            <div class="acoes-tarefa">
                <button class="botao-excluir" onclick="removerTarefa(${tarefa.id})">
                    Excluir
                </button>
            </div>
        `;
        
        listaTarefas.appendChild(itemTarefa);
    });
}

function atualizarContador() {
    const tarefasPendentes = tarefas.filter(t => !t.concluida).length;
    const tarefasConcluidas = tarefas.filter(t => t.concluida).length;
    const totalTarefas = tarefas.length;
    
    const contadorTarefas = document.getElementById('contadorTarefas');
    contadorTarefas.innerHTML = `
        ${tarefasPendentes} pendente${tarefasPendentes !== 1 ? 's' : ''} | 
        ${tarefasConcluidas} concluída${tarefasConcluidas !== 1 ? 's' : ''} | 
        ${totalTarefas} total
    `;
}

document.addEventListener('DOMContentLoaded', () => {
    const campoTarefa = document.getElementById('campoTarefa');
    
    campoTarefa.addEventListener('keypress', (evento) => {
        if (evento.key === 'Enter') {
            adicionarTarefa();
        }
    });
    
    renderizarTarefas();
    atualizarContador();
});
