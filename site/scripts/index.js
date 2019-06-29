'use strict';

//Получение данных со сторонней страницы
var XHR = "onload" in new XMLHttpRequest() ? XMLHttpRequest : XDomainRequest;
var xhr = new XHR();

xhr.open('GET', 'https://frontend.camp.dev.unit6.ru/get-slides', true);

xhr.onload = function () {
	var slidesdata = JSON.parse(this.responseText);
	transformdata(slidesdata);
};

xhr.onerror = function () {
	alert('Ошибка ' + this.status);
};

xhr.send();

//трансформация полученных данных в массив данных
function transformdata(massiv) {
	//пришлось установить thisDate произвольно 1547737519, т.к. не понятен формат даты, 
	//если это формат timestamp, то текущая реальная дата в timestamp и даты из массива не сопоставимы.
	var thisDate = 1547737519;
	var newArr = [];

	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = massiv[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var item = _step.value;

			if (item.active == true && item.startDate <= thisDate && item.endDate > thisDate) {

				var newObj = {
					title: item.title,
					text: item.text,
					image: item.image,
					order: item.order
					//даты, если нужно                  
				};
				newArr.push(newObj);
			}
		}
	} catch (err) {
		_didIteratorError = true;
		_iteratorError = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion && _iterator.return) {
				_iterator.return();
			}
		} finally {
			if (_didIteratorError) {
				throw _iteratorError;
			}
		}
	}

	newArr.sort(compareOrder);
	initSlider(newArr);
}

// Функция сравнения порядка order, выстраивает order по возрастанию
function compareOrder(obj1, obj2) {
	return obj1.order - obj2.order;
}

//функционал слайдера для баннера
function initSlider(newArr) {

	var data = newArr;
	console.log(data);
	var index = void 0;
	setIndex();

	var parent = document.querySelector('.b-slider');
	var sliderTitle = parent.querySelector('.b-slide__title');
	var sliderText = parent.querySelector('.b-slide__text');
	var sliderImage = parent.querySelector('.b-slider__img-right');
	var dotsContainer = document.querySelector('.b-slider__dots');
	var dots = dotsContainer.children;

	function setIndex(value) {
		if (value == null) {
			index = 0;
		} else {
			index = value;
		};
	}

	drawBanner(data);

	//запускает основные функции
	function drawBanner(data) {
		autoSlider();
		drawTextes(data);
		drawDots(data);
	}

	//запускает автоматическую смену слайдов
	function autoSlider() {
		window.timerId = window.setInterval(function () {
			index++;
			if (index > data.length - 1) {
				index = 0;
			}
			drawTextes(data);
			markActive(index);
		}, 3000);
	}

	//функция отметит активную точку слайда
	function markActive(index) {
		for (var i = 0; i < dots.length; i++) {
			dots[i].classList.remove('b-slider__dot--selected');
		}
		dots[index].classList.add('b-slider__dot--selected');
	}

	//функция "рисует" текст слайдов
	function drawTextes(massiv) {
		sliderTitle.innerHTML = massiv[index].title;
		sliderText.innerHTML = massiv[index].text;
		sliderImage.style.cssText += 'background-image: url(' + massiv[index].image.slice(1) + ')';
	}

	//функция "рисует" точки переключения 
	function drawDots(data) {
		var _iteratorNormalCompletion2 = true;
		var _didIteratorError2 = false;
		var _iteratorError2 = undefined;

		try {
			for (var _iterator2 = data[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
				var item = _step2.value;

				var dot = document.createElement('div');
				dot.classList.add('b-slider__dot');
				dotsContainer.appendChild(dot);
			}
		} catch (err) {
			_didIteratorError2 = true;
			_iteratorError2 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion2 && _iterator2.return) {
					_iterator2.return();
				}
			} finally {
				if (_didIteratorError2) {
					throw _iteratorError2;
				}
			}
		}

		dots[index].classList.add('b-slider__dot--selected');

		//здесь отключаются неактивные точки, отмечается активная точка после клика
		dotsContainer.onclick = function (e) {
			for (var i = 0; i < dots.length; i++) {
				dots[i].classList.remove('b-slider__dot--selected');
			}
			e.target.classList.add('b-slider__dot--selected');
		};

		//здесь запускается отрисовка слайда по клику
		var _loop = function _loop(j) {
			dots[j].addEventListener('click', function selectBanner() {
				setIndex(j);
				drawTextes(data);
				window.clearInterval(window.timerId);
				window.setTimeout(autoSlider, 1500);
			});
		};

		for (var j = 0; j < dots.length; j++) {
			_loop(j);
		}
	}
}
//# sourceMappingURL=index.js.map
