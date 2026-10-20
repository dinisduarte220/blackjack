const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]
const suits = ["clubs", "spades", "diamonds", "hearts"]

let money = 100
let bet

let dealerCards = []
let playerCards = []

// Check Bet Value
function checkBet(bet) {
  if (bet.length > 0 && bet <= money && bet > 0) {
    document.getElementById('btn_startGame').removeAttribute('disabled')
  } else {
    document.getElementById('btn_startGame').setAttribute('disabled', '')
  }
}
// Start Game
function startGame() {
  bet = document.getElementById('betValue').value
  money -= bet
  document.getElementById('newGame').style.display = "none"
  document.getElementById('currentBet').innerText = `Current Bet: ${bet}€`
  document.getElementById('currentBet').style.display = "block"
  document.getElementById('money').innerText = `Money: ${money}€`
  document.getElementById('playerControls').style.display = "flex"

  drawFirstCards()
  currentHandValue("dealer")
  currentHandValue("player")
}

function drawFirstCards() {
  let isShowed = true
  let cardOwner = "dealer"
  for (let i = 0; i < 4; i++) {
    i == 2 ? isShowed = false : isShowed = true

    const card = generateCard()

    addCard(cardOwner, card.value, card.suit, isShowed)
    if (cardOwner == "dealer") {
      dealerCards.push(card)
      cardOwner = "player"
    } else {
      playerCards.push(card)
      cardOwner = "dealer"
    }
  }

  if (canSplit()) document.getElementById('btn_split').removeAttribute('disabled')
}

// Add Card
function addCard(cardOwner, value, suit, isShowed) {
  if (suit == "clubs" || suit == "spades") {
    color = "black"
  } else {
    color = "red"
  }

  let newCard = document.createElement('div')
  newCard.setAttribute('class', 'card')

  let cardValue1 = document.createElement('div')
  cardValue1.setAttribute('class', 'cardTop')
  cardValue1.innerText = value
  cardValue1.style.color = color
  let cardValue2 = document.createElement('div')
  cardValue2.setAttribute('class', 'cardBottom')
  cardValue2.innerText = value
  cardValue2.style.color = color
  let cardSuit = document.createElement('div')
  cardSuit.setAttribute('class', 'cardSuit')
  cardSuit.innerText = suit
  cardSuit.style.color = color

  newCard.appendChild(cardValue1)
  newCard.appendChild(cardValue2)
  newCard.appendChild(cardSuit)

  // Flipped Card
  let flippedCard = document.createElement('img')
  flippedCard.setAttribute('src', './imgs/backcard.png')
  flippedCard.setAttribute('class', 'backFacedCard')
  flippedCard.setAttribute('id', 'dealerHiddenCard')

  if (isShowed) {
    document.getElementById(`${cardOwner}Cards`).appendChild(newCard)
  } else {
    newCard.appendChild(flippedCard)
    document.getElementById(`${cardOwner}Cards`).appendChild(flippedCard)
  }
}

// Current Hand Value
function currentHandValue(deck) {
  const cardsDeck = deck == "player" ? playerCards : dealerCards
  let totalValue = 0
  let aces = 0

  for (let i = 0; i < cardsDeck.length; i++) {
    if (cardsDeck[i].value >= 2 && cardsDeck[i].value <= 10) totalValue += Number(cardsDeck[i].value)
    if (cardsDeck[i].value == "J" || cardsDeck[i].value == "Q" || cardsDeck[i].value == "K") {
      totalValue += 10
    }
    if (cardsDeck[i].value == "A") {
      totalValue += 11
      aces++
    }
  }

  while (totalValue > 21 && aces > 0) {
    totalValue -= 10
    aces--
  }

  return totalValue
}

// Generate Card
function generateCard() {
  const value = values[Math.floor(Math.random() * (values.length))]
  const suit = suits[Math.floor(Math.random() * (suits.length))]
  let suit_symbol

  switch (suit) {
    case "clubs":
      suit_symbol = "♣"
      break;
    case "spades":
      suit_symbol = "♠"
      break;
    case "diamonds":
      suit_symbol = "♦"
      break;
    case "hearts":
      suit_symbol = "♥"
      break;
  
    default:
      break;
  }

  return {value: value, suit: suit_symbol, suitName: suit}
}

// Check for Split
function canSplit() {
  let cards = playerCards
  
  return cards[0].value == cards[1].value
}

// Actions
function hit() {
  const card = generateCard()

  addCard("player", card.value, card.suit, true)
  playerCards.push(card)

  if (currentHandValue("player") > 21){
    endGame("You Lost!")
  }
}

function stand() {
  const dealerHiddenCard = document.getElementById('dealerHiddenCard')
  if (dealerHiddenCard) {
    dealerHiddenCard.remove()
    addCard("dealer", dealerCards[1].value, dealerCards[1].suit, true)
  }

  const allActionButtons = document.querySelectorAll('#playerControls button')
  allActionButtons.forEach(element => {
    element.setAttribute('disabled', '')
  })
  
  dealerTurn(currentHandValue("player"))

}

function dealerTurn(playerHand) {
  if (currentHandValue("dealer") < 17) {
    setTimeout(() => {
      const card = generateCard()
      addCard("dealer", card.value, card.suit, true)
      dealerCards.push(card)

      dealerTurn(playerHand)
    }, 1000)

    return
  }

  const dealerHand = currentHandValue("dealer")
  if (dealerHand > 21 || dealerHand < playerHand) {
    endGame(`You Won: ${bet * 2}`)
    money += bet * 2
  } else if (dealerHand > playerHand) {
    endGame("You Lost!")
  } else {
    endGame("It's a Draw!")
    money += bet
  }

  document.getElementById('money').innerText = `Money: ${money}€`
}

function double() {
  
}

function split() {
  
}

// Game Ended
function endGame(text) {
  document.getElementById('gameResult').innerText = text
  document.getElementById('gameFinished').style.display = "block"

  const allActionButtons = document.querySelectorAll('#playerControls button')
    allActionButtons.forEach(element => {
      element.removeAttribute('disabled')
    })
}

// GO To Menu
function goToMenu() {
  bet = document.getElementById('betValue').value = ""
  document.getElementById('newGame').style.display = "block"
  document.getElementById('currentBet').style.display = "none"
  document.getElementById('money').innerText = `Money: ${money}€`
  document.getElementById('playerControls').style.display = "none"
  document.getElementById('gameFinished').style.display = "none"

  // Remove Game Cards
  while (document.getElementById('playerCards').firstChild) document.getElementById('playerCards').removeChild(document.getElementById('playerCards').firstChild)
  while (document.getElementById('dealerCards').firstChild) document.getElementById('dealerCards').removeChild(document.getElementById('dealerCards').firstChild)
  playerCards = []
  dealerCards = []
}