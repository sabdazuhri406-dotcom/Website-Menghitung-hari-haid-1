const form = document.getElementById("periodForm");
const lastPeriodDateEl = document.getElementById("lastPeriodDate");
const cycleLengthEl = document.getElementById("cycleLength");
const periodLengthEl = document.getElementById("periodLength");
const predictCountEl = document.getElementById("predictCount");

const resultSummary = document.getElementById("resultSummary");
const resultTableBody = document.getElementById("resultTableBody");

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function formatID(date) {
  // Format tanggal Indonesia sederhana (mis. 14 Feb 2026)
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function clearResults() {
  resultTableBody.innerHTML = "";
  resultSummary.innerHTML = `<p class="muted">Isi data lalu tekan <b>Hitung</b>.</p>`;
}

form.addEventListener("reset", () => {
  // reset event terjadi sebelum value bener-bener balik, jadi pakai timeout kecil
  setTimeout(clearResults, 0);
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const lastPeriodValue = lastPeriodDateEl.value;
  const cycleLength = parseInt(cycleLengthEl.value, 10);
  const periodLength = parseInt(periodLengthEl.value, 10);
  const predictCount = parseInt(predictCountEl.value, 10);

  // Validasi sederhana
  if (
    !lastPeriodValue ||
    Number.isNaN(cycleLength) ||
    Number.isNaN(periodLength) ||
    Number.isNaN(predictCount)
  ) {
    resultSummary.textContent = "Mohon isi semua data dengan benar.";
    return;
  }
  if (cycleLength < 20 || cycleLength > 45) {
    resultSummary.textContent =
      "Panjang siklus sebaiknya antara 20–45 hari untuk perhitungan ini.";
    return;
  }
  if (periodLength < 1 || periodLength > 10) {
    resultSummary.textContent = "Lama haid sebaiknya antara 1–10 hari.";
    return;
  }

  const lastStart = new Date(lastPeriodValue + "T00:00:00");

  // Hitung: siklus berikutnya = lastStart + cycleLength
  // Selesai haid = mulai + (periodLength - 1)
  // Ovulasi (opsional) = mulai siklus berikutnya - 14 hari
  resultTableBody.innerHTML = "";

  let firstNextStart = addDays(lastStart, cycleLength);
  const firstNextEnd = addDays(firstNextStart, periodLength - 1);

  resultSummary.innerHTML = `
    <p><b>Perkiraan haid berikutnya:</b> ${formatID(firstNextStart)} – ${formatID(firstNextEnd)}</p>
    <p class="muted">Berdasarkan siklus ${cycleLength} hari dan lama haid ${periodLength} hari.</p>
  `;

  for (let i = 1; i <= predictCount; i++) {
    const start = addDays(lastStart, cycleLength * i);
    const end = addDays(start, periodLength - 1);

    const nextCycleStart = addDays(start, cycleLength);
    const ovulation = addDays(nextCycleStart, -14);

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${i}</td>
      <td>${formatID(start)}</td>
      <td>${formatID(end)}</td>
      <td>${formatID(ovulation)}</td>
    `;
    resultTableBody.appendChild(tr);
  }
});

resultSummary.innerHTML = `
  <p><b>Perkiraan haid berikutnya:</b> ${formatID(firstNextStart)} – ${formatID(firstNextEnd)}</p>
  <p class="muted">Berdasarkan siklus ${cycleLength} hari dan lama haid ${periodLength} hari.</p>
`;

resultSummary.classList.remove("is-updated");
void resultSummary.offsetWidth;
resultSummary.classList.add("is-updated");

// Inisialisasi tampilan
clearResults();
