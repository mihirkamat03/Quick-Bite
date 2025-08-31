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



