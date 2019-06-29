//Получение данных со сторонней страницы
let XHR = ("onload" in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;
let xhr = new XHR();

xhr.open('GET', 'https://frontend.camp.dev.unit6.ru/get-slides', true);

xhr.onload = function() {
   let slidesdata = JSON.parse(this.responseText);
   transformdata(slidesdata);
}

xhr.onerror = function() {
  alert( 'Ошибка ' + this.status );
}

xhr.send();


//трансформация полученных данных в массив данных
function transformdata(massiv) {
    //пришлось установить thisDate произвольно 1547737519, т.к. не понятен формат даты, 
    //если это формат timestamp, то текущая реальная дата в timestamp и даты из массива не сопоставимы.
    let thisDate = 1547737519;   
    let newArr = [];  
    
    for (let item of massiv) {       
        if(item.active == true && item.startDate<=thisDate && item.endDate>thisDate){
            
            let newObj = {
                    title:item.title,
                    text: item.text,
                    image: item.image,
                    order: item.order,
                    //даты, если нужно                  
                }  
            newArr.push(newObj); 
            
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
	
	let data = newArr;
	console.log(data);
	let index = void 0;
	setIndex();
	
	let parent = document.querySelector('.b-slider');
	let sliderTitle = parent.querySelector('.b-slide__title');
	let sliderText = parent.querySelector('.b-slide__text');
	let sliderImage = parent.querySelector('.b-slider__img-right');
	let dotsContainer = document.querySelector('.b-slider__dots');
	let dots = dotsContainer.children;

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
        window.timerId= window.setInterval(function () {
			index++;			
			if (index > data.length - 1) {
				index = 0;
			}
			drawTextes(data);
			markActive(index);
		}, 3000);}

	//функция отметит активную точку слайда
	function markActive(index) {		
		for (let i = 0; i < dots.length; i++) {
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
        for (let item of data) {
            let dot = document.createElement('div');
            dot.classList.add('b-slider__dot');
            dotsContainer.appendChild(dot);
        }
		
		dots[index].classList.add('b-slider__dot--selected');

		
		//здесь отключаются неактивные точки, отмечается активная точка после клика
		dotsContainer.onclick = function (e) {
			for (let i = 0; i < dots.length; i++) {
				dots[i].classList.remove('b-slider__dot--selected');
			}
			e.target.classList.add('b-slider__dot--selected');
		};

		//здесь запускается отрисовка слайда по клику
		let _loop = function _loop(j) {
			dots[j].addEventListener('click', function selectBanner() {
				setIndex(j);
                drawTextes(data);
                window.clearInterval(window.timerId);
                window.setTimeout(autoSlider, 1500);
			});
		};

		for (let j = 0; j < dots.length; j++) {
			_loop(j);
		}
	}
}






