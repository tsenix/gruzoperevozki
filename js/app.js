let slider_feedback = new Swiper('.feedback__slider', {
	observer: true,
	observeParents: true,
	slidesPerView: 2,
	spaceBetween: 0,
	autoHeight: false,
	speed: 800,
	loop: true,
	autoplay: {
		delay: 3000,
		disableOnInteraction: false
	},
	breakpoints: {
		320: {
			slidesPerView: 1,
			spaceBetween: 0,
		},
		768: {
			slidesPerView: 2,
			spaceBetween: 20,
		},
		992: {
			spaceBetween: 40,
		},
		1280: {
			spaceBetween: 100,
		},
	},
});

//Menu
const iconMenu = document.querySelector(".header__icon");
const menuBody = document.querySelector(".header__content");
if (iconMenu != null) {
	iconMenu.addEventListener("click", function () {
    iconMenu.classList.toggle("_active");
    menuBody.classList.toggle("_active");
	});
};
//ScrollOnClick (Navigation)
let link = document.querySelectorAll('._goto-block');
if (link) {
	let blocks = [];
	for (let index = 0; index < link.length; index++) {
		let el = link[index];
		let block_name = el.getAttribute('href').replace('#', '');
		if (block_name != '' && !~blocks.indexOf(block_name)) {
			blocks.push(block_name);
		}
		el.addEventListener('click', function (e) {
			if (document.querySelector('.header__content._active')) {
				iconMenu.classList.remove("_active");
    		menuBody.classList.remove("_active");
			}
			let target_block_class = el.getAttribute('href').replace('#', '');
			let target_block = document.querySelector('.' + target_block_class);
			_goto(target_block, 500, 100);
			e.preventDefault();
		})
	}

	window.addEventListener('scroll', function (el) {
		let old_current_link = document.querySelectorAll('._goto-block._active');
		if (old_current_link) {
			for (let index = 0; index < old_current_link.length; index++) {
				let el = old_current_link[index];
				el.classList.remove('_active');
			}
		}
		for (let index = 0; index < blocks.length; index++) {
			let block = blocks[index];
			let block_item = document.querySelector('.' + block);
			if (block_item) {
				let block_offset = offset(block_item).top;
				let block_height = block_item.offsetHeight;
				if ((pageYOffset > block_offset - window.innerHeight / 3) && pageYOffset < (block_offset + block_height) - window.innerHeight / 3) {
					let current_links = document.querySelectorAll('._goto-block[href="#' + block + '"]');
					for (let index = 0; index < current_links.length; index++) {
						let current_link = current_links[index];
						current_link.classList.add('_active');
					}
				}
			}
		}
	})
}
function _goto(target_block, speed, offset = 0) {
	let header = '';
	let options = {
		speedAsDuration: true,
		speed: speed,
		header: header,
		offset: offset,
		easing: 'easeOutQuad',
	};
	let scr = new SmoothScroll();
	scr.animateScroll(target_block, '', options);
}
function offset(el) {
	var rect = el.getBoundingClientRect(),
		scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
		scrollTop = window.pageYOffset || document.documentElement.scrollTop;
	return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
}
window.addEventListener('scroll', scroll_scroll);
//ScrollOnScroll
function scroll_scroll() {
	let src_value = pageYOffset;
	let header = document.querySelector('header.header');
	if (header !== null) {
		if (src_value > 10) {
			header.classList.add('_scroll');
		} else {
			header.classList.remove('_scroll');
		}
	}
}
//lazy-load
"use strict"
function lazyImage() {
	const lazyImages = document.querySelectorAll('img[data-src],source[data-srcset]');
	const windowHeight = document.documentElement.clientHeight;

	let lazyImagesPositions = [];
	if (lazyImages.length > 0) {
		lazyImages.forEach(img => {
			if (img.dataset.src || img.dataset.srcset) {
				lazyImagesPositions.push(img.getBoundingClientRect().top + pageYOffset);
				lazyScrollCheck();
			}
		});
	}

	window.addEventListener("scroll", lazyScroll);

	function lazyScroll() {
		if (document.querySelectorAll('img[data-src],source[data-srcset]').length > 0) {
			lazyScrollCheck();
		}
	}

	function lazyScrollCheck() {
		let imgIndex = lazyImagesPositions.findIndex(
			item => pageYOffset + 50 > item - windowHeight
		);
		if (imgIndex >= 0) {
			if (lazyImages[imgIndex].dataset.src) {
				lazyImages[imgIndex].src = lazyImages[imgIndex].dataset.src;
				lazyImages[imgIndex].removeAttribute('data-src');
			} else if (lazyImages[imgIndex].dataset.srcset) {
				lazyImages[imgIndex].srcset = lazyImages[imgIndex].dataset.srcset;
				lazyImages[imgIndex].removeAttribute('data-srcset');
			}
			delete lazyImagesPositions[imgIndex];
		}
	}
}

document.addEventListener('DOMContentLoaded', lazyImage);