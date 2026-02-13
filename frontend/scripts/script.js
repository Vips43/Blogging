import { fetchGlobal } from "./apis.js";
import { matchStatus, pageLoader } from "./index.js";

const score_container = document.getElementById("score_container");

const loader = pageLoader()

window.addEventListener("load", () => {
  setTimeout(() => loader.remove(), 300);
})


async function renderCurrentMatches() {
  const params = `/v1/currentMatches`;
  const currentMatches = await fetchGlobal(params, "current Match");


  if (!currentMatches?.data?.length) return;

  score_container.innerHTML = "";
  const frag = document.createDocumentFragment();

  const sorted = currentMatches.data.sort((a, b) => {
    return new Date(b.dateTimeGMT).getTime() - new Date(a.dateTimeGMT).getTime();
  });

  sorted.forEach((match, i) => {
    const article = document.createElement("article");
    const { statusText, statusColor } = matchStatus(match)
    article.className =
      "slider shrink-0 max-w-xl h-[275px] relative snap-center w-full grid content-between bg-white dark:bg-neutral-800 dark:text-white text-neutral-900 p-4 pb-0 shadow-lg rounded-xl transition-all duration-700 opacity-0 translate-x-5";

    article.innerHTML = `
      <header class="space-y-1">
        <h3 class="text-center font-semibold text-gray-500 first-letter:uppercase">
          ${match.matchType} • ${match.venue}
        </h3>
        <h4 class="text-sm text-center font-semibold leading-snug line-clamp-1">
          ${match.name}
        </h4>
        <h3 class="text-xs text-center text-white/60">
          ${match.date} - ${new Date(match.dateTimeGMT).toLocaleTimeString()}
        </h3>
      </header>
    <span class="absolute top-2 right-2 ${statusColor} capitalize text-xs">${statusText}</span>
      <div class="relative grid grid-cols-2 gap-4 mt-3">
        ${match.teamInfo.map((team, idx) => {
      match.score?.[idx];
      return `
      <div class="space-y-0">
        <div class="flex items-center justify-center">
          <img
            src="${team.img}"
            alt="${team.name}"
            class="h-14 rounded-sm object-cover"
          />
        </div>

        <p class="text-sm text-center leading-4">
          <span class="font-medium inline-block px-2 max-w-44 truncate">
            ${team.name}
          </span>
          <span class="block text-xs opacity-70">
            (${team.shortname})
          </span>
        </p>
    </div>
          `;
    }).join("")}

    <img
      src="/vs.png" loading="lazy"
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-9 opacity-80 dark:invert"
      alt="vs"
    />
    
    </div>
  ${renderScores(match)}
      <footer
        class="text-xs font-medium text-center text-emerald-400 bg-cyan-900/90 w-fit px-5 py-2 mb-auto rounded-t-full mx-auto">
        ${match.status}
      </footer>
    `;

    frag.append(article);

    setTimeout(() => {
      article.classList.remove("opacity-0", "translate-x-5");
    }, 300 * i);
  });

  score_container.append(frag);
}

if (score_container) renderCurrentMatches();



function renderScores(mc) {
  const team1Scores = [mc.score[0], mc.score[2]].filter(Boolean);
  const team2Scores = [mc.score[1], mc.score[3]].filter(Boolean);

  let team1 = []
  let team2 = []

  const team1Name = mc.teamInfo[0]?.name;
  const team2Name = mc.teamInfo[0]?.name;

  mc.score.forEach(inn => {
    if (inn.inning.includes(team1Name)) {
      team1.push(inn)
    } else if (inn.inning.includes(team2Name)) {
      team2.push(inn);
    }
  })
  const renderInnings = (innings) => {
    if (!innings.length) return "-";

    return innings
      .map((sc) => `<span class="text-sm font-semibold">${sc?.r ?? 0}</span>/${sc?.w ?? 0} <span class="text-xs ">(${sc?.o ?? 0} overs)</span>`)
      .join(' <span class="opacity-80">&</span> ')
  };

  return `
    <p class="text-center text-sm w-full grid grid-cols-2 mt-2">
      <span class="text-neutral-200">
        ${renderInnings(team1Scores)}
      </span>
      <span class="text-neutral-200">
        ${renderInnings(team2Scores)}
      </span>
    </p>
  `;
}