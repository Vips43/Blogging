const navItems = document.getElementById("navItems");

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
