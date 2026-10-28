const kind = document.body.dataset.catalogKind;
const kindName = kind || "Khách sạn";
const items = window.LocalVibeHotels.filter((hotel) => hotel.kind === kind);
const grid = document.querySelector("#catalog-grid");
const formatPrice = (price) => `${new Intl.NumberFormat("vi-VN").format(price)} ₫`;
const imageUrl = (image) => `https://images.unsplash.com/${image}?auto=format&fit=crop&w=800&q=85`;
const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
})[character]);

document.querySelector("#catalog-count").textContent = `${items.length} chỗ nghỉ được chọn lọc`;
grid.innerHTML = items.map((hotel) => {
  const index = window.LocalVibeHotels.indexOf(hotel);
  return `
    <article class="hotel-card">
      <a class="hotel-image-wrap catalog-image" href="index.html?hotel=${index}#hotels" aria-label="Xem ${escapeHtml(hotel.name)}">
        <img class="hotel-image" src="${imageUrl(hotel.image)}" alt="${escapeHtml(hotel.name)}" loading="lazy" />
        <span class="hotel-badge">${escapeHtml(hotel.badge)}</span>
      </a>
      <div class="hotel-info">
        <div class="hotel-title-row"><h3>${escapeHtml(hotel.name)}</h3><span class="rating">★ ${escapeHtml(hotel.score)}</span></div>
        <p class="hotel-location"><span aria-hidden="true">⌖</span>${escapeHtml(hotel.city)}, Việt Nam</p>
        <p class="catalog-description">${escapeHtml(hotel.description)}</p>
        <div class="amenities">${hotel.amenities.map((amenity) => `<span>${escapeHtml(amenity)}</span>`).join("")}</div>
        <div class="hotel-bottom">
          <div><span class="price-caption">Từ</span><div class="hotel-price">${formatPrice(hotel.price)}<small> /đêm</small></div></div>
          <a class="details-button catalog-details" href="index.html?hotel=${index}#hotels">Xem chi tiết&nbsp; →</a>
        </div>
      </div>
    </article>`;
}).join("");
document.querySelector("#catalog-heading").textContent = kindName;
