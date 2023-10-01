
// Função para formatar uma data no formato dd/mm/aaaa
function formatarData(data) {
const dia = String(data.getDate()).padStart(2, '0');
const mes = String(data.getMonth() + 1).padStart(2, '0');
const ano = data.getFullYear();
return `${dia}/${mes}/${ano}`;
}

// Função para salvar os dados no localStorage
function saveExpense(description, amount, date, actionType) {
const expense = {
  description,
  amount,
  date,
  actionType,
};

let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
expenses.push(expense);

localStorage.setItem('expenses', JSON.stringify(expenses));
}

// Função para carregar os dados do localStorage e atualizar a tabela
function loadExpenses() {
const expenses = JSON.parse(localStorage.getItem('expenses')) || [];

const expenseList = document.getElementById('expenseList');
expenseList.innerHTML = '';

// expenses.forEach((expense, index) =>
expenses.slice().reverse().forEach((expense, index) => {
  const newRow = document.createElement('tr');
  if (expense.actionType === 'entrada') {
    newRow.innerHTML = `
        <td>${expense.description}</td>
        <td class="text-success"><span>R$</span> ${parseFloat(expense.amount).toFixed(2)}</td>
        <td>${formatarData(new Date(expense.date))}</td>
        <td><i class="fas fa-arrow-circle-up text-success"></i></td>
        <td><button class="btn btn-danger btn-sm delete-btn" data-index="${index}">Excluir</button></td>
    `;
} else {
    newRow.innerHTML = `
        <td>${expense.description}</td>
        <td class="text-danger"> <span>R$</span> ${parseFloat(expense.amount).toFixed(2)}</td>
        <td>${formatarData(new Date(expense.date))}</td>
        <td><i class="fas fa-arrow-circle-down text-danger"></i></td>
        <td><button class="btn btn-danger btn-sm delete-btn" data-index="${index}">Excluir</button></td>
    `;
}

  expenseList.appendChild(newRow);
  // expenseList.insertBefore(newRow, expenseList.firstChild);
});
}

// Função para carregar os dados do localStorage e atualizar o resumo mensal
function loadSummary() {
const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let balance = 0;
let totalExpenses = 0;

expenses.forEach((expense) => {
  if (expense.actionType === 'entrada') {
      balance += parseFloat(expense.amount);
  } else {
      totalExpenses += parseFloat(expense.amount);
      balance -= parseFloat(expense.amount);
  }
});

document.getElementById('balance').textContent = balance.toFixed(2);
document.getElementById('totalExpenses').textContent = totalExpenses.toFixed(2);
}

// Função para excluir despesa do localStorage
function deleteExpense(index) {
const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
expenses.splice(index, 1);
localStorage.setItem('expenses', JSON.stringify(expenses));

// Atualizar a tabela com os novos dados
loadExpenses();

// Atualizar o resumo mensal
loadSummary();
}

// Atualizar a tabela com os dados do localStorage ao carregar a página
window.addEventListener('load', () => {
loadExpenses();
loadSummary();
});

// Função para salvar as anotações no localStorage
function saveNotes() {
  const notes = document.getElementById('noteTextarea').value;
  localStorage.setItem('userNotes', notes);
}

// Função para carregar as anotações do localStorage
function loadNotes() {
  const notes = localStorage.getItem('userNotes');
  if (notes) {
      document.getElementById('noteTextarea').value = notes;
  }
}

// Carregar as anotações ao carregar a página
window.addEventListener('load', loadNotes);

// Ouvinte de evento para salvar as anotações ao clicar no botão "Salvar"
document.getElementById('saveNote').addEventListener('click', function () {
  saveNotes();
  $('#notesModal').modal('hide'); // Fechar o modal após salvar
});


// JavaScript para manipular a adição de despesas
document.getElementById('expenseForm').addEventListener('submit', function (e) {
  e.preventDefault();

  // Obtenha os valores do formulário
  const description = document.getElementById('description').value;

 // Verifique se o valor da despesa é um número válido.
if (isNaN(parseFloat(document.getElementById('amount').value))) {
  alert('O valor da despesa deve ser um número.');
  return;
}
// Converta o valor da despesa para um número.
const amount = parseFloat(document.getElementById('amount').value);
// Verifique se o valor da despesa é um número válido.
if (isNaN(amount)) {
  alert('O valor da despesa deve ser um número.');
  return;
}
// Verifique se o valor da despesa é maior que zero.
if (amount <= 0) {
  alert('O valor da despesa deve ser maior que zero.');
  return;
}
  const date = new Date(document.getElementById('date').value + 'T00:00:00');
  const actionType = document.getElementById('actionType').value;

  // Valide os valores
  if (!description || !date) {
      alert('Por favor, preencha todos os campos corretamente.');
      return;
  }

  // Salvar a despesa no localStorage
  saveExpense(description, amount, date, actionType);

  // Atualizar a tabela com os novos dados
  loadExpenses();

  // Atualizar o resumo mensal
  loadSummary();

  // Limpar o formulário
  document.getElementById('description').value = '';
  document.getElementById('amount').value = '';
  document.getElementById('date').value = '';
});





// Adicionar um ouvinte de evento para excluir despesa
document.getElementById('expenseList').addEventListener('click', function (e) {
  if (e.target.classList.contains('delete-btn')) {
      const index = e.target.getAttribute('data-index');
      // Defina o índice da linha a ser excluída em uma variável
      deleteIndex = index;
      // Abra o modal de confirmação de exclusão
      $('#confirmDeleteModal').modal('show');
  }
});


let deleteIndex; // Variável para armazenar o índice da linha a ser excluída

// Ouvinte de evento para o botão "Confirmar Exclusão"
document.getElementById('confirmDelete').addEventListener('click', function () {
    if (deleteIndex !== undefined) {
        // Excluir o item da tabela com base no índice
        deleteExpense(deleteIndex);
        // Fechar o modal de confirmação
        $('#confirmDeleteModal').modal('hide');
    }
});


// Função para alternar entre os modos claro e escuro
function toggleDarkMode() {
  const body = document.body;
  const darkModeToggle = document.getElementById('darkModeToggle');

  body.classList.toggle('dark-mode');

  // Armazene a preferência do usuário no localStorage
  const isDarkMode = body.classList.contains('dark-mode');
  localStorage.setItem('darkMode', isDarkMode);

  // Atualize o texto do botão
  darkModeToggle.textContent = isDarkMode ? 'Modo Claro' : 'Modo Escuro';
}

// Adicione um ouvinte de evento para o botão de modo escuro
const darkModeToggle = document.getElementById('darkModeToggle');
darkModeToggle.addEventListener('click', toggleDarkMode);

// Verifique a preferência do usuário no localStorage e aplique o modo escuro, se necessário
const isDarkMode = localStorage.getItem('darkMode') === 'true';
if (isDarkMode) {
  toggleDarkMode();
}

// Função para criar um backup mensal das despesas
function createMonthlyBackup() {
  const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
  // Formatando os dados das despesas como desejado
  const formattedData = expenses.map((expense) => {
      return `${expense.description} - ${expense.amount.toFixed(2)} - ${formatarData(new Date(expense.date))}`;
  });

  // Criar um arquivo de texto com os dados formatados
  const blob = new Blob([formattedData.join('\n')], { type: 'text/plain;charset=utf-8' });
  saveAs(blob, 'backup_despesas_mensal.txt');
}

// Função para zerar as despesas para o mês seguinte
function resetExpensesForNextMonth() {
  // Apague os dados de despesas armazenados no localStorage
  localStorage.removeItem('expenses');
  // Atualize a tabela no site
  loadExpenses();
  loadSummary();
}

