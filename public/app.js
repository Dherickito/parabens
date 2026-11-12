(() => {
  const content = window.birthdayFamily;
  if (!content) return;
  const assetBase = document.body.dataset.page === "home" ? "./" : "../";
  const homeHref = `${assetBase}index.html`;
  const personPhotoAlt = (person) => person.photoAlt || `${person.name} com a mãe`;

  const photoFallback = (image) => {
    const frame = image.closest(".photo-frame, .portrait-frame");
    if (!frame) return;
    frame.classList.add("is-placeholder");
    image.hidden = true;
  };

  const lightbox = document.createElement("dialog");
  lightbox.className = "photo-lightbox";
  lightbox.setAttribute("aria-label", "Fotografia ampliada");
  lightbox.innerHTML = `
    <div class="photo-lightbox-frame"><img alt=""></div>
    <p class="photo-lightbox-caption"></p>
    <button class="photo-lightbox-close" type="button" aria-label="Fechar fotografia">×</button>`;
  document.body.append(lightbox);

  const lightboxImage = lightbox.querySelector("img");
  const lightboxCaption = lightbox.querySelector(".photo-lightbox-caption");
  const clearLightbox = () => {
    lightboxImage.removeAttribute("src");
    lightboxImage.alt = "";
    lightboxCaption.textContent = "";
  };
  const closeLightbox = () => {
    clearLightbox();
    if (lightbox.open) lightbox.close();
  };
  lightbox.querySelector(".photo-lightbox-close").addEventListener("click", closeLightbox);
  lightbox.addEventListener("close", clearLightbox);
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  const openLightbox = (image) => {
    if (image.hidden || image.naturalWidth === 0) return;
    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt;
    lightboxCaption.textContent = image.alt;
    lightbox.showModal();
  };
  document.addEventListener("click", (event) => {
    if (!(event.target instanceof HTMLImageElement)) return;
    const image = event.target;
    if (!image.matches("img[data-fallback]")) return;
    event.preventDefault();
    event.stopPropagation();
    openLightbox(image);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox.open) {
      event.preventDefault();
      closeLightbox();
      return;
    }
    if (!(event.target instanceof HTMLImageElement) || !event.target.matches("img[data-fallback]")) return;
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    openLightbox(event.target);
  });

  document.querySelectorAll("img[data-fallback]").forEach((image) => {
    image.addEventListener("error", () => photoFallback(image));
    if (image.complete && image.naturalWidth === 0) photoFallback(image);
  });

  const memberCard = (person, index) => `
    <a class="person-card reveal" href="${assetBase}${person.id}/index.html" style="--card-delay:${index * 100}ms" aria-label="Ler a homenagem de ${person.name}, ${person.relationship.toLowerCase()}">
      <div class="card-photo photo-frame${person.photos[0] ? "" : " is-placeholder"}">
        ${person.photos[0] ? `<img src="${assetBase}images/${person.id}/${person.photos[0]}" alt="${personPhotoAlt(person)}" loading="lazy" data-fallback="person">` : ""}
        <div class="photo-placeholder" aria-hidden="true"><span class="placeholder-flower">✿</span><span>Um lugar especial<br>no seu coração</span></div>
        <span class="card-photo-heart" aria-hidden="true">♡</span>
      </div>
      <div class="card-copy"><span class="card-role">${person.relationship}</span><h3>${person.name}</h3><p>${person.cardLine}</p><span class="card-link">Ler minha mensagem <span aria-hidden="true">↗</span></span></div>
    </a>`;

  const home = document.querySelector(".family-message");
  if (home) {
    home.textContent = content.familyMessage;
    const makeAlbumPhoto = (photo, index, group) => `
      <figure class="memory-card reveal" style="--memory-delay:${index * 70}ms">
        <div class="memory-photo photo-frame">
          <img src="${assetBase}images/familia/${photo.file}" alt="${group === "mother" ? "Retrato da mãe" : "Fotografia da família"}" loading="lazy" data-fallback="family">
          <div class="photo-placeholder" aria-hidden="true"><span class="placeholder-flower">✿</span><span>Uma lembrança<br>para guardar</span></div>
        </div>
        <figcaption>${photo.caption}</figcaption>
      </figure>`;
    document.querySelectorAll(".memory-grid").forEach((grid) => {
      const group = grid.dataset.album;
      const photos = content.homePhotos[group] || [];
      grid.innerHTML = photos.map((photo, index) => makeAlbumPhoto(photo, index, group)).join("");
    });
    const grid = document.querySelector(".people-grid");
    grid.innerHTML = content.members.map(memberCard).join("");
    document.querySelectorAll(".people-grid img, .memory-grid img").forEach((image) => {
      image.addEventListener("error", () => photoFallback(image));
      if (image.complete && image.naturalWidth === 0) photoFallback(image);
    });
  }

  const page = document.querySelector(".person-page");
  if (page) {
    const person = content.members.find((member) => member.id === document.body.dataset.page);
    if (!person) {
      page.innerHTML = `<section class="not-found"><span class="eyebrow">um caminho de volta ao carinho</span><h1>Esta página não foi encontrada.</h1><a class="button button-primary" href="${homeHref}">Voltar à homenagem</a></section>`;
    } else {
      document.title = `Para você, com amor — ${person.name}`;
      const coverPhoto = person.photos[0];
      const galleryPhotos = person.photos.length ? person.photos : [null, null, null];
      const gallery = galleryPhotos.map((photo, index) => `
        <figure class="gallery-item reveal">
          <div class="photo-frame${photo ? "" : " is-placeholder"}">
            ${photo ? `<img src="${assetBase}images/${person.id}/${photo}" alt="${index === 0 ? personPhotoAlt(person) : `Recordação de ${person.name} e sua mãe, foto ${index + 1}`}" loading="lazy" data-fallback="person">` : ""}
            <div class="photo-placeholder" aria-hidden="true"><span class="placeholder-flower">✿</span><span>Uma lembrança<br>para guardar</span></div>
          </div>
          <figcaption>${person.id === "neta" ? "um abraço esperando o nosso encontro" : ["um carinho para guardar", "um instante só nosso", "lembranças que aquecem"][index % 3]}</figcaption>
        </figure>`).join("");
      page.innerHTML = `
        <section class="person-hero section-wrap">
          <a class="back-link reveal" href="${homeHref}"><span aria-hidden="true">←</span> Voltar à homenagem</a>
          <div class="person-intro">
            <div class="person-heading reveal"><span class="eyebrow">com amor, ${person.senderLine || `do seu ${person.relationship.toLowerCase()}`}</span><h1>${person.name}<span class="inline-heart">♥</span></h1><p>${person.intro}</p></div>
            <div class="person-main-photo portrait-frame reveal${coverPhoto ? "" : " is-placeholder"}">
              ${coverPhoto ? `<img src="${assetBase}images/${person.id}/${coverPhoto}" alt="${personPhotoAlt(person)}" data-fallback="person">` : ""}
              <div class="photo-placeholder" aria-hidden="true"><span class="placeholder-flower">✿</span><span>Uma lembrança<br>para guardar</span></div>
            </div>
          </div>
        </section>
        <section class="individual-note section-wrap reveal">
          <div class="section-kicker"><span>uma mensagem só sua</span><span class="kicker-rule"></span><span class="inline-heart">♡</span></div>
          <article class="individual-card"><span class="note-ornament" aria-hidden="true">“</span><p>${person.message}</p><p class="signature">${person.signoff}<br><span>${person.name}</span> <span class="inline-heart">♥</span></p></article>
        </section>
        <section class="gallery-section section-wrap">
          <div class="section-kicker reveal"><span>nossas lembranças</span><span class="kicker-rule"></span>um álbum de amor</div>
          <h2 class="gallery-title reveal">Pequenos instantes,<br><em>um amor imenso.</em></h2>
          <div class="photo-gallery${galleryPhotos.length === 1 ? " photo-gallery-single" : ""}">${gallery}</div>
        </section>
        <div class="return-home reveal"><p>Que o seu novo ano seja tão lindo quanto o amor que você espalha.</p><a class="button button-primary" href="${homeHref}"><span aria-hidden="true">♡</span> Voltar para a nossa homenagem</a></div>`;
      page.querySelectorAll("img[data-fallback]").forEach((image) => {
        image.addEventListener("error", () => photoFallback(image));
        if (image.complete && image.naturalWidth === 0) photoFallback(image);
      });
    }
  }

  document.querySelectorAll("img[data-fallback]").forEach((image) => {
    image.tabIndex = 0;
    image.setAttribute("role", "button");
    image.setAttribute("aria-haspopup", "dialog");
    image.title = "Clique ou pressione Enter para ampliar";
  });

  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, activeObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          activeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach((element) => observer.observe(element));
  } else {
    reveals.forEach((element) => element.classList.add("is-visible"));
  }

  const ambient = document.querySelector(".ambient");
  if (ambient && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    for (let index = 0; index < 17; index += 1) {
      const heart = document.createElement("span");
      heart.className = "floating-heart";
      heart.textContent = index % 4 === 0 ? "✦" : "♡";
      heart.style.setProperty("--left", `${Math.random() * 100}%`);
      heart.style.setProperty("--duration", `${16 + Math.random() * 15}s`);
      heart.style.setProperty("--delay", `${Math.random() * -25}s`);
      heart.style.setProperty("--size", `${10 + Math.random() * 15}px`);
      ambient.appendChild(heart);
    }
  }

  const audio = document.querySelector(".birthday-audio");
  const musicButton = document.querySelector(".music-button");
  if (audio && musicButton) {
    musicButton.addEventListener("click", async () => {
      if (audio.paused) {
        try {
          await audio.play();
          musicButton.setAttribute("aria-pressed", "true");
          musicButton.querySelector(".music-label").textContent = "Pausar música";
          musicButton.querySelector(".music-icon").textContent = "Ⅱ";
        } catch {
          musicButton.setAttribute("aria-pressed", "false");
          musicButton.querySelector(".music-label").textContent = "Adicione sua música";
          musicButton.querySelector(".music-icon").textContent = "▶";
        }
      } else {
        audio.pause();
        musicButton.setAttribute("aria-pressed", "false");
        musicButton.querySelector(".music-label").textContent = "Nossa trilha";
        musicButton.querySelector(".music-icon").textContent = "▶";
      }
    });
    audio.addEventListener("error", () => {
      if (!audio.paused) audio.pause();
      musicButton.setAttribute("aria-pressed", "false");
      musicButton.querySelector(".music-label").textContent = "Adicione sua música";
      musicButton.querySelector(".music-icon").textContent = "▶";
    });
  }

  if (sessionStorage.getItem("birthday-welcome") !== "seen") {
    document.body.classList.add("first-visit");
    window.setTimeout(() => {
      document.body.classList.remove("first-visit");
      sessionStorage.setItem("birthday-welcome", "seen");
    }, 1700);
  }
})();
