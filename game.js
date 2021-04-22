const question=document.getElementById("question");
const choices=Array.from(document.getElementsByClassName("choice-text"));
const progressText=document.getElementById("progressText");
const progressBarFull=document.getElementById("progressBarFull");
const scoreText=document.getElementById("score");
const loader=document.getElementById("loader");
const game=document.getElementById("game");
const nextBtn=document.getElementById("nextBtn");
const cont=Array.from(document.getElementsByClassName("choice-container"));

let currentQuestion={
};

let acceptingAnswers=false;
let score=0;
let questionCounter=0;
let availableQuestions=[];

let questions=[];
let ans=0;
fetch("https://opentdb.com/api.php?amount=50&category=9&difficulty=easy&type=multiple")
.then(res=>{
    return res.json();
})
.then(loadedQuestions=>{

    questions=loadedQuestions.results.map( loadedQuestion =>{
        const formattedQuestion ={
            question: loadedQuestion.question

        };
        const answerChoices=[...loadedQuestion.incorrect_answers];
        formattedQuestion.answer=Math.floor(Math.random()*3)+1;
        ans=formattedQuestion.answer;
        answerChoices.splice(formattedQuestion.answer-1,0,loadedQuestion.correct_answer);
        answerChoices.forEach((choice,index)=>{
            formattedQuestion["choice"+(index+1)]=choice;
            
        });
        return formattedQuestion;
    });

    startGame();
})
.catch(err=>{
    console.error(err);
});

//constants

const CORRECT_BONUS=10;
const MAX_QUESTION=5;
let l=0;
startGame = () =>{
    questionCounter=0;
    score=0;
    console.log(l);
    availableQuestions=[...questions];
    if(l===0)
    {
        getNewQuestion();
        l++;
    }
    
    game.classList.remove("hidden");
    loader.classList.add("hidden");
};

getNewQuestion=()=>{
    if( questionCounter>=MAX_QUESTION ||availableQuestions.length==0)
    {
        localStorage.setItem("mostRecentScore",(score*CORRECT_BONUS));
        return window.location.assign("end.html");
    }
    else{
    questionCounter++;
    const questionIndex=Math.floor(Math.random()*availableQuestions.length);
    currentQuestion=availableQuestions[questionIndex];
    question.innerText=currentQuestion.question;
    progressText.innerText=`Question : ${questionCounter}/${MAX_QUESTION}`;
    //update progress bar
    progressBarFull.style.width=`${(questionCounter/MAX_QUESTION)*100}%`;

    choices.forEach(choice=>{
        const number=choice.dataset['number'];
        choice.innerText=currentQuestion["choice"+number];
    });
    availableQuestions.splice(questionIndex,1);
    acceptingAnswers=true;
}

};

choices.forEach(choice=>{
  
    choice.addEventListener("click",e=>{

        if(!acceptingAnswers) return;
        acceptingAnswers=false;
        const selectedChoice=e.target;
        
        const selectedAnswer=selectedChoice.dataset["number"];
        let classToapply="incorrect";
        if(selectedAnswer==currentQuestion.answer)
        {
            classToapply="correct";
            score++;
            scoreText.innerText=score*CORRECT_BONUS;
        }
        selectedChoice.parentElement.classList.add(classToapply);
        choices.forEach(choice=>{
            if(choice.dataset['number']==currentQuestion.answer)
            {
                choice.parentElement.classList.add("correct");

            }
        })
        console.log(selectedChoice.parentElement);
        
      

    });
});

nextBtn.addEventListener("click",
e=>{
    cont.forEach(myFunction);
    console.log("nextBtn clicked!!");
    getNewQuestion();
})

function myFunction(element)
{
    const classList1 = element.className.split(/\s+/);

    for (let i = 0; i < classList1.length; i++) 
    {
    if (classList1[i] === 'incorrect') {

        element.classList.remove("incorrect");
    }
    else if (classList1[i] === 'correct') {
        element.classList.remove("correct");
    }
    else{
        console.log(classList1[i]);
    }
  l++;
  console.log(l);
  }
}


