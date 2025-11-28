// URL Google Sheets CSV
const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR-Iw7Ou8GyhlBVW_aVhj6xPlncGhtMgYBzzHxnCXMkY5-pNp0lAzEXgov7SM8MlrvaKASy0-AQzQk4/pub?output=csv";

async function loadData() {
    const response = await fetch(sheetURL);
    const csv = await response.text();

    const rows = csv.trim().split("\n").map(r => r.split(","));
    const header = rows.shift().map(h => h.trim());

    const data = rows.map(row => {
        let obj = {};
        header.forEach((h, i) => obj[h] = row[i] ? row[i].trim() : "");
        return obj;
    });

    displayProducts(data);
}

function displayProducts(products) {
    const container = document.getElementById("product-list");
    container.innerHTML = "";

    products.forEach(item => {

        // Tentukan warna stok
        let stokClass = "stok-hijau";
        if (parseInt(item.stok) === 0) stokClass = "stok-merah";
        else if (parseInt(item.stok) <= 2) stokClass = "stok-orange";

        const card = document.createElement("div");
        card.className = "product-card";

        card.innerHTML = `
            <img src="${item.gambar}" class="product-image" alt="${item.nama}">
            <h3>${item.nama}</h3>
            <p>Jenis: ${item.jenis}</p>
            <p>Harga: Rp ${item.harga}</p>
            <p class="${stokClass}">Stok: ${item.stok}</p>
        `;

        container.appendChild(card);
    });
}

loadData();
