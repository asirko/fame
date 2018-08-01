const jsonOfQuestions = [

];

let currentQuestionIndex = null;

const getCurrentQuestion = () => {
  if (!currentQuestionIndex) {
    return currentQuestionIndex;
  }
  return { ...jsonOfQuestions[currentQuestionIndex] };
};

const nextQuestion = () => {
  if (currentQuestionIndex === null && jsonOfQuestions.length === 0) {
    currentQuestionIndex = undefined;
  } else if (currentQuestionIndex === null) {
    currentQuestionIndex = 0;
  } else if (currentQuestionIndex === jsonOfQuestions.length - 1) {
    currentQuestionIndex === undefined;
  } else {
    currentQuestionIndex++;
  }
  return getCurrentQuestion();
};

exports.getCurrentQuestion = getCurrentQuestion;
exports.nextQuestion = nextQuestion;
