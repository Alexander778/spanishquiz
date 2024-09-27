function updateWordsCounter() {
  let wordsCounter = parseInt(localStorage.getItem("wordsCounter"));
  if (isNaN(wordsCounter)) {
    wordsCounter = 0;
  }
  localStorage.setItem("wordsCounter", wordsCounter + 1);
}

function startQuiz() {
  const questionElement = document.querySelector(".question");
  const answersElement = document.querySelector(".answers");
  const counterElement = document.querySelector(".counter");
  const resetButton = document.querySelector("#reset-btn");

  resetButton.addEventListener("click", () => {
    localStorage.setItem("wordsCounter", 0);
    localStorage.setItem("alreadyMentionedWords", JSON.stringify([]));
  });

  const questionWord = getRandomWord();
  const isTranslationInTheQuestion = Math.random() < 0.2;
  const manualQuiz = Math.random() < 0.5;
  const correctAnswer = isTranslationInTheQuestion
    ? questionWord.word
    : questionWord.translation;

  questionElement.textContent = `${
    isTranslationInTheQuestion ? questionWord.translation : questionWord.word
  }`;
  answersElement.innerHTML = "";

  if (manualQuiz) {
    const input = document.createElement("input");
    input.id = "input-value";
    input.style.marginBottom = "10px";
    input.style.width = "97%";

    const okButton = document.createElement("button");
    okButton.textContent = "Ok";
    okButton.addEventListener("click", () => {
      if (document.getElementById("input-value").value.toLowerCase() !== correctAnswer.toLowerCase()) {
        alert("Wrong!");
      } else {
        updateWordsCounter();
        startQuiz();
      }
    });

    const hintButton = document.createElement("button");
    const hintText = document.createElement("span");
    hintText.style.display = "flex";
    hintText.style.justifyContent = "center";
    hintText.style.color = "green";
    hintText.style.fontWeight = "600";

    hintButton.textContent = "Show answer";
    hintButton.addEventListener("click", () => {
      hintText.innerHTML = correctAnswer;
    });

    answersElement.append(input);
    answersElement.append(okButton);
    answersElement.append(hintButton);
    answersElement.append(hintText);
  } else {
    const answerOptions = getAnswerOptions(
      questionWord,
      correctAnswer,
      isTranslationInTheQuestion
    );
    answerOptions.forEach((answer) => {
      const button = document.createElement("button");
      button.textContent = answer;
      button.addEventListener("click", () => {
        if (answer.toLowerCase() !== correctAnswer.toLowerCase()) {
          alert("Wrong!");
        } else {
          updateWordsCounter();
          startQuiz();
        }
      });
      answersElement.appendChild(button);
    });
  }

  const nextButton = document.createElement("button");
  nextButton.textContent = "Next";
  nextButton.style.marginTop = "30px";
  nextButton.style.backgroundColor = "lightGreen";
  nextButton.addEventListener("click", () => {
    startQuiz();
  });
  answersElement.append(nextButton);

  counterElement.textContent = `Words counter: ${localStorage.getItem(
    "wordsCounter"
  )}`;
}

function getRandomWord() {
  const randomIndex = Math.floor(Math.random() * words.length);

  let alreadyMentionedWords = JSON.parse(localStorage.getItem("alreadyMentionedWords"));
  if (alreadyMentionedWords === null) {
    alreadyMentionedWords = [];
    localStorage.setItem("alreadyMentionedWords", JSON.stringify(alreadyMentionedWords));
  }

  if (alreadyMentionedWords.includes(randomIndex)) {
    const showSameWordAgain = Math.random() < 0.10;
    if (!showSameWordAgain) {
      return getRandomWord();
    }
  }

  alreadyMentionedWords.push(randomIndex);
  localStorage.setItem("alreadyMentionedWords", JSON.stringify(alreadyMentionedWords));

  return words[randomIndex];
}

function getAnswerOptions(
  questionWord,
  correctAnswer,
  isTranslationInTheQuestion
) {
  const options = [
    isTranslationInTheQuestion ? questionWord.word : questionWord.translation,
  ];
  const sameTypeWords = words.filter(
    (word) => word.word !== correctAnswer && word.type === questionWord.type
  );

  while (options.length < 4) {
    const randomIndex = Math.floor(Math.random() * sameTypeWords.length);
    const randomWord = sameTypeWords.splice(randomIndex, 1)[0];
    options.push(
      isTranslationInTheQuestion ? randomWord.word : randomWord.translation
    );
  }

  return shuffle(options);
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

startQuiz();
