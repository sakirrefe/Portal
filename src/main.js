import "./style.css";
function setTitle() {
  const today = new Date();

  const day = today.getDate();

  const months = [
    "Ocak","Şubat","Mart","Nisan","Mayıs","Haziran",
    "Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"
  ];

  const month = months[today.getMonth()];

  document.getElementById("title").textContent =
    `${day} ${month} - FLU Kadıköy Beerpong Turnuvası`;
}

setTitle();
let matches = [];
console.log("JS BAĞLANDI");

let participants = [];

const button = document.getElementById("addBtn");
const list = document.getElementById("list");

button.addEventListener("click", addParticipant);

function addParticipant() {
  const input = document.getElementById("nameInput");
  const name = input.value;

  if (name === "") return;

  participants.push(name);
  input.value = "";

  renderList();
}

function renderList() {
  document.getElementById("count").textContent = `Takım Sayısı: ${participants.length}`;
  list.innerHTML = "";

  participants.forEach((p, index) => {
    const li = document.createElement("li");

    // isim
    const span = document.createElement("span");
    span.textContent = p;

    // sil butonu
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "❌";
    deleteBtn.onclick = () => {
      participants.splice(index, 1);
      renderList();
    };

    // düzenle butonu
    const editBtn = document.createElement("button");
    editBtn.textContent = "✏️";
    editBtn.onclick = () => {
      const newName = prompt("Yeni isim:", p);
      if (newName) {
        participants[index] = newName;
        renderList();
      }
    };

    li.style.display = "flex";
li.style.justifyContent = "space-between";
li.style.alignItems = "center";

const left = document.createElement("span");
left.textContent = p;

const right = document.createElement("div");

right.appendChild(editBtn);
right.appendChild(deleteBtn);

li.appendChild(left);
li.appendChild(right);

    list.appendChild(li);
  });
}
const drawBtn = document.getElementById("drawBtn");
const matchList = document.getElementById("matches");

drawBtn.addEventListener("click", drawMatches);

////////////////////////////////
async function drawMatches() {
  const shuffled = [...participants].sort(() => Math.random() - 0.5);

  panel.style.display = "none";
  editBtn.style.display = "inline-block";

  matches = [];
  matchList.innerHTML = "";

  const screen = document.getElementById("drawScreen");
  screen.style.display = "flex";

  const totalMatchCount = Math.ceil(shuffled.length / 2);

  // Önce boş maç slotlarını oluştur
  for (let i = 0; i < totalMatchCount; i++) {
    const li = document.createElement("li");
    li.innerHTML = `
      <div class="match-row">
        <span class="player slot left-slot">...</span>
        <span class="vs">VS</span>
        <span class="player slot right-slot">...</span>
      </div>
    `;
    matchList.appendChild(li);
  }

  // Sonra isimleri tek tek ortaya getirip slotlara yerleştir
  for (let i = 0; i < shuffled.length; i++) {
    const name = shuffled[i];
    const matchIndex = Math.floor(i / 2);
    const isLeft = i % 2 === 0;

    screen.innerHTML = `<div class="draw-name">${name}</div>`;

    await new Promise(res => setTimeout(res, 2200));

    if (!matches[matchIndex]) {
      matches[matchIndex] = {
        p1: null,
        p2: null,
        winner: null
      };
    }

    const li = matchList.children[matchIndex];

    if (isLeft) {
      matches[matchIndex].p1 = name;
      li.querySelector(".left-slot").textContent = name;
    } else {
      matches[matchIndex].p2 = name;
      li.querySelector(".right-slot").textContent = name;
    }
    await new Promise(res => setTimeout(res, 1200));
  }

  // Tek kişi artarsa BAY yap
  if (shuffled.length % 2 !== 0) {
    const lastMatch = matches[matches.length - 1];
    const li = matchList.children[matches.length - 1];

    lastMatch.winner = lastMatch.p1;

    li.innerHTML = `
      <div class="match-row">
        <span class="player winner clickable" data-index="${matches.length - 1}" data-player="1">
          ${lastMatch.p1}
        </span>
        <span class="vs">VS</span>
        <span class="player bay">BAY</span>
      </div>
    `;
  }

  screen.style.display = "none";

  // Tıklanabilir gerçek maçları son haline getir
  matches.forEach((match, index) => {
    if (match.p1 && match.p2) {
      const li = matchList.children[index];
      li.innerHTML = `
        <div class="match-row">
          <span class="player clickable ${match.winner === match.p1 ? "winner" : ""}" data-index="${index}" data-player="1">
            ${match.p1}
          </span>
          <span class="vs">VS</span>
          <span class="player clickable ${match.winner === match.p2 ? "winner" : ""}" data-index="${index}" data-player="2">
            ${match.p2}
          </span>
        </div>
      `;
    }
  });

  enableMatchClicks();
}

///////////////////////////////////////////////////////

function pickWinner(index, player) {
  const match = matches[index];
  match.winner = player === 1 ? match.p1 : match.p2;
  renderMatches();
}
function enableMatchClicks() {
  document.querySelectorAll(".clickable").forEach(el => {
    el.onclick = () => {
      const index = Number(el.dataset.index);
      const player = Number(el.dataset.player);
      pickWinner(index, player);
    };
  });
}

const input = document.getElementById("nameInput");

input.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    addParticipant();
  }
});

function renderMatches() {
  matchList.innerHTML = "";

  matches.forEach((match, index) => {
    const li = document.createElement("li");

    if (!match.p2) {
      li.innerHTML = `
        <div class="match-row">
          <span class="player winner">${match.p1}</span>
          <span class="vs">VS</span>
          <span class="player bay">BAY</span>
        </div>
      `;
      match.winner = match.p1;
    } else {
      li.innerHTML = `
        <div class="match-row">
          <span class="player clickable ${match.winner === match.p1 ? "winner" : ""}" data-index="${index}" data-player="1">
            ${match.p1}
          </span>
          <span class="vs">VS</span>
          <span class="player clickable ${match.winner === match.p2 ? "winner" : ""}" data-index="${index}" data-player="2">
            ${match.p2}
          </span>
        </div>
      `;
    }

    matchList.appendChild(li);
  });

  enableMatchClicks();
}

window.pickWinner = function(index, player) {
  const match = matches[index];

  match.winner = player === 1 ? match.p1 : match.p2;

  renderMatches();
};

const nextRoundBtn = document.getElementById("nextRoundBtn");

nextRoundBtn.addEventListener("click", nextRound);
function nextRound() {
  // tüm maçlar bitmiş mi kontrol
  const allFinished = matches.every(m => m.winner !== null);

  if (!allFinished) {
    alert("Tüm maçların kazananını seç!");
    return;
  }

  const winners = matches.map(m => m.winner).filter(Boolean);

  if (winners.length <= 1) {
    showChampion(winners[0]);
    return;
  }

  // 🔥 BURASI KRİTİK
  participants = [...winners];

  // tekrar kura ama animasyonlu
  drawMatches();
}
const panel = document.getElementById("participantPanel");
const editBtn = document.getElementById("editBtn");
editBtn.addEventListener("click", () => {
  panel.style.display = "block";
});

function showChampion(name) {
  const screen = document.getElementById("championScreen");
  const text = document.getElementById("championName");

  text.textContent = name;
  screen.style.display = "flex";

  screen.onclick = () => {
    screen.style.display = "none";
  };
}