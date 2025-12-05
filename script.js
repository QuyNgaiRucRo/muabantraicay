// script.js

// Dữ liệu sản phẩm 
const products = [
  { id: 1, name: "Chôm chôm Vĩnh Long", price: 48000, img: "TrongNuoc/ChomChom.jpg", desc: "Chôm chôm tróc hạt, vị ngọt đậm đà, cùi dày. Đặc sản Vĩnh Long chính hiệu." },
  { id: 2, name: "Dâu tây Đà Lạt", price: 190000, img: "TrongNuoc/Dau.jpg", desc: "Dâu tây Đà Lạt tươi ngon, hái tại vườn. Vị chua ngọt thanh mát, giàu vitamin." },
  { id: 3, name: "Dừa Bến Tre", price: 15000, img: "TrongNuoc/dua.jpg", desc: "Dừa xiêm xanh Bến Tre nước ngọt lịm, cùi dừa vừa ăn. Giải khát tuyệt vời." },
  { id: 4, name: "Nho xanh Ninh Thuận", price: 100000, img: "TrongNuoc/nho.jpg", desc: "Nho xanh Ninh Thuận giòn, ngọt, không hạt. Chùm to đẹp mắt." },
  { id: 5, name: "Xoài Cát Hòa Lộc", price: 80000, img: "TrongNuoc/xoai.jpg", desc: "Vua của các loại xoài. Xoài Cát Hòa Lộc thơm lừng, thịt vàng ươm, ngọt sắc." },
  { id: 6, name: "Vải thiều Thanh Hà", price: 90000, img: "TrongNuoc/vai.jpg", desc: "Vải thiều hạt nhỏ, cùi dày, mọng nước. Đặc sản nổi tiếng miền Bắc." },
  { id: 7, name: "Thanh Long Bình Thuận", price: 30000, img: "TrongNuoc/thanhlong.jpg", desc: "Thanh long ruột trắng Bình Thuận, vị ngọt thanh, tính mát." },
  { id: 8, name: "Măng cụt Chợ Lách", price: 75000, img: "TrongNuoc/mangcut.jpg", desc: "Măng cụt Chợ Lách múi trắng ngần, ngọt thanh xen lẫn vị chua nhẹ hấp dẫn." },
  { id: 9, name: "Sầu Riêng Ri6", price: 150000, img: "TrongNuoc/saurieng.jpg", desc: "Sầu riêng Ri6 múi vàng hạt lép, béo ngậy, thơm nức mũi."}
];

let cart = [];
let currentProductId = null;
let isTicking = false; 

// ------------------------------------------------------
// CHỨC NĂNG LOCAL STORAGE (QUAN TRỌNG)
// ------------------------------------------------------

/**
 * Lưu dữ liệu giỏ hàng (cart) vào Local Storage.
 * Sẽ được gọi sau mỗi thao tác thêm, giảm, xóa sản phẩm.
 */
function saveCart() {
    // Lưu biến 'cart' dưới dạng chuỗi JSON
    localStorage.setItem('myStoreCart', JSON.stringify(cart));
    // Cập nhật lại giao diện ngay sau khi lưu
    updateCartList(); 
}

/**
 * Tải dữ liệu giỏ hàng từ Local Storage khi trang tải.
 * Sẽ được gọi ở cuối tệp script.
 */
function loadCart() {
    const savedCart = localStorage.getItem('myStoreCart');
    if (savedCart) {
        try {
            // Chuyển chuỗi JSON thành mảng JavaScript và gán cho biến 'cart'
            cart = JSON.parse(savedCart);
        } catch (e) {
            console.error("Lỗi khi tải giỏ hàng từ LocalStorage:", e);
            cart = [];
        }
    }
}


// --- HÀM HIỂN THỊ SẢN PHẨM (Giữ nguyên) ---
function render() {
  const container = document.getElementById('product-list');
  container.innerHTML = ''; 
  products.forEach(p => {
    container.innerHTML += `
      <div class="product-card">
        <img src="${p.img}" class="product-image">
        <div class="product-name">${p.name}</div>
        <div class="product-price">${p.price.toLocaleString('vi-VN')} đ/Kg</div>
        <div class="btn-group">
          <button class="btn btn-view" onclick="openModal(${p.id})">Xem thêm</button>
          <button class="btn btn-add" onclick="quickAdd(${p.id})">Thêm vào giỏ</button>
        </div>
      </div>
    `;
  });
}

// --- HÀM CẬP NHẬT GIỎ HÀNG VÀ VỊ TRÍ (Giữ nguyên logic thang máy, nhưng đã bị bỏ qua) ---
function updateCartList() {
    const cartItemsDiv = document.getElementById('cart-items');
    const totalSpan = document.getElementById('total-price');
    cartItemsDiv.innerHTML = '';
    
    let total = 0;
    
    const groupedCart = {};
    cart.forEach(item => {
        if (!groupedCart[item.id]) {
            groupedCart[item.id] = { ...item, totalQty: 0 };
        }
        groupedCart[item.id].totalQty += item.qty;
    });

    for (const id in groupedCart) {
       const item = groupedCart[id];
       const itemTotal = item.price * item.totalQty;
       total += itemTotal;
       
       cartItemsDiv.innerHTML += `
         <div class="cart-item">
           <span style="font-weight: bold;">${item.name} (x${item.totalQty})</span>
           
           <span style="display:flex; align-items:center;">
             <button style="width:20px; height:20px; border:1px solid #ddd; background:#eee; cursor:pointer;" 
                     onclick="decreaseItem(${item.id})">-</button>
             
             <span style="margin: 0 5px;">${itemTotal.toLocaleString('vi-VN')}đ</span>
             
             <button style="width:20px; height:20px; border:none; background:#ff6347; color:white; border-radius:3px; cursor:pointer;"
                     onclick="removeItem(${item.id})">X</button>
           </span>
         </div>
       `;
    }

    totalSpan.innerText = total.toLocaleString('vi-VN');
    
    const cartSec = document.getElementById('cart-section');
    cartSec.style.display = cart.length > 0 ? 'block' : 'none';
    
    // Nếu có kích hoạt chế độ thang máy, gọi hàm này
    // if (cart.length > 0) { setTimeout(moveCartElevator, 100); }
}


// --- HÀM THAO TÁC GIỎ HÀNG (ĐÃ THÊM saveCart() SAU MỖI THAY ĐỔI) ---
function decreaseItem(id) {
    const index = cart.findIndex(item => item.id === id); 
    if (index !== -1) {
        if (cart[index].qty > 1) {
            cart[index].qty--;
        } else {
            cart.splice(index, 1);
        }
    }
    // GỌI SAVE
    saveCart(); 
}

function removeItem(id) {
    cart = cart.filter(item => item.id !== id);
    // GỌI SAVE
    saveCart();
}

function toggleCart() {
   const cartSec = document.getElementById('cart-section');
   cartSec.style.display = cartSec.style.display === 'none' || cart.length === 0 ? 'block' : 'none';
   if(cart.length === 0 && cartSec.style.display === 'block') {
       alert("Giỏ hàng chưa có sản phẩm nào!");
       cartSec.style.display = 'none';
   }
}


function addToCart(id, quantity) {
  const product = products.find(p => p.id === id);
  const existingItem = cart.find(i => i.id === id);
  
  if (existingItem) {
    existingItem.qty += quantity;
  } else {
    cart.push({ ...product, qty: quantity });
  }
  
  // GỌI SAVE
  saveCart();
}

// --- HÀM POPUP VÀ THANH TOÁN (Giữ nguyên) ---
function openModal(id) {
  const p = products.find(x => x.id === id);
  currentProductId = id;
  
  document.getElementById('m-img').src = p.img;
  document.getElementById('m-name').innerText = p.name;
  document.getElementById('m-price').innerText = p.price.toLocaleString('vi-VN') + 'đ';
  document.getElementById('m-desc').innerText = p.desc;
  document.getElementById('m-qty').value = 1;
  
  const modal = document.getElementById('product-modal');
  
  // Logic cũ của popup đã bỏ qua:
  // const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  // const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  // modal.style.top = scrollTop + 'px'; 
  // modal.style.height = viewportHeight + 'px';
  modal.style.display = 'flex';
}

function closeModal() {
  const modal = document.getElementById('product-modal');
  modal.style.display = 'none';
}

window.onclick = function(event) {
  const modal = document.getElementById('product-modal');
  if (event.target == modal) {
    closeModal(); 
  }
}

function adjustQty(amount) {
  const input = document.getElementById('m-qty');
  let val = parseInt(input.value) + amount;
  if (val < 1) val = 1;
  input.value = val;
}

function quickAdd(id) {
  addToCart(id, 1);
}

function addFromModal() {
  const qty = parseInt(document.getElementById('m-qty').value);
  addToCart(currentProductId, qty);
  closeModal();
}

function checkout() {
  if(cart.length === 0) { alert("Giỏ hàng trống!"); return; }
  
  let message = "Đơn hàng mới:\n";
  let total = 0;
  
  cart.forEach(item => {
     total += item.price * item.qty;
     message += `- ${item.name}: ${item.qty}kg (${(item.price * item.qty).toLocaleString('vi-VN')}đ)\n`;
  });
  
  message += `\nTổng tiền: ${total.toLocaleString('vi-VN')}đ`;
  
  const ZALO_PHONE = '0967745329'; 
  const confirmation = confirm(message + "\n\nBấm OK để gửi qua Zalo.");
  
  if (confirmation) {
    window.open(`https://zalo.me/${ZALO_PHONE}?text=${encodeURIComponent(message)}`, '_blank');
  }
}

// Bắt đầu: Tải giỏ hàng trước, sau đó hiển thị sản phẩm
loadCart(); 

render();
