// Dữ liệu sản phẩm
const products = [
  { id: 1, name: "Chôm chôm Vĩnh Long", price: 48000, img: "https://clv.vn/wp-content/uploads/2019/10/chom-chom-globalgap-min.jpg"},
  { id: 2, name: "Dâu tây Đà Lạt", price: 190000, img: "https://traicayvuongtron.vn/resources/cache/original_xxxxx/WEBSITE%202023/tim%20hieu%20them/blog/kinh%20nghiem%2Cmeo%20vat/trai%20cay/trai%20cay%20dac%20san/daudalatlagi/dau-tay-da-lat.gif"},
  { id: 3, name: "Dừa Bến Tre", price: 15000, img: "https://media.loveitopcdn.com/22928/thumb/dua-xiem-xanh-ben-tre.jpg"},
  { id: 4, name: "Nho xanh Ninh Thuận", price: 100000, img: "https://nongsandungha.com/wp-content/uploads/2024/08/nho-xanh-ninh-thuan.jpg"},
  { id: 5, name: "Xoài Cát Hòa Lộc", price: 80000, img: "https://cdn.tgdd.vn/Files/2017/12/03/1047079/nguon-goc-xoai-cat-hoa-loc-va-cach-chon-xoai-cat-hoa-loc-tuoi-ngon-202302251347125690.jpg"},
  { id: 6, name: "Vải thiều Thanh Hà", price: 90000, img: "https://cdn.tgdd.vn/2021/07/CookProduct/1-1200x676-6.jpg"},
  { id: 7, name: "Thanh Long Bình Thuận", price: 30000, img: "https://thucphamvanquy.com/wp-content/uploads/2019/10/thanh-long-ru%E1%BB%99t-tr%E1%BA%AFng.png"},
  { id: 8, name: "Măng cụt Chợ Lách", price: 75000, img: "https://cdn-images.vtv.vn/zoom/700_438/2019/6/15/photo-2-1500599816327-15269608981031547982463-156057123979899840711.jpg"},
  { id: 9, name: "Sầu Riêng Ri6", price: 150000, img: "https://product.hstatic.net/200000157781/product/sau_rieng_ri6_977b4b436948421fabd583bbd83f2fb8.png"}
];

let cart = [];

// Hàm hiển thị sản phẩm ra màn hình
function renderProducts() {
  const container = document.getElementById('product-list');
  products.forEach(p => {
    const card = `
      <div class="product-card">
        <img src="${p.img}" alt="${p.name}" class="product-image">
        <div class="product-name">${p.name}</div>
        <div class="product-price">${p.price.toLocaleString('vi-VN')} /Kg</div>
        <button class="btn btn-view">Xem thêm</button>
        <button class="btn btn-add" onclick="addToCart(${p.id})">Thêm vào giỏ</button>
      </div>
    `;
    container.innerHTML += card;
  });
}

// Hàm thêm vào giỏ
function addToCart(id) {
  const product = products.find(p => p.id === id);
  cart.push(product);
  updateCart();
  document.getElementById('cart-section').style.display = 'block';
}

// Hàm cập nhật giỏ hàng
function updateCart() {
  const cartItemsDiv = document.getElementById('cart-items');
  const totalSpan = document.getElementById('total-price');
  cartItemsDiv.innerHTML = '';
  
  let total = 0;
  // Gom nhóm sản phẩm giống nhau
  const counts = {};
  cart.forEach(x => { counts[x.name] = (counts[x.name] || 0) + 1; });
  
  // Hiển thị danh sách rút gọn
  for (const [name, count] of Object.entries(counts)) {
     const itemPrice = products.find(p => p.name === name).price;
     total += itemPrice * count;
     cartItemsDiv.innerHTML += `
       <div class="cart-item">
         <span>${name} (x${count})</span>
         <span>${(itemPrice * count).toLocaleString('vi-VN')}đ</span>
       </div>
     `;
  }
  totalSpan.innerText = total.toLocaleString('vi-VN');
}

function toggleCart() {
   const cartSec = document.getElementById('cart-section');
   cartSec.style.display = cartSec.style.display === 'none' ? 'block' : 'none';
}

// Hàm xử lý thanh toán
function checkout() {
  if(cart.length === 0) { alert("Giỏ hàng đang trống!"); return; }
  
  let message = "Tôi muốn đặt mua các món sau:\n";
  const counts = {};
  cart.forEach(x => { counts[x.name] = (counts[x.name] || 0) + 1; });
  
  let total = 0;
  for (const [name, count] of Object.entries(counts)) {
     const itemPrice = products.find(p => p.name === name).price;
     total += itemPrice * count;
     message += `- ${name}: ${count}kg (${(itemPrice * count).toLocaleString('vi-VN')}đ)\n`;
  }
  message += `\nTổng cộng: ${total.toLocaleString('vi-VN')}đ`;
  
  // Tùy chọn 1: Hiển thị thông báo để sao chép
  alert(message + "\n\n(Bạn hãy chụp màn hình hoặc sao chép nội dung này gửi cho cửa hàng nhé!)");

  // Tùy chọn 2: Nếu muốn gửi qua Zalo, bạn có thể mở liên kết (cần số điện thoại cụ thể)
  // window.open(`https://zalo.me/SDT_CUA_BAN?text=${encodeURIComponent(message)}`);
}

// Chạy hàm hiển thị khi tải trang
renderProducts();