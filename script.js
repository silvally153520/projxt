const hotels = [
  {
    name: "Phú Quốc Sunset Villa",
    city: "Phú Quốc",
    score: "9.6",
    price: 5500000,
    image: "photo-1571896349842-33c89424de2d",
    badge: "Được yêu thích",
    kind: "Biệt thự",
    category: ["Bãi biển", "Đảo"],
    amenities: ["WiFi miễn phí", "Hồ bơi riêng", "Bãi biển riêng"],
    description: "Nghỉ dưỡng riêng tư bên bờ biển ngập nắng, với hồ bơi riêng và tầm nhìn hoàng hôn tuyệt đẹp."
  },
  {
    name: "Nha Trang Bay Resort",
    city: "Nha Trang",
    score: "9.4",
    price: 4200000,
    image: "photo-1540541338287-41700207dee6",
    badge: "Resort cao cấp",
    kind: "Resort",
    category: ["Bãi biển", "Spa & Relax"],
    amenities: ["WiFi miễn phí", "Hồ bơi vô cực", "Bãi biển riêng"],
    description: "Khu nghỉ dưỡng bên vịnh Nha Trang với hồ bơi vô cực, spa thư giãn và bãi biển riêng."
  },
  {
    name: "The Grand Horizon",
    city: "Đà Nẵng",
    score: "9.2",
    price: 3500000,
    image: "photo-1511818966892-d7d671e672a2",
    badge: "Lựa chọn hàng đầu",
    kind: "Khách sạn",
    category: ["Bãi biển", "Thành phố", "Spa & Relax"],
    amenities: ["WiFi miễn phí", "Hồ bơi", "Spa"],
    description: "Khách sạn hiện đại nằm giữa trung tâm Đà Nẵng và bãi biển Mỹ Khê thơ mộng."
  },
  {
    name: "Hội An Ancient Retreat",
    city: "Hội An",
    score: "9.0",
    price: 2200000,
    image: "photo-1531058020387-3be344556be6",
    badge: "Gần phố cổ",
    kind: "Resort",
    category: ["Di sản", "Spa & Relax"],
    amenities: ["WiFi miễn phí", "Hồ bơi", "Spa"],
    description: "Không gian nghỉ dưỡng yên bình mang kiến trúc phố Hội, chỉ vài phút đến phố cổ."
  },
  {
    name: "Đà Lạt Mountain Lodge",
    city: "Đà Lạt",
    score: "8.8",
    price: 900000,
    image: "photo-1470770841072-f978cf4d019e",
    badge: "Ẩn mình giữa rừng",
    kind: "Biệt thự",
    category: ["Núi & Rừng"],
    amenities: ["WiFi miễn phí", "Lò sưởi", "Vườn"],
    description: "Chốn nghỉ nhỏ xinh giữa rừng thông Đà Lạt, lý tưởng cho những ngày trốn phố."
  },
  {
    name: "Sài Gòn Pearl Hotel",
    city: "Hồ Chí Minh",
    score: "8.7",
    price: 1800000,
    image: "photo-1566073771259-6a8506099945",
    badge: "Vị trí trung tâm",
    kind: "Khách sạn",
    category: ["Thành phố"],
    amenities: ["WiFi miễn phí", "Hồ bơi", "Gym"],
    description: "Điểm dừng chân tiện nghi giữa trung tâm thành phố, gần các điểm tham quan và ẩm thực."
  },
  {
    name: "Hanoi Lotus Suites",
    city: "Hà Nội",
    score: "8.5",
    price: 1500000,
    image: "photo-1564501049412-61c2a3083791",
    badge: "Được đánh giá cao",
    kind: "Khách sạn",
    category: ["Thành phố", "Di sản"],
    amenities: ["WiFi miễn phí", "Nhà hàng", "Dịch vụ phòng"],
    description: "Khám phá nét duyên Hà Nội từ khách sạn boutique ấm cúng ngay gần khu phố cổ."
  },
  {
    name: "Vũng Tàu Ocean View",
    city: "Vũng Tàu",
    score: "8.3",
    price: 1200000,
    image: "photo-1507525428034-b723cf961d3e",
    badge: "Sát biển",
    kind: "Resort",
    category: ["Bãi biển"],
    amenities: ["WiFi miễn phí", "Hồ bơi", "Nhà hàng"],
    description: "Tận hưởng kỳ nghỉ cuối tuần thoải mái với biển xanh ngay trước hiên nhà."
  }
];

const hotelGrid = document.querySelector("#hotel-grid");
const emptyState = document.querySelector("#empty-state");
const destinationInput = document.querySelector("#destination");
const suggestionBox = document.querySelector("#destination-suggestions");
const guestOutput = document.querySelector("#guest-count");
const checkInInput = document.querySelector("#check-in");
const checkOutInput = document.querySelector("#check-out");
const toast = document.querySelector("#toast");
const detailDialog = document.querySelector("#detail-dialog");
const authDialog = document.querySelector("#auth-dialog");
let guestCount = 2;
let selectedCategory = "";
let selectedKind = "";
let toastTimeout;

const imageUrl = (image, width = 720) =>
  `https://images.unsplash.com/${image}?auto=format&fit=crop&w=${width}&q=85`;
const formatPrice = (price) => `${new Intl.NumberFormat("vi-VN").format(price)} ₫`;

function renderHotels(list = hotels) {
  hotelGrid.innerHTML = list.map((hotel) => {
    const index = hotels.indexOf(hotel);
    return `
      <article class="hotel-card">
        <div class="hotel-image-wrap" data-details="${index}" tabindex="0" role="button" aria-label="Xem ${hotel.name}">
          <img class="hotel-image" src="${imageUrl(hotel.image)}" alt="${hotel.name}" loading="lazy" />
          <span class="hotel-badge">${hotel.badge}</span>
          <button class="favorite-button" type="button" data-favorite="${index}" aria-label="Lưu ${hotel.name}" aria-pressed="false">♡</button>
        </div>
        <div class="hotel-info">
          <div class="hotel-title-row"><h3>${hotel.name}</h3><span class="rating">★ ${hotel.score}</span></div>
          <p class="hotel-location"><span aria-hidden="true">⌖</span>${hotel.city}, Việt Nam</p>
          <div class="amenities">${hotel.amenities.map((amenity) => `<span>${amenity}</span>`).join("")}</div>
          <div class="hotel-bottom">
            <div><span class="price-caption">Từ</span><div class="hotel-price">${formatPrice(hotel.price)}<small> /đêm</small></div></div>
            <button class="details-button" type="button" data-details="${index}">Xem chi tiết&nbsp; →</button>
          </div>
        </div>
      </article>`;
  }).join("");
  emptyState.hidden = list.length > 0;
  hotelGrid.hidden = list.length === 0;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  window.clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => toast.classList.remove("visible"), 3200);
}

function applyFilters() {
  const query = destinationInput.value.trim().toLocaleLowerCase("vi");
  const results = hotels.filter((hotel) => {
    const matchesDestination = !query || `${hotel.city} ${hotel.name}`.toLocaleLowerCase("vi").includes(query);
    const matchesCategory = !selectedCategory || hotel.category.includes(selectedCategory);
    const matchesKind = !selectedKind || hotel.kind === selectedKind;
    return matchesDestination && matchesCategory && matchesKind;
  });
  renderHotels(results);
  const filters = [query ? `“${destinationInput.value.trim()}”` : "", selectedCategory, selectedKind].filter(Boolean);
  document.querySelector("#results-caption").textContent = filters.length
    ? `${results.length} chỗ nghỉ phù hợp với ${filters.join(" · ")}`
    : "Được khách hàng đánh giá cao nhất";
  document.querySelector("#hotels-title").textContent = filters.length ? "Kết quả tìm kiếm" : "Khách sạn nổi bật";
}

function selectDestination(city) {
  destinationInput.value = city;
  suggestionBox.classList.remove("is-open");
  applyFilters();
  document.querySelector("#hotels").scrollIntoView({ behavior: "smooth" });
}

function updateCheckoutMinimum() {
  if (!checkInInput.value) return;
  const nextDay = new Date(`${checkInInput.value}T12:00:00`);
  nextDay.setDate(nextDay.getDate() + 1);
  const minimum = `${nextDay.getFullYear()}-${String(nextDay.getMonth() + 1).padStart(2, "0")}-${String(nextDay.getDate()).padStart(2, "0")}`;
  checkOutInput.min = minimum;
  if (checkOutInput.value && checkOutInput.value < minimum) checkOutInput.value = minimum;
}

function openHotelDetails(index) {
  const hotel = hotels[index];
  if (!hotel) return;
  document.querySelector("#dialog-content").innerHTML = `
    <img class="dialog-image" src="${imageUrl(hotel.image, 1000)}" alt="${hotel.name}" />
    <div class="dialog-body">
      <span class="eyebrow">${hotel.kind.toUpperCase()} · ${hotel.city.toUpperCase()}</span>
      <h2 id="dialog-title">${hotel.name}</h2>
      <div class="dialog-meta"><span class="rating">★ ${hotel.score} / 10</span><span>⌖ ${hotel.city}, Việt Nam</span></div>
      <p>${hotel.description}</p>
      <div class="amenities">${hotel.amenities.map((amenity) => `<span>${amenity}</span>`).join("")}</div>
      <div class="dialog-meta"><span>Giá mỗi đêm</span><strong class="dialog-price">${formatPrice(hotel.price)}</strong></div>
      <button class="button dialog-book" type="button">Đặt phòng ngay</button>
    </div>`;
  detailDialog.showModal();
}

function openAuth(mode) {
  const isRegister = mode === "register";
  document.querySelector("#auth-title").textContent = isRegister ? "Tạo tài khoản" : "Đăng nhập";
  document.querySelector(".auth-submit").textContent = isRegister ? "Đăng ký" : "Đăng nhập";
  document.querySelector("#auth-switch").innerHTML = isRegister
    ? "Đã có tài khoản? <strong>Đăng nhập</strong>"
    : "Chưa có tài khoản? <strong>Đăng ký</strong>";
  authDialog.dataset.mode = mode;
  authDialog.showModal();
}

const today = new Date();
const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const tomorrowString = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, "0")}-${String(tomorrow.getDate()).padStart(2, "0")}`;
checkInInput.min = todayString;
checkInInput.value = todayString;
checkOutInput.min = tomorrowString;
checkOutInput.value = tomorrowString;
renderHotels();

document.querySelector("#search-form").addEventListener("submit", (event) => {
  event.preventDefault();
  if (!destinationInput.value.trim()) {
    destinationInput.focus();
    showToast("Hãy nhập điểm đến bạn muốn khám phá.");
    return;
  }
  if (!checkInInput.value || !checkOutInput.value || checkOutInput.value <= checkInInput.value) {
    showToast("Ngày trả phòng phải sau ngày nhận phòng.");
    checkOutInput.focus();
    return;
  }
  selectedCategory = "";
  selectedKind = "";
  document.querySelectorAll(".category-card").forEach((button) => button.classList.remove("active"));
  applyFilters();
  document.querySelector("#hotels").scrollIntoView({ behavior: "smooth" });
});

document.querySelector("#guest-minus").addEventListener("click", () => {
  guestCount = Math.max(1, guestCount - 1);
  guestOutput.value = guestCount;
  guestOutput.textContent = guestCount;
});
document.querySelector("#guest-plus").addEventListener("click", () => {
  guestCount = Math.min(20, guestCount + 1);
  guestOutput.value = guestCount;
  guestOutput.textContent = guestCount;
});
checkInInput.addEventListener("change", updateCheckoutMinimum);

destinationInput.addEventListener("input", () => {
  const query = destinationInput.value.trim().toLocaleLowerCase("vi");
  if (!query) {
    suggestionBox.classList.remove("is-open");
    return;
  }
  const places = [...new Set(hotels.map((hotel) => hotel.city))].filter((city) =>
    city.toLocaleLowerCase("vi").includes(query)
  ).slice(0, 5);
  suggestionBox.innerHTML = places.length
    ? places.map((city) => `<button class="suggestion-option" type="button" role="option" data-suggestion="${city}">⌖ &nbsp;${city}</button>`).join("")
    : `<button class="suggestion-option" type="button" role="option" data-suggestion="${destinationInput.value.trim()}">⌕ &nbsp;Tìm “${destinationInput.value.trim()}”</button>`;
  suggestionBox.classList.add("is-open");
});
destinationInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && suggestionBox.classList.contains("is-open")) {
    const firstOption = suggestionBox.querySelector("[data-suggestion]");
    if (firstOption) {
      event.preventDefault();
      selectDestination(firstOption.dataset.suggestion);
    }
  }
});
document.addEventListener("click", (event) => {
  if (!event.target.closest(".destination-field")) suggestionBox.classList.remove("is-open");
  const favorite = event.target.closest("[data-favorite]");
  if (favorite) {
    event.stopPropagation();
    const isFavorite = favorite.getAttribute("aria-pressed") !== "true";
    favorite.setAttribute("aria-pressed", String(isFavorite));
    favorite.classList.toggle("is-favorite", isFavorite);
    favorite.textContent = isFavorite ? "♥" : "♡";
    showToast(isFavorite ? "Đã lưu chỗ nghỉ vào danh sách yêu thích." : "Đã bỏ chỗ nghỉ khỏi danh sách yêu thích.");
    return;
  }
  const suggestion = event.target.closest("[data-suggestion]");
  if (suggestion) {
    selectDestination(suggestion.dataset.suggestion);
    return;
  }
  const details = event.target.closest("[data-details]");
  if (details) openHotelDetails(Number(details.dataset.details));
});
document.querySelector("#hotel-grid").addEventListener("keydown", (event) => {
  if ((event.key === "Enter" || event.key === " ") && event.target.matches("[data-details][role='button']")) {
    event.preventDefault();
    openHotelDetails(Number(event.target.dataset.details));
  }
});
document.querySelectorAll("[data-destination]").forEach((button) => {
  button.addEventListener("click", () => selectDestination(button.dataset.destination));
});
document.querySelectorAll(".category-card").forEach((button) => {
  button.addEventListener("click", () => {
    const wasActive = button.classList.contains("active");
    document.querySelectorAll(".category-card").forEach((item) => item.classList.remove("active"));
    selectedCategory = wasActive ? "" : button.dataset.category;
    if (!wasActive) button.classList.add("active");
    selectedKind = "";
    applyFilters();
    document.querySelector("#hotels").scrollIntoView({ behavior: "smooth" });
  });
});
document.querySelectorAll(".main-nav [data-kind]").forEach((link) => {
  link.addEventListener("click", () => {
    selectedKind = link.dataset.kind === "Khách sạn" ? "" : link.dataset.kind;
    selectedCategory = "";
    destinationInput.value = "";
    document.querySelectorAll(".category-card").forEach((item) => item.classList.remove("active"));
    applyFilters();
  });
});
document.querySelector("#show-all").addEventListener("click", () => {
  selectedCategory = "";
  selectedKind = "";
  destinationInput.value = "";
  document.querySelectorAll(".category-card").forEach((item) => item.classList.remove("active"));
  applyFilters();
});
document.querySelectorAll("[data-auth]").forEach((button) => button.addEventListener("click", () => openAuth(button.dataset.auth)));
document.querySelector("#auth-switch").addEventListener("click", () => openAuth(authDialog.dataset.mode === "register" ? "login" : "register"));
document.querySelectorAll(".dialog-close").forEach((button) => button.addEventListener("click", () => button.closest("dialog").close()));
document.querySelector("#dialog-content").addEventListener("click", (event) => {
  if (event.target.closest(".dialog-book")) {
    detailDialog.close();
    openAuth("login");
    showToast("Đăng nhập để tiếp tục đặt phòng.");
  }
});
document.querySelector("#auth-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const isRegister = authDialog.dataset.mode === "register";
  authDialog.close();
  event.currentTarget.reset();
  showToast(isRegister ? "Tạo tài khoản thành công! Chào mừng bạn đến LocalVibe." : "Đăng nhập thành công. Chúc bạn có chuyến đi tuyệt vời!");
});
document.querySelector("#newsletter-form").addEventListener("submit", (event) => {
  event.preventDefault();
  event.currentTarget.reset();
  showToast("Cảm ơn bạn! Ưu đãi mới sẽ sớm được gửi đến email.");
});
document.querySelector(".menu-toggle").addEventListener("click", (event) => {
  const menu = document.querySelector(".main-nav");
  const isOpen = menu.classList.toggle("is-open");
  event.currentTarget.setAttribute("aria-expanded", String(isOpen));
});
document.querySelectorAll(".main-nav a").forEach((link) => {
  link.addEventListener("click", () => {
    document.querySelector(".main-nav").classList.remove("is-open");
    document.querySelector(".menu-toggle").setAttribute("aria-expanded", "false");
  });
});
