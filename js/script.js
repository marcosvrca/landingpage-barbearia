// =======================
// MENU MOBILE
// =======================
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');

if (mobileMenuBtn) {
  mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });
}

mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.add('hidden');
  });
});

// =======================
// NAVBAR SCROLL
// =======================
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('glass-header', 'py-4', 'shadow-2xl');
    navbar.classList.remove('py-6');
  } else {
    navbar.classList.remove('glass-header', 'py-4', 'shadow-2xl');
    navbar.classList.add('py-6');
  }
});

// =======================
// SMOOTH SCROLL
// =======================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const destino = document.querySelector(this.getAttribute('href'));
    if (destino) {
      destino.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// =======================
// COMBOS - SELEÇÃO AUTOMÁTICA
// =======================
const comboButtons = document.querySelectorAll("[data-combo]");

comboButtons.forEach(button => {
  button.addEventListener("click", () => {
    const combo = button.getAttribute("data-combo");
    const valor = button.getAttribute("data-valor");

    const servicoSelect = document.getElementById("servico");

    // Preenche o select
    servicoSelect.innerHTML = `
      <option value="${combo}">${combo} - R$ ${valor}</option>
    `;
    servicoSelect.value = combo;

    // Scroll até agendamento
    document.getElementById("agendamento")
      .scrollIntoView({ behavior: "smooth" });
  });
});


// =======================
// AGENDAMENTO VIA WHATSAPP
// =======================
const formAgendamento = document.getElementById("form-agendamento");

if (formAgendamento) {
  const nomeInput = document.getElementById("nome");
  const servicoSelect = document.getElementById("servico");
  const campoData = document.getElementById("data");
  const campoHora = document.getElementById("hora");

  let whatsappURL = "";

  // Impedir datas passadas
  const hoje = new Date().toISOString().split("T")[0];
  campoData.setAttribute("min", hoje);

  // Função que define horários conforme o dia
  function ajustarHorarioPorDia(dataSelecionada) {
    const data = new Date(dataSelecionada + "T00:00");
    const diaSemana = data.getDay(); 
    // 0 = Domingo | 6 = Sábado

    if (diaSemana === 0) {
      // Domingo
      campoHora.min = "09:00";
      campoHora.max = "14:00";
    } else if (diaSemana === 6) {
      // Sábado
      campoHora.min = "08:00";
      campoHora.max = "18:00";
    } else {
      // Segunda a Sexta
      campoHora.min = "08:00";
      campoHora.max = "20:00";
    }

    campoHora.value = "";
  }

  // Quando o usuário escolhe a data
  campoData.addEventListener("change", () => {
    ajustarHorarioPorDia(campoData.value);
  });

  function formatarDataParaCalendar(data, hora) {
  const [ano, mes, dia] = data.split("-");
  const [h, m] = hora.split(":");

  const inicio = new Date(ano, mes - 1, dia, h, m);
  const fim = new Date(inicio.getTime() + 60 * 60 * 1000); // 1h

  const formatar = (d) =>
    d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  return {
    inicio: formatar(inicio),
    fim: formatar(fim)
  };
}

function gerarLinkGoogleCalendar({ titulo, descricao, local, inicio, fim }) {
  const baseURL =
    "https://calendar.google.com/calendar/render?action=TEMPLATE";

  const params = new URLSearchParams({
    text: titulo,
    details: descricao,
    location: local,
    dates: `${inicio}/${fim}`
  });

  return `${baseURL}&${params.toString()}`;
}


  // Submit do formulário
  formAgendamento.addEventListener("submit", function (e) {
    e.preventDefault();

    const nome = nomeInput.value;
    const servico = servicoSelect.value;
    const data = campoData.value;
    const hora = campoHora.value;

    const mensagem = `Olá! 👋
Meu nome é ${nome}.
Gostaria de agendar:
💈 Serviço: ${servico}
📅 Data: ${data}
⏰ Horário: ${hora}`;

    whatsappURL = `https://wa.me/5563991120229?text=${encodeURIComponent(mensagem)}`;

    document.getElementById("confirmacao").classList.remove("hidden");
    document.getElementById("confirmacao").classList.add("flex");
  });

  // Modal
  document.getElementById("cancelar").onclick = () => {
    document.getElementById("confirmacao").classList.add("hidden");
  };

  document.getElementById("confirmar").onclick = () => {
  const nome = nomeInput.value;
  const servico = servicoSelect.value;
  const data = campoData.value;
  const hora = campoHora.value;

  // WhatsApp
  window.open(whatsappURL, "_blank");

  // Google Calendar (gera link)
  const { inicio, fim } = formatarDataParaCalendar(data, hora);

  const linkCalendar = gerarLinkGoogleCalendar({
    titulo: `Barbearia do Jorge - ${servico}`,
    descricao: `Cliente: ${nome}\nServiço: ${servico}`,
    local: "Quadra 1106 Sul - Alameda 24",
    inicio,
    fim
  });

  // Exibe link no modal
  const calendarBtn = document.getElementById("calendarLink");
  calendarBtn.href = linkCalendar;
  calendarBtn.classList.remove("hidden");
};


}
