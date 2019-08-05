import { createStore } from 'redux';
import { Notifications } from 'expo';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

// Actions:
// SET_EVENT {event}
// SET_NAME {name}
// ADD_QUESTION {id, data}
// ADD_ANSWER {questionId, answer}
// SHOW_NEXT_DUE_QUESTION
// MAKE_QUESTION_DUE {questionId}
// SET_QUESTION_SCHEDULE_TIME {questionId, timestamp}
// SPINNER_ON
// SPinner_OFF
// LEAVE_EVENT
// RESET

const initialState = {
  eventCode: "",
  event: null, // will be like this: { data: { name: "", }, },
  questions: {},
  dueQuestionIds: [],
  questionToShow: "",
  name: "",
  noQuestionText: "Majd küldünk értesítést, ha kapsz kitöltendő kérdést.\nMost nyugodtan elhagyhatod az applikációt a home gombbal.",
  spinner: false,
}

export default function feedbackReducer(state = initialState, action) {
  console.log(action.type);
  switch (action.type) {
    case 'SET_EVENT':
      return Object.assign({}, state, {
        event: action.event,
        eventCode: action.event.code, // redundant, but we want to retain it.
      });
    case 'SET_NAME':
      return Object.assign({}, state, {
        name: action.name
      });
    case 'ADD_QUESTION':
      let entry = {};
      console.log(action.data);
      entry[action.id] = { id: action.id, data: action.data, answerCount: 0, lastAnswerTime: null, scheduledFor: null, };
      return Object.assign({}, state, {
        questions: Object.assign({}, state.questions, entry)
      });
    case 'ADD_ANSWER':
      let newState = Object.assign({}, state);
      newState.questions[action.questionId].answerCount++;
      newState.questions[action.questionId].lastAnswerTime = action.answer.timestamp;
      newState.questionToShow = "";
      newState.noQuestionText = "Köszönjük eddigi válaszaidat.\nKésőbb majd küldünk értesítést, " + 
                                "ha kapsz kitöltendő kérdést.\nMost nyugodtan elhagyhatod az applikációt a home gombbal.";
      return newState;
    case 'SHOW_NEXT_DUE_QUESTION':
      if (state.dueQuestionIds.length === 0)
        return Object.assign({}, state, {
          questionToShow: "", // restore to show <no question> page 
        });
      else {
        newState = Object.assign({}, state);
        newState.dueQuestionIds.sort((a, b) => newState.questions[a].data.order - newState.questions[b].data.order);
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
      newState = Object.assign({}, initialState);
      newState.name = state.name;
      newState.eventCode = state.eventCode;
      return newState;
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

const persistConfig = {
  key: 'root',
  storage: storage,
  stateReconciler: autoMergeLevel2
 };

const pReducer = persistReducer(persistConfig, feedbackReducer);
export const store = createStore(pReducer);
export const persistor = persistStore(store);
