import { mouseOver, newsCats, pageLoader } from "./index.js";

const news_container = document.getElementById("news_container");

const loader = pageLoader()

window.addEventListener("load", () => {
  setTimeout(() => loader.remove(), 300);
})


let newsController;
export async function renderNews(cat) {

  try {
    if (newsController) newsController.abort();

    newsController = new AbortController()
    const BASE_URL =
      window.location.hostname === "localhost"
        ? "http://localhost:3000"
        : "bloggingbackend.vercel.app";

    const res = await fetch(`${BASE_URL}/news/${cat}`, { signal: newsController.signal })

    const newses = await res.json();

    const frag = document.createDocumentFragment();
    news_container.innerHTML = ``
    newses?.results?.forEach((news, i) => {
      
      const article = document.createElement("article");
      
      article.className = `flex gap-1 p-2 dark:bg-neutral-700 bg-white dark:text-white shadow-lg transition-all duration-1000 opacity-0 translate-y-5 rounded-md cursor-pointer`;

      article.innerHTML = `
      <div>
        <img loading="lazy"
          src="${news.image_url || "/fff.jpg&text=no-img"}"
          alt="" class="h-22 w-full flex-1 shrink-0 aspect-video object-contain rounded-md" />
      </div>
      <div class="flex-1 p-1 flex flex-col justify-between">
        <p class="line-clamp-2">${news.title}</p>
        <div class="flex justify-between dark:text-white/60 text-black/60 ">
          <p>
            <span class="font-semibold">Category: </span> <span class="text-sm">${news.category[0]}</span>
          </p>
          <p>
            <span class="font-semibold">Date: </span> <span class="text-sm">${news.pubDate}</span>
          </p>
        </div>
      </div>
  `
      frag.append(article);

      setTimeout(() => {
        article.classList.remove("opacity-0", "translate-y-5");
      }, 300 * i);

      article.addEventListener("click", () => {
        renderNewsDetails(newses?.results?.[i]);
        document.body.classList.add("overflow-hidden")
      })

    })
    news_container.append(frag)

  } catch (error) {
    news_container.innerHTML = `<div class="text-2xl h-56 w-full grid place-items-center">No data</div>`
    console.error("error in /news api")
  }
}

if (news_container) {
  let value = 'Breaking'
  renderNews(value.toLowerCase())
  newsCats(value)
}

async function renderNewsDetails(news) {

  const overlay = document.createElement("div");
  // Enhanced Styling with Glassmorphism and better typography
  overlay.className = `fixed inset-0 bg-black/60 backdrop-blur-sm grid place-items-center opacity-0 transition-opacity duration-300 z-50 p-4`;

  overlay.innerHTML = `
  <article class="relative w-full max-w-xl bg-white dark:bg-neutral-900 shadow-2xl rounded-2xl overflow-hidden transform transition-all duration-300 scale-95 opacity-0 translate-y-4 border border-neutral-200 dark:border-neutral-800">
    
    <!-- Close Button -->
    <button id="closebtn" class="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/80 hover:bg-black/60 dark:bg-white/80 dark:hover:bg-white/20 transition-colors text-neutral-800 dark:text-white">
      <svg xmlns="http://www.w3.org" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>

    <!-- Header Image -->
    <div class="relative h-64 w-full overflow-hidden">
      <img src="${news.image_url || 'images/fff.jpg&text=no-img'}" alt="" class="w-full h-full object-cover">
      <div class="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>
      <div class="absolute bottom-4 left-6 right-6">
        <span class="inline-block px-3 py-1 mb-2 text-xs font-bold tracking-wider text-white uppercase bg-blue-600 rounded-md">
          ${news?.category?.[0] || "General"}
        </span>
        <h3 class="text-2xl font-bold leading-tight text-white line-clamp-2">${news?.title || "N/A"}</h3>
      </div>
    </div>

    <!-- Metadata Grid -->
    <div class="p-6 space-y-4">
      <div class="grid grid-cols-2 gap-4 py-4 border-y border-neutral-100 dark:border-neutral-800">
        <div>
          <p class="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Author</p>
          <p class="text-sm font-medium dark:text-neutral-200">${news.creator?.[0] || "Unknown"}</p>
        </div>
        <div>
          <p class="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Published</p>
          <p class="text-sm font-medium dark:text-neutral-200">${news?.pubDate || "Recently"}</p>
        </div>
        <div>
          <p class="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Source</p>
          <p class="text-sm font-medium dark:text-neutral-200 capitalize">${news?.datatype || "Web"}</p>
        </div>
      </div>

      <!-- Description -->
      <div class="max-h-48 overflow-y-auto pr-2 scrollbar-hide">
        <p class="text-neutral-600 dark:text-neutral-400 leading-relaxed text-sm ">
          ${news.description || "No description available for this article."}
        </p>
      </div>
    </div>
  </article>
`;


  document.body.append(overlay)

  const modal = overlay.querySelector("article")
  setTimeout(() => {
    overlay.classList.remove("opacity-0");
    modal.classList.remove("opacity-0", "scale-95", "translate-y-4");
  }, 10);
  function closeModal() {
    overlay.classList.add("opacity-0");
    modal.classList.add("opacity-0", "scale-95", "translate-y-4");
    document.body.classList.remove("overflow-hidden")
    setTimeout(() => {
      overlay.remove();
    }, 300);
  }

  const close = overlay.querySelector("#closebtn");
  close.addEventListener("click", closeModal);
  close.addEventListener("mouseenter", (e) => mouseOver(e, "close", close))

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      closeModal();
    }
  })
}