const STORAGE_KEY = "pf-data";
const DEFAULT_CATEGORIES = ["Housing", "Food", "Transport", "Entertainment", "Health", "Other"];

const state = {
  incomes: [],
  expenses: [],
  budgets: [],
};

const dom = {
  navButtons: document.querySelectorAll(".nav-btn"),
  pages: document.querySelectorAll(".page"),
  overviewMonth: document.getElementById("overview-month"),
  budgetMonth: document.getElementById("budget-month"),
  expenseMonthFilter: document.getElementById("expense-month-filter"),
  expenseCategoryFilter: document.getElementById("expense-category-filter"),
  totalIncome: document.getElementById("total-income"),
  totalExpense: document.getElementById("total-expense"),
  balance: document.getElementById("balance"),
  incomeForm: document.getElementById("income-form"),
  expenseForm: document.getElementById("expense-form"),
  budgetForm: document.getElementById("budget-form"),
  expenseCategory: document.getElementById("expense-category"),
  budgetCategory: document.getElementById("budget-category"),
  expenseRows: document.getElementById("expense-rows"),
  expenseSummary: document.getElementById("expense-summary"),
  budgetList: document.getElementById("budget-list"),
};

init();

function init() {
  const currentMonth = toMonthString(new Date());
  dom.overviewMonth.value = currentMonth;
  dom.budgetMonth.value = currentMonth;
  dom.expenseMonthFilter.value = currentMonth;

  hydrateState();
  refreshCategories();

  dom.navButtons.forEach((btn) => btn.addEventListener("click", () => switchPage(btn.dataset.target)));
  dom.overviewMonth.addEventListener("change", renderOverview);
  dom.expenseMonthFilter.addEventListener("change", renderExpenses);
  dom.expenseCategoryFilter.addEventListener("change", renderExpenses);
  dom.budgetMonth.addEventListener("change", renderBudgets);
  dom.incomeForm.addEventListener("submit", handleIncomeSubmit);
  dom.expenseForm.addEventListener("submit", handleExpenseSubmit);
  dom.budgetForm.addEventListener("submit", handleBudgetSubmit);

  renderAll();
  switchPage("overview");
}

function hydrateState() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    const parsed = JSON.parse(stored);
    state.incomes = parsed.incomes || [];
    state.expenses = parsed.expenses || [];
    state.budgets = parsed.budgets || [];
    return;
  }

  // Seed with realistic sample data
  const now = new Date();
  const month = toMonthString(now);
  state.incomes = [
    { id: uid(), source: "Paycheck", amount: 4200, date: toISO(now) },
    { id: uid(), source: "Freelance", amount: 600, date: toISO(addDays(now, -10)) },
  ];
  state.expenses = [
    { id: uid(), category: "Housing", amount: 1400, date: toISO(addDays(now, -3)), note: "Rent" },
    { id: uid(), category: "Food", amount: 220.5, date: toISO(addDays(now, -1)), note: "Groceries" },
    { id: uid(), category: "Transport", amount: 75, date: toISO(addDays(now, -6)), note: "Fuel" },
    { id: uid(), category: "Entertainment", amount: 60, date: toISO(addDays(now, -12)), note: "Concert" },
  ];
  state.budgets = [
    { id: uid(), category: "Food", month, monthlyLimit: 400 },
    { id: uid(), category: "Transport", month, monthlyLimit: 200 },
    { id: uid(), category: "Entertainment", month, monthlyLimit: 150 },
  ];
  persist();
}

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function switchPage(target) {
  dom.pages.forEach((page) => page.classList.toggle("hidden", page.id !== target));
  dom.navButtons.forEach((btn) => btn.classList.toggle("active", btn.dataset.target === target));
}

function renderAll() {
  renderOverview();
  renderExpenses();
  renderBudgets();
}

function refreshCategories() {
  const categories = Array.from(
    new Set([
      ...DEFAULT_CATEGORIES,
      ...state.expenses.map((e) => e.category),
      ...state.budgets.map((b) => b.category),
    ])
  ).sort();

  fillSelect(dom.expenseCategory, categories);
  fillSelect(dom.budgetCategory, categories);

  dom.expenseCategoryFilter.innerHTML = "";
  const all = document.createElement("option");
  all.value = "";
  all.textContent = "All";
  dom.expenseCategoryFilter.appendChild(all);
  categories.forEach((cat) => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    dom.expenseCategoryFilter.appendChild(opt);
  });
}

function renderOverview() {
  const month = dom.overviewMonth.value;
  const totals = getMonthlyTotals(month);
  dom.totalIncome.textContent = formatCurrency(totals.income);
  dom.totalExpense.textContent = formatCurrency(totals.expense);
  dom.balance.textContent = formatCurrency(totals.balance);
}

function renderExpenses() {
  const monthFilter = dom.expenseMonthFilter.value;
  const categoryFilter = dom.expenseCategoryFilter.value;

  const filtered = state.expenses
    .filter((e) => (!monthFilter ? true : toMonthString(e.date) === monthFilter))
    .filter((e) => (!categoryFilter ? true : e.category === categoryFilter))
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  dom.expenseRows.innerHTML = "";

  if (!filtered.length) {
    dom.expenseRows.innerHTML = '<div class="empty-state">No expenses match your filters.</div>';
    dom.expenseSummary.textContent = "0 expenses";
    return;
  }

  filtered.forEach((e) => {
    const row = document.createElement("div");
    row.className = "table-row";
    row.innerHTML = `
      <div>${formatDate(e.date)}</div>
      <div>${e.category}</div>
      <div class="align-right">${formatCurrency(e.amount)}</div>
      <div>${e.note || "-"}</div>
    `;
    dom.expenseRows.appendChild(row);
  });

  const total = filtered.reduce((sum, e) => sum + Number(e.amount), 0);
  dom.expenseSummary.textContent = `${filtered.length} expenses | ${formatCurrency(total)}`;
}

function renderBudgets() {
  const month = dom.budgetMonth.value;
  const budgets = state.budgets.filter((b) => b.month === month);
  dom.budgetList.innerHTML = "";

  if (!budgets.length) {
    dom.budgetList.innerHTML = '<div class="empty-state">No budgets for this month yet. Add one to start tracking.</div>';
    return;
  }

  budgets
    .sort((a, b) => a.category.localeCompare(b.category))
    .forEach((b) => {
      const spent = getSpentForCategory(b.category, month);
      const pct = b.monthlyLimit === 0 ? 0 : Math.min((spent / b.monthlyLimit) * 100, 150);
      const over = spent > b.monthlyLimit;

      const wrapper = document.createElement("div");
      wrapper.className = "budget-row";
      wrapper.innerHTML = `
        <div class="budget-header">
          <span>${b.category}</span>
          <span class="badge ${over ? "over" : ""}">${over ? "Over" : "On track"}</span>
        </div>
        <div class="progress">
          <div class="progress-fill ${over ? "over" : ""}" style="width:${pct}%"></div>
        </div>
        <div class="help-text">
          ${formatCurrency(spent)} spent of ${formatCurrency(b.monthlyLimit)}
        </div>
      `;
      dom.budgetList.appendChild(wrapper);
    });
}

function handleIncomeSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const data = new FormData(form);
  const income = {
    id: uid(),
    source: data.get("source"),
    amount: Number(data.get("amount")),
    date: data.get("date"),
  };
  state.incomes.push(income);
  persist();
  form.reset();
  setDefaultDate(form.querySelector("input[name='date']"));
  renderOverview();
}

function handleExpenseSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const data = new FormData(form);
  const expense = {
    id: uid(),
    category: data.get("category"),
    amount: Number(data.get("amount")),
    date: data.get("date"),
    note: data.get("note"),
  };
  state.expenses.push(expense);
  persist();
  form.reset();
  setDefaultDate(form.querySelector("input[name='date']"));
  refreshCategories();
  renderAll();
}

function handleBudgetSubmit(event) {
  event.preventDefault();
  const data = new FormData(event.target);
  const category = data.get("category");
  const limit = Number(data.get("limit"));
  const month = dom.budgetMonth.value;

  const existing = state.budgets.find((b) => b.category === category && b.month === month);
  if (existing) {
    existing.monthlyLimit = limit;
  } else {
    state.budgets.push({ id: uid(), category, monthlyLimit: limit, month });
  }

  persist();
  renderBudgets();
  event.target.reset();
}

function getMonthlyTotals(month) {
  const income = state.incomes
    .filter((i) => toMonthString(i.date) === month)
    .reduce((sum, i) => sum + Number(i.amount), 0);
  const expense = state.expenses
    .filter((e) => toMonthString(e.date) === month)
    .reduce((sum, e) => sum + Number(e.amount), 0);
  return { income, expense, balance: income - expense };
}

function getSpentForCategory(category, month) {
  return state.expenses
    .filter((e) => e.category === category && toMonthString(e.date) === month)
    .reduce((sum, e) => sum + Number(e.amount), 0);
}

function fillSelect(select, options) {
  select.innerHTML = "";
  options.forEach((opt) => {
    const option = document.createElement("option");
    option.value = opt;
    option.textContent = opt;
    select.appendChild(option);
  });
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(Number(value || 0));
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function toMonthString(date) {
  const d = new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

function toISO(date) {
  return new Date(date).toISOString().slice(0, 10);
}

function uid() {
  return crypto.randomUUID ? crypto.randomUUID() : `id-${Date.now()}-${Math.random()}`;
}

function addDays(date, days) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

function setDefaultDate(input) {
  input.value = toISO(new Date());
}

// Default date fillers for forms
setDefaultDate(dom.incomeForm.querySelector("input[name='date']"));
setDefaultDate(dom.expenseForm.querySelector("input[name='date']"));

// Explanation for how budget usage is calculated (exposed for debugging if needed)
window._budgetLogic = {
  getMonthlyTotals,
  getSpentForCategory,
  state,
};
