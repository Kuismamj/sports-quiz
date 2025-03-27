const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
//const choices = document.getElementsByClassName("choice-text"); <- palauttaa HTMLCollection-olion, ei NodeListiä tai arrayta.
const questionCounterText = document.getElementById('questionCounter');
const scoreText = document.getElementById('score');
const loader = document.getElementById('loader');
const game = document.getElementById('game');

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

let questions = [];

function decodeHTML(html) { // tehdään funktio joka purkaa HTML-entiteetit JavaScriptissä ennen kuin näytät kysymykset käyttäjälle.
    var txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
}

fetch(
    'https://opentdb.com/api.php?amount=10&category=21&difficulty=easy&type=multiple'
)
    .then((res) => {
        return res.json(); // muuntaa JS-olioksi
    })
    .then((loadedQuestions) => { // tämän jälkeen tallentaa kysymykset ja aloittaa pelin
        questions = loadedQuestions.results.map((loadedQuestion) => {
            const formattedQuestion = {
                question: decodeHTML(loadedQuestion.question),
            };

            const answerChoices = [...loadedQuestion.incorrect_answers]; // Kopioidaan väärät vastaukset uuteen taulukkoon
            formattedQuestion.answer = Math.floor(Math.random() * 4) + 1; // määrittää oikean vastauksen satunnaiseksi sijainniksi
            answerChoices.splice( // lisää oikean vastauksen satunnaiseen kohtaan answerChoices-taulukossa.
                formattedQuestion.answer - 1,
                0,
                decodeHTML(loadedQuestion.correct_answer)
            );

            answerChoices.forEach((choice, index) => {
                formattedQuestion['choice' + (index + 1)] = decodeHTML(choice); // lisää vastausvaihtoehdot uusiin avaimiin 
            });

            return formattedQuestion;
        });
        startGame();
    })
    .catch((err) => {
        console.error(err); //jos jokin menee pieleen virhe käsitellään ja tulostetaan konsoliin
    });

const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 5;

startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions]; // Kopioi questions-taulukon uuteen muuttujaan availableQuestions.
    getNewQuestion();
    game.classList.remove("hidden"); // poistaa hidden-luokan pelistä
    loader.classList.add('hidden');  // lataaja häviää
};

getNewQuestion = () => {
    if(availableQuestions.length == 0 || questionCounter >= MAX_QUESTIONS){ // kun kysymykset loppuu
        localStorage.setItem('mostRecentScore', score);
        return window.location.assign('/end.html'); // menee loppuscreenille
    }
    questionCounter++;
    questionCounterText.innerText = questionCounter + "/" + MAX_QUESTIONS;

    const questionIndex = Math.floor(Math.random()* availableQuestions.length); // Arpoo satunnaisen indeksin availableQuestions-taulukosta.
    currentQuestion = availableQuestions[questionIndex]; //Tallentaa satunnaisesti valitun kysymyksen muuttujaan currentQuestion.
    question.innerText = currentQuestion.question; // Asettaa kysymyksen HTML:ään näkyviin.

    choices.forEach(choice => {
        const number = choice.dataset['number'];
        choice.innerText = currentQuestion ['choice'+number];
    });
    availableQuestions.splice(questionIndex, 1);
    acceptingAnswers = true; 
};
choices.forEach(choice => {
    choice.addEventListener('click', e  =>{ // lisätään vastausvaihtoehdoille click tapahtumakäsittelijät
        if (!acceptingAnswers) return; // estää vastaamasta useita kertoja

        acceptingAnswers = false; // Estää uudet vastaukset, kun vastaus on valittu, kunnes uusi kysymys tulee.
        const selectedChoice = e.target; 
        const selectedAnswer = selectedChoice.dataset['number']; // HTML-elementin data-number-arvon (eli valitun vaihtoehdon numeron).

        const classToApply =
            selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect'; // katsoo vastaako oikein. Jos vastaa niin tulee arvo correct, muuten incorrect

         if (classToApply === 'correct') {
             incrementScore(CORRECT_BONUS);
         }
        selectedChoice.parentElement.classList.add(classToApply); // vaihtaa taustaväriä

        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply); // palauttaa CSS värin normaaliksi
            getNewQuestion();
        }, 1000); // 1 sec viive seuraavaan kysymyksen
    });
});
incrementScore = num => {
    score += num; // lisää num-arvon score-muuttujaan
    scoreText.innerText = score; // päivittää HTML
}