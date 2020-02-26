import { createStore } from 'redux';
import { Notifications } from 'expo';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import * as actions from './actions';
import * as strings from './strings';

const initialState = {
  eventCode: "",
  event: null, // will be like this: { data: { name: "", }, },
  questions: {}, // map from question id to question data like this: 
                 // { id: "...", data: <data in firestore>, answerCount: 0, lastAnswerTime: null, };
  dueQuestionIds: [],
  questionToShow: "",
  name: "",
  noQuestionText: strings.INITIAL_TEXT,
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
    case actions.ADD_QUESTION:
      let entry = {};
      console.log(action.data);
      entry[action.id] = { id: action.id, data: action.data, answerCount: 0, lastAnswerTime: null, scheduledFor: null, };
      return Object.assign({}, state, {
        questions: Object.assign({}, state.questions, entry)
      });
    case actions.ADD_ANSWER:
      let newState = Object.assign({}, state);
      newState.questions[action.questionId].answerCount++;
      newState.questions[action.questionId].lastAnswerTime = action.answer.timestamp;
      newState.questionToShow = "";
      newState.noQuestionText = strings.THANK_YOU_TEXT;
      return newState;
    case actions.SHOW_NEXT_DUE_QUESTION:
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
    case actions.MAKE_QUESTION_DUE:
      newState = Object.assign({}, state);
      newState.questions[action.questionId].scheduledFor = null;
      newState.dueQuestionIds.push(action.questionId);
      return newState;
    case actions.SET_QUESTION_SCHEDULE_TIME:
      newState = Object.assign({}, state);
      newState.questions[action.questionId].scheduledFor = action.timestamp;
      return newState;
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
