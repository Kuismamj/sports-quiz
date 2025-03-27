const username = document.getElementById('username');
const saveScoreBtn = document.getElementById('saveScoreBtn');
const finalScore = document.getElementById('finalScore');
const mostRecentScore = localStorage.getItem('mostRecentScore'); 

const highScores = JSON.parse(localStorage.getItem("highScores")) || []; // hakee highScores-taulukon ja varmistaa, että se on aina kelvollinen taulukko. 

const MAX_HIGH_SCORES = 5;

finalScore.innerText = mostRecentScore; // antaa lopussa pistemäärän

username.addEventListener('keyup', () =>{
    saveScoreBtn.disabled = !username.value; // jos kenttä ei ole tyhjä niin voi painaa tallennuspainiketta
});
saveHighScore = e => {
    e.preventDefault();

    const score = {
        score: Math.floor(Math.random() * 100),
        name: username.value
    };
    highScores.push(score);
    highScores.sort ( (a,b) => b.score - a.score); // järjestää taulukon laskevaan järjestykseen
    highScores.splice(5); // vain top 5 jää

    localStorage.setItem('highScores', JSON.stringify(highScores)); // tallentaa highscores-taulukon merkkijonoksi ja tallentaa sen, jotta se voidaan hakea myöhemmin
    window.location.assign('/'); // meneek kotisivulle    
}