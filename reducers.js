
// Actions:
// SET_EVENT {event}
// SET_NAME {name}
// ADD_QUESTION {id, doc}
// ADD_ANSWER {questionId, answer}
// SHOW_QUESTION {id}
// RESET

const initialState = {
  event: null,
  questions: {},
  questionToShow: "",
  name: "",
}

export default function feedbackReducer(state = initialState, action) {
  switch (action.type) {
    case 'SET_EVENT':
      return Object.assign({}, state, {
        event: action.event
      });
    case 'SET_NAME':
      return Object.assign({}, state, {
        name: action.name
      });
    case 'ADD_QUESTION':
      let entry = {};
      entry[action.id] = { question: action.question, answerCount: 0, lastAnswerTime: null }
      return Object.assign({}, state, {
        questions: Object.assign({}, state.questions, entry)
      });
    case 'ADD_ANSWER':
      let newState = Object.assign({}, state);
      newState.questions[action.questionId].answerCount++;
      newState.questions[action.questionId].lastAnswerTime = answer.timestamp;
      return newState;
    case 'SHOW_QUESTION':
        return Object.assign({}, state, {
          questionToShow: action.id
        });      
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}