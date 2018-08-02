const jsonOfQuestions = [
  {
    question: 'Quel est la couleur blanche du cheval d\'Henry IV',
    answers: [
      {
        label: 'Jaune',
        isTrue: false
      }, {
        label: 'Verte',
        isTrue: false
      }, {
        label: 'Bleu',
        isTrue: false
      }, {
        label: 'Blanc',
        isTrue: true
      }
    ]
  }
];

let currentQuestionIndex = null;

const getCurrentQuestion = () => {
  if (!currentQuestionIndex && currentQuestionIndex !== 0) {
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
    currentQuestionIndex = undefined;
  } else {
    currentQuestionIndex++;
  }
  return getCurrentQuestion();
};

exports.getCurrentQuestion = getCurrentQuestion;
exports.nextQuestion = nextQuestion;
