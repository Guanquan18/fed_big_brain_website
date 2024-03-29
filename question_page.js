const storedQuestions = localStorage.getItem('quizQuestions');
console.log('Selected Quiz Questions:', storedQuestions);
let questionsArray = JSON.parse(storedQuestions);
const questionheader = questionsArray[0].Quiz;  
var header = document.getElementById("question-header");
header.textContent = questionheader

const quiz_box = document.querySelector(".quiz");
const result_box = document.querySelector(".result_box");
const option_list = document.querySelector(".option_list");
const time_line = document.querySelector(".time_line");
const timeText = document.querySelector(".timer_left_txt");
const timeCount = document.querySelector(".timer_sec");
const score = document.getElementById("score");

const restart_quiz = result_box.querySelector(".restart");
const quit_quiz = result_box.querySelector(".quit");
const leaderboard_button = document.querySelector(".leaderboard_button");

const next_btn = document.getElementById("next_question");
const bottom_ques_counter = document.querySelector(".progress");

let timeValue = 15;
let que_count = 0;
let que_number = 1;
let userScore = 0;
let counter;
let counterLine;
let widthValue = 0;
function shuffleArray(array) {
    const newArray = [...array]
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}


document.addEventListener("DOMContentLoaded", function () {
    questionsArray = shuffleArray(questionsArray);
    // Wait for the DOM to fully load before executing the script
    initializeQuiz();
});
function initializeQuiz() {
    // Other initialization tasks can be added here if needed.

    // Show the first question
    showQuestions(0);
    // Set the question counter
    queCounter(1);
    // Start the timer
    startTimer(15);
    // Start the timer line
    startTimerLine(0);
    resetQuestionCircles();
}
// if restartQuiz button clikced
restart_quiz.onclick = () =>{
    quiz_box.classList.remove("quiz_inactive")// show the quiz
    result_box.classList.remove("activeResult") // hide the result box
    timeValue = 15;
    que_count = 0;
    que_number = 1;
    userScore = 0;
    widthValue = 0;
    showQuestions(que_count); // calling showQuestions Functions
    queCounter(que_number); // passing que_number value to qurCounter
    clearInterval(counter); // clear counter
    clearInterval(counterLine); // clear counterline
    startTimer(timeValue); // calling start timer function 
    startTimerLine(widthValue); // calling startTimerline function  
    timeText.textContent = "Time Left";
    resetQuestionCircles();
    next_btn.classList.remove("show"); // hide the next button

    updateDataBase();
}

quit_quiz.onclick = ()=>{
    updateDataBase("index.html");
}

leaderboard_button.onclick = () => {
    updateDataBase("leader_board_page.html");
}

async function updateDataBase(anotherPage = null){
    //const urlLeaderboard = "https://fedassignment-85eb.restdb.io/rest/leaderboard";
    //const urlLeaderboard2 = "https://fedassignment-85eb.restdb.io/rest/leaderboard";
    const urlLeaderboard3 = "https://fedassignment-5bdb.restdb.io/rest/leaderboard";
    
    //const urlAccount = "https://fedassignment-5bdb.restdb.io/rest/account";
    //const urlAccount2 = "https://fedassignment-85eb.restdb.io/rest/account";
    const urlAccount3 = "https://fedassignment-5bdb.restdb.io/rest/account";
    
    //const APIKEY = "65bde101c029b87c5966cdc6";
    //const APIKEY2 = "65bdfc153339b13e2a73c82b";
    const APIKEY3 = "65bde101c029b87c5966cdc6";
    
    var results = sessionStorage.getItem('quizResult');
    var resultsArray = JSON.parse(results);
    var username = resultsArray.username; 
    var score = resultsArray.score;  
    var quiz = resultsArray.quizTitle;  
    console.log("Username:", username,
                "\nScore:", score,
                "\nQuiz:", quiz);

    // Update the vbucks in account before updating score in leaderboard
    updateAccount().then(response => {
        updateLeaderboard();
    });

    function updateAccount() {
        let settings = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-apikey": APIKEY3,
                "Cache-Control": "no-cache"
            }
        };
        return fetch(urlAccount3, settings)
        .then(response => response.json())
        .then(response => {
            
            var requireAccountUpdate = false;
            for (var i = 0; i < response.length; i++) {
                // Check if username is the same
                if (response[i].username === username) {
                    console.log("Existing user:", response[i].username);
                    userId = response[i]._id;
                    var vbucks = response[i].vbucks;

                    console.log("username found: ", response[i].username);
                    
                    if (score == 50){
                        vbucks += 500;
                        requireAccountUpdate = true;
                    }
                    else if (score >= 40){
                        vbucks += 200;
                        requireAccountUpdate = true;
                    }
                    else if (score >= 30){
                        vbucks += 50;
                        requireAccountUpdate = true;
                    }
                    else if (score >= 25){
                        vbucks += 10;
                        requireAccountUpdate = true;
                    }
                    else if (score >= 1){
                        vbucks += 1;
                        requireAccountUpdate = true;
                    }

                    // Update the vbucks in the account
                    if (requireAccountUpdate){
                        var jsonData= {
                            "username": username,
                            "password": response[i].password,
                            "vbucks": vbucks,
                        };
                        let Settings = {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json",
                                "x-apikey": APIKEY3,
                                "Cache-Control": "no-cache"
                            },
                            body: JSON.stringify(jsonData)
                        };
                        return fetch(urlAccount3 + "/" + userId, Settings)
                            .then(res => res.json())
                            .then(res => {
                                console.log("Updated account data:", res);
                                return res;
                            })
                            .catch(error => {
                                console.error("Error updating data:", error);
                            });
                    }
                }
            }
            return 0;
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });
    }

    function updateLeaderboard() {
        let settings = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-apikey": APIKEY3,
                "Cache-Control": "no-cache"
            }
        }
        fetch(urlLeaderboard3,settings)
        .then(response => response.json())
        .then(response => {
            // Check if the username and quiz already exists in the database
            existingScore = false;
            requireScoreUpdate = false;
            for (var i = 0; i < response.length; i++) {
                if (response[i].username === username && response[i].quiz === quiz) {
                    console.log("Existing score:", response[i].score);
                    existingScore = true;
                    if (response[i].score < score) {
                        response[i].score = score;
                        userId = response[i]._id;
                        requireScoreUpdate = true;
                    }
                }
            }
            
            // Update only if the score is higher than the existing score
            if (existingScore && requireScoreUpdate){
                var jsonData= {
                    "username": username,
                    "score": score,
                    "quiz": quiz,
                };
                let Settings = {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "x-apikey": APIKEY3,
                        "Cache-Control": "no-cache"
                    },
                    body: JSON.stringify(jsonData)
                };
                fetch(urlLeaderboard3 + "/" + userId, Settings)
                    .then(response => response.json())
                    .then(response => {
                        console.log("Updated data:", response);
    
                        if (anotherPage == "index.html" || anotherPage == null){
                            sessionStorage.removeItem('quizResult');
                        }
    
                        if (anotherPage != null){
                            window.location.href = anotherPage;
                        }
                    })
                    .catch(error => {
                        console.error("Error updating data:", error);
                    });
            }

            // Direct to another page if not update of score is required
            else if (existingScore && !requireScoreUpdate){
                if (anotherPage == "index.html" || anotherPage == null){
                    sessionStorage.removeItem('quizResult');
                }
    
                if (anotherPage != null){
                    window.location.href = anotherPage;
                }
            }

            // Add new score if it does not exist
            else if (!existingScore){
                var jsonData = {
                    "username": username,
                    "score": score,
                    "quiz": quiz,
                };
                let settings = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-apikey": APIKEY3,
                        "Cache-Control": "no-cache"
                    },
                    body: JSON.stringify(jsonData)
                };
                fetch(urlLeaderboard3, settings)
                    .then(response => response.json())
                    .then(response => {
                        console.log("Added leaderboard data:", response);
    
                        if (anotherPage == "index.html" || anotherPage == null){
                            sessionStorage.removeItem('quizResult');
                        }
    
                        if (anotherPage != null){
                            window.location.href = anotherPage;
                        }
                    })
                    .catch(error => {
                        console.error("Error adding data:", error);
                    });
            }
        })
    }
}

    next_btn.onclick = () =>{
        if(que_count < questionsArray.length - 1){
            que_count ++;
            que_number ++;
            showQuestions(que_count);// calling showQuestions Functions
            queCounter(que_number);// passing que_number value to qurCounter
            clearInterval(counter); // clear counter
            clearInterval(counterLine); // clear counterline
            startTimer(timeValue); // calling start timer function 
            startTimerLine(widthValue); // calling startTimerline function
            next_btn.classList.remove("show"); // hide the next button
        }
        else{
            clearInterval(counter); // clear counter
            clearInterval(counterLine); // clear counterline
            showResult() // calling showResult Function
        }
    }

    function showQuestions(index) {
        const question_text = document.getElementById("question-text");
        console.log('questionsArray:', questionsArray);
        console.log('index:', index);
        // Check if questionsArray[index] is defined
        if (questionsArray[index]) {
            // creating a new span and div tag for question and option 
            let que_tag = '<h2>' + (que_count+1) + ". " + questionsArray[index].question + '</h2>';
            let option_tag = '<button class= "option"><span>' + questionsArray[index].option[0] + '<span></button>'
                            + '<button class= "option"><span>' + questionsArray[index].option[1] + '<span></button>'
                            + '<button class= "option"><span>' + questionsArray[index].option[2] + '<span></button>'
                            + '<button class= "option"><span>' + questionsArray[index].option[3] + '<span></button>';
            question_text.innerHTML = que_tag; // adding new h2 tag inside que tag
            option_list.innerHTML = option_tag; // adding new div tag inside option tag
            const option = option_list.querySelectorAll(".option");
            // set onclick attribute to all available options
            for (let i = 0; i < option.length; i++) {
                option[i].setAttribute("onclick", "optionSelected(this)");
            }
        } else {
            console.error("Undefined questionsArray at index", index);
        }
    }

    // creating the new div tags which for icons
    let tickIconTag = '<div class = "icon tick"><i class = "fas fa-check"></i></div>';
    let crossIconTag = '<div class = "icon cross"><i class = "fas fa-times"></i></div>';


    function optionSelected(answer){
        clearInterval(counter); // clear counter
        clearInterval(counterLine); // clear counterline
        const questionCircles = document.getElementById('question-circles').children;
        const questionCircle = questionCircles[que_count];
        let userAns = answer.textContent; // getting user selected option;
        let correctAns = questionsArray[que_count].answer // getting correct 
        const allOptions = option_list.children.length;// getting elements from parent options class
        if (userAns == correctAns){
            userScore += 5;
            score.innerHTML = `Score: ${userScore}/50`;
            answer.classList.add("correct"); // adding green color to corrected selected option
            answer.insertAdjacentHTML("beforeend",tickIconTag);// adding tick icon to correct selected option;
            questionCircle.classList.add('correct_circle');
            console.log("Correct Answer ");
            console.log(userScore);
        }
        else{
            userScore -= 2;
            if(userScore <= 0){
                userScore = 0;
            }
            score.innerHTML = `Score: ${userScore}/50`;
            answer.classList.add("incorrect"); // adding a red color to the correct selected option
            answer.insertAdjacentHTML("beforeend",crossIconTag); //adding the wrong icon to the selected amswer
            questionCircle.classList.add('incorrect_circle');
            console.log("Wrong Answer");
            for(i=0; i < allOptions; i++){
                if(option_list.children[i].textContent == correctAns){
                    option_list.children[i].setAttribute("class","option correct");
                    option_list.children[i].insertAdjacentHTML("beforeend",tickIconTag);// adding tick icon to correct selected option;
                    console.log("Auto selected correct answer");
                }
            }
        }
        for(i=0;i<allOptions;i++){
            console.log("disabled")
            option_list.children[i].classList.add("disabled"); // disable all the options
        }
        next_btn.classList.add("show");
    }

    function showResult() {
        quiz_box.classList.add("quiz_inactive"); // hide the quiz info 
        result_box.classList.add("activeResult"); // show result box
        const scoreText = result_box.querySelector(".score_text");
        const circularProgress = document.querySelector(".circular-progress");
        const progressValue = document.querySelector(".progress-value");
        const animationContainer = document.querySelector(".animation-container");
        const progressEndValue = (userScore / 50) * 100;
        let progressStartValue = 0;
        const speed = 100;

        // Display the appropriate score text based on user score
        if (userScore > 30) {
            let scoreTag = '<span> Congrats! 🎉🎉, You got <p>' + userScore + '</p> out of 50 points</span>';
            scoreText.innerHTML = scoreTag;
            let animationTag = '<dotlottie-player src="https://lottie.host/650a1781-08bf-4be9-b017-a4c0317f67b4/EQfdmtzlCH.json" background="transparent" speed="1" style="width: 700px; height: 700px;" loop = "5" autoplay></dotlottie-player>';
            // Set animation HTML to the container
            animationContainer.innerHTML = animationTag;
        } else if (userScore > 20) {
            let scoreTag = '<span> Great effort! 👍👍, You got <p>' + userScore + '</p> out of 50 points</span>';
            scoreText.innerHTML = scoreTag;
        } else {
            let scoreTag = '<span> Better luck next time! 💪💪, You got <p>' + userScore + '</p> out of 50 points</span>';
            scoreText.innerHTML = scoreTag;
        }

        // Update circular progress
        const progress = setInterval(() => {
            progressStartValue++;
            progressValue.textContent = `${progressStartValue}%`;
            circularProgress.style.background = `conic-gradient(#7d2ae8 ${progressStartValue * 3.6}deg, #ededed 0deg)`;

            if (progressStartValue === progressEndValue) {
                clearInterval(progress);
            }

            if (progressEndValue === 0) {
                progressStartValue = 0;
                progressValue.textContent = `${progressStartValue}%`;
                circularProgress.style.background = `conic-gradient(#7d2ae8 ${progressStartValue * 3.6}deg, #c8c8c8 0deg)`;
            }
        }, speed);
        const playername = sessionStorage.getItem('username');
        sessionStorage.setItem('quizResult', JSON.stringify({
            username:playername,
            score: userScore,
            quizTitle: questionheader
        }));
        console.log('Stored Quiz Result:', sessionStorage.getItem('quizResult'));
    }


    function startTimer(time){
        counter = setInterval(timer,1000);
        function timer(){
            timeCount.textContent = time; // changing the value of timeCount with the timeValue
            time--; //decreamnet of time value
            if(time < 9){
                let addZero = timeCount.textContent;
                timeCount.textContent = "0"+addZero // add zero for values less than 9 so that 09
            }
            if(time<0){
                clearInterval(counter); //clear interval
                const questionCircles = document.getElementById('question-circles').children;
                const questionCircle = questionCircles[que_count];
                const allOptions = option_list.children.length;
                let correctAns = questionsArray[que_count].answer; // getting teh correct ans
                for(i=0; i < allOptions; i++){
                    if(option_list.children[i].textContent == correctAns){
                        userScore -= 2;
                        if(userScore <= 0){
                            userScore = 0;
                        }
                        score.innerHTML = `Score: ${userScore}/50`;
                        questionCircle.classList.add('incorrect_circle');
                        option_list.children[i].setAttribute("class","option correct");
                        option_list.children[i].insertAdjacentHTML("beforeend",tickIconTag);// adding tick icon to correct selected option;
                        console.log("Auto selected correct answer");
                    }
                }
                for(i=0;i<allOptions;i++){
                    option_list.children[i].classList.add("disabled"); // disable all the options
                }
                next_btn.classList.add("show");
            }
        }
    }
    function startTimerLine(time){
        counterLine = setInterval(timer,17)
        function timer(){
            time +=1;
            time_line.style.width = time + "px";
            if (time > 900){
                clearInterval(counterLine);
            }
        }
    }
    function queCounter(index){
        let totalQueCountTag = '<p>'+ index + ' of 10 Questions </p>';
        bottom_ques_counter .innerHTML = totalQueCountTag;

    }
    function resetQuestionCircles() {
        const questionCircles = document.getElementById('question-circles').children;

        for (let i = 0; i < questionCircles.length; i++) {
            questionCircles[i].classList.remove('correct_circle', 'incorrect_circle');
        }
    }