/*
 * Create a list that holds all of your cards
 */

let cardType = ['fa-diamond','fa-paper-plane-o','fa-anchor','fa-bolt','fa-cube','fa-leaf','fa-bicycle','fa-bomb'];
cardType=cardType.concat(cardType);

// get deck that contains all cards
const cardDeck = document.querySelector('.deck');

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}


// function to shuffle and create a new deck
function createDeck(array) {
    const shuffle_cards = shuffle(array);
    for (element of shuffle_cards){
        const htmlToAdd = `<li class ="card"><i class='fa ${element}'></i></li>`;
        cardDeck.insertAdjacentHTML('beforeend',htmlToAdd);  
    }
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

// array to hold opened cards
let openCards = [];
// movement counter
let movement =0;
// number of matched pair
let matchPair =0;
// get star rating element
const stars = document.querySelector('.stars');


// display current movement
const moves=document.querySelector('.moves');
moves.textContent= movement;

// get popup window element
const modal = document.querySelector('.modal');

// set timer
const timer = new easytimer.Timer();
const timerDisplay = document.querySelector('.timer');

// function to check if two cards match
function checkCard(evt){
	//display movement
		movement+=1;
		moves.textContent= movement;

	//set a timer
	if (movement===1){
		timer.start();
		timer.addEventListener('secondsUpdated', function (e) {
			timerDisplay.textContent = timer.getTimeValues().toString();
		});
	}

	
	//display star ranking
	switch (movement) {
		case 26:
		case 40:
		stars.removeChild(stars.lastElementChild);
		break;
	}

	// open and match cards
    if (openCards.length == 0) {
        evt.target.classList.add('open','show');
        openCards.push(evt.target); 
    }
    else if (openCards.length == 1) {
        evt.target.classList.add('open','show');
        openCards.push(evt.target);
        if (openCards[0].querySelector('i').classList[1]===
            openCards[1].querySelector('i').classList[1]){
            openCards.forEach(function(element){
				element.classList.add('match');})
            openCards=[];
            matchPair+=1;
        }
        else {
            setTimeout(function() {
                openCards.forEach(function(element){
                    element.classList.remove('show','open');})
                openCards=[]; 
            },300);
        }  
    }

	// when all cards are matched
    if (matchPair===8){
		const finishTime = timer.getTotalTimeValues().seconds;
		timer.stop();
    	modal.style.display = "block";
		document.querySelector('.final-time').textContent=`You win in ${finishTime.toFixed(0)} seconds!`;
		const star_count = stars.childElementCount;
		let star_rating="";
		for (let i=0; i<star_count;i++){
			star_rating = star_rating.concat('<i class="fa fa-star">');
		}
		document.querySelector('.final-star').innerHTML=`The star rating is ${star_rating}`;
	}
}


// function to add click listener to each card
function addListener(){
	const cards = document.querySelectorAll('.card')
	for (card of cards) {
    	card.addEventListener('click',checkCard);
	}
}


// function to re-initialize the game
function reStart(){
	timer.stop();
	timerDisplay.textContent='00:00:00';
	modal.style.display = "none";
	cardDeck.innerHTML='';
	stars.innerHTML='';
	createDeck(cardType);
	stars.innerHTML = `<li><i class="fa fa-star"></i></li>
	<li><i class="fa fa-star"></i></li>
	<li><i class="fa fa-star"></i></li>`;
	openCards = [];
	movement =0;
	matchPair =0;
	moves.textContent= movement;
	addListener();
}

// get restart element and add click listener
const restart = document.querySelectorAll('.restart');
restart.forEach(function(element){
	element.addEventListener('click', reStart);});


// create a new deck and add event listener to each cards
createDeck(cardType);
addListener();
