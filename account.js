const accountStorageKeys = {
  accounts: "localvibe.accounts",
  session: "localvibe.session",
  orders: "localvibe.orders"
};
const accountData = {
  accounts: readAccountStorage(accountStorageKeys.accounts, []),
  orders: readAccountStorage(accountStorageKeys.orders, []),
  session: readAccountStorage(accountStorageKeys.session, null)
};
const pageToast = document.querySelector("#page-toast");
let toastTimer;

function readAccountStorage(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    if (stored === null) return fallback;
    const value = JSON.parse(stored);
    if (key !== accountStorageKeys.session && !Array.isArray(value)) {
      throw new Error("Dữ liệu tài khoản không đúng định dạng.");
    }
    if (key === accountStorageKeys.session && value !== null && typeof value !== "string") {
      throw new Error("Phiên đăng nhập không hợp lệ.");
    }
    return value;
  } catch (error) {
    console.error(`Không thể đọc ${key}:`, error);
    return fallback;
  }
}

function saveAccountStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Không thể lưu ${key}:`, error);
    throw new Error("Không thể lưu dữ liệu. Vui lòng kiểm tra bộ nhớ trình duyệt.");
  }
}

function safeText(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

function notify(message) {
  pageToast.textContent = message;
  pageToast.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => pageToast.classList.remove("visible"), 3200);
}

function formatAccountPrice(value) {
  return `${new Intl.NumberFormat("vi-VN").format(value)} ₫`;
}

function formatAccountDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || "")) return "—";
  return new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium", timeZone: "UTC" })
    .format(new Date(`${value}T00:00:00Z`));
}

const currentAccount = accountData.accounts.find((account) => account.email === accountData.session);
if (!currentAccount) {
  if (document.body.dataset.accountPage) {
    window.location.replace(`index.html?auth=login&next=${encodeURIComponent(document.body.dataset.accountPage === "profile" ? "ca-nhan.html" : "don-dat-phong.html")}`);
  } else {
    const actions = document.querySelector("#account-actions");
    actions.innerHTML = `
      <a class="account-link guest-account-link" href="index.html?auth=login">Đăng nhập</a>
      <a class="button button-small" href="index.html?auth=register">Đăng ký</a>`;
    document.querySelector(".main-nav")?.insertAdjacentHTML("beforeend", `
      <a class="mobile-account-link" href="index.html?auth=login">Đăng nhập</a>
      <a class="mobile-account-link" href="index.html?auth=register">Đăng ký</a>`);
  }
} else {
  const accountProfile = currentAccount.profile || {};
  const accountActions = document.querySelector("#account-actions");
  accountActions.innerHTML = `
    <span class="account-name" title="${safeText(currentAccount.name)}">Xin chào, ${safeText(currentAccount.name)}</span>
    <a class="account-link${document.body.dataset.accountPage === "orders" ? " is-active" : ""}" href="don-dat-phong.html">Đơn đặt phòng</a>
    <a class="account-link${document.body.dataset.accountPage === "profile" ? " is-active" : ""}" href="ca-nhan.html">Hồ sơ</a>
    <button class="account-link logout-button" id="account-logout" type="button">Đăng xuất</button>`;
  document.querySelector(".main-nav")?.insertAdjacentHTML("beforeend", `
    <a class="mobile-account-link" href="don-dat-phong.html">Đơn đặt phòng</a>
    <a class="mobile-account-link" href="ca-nhan.html">Hồ sơ cá nhân</a>`);

  document.querySelector("#account-logout").addEventListener("click", () => {
    try {
      saveAccountStorage(accountStorageKeys.session, null);
      window.location.assign("index.html");
    } catch (error) {
      notify(error.message);
    }
  });

  if (document.body.dataset.accountPage === "profile") {
    const profileForm = document.querySelector("#profile-form");
    const phone = document.querySelector("#profile-phone");
    const birthdate = document.querySelector("#profile-birthdate");
    const gender = document.querySelector("#profile-gender");
    const city = document.querySelector("#profile-city");
    const address = document.querySelector("#profile-address");
    const error = document.querySelector("#profile-error");
    document.querySelector("#profile-name").value = currentAccount.name;
    document.querySelector("#profile-email").value = currentAccount.email;
    phone.value = accountProfile.phone || "";
    birthdate.value = accountProfile.birthdate || "";
    gender.value = accountProfile.gender || "";
    city.value = accountProfile.city || "";
    address.value = accountProfile.address || "";
    birthdate.max = new Date().toISOString().slice(0, 10);
    document.querySelector("#profile-avatar").textContent =
      currentAccount.name.trim().charAt(0).toLocaleUpperCase("vi") || "L";
    document.querySelector("#profile-display-name").textContent = currentAccount.name;
    document.querySelector("#profile-display-email").textContent = currentAccount.email;

    profileForm.addEventListener("submit", (event) => {
      event.preventDefault();
      error.hidden = true;
      const name = document.querySelector("#profile-name").value.trim();
      const normalizedPhone = phone.value.trim().replace(/[\s()-]/g, "");
      if (name.length < 2) {
        error.textContent = "Họ và tên cần có ít nhất 2 ký tự.";
        error.hidden = false;
        return;
      }

      const menuToggle = document.querySelector(".menu-toggle");
      menuToggle?.addEventListener("click", () => {
        const menu = document.querySelector(".main-nav");
        const isOpen = menu.classList.toggle("is-open");
        menuToggle.setAttribute("aria-expanded", String(isOpen));
      });
      document.querySelectorAll(".main-nav a").forEach((link) => {
        link.addEventListener("click", () => {
          document.querySelector(".main-nav").classList.remove("is-open");
          menuToggle?.setAttribute("aria-expanded", "false");
        });
      });
      if (normalizedPhone && !/^\+?\d{9,15}$/.test(normalizedPhone)) {
        error.textContent = "Số điện thoại cần có từ 9 đến 15 chữ số.";
        error.hidden = false;
        return;
      }
      const profile = {
        phone: phone.value.trim(),
        birthdate: birthdate.value,
        gender: gender.value,
        city: city.value.trim(),
        address: address.value.trim()
      };
      const previousAccounts = accountData.accounts;
      accountData.accounts = accountData.accounts.map((account) =>
        account.id === currentAccount.id ? { ...account, name, profile } : account
      );
      try {
        saveAccountStorage(accountStorageKeys.accounts, accountData.accounts);
        document.querySelector("#profile-avatar").textContent = name.charAt(0).toLocaleUpperCase("vi");
        document.querySelector("#profile-display-name").textContent = name;
        accountActions.querySelector(".account-name").textContent = `Xin chào, ${name}`;
        notify("Thông tin cá nhân đã được cập nhật.");
      } catch (saveError) {
        accountData.accounts = previousAccounts;
        error.textContent = saveError.message;
        error.hidden = false;
      }
    });
  }

  if (document.body.dataset.accountPage === "orders") {
    const ordersList = document.querySelector("#orders-page-list");
    const userOrders = accountData.orders
      .filter((order) => order.email === currentAccount.email)
      .sort((first, second) => (second.createdAt || "").localeCompare(first.createdAt || ""));
    document.querySelector("#orders-page-count").textContent = `${userOrders.length} đơn đặt phòng`;
    const knownHotels = window.LocalVibeHotels || [];
    ordersList.innerHTML = userOrders.length
      ? userOrders.map((order) => {
        const hotel = knownHotels.find((item) => item.name === order.hotelName) || knownHotels[0];
        const image = hotel?.image || "photo-1566073771259-6a8506099945";
        const canCancel = order.status === "Chờ xác nhận" && order.checkin >= new Date().toISOString().slice(0, 10);
        const statusClass = order.status === "Đã hủy" ? " cancelled" : "";
        return `
          <article class="order-card">
            <img src="https://images.unsplash.com/${image}?auto=format&fit=crop&w=400&q=80" alt="" />
            <div class="order-card-content">
              <div class="order-card-heading">
                <div><h3>${safeText(order.hotelName)}</h3><p class="order-number">Mã đơn ${safeText(order.id)}</p></div>
                <span class="order-status${statusClass}">${safeText(order.status)}</span>
              </div>
              <div class="order-details">
                <span>Nhận phòng <strong>${formatAccountDate(order.checkin)}</strong></span>
                <span>Trả phòng <strong>${formatAccountDate(order.checkout)}</strong></span>
                <span>${safeText(order.fullName)} · ${safeText(order.phone)}</span>
                <span>${safeText(order.contactEmail || order.email)}</span>
                <span>${safeText(order.guests)} khách · ${safeText(order.nights)} đêm</span>
                <span>${safeText(order.payment)}</span>
              </div>
              ${order.note ? `<p class="order-number">Yêu cầu: ${safeText(order.note)}</p>` : ""}
            </div>
            <div class="order-card-footer"><strong>${formatAccountPrice(order.total)}</strong>
              ${canCancel ? `<button class="cancel-order" type="button" data-cancel-order="${safeText(order.id)}">Hủy đơn</button>` : ""}
            </div>
          </article>`;
      }).join("")
      : `<p class="orders-empty">Bạn chưa có đơn đặt phòng nào. <a href="khach-san.html">Khám phá chỗ nghỉ</a> để bắt đầu chuyến đi.</p>`;
    ordersList.addEventListener("click", (event) => {
      const button = event.target.closest("[data-cancel-order]");
      if (!button) return;
      const order = accountData.orders.find((item) =>
        item.id === button.dataset.cancelOrder && item.email === currentAccount.email
      );
      if (!order || order.status !== "Chờ xác nhận" || order.checkin < new Date().toISOString().slice(0, 10)) {
        notify("Đơn này không thể hủy.");
        return;
      }
      if (!window.confirm(`Bạn có chắc muốn hủy đơn ${order.id} không?`)) return;
      const previousOrders = accountData.orders;
      accountData.orders = accountData.orders.map((item) =>
        item.id === order.id ? { ...item, status: "Đã hủy" } : item
      );
      try {
        saveAccountStorage(accountStorageKeys.orders, accountData.orders);
        window.location.reload();
      } catch (error) {
        accountData.orders = previousOrders;
        notify(error.message);
      }
    });
  }
}
