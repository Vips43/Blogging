import { renderNews } from "./news.js";

const newsCatUL = document.getElementById("newsCatUL");

// 1. Corrected variable declarations with proper quotes
const home = "/index.html";
const about = "/pages/about.html";
const contact = "/pages/contact.html";
const news = "/pages/news.html";

const navLis = [
  { name: "Home", location: home },
  {
    name: "Provides",
    children: [
      { name: "News", location: news },
      { name: "Jyotirlinga", location: "/pages/jyotirlinga.html" }
    ]
  },
  { name: "About", location: about },
  { name: "Contact Me", location: contact },
];

const activeRoute = window.location.pathname;

// 2. Optimized navigation function
function navFunc() {
  const navItems = document.getElementById("navItems"); // Ensure ID exists
  if (!navItems) return;

  navItems.innerHTML = ""; // Clear existing content

  navLis.forEach(item => {
    const isActiveTab = activeRoute === item.location || (item.location === "/" && activeRoute === "/index.html");

    const li = document.createElement("li");
    li.className = `space-x-1 ${isActiveTab ? "bg-white text-black" : ""} nav-item select-none`;
    li.innerHTML = `<span>${item.name}</span>${item.children ? `<span><i class="fa-solid fa-chevron-down text-sm"></i></span>` : `<span></span>`}`;

    if (item.children) {
      const ul = document.createElement("ul");
      ul.className = "dropdown";
      item.children.forEach(child => {
        const childLi = document.createElement("li");
        childLi.textContent = child.name;
        childLi.onclick = (e) => {
          e.stopPropagation();
          window.location.href = child.location;
        };
        ul.append(childLi);
      });
      li.append(ul);
      li.onclick = (e) => { e.stopPropagation; ul.classList.toggle("active") }
      document.addEventListener("click", (e) => {
        if (!li.contains(e.target)) {
          ul.classList.remove("active")
        }
      })
    } else {
      li.onclick = () => window.location.href = item.location;
    }

    navItems.append(li);
  });
}

// 3. Corrected Mobile Toggle logic
function mobileButton() {
  const mob_btn = document.getElementById("mob_btn");
  const mobileNavItems = document.getElementById("mobileNavItems");

  if (!mob_btn || !mobileNavItems) return;

  mob_btn.addEventListener("click", () => {
    mobileNavItems.classList.toggle("translate-x-96"); // Cleaner than manual if/else
  });
  mobileNavItems.innerHTML = navLis
    .map(item => {
      if (item.children) {
        return `
          <li class="mobile-parent cursor-pointer p-2 hover:bg-neutral-700">
            <div class="flex justify-center gap-2 items-center">
              <span>${item.name}</span>
              <i class="fa-solid fa-chevron-down transition-transform duration-300"></i>
            </div>
            <ul class="mobile-sub hidden bg-neutral-600 pl-4">
              ${item.children
            .map(
              ch => `
                <li class="p-2 hover:bg-neutral-500"
                    onclick="navigateTo('${ch.location}')">
                  ${ch.name}
                </li>`
            )
            .join("")}
            </ul>
          </li>
        `;
      } else {
        return `
          <li class="cursor-pointer p-2 hover:bg-neutral-700"
              onclick="navigateTo('${item.location}')">
            ${item.name}
          </li>
        `;
      }
    })
    .join("");
  const parents = mobileNavItems.querySelectorAll(".mobile-parent");

  parents.forEach(parent => {
    parent.addEventListener("click", (e) => {
      e.stopPropagation();
      const sub = parent.querySelector(".mobile-sub");
      const icon = parent.querySelector("i");

      sub.classList.toggle("hidden");
      icon.classList.toggle("rotate-180");
    });
  });

}
window.navigateTo = function (location) {
  if (location) {
    window.location.href = location;
  }
};

// Initialize
navFunc();
mobileButton();


export const newsCategory = ["Breaking", 'Business', "Crime", "Domestic", "Education", "Entertainment", "Food", "Health", "Lifestyle", "Politics", "Sports", "Technology",];

export function newsCats(value) {
  const frag = document.createDocumentFragment();
  newsCategory.forEach(cat => {
    const bgClass = value === cat ? "bg-black text-white" : "bg-yellow-950"

    const li = document.createElement("li");

    li.className = `li shrink-0 text-sm px-3 py-1 ${bgClass} rounded-full hover:bg-black hover:text-white select-none`;
    li.textContent = cat;
    frag.append(li)
    li.addEventListener("click", () => {
      document.querySelectorAll(".li").forEach(el => {
        el.classList.remove("bg-black", "text-white");
        el.classList.add("bg-yellow-950");
      })

      li.classList.remove("bg-yellow-950");
      li.classList.add("bg-black", "text-white");
      renderNews(cat.toLowerCase())
    })
  })
  newsCatUL.append(frag);
}

export function useState(val) {
  selectedCat = val;
  // return value;
}

export function pageLoader() {
  const div = document.createElement("div");
  div.className = `fixed inset-0 flex flex-col justify-center items-center h-screen w-full bg-white/60 dark:bg-black/60 z-[9999]`;
  div.innerHTML = `<div class="w-12 h-12 rounded-full border-4 border-black border-b-transparent dark:border-b-transparent dark:border-white animate-spin"></div> <span class="capitalize text-2xl">welcome to my blog</span>`
  if (document.body) {
    document.body.append(div);
  } else {
    document.addEventListener("DOMContentLoaded", () => document.body.append(div));
  }
  return div;
}

export function matchStatus(match) {
  const isLive = match.matchStarted && !match.matchEnded;
  const isUpcoming = !match.matchStarted && !match.matchEnded;

  const statusText = isLive
    ? "Live"
    : isUpcoming
      ? "Upcoming"
      : "Ended";

  const statusColor = isLive
    ? "text-green-600"
    : isUpcoming
      ? "text-yellow-500"
      : "text-red-600";

  return { statusText, statusColor };
}

export function mouseOver(e, text = "close", element) {
  const span = document.createElement("span");
  span.className = "fixed rounded-lg text-sm dark:bg-black bg-white py-0.5 px-2 dark:text-white text-black transition-all z-90";
  span.textContent = text

  span.style.left = `${e.clientX + 10}px`
  span.style.top = `${e.clientY + 10}px`
  document.body.append(span);

  setTimeout(() => {
    span.remove()
  }, 1000);

  element.addEventListener("mouseleave", () => span.remove(), { once: true })
}