import { fetchJyotirlingaa } from "../apis.js";

const temples_container = document.getElementById("temples_container");

async function renderTemplesCard() {
  const info = await fetchJyotirlingaa();
  if(!Array.isArray(info)){
    console.error("Invalid api response"); return;
  }
  const { jyotirlings, data } = info
  temples_container.innerHTML = ``
  
  const obeserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.remove("article")
        obeserver.unobserve(entry.target);
      }
    })
  },{threshold:0.3})

  const frag = document.createDocumentFragment();

  jyotirlings.forEach((lingam, i) => {
    const article = document.createElement("article");
    article.className = `article bg-white dark:bg-neutral-700 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-1000 group`;

    article.innerHTML = `
    <!-- Image -->
    <div class="relative h-52 overflow-hidden ">
      <div class="w-full h-52 flex overflow-x-auto overflow-y-hidden scrollbar-hide snap-x snap-mandatory">
      ${lingam.images.map(img => (
      `<div class="shrink-0 h-48 snap-end w-full content-center">
        <img src="${img}" alt="${lingam.name.en}" loading="lazy"
        class=" object-fill h-full w-full mx-auto transition duration-200" />
      </div>`
    ))}
      </div>
        <!-- Tag -->
        <span class="absolute top-3 left-3 bg-black/70 text-white text-xs px-3 py-1 rounded-full">
          ${lingam.name.hi}
        </span>
      </div>

      <!-- Content -->
      <div class="p-5 space-y-3">

        <!-- Title -->
        <h3 class="text-xl font-bold text-gray-900 dark:text-white">
          ${lingam.name.en}
        </h3>

        <!-- Location -->
        <p class="text-sm text-gray-500 dark:text-gray-200 flex items-center gap-1">
          <i class="fa-solid fa-location-dot"></i> ${lingam.location.city}, ${lingam.location.state}
        </p>

        <!-- Quick Info -->
        <div class="flex flex-wrap gap-2 text-xs *:dark:bg-gray-500 *:dark:text-gray-200">
          <span class="bg-gray-100 px-3 py-1 rounded-full">
            ⏱ ${lingam.trip_plan.days} Days
          </span>
          <span class="bg-gray-100 px-3 py-1 rounded-full">
            📅 ${lingam?.best_time || ""}
          </span>
          <span class="bg-gray-100 px-3 py-1 rounded-full">
            💰 ${lingam.approx_cost_inr}
          </span>
        </div>

        <!-- Description -->
        <p class="text-sm text-gray-600 dark:text-gray-200 line-clamp-3">
          ${lingam.about.en.text}
        </p>

        <!-- CTA -->
        <a href="/pages/jyotirlinga-detail.html?id=${lingam.id}"
          class="inline-flex items-center justify-center w-full mt-3 bg-black dark:bg-gray-600 text-white py-2 rounded-xl hover:bg-gray-900 transition">
          View Details →
        </a>

      </div>
        `
    frag.append(article)
    obeserver.observe(article)
  });
  temples_container.append(frag)
}
renderTemplesCard();

