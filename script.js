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
const bookingDialog = document.querySelector("#booking-dialog");
const ordersDialog = document.querySelector("#orders-dialog");
let guestCount = 2;
let selectedCategory = "";
let selectedKind = "";
let toastTimeout;
let pendingHotelIndex = null;
const storageKeys = {
  accounts: "localvibe.accounts",
  session: "localvibe.session",
  orders: "localvibe.orders",
  favorites: "localvibe.favorites"
};
let accounts = readStoredValue(storageKeys.accounts, []);
let orders = readStoredValue(storageKeys.orders, []);
let favoriteHotels = readStoredValue(storageKeys.favorites, []);
let currentUserEmail = readStoredValue(storageKeys.session, null);

function readStoredValue(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    if (stored === null) return fallback;
    const value = JSON.parse(stored);
    if (key === storageKeys.accounts && !Array.isArray(value)) throw new Error("Danh sách tài khoản không hợp lệ.");
    if (key === storageKeys.orders && !Array.isArray(value)) throw new Error("Danh sách đơn đặt phòng không hợp lệ.");
    if (key === storageKeys.favorites && !Array.isArray(value)) throw new Error("Danh sách yêu thích không hợp lệ.");
    if (key === storageKeys.session && value !== null && typeof value !== "string") throw new Error("Phiên đăng nhập không hợp lệ.");
    return value;
  } catch (error) {
    console.error(`Không thể đọc dữ liệu ${key}:`, error);
    showToast(`Không thể đọc dữ liệu đã lưu (${key}). Hãy thử tải lại trang.`);
    return fallback;
  }
}

function saveStoredValue(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Không thể lưu dữ liệu ${key}:`, error);
    throw new Error("Không thể lưu dữ liệu vào trình duyệt. Hãy kiểm tra dung lượng lưu trữ.");
  }
}

function getCurrentUser() {
  return accounts.find((account) => account.email === currentUserEmail) || null;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

function bytesToBase64(bytes) {
  return btoa(String.fromCharCode(...new Uint8Array(bytes)));
}

function base64ToBytes(value) {
  return Uint8Array.from(atob(value), (character) => character.charCodeAt(0));
}

async function hashPassword(password, salt) {
  if (!crypto.subtle) throw new Error("Xác thực cần kết nối HTTPS hoặc localhost trên trình duyệt hiện đại.");
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const saltBytes = salt ? base64ToBytes(salt) : crypto.getRandomValues(new Uint8Array(16));
  const hash = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: saltBytes, iterations: 210000, hash: "SHA-256" },
    key,
    256
  );
  return { salt: bytesToBase64(saltBytes), hash: bytesToBase64(hash) };
}

function datesToNights(checkin, checkout) {
  if (!checkin || !checkout) return 0;
  return (Date.parse(`${checkout}T00:00:00Z`) - Date.parse(`${checkin}T00:00:00Z`)) / 86400000;
}

function formatDate(value) {
  return new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium", timeZone: "UTC" })
    .format(new Date(`${value}T00:00:00Z`));
}

function createId() {
  return crypto.randomUUID();
}

function renderAccountActions() {
  const actions = document.querySelector("#account-actions");
  const user = getCurrentUser();
  if (!user) {
    actions.innerHTML = `
      <button class="text-button" type="button" data-auth="login">Đăng nhập</button>
      <button class="button button-small" type="button" data-auth="register">Đăng ký</button>`;
    return;
  }
  actions.innerHTML = `
    <span class="account-name" title="${escapeHtml(user.name)}">Xin chào, ${escapeHtml(user.name)}</span>
    <button class="account-link" type="button" data-orders>Mục đặt phòng</button>
    <button class="account-link logout-button" type="button" data-logout>Đăng xuất</button>`;
}

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
          <button class="favorite-button${favoriteHotels.includes(index) ? " is-favorite" : ""}" type="button" data-favorite="${index}" aria-label="${favoriteHotels.includes(index) ? "Bỏ lưu" : "Lưu"} ${hotel.name}" aria-pressed="${favoriteHotels.includes(index)}">${favoriteHotels.includes(index) ? "♥" : "♡"}</button>
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
      <p class="demo-disclaimer">Giá hiển thị là giá mẫu; tổng tiền tính theo số đêm.</p>
      <button class="button dialog-book" type="button" data-book="${index}">Đặt phòng ngay</button>
    </div>`;
  detailDialog.showModal();
}

function openAuth(mode) {
  const isRegister = mode === "register";
  document.querySelectorAll(".auth-register-field").forEach((field) => {
    field.hidden = !isRegister;
    if (field instanceof HTMLInputElement) field.required = isRegister;
  });
  document.querySelector("#auth-title").textContent = isRegister ? "Tạo tài khoản" : "Đăng nhập";
  document.querySelector(".auth-submit").textContent = isRegister ? "Đăng ký" : "Đăng nhập";
  document.querySelector("#auth-password").autocomplete = isRegister ? "new-password" : "current-password";
  document.querySelector("#auth-switch").innerHTML = isRegister
    ? "Đã có tài khoản? <strong>Đăng nhập</strong>"
    : "Chưa có tài khoản? <strong>Đăng ký</strong>";
  document.querySelector("#auth-error").hidden = true;
  authDialog.dataset.mode = mode;
  authDialog.showModal();
}

function openBooking(index) {
  const hotel = hotels[index];
  const user = getCurrentUser();
  if (!hotel || !user) return;
  pendingHotelIndex = index;
  document.querySelector("#booking-hotel-summary").innerHTML = `
    <img src="${imageUrl(hotel.image, 240)}" alt="" />
    <div><strong>${escapeHtml(hotel.name)}</strong><span>${escapeHtml(hotel.city)} · ${formatPrice(hotel.price)} / đêm</span></div>`;
  document.querySelector("#booking-name").value = user.name;
  document.querySelector("#booking-email").value = user.email;
  document.querySelector("#booking-phone").value = "";
  document.querySelector("#booking-guests").value = guestCount;
  document.querySelector("#booking-check-in").value = checkInInput.value;
  document.querySelector("#booking-check-out").value = checkOutInput.value;
  document.querySelector("#booking-note").value = "";
  document.querySelector("#booking-error").hidden = true;
  updateBookingTotal();
  bookingDialog.showModal();
}

function updateBookingTotal() {
  const hotel = hotels[pendingHotelIndex];
  const checkin = document.querySelector("#booking-check-in").value;
  const checkout = document.querySelector("#booking-check-out").value;
  const nights = datesToNights(checkin, checkout);
  const total = hotel && nights > 0 ? hotel.price * nights : 0;
  document.querySelector("#booking-total").innerHTML =
    `Tổng tiền · ${nights > 0 ? `${nights} đêm` : "Chọn ngày trả phòng"}<strong>${total ? formatPrice(total) : "—"}</strong>`;
}

function startBooking(index) {
  if (!getCurrentUser()) {
    pendingHotelIndex = index;
    detailDialog.close();
    openAuth("login");
    showToast("Đăng nhập hoặc đăng ký để tiếp tục đặt phòng.");
    return;
  }
  detailDialog.close();
  openBooking(index);
}

function renderOrders() {
  const user = getCurrentUser();
  if (!user) return;
  const userOrders = orders
    .filter((order) => order.email === user.email)
    .sort((first, second) => second.createdAt.localeCompare(first.createdAt));
  document.querySelector("#orders-subtitle").textContent =
    `${userOrders.length} đơn đặt phòng · ${user.email}`;
  document.querySelector("#orders-list").innerHTML = userOrders.length
    ? userOrders.map((order) => {
      const canCancel = order.status === "Chờ xác nhận" && order.checkin >= todayString;
      const statusClass = order.status === "Đã hủy" ? " cancelled" : "";
      const hotel = hotels.find((item) => item.name === order.hotelName) || hotels[0];
      return `
        <article class="order-card">
          <img src="${imageUrl(hotel.image, 300)}" alt="" />
          <div class="order-card-content">
            <div class="order-card-heading">
              <div><h3>${escapeHtml(order.hotelName)}</h3><p class="order-number">Mã đơn ${escapeHtml(order.id)}</p></div>
              <span class="order-status${statusClass}">${escapeHtml(order.status)}</span>
            </div>
            <div class="order-details">
              <span>Nhận phòng <strong>${formatDate(order.checkin)}</strong></span>
              <span>Trả phòng <strong>${formatDate(order.checkout)}</strong></span>
              <span>${escapeHtml(order.fullName)} · ${escapeHtml(order.phone)}</span>
              <span>${escapeHtml(order.contactEmail || order.email)}</span>
              <span>${escapeHtml(order.guests)} khách · ${escapeHtml(order.nights)} đêm</span>
              <span>${escapeHtml(order.payment)}</span>
            </div>
            ${order.note ? `<p class="order-number">Yêu cầu: ${escapeHtml(order.note)}</p>` : ""}
          </div>
          <div class="order-card-footer"><strong>${formatPrice(order.total)}</strong>
            ${canCancel ? `<button class="cancel-order" type="button" data-cancel-order="${escapeHtml(order.id)}">Hủy đơn</button>` : ""}
          </div>
        </article>`;
    }).join("")
    : `<p class="orders-empty">Bạn chưa có đơn đặt phòng nào. Chọn chỗ nghỉ yêu thích để bắt đầu chuyến đi nhé.</p>`;
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
document.querySelector("#booking-check-in").min = todayString;
document.querySelector("#booking-check-in").value = todayString;
document.querySelector("#booking-check-out").min = tomorrowString;
document.querySelector("#booking-check-out").value = tomorrowString;
renderHotels();
renderAccountActions();

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
document.querySelector("#booking-check-in").addEventListener("change", () => {
  const checkin = document.querySelector("#booking-check-in").value;
  const checkout = document.querySelector("#booking-check-out");
  if (checkin) {
    const minimum = new Date(`${checkin}T12:00:00`);
    minimum.setDate(minimum.getDate() + 1);
    checkout.min = `${minimum.getFullYear()}-${String(minimum.getMonth() + 1).padStart(2, "0")}-${String(minimum.getDate()).padStart(2, "0")}`;
    if (checkout.value && checkout.value < checkout.min) checkout.value = checkout.min;
  }
  updateBookingTotal();
});
document.querySelector("#booking-check-out").addEventListener("change", updateBookingTotal);
document.querySelector("#booking-guests").addEventListener("input", updateBookingTotal);

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
    const hotelIndex = Number(favorite.dataset.favorite);
    const previousFavorites = favoriteHotels;
    favoriteHotels = isFavorite
      ? [...new Set([...favoriteHotels, hotelIndex])]
      : favoriteHotels.filter((index) => index !== hotelIndex);
    try {
      saveStoredValue(storageKeys.favorites, favoriteHotels);
      favorite.setAttribute("aria-pressed", String(isFavorite));
      favorite.setAttribute("aria-label", `${isFavorite ? "Bỏ lưu" : "Lưu"} ${hotels[hotelIndex].name}`);
      favorite.classList.toggle("is-favorite", isFavorite);
      favorite.textContent = isFavorite ? "♥" : "♡";
      showToast(isFavorite ? "Đã lưu chỗ nghỉ vào danh sách yêu thích." : "Đã bỏ chỗ nghỉ khỏi danh sách yêu thích.");
    } catch (error) {
      favoriteHotels = previousFavorites;
      showToast(error.message);
    }
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
document.querySelector("#auth-switch").addEventListener("click", () => openAuth(authDialog.dataset.mode === "register" ? "login" : "register"));
document.querySelectorAll(".dialog-close").forEach((button) => button.addEventListener("click", () => button.closest("dialog").close()));
authDialog.addEventListener("close", () => {
  if (!getCurrentUser()) pendingHotelIndex = null;
});
bookingDialog.addEventListener("close", () => {
  pendingHotelIndex = null;
});
document.querySelector("#dialog-content").addEventListener("click", (event) => {
  const bookButton = event.target.closest("[data-book]");
  if (bookButton) startBooking(Number(bookButton.dataset.book));
});
document.querySelector("#auth-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const isRegister = authDialog.dataset.mode === "register";
  const form = event.currentTarget;
  const errorOutput = document.querySelector("#auth-error");
  const submitButton = document.querySelector(".auth-submit");
  errorOutput.hidden = true;
  submitButton.disabled = true;
  try {
    const email = document.querySelector("#auth-email").value.trim().toLowerCase();
    const password = document.querySelector("#auth-password").value;
    if (isRegister) {
      const name = document.querySelector("#auth-name").value.trim();
      const confirmPassword = document.querySelector("#auth-confirm-password").value;
      if (name.length < 2) throw new Error("Họ và tên cần có ít nhất 2 ký tự.");
      if (password !== confirmPassword) throw new Error("Mật khẩu nhập lại chưa khớp.");
      if (accounts.some((account) => account.email === email)) {
        throw new Error("Email này đã có tài khoản. Hãy đăng nhập hoặc dùng email khác.");
      }
      const { salt, hash } = await hashPassword(password);
      const previousAccounts = accounts;
      accounts = [...accounts, { id: createId(), name, email, salt, passwordHash: hash, createdAt: new Date().toISOString() }];
      try {
        saveStoredValue(storageKeys.accounts, accounts);
      } catch (error) {
        accounts = previousAccounts;
        throw error;
      }
    } else {
      const account = accounts.find((item) => item.email === email);
      if (!account) throw new Error("Email hoặc mật khẩu không chính xác.");
      const { hash } = await hashPassword(password, account.salt);
      const submittedBytes = base64ToBytes(hash);
      const savedBytes = base64ToBytes(account.passwordHash);
      let difference = submittedBytes.length ^ savedBytes.length;
      for (let index = 0; index < Math.min(submittedBytes.length, savedBytes.length); index += 1) {
        difference |= submittedBytes[index] ^ savedBytes[index];
      }
      if (difference !== 0) throw new Error("Email hoặc mật khẩu không chính xác.");
    }
    saveStoredValue(storageKeys.session, email);
    currentUserEmail = email;
    renderAccountActions();
    authDialog.close();
    form.reset();
    showToast(isRegister ? "Tạo tài khoản thành công. Chào mừng bạn đến LocalVibe!" : "Đăng nhập thành công.");
    if (pendingHotelIndex !== null) {
      openBooking(pendingHotelIndex);
    }
  } catch (error) {
    errorOutput.textContent = error.message || "Không thể hoàn tất xác thực. Vui lòng thử lại.";
    errorOutput.hidden = false;
  } finally {
    submitButton.disabled = false;
  }
});
document.querySelector("#booking-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const hotel = hotels[pendingHotelIndex];
  const user = getCurrentUser();
  const errorOutput = document.querySelector("#booking-error");
  errorOutput.hidden = true;
  if (!hotel || !user) {
    bookingDialog.close();
    openAuth("login");
    showToast("Vui lòng đăng nhập để đặt phòng.");
    return;
  }
  const checkin = document.querySelector("#booking-check-in").value;
  const checkout = document.querySelector("#booking-check-out").value;
  const guests = Number(document.querySelector("#booking-guests").value);
  const phone = document.querySelector("#booking-phone").value.trim();
  const normalizedPhone = phone.replace(/[\s()-]/g, "");
  const nights = datesToNights(checkin, checkout);
  if (checkin < todayString || nights < 1 || !Number.isInteger(guests) || guests < 1 || guests > 20) {
    errorOutput.textContent = "Kiểm tra ngày nhận/trả phòng và số khách trước khi tiếp tục.";
    errorOutput.hidden = false;
    return;
  }
  if (!/^\+?\d{9,15}$/.test(normalizedPhone)) {
    errorOutput.textContent = "Số điện thoại cần có từ 9 đến 15 chữ số.";
    errorOutput.hidden = false;
    return;
  }
  const order = {
    id: `LV-${createId().slice(0, 8).toUpperCase()}`,
    userId: user.id,
    email: user.email,
    hotelName: hotel.name,
    city: hotel.city,
    image: hotel.image,
    pricePerNight: hotel.price,
    checkin,
    checkout,
    nights,
    guests,
    fullName: document.querySelector("#booking-name").value.trim(),
    phone,
    contactEmail: document.querySelector("#booking-email").value.trim().toLowerCase(),
    payment: document.querySelector("#booking-payment").value,
    note: document.querySelector("#booking-note").value.trim(),
    total: hotel.price * nights,
    status: "Chờ xác nhận",
    createdAt: new Date().toISOString()
  };
  const previousOrders = orders;
  orders = [...orders, order];
  try {
    saveStoredValue(storageKeys.orders, orders);
    bookingDialog.close();
    pendingHotelIndex = null;
    document.querySelector("#booking-form").reset();
    renderOrders();
    ordersDialog.showModal();
    showToast(`Đã tạo yêu cầu đặt phòng ${order.id}.`);
  } catch (error) {
    orders = previousOrders;
    errorOutput.textContent = error.message;
    errorOutput.hidden = false;
  }
});
document.addEventListener("click", (event) => {
  const authButton = event.target.closest("[data-auth]");
  if (authButton) {
    openAuth(authButton.dataset.auth);
    return;
  }
  if (event.target.closest("[data-orders]")) {
    renderOrders();
    ordersDialog.showModal();
    return;
  }
  if (event.target.closest("[data-logout]")) {
    const previousEmail = currentUserEmail;
    currentUserEmail = null;
    try {
      saveStoredValue(storageKeys.session, null);
      renderAccountActions();
      showToast("Bạn đã đăng xuất khỏi LocalVibe.");
    } catch (error) {
      currentUserEmail = previousEmail;
      showToast(error.message);
    }
  }
});
document.querySelector("#orders-list").addEventListener("click", (event) => {
  const cancelButton = event.target.closest("[data-cancel-order]");
  if (!cancelButton) return;
  const order = orders.find((item) => item.id === cancelButton.dataset.cancelOrder && item.email === currentUserEmail);
  if (!order || order.status !== "Chờ xác nhận" || order.checkin < todayString) {
    showToast("Đơn này không thể hủy.");
    return;
  }
  if (!window.confirm(`Bạn có chắc muốn hủy đơn ${order.id} không?`)) return;
  const previousOrders = orders;
  orders = orders.map((item) => item.id === order.id ? { ...item, status: "Đã hủy" } : item);
  try {
    saveStoredValue(storageKeys.orders, orders);
    renderOrders();
    showToast(`Đã hủy đơn ${order.id}.`);
  } catch (error) {
    orders = previousOrders;
    showToast(error.message);
  }
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
