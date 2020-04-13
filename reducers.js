import { createStore } from 'redux';
import { Notifications } from 'expo';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import * as actions from './actions';
import * as strings from './strings';

const initialState = {
  eventCode: "",
  event: null, // will be like this: { data: { name: "Asd", code: XYZW, frequency: <minutes>, from: <Date>, until: <Date> }, },
  questions: {}, // map from question id to question data like this: 
                 // { id: "...",
                 //   data: <data in firestore>,
                 //   next: <next question id>
                 //   answerCount: 0,
                 //   lastAnswerTime: null, };
  firstQuestion: "",
  questionToShow: "",
  name: "",
  noQuestionText: strings.INITIAL_TEXT,
  jokes: {
    last: {id: -1, first: "firstpart", second: "secondpart"},
    new:  {id:  0, first: "newfirst",  second: "newsecond"},
  },
  spinner: false,
}

export default function feedbackReducer(state = initialState, action) {
  console.log(action.type);
  switch (action.type) {
    case actions.SET_EVENT:
      return Object.assign({}, state, {
        event: action.event,
        eventCode: action.event.code, // redundant, but we want to retain it.
      });
    case actions.SET_NAME:
      return Object.assign({}, state, {
        name: action.name
      });
    case actions.CLEAR_QUESTIONS:
      return Object.assign({}, state, {
        questions: {}
      });
    case actions.CHANGE_TEXT:
      return Object.assign({}, state, {
        noQuestionText: action.text
      });
    case actions.ADD_QUESTION:
      let entry = {};
      entry[action.id] = { id: action.id, data: action.data, next: action.next, answerCount: 0, lastAnswerTime: null, };
      console.log(entry);
      if (action.index == 0)
        return Object.assign({}, state, {
          questions: Object.assign({}, state.questions, entry),
          firstQuestion: action.id
        });
      else return Object.assign({}, state, {
        questions: Object.assign({}, state.questions, entry)
      });
    case actions.ADD_ANSWER:
      let newState = Object.assign({}, state);
      newState.questions[action.questionId].answerCount++;
      newState.questions[action.questionId].lastAnswerTime = action.answer.timestamp;
      newState.questionToShow = state.questions[state.questionToShow].next;
      newState.noQuestionText = strings.THANK_YOU_TEXT;
      return newState;
    case actions.SHOW_FIRST:
      return Object.assign({}, state, {
        questionToShow: state.firstQuestion
      });
    case actions.SPINNER_ON:
      return Object.assign({}, state, {
        spinner: true
      });
    case actions.SPINNER_OFF:
      return Object.assign({}, state, {
        spinner: false
      });
    case actions.LEAVE_EVENT:
      Notifications.cancelAllScheduledNotificationsAsync();
      newState = Object.assign({}, initialState);
      newState.name = state.name;
      newState.eventCode = state.eventCode;
      return newState;
    case actions.RESET:
      return initialState;
    default:
      return state;
  }
}

const persistConfig = {
  key: 'root',
  storage: storage,
  stateReconciler: autoMergeLevel2,
  blacklist : ['spinner']
 };

const pReducer = persistReducer(persistConfig, feedbackReducer);
export const store = createStore(pReducer);
export const persistor = persistStore(store);
