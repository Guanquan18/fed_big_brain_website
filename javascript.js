// 1 Set  and intilaise variable
var questionCount = 0;
var score = 0;
var ans;
var timedOut = 0;
var rand; 
var record = [];
var status = true;

var quiz = document.getElementById("quiz");
var quizSet = document.getElementById("quizset");
var resultbox = document.getElementById("resultbox");
var question = document.getElementById("question-text");
var option1 = document.getElementById("option1");
var option2 = document.getElementById("option2");
var option3 = document.getElementById("option3");
var option4 = document.getElementById("option4");
var submit = document.getElementById("submit");
var progress = document.getElementById("progress");
var result = document.getElementById("result");
var retake = document.getElementById("retake");
var button1 = document.getElementById("btn1");
var button2 = document.getElementById("btn2");
var button3 = document.getElementById("btn3");
var button4 = document.getElementById("btn4");
var scoretext = document.getElementById("score");

var tracker;
var countDown;
var secsInput = 25;
var seconds = secsInput;
var t;

function setQuestion(qCount, rand) {
    var ques = questions[rand];
    question.textContent = `${qCount + 1}. ${ques.question}`;
    option1.textContent = ques.option1;
    option2.textContent = ques.option2;
    option3.textContent = ques.option3;
    option4.textContent = ques.option4;
}

function changeProgressBar (qCount){
    progress.innerHTML = `Question ${qCount + 1} of 10`;
    tracker = document.getElementById("no"+ (qCount + 1));
    tracker.style.backgroundColor = "#cc7a00";
    tracker.style.color = "black";
}
function defaultOptionColors() {
	button1.style.backgroundColor = "paleturquoise;";
	button2.style.backgroundColor = "paleturquoise;";
	button3.style.backgroundColor = "paleturquoise;";
	button4.style.backgroundColor = "paleturquoise;";
}
function getQuestion(qCount,rand){
    if(qCount == 9){
        submit.innerHTML = "Submit  Quiz"
        submit.style.backgroundColor = "#00b300";
    }
    if(qCount > 9){
        return;
    }
    setQuestion(qCount,rand);
    changeProgressBar(qCount);
    defaultOptionColors();

    startTimer(seconds, "timer");
}
//3. Create functions we need - setting tracker, setting result, calculating and display final score 
function setCorrect() {
	score += 5;
	tracker.style.backgroundColor = "#009900";
    scoretext.innerHTML = `Score: ${score}/10`;
}

function setWrong() {
    score -= 5;
	tracker.style.backgroundColor = "#cc0000";
    scoretext.innerHTML = `Score: ${score}/10`;
}

function finalScore() {
	if(score > 5) {
		result.innerHTML = "Congrats! You passed! <br/> Your score is " + score + "!";
	}
	else {
		result.innerHTML = "Sorry. You failed. <br/> Your score is " + score + "!";
	}
}
function setResultPage(){
    quizSet.style.display = "none";
    resultbox.style.display = "block"
    progress.innerHTML = "Quiz Completed";
    timer.textContent = "00:00";
    finalScore();
    scoretext.innerHTML = `Score: ${score}/10`;
}
function randomGenerator() {
    while (status == true) {
        rand = Math.round(Math.random() * questions.length);
        if (rand !== questions.length) {
            // Check if rand is in the record array
            if (!record.includes(rand)) {
                record[questionCount] = rand;
                status = false;
            }
        }
    }
    status = true;

    return rand;
}