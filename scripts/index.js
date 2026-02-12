import { renderNews } from "./script.js";

const navItems = document.getElementById("navItems");
const newsCatUL = document.getElementById("newsCatUL");

const home = window.location.origin
const about = "pages/about.html"
const contact = "pages/contact.html"


function navFunc() {
  navItems.innerHTML = ``
  const navLis = [{ name: 'home', location: home }, { name: 'about', location: about }, { name: 'contact me', location: contact }];
  navLis.forEach(item => {
    const li = document.createElement("li");
    li.innerText = item.name;
    navItems.append(li)
    li.addEventListener("click", () => {
      home === home ? "" : home
      window.location.assign(
        new URL(item.location, location))
    })
  })
}
if (navItems) navFunc();

const newsCategory = ["Breaking", 'Business', "Crime", "Domestic", "Education", "Entertainment", "Food", "Health", "Lifestyle", "Politics", "Sports", "Technology",];
export let selectedCat = "food";

export function newsCats(value) {
  const frag = document.createDocumentFragment();
  newsCategory.forEach(cat => {
    const bgClass = value === cat ? "bg-black text-white" : "bg-yellow-950"
    console.log(bgClass)
    const li = document.createElement("li");

    li.className = `li shrink-0 text-sm px-3 py-1 ${bgClass} rounded-full hover:bg-black hover:text-white`;
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