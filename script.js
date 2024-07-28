const form = document.querySelector(".quiz-form");
const load = document.querySelector(".loader-container");
const loader = document.querySelector(".loader");

function createQuestion(questionText) {
  const question = document.createElement("div");
  question.setAttribute("class", "question");

  const ques = document.createElement("p");
  ques.appendChild(document.createTextNode(questionText));
  question.appendChild(ques);

  return question;
}

function createOptions(questionNum, options, checked = 0) {
  const option = document.createElement("div");
  option.setAttribute("class", "option");

  const radio = document.createElement("input");
  radio.setAttribute("type", "radio");
  radio.setAttribute("name", "q" + questionNum);
  radio.setAttribute("value", options);

  if (checked === 1) {
    radio.setAttribute("checked", "checked");
  }

  const label = document.createElement("label");
  label.setAttribute("for", "");
  const textNode = document.createTextNode(options);
  label.appendChild(textNode);

  option.appendChild(radio);
  option.appendChild(label);

  return option;
}

function creatSubmitBtn() {
  const sumbitDiv = document.createElement("div");
  sumbitDiv.setAttribute("class", "submit");

  const input = document.createElement("input");
  input.setAttribute("type", "submit");
  input.setAttribute("value", "Submit");

  sumbitDiv.appendChild(input);

  return sumbitDiv;
}

async function fechQuestions() {
  let obj = null;

  try {
    const data = await fetch("/questions.json");
    // const pro = await Promise.resolve(data);
    obj = await data.json();
    localStorage.setItem("Harish", JSON.stringify(obj));
  } catch (error) {
    console.log(error);
  }

  return obj;
}

let objs = new Map();
let correctAns = [];

function appendingQuestions() {
  let data = localStorage.getItem("Harish");
  console.log(JSON.parse(data));
  jsonObj = fechQuestions().then((q) => {
    load.classList.remove("loader-container");
    loader.classList.remove("loader");

    let jsonQues = q;

    objs.set("count", jsonQues.count);

    for (let i = 1; i <= jsonQues.count; i++) {
      objs.set(`${i}`, jsonQues[i]);
      correctAns.push(jsonQues[i].correctAnswer);

      const finalQuestion = createQuestion(`${i}. ${jsonQues[i].question}`);
      finalQuestion.appendChild(createOptions(`${i}`, `${jsonQues[i].A}`, 1));
      finalQuestion.appendChild(createOptions(`${i}`, `${jsonQues[i].B}`));
      finalQuestion.appendChild(createOptions(`${i}`, `${jsonQues[i].C}`));
      finalQuestion.appendChild(createOptions(`${i}`, `${jsonQues[i].D}`));
      form.appendChild(finalQuestion);
    }

    form.appendChild(creatSubmitBtn());
  });
}
appendingQuestions();

const result = document.querySelector(".result");
let submitButtonCount = 0;

form.addEventListener("submit", (event) => {
  event.preventDefault();

  let score = 0;
  let userCorrentAns = [form.q1.value, form.q2.value, form.q3.value, form.q4.value, form.q5.value];
  const questioncolor = document.querySelectorAll(".question");

  // const userValue = document.querySelector('.option input');
  // for(let i = 0; i < objs.get('count'); i++){

  //     userCorrentAns.push(userValue.getAttribute('value'))
  // }

  userCorrentAns.forEach((answer, index) => {
    questioncolor[index].classList.remove("correct");
    questioncolor[index].classList.remove("wrong");

    if (answer === correctAns[index]) {
      score++;
      questioncolor[index].classList.add("correct");
    } else {
      questioncolor[index].classList.add("wrong");
    }
  });

  scrollTo(0, 0);
  result.classList.remove("hide");
  result.querySelector("p").textContent = `you scored ${score}/5!`;
  const submitBtn = document.querySelector(".submit input");
  const SubmitDiv = document.querySelector(".submit");

  // let disable = submitBtn.classList;

  // function myFunction() {
  //     var x = document.getElementById("snackbar");
  //     x.className = "show";
  //     setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
  // }

  // console.log(disable)

  // disable.forEach(p => {

  //     if(p === 'disabled'){

  //         myFunction();
  //     }
  // })

  if (submitButtonCount === 0) {
    submitBtn.style.display = "none";
    const but = document.createElement("button");
    but.append(document.createTextNode("submit"));
    SubmitDiv.appendChild(but);
    submitButtonCount++;
  }

  submitBtn.setAttribute("disabled", "");
  submitBtn.remove();
});

const tryAgainBtn = document.querySelector(".reload button");
const removeQuestions = document.querySelector(".question");

tryAgainBtn.addEventListener("click", (event) => {
  // event.stopPropagation();
  load.classList.add("loader-container");
  loader.classList.add("loader");
  form.replaceChildren(appendingQuestions());
  form.textContent = "";
  result.classList.add("hide");
});
