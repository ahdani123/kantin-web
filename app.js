// URL Google Sheets CSV
const sheetURL =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vR-Iw7Ou8GyhlBVW_aVhj6xPlncGhtMgYBzzHxnCXMkY5-pNp0lAzEXgov7SM8MlrvaKASy0-AQzQk4/pub?output=csv";

let allProducts = [];

// ============================
//  CEK CACHE TERLEBIH DAHULU
// ============================
async function loadData() {

    let cache = localStorage.getItem("kantinData");
    if (cache) {
        console.log("Memuat dari cache...");
        allProducts = JSON.parse(cache);
        applyFilters(); // langsung tampil
    }

    // Tetap ambil data terbaru dari Google Sheets di background
    const response = await fetch(sheetURL);
    const csv = await response.text();

    const rows = csv.trim().split("\n").map(r => r.split(","));
    const header = rows.shift().map(h => h.trim().toLowerCase());

    allProducts = rows.map(row => {
        let obj = {};
        header.forEach((h, i) => obj[h] = row[i] ? row[i].trim() : "");
        return obj;
    });

    // Simpan ke cache (update data lama)
    localStorage.setItem("kantinData", JSON.stringify(allProducts));

    applyFilters();
}

// ============================
//  FILTER LOGIC
// ============================
function applyFilters() {
    const hargaFilter = document.getElementById("filter-harga").value;
    const jenisFilter = document.getElementById("filter-jenis").value;

    let filtered = allProducts;

    if (hargaFilter !== "") {
        filtered = filtered.filter(p => p.harga === hargaFilter);
    }

    if (jenisFilter !== "") {
        filtered = filtered.filter(p => p.jenis.toLowerCase() === jenisFilter.toLowerCase());
    }

    displayProducts(filtered);
}

// ============================
//  TAMPILKAN PRODUK
// ============================
function displayProducts(products) {
    const container = document.getElementById("product-list");
    container.innerHTML = "";

    products.forEach(item => {

        // Warna stok
        let stokClass = "stok-hijau";
        if (parseInt(item.stok) === 0) stokClass = "stok-merah";
        else if (parseInt(item.stok) <= 2) stokClass = "stok-orange";

        const card = document.createElement("div");
        card.className = "product-card";

        card.innerHTML = `
            <img src="${item.gambar}" loading="lazy" class="product-image" alt="${item.nama}">
            <h3>${item.nama}</h3>
            <p>Jenis: ${item.jenis}</p>
            <p>Harga: Rp ${item.harga}</p>
            <p class="${stokClass}">Stok: ${item.stok}</p>
        `;

        container.appendChild(card);
    });
}

// ============================
//  EVENT LISTENER FILTER
// ============================
document.getElementById("filter-harga").addEventListener("change", applyFilters);
document.getElementById("filter-jenis").addEventListener("change", applyFilters);

loadData();
