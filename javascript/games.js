var openGame;

function game(dir) {
  openGame = window.open(`games/${dir}/${dir}.html`, `${dir}Window`);
}
