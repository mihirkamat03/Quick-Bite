let slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");
  if (n > 3) { slideIndex = 1 }
  if (n < 1) { slideIndex = slides.length }
  for (i = 0; i < 3; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < 3; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex - 1].style.display = "block";
  dots[slideIndex - 1].className += " active";
}



const btn = document.querySelector('.order-now-redirect');
const food2 = document.querySelector('.slider-food-2');

btn.addEventListener('mouseenter', () => {
  food2.style.animation = "curve-out-2 1s ease-in-out forwards";

  // after animation end → hide it
  food2.addEventListener('animationend', () => {
    food2.style.display = "none";
  }, { once: true });
});



// document.getElementById('order-now-redirect').addEventListener('click', function () {
//   var onboard = document.getElementById('main-category');
//   onboard.style.transform = 'translate(50px, 20px)';
// });

document.querySelector(".order-now-redirect").addEventListener("click", () => {
  let text = document.querySelector("text2", "text1", "text3");
  text.classList.remove("animate"); // reset
  void text.offsetWidth; // force reflow (so animation replays)
  text.classList.add("animate");
});


const x = document.getElementById("filter");

x.addEventListener("click", () => {
  if (x.style.backgroundColor === "white") {
    x.style.backgroundColor = "red";
  } else {
    x.style.backgroundColor = "white";
  }
});


x.addEventListener("click", () => {
  x.classList.toggle("active");
});




const firebaseConfig = {
  apiKey: "AIzaSyD-meHFhL3uq4wNJDL7fa5GsykIgx7BDoE",
  authDomain: "quick-bite-897b1.firebaseapp.com",
  databaseURL: "https://quick-bite-897b1-default-rtdb.firebaseio.com",
  projectId: "quick-bite-897b1",
  storageBucket: "quick-bite-897b1.firebasestorage.app",
  messagingSenderId: "774517134479",
  appId: "1:774517134479:web:c474786e46bd8ca38b4cfa",
  measurementId: "G-1041GMYLQX"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Form submit
document.querySelector(".talk").addEventListener("click", function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const query = document.getElementById("query").value;

  db.ref("queries").phone({
    email: email,
    phone: phone,
    query: query
  }).then(() => {
    alert("Submitted!");
  }).catch((err) => {
    console.error(err);
  });
});


document.addEventListener('DOMContentLoaded', () => {
  const card = document.querySelector('.product-card-cat');
  const foodTypes = document.querySelector('.food-types');

  card.addEventListener('click', () => {
    foodTypes.style.display = "block";
  });
});



// SENDING ITEMS TO CART BACKEND

// FIRST FOOD TYPES OPENER
window.addEventListener('DOMContentLoaded', () => {

  const foodTypes = document.querySelector(".food-types");
  document.querySelector(".product-card-cat").addEventListener("click", () => {
    foodTypes.classList.add("anim");
    foodTypes.style.display = "block";
  })

  document.querySelector(".food-types-close").addEventListener("click", () => {
    foodTypes.classList.remove("anim");
    foodTypes.style.display = "none";
  })

  const productCards = document.querySelectorAll('.product-card-cat');
  const foodTypesContainer = document.querySelector('.food-types');
  const cartItemsContainer = document.querySelector('.cart-item-outer');
  const cartTotalLabel = document.querySelector('.cart-item-total');
  const buybtn = document.querySelector('.buy');
  const noItemImg = document.querySelector('.no-items-img');  // Make sure this element exists in HTML

  let selectedProduct = null;

  productCards.forEach(card => {
    card.addEventListener('click', () => {
      selectedProduct = {
        img: card.querySelector('img').src,
        name: card.querySelector('p3').innerText.split('\n')[0],
        price: card.querySelector('p3').innerText.split('from ₹')[1]
      };
      foodTypesContainer.style.display = 'block';
    });
  });

  const typeItems = document.querySelectorAll('.type-item');

  typeItems.forEach(typeItem => {
    typeItem.addEventListener('click', () => {
      if (!selectedProduct) return;

      const typeImg = typeItem.querySelector('img').src;
      const typeName = typeItem.querySelector('.type-item-name').innerText;
      const typeCal = typeItem.querySelector('.type-item-cal').innerText;
      const typePrice = typeItem.querySelector('.type-item-price').innerText;

      const cartItem = document.createElement('div');
      cartItem.classList.add('cart-item');

      cartItem.innerHTML = `
            <img src="${typeImg}" class="cart-item-img" />
            <div class="cart-item-detail-container">
                <label class="cart-item-name">${typeName}</label>
                <label class="cart-item-cal">${typeCal}</label>
            </div>
            <label class="cart-item-price">${typePrice}</label>
            <button class="cart-item-add">Add</button>
        `;

      cartItemsContainer.appendChild(cartItem);

      updateCartTotal();

      foodTypesContainer.style.display = 'none';
      selectedProduct = null;
    });
  });

  function updateCartTotal() {
    const prices = document.querySelectorAll('.cart-item-price');
    let total = 0;

    prices.forEach(priceEl => {
      const price = parseInt(priceEl.innerText.replace('₹', ''));
      total += price;
    });

    cartTotalLabel.innerText = `₹${total}`;

    if (price === 0) {
      buybtn.style.cursor = "default";
      cartItemsContainer.style.maxHeight = "25vh";
      noItemImg.style.display = "block";  // Show the "no items" image
    } else {
      buybtn.style.cursor = "pointer";
      noItemImg.style.display = "none";  // Hide the "no items" image
    }

  }

  // Close food-types popup when clicking close
  document.querySelector('.food-types-close').addEventListener('click', () => {
    foodTypesContainer.style.display = 'none';
    selectedProduct = null;
  });

});