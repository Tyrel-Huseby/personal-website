var openGame;

function game(dir) {
  openGame = window.open(`games/${dir}/${dir}.html`);
}

function pythonGame(name) {
  if (name == 'five card draw') {
    openGame = window.open(`https://github.com/Tyrel-Huseby/python-games/blob/master/fiveCardDraw.py`);
  }
  else if (name == 'go fish') {
    openGame = window.open(`https://github.com/Tyrel-Huseby/python-games/blob/master/goFish.py`);
  }
  else if (name == 'r.p.s.l.s') {
    openGame = window.open(`https://github.com/Tyrel-Huseby/python-games/blob/master/rockPaperScissorsLizardSpock.py`);
  }
}
