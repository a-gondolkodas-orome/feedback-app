import { createStore } from 'redux';
import { Notifications } from 'expo';

// Actions:
// SET_EVENT {event}
// SET_NAME {name}
// ADD_QUESTION {id, data}
// ADD_ANSWER {questionId, answer}
// SHOW_QUESTION {id}
// RESET

const initialState = {
  eventId: "",
  event: null, // will be like this: { data: { name: "", }, },
  questions: {},
  dueQuestionIds: [],
  questionToShow: "",
  name: "N Laci", // TODO: this is just for debugging, should be ""
  noQuestionText: "Majd küldünk értesítést, ha kapsz kitöltendő kérdést.",
  spinner: false,
}

export default function feedbackReducer(state = initialState, action) {
  console.log(action.type);
  switch (action.type) {
    case 'SET_EVENT':
      return Object.assign({}, state, {
        event: action.event,
        eventId: action.event.id, // redundant, we can delete
      });
    case 'SET_NAME':
      return Object.assign({}, state, {
        name: action.name
      });
    case 'ADD_QUESTION':
      let entry = {};
      entry[action.id] = { id: action.id, data: action.data, answerCount: 0, lastAnswerTime: null, scheduledFor: null, };
      return Object.assign({}, state, {
        questions: Object.assign({}, state.questions, entry)
      });
    case 'ADD_ANSWER':
      let newState = Object.assign({}, state);
      newState.questions[action.questionId].answerCount++;
      newState.questions[action.questionId].lastAnswerTime = action.answer.timestamp;
      newState.questionToShow = "";
      newState.noQuestionText = "Köszönjük eddigi válaszaidat. Majd küldünk értesítést, ha kapsz kitöltendő kérdést.";
      return newState;
    case 'SHOW_NEXT_DUE_QUESTION':
      if (state.dueQuestionIds.length === 0)
        return Object.assign({}, state, {
          questionToShow: "", // restore to show <no question> page 
        });
      else {
        newState = Object.assign({}, state);
        let questionId = newState.dueQuestionIds.shift();
        console.log('Q to show: ' + questionId);
        return Object.assign(newState, {
          questionToShow: questionId,
        });
      }
    case 'MAKE_QUESTION_DUE':
      newState = Object.assign({}, state);
      newState.questions[action.questionId].scheduledFor = null;
      newState.dueQuestionIds.push(action.questionId);
      return newState;
    case 'SET_QUESTION_SCHEDULE_TIME':
      newState = Object.assign({}, state);
      newState.questions[action.questionId].scheduledFor = action.timestamp;
      return newState;
    case 'SPINNER_ON':
      return Object.assign({}, state, {
        spinner: true
      });
    case 'SPINNER_OFF':
      return Object.assign({}, state, {
        spinner: false
      });
    case 'LEAVE_EVENT':
      Notifications.cancelAllScheduledNotificationsAsync();
      return initialState;
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

export const store = createStore(feedbackReducer);
