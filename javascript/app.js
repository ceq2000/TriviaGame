var questions = [{
    question: "1. Which is least likely to lower your blood pressure?",
    choices: ["a. low-fat yogurt", "b. cantaloupe", "c. whole-grain bread", "d. spinach", "e. brocoli"],
    correctAnswer: 2
}, {
    question: "2. Vitamin D may reduce the risk of all but one of these. Which one?",
        choices: ["a. bone loss", "b. colon cancer", "c. gum disease", "d. irritable bowel", "e. multiple sclerosis"],
    correctAnswer: 3
}, {
    question: "3. Which is least likely to reduce your risk of diabetes?",
        choices: ["a. whole-grain cereal", "b. nuts", "c. salad dressing", "d. alcoholic drinks", "e. orange juice"],
    correctAnswer: 4
}, {
    question: "4. Which is least likely to lower your risk of colon cancer?",
        choices: ["a. lean meat", "b. whole-grain bread", "c. low-fat milk", "d. a multivitamin", "e. exercise"],
    correctAnswer: 0
}, {
    question: "5. Which is least likely to lower your risk of brittle bones (osteoporosis)?",
        choices: ["a. low-fat yogurt", "b. collard greens", "c. olive oil", "d. a multivitamin", "e. sunshine"],
    correctAnswer: 4
}, {
    question: "6. Which is least likely to cause food poisoning?",
        choices: ["a. raw sprouts", "b. chicken", "c. salad", "d. mayonnaise", "e. beef"],
    correctAnswer: 3
}, {
    question: "7. Which of the following foods is highest in protein?",
    choices: ["a. sweet potato", "b. cereal", "c. black beans", "d. popcorn", "e. broccoli"],
    correctAnswer: 2
}, {
    question: "8. Which two nutrients give the body most of it's energy?",
        choices: ["a. vitamins-minerals", "b. sugar-fat", "c. carbohydrates-fat", "d. magnesium-iron", "e. zinc-manganese"],
    correctAnswer: 2
}, {
    question: "9. Which of the following is considered a saturated fat?",
        choices: ["a. butter", "b. margarine", "c. salt", "d. olive oil", "e. lard"],
    correctAnswer: 3
}, {
    question: "10. Which of the following fats is considered healthy?",
        choices: ["a. saturated", "b. butter", "c. unsaturated", "d. lard", "e. palm oil"],
    correctAnswer: 0    
}];


var currentQuestion = 0;
var viewingAns = 0;
var correctAnswers = 0;
var quizOver = false;
var iSelectedAnswer = [];
var c = 180;
var t;
$(document).ready(function () {
    // Display the first question
    displayCurrentQuestion();
    $(this).find(".quizMessage").hide();
    $(this).find(".preButton").attr('disabled', 'disabled');

    timedCount();

    $(this).find(".preButton").on("click", function () {

        if (!quizOver) {
            if (currentQuestion == 0) { return false; }

            if (currentQuestion == 1) {
                $(".preButton").attr('disabled', 'disabled');
            }

            currentQuestion--; // Since we have already displayed the first question on DOM ready
            if (currentQuestion < questions.length) {
                displayCurrentQuestion();

            }
        } else {
            if (viewingAns == 3) { return false; }
            currentQuestion = 0; viewingAns = 3;
            viewResults();
        }
    });


    // On clicking next, display the next question
    $(this).find(".nextButton").on("click", function () {
        if (!quizOver) {

            var val = $("input[type='radio']:checked").val();

            if (val == undefined) {
                $(document).find(".quizMessage").text("***select your answer below before proceeding***");
                $(document).find(".quizMessage").show();
            }
            else {
                // TODO: Remove any message -> not sure if this is efficient to call this each time....
                $(document).find(".quizMessage").hide();
                if (val == questions[currentQuestion].correctAnswer) {
                    correctAnswers++;
                }
                iSelectedAnswer[currentQuestion] = val;

                currentQuestion++; // Since we have already displayed the first question on DOM ready
                if (currentQuestion >= 1) {
                    $('.preButton').prop("disabled", false);
                }
                if (currentQuestion < questions.length) {
                    displayCurrentQuestion();

                }
                else {
                    displayScore();
                    $('#iTimeShow').html('Quiz Time Completed!');
                    $('#timer').html("You scored: " + correctAnswers + " out of: " + questions.length);
                    c = 185;
                    $(document).find(".preButton").text("Review Your Answers");
                    $(document).find(".nextButton").text("Play Again?");
                    quizOver = true;
                    return false;

                }
            }

        }
        else { // quiz is over and clicked the next button (which now displays 'Play Again?'
            quizOver = false; $('#iTimeShow').html('Time Remaining:'); iSelectedAnswer = [];
            $(document).find(".nextButton").text("Next Question");
            $(document).find(".preButton").text("Previous Question");
            $(".preButton").attr('disabled', 'disabled');
            resetQuiz();
            viewingAns = 1;
            displayCurrentQuestion();
            hideScore();
        }
    });
});



function timedCount() {
    if (c == 185) {
        return false;
    }

    var hours = parseInt(c / 3600) % 24;
    var minutes = parseInt(c / 60) % 60;
    var seconds = c % 60;
    var result = (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds);
    $('#timer').html(result);

    if (c == 0) {
        displayScore();
        $('#iTimeShow').html('Quiz Time Completed!');
        $('#timer').html("You scored: " + correctAnswers + " out of: " + questions.length);
        c = 185;
        $(document).find(".preButton").text("View Answer");
        $(document).find(".nextButton").text("Play Again?");
        quizOver = true;
        return false;

    }
    c = c - 1;
    t = setTimeout(function () {
        timedCount()
    }, 1000);
}


// This displays the current question AND the choices
function displayCurrentQuestion() {

    if (c == 185) { c = 180; timedCount(); }
    //console.log("In display current Question");
    var question = questions[currentQuestion].question;
    var questionClass = $(document).find(".quizContainer > .question");
    var choiceList = $(document).find(".quizContainer > .choiceList");
    var numChoices = questions[currentQuestion].choices.length;
    // Set the questionClass text to the current question
    $(questionClass).text(question);
    // Remove all current <li> elements (if any)
    $(choiceList).find("li").remove();
    var choice;


    for (i = 0; i < numChoices; i++) {
        choice = questions[currentQuestion].choices[i];

        if (iSelectedAnswer[currentQuestion] == i) {
            $('<li><input type="radio" class="radio-inline" checked="checked"  value=' + i + ' name="dynradio" />' + ' ' + choice + '</li>').appendTo(choiceList);
        } else {
            $('<li><input type="radio" class="radio-inline" value=' + i + ' name="dynradio" />' + ' ' + choice + '</li>').appendTo(choiceList);
        }
    }
}

function resetQuiz() {
    currentQuestion = 0;
    correctAnswers = 0;
    hideScore();
}

function displayScore() {
    $(document).find(".quizContainer > .result").text("You scored: " + correctAnswers + " out of: " + questions.length);
    $(document).find(".quizContainer > .result").show();
}

function hideScore() {
    $(document).find(".result").hide();
}

// This displays the current question AND the choices
function viewResults() {

    if (currentQuestion == 10) { currentQuestion = 0; return false; }
    if (viewingAns == 1) { return false; }

    hideScore();
    var question = questions[currentQuestion].question;
    var questionClass = $(document).find(".quizContainer > .question");
    var choiceList = $(document).find(".quizContainer > .choiceList");
    var numChoices = questions[currentQuestion].choices.length;
    // Set the questionClass text to the current question
    $(questionClass).text(question);
    // Remove all current <li> elements (if any)
    $(choiceList).find("li").remove();
    var choice;


    for (i = 0; i < numChoices; i++) {
        choice = questions[currentQuestion].choices[i];

        if (iSelectedAnswer[currentQuestion] == i) {
            if (questions[currentQuestion].correctAnswer == i) {
                $('<li style="border:2px solid green;margin-top:10px;"><input type="radio" class="radio-inline" checked="checked"  value=' + i + ' name="dynradio" />' + ' ' + choice + '</li>').appendTo(choiceList);
            } else {
                $('<li style="border:2px solid red;margin-top:10px;"><input type="radio" class="radio-inline" checked="checked"  value=' + i + ' name="dynradio" />' + ' ' + choice + '</li>').appendTo(choiceList);
            }
        } else {
            if (questions[currentQuestion].correctAnswer == i) {
                $('<li style="border:2px solid green;margin-top:10px;"><input type="radio" class="radio-inline" value=' + i + ' name="dynradio" />' + ' ' + choice + '</li>').appendTo(choiceList);
            } else {
                $('<li><input type="radio" class="radio-inline" value=' + i + ' name="dynradio" />' + ' ' + choice + '</li>').appendTo(choiceList);
            }
        }
    }

    currentQuestion++;

    setTimeout(function () {
        viewResults();
    }, 3000);
}
