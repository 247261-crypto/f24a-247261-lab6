const box = document.getElementById("box");
const line = document.getElementById("line");
const card = document.getElementById("card");
const slip = document.getElementById("slip");
const foundEl = document.getElementById("found");
const dearestEl = document.getElementById("dearest");

// item name -> { times, price }
const seen = {};

function showSlip() {
  slip.innerHTML = "";
  let dearest = 0;
  const names = Object.keys(seen);
  names.forEach(function (name) {
    const row = document.createElement("tr");
    const a = document.createElement("td");
    const b = document.createElement("td");
    a.textContent = name;
    b.textContent = seen[name].times;
    row.appendChild(a);
    row.appendChild(b);
    slip.appendChild(row);
    if (seen[name].price > dearest) dearest = seen[name].price;
  });
  foundEl.textContent = names.length;
  dearestEl.textContent = dearest;
}

async function find() {
  line.textContent = "Loading…";
  card.textContent = "";
  try {
    const res = await fetch("/api/price?item=" + encodeURIComponent(box.value));
    const data = await res.json();
    if (res.ok) {
      card.innerHTML = "";
      const name = document.createElement("strong");
      name.textContent = data.item;
      const price = document.createElement("span");
      price.textContent = data.price;
      card.appendChild(name);
      card.appendChild(price);
      if (seen[data.item]) {
        seen[data.item].times = seen[data.item].times + 1;
      } else {
        seen[data.item] = { times: 1, price: data.price };
      }
      showSlip();
      line.textContent = data.item + " " + data.price;
    } else {
      // 404: the card stays blank and the slip is left alone.
      // The line shows the price field, which a 404 reply does not have.
      line.textContent = String(data.price);
    }
  } catch (err) {
    line.textContent = "The server is not answering";
  }
}

document.getElementById("find").addEventListener("click", find);
box.addEventListener("keydown", function (e) {
  if (e.key === "Enter") find();
});