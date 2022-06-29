'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const header = document.querySelector('.header');
const nav = document.querySelector('.nav');
const operationBtns = document.querySelectorAll('.operations__tab');
const btnContainer = document.querySelector('.operations__tab-container');
const operationContents = document.querySelectorAll('.operations__content');
const sections = document.querySelectorAll('.section');

const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
//const slider = document.querySelector('.slider');
const slides = document.querySelectorAll('.slide');

const dotsContainer = document.querySelector('.dots');

const openModal = function (event) {
  event.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

const message = document.createElement('div');
message.classList.add('cookie-message');
message.innerHTML = `We use cookies for improved functionality and analytics.<button class="btn btn--close--cookie">Got It</button>`;
header.append(message);
document
  .querySelector('.btn--close--cookie')
  .addEventListener('click', function () {
    message.remove();
    //or we can use this (old way):
    //message.parentElement.removeChild(message);
  });

message.style.backgroundColor = '#37383d';
message.style.width = '120%';

btnScrollTo.addEventListener('click', function (e) {
  section1.scrollIntoView({ behavior: 'smooth' });
});

document
  .querySelector('.nav__links')
  .addEventListener('click', function (event) {
    event.preventDefault();
    if (event.target.classList.contains('nav__link')) {
      const id = event.target.getAttribute('href');
      document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
    }
  });

btnContainer.addEventListener('click', function (event) {
  const clicked = event.target.closest('.operations__tab');

  if (!clicked) return;

  operationBtns.forEach(function (btn) {
    btn.classList.remove('operations__tab--active');
  });

  clicked.classList.add('operations__tab--active');

  const content = document.querySelector(
    `.operations__content--${clicked.dataset.tab}`
  );

  operationContents.forEach(function (content) {
    content.classList.remove('operations__content--active');
  });
  content.classList.add('operations__content--active');
});

const hoverHandler = function (opacity, event) {
  if (event.target.classList.contains('nav__link')) {
    const link = event.target;
    const logo = nav.querySelector('img');
    const links = nav.querySelectorAll('.nav__link');
    links.forEach(function (el) {
      if (el !== link) {
        el.style.opacity = opacity;
      }
    });
    logo.style.opacity = opacity;
  }
};
const f = hoverHandler.bind(null, 0.2);
//this is a good way to bind a method ,pass argument in this order (this ,arg1 ,arg2 ,...)
//this --> null ,0.5 --> opacity and the eventListener will pass the event.
nav.addEventListener('mouseover', hoverHandler.bind(null, 0.5));

nav.addEventListener('mouseout', hoverHandler.bind(null, 1));

const navHeight = nav.getBoundingClientRect().height;
const obsOptions = {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
};

const stickyNav = function (enteries) {
  const entry = enteries[0];
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, obsOptions);
headerObserver.observe(header);

const revealSection = function (enteries, observer) {
  const entry = enteries[0];
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

sections.forEach(section => {
  sectionObserver.observe(section);
  //section.classList.add('section--hidden');
});

const lazyImgs = document.querySelectorAll('img[data-src]');
const loadImg = function (enteries, observer) {
  enteries.forEach(function (entry) {
    if (!entry.isIntersecting) return;
    entry.target.src = entry.target.dataset.src;
    entry.target.addEventListener('load', function () {
      entry.target.classList.remove('lazy-img');
    });
    observer.unobserve(entry.target);
  });
};
const lazyImgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '500px',
});

lazyImgs.forEach(img => {
  lazyImgObserver.observe(img);
});
//.....................................
const slider = function () {
  const creatDots = function () {
    slides.forEach(function (_, index) {
      dotsContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide=${index}></button>`
      );
    });
  };

  const deActivateDots = function () {
    dotsContainer.querySelectorAll('.dots__dot').forEach(function (btn) {
      btn.classList.remove('dots__dot--active');
    });
  };

  const activateDot = function (currSlide) {
    deActivateDots();
    const btn = document.querySelector(`.dots__dot[data-slide="${currSlide}"]`);
    btn.classList.add('dots__dot--active');
  };

  const init = function () {
    creatDots();
    activateDot(0);
  };
  init();

  slides.forEach(function (slide, index) {
    slide.style.transform = `translateX(${index * 100}%)`;
  });

  let currentSlide = 0;
  const slidesNumber = slides.length;
  const goToSlide = function (slides, currentSlide, slidesNumber) {
    currentSlide = currentSlide % slidesNumber;
    activateDot(currentSlide);
    slides.forEach(function (slide, index) {
      slide.style.transform = `translateX(${(index - currentSlide) * 100}%)`;
    });
  };
  const goToPreSlide = function () {
    currentSlide--;
    if (currentSlide < 0) currentSlide += slidesNumber;
    goToSlide(slides, currentSlide, slidesNumber);
  };
  const goToNextSlide = function () {
    currentSlide++;
    goToSlide(slides, currentSlide, slidesNumber);
  };
  btnRight.addEventListener('click', goToNextSlide);
  btnLeft.addEventListener('click', goToPreSlide);

  document.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowRight') goToNextSlide();
    else if (event.key === 'ArrowLeft') goToPreSlide();
  });

  dotsContainer.addEventListener('click', function (event) {
    if (event.target.classList.contains('dots__dot')) {
      const newCurrSlide = event.target.dataset.slide;
      currentSlide = newCurrSlide;
      activateDot(newCurrSlide);
      goToSlide(slides, newCurrSlide, slidesNumber);
    }
  });
};
slider();
