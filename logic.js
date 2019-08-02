import * as firebase from 'firebase';
import '@firebase/firestore';
import { store } from './reducers';
import { Notifications } from 'expo';

export function chooseQuestion() {
  // Just show the first wordcloud question.
  const ids = Object.keys(store.getState().questions);
  for (const id of ids) {
    const question = store.getState().questions[id];
    //console.log(question);
    if (question.data.type.startsWith("word")) {
      store.dispatch({ type: 'SHOW_QUESTION', id: id });
    }
  }
}

export function loadQuestions() {
  const db = firebase.firestore();
  db.collection("events").doc(store.getState().event.id).collection("questions")
    .get()
    .then(function(querySnapshot) {
      if (querySnapshot.size == 0) {
        console.log("Did not find questions for event: " + eventRef.path);
        return;
      }
      for (const doc of querySnapshot.docs) {
        if (! (doc.id in store.getState().questions)) {
          store.dispatch({ type: 'ADD_QUESTION', id: doc.id, data: doc.data(), });
        }
      }
      scheduleAllLoadedQuestions();
//      chooseQuestion();
    })
    .catch(function(error) {
      console.log("Error getting questions: ", error);
      // TODO: display error
    });
    store.dispatch({ type: 'SPINNER_OFF' });
}

//const minTimeBetweenNotifications = 5 * 60 * 1000;
const minTimeBetweenNotifications = 60 * 1000;
const randomRangeMultiplier = 0.1;

function scheduleQuestionAroundTime(id, timestamp, range) {
  const questions = store.getState().questions;
  let scheduleFor = -1;
  // Check already scheduled questions to group
  for (let id in questions) {
    // skip loop if the property is from prototype
    if (!questions.hasOwnProperty(id)) continue;
    let question = questions[id];
    if (question.scheduledFor != null && Math.abs(timestamp - question.scheduledFor) <
        Math.max(range, minTimeBetweenNotifications)) {
      scheduleFor = question.scheduledFor;
      break;
    }
  }
  if (scheduleFor == -1) {
    scheduleFor = timestamp + Math.floor((-1 + 2 * Math.random()) * range);
    Notifications.scheduleLocalNotificationAsync({
        title: 'Bejövő kérdés',
        body: 'Új kérdésed érkezett! Próbálj minél hamarabb válaszolni rá, csak pár másodpercet vesz igénybe.',
        ios: { sound: true },
        android: { channelId: "FeedbackAppNewQuestion", icon: "./assets/kisfej.png" }
      },
      {
        time: scheduleFor,
      }
    );
    console.log("Notification set for: " + (new Date(scheduleFor).toISOString()))
  }
  
  store.dispatch({ type: 'SET_QUESTION_SCHEDULE_TIME', questionId: id, timestamp: scheduleFor, });
}

function scheduleQuestionFromNow(id) {
  let now = (new Date()).getTime();
  const question = store.getState().questions[id];
  const freq = 60 * 1000 * question.data.frequency;
  scheduleQuestionAroundTime(question.id, now + freq, randomRangeMultiplier * freq);
}

export function scheduleAllLoadedQuestions() {
  const ids = Object.keys(store.getState().questions);
  for (const id of ids) {
    scheduleQuestionFromNow(id);
  }
}


export function addAnswer(questionId, answer) {
  store.dispatch({ type: 'ADD_ANSWER', questionId: questionId, answer: answer, });
  Notifications.dismissAllNotificationsAsync();
  scheduleQuestionFromNow(questionId);
  // After adding the answer we should display the next due question
  store.dispatch({ type: 'SHOW_NEXT_DUE_QUESTION' });
  store.dispatch({ type: 'SPINNER_OFF' });
}
