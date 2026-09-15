const WHATSAPP_NUMBER = "5511955549630";

const DEFAULT_WA_MESSAGE =
  "Olá! Quero atendimento da Universo AGV pelo WhatsApp.";

const buildWhatsAppUrl = (message) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

const openWhatsApp = (message) => {
  const url = buildWhatsAppUrl(message || DEFAULT_WA_MESSAGE);
  const link = document.createElement("a");
  link.href = url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.click();
};

const qs = (selector, scope = document) => scope.querySelector(selector);
const qsa = (selector, scope = document) => [...scope.querySelectorAll(selector)];

const setImageWithFallback = (imgElement, primarySrc, fallbackSrc, altText = "") => {
  if (!imgElement) return;

  imgElement.onerror = () => {
    if (fallbackSrc && imgElement.src !== new URL(fallbackSrc, window.location.href).href) {
      imgElement.src = fallbackSrc;
      imgElement.onerror = null;
    }
  };

  imgElement.src = primarySrc;
  imgElement.alt = altText;
};

/* LINKS WHATSAPP */
qsa(".js-wa-link").forEach((link) => {
  const message = link.dataset.message || DEFAULT_WA_MESSAGE;
  link.href = buildWhatsAppUrl(message);
  link.target = "_blank";
  link.rel = "noopener noreferrer";
});

/* FORMULÁRIO */
const quoteForm = document.getElementById("quoteForm");

if (quoteForm) {
  quoteForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(quoteForm);

    const payload = [
      ["nome", "Nome"],
      ["telefone", "Telefone / WhatsApp"],
      ["tipo", "Tipo do veículo"],
      ["cidade", "Cidade / UF"],
    ];

    const messageLines = [
      "*SIMULAÇÃO EXPRESSA*",
      "Olá! Quero fazer uma simulação com a Universo AGV.",
      "",
    ];

    payload.forEach(([field, label]) => {
      const raw = data.get(field);
      const value = typeof raw === "string" ? raw.trim() : "";

      if (value) {
        messageLines.push(`*${label}:* ${value}`);
      }
    });

    messageLines.push("");
    messageLines.push("Aguardo atendimento. Obrigado!");

    openWhatsApp(messageLines.join("\n"));

    const submitButton = qs(".quote-submit", quoteForm);
    if (submitButton) {
      const originalContent = submitButton.innerHTML;
      submitButton.disabled = true;
      submitButton.classList.add("is-loading");
      submitButton.innerHTML = "<span>Abrindo o WhatsApp...</span><small>Só um instante</small>";

      window.setTimeout(() => {
        submitButton.disabled = false;
        submitButton.classList.remove("is-loading");
        submitButton.innerHTML = originalContent;
      }, 1800);
    }
  });
}

/* MENU MOBILE */
const menuToggle = document.getElementById("menuToggle");
const mobilePanel = document.getElementById("mobilePanel");

if (menuToggle && mobilePanel) {
  const closeMobileMenu = () => {
    menuToggle.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    mobilePanel.classList.remove("is-open");
  };

  const openMobileMenu = () => {
    menuToggle.classList.add("is-open");
    menuToggle.setAttribute("aria-expanded", "true");
    mobilePanel.classList.add("is-open");
  };

  const toggleMobileMenu = () => {
    const isOpen = mobilePanel.classList.contains("is-open");
    if (isOpen) closeMobileMenu();
    else openMobileMenu();
  };

  menuToggle.addEventListener("click", toggleMobileMenu);

  qsa("a", mobilePanel).forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });

  document.addEventListener("click", (event) => {
    const clickedOutsideMenu =
      !mobilePanel.contains(event.target) && !menuToggle.contains(event.target);

    if (mobilePanel.classList.contains("is-open") && clickedOutsideMenu) {
      closeMobileMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMobileMenu();
      menuToggle.focus();
    }
  });
}

/* HEADER SCROLL */
const siteHeader = qs(".site-header");

if (siteHeader) {
  const syncHeader = () => {
    siteHeader.classList.toggle("is-scrolled", window.scrollY > 12);
  };

  window.addEventListener("scroll", syncHeader, { passive: true });
  syncHeader();
}

/* FAQ */
qsa(".faq-item").forEach((item) => {
  item.addEventListener("toggle", () => {
    if (!item.open) return;

    qsa(".faq-item").forEach((other) => {
      if (other !== item) other.open = false;
    });
  });
});

/* REVEAL + CONTADORES */
const animateCounter = (element) => {
  if (!element || element.dataset.countStarted === "true") return;

  const target = Number(element.dataset.count);
  if (Number.isNaN(target)) return;

  element.dataset.countStarted = "true";

  const duration = 1200;
  const start = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = String(Math.round(target * eased));

    if (progress < 1) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
};

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("show");

        if (entry.target.classList.contains("count-up")) {
          animateCounter(entry.target);
        }

        qsa(".count-up", entry.target).forEach(animateCounter);

        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.18 }
  );

  qsa(".reveal, .count-up").forEach((element) => observer.observe(element));
} else {
  qsa(".reveal").forEach((element) => element.classList.add("show"));
  qsa(".count-up").forEach(animateCounter);
}

/* VEÍCULOS */
const services = [
  {
    id: "moto",
    title: "Moto",
    short: "Proteção para duas rodas",
    tag: "Plano para motos",
    text:
      "Proteção ideal para quem busca mais segurança no dia a dia, com assistência, reboque e suporte para imprevistos em diferentes trajetos.",
    hero: "assets/moto_hero.png",
    tab: "assets/moto_tab.png",
    benefits: [
      { icon: "shield", title: "Roubo e furto", text: "Mais tranquilidade para proteger sua moto em situações críticas." },
      { icon: "support", title: "Assistência 24h", text: "Atendimento rápido para imprevistos e ocorrências no caminho." },
      { icon: "tow", title: "Reboque", text: "Auxílio importante em pane, acidente ou necessidade emergencial." },
      { icon: "key", title: "Chaveiro", text: "Apoio útil para situações inesperadas envolvendo acesso à moto." },
      { icon: "globe", title: "Cobertura nacional", text: "Suporte em diferentes regiões do Brasil." },
      { icon: "benefits", title: "Benefícios extras", text: "Mais valor para o associado além da proteção principal." },
    ],
  },
  {
    id: "carro",
    title: "Carro",
    short: "A proteção mais procurada",
    tag: "Plano para carros",
    text:
      "Uma solução completa para quem quer proteger o carro com mais segurança, assistência 24h e benefícios que fazem diferença no dia a dia.",
    hero: "assets/carro_hero.png",
    tab: "assets/carro_tab.png",
    benefits: [
      { icon: "impact", title: "Colisão", text: "Mais segurança para lidar com imprevistos no trânsito." },
      { icon: "users", title: "Danos a terceiros", text: "Mais tranquilidade em situações que envolvam outros veículos." },
      { icon: "glass", title: "Vidros", text: "Cobertura prática para reforçar o cuidado com o veículo." },
      { icon: "car", title: "Carro reserva", text: "Mais conveniência para quem depende do carro na rotina." },
      { icon: "shield", title: "Roubo e furto", text: "Proteção para uma das maiores preocupações do proprietário." },
      { icon: "support", title: "Assistência 24h", text: "Suporte rápido para emergências e ocorrências." },
    ],
  },
  {
    id: "caminhao",
    title: "Caminhão",
    short: "Proteção para quem roda forte",
    tag: "Plano para caminhões",
    text:
      "Proteção pensada para quem depende do caminhão para trabalhar, com suporte para emergências, assistência e cobertura que acompanha a rotina pesada.",
    hero: "assets/caminhao_hero.png",
    tab: "assets/caminhao_tab.png",
    benefits: [
      { icon: "shield", title: "Roubo e furto", text: "Mais segurança para proteger o patrimônio e reduzir prejuízos." },
      { icon: "tow", title: "Reboque", text: "Apoio essencial para atendimento rápido na estrada." },
      { icon: "support", title: "Assistência 24h", text: "Suporte contínuo para ajudar em imprevistos operacionais." },
      { icon: "impact", title: "Colisão", text: "Cobertura importante para minimizar impactos de acidentes." },
      { icon: "users", title: "Danos a terceiros", text: "Mais tranquilidade em ocorrências com terceiros." },
      { icon: "globe", title: "Cobertura nacional", text: "Atendimento em diferentes regiões do país." },
    ],
  },
  {
    id: "van",
    title: "Van",
    short: "Segurança para transporte e rotina",
    tag: "Plano para vans",
    text:
      "Uma proteção pensada para vans de trabalho ou transporte, com assistência, cobertura e suporte para manter a rotina em movimento.",
    hero: "assets/van_hero.png",
    tab: "assets/van_tab.png",
    benefits: [
      { icon: "shield", title: "Roubo e furto", text: "Proteção importante para um veículo de alto valor operacional." },
      { icon: "impact", title: "Colisão", text: "Mais segurança para lidar com imprevistos e ocorrências." },
      { icon: "users", title: "Danos a terceiros", text: "Mais tranquilidade em situações com outros veículos." },
      { icon: "support", title: "Assistência 24h", text: "Apoio rápido para situações inesperadas no dia a dia." },
      { icon: "tow", title: "Reboque", text: "Benefício essencial em caso de pane ou acidente." },
      { icon: "benefits", title: "Benefícios extras", text: "Mais valor agregado para o associado." },
    ],
  },
  {
    id: "especial",
    title: "Especial",
    short: "Uber, premium e outros perfis",
    tag: "Planos especiais",
    text:
      "Soluções para perfis diferenciados, como motoristas de aplicativo, veículos premium e situações fora do padrão tradicional, com atendimento consultivo para encontrar a melhor proteção.",
    hero: "assets/especial_hero.png",
    tab: "assets/especial_tab.png",
    benefits: [
      { icon: "car", title: "Perfis diferenciados", text: "Mais flexibilidade para atender veículos e usos fora do padrão comum." },
      { icon: "users", title: "Motorista de aplicativo", text: "Opções pensadas para quem roda com frequência e depende do veículo." },
      { icon: "shield", title: "Proteção personalizada", text: "Atendimento consultivo para indicar a solução mais adequada ao perfil." },
      { icon: "support", title: "Assistência 24h", text: "Suporte rápido para imprevistos em qualquer momento da rotina." },
      { icon: "globe", title: "Cobertura nacional", text: "Acompanhamento e atendimento em diferentes regiões do Brasil." },
      { icon: "benefits", title: "Condições especiais", text: "Mais possibilidades para quem busca uma proteção sob medida." },
    ],
  },
];

const iconMap = {
  shield:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 3v5c0 4.2-2.8 8.1-7 9-4.2-.9-7-4.8-7-9V6l7-3z"></path><path d="M9.5 12.1l1.7 1.7 3.5-3.7"></path></svg>',
  support:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15v-3a8 8 0 0 1 16 0v3"></path><path d="M18 15a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-1v-5h1z"></path><path d="M6 15H5a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h1v-5z"></path><path d="M12 19v2"></path></svg>',
  tow:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="7.5" cy="17.5" r="2.5"></circle><circle cx="17.5" cy="17.5" r="2.5"></circle><path d="M3 17.5V13l3-3h6l3 4h6"></path></svg>',
  key:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="7.5" cy="15.5" r="3.5"></circle><path d="M10.5 13.5L20 4"></path><path d="M17 4h3v3"></path><path d="M15 6l3 3"></path></svg>',
  globe:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M3 12h18"></path><path d="M12 3a15 15 0 0 1 0 18"></path><path d="M12 3a15 15 0 0 0 0 18"></path></svg>',
  benefits:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12v7a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-7"></path><path d="M2 7h20v5H2z"></path><path d="M12 20V7"></path><path d="M12 7h4.5a2.5 2.5 0 1 0-2.2-3.7L12 7z"></path><path d="M12 7H7.5a2.5 2.5 0 1 1 2.2-3.7L12 7z"></path></svg>',
  impact:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8 13l-2 2"></path><path d="M16 13l2 2"></path><path d="M6 17h12"></path><path d="M5 11l2-4h10l2 4"></path><path d="M7 11h10"></path></svg>',
  users:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>',
  glass:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h14l-1 8H6L5 4z"></path><path d="M7 20h10"></path><path d="M10 12l-1 8"></path><path d="M14 12l1 8"></path></svg>',
  car:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 16l1.5-5A2 2 0 0 1 6.4 9h11.2a2 2 0 0 1 1.9 2L21 16"></path><path d="M5 16h14"></path><circle cx="7.5" cy="17.5" r="1.5"></circle><circle cx="16.5" cy="17.5" r="1.5"></circle></svg>',
};

let activeService = services[1] || services[0];

const serviceTabs = document.getElementById("serviceTabs");
const serviceShowcase = document.getElementById("serviceShowcase");
const serviceTag = document.getElementById("serviceTag");
const serviceTitle = document.getElementById("serviceTitle");
const serviceText = document.getElementById("serviceText");
const serviceHeroImage = document.getElementById("serviceHeroImage");
const benefitsGrid = document.getElementById("benefitsGrid");
const serviceWaLink = qs(".js-service-wa");

const updateTabAccessibility = () => {
  if (!serviceTabs) return;

  qsa("[data-service]", serviceTabs).forEach((button) => {
    const isActive = button.dataset.service === activeService.id;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
    button.setAttribute("tabindex", isActive ? "0" : "-1");
  });
};

function renderTabs() {
  if (!serviceTabs) return;

  serviceTabs.innerHTML = services
    .map(
      (service) => `
        <button
          class="vehicle-tab ${service.id === activeService.id ? "is-active" : ""}"
          type="button"
          role="tab"
          aria-selected="${service.id === activeService.id ? "true" : "false"}"
          tabindex="${service.id === activeService.id ? "0" : "-1"}"
          data-service="${service.id}"
        >
          <span class="vehicle-tab__media">
            <img src="${service.tab}" alt="${service.title}" loading="lazy" />
          </span>
          <strong>${service.title}</strong>
          <span>${service.short}</span>
        </button>
      `
    )
    .join("");

  qsa("img", serviceTabs).forEach((img) => {
    img.onerror = () => {
      img.style.display = "none";
    };
  });
}

function renderActiveService() {
  if (
    !serviceTag ||
    !serviceTitle ||
    !serviceText ||
    !serviceHeroImage ||
    !benefitsGrid ||
    !serviceShowcase
  ) {
    return;
  }

  serviceShowcase.classList.remove("is-animating");
  void serviceShowcase.offsetWidth;
  serviceShowcase.classList.add("is-animating");

  serviceTag.textContent = activeService.tag;
  serviceTitle.textContent = activeService.title;
  serviceText.textContent = activeService.text;

  setImageWithFallback(
    serviceHeroImage,
    activeService.hero,
    "assets/carro_hero.png",
    `${activeService.title} em destaque`
  );

  benefitsGrid.innerHTML = activeService.benefits
    .map(
      (benefit) => `
        <article class="service-benefit reveal show">
          <span class="service-benefit__icon" aria-hidden="true">
            ${iconMap[benefit.icon] || iconMap.shield}
          </span>
          <h3>${benefit.title}</h3>
          <p>${benefit.text}</p>
        </article>
      `
    )
    .join("");

  if (serviceWaLink) {
    const message = `Olá! Quero fazer uma simulação para ${activeService.title.toLowerCase()} na Universo AGV.`;
    serviceWaLink.dataset.message = message;
    serviceWaLink.href = buildWhatsAppUrl(message);
    serviceWaLink.target = "_blank";
    serviceWaLink.rel = "noopener noreferrer";
  }

  renderTabs();
  updateTabAccessibility();
}

if (serviceTabs) {
  renderActiveService();

  serviceTabs.addEventListener("click", (event) => {
    const button = event.target.closest("[data-service]");
    if (!button) return;

    const selected = services.find((service) => service.id === button.dataset.service);
    if (!selected || selected.id === activeService.id) return;

    activeService = selected;
    renderActiveService();
    button.focus();
  });

  serviceTabs.addEventListener("keydown", (event) => {
    const currentIndex = services.findIndex((service) => service.id === activeService.id);
    if (currentIndex === -1) return;

    let nextIndex = currentIndex;

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = (currentIndex + 1) % services.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = (currentIndex - 1 + services.length) % services.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = services.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    activeService = services[nextIndex];
    renderActiveService();

    const nextButton = qs(`[data-service="${activeService.id}"]`, serviceTabs);
    if (nextButton) nextButton.focus();
  });
}
