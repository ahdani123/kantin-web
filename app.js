const sheetURL =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vR-Iw7Ou8GyhlBVW_aVhj6xPlncGhtMgYBzzHxnCXMkY5-pNp0lAzEXgov7SM8MlrvaKASy0-AQzQk4/pub?output=csv";

let allProducts = [];

async function loadData() {
    const response = await fetch(sheetURL);
    const csv = await response.text();

    const rows = csv.trim().split("\n").map(r => r.split(","));
    const header = rows.shift().map(h => h.trim());

    allProducts = rows.map(row => {
        let obj = {};
        header.forEach((h, i) => obj[h] = row[i] ? row[i].trim() : "");
        return obj;
    });

    applyFilters();
}

function applyFilters() {
    const hargaFilter = document.getElementById("filter-harga").value;
    const jenisFilter = document.getElementById("filter-jenis").value;
    const search = document.getElementById("search").value.toLowerCase();

    let filtered = allProducts;

    if (hargaFilter) filtered = filtered.filter(p => p.harga === hargaFilter);
    if (jenisFilter) filtered = filtered.filter(p => p.jenis.toLowerCase() === jenisFilter.toLowerCase());
    if (search) filtered = filtered.filter(p => p.nama.toLowerCase().includes(search));

    displayProducts(filtered);
}

function displayProducts(products) {
    const container = document.getElementById("product-list");
    container.innerHTML = "";

    products.forEach(item => {
        let stokClass = "stok-hijau";
        if (item.stok === "0") stokClass = "stok-merah";
        else if (parseInt(item.stok) <= 5) stokClass = "stok-orange";

        const card = document.createElement("div");
        card.className = "product-card";
        card.innerHTML = `
            <img src="${item.gambar}" class="product-image">
            <h3>${item.nama}</h3>
            <p>${item.jenis}</p>
            <p>Harga: Rp ${item.harga}</p>
            <p class="${stokClass}">Stok: ${item.stok}</p>
        `;
        container.appendChild(card);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("search").addEventListener("input", applyFilters);
    document.getElementById("filter-harga").addEventListener("change", applyFilters);
    document.getElementById("filter-jenis").addEventListener("change", applyFilters);

    document.getElementById("dark-toggle").addEventListener("click", () => {
        document.body.classList.toggle("dark");
    });
});

loadData();
