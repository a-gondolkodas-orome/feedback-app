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
  eventEnded: false,
  questions: {}, // map from question id to question data like this: 
                 // { id: "...",
                 //   data: <data in firestore>,
                 //   next: <next question id>
                 //   answerCount: 0,
                 //   firstAnswerTime: null,
                 //   lastAnswerTime: null, };
  firstQuestion: "",
  questionToShow: "",
  name: "",
  noQuestionText: strings.INITIAL_TEXT,
  jokes: {
    last: {first: "", second: ""},
    new:  {first: "",  second: ""},
    collection: {}
  },
  jokeInfo: "", // either of "", "csacsi-pacsi", "Rosszul összetett szavak"
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

    case actions.END_EVENT:
      return Object.assign({}, state, {
        noQuestionText: strings.EVENT_ENDED_TEXT,
        eventEnded: true
      });

    case actions.ADD_QUESTION:
      let entry = {};
      entry[action.id] = {
        id: action.id,
        data: action.data,
        next: action.next,
        answerCount: 0,
        firstAnswerTime: null,
        lastAnswerTime: null, };
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
      if (newState.questions[action.questionId].answerCount == 1) {
        newState.questions[action.questionId].firstAnswerTime = action.answer.timestamp;
        if (action.questionId == state.firstQuestion) newState.noQuestionText = strings.THANK_YOU_TEXT;
      }
      newState.questionToShow = state.questions[state.questionToShow].next;
      return newState;

    case actions.SHOW_FIRST:
      return Object.assign({}, state, {
        questionToShow: state.firstQuestion
      });

    case actions.ADD_JOKES:
      let collection = {};
      action.jokes.forEach(joke => collection[joke.id] = joke.data);
      return Object.assign({}, state, {
        jokes: Object.assign({}, state.jokes, {
          collection: collection
        })
      });
    
    case actions.UPDATE_JOKE:
      let newkey = Object.keys(state.jokes.collection)
        [Math.floor(Math.random() * Object.keys(state.jokes.collection).length)];
      let newcoll = {};
      Object.keys(state.jokes.collection).forEach(key => {
        if (key != newkey) newcoll[key] = state.jokes.collection[key];
      })
      return Object.assign({}, state, {
        jokes: {
          last: state.jokes.new,
          new:  state.eventEnded ? {first: "", second: ""} : state.jokes.collection[newkey],
          collection: newcoll
        }
      });

    case actions.SET_JOKE_INFO:
      return Object.assign({}, state, {
        jokeInfo: action.info
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
