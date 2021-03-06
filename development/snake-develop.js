function orient() {
	var is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
				
	if(!is_chrome) {
		$(window)    
		.bind('orientationchange', function(){
		   if (window.orientation % 180 == 0){
		       $(document.body).css("-webkit-transform-origin", "")
		           .css("-webkit-transform", "");               
		   } 
		   else {                   
		       if ( window.orientation > 0) { //clockwise
		         $(document.body).css("-webkit-transform-origin", "280px 190px")
		           .css("-webkit-transform",  "rotate(-90deg)");  
		       }
		       else {
		         $(document.body).css("-webkit-transform-origin", "280px 190px")
		           .css("-webkit-transform",  "rotate(90deg)"); 
		       }
		   }
		})
		.trigger('orientationchange');
	}
}

function touchEvents() {
	//Assign handlers to the simple direction handlers.
	var swipeOptions=
	{
		swipe:swipe,
		threshold:0
	}
	
	$(function()
	{			
		//Enable swiping...
		$("#canvas").swipe( swipeOptions );	
	});

	//Swipe handlers.
	//The only arg passed is the original touch event object			
	function swipe(event, direction)
	{
		//swipe right movement
		if (direction == 'right') {
			if (snakeDirection != 'left') {
				moveRight();
			}
		}
		
		//swipe up movement
		if (direction == 'up') {
			if (snakeDirection != 'down') {
				moveUp();
			}
		}
		
		//swipe left movement
		if (direction == 'left') {
			if (snakeDirection != 'right') {
				moveLeft();
			}
		}
		
		//swipe down movement
		if (direction == 'down') {
			if (snakeDirection != 'up') {
				moveDown();
			}
		}
	}
}

function runSnake() {
	canvas = document.getElementById('canvas');
	canvas.width = 320;
	canvas.height = 360;
	
	if (canvas.getContext) {
		mainMenu();
		ctx = canvas.getContext('2d');
		this.gridSize = 20;
		startLength = 3;
		snakeSpeed = 140;
	} else {
		alert("You need a new browser");
	}
}

function mainMenu() {
	$("#main-menu").modal({
		opacity:80,
		overlayCss: {backgroundColor:"#000"},
		onClose: function()
	        {
	            $("#gameover-content").hide();
	            $.modal.close(); // must call this!
	        }, persist: true
	});
}

function hide() {
	$("#about-content").hide();
	$("#main-content").hide();
	$("#about-content").hide();
	$("#gameover-content").hide();
}

function about() {
	$("#about-content").hide();
	$("#main-content").hide();
	$("#about-content").show();
	$("#gameover-content").hide();
}

function back() {
	$("#about-content").hide();
	$("#pause-content").hide();
	$("#main-content").show();
	$("#gameover-content").hide();
}

function pauseMenu() {
	$("#main-content").hide();
	$("#about-content").hide();
	$("#pause-content").show();
	$("#gameover-content").hide();
	mainMenu();
}

function gameMenu() {
	$("#main-content").hide();
	$("#about-content").hide();
	$("#pause-content").hide();
	$("#gameover-content").show();
	mainMenu();
}

function start() {
	ctx.clearRect(0,0, canvas.width, canvas.height);
	this.currentPosition = {'x':60,'y':60};
	snakeBody = [];
	snakeLength = startLength;
	makeFood();
	drawSnake();
	snakeDirection = 'right';
	play();
}

function pause() {
  	clearInterval(interval);
  	allowPressKeys = false;
}

function play(){
 	interval = setInterval(moveSnake,snakeSpeed);
 	allowPressKeys = true;
}

function restart() {
	pause();
	start();
}

document.onkeydown = function(event) {
	if (!allowPressKeys){
    	return null;
  	}
  	
	var keyCode;
	
	if(event == null)
	{
		keyCode = window.event.keyCode;
	}
	else
	{
		keyCode = event.keyCode;
	}
	
	switch(keyCode)
	{
		case 37:
			// left arrow key
			if (snakeDirection != 'right') {
				moveLeft();
			}
			break;
			
		case 38:
			// up arrow key
			if (snakeDirection != 'down') {
				moveUp();
			}
			break;
			
		case 39:
			// right arrow key
			if (snakeDirection != 'left') {
				moveRight();
			}
			break;
			
		case 40:
			// down arrow key
			if (snakeDirection != 'up') {
				moveDown();
			}
			break;
			
		default:
			break;
	}
}

function makeFood() {
	
	suggestedPoint = [Math.floor(Math.random()*(canvas.width/gridSize))*gridSize, Math.floor(Math.random()*(canvas.height/gridSize))*gridSize];

	if (snakeBody.some(hasPoint)) {
		makeFood();	
	} else {
		ctx.fillStyle = "rgb(10,100,0)";
    	ctx.fillRect(suggestedPoint[0], suggestedPoint[1], gridSize, gridSize);
	};
}

function hasPoint(element, index, array) {
	return (element[0] == suggestedPoint[0] && element[1] == suggestedPoint[1]);
}

function biteMe(element, index, array) {
	return (element[0] == currentPosition['x'] && element[1] == currentPosition['y']);
}

function drawSnake() {

	if (snakeBody.some(biteMe)) {
		gameOver();
		return false;
	}
	
	snakeBody.push([currentPosition['x'], currentPosition['y']]);
	ctx.fillStyle = "#454545";
	ctx.fillRect(currentPosition['x'], currentPosition['y'], gridSize, gridSize);
	
	if (snakeBody.length > snakeLength) {
		var itemToRemove = snakeBody.shift();
		ctx.clearRect(itemToRemove[0], itemToRemove[1], gridSize, gridSize);
	}
	
	if (currentPosition['x'] == suggestedPoint['0'] && currentPosition['y'] == suggestedPoint['1']) {
		makeFood();
		snakeLength += 1;
		updateScore();
	}
}

function moveSnake() {
	switch(snakeDirection)
	{
		case 'up':
			moveUp();
			break;
		case 'down':
			moveDown();
			break;
		case 'left':
			moveLeft();
			break;
		case 'right':
			moveRight();
			break;		
	}
}

function leftPosition() {
	return currentPosition['x'] - gridSize;
}

function rightPosition() {
	return currentPosition['x'] + gridSize;
}

function upPosition() {
	return currentPosition['y'] - gridSize;
}

function downPosition() {
	return currentPosition['y'] + gridSize;
}

function moveUp() {
	if (upPosition() >= 0) {
		executeMove('up', 'y', upPosition());
	} else {
		whichWay('x');
	}
}

function moveDown() {
	if (downPosition() < canvas.height) {
		executeMove('down', 'y', downPosition());
	} else {
		whichWay('x');
	}
}

function moveLeft() {
	if (leftPosition() >= 0) {
		executeMove('left', 'x', leftPosition());
	} else {
		whichWay('y');
	}
}

function moveRight() {
	if (rightPosition() < canvas.width) {
		executeMove('right', 'x', rightPosition());
	} else {
		whichWay('y');
	}
}

function executeMove(dirValue, axisType, axisValue) {
	snakeDirection = dirValue;
	currentPosition[axisType] = axisValue;
	drawSnake();
}

function whichWay(axisType) {
	if (axisType == 'x') {
		a = (currentPosition['x'] > canvas.width / 2) ? moveLeft() : moveRight();
	} else {
		a = (currentPosition['y'] > canvas.height / 2) ? moveUp() : moveDown();
	}
}

function gameOver() {
	var score = (snakeLength - startLength) * 10;
	gameScore();
	pause();
	snakeLength = startLength;
	score = 0;
	updateScore();
	allowPressKeys = false;
	ctx.clearRect(0,0, canvas.width, canvas.height);
}

function updateScore() {
	var score = (snakeLength - startLength)*10
	document.getElementById('score').innerHTML = score;
}

function gameScore() {
	$('#ribbon').addClass('hide');
	var highScore = localStorage.getItem("high-score");
	
	var score = (snakeLength - startLength) * 10;
	$('.current-score').html(score);
	
	if (score > highScore) {
		$('#ribbon').removeClass('hide');
		$('.high-score').html(score);
		localStorage.setItem('high-score', score);	
	} else {
		$('.high-score').html(highScore);
	}
	
	gameMenu();
}

/*!
 * Add to Homescreen v2.0 ~ Copyright (c) 2012 Matteo Spinelli, http://cubiq.org
 * Released under MIT license, http://cubiq.org/license
 */
var addToHome = (function (w) {
	var nav = w.navigator,
		isIDevice = 'platform' in nav && (/iphone|ipod|ipad/gi).test(nav.platform),
		isIPad,
		isRetina,
		isSafari,
		isStandalone,
		OSVersion,
		startX = 0,
		startY = 0,
		isExpired,
		isSessionActive,
		isReturningVisitor,
		balloon,
		overrideChecks,

		positionInterval,
		closeTimeout,

		options = {
			autostart: true,			// Automatically open the balloon
			returningVisitor: true,	// Show the balloon to returning visitors only (setting this to true is HIGHLY RECCOMENDED)
			animationIn: 'fade',		// drop || bubble || fade
			animationOut: 'fade',		// drop || bubble || fade
			startDelay: 2000,			// 2 seconds from page load before the balloon appears
			lifespan: 15000,			// 15 seconds before it is automatically destroyed
			bottomOffset: 14,			// Distance of the balloon from bottom
			expire: 0,					// Minutes to wait before showing the popup again (0 = always displayed)
			message: '',				// Customize your message or force a language ('' = automatic)
			touchIcon: false,			// Display the touch icon
			arrow: true,				// Display the balloon arrow
			hookOnLoad: true,			// Should we hook to onload event? (really advanced usage)
			iterations: 100				// Internal/debug use
		},

		intl = {
			ca_es: 'Per instal·lar aquesta aplicació al vostre %device premeu %icon i llavors <strong>Afegir a pantalla d\'inici</strong>.',
			da_dk: 'Tilføj denne side til din %device: tryk på %icon og derefter <strong>Tilføj til hjemmeskærm</strong>.',
			de_de: 'Installieren Sie diese App auf Ihrem %device: %icon antippen und dann <strong>Zum Home-Bildschirm</strong>.',
			el_gr: 'Εγκαταστήσετε αυτήν την Εφαρμογή στήν συσκευή σας %device: %icon μετά πατάτε <strong>Προσθήκη σε Αφετηρία</strong>.',
			en_us: 'Install this web app on your %device: tap %icon and then <strong>Add to Home Screen</strong>.',
			es_es: 'Para instalar esta app en su %device, pulse %icon y seleccione <strong>Añadir a pantalla de inicio</strong>.',
			fi_fi: 'Asenna tämä web-sovellus laitteeseesi %device: paina %icon ja sen jälkeen valitse <strong>Lisää Koti-valikkoon</strong>.',
			fr_fr: 'Ajoutez cette application sur votre %device en cliquant sur %icon, puis <strong>Ajouter à l\'écran d\'accueil</strong>.',
			he_il: '<span dir="rtl">התקן אפליקציה זו על ה-%device שלך: הקש %icon ואז <strong>הוסף למסך הבית</strong>.</span>',
			hu_hu: 'Telepítse ezt a web-alkalmazást az Ön %device-jára: nyomjon a %icon-ra majd a <strong>Főképernyőhöz adás</strong> gombra.',
			it_it: 'Installa questa applicazione sul tuo %device: premi su %icon e poi <strong>Aggiungi a Home</strong>.',
			ja_jp: 'このウェブアプリをあなたの%deviceにインストールするには%iconをタップして<strong>ホーム画面に追加</strong>を選んでください。',
			ko_kr: '%device에 웹앱을 설치하려면 %icon을 터치 후 "홈화면에 추가"를 선택하세요',
			nb_no: 'Installer denne appen på din %device: trykk på %icon og deretter <strong>Legg til på Hjem-skjerm</strong>',
			nl_nl: 'Installeer deze webapp op uw %device: tik %icon en dan <strong>Zet in beginscherm</strong>.',
			pl_pl: 'Aby zainstalować tę aplikacje na %device: naciśnij %icon a następnie <strong>Dodaj jako ikonę</strong>.',
			pt_br: 'Instale este web app em seu %device: aperte %icon e selecione <strong>Adicionar à Tela Inicio</strong>.',
			pt_pt: 'Para instalar esta aplicação no seu %device, prima o %icon e depois o <strong>Adicionar ao ecrã principal</strong>.',
			ru_ru: 'Установите это веб-приложение на ваш %device: нажмите %icon, затем <strong>Добавить в «Домой»</strong>.',
			sv_se: 'Lägg till denna webbapplikation på din %device: tryck på %icon och därefter <strong>Lägg till på hemskärmen</strong>.',
			th_th: 'ติดตั้งเว็บแอพฯ นี้บน %device ของคุณ: แตะ %icon และ <strong>เพิ่มที่หน้าจอโฮม</strong>',
			tr_tr: '%device için bu uygulamayı kurduktan sonra %icon simgesine dokunarak <strong>Ana Ekrana Ekle</strong>yin.',
			zh_cn: '您可以将此应用程式安装到您的 %device 上。请按 %icon 然后点选<strong>添加至主屏幕</strong>。',
			zh_tw: '您可以將此應用程式安裝到您的 %device 上。請按 %icon 然後點選<strong>加入主畫面螢幕</strong>。'
		};

	function init () {
		// Preliminary check, prevents all further checks to be performed on iDevices only
		if ( !isIDevice ) return;

		var now = Date.now(),
			i;

		// Merge local with global options
		if (w.addToHomeConfig) {
			for ( i in w.addToHomeConfig ) {
				options[i] = w.addToHomeConfig[i];
			}
		}
		if ( !options.autostart ) options.hookOnLoad = false;

		isIPad = (/ipad/gi).test(nav.platform);
		isRetina = w.devicePixelRatio && w.devicePixelRatio > 1;
		isSafari = nav.appVersion.match(/Safari/gi);
		isStandalone = nav.standalone;
		
		OSVersion = nav.appVersion.match(/OS (\d+_\d+)/i);
		OSVersion = OSVersion[1] ? +OSVersion[1].replace('_', '.') : 0;
		
		isExpired = +w.localStorage.getItem('addToHome') || now;
		isSessionActive = w.sessionStorage.getItem('addToHomeSession');
		isReturningVisitor = !options.returningVisitor || ( isExpired && isExpired + 28*24*60*60*1000 > now );			// You are considered a "returning visitor" if you access the site more than once/month

		// If it is expired we need to reissue a new balloon
		isExpired = ( !options.expire || isExpired <= now );

		if ( options.hookOnLoad ) w.addEventListener('load', loaded, false);
		else if ( !options.hookOnLoad && options.autostart ) loaded();
	}

	function loaded () {
		w.removeEventListener('load', loaded, false);

		if ( !overrideChecks && (!isSafari || !isExpired || isSessionActive || isStandalone || !isReturningVisitor) ) return;

		if ( options.expire || options.returningVisitor ) {
			w.localStorage.setItem('addToHome', Date.now() + options.expire * 60000);
		}

		var icons = options.touchIcon ? document.querySelectorAll('head link[rel=apple-touch-icon],head link[rel=apple-touch-icon-precomposed]') : [],
			sizes,
			touchIcon = '',
			closeButton,
			platform = nav.platform.split(' ')[0],
			language = nav.language.replace('-', '_'),
			i, l;

		balloon = document.createElement('div');
		balloon.id = 'addToHomeScreen';
		balloon.style.cssText += 'left:-9999px;-webkit-transition-property:-webkit-transform,opacity;-webkit-transition-duration:0;-webkit-transform:translate3d(0,0,0);position:' + (OSVersion < 5 ? 'absolute' : 'fixed');

		// Localize message
		if ( options.message in intl ) {		// You may force a language despite the user's locale
			language = options.message;
			options.message = '';
		}
		if ( options.message === '' ) {			// We look for a suitable language (defaulted to en_us)
			options.message = language in intl ? intl[language] : intl['en_us'];
		}

		// Search for the apple-touch-icon
		if ( icons.length ) {
			for ( i = 0, l = icons.length; i < l; i++ ) {
				sizes = icons[i].getAttribute('sizes');

				if ( sizes ) {
					if ( isRetina && sizes == '114x114' ) {
						touchIcon = icons[i].href;
						break;
					}
				} else {
					touchIcon = icons[i].href;
				}
			}

			touchIcon = '<span style="background-image:url(' + touchIcon + ')" class="addToHomeTouchIcon"></span>';
		}

		balloon.className = (isIPad ? 'addToHomeIpad' : 'addToHomeIphone') + (touchIcon ? ' addToHomeWide' : '');
		balloon.innerHTML = touchIcon +
			options.message.replace('%device', platform).replace('%icon', OSVersion >= 4.2 ? '<span class="addToHomeShare"></span>' : '<span class="addToHomePlus">+</span>') +
			(options.arrow ? '<span class="addToHomeArrow"></span>' : '') +
			'<span class="addToHomeClose">\u00D7</span>';

		document.body.appendChild(balloon);

		// Add the close action
		closeButton = balloon.querySelector('.addToHomeClose');
		if ( closeButton ) closeButton.addEventListener('click', clicked, false);

		setTimeout(show, options.startDelay);
	}

	function show () {
		var duration,
			iPadXShift = 160;

		// Set the initial position
		if ( isIPad ) {
			if ( OSVersion < 5 ) {
				startY = w.scrollY;
				startX = w.scrollX;
				iPadXShift = 208;
			}

			balloon.style.top = startY + options.bottomOffset + 'px';
			balloon.style.left = startX + iPadXShift - Math.round(balloon.offsetWidth / 2) + 'px';

			switch ( options.animationIn ) {
				case 'drop':
					duration = '0.6s';
					balloon.style.webkitTransform = 'translate3d(0,' + -(w.scrollY + options.bottomOffset + balloon.offsetHeight) + 'px,0)';
					break;
				case 'bubble':
					duration = '0.6s';
					balloon.style.opacity = '0';
					balloon.style.webkitTransform = 'translate3d(0,' + (startY + 50) + 'px,0)';
					break;
				default:
					duration = '1s';
					balloon.style.opacity = '0';
			}
		} else {
			startY = w.innerHeight + w.scrollY;

			if ( OSVersion < 5 ) {
				startX = Math.round((w.innerWidth - balloon.offsetWidth) / 2) + w.scrollX;
				balloon.style.left = startX + 'px';
				balloon.style.top = startY - balloon.offsetHeight - options.bottomOffset + 'px';
			} else {
				balloon.style.left = '50%';
				balloon.style.marginLeft = -Math.round(balloon.offsetWidth / 2) + 'px';
				balloon.style.bottom = options.bottomOffset + 'px';
			}

			switch (options.animationIn) {
				case 'drop':
					duration = '1s';
					balloon.style.webkitTransform = 'translate3d(0,' + -(startY + options.bottomOffset) + 'px,0)';
					break;
				case 'bubble':
					duration = '0.6s';
					balloon.style.webkitTransform = 'translate3d(0,' + (balloon.offsetHeight + options.bottomOffset + 50) + 'px,0)';
					break;
				default:
					duration = '1s';
					balloon.style.opacity = '0';
			}
		}

		balloon.offsetHeight;	// repaint trick
		balloon.style.webkitTransitionDuration = duration;
		balloon.style.opacity = '1';
		balloon.style.webkitTransform = 'translate3d(0,0,0)';
		balloon.addEventListener('webkitTransitionEnd', transitionEnd, false);

		closeTimeout = setTimeout(close, options.lifespan);
	}

	function manualShow (override) {
		if ( !isIDevice || balloon ) return;

		overrideChecks = override;
		loaded();
	}

	function close () {
		clearInterval( positionInterval );
		clearTimeout( closeTimeout );
		closeTimeout = null;

		var posY = 0,
			posX = 0,
			opacity = '1',
			duration = '0',
			closeButton = balloon.querySelector('.addToHomeClose');

		if ( closeButton ) closeButton.removeEventListener('click', close, false);

		if ( OSVersion < 5 ) {
			posY = isIPad ? w.scrollY - startY : w.scrollY + w.innerHeight - startY;
			posX = isIPad ? w.scrollX - startX : w.scrollX + Math.round((w.innerWidth - balloon.offsetWidth)/2) - startX;
		}

		balloon.style.webkitTransitionProperty = '-webkit-transform,opacity';

		switch ( options.animationOut ) {
			case 'drop':
				if ( isIPad ) {
					duration = '0.4s';
					opacity = '0';
					posY = posY + 50;
				} else {
					duration = '0.6s';
					posY = posY + balloon.offsetHeight + options.bottomOffset + 50;
				}
				break;
			case 'bubble':
				if ( isIPad ) {
					duration = '0.8s';
					posY = posY - balloon.offsetHeight - options.bottomOffset - 50;
				} else {
					duration = '0.4s';
					opacity = '0';
					posY = posY - 50;
				}
				break;
			default:
				duration = '0.8s';
				opacity = '0';
		}

		balloon.addEventListener('webkitTransitionEnd', transitionEnd, false);
		balloon.style.opacity = opacity;
		balloon.style.webkitTransitionDuration = duration;
		balloon.style.webkitTransform = 'translate3d(' + posX + 'px,' + posY + 'px,0)';
	}


	function clicked () {
		w.sessionStorage.setItem('addToHomeSession', '1');
		isSessionActive = true;
		close();
	}

	function transitionEnd () {
		balloon.removeEventListener('webkitTransitionEnd', transitionEnd, false);

		balloon.style.webkitTransitionProperty = '-webkit-transform';
		balloon.style.webkitTransitionDuration = '0.2s';

		// We reached the end!
		if ( !closeTimeout ) {
			balloon.parentNode.removeChild(balloon);
			balloon = null;
			return;
		}

		// On iOS 4 we start checking the element position
		if ( OSVersion < 5 && closeTimeout ) positionInterval = setInterval(setPosition, options.iterations);
	}

	function setPosition () {
		var matrix = new WebKitCSSMatrix(w.getComputedStyle(balloon, null).webkitTransform),
			posY = isIPad ? w.scrollY - startY : w.scrollY + w.innerHeight - startY,
			posX = isIPad ? w.scrollX - startX : w.scrollX + Math.round((w.innerWidth - balloon.offsetWidth) / 2) - startX;

		// Screen didn't move
		if ( posY == matrix.m42 && posX == matrix.m41 ) return;

		balloon.style.webkitTransform = 'translate3d(' + posX + 'px,' + posY + 'px,0)';
	}

	// Clear local and session storages (this is useful primarily in development)
	function reset () {
		w.localStorage.removeItem('addToHome');
		w.sessionStorage.removeItem('addToHomeSession');
	}

	// Bootstrap!
	init();

	return {
		show: manualShow,
		close: close,
		reset: reset
	};
})(this);

(function($)
{$.fn.swipe=function(options)
{if(!this)return false;var defaults={fingers:1,threshold:75,swipe:null,swipeLeft:null,swipeRight:null,swipeUp:null,swipeDown:null,swipeStatus:null,click:null,triggerOnTouchEnd:true,allowPageScroll:"auto"};var LEFT="left";var RIGHT="right";var UP="up";var DOWN="down";var NONE="none";var HORIZONTAL="horizontal";var VERTICAL="vertical";var AUTO="auto";var PHASE_START="start";var PHASE_MOVE="move";var PHASE_END="end";var PHASE_CANCEL="cancel";var hasTouch='ontouchstart'in window,START_EV=hasTouch?'touchstart':'mousedown',MOVE_EV=hasTouch?'touchmove':'mousemove',END_EV=hasTouch?'touchend':'mouseup',CANCEL_EV='touchcancel';var phase="start";if(options.allowPageScroll==undefined&&(options.swipe!=undefined||options.swipeStatus!=undefined))
options.allowPageScroll=NONE;if(options)
$.extend(defaults,options);return this.each(function()
{var that=this;var $this=$(this);var triggerElementID=null;var fingerCount=0;var start={x:0,y:0};var end={x:0,y:0};var delta={x:0,y:0};function touchStart(event)
{var evt=hasTouch?event.touches[0]:event;phase=PHASE_START;if(hasTouch){fingerCount=event.touches.length;}
distance=0;direction=null;if(fingerCount==defaults.fingers||!hasTouch)
{start.x=end.x=evt.pageX;start.y=end.y=evt.pageY;if(defaults.swipeStatus)
triggerHandler(event,phase);}
else
{touchCancel(event);}
that.addEventListener(MOVE_EV,touchMove,false);that.addEventListener(END_EV,touchEnd,false);}
function touchMove(event)
{if(phase==PHASE_END||phase==PHASE_CANCEL)
return;var evt=hasTouch?event.touches[0]:event;end.x=evt.pageX;end.y=evt.pageY;direction=caluculateDirection();if(hasTouch){fingerCount=event.touches.length;}
phase=PHASE_MOVE
validateDefaultEvent(event,direction);if(fingerCount==defaults.fingers||!hasTouch)
{distance=caluculateDistance();if(defaults.swipeStatus)
triggerHandler(event,phase,direction,distance);if(!defaults.triggerOnTouchEnd)
{if(distance>=defaults.threshold)
{phase=PHASE_END;triggerHandler(event,phase);touchCancel(event);}}}
else
{phase=PHASE_CANCEL;triggerHandler(event,phase);touchCancel(event);}}
function touchEnd(event)
{event.preventDefault();distance=caluculateDistance();direction=caluculateDirection();if(defaults.triggerOnTouchEnd)
{phase=PHASE_END;if((fingerCount==defaults.fingers||!hasTouch)&&end.x!=0)
{if(distance>=defaults.threshold)
{triggerHandler(event,phase);touchCancel(event);}
else
{phase=PHASE_CANCEL;triggerHandler(event,phase);touchCancel(event);}}
else
{phase=PHASE_CANCEL;triggerHandler(event,phase);touchCancel(event);}}
else if(phase==PHASE_MOVE)
{phase=PHASE_CANCEL;triggerHandler(event,phase);touchCancel(event);}
that.removeEventListener(MOVE_EV,touchMove,false);that.removeEventListener(END_EV,touchEnd,false);}
function touchCancel(event)
{fingerCount=0;start.x=0;start.y=0;end.x=0;end.y=0;delta.x=0;delta.y=0;}
function triggerHandler(event,phase)
{if(defaults.swipeStatus)
defaults.swipeStatus.call($this,event,phase,direction||null,distance||0);if(phase==PHASE_CANCEL)
{if(defaults.click&&(fingerCount==1||!hasTouch)&&(isNaN(distance)||distance==0))
defaults.click.call($this,event,event.target);}
if(phase==PHASE_END)
{if(defaults.swipe)
{defaults.swipe.call($this,event,direction,distance);}
switch(direction)
{case LEFT:if(defaults.swipeLeft)
defaults.swipeLeft.call($this,event,direction,distance);break;case RIGHT:if(defaults.swipeRight)
defaults.swipeRight.call($this,event,direction,distance);break;case UP:if(defaults.swipeUp)
defaults.swipeUp.call($this,event,direction,distance);break;case DOWN:if(defaults.swipeDown)
defaults.swipeDown.call($this,event,direction,distance);break;}}}
function validateDefaultEvent(event,direction)
{if(defaults.allowPageScroll==NONE)
{event.preventDefault();}
else
{var auto=defaults.allowPageScroll==AUTO;switch(direction)
{case LEFT:if((defaults.swipeLeft&&auto)||(!auto&&defaults.allowPageScroll!=HORIZONTAL))
event.preventDefault();break;case RIGHT:if((defaults.swipeRight&&auto)||(!auto&&defaults.allowPageScroll!=HORIZONTAL))
event.preventDefault();break;case UP:if((defaults.swipeUp&&auto)||(!auto&&defaults.allowPageScroll!=VERTICAL))
event.preventDefault();break;case DOWN:if((defaults.swipeDown&&auto)||(!auto&&defaults.allowPageScroll!=VERTICAL))
event.preventDefault();break;}}}
function caluculateDistance()
{return Math.round(Math.sqrt(Math.pow(end.x-start.x,2)+Math.pow(end.y-start.y,2)));}
function caluculateAngle()
{var X=start.x-end.x;var Y=end.y-start.y;var r=Math.atan2(Y,X);var angle=Math.round(r*180/Math.PI);if(angle<0)
angle=360-Math.abs(angle);return angle;}
function caluculateDirection()
{var angle=caluculateAngle();if((angle<=45)&&(angle>=0))
return LEFT;else if((angle<=360)&&(angle>=315))
return LEFT;else if((angle>=135)&&(angle<=225))
return RIGHT;else if((angle>45)&&(angle<135))
return DOWN;else
return UP;}
try
{this.addEventListener(START_EV,touchStart,false);this.addEventListener(CANCEL_EV,touchCancel);}
catch(e)
{}});};})(jQuery);

/*
 * SimpleModal 1.4.1 - jQuery Plugin
 * http://www.ericmmartin.com/projects/simplemodal/
 * Copyright (c) 2010 Eric Martin (http://twitter.com/ericmmartin)
 * Dual licensed under the MIT and GPL licenses
 * Revision: $Id: jquery.simplemodal.js 261 2010-11-05 21:16:20Z emartin24 $
 */
(function(d){var k=d.browser.msie&&parseInt(d.browser.version)===6&&typeof window.XMLHttpRequest!=="object",m=d.browser.msie&&parseInt(d.browser.version)===7,l=null,f=[];d.modal=function(a,b){return d.modal.impl.init(a,b)};d.modal.close=function(){d.modal.impl.close()};d.modal.focus=function(a){d.modal.impl.focus(a)};d.modal.setContainerDimensions=function(){d.modal.impl.setContainerDimensions()};d.modal.setPosition=function(){d.modal.impl.setPosition()};d.modal.update=function(a,b){d.modal.impl.update(a,
b)};d.fn.modal=function(a){return d.modal.impl.init(this,a)};d.modal.defaults={appendTo:"body",focus:true,opacity:50,overlayId:"simplemodal-overlay",overlayCss:{},containerId:"simplemodal-container",containerCss:{},dataId:"simplemodal-data",dataCss:{},minHeight:null,minWidth:null,maxHeight:null,maxWidth:null,autoResize:false,autoPosition:true,zIndex:1E3,close:true,closeHTML:'<a class="modalCloseImg" title="Close"></a>',closeClass:"simplemodal-close",escClose:true,overlayClose:false,position:null,
persist:false,modal:true,onOpen:null,onShow:null,onClose:null};d.modal.impl={d:{},init:function(a,b){var c=this;if(c.d.data)return false;l=d.browser.msie&&!d.boxModel;c.o=d.extend({},d.modal.defaults,b);c.zIndex=c.o.zIndex;c.occb=false;if(typeof a==="object"){a=a instanceof jQuery?a:d(a);c.d.placeholder=false;if(a.parent().parent().size()>0){a.before(d("<span></span>").attr("id","simplemodal-placeholder").css({display:"none"}));c.d.placeholder=true;c.display=a.css("display");if(!c.o.persist)c.d.orig=
a.clone(true)}}else if(typeof a==="string"||typeof a==="number")a=d("<div></div>").html(a);else{alert("SimpleModal Error: Unsupported data type: "+typeof a);return c}c.create(a);c.open();d.isFunction(c.o.onShow)&&c.o.onShow.apply(c,[c.d]);return c},create:function(a){var b=this;f=b.getDimensions();if(b.o.modal&&k)b.d.iframe=d('<iframe src="javascript:false;"></iframe>').css(d.extend(b.o.iframeCss,{display:"none",opacity:0,position:"fixed",height:f[0],width:f[1],zIndex:b.o.zIndex,top:0,left:0})).appendTo(b.o.appendTo);
b.d.overlay=d("<div></div>").attr("id",b.o.overlayId).addClass("simplemodal-overlay").css(d.extend(b.o.overlayCss,{display:"none",opacity:b.o.opacity/100,height:b.o.modal?f[0]:0,width:b.o.modal?f[1]:0,position:"fixed",left:0,top:0,zIndex:b.o.zIndex+1})).appendTo(b.o.appendTo);b.d.container=d("<div></div>").attr("id",b.o.containerId).addClass("simplemodal-container").css(d.extend(b.o.containerCss,{display:"none",position:"fixed",zIndex:b.o.zIndex+2})).append(b.o.close&&b.o.closeHTML?d(b.o.closeHTML).addClass(b.o.closeClass):
"").appendTo(b.o.appendTo);b.d.wrap=d("<div></div>").attr("tabIndex",-1).addClass("simplemodal-wrap").css({height:"100%",outline:0,width:"100%"}).appendTo(b.d.container);b.d.data=a.attr("id",a.attr("id")||b.o.dataId).addClass("simplemodal-data").css(d.extend(b.o.dataCss,{display:"none"})).appendTo("body");b.setContainerDimensions();b.d.data.appendTo(b.d.wrap);if(k||l)b.fixIE()},bindEvents:function(){var a=this;d("."+a.o.closeClass).bind("click.simplemodal",function(b){b.preventDefault();a.close()});
a.o.modal&&a.o.close&&a.o.overlayClose&&a.d.overlay.bind("click.simplemodal",function(b){b.preventDefault();a.close()});d(document).bind("keydown.simplemodal",function(b){if(a.o.modal&&b.keyCode===9)a.watchTab(b);else if(a.o.close&&a.o.escClose&&b.keyCode===27){b.preventDefault();a.close()}});d(window).bind("resize.simplemodal",function(){f=a.getDimensions();a.o.autoResize?a.setContainerDimensions():a.o.autoPosition&&a.setPosition();if(k||l)a.fixIE();else if(a.o.modal){a.d.iframe&&a.d.iframe.css({height:f[0],
width:f[1]});a.d.overlay.css({height:f[0],width:f[1]})}})},unbindEvents:function(){d("."+this.o.closeClass).unbind("click.simplemodal");d(document).unbind("keydown.simplemodal");d(window).unbind("resize.simplemodal");this.d.overlay.unbind("click.simplemodal")},fixIE:function(){var a=this,b=a.o.position;d.each([a.d.iframe||null,!a.o.modal?null:a.d.overlay,a.d.container],function(c,h){if(h){var g=h[0].style;g.position="absolute";if(c<2){g.removeExpression("height");g.removeExpression("width");g.setExpression("height",
'document.body.scrollHeight > document.body.clientHeight ? document.body.scrollHeight : document.body.clientHeight + "px"');g.setExpression("width",'document.body.scrollWidth > document.body.clientWidth ? document.body.scrollWidth : document.body.clientWidth + "px"')}else{var e;if(b&&b.constructor===Array){c=b[0]?typeof b[0]==="number"?b[0].toString():b[0].replace(/px/,""):h.css("top").replace(/px/,"");c=c.indexOf("%")===-1?c+' + (t = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + "px"':
parseInt(c.replace(/%/,""))+' * ((document.documentElement.clientHeight || document.body.clientHeight) / 100) + (t = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + "px"';if(b[1]){e=typeof b[1]==="number"?b[1].toString():b[1].replace(/px/,"");e=e.indexOf("%")===-1?e+' + (t = document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft) + "px"':parseInt(e.replace(/%/,""))+' * ((document.documentElement.clientWidth || document.body.clientWidth) / 100) + (t = document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft) + "px"'}}else{c=
'(document.documentElement.clientHeight || document.body.clientHeight) / 2 - (this.offsetHeight / 2) + (t = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + "px"';e='(document.documentElement.clientWidth || document.body.clientWidth) / 2 - (this.offsetWidth / 2) + (t = document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft) + "px"'}g.removeExpression("top");g.removeExpression("left");g.setExpression("top",
c);g.setExpression("left",e)}}})},focus:function(a){var b=this;a=a&&d.inArray(a,["first","last"])!==-1?a:"first";var c=d(":input:enabled:visible:"+a,b.d.wrap);setTimeout(function(){c.length>0?c.focus():b.d.wrap.focus()},10)},getDimensions:function(){var a=d(window);return[d.browser.opera&&d.browser.version>"9.5"&&d.fn.jquery<"1.3"||d.browser.opera&&d.browser.version<"9.5"&&d.fn.jquery>"1.2.6"?a[0].innerHeight:a.height(),a.width()]},getVal:function(a,b){return a?typeof a==="number"?a:a==="auto"?0:
a.indexOf("%")>0?parseInt(a.replace(/%/,""))/100*(b==="h"?f[0]:f[1]):parseInt(a.replace(/px/,"")):null},update:function(a,b){var c=this;if(!c.d.data)return false;c.d.origHeight=c.getVal(a,"h");c.d.origWidth=c.getVal(b,"w");c.d.data.hide();a&&c.d.container.css("height",a);b&&c.d.container.css("width",b);c.setContainerDimensions();c.d.data.show();c.o.focus&&c.focus();c.unbindEvents();c.bindEvents()},setContainerDimensions:function(){var a=this,b=k||m,c=a.d.origHeight?a.d.origHeight:d.browser.opera?
a.d.container.height():a.getVal(b?a.d.container[0].currentStyle.height:a.d.container.css("height"),"h");b=a.d.origWidth?a.d.origWidth:d.browser.opera?a.d.container.width():a.getVal(b?a.d.container[0].currentStyle.width:a.d.container.css("width"),"w");var h=a.d.data.outerHeight(true),g=a.d.data.outerWidth(true);a.d.origHeight=a.d.origHeight||c;a.d.origWidth=a.d.origWidth||b;var e=a.o.maxHeight?a.getVal(a.o.maxHeight,"h"):null,i=a.o.maxWidth?a.getVal(a.o.maxWidth,"w"):null;e=e&&e<f[0]?e:f[0];i=i&&i<
f[1]?i:f[1];var j=a.o.minHeight?a.getVal(a.o.minHeight,"h"):"auto";c=c?a.o.autoResize&&c>e?e:c<j?j:c:h?h>e?e:a.o.minHeight&&j!=="auto"&&h<j?j:h:j;e=a.o.minWidth?a.getVal(a.o.minWidth,"w"):"auto";b=b?a.o.autoResize&&b>i?i:b<e?e:b:g?g>i?i:a.o.minWidth&&e!=="auto"&&g<e?e:g:e;a.d.container.css({height:c,width:b});a.d.wrap.css({overflow:h>c||g>b?"auto":"visible"});a.o.autoPosition&&a.setPosition()},setPosition:function(){var a=this,b,c;b=f[0]/2-a.d.container.outerHeight(true)/2;c=f[1]/2-a.d.container.outerWidth(true)/
2;if(a.o.position&&Object.prototype.toString.call(a.o.position)==="[object Array]"){b=a.o.position[0]||b;c=a.o.position[1]||c}else{b=b;c=c}a.d.container.css({left:c,top:b})},watchTab:function(a){var b=this;if(d(a.target).parents(".simplemodal-container").length>0){b.inputs=d(":input:enabled:visible:first, :input:enabled:visible:last",b.d.data[0]);if(!a.shiftKey&&a.target===b.inputs[b.inputs.length-1]||a.shiftKey&&a.target===b.inputs[0]||b.inputs.length===0){a.preventDefault();b.focus(a.shiftKey?"last":
"first")}}else{a.preventDefault();b.focus()}},open:function(){var a=this;a.d.iframe&&a.d.iframe.show();if(d.isFunction(a.o.onOpen))a.o.onOpen.apply(a,[a.d]);else{a.d.overlay.show();a.d.container.show();a.d.data.show()}a.o.focus&&a.focus();a.bindEvents()},close:function(){var a=this;if(!a.d.data)return false;a.unbindEvents();if(d.isFunction(a.o.onClose)&&!a.occb){a.occb=true;a.o.onClose.apply(a,[a.d])}else{if(a.d.placeholder){var b=d("#simplemodal-placeholder");if(a.o.persist)b.replaceWith(a.d.data.removeClass("simplemodal-data").css("display",
a.display));else{a.d.data.hide().remove();b.replaceWith(a.d.orig)}}else a.d.data.hide().remove();a.d.container.hide().remove();a.d.overlay.hide();a.d.iframe&&a.d.iframe.hide().remove();setTimeout(function(){a.d.overlay.remove();a.d={}},10)}}}})(jQuery);
