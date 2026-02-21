import { fetchJyotirlingaa } from "../apis.js";

const heading = document.getElementById("heading");
const trip_details = document.getElementById("trip_details");
const about_temple = document.getElementById("about_temple");
const aarti_dressCode = document.getElementById("aarti_dressCode");
const aarti_schedule = document.getElementById("aarti_schedule");
const trip_plan = document.getElementById("trip_plan");
const stay_food_guid = document.getElementById("stay_food_guid");
const pilgrim_tips = document.getElementById("pilgrim_tips");

const queryStr = window.location.search;
const urlParams = new URLSearchParams(queryStr)
const id = urlParams.get("id")

document.addEventListener("DOMContentLoaded", async () => {

  const info = await fetchJyotirlingaa();
  const { pilgrim_checklist, jyotirlings, data, meta } = info;
  const jyotirlinga = jyotirlings.filter(j => j.id === id)

  if (heading) renderHeading(jyotirlinga[0]);
  if (trip_details) renderTripDetails(jyotirlinga[0]);
  if (about_temple) renderAboutTemple(jyotirlinga[0]);
  if (aarti_schedule) renderAartiDressCodeDetails(jyotirlinga[0]);
  if (trip_plan) renderTripPlan(jyotirlinga[0])
  if (stay_food_guid) renderStay_food_Guide(jyotirlinga[0])
  if (pilgrim_tips) renderPilgrims(jyotirlinga[0].tips)
})

function renderHeading(lingam) {
  const img = lingam.images[0];
  heading.innerHTML = ``

  heading.className =
    "relative h-[80vh] md:h-[60vh] overflow-hidden bg-cover bg-center bg-no-repeat transition-all";

  heading.style.backgroundImage = `url('${img}')`;

  heading.innerHTML = `
    <div class="absolute inset-0 bg-black/50 flex flex-col justify-end p-8 text-white">
      <h1 class="text-4xl font-bold">${lingam.name.en}</h1>
      <p class="opacity-90 hover:underline cursor-pointer text-cyan-300"><i class="fa-solid fa-location-dot"></i> ${lingam.location.city}, ${lingam.location.state}</p>
    </div>`
}
function renderTripDetails(lingam) {
  trip_details.innerHTML = ``

  trip_details.innerHTML = `
    <div class="bg-white shadow rounded-xl p-4">
      <h3 class="font-semibold">Best Time to visit</h3>
      <p>${lingam?.best_time || ""}</p>
    </div>

    <div class="bg-white shadow rounded-xl p-4">
      <h3 class="font-semibold">Trip Days</h3>
      <p>${lingam?.trip_plan.days || ""} Days</p>
    </div>

    <div class="bg-white shadow rounded-xl p-4">
      <h3 class="font-semibold">Darshan Hours</h3>
      <p>${lingam?.darshan.timings || ""}</p>
    </div>

    <div class="bg-white shadow rounded-xl p-4">
      <h3 class="font-semibold">Budget</h3>
      <p>${lingam?.approx_cost_inr || ""}</p>
    </div>

    <div class="col-span-2 md:col-span-4 bg-white shadow rounded-xl p-4">
      <a href="${lingam.darshan?.booking_link || ""}" class="underline text-cyan-700 ">Booking Link on offical site of ${lingam?.name?.en}</a>
      <p>${lingam?.darshan?.process || ""}</p>
    </div>
    `
}
function renderAboutTemple(lingam) {
  const toggler = document.getElementById("toggler_Lang");
  const h2 = about_temple.querySelector("#about_temple h2");
  const p = about_temple.querySelector("#desc");
  const btns = toggler.querySelectorAll("[data-id]");
  const updateContent = (lang) => {
    h2.innerHTML = `${lingam?.about?.[lang]?.label}` || "na"
    p.innerHTML = `${lingam.about?.[lang]?.text}` || "na"

    btns.forEach(btn => {
      btn.classList.toggle("bg-gray-300", btn.dataset.id === lang)
    })
  }
  updateContent("en");

  toggler.addEventListener("click", (e) => {
    const target = e.target.closest("[data-id]");
    if (!target) return;

    const selectedLang = target.dataset.id;
    updateContent(selectedLang)
  })
}
function renderAartiDressCodeDetails(lingam) {
  const dress = lingam?.darshan?.dress_code
  const dress_code = aarti_dressCode.querySelector("#dress_code")

  aarti_schedule.innerHTML = ``
  dress_code.innerHTML = ``

  const frag1 = document.createDocumentFragment();
  lingam?.darshan?.aarti?.forEach(a => {
    const div = document.createElement("div");
    div.className = `bg-white p-4 rounded-lg shadow flex justify-between`;
    div.innerHTML += `
      <span>${a.label}</span>
      <span>${a.time}</span>
    `
    frag1.append(div)
  })

  aarti_schedule.append(frag1);

  dress_code.innerHTML = `
  <p><span class="font-semibold">Mens: </span><span>${dress.men}</span></p>
  <p><span class="font-semibold">Womens: </span><span>${dress.women}</span></p>
  <h4 class="font-semibold ">Prohibitions Rule: (not Allowed)</h4>
  <ul class="list-disc *:ml-5">
  ${dress?.prohibited?.map(res => (
    `<li>${res}</li>`
  )).join("")}
  </ul>
  `
  lingam?.darshan?.dress_code;
}
function renderTripPlan(lingam) {
  // keep the heading, remove old rendered content
  const heading = trip_plan.querySelector("h2");
  trip_plan.innerHTML = "";
  trip_plan.append(heading);

  const frag = document.createDocumentFragment();

  lingam?.trip_plan?.itinerary?.forEach(it => {
    const details = document.createElement("details");
    details.className = "bg-white rounded-xl shadow mb-3 p-4";

    details.innerHTML = `
      <summary class="font-semibold cursor-pointer">
        ${it.label}
      </summary>
      <p class="mt-2 text-gray-700">
        ${it.text}
      </p>
    `;

    frag.append(details);
  });

  // append note AFTER all itinerary items
  if (lingam?.trip_plan?.note) {
    const note = document.createElement("p");
    note.className = "mt-2 text-gray-600";
    note.innerHTML = lingam.trip_plan.note;
    frag.append(note);
  }

  trip_plan.append(frag);
}
function renderStay_food_Guide(lingam) {
  const stays = lingam?.stay;
  const foods = lingam?.food_nearby;

  const stay_guide = stay_food_guid.querySelector("#stay_guide");
  const food_nearby = stay_food_guid.querySelector("#food_nearby");
  const p = stay_food_guid.querySelector("p");

  p.textContent = "Pro tip: " + foods?.local_food_note;
  stay_guide.innerHTML = `
    <h3 class="text-xl font-semibold mb-2">Where to Stay</h3>
    
    ${Object.entries(stays).map(([tier, info]) => {
    return `
      <div class="mb-4">
        <h4 class="text-base font-semibold text-gray-700 capitalize">
          ${tier} • ${info.price_range_inr}
        </h4>
        <ul class="list-disc ml-5 mt-1">
          ${info.hotels
        .map(h => `<li>${h.name}</li>`)
        .join("")}
        </ul>
      </div>
      `;
  }).join("")}
  `;

  food_nearby.innerHTML = `
  <h3 class="text-xl font-semibold mb-2">Local Food & Dhabas</h3>
  <h4 class="text-base text-gray-600 font-semibold ml-2 underline">Dhabas & Restaurant</h4>
  <ul class="list-disc ml-5">
    ${foods?.restaurants?.map(dhaba => (
    `<li>${dhaba.name}</li>`
  )).join("")}
  </ul>
  <h4 class="text-base text-gray-600 font-semibold ml-2 mt-2 underline">Must try Local food</h4>
  <ul class="list-disc ml-5">
  ${foods.must_try_dishes.map(dish => (
    `<li>${dish}</li>`
  )).join("")}
  </ul>
  `;
}
function renderPilgrims(tips) {
  const ul = pilgrim_tips.querySelector("ul");
  ul.innerHTML = ``;
  tips.forEach(tip => {
    const li = document.createElement("li");
    li.innerHTML = tip
    ul.append(li)
  })

}
