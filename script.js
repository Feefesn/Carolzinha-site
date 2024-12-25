document.addEventListener('DOMContentLoaded', function() {
    // Variáveis globais
    const header = document.querySelector('header');
    const nav = document.querySelector('nav');
    const menu = document.querySelector('nav ul');
    const inputs = document.querySelectorAll('input, textarea, select');
    const mainContent = document.querySelector('main');
    let lastScroll = 0;

    // Adiciona o botão de menu
    const menuButton = document.createElement('button');
    menuButton.className = 'menu-toggle';
    menuButton.innerHTML = '☰';
    header.insertBefore(menuButton, nav);

    // Controle do menu
    menuButton.addEventListener('click', () => {
        menu.classList.toggle('show');
    });

    // Fecha o menu ao clicar em um item
    menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('show');
        });
    });

    // Controle de scroll e menu
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll > lastScroll) {
            menu.classList.remove('show');
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        lastScroll = currentScroll;
    });

    // Controle de inputs
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            if (window.innerWidth <= 768) {
                header.classList.add('input-focused');
                mainContent.classList.add('input-focused');
                setTimeout(() => {
                    window.scrollTo({
                        top: input.offsetTop - 20,
                        behavior: 'smooth'
                    });
                }, 300);
            }
        });

        input.addEventListener('blur', () => {
            header.classList.remove('input-focused');
            mainContent.classList.remove('input-focused');
        });
    });
});

// Mensagens Diárias
const messages = [
    "Você é uma pessoa incrível e merece tudo de bom!",
    "Hoje será um dia maravilhoso!",
    "Nunca pare de acreditar nos seus sonhos!",
    "Seu sorriso ilumina o mundo ao seu redor.",
    "Confie em si mesma, você pode conquistar tudo!"
];
document.getElementById('message').textContent = messages[Math.floor(Math.random() * messages.length)];

// Acessar seção e aplicar borda temporária
const sections = document.querySelectorAll('section');
sections.forEach((section) => {
    section.addEventListener('click', () => {
        section.classList.add('highlight-section');
        setTimeout(() => {
            section.classList.remove('highlight-section');
        }, 2000); // Borda durará 2 segundos
    });
});

// Função de navegação no calendário
const calendarHeader = document.getElementById('month-year');
const calendarElement = document.getElementById('calendar');
let currentDate = new Date();

function renderCalendar() {
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    const currentDay = currentDate.getDate();

    // Atualiza o mês e ano
    calendarHeader.textContent = `${currentDate.toLocaleString('default', { month: 'long' })} ${year}`;

    calendarElement.innerHTML = ''; // Limpa o calendário anterior

    // Exibe os dias da semana
    const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    weekdays.forEach(day => {
        const weekdayElement = document.createElement('div');
        weekdayElement.textContent = day;
        weekdayElement.classList.add('weekday');
        calendarElement.appendChild(weekdayElement);
    });

    // Exibe os dias do mês
    for (let i = 1; i <= lastDate; i++) {
        const dayElement = document.createElement('div');
        dayElement.textContent = i;
        dayElement.classList.add('day');
        if (i === currentDay) {
            dayElement.classList.add('current');
        }

        dayElement.onclick = () => alert(`Dia ${i} selecionado`);

        calendarElement.appendChild(dayElement);
    }
}

// Mudar de mês
function changeMonth(delta) {
    currentDate.setMonth(currentDate.getMonth() + delta);
    renderCalendar();
}

// Renderiza o calendário inicialmente
renderCalendar();

// Wishlist
const wishlistForm = document.getElementById('wishlist-form');
const wishlistItemInput = document.getElementById('wishlist-item');
const wishlistList = document.getElementById('wishlist-list');

let wishlistItems = JSON.parse(localStorage.getItem('wishlist')) || [];

function searchPrices(item) {
    const query = encodeURIComponent(item); // Transforma o texto do item em algo válido para URLs
    const amazonSearch = `https://www.amazon.com.br/s?k=${query}`; // URL de busca na Amazon
    window.open(amazonSearch, '_blank'); // Abre uma nova aba com a busca
}

function updateWishlist() {
    wishlistList.innerHTML = '';
    wishlistItems.forEach((item, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = item;

        // Botão de buscar preço
        const searchButton = document.createElement('button');
        searchButton.textContent = 'Buscar Preço';
        searchButton.onclick = () => searchPrices(item);

        // Novo botão de remover
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remover';
        removeButton.onclick = () => {
            wishlistItems.splice(index, 1);
            localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
            updateWishlist();
        };

        // Adiciona os botões ao item da lista
        listItem.appendChild(searchButton);
        listItem.appendChild(removeButton);
        wishlistList.appendChild(listItem);
    });
}

wishlistForm.onsubmit = (event) => {
    event.preventDefault();
    const newItem = wishlistItemInput.value.trim();
    if (newItem) {
        wishlistItems.push(newItem);
        localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
        wishlistItemInput.value = ''; // Limpa o campo de input
        updateWishlist(); // Atualiza a lista
    }
};

updateWishlist();

// Controle de Despesas
const expenseForm = document.getElementById('expense-form');
        const expenseList = document.getElementById('expense-list');
        const balanceElement = document.getElementById('balance');
        const categoryReportElement = document.getElementById('category-report');

        let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
        let expenseChart = null;

        // Função para atualizar despesas, saldo e relatório
        function updateExpenses() {
            expenseList.innerHTML = '';
            let balance = 0;
            let categoryTotals = {};

            expenses.forEach((expense, index) => {
                if (expense.type === 'entrada') {
                    balance += expense.amount;
                } else if (expense.type === 'saida') {
                    balance -= expense.amount;
                }

                // Atualiza totais por categoria
                if (!categoryTotals[expense.category]) {
                    categoryTotals[expense.category] = 0;
                }
                categoryTotals[expense.category] += expense.amount;

                const listItem = document.createElement('li');
                listItem.textContent = `${expense.name} - R$ ${expense.amount.toFixed(2)} (${expense.type})`;
                
                // Botão de Remover
                const removeButton = document.createElement('button');
                removeButton.textContent = 'Remover';
                removeButton.onclick = () => {
                    expenses.splice(index, 1);
                    localStorage.setItem('expenses', JSON.stringify(expenses));
                    updateExpenses();
                };
                
                listItem.appendChild(removeButton);
                expenseList.appendChild(listItem);
            });

            balanceElement.textContent = `Saldo: R$ ${balance.toFixed(2)}`;

            // Atualiza relatório por categoria
            categoryReportElement.innerHTML = '';
            Object.keys(categoryTotals).forEach(category => {
                const categoryItem = document.createElement('li');
                categoryItem.textContent = `${category}: R$ ${categoryTotals[category].toFixed(2)}`;
                categoryReportElement.appendChild(categoryItem);
            });

            // Atualiza gráfico
            updateChart(categoryTotals);
        }

        // Função para atualizar o gráfico de despesas
        function updateChart(categoryTotals) {
            const labels = Object.keys(categoryTotals);
            const amounts = Object.values(categoryTotals);

            if (expenseChart) {
                expenseChart.destroy();
            }

            const ctx = document.getElementById('expense-chart').getContext('2d');
            expenseChart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Despesas por Categoria',
                        data: amounts,
                        backgroundColor: [
                            '#ff1493',
                            '#ff69b4',
                            '#ffb6c1',
                            '#ffc0cb',
                            '#db7093'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            });
        }

        expenseForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const name = document.getElementById('expense-name').value;
            const amount = parseFloat(document.getElementById('expense-amount').value);
            const type = document.getElementById('expense-type').value;
            const fixedVariable = document.getElementById('expense-fixed-variable').value;
            const paymentMethod = document.getElementById('expense-payment-method').value;
            const category = document.getElementById('expense-category').value;

            const expense = { name, amount, type, fixedVariable, paymentMethod, category };
            expenses.push(expense);
            localStorage.setItem('expenses', JSON.stringify(expenses));
            updateExpenses();
        });

        // Inicializa as despesas ao carregar a página
        updateExpenses();