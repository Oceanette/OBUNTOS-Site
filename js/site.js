const modules = {
  diario: { code: "DI / 01", kicker: "Para lembrar do seu dia", title: "Diário", text: "Guarde acontecimentos, ideias e memórias para voltar a eles depois, sem precisar espalhar tudo em vários lugares.", tags: ["Anotações", "Memórias", "Histórico"], symbol: "DI", accent: "#d97732", soft: "#f2d695" },
  tarefas: { code: "TA / 02", kicker: "Para não deixar passar", title: "Tarefas", text: "Anote o que precisa fazer, escolha o que vem primeiro e acompanhe as pequenas coisas do dia sem transformar a rotina em trabalho.", tags: ["Pendências", "Prioridades", "Rotina"], symbol: "TA", accent: "#c95f35", soft: "#efbc86" },
  calendario: { code: "CA / 03", kicker: "Para saber quando", title: "Calendário", text: "Reúna compromissos, datas importantes e lembretes para enxergar melhor o que vem pela frente.", tags: ["Agenda", "Datas", "Lembretes"], symbol: "CA", accent: "#d8a536", soft: "#f1dc9b" },
  metas: { code: "ME / 04", kicker: "Para acompanhar seus planos", title: "Metas", text: "Guarde objetivos, divida em etapas e acompanhe o caminho sem perder de vista por que aquilo importa para você.", tags: ["Objetivos", "Etapas", "Progresso"], symbol: "ME", accent: "#a95b37", soft: "#e9c4a3" },
  pessoas: { code: "PE / 05", kicker: "Para lembrar de quem importa", title: "Pessoas", text: "Crie registros de pessoas importantes, anote detalhes e preserve um histórico que faça sentido para a sua vida.", tags: ["Pessoas", "Relações", "Histórico"], symbol: "PE", accent: "#d07a3a", soft: "#f0cf9f" },
  biblioteca: { code: "BI / 06", kicker: "Para guardar o que você consulta", title: "Biblioteca", text: "Reúna referências e anexos locais, de documentos e imagens a arquivos compactados como ZIP, RAR e 7Z.", tags: ["Anexos", "Referências", "Arquivos"], symbol: "BI", accent: "#b86b38", soft: "#e7c7a5" },
  financas: { code: "FI / 07", kicker: "Para entender seu dinheiro", title: "Finanças", text: "Registre entradas e saídas e consulte seu próprio histórico financeiro no mesmo lugar em que você organiza o resto da vida.", tags: ["Movimentos", "Histórico", "Resumo"], symbol: "FI", accent: "#c88e32", soft: "#ead48e" },
  estatisticas: { code: "ES / 08", kicker: "Para enxergar o que mudou", title: "Estatísticas", text: "Veja seus registros por outro ângulo e perceba padrões e mudanças que podem passar despercebidos no dia a dia.", tags: ["Padrões", "Resumo", "Evolução"], symbol: "ES", accent: "#9f6038", soft: "#e2c8ad" }
};

const modes = {
  local: { number: "01", label: "O jeito mais simples", title: "Use só no seu computador", text: "Crie seu perfil e abra o arquivo normalmente neste PC, sem precisar de uma conta para começar.", points: ["Seu perfil fica neste computador", "Conta não é obrigatória", "Backups e snapshots são protegidos"] },
  cloud: { number: "02", label: "Quando quiser levar mais longe", title: "Conecte uma conta", text: "A conta adiciona identidade e sincronização opcional. Você decide se quer usar isso ou continuar só com o perfil local.", points: ["Identidade OBUNTOS", "Sincronização opcional", "Conteúdo protegido antes do envio"] },
  usb: { number: "03", label: "Uma chave física", title: "Use um pendrive", text: "Você pode autorizar um pendrive para facilitar o acesso ou, se preferir, exigir que ele esteja conectado para abrir o arquivo local.", points: ["Uso opcional", "Pode agilizar a entrada", "Também pode virar uma exigência de acesso"] }
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

function renderModule(key) {
  const data = modules[key];
  const panel = $("[data-module-panel]");
  if (!data || !panel) return;
  panel.classList.add("is-switching");
  setTimeout(() => {
    $("[data-module-code]").textContent = data.code;
    $("[data-module-kicker]").textContent = data.kicker;
    $("[data-module-title]").textContent = data.title;
    $("[data-module-text]").textContent = data.text;
    $("[data-module-symbol]").textContent = data.symbol;
    $("[data-module-tags]").innerHTML = data.tags.map(tag => `<span>${tag}</span>`).join("");
    panel.style.setProperty("--module-accent", data.accent);
    panel.style.setProperty("--module-soft", data.soft);
    $$("[data-module]").forEach(button => button.setAttribute("aria-selected", String(button.dataset.module === key)));
    panel.classList.remove("is-switching");
  }, 110);
}

function renderMode(key) {
  const data = modes[key];
  if (!data) return;
  $("[data-mode-number]").textContent = data.number;
  $("[data-mode-label]").textContent = data.label;
  $("[data-mode-title]").textContent = data.title;
  $("[data-mode-text]").textContent = data.text;
  $("[data-mode-points]").innerHTML = data.points.map(point => `<li>${point}</li>`).join("");
  $$("[data-mode]").forEach(button => button.setAttribute("aria-selected", String(button.dataset.mode === key)));
}

function showToast(message) {
  const toast = $("[data-toast]");
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("is-visible"), 1800);
}

function initHeader() {
  const header = $("[data-header]");
  const sync = () => header.classList.toggle("is-scrolled", scrollY > 14);
  sync();
  addEventListener("scroll", sync, { passive: true });
}

function initMenu() {
  const button = $("[data-menu-toggle]");
  const nav = $("[data-nav]");
  if (!button || !nav) return;
  const close = () => {
    nav.classList.remove("is-open");
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-label", "Abrir menu");
  };
  button.addEventListener("click", () => {
    const open = !nav.classList.contains("is-open");
    nav.classList.toggle("is-open", open);
    button.setAttribute("aria-expanded", String(open));
    button.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  });
  $$("a", nav).forEach(link => link.addEventListener("click", close));
  addEventListener("resize", () => { if (innerWidth > 820) close(); });
}

function initTabs() {
  $$("[data-module]").forEach(button => button.addEventListener("click", () => renderModule(button.dataset.module)));
  $$("[data-mode]").forEach(button => button.addEventListener("click", () => renderMode(button.dataset.mode)));
  renderModule("diario");
  renderMode("local");
}

function initFaq() {
  $$(".faq-list details").forEach(details => details.addEventListener("toggle", () => {
    if (!details.open) return;
    $$(".faq-list details").forEach(other => { if (other !== details) other.open = false; });
  }));
}

function initCopy() {
  const button = $("[data-copy-hash]");
  const hash = $("[data-hash]");
  if (!button || !hash) return;
  button.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(hash.textContent.trim());
      showToast("Código copiado");
    } catch {
      showToast("Selecione o código para copiar");
    }
  });
}

function initReveal() {
  document.documentElement.classList.add("reveal-ready");
  const items = $$("[data-reveal]");
  if (matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
    items.forEach(item => item.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: .11 });
  items.forEach(item => observer.observe(item));
}

function initSignMotion() {
  const sign = $(".retro-sign");
  if (!sign || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  sign.addEventListener("pointermove", event => {
    const rect = sign.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - .5;
    const y = (event.clientY - rect.top) / rect.height - .5;
    sign.style.transform = `rotate(${-0.4 + x * 0.55}deg) translate(${x * 2}px, ${y * 2}px)`;
  });
  sign.addEventListener("pointerleave", () => sign.style.transform = "rotate(-.4deg)");
}

initHeader();
initMenu();
initTabs();
initFaq();
initCopy();
initReveal();
initSignMotion();
