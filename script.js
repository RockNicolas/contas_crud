let salario = 4000;
const contasFixas = [
  { nome: "Casa", vencimento: "15 de Outubro", valor: 1200 },
  { nome: "Carro", vencimento: "30 de Outubro", valor: 300 },
];
const contasVariaveis = [
  { nome: "Internet", vencimento: "05 de Outubro", valor: 200 },
  { nome: "Luz", vencimento: "10 de Outubro", valor: 180 },
  { nome: "Água", vencimento: "12 de Outubro", valor: 120 },
];

const elSalario = document.getElementById("salario");
const elFixas = document.getElementById("totalFixas");
const elVariaveis = document.getElementById("totalVariaveis");
const elSaldo = document.getElementById("saldoRestante");
const listaContas = document.getElementById("listaContas");
const tabFixas = document.getElementById("tabFixas");
const tabVariaveis = document.getElementById("tabVariaveis");
const botaoEditar = document.getElementById("editarSalario");

function formatar(v) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function atualizarResumo() {
  const totalFixas = contasFixas.reduce((acc, c) => acc + c.valor, 0);
  const totalVariaveis = contasVariaveis.reduce((acc, c) => acc + c.valor, 0);
  const saldo = salario - (totalFixas + totalVariaveis);

  elSalario.value = formatar(salario);
  elFixas.textContent = formatar(totalFixas);
  elVariaveis.textContent = formatar(totalVariaveis);
  elSaldo.textContent = formatar(saldo);

  desenharGrafico(totalFixas, totalVariaveis, saldo);
}

function exibirContas(tipo) {
  listaContas.innerHTML = "";
  const contas = tipo === "fixas" ? contasFixas : contasVariaveis;

  contas.forEach((c) => {
    const div = document.createElement("div");
    div.className = "bill";
    div.innerHTML = `
      <div class="meta">
        <strong>${c.nome}</strong>
        <small>${c.vencimento}</small>
      </div>
      <span>${formatar(c.valor)}</span>
    `;
    listaContas.appendChild(div);
  });
}

let chartInstance = null;
function desenharGrafico(fixas, variaveis, saldo) {
  const ctx = document.getElementById("grafico");
  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Fixas", "Variáveis", "Saldo"],
      datasets: [{
        data: [fixas, variaveis, saldo],
        backgroundColor: ["#2563EB", "#DC2626", "#16A34A"],
      }],
    },
    options: { plugins: { legend: { display: false } } },
  });
}

tabFixas.onclick = () => {
  tabFixas.classList.add("active");
  tabVariaveis.classList.remove("active");
  exibirContas("fixas");
};

tabVariaveis.onclick = () => {
  tabVariaveis.classList.add("active");
  tabFixas.classList.remove("active");
  exibirContas("variaveis");
};

const currentMonth = document.getElementById("currentMonth");
const hoje = new Date();
currentMonth.textContent = hoje.toLocaleDateString("pt-BR", {
  month: "long",
  year: "numeric",
});

botaoEditar.addEventListener("click", () => {
  elSalario.removeAttribute("readonly");
  elSalario.classList.add("editando");
  elSalario.focus();
  elSalario.select();
});

elSalario.addEventListener("blur", salvarSalario);
elSalario.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    elSalario.blur();
  }
});

function salvarSalario() {
  let valorDigitado = elSalario.value.replace(/[^\d,.-]/g, "").replace(",", ".");
  const novoSalario = parseFloat(valorDigitado);

  if (!isNaN(novoSalario)) {
    salario = novoSalario;
    elSalario.value = formatar(salario);
    atualizarResumo();
  } else {
    elSalario.value = formatar(salario);
  }

  elSalario.setAttribute("readonly", true);
  elSalario.classList.remove("editando");
}

// Inicializa
atualizarResumo();
exibirContas("fixas");
