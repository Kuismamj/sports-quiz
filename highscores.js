const highScoresList = document.getElementById('highScoresList');
const highScores = JSON.parse(localStorage.getItem('highScores')) || [];

highScoresList.innerHTML = highScores
    .map(score => {
       return (`<li class="high-score">${score.name}-${score.score}</li>`); // map käy läpi highScores-taulukon ja luo uuden taulukon, jossa jokainen elementti on <li>-listaelementti
    })
    .join(""); // yhdistää tämän uuden taulukon merkkijonoksi, jossa kaikki elementit ovat peräkkäin ilman välejä.