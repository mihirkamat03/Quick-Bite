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
  if (n > 3) {slideIndex = 1}    
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < 3; i++) {
    slides[i].style.display = "none";  
  }
  for (i = 0; i < 3; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";  
  dots[slideIndex-1].className += " active";
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
