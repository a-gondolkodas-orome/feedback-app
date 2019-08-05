import * as firebase from 'firebase';
import '@firebase/firestore';
import { store } from './reducers';
import { Notifications } from 'expo';


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
    })
    .catch(function(error) {
      console.log("Error getting questions: ", error);
      // TODO: display error
    });
    store.dispatch({ type: 'SPINNER_OFF' });
}

//const minTimeBetweenNotifications = 60 * 1000;
const minTimeBetweenNotifications = 5 * 60 * 1000;
// TODO: consider moving this to question fields
const randomRangeMultiplier = 0.2;
const minHours = 9; // 9:00 is the first valid
const maxHours = 22; // 22:59 is still valid

// Schedule forward or backward during the night.
function adjustTimestamp(timestamp) {
  let datetime = new Date(timestamp);
  // This is not exactly good, but will be just fine for now. TODO: implement it correctly
  if (datetime.getHours() > maxHours) {
    datetime.setHours(maxHours);
    // don't change minutes
  }
  if (datetime.getHours < minHours) {
    datetime.setHours(datetime.getHours() + minHours);
    // don't change minutes
  }
  return datetime.getTime();
}

function scheduleQuestionAroundTime(questionId, timestamp, range) {
  const questions = store.getState().questions;
  timestamp = adjustTimestamp(timestamp);
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
    scheduleFor = adjustTimestamp(scheduleFor);
    if (scheduleFor / 1000 < questions[questionId].data.until.seconds) {
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
      console.log("Notification set for: " + (new Date(scheduleFor).toLocaleTimeString()));
    }
  }
  
  if (scheduleFor / 1000 < questions[questionId].data.until.seconds) {
    store.dispatch({ type: 'SET_QUESTION_SCHEDULE_TIME', questionId: questionId, timestamp: scheduleFor, });
  }
}

function scheduleQuestionFromNow(id) {
  let now = (new Date()).getTime();
  const question = store.getState().questions[id];
  const freq = 60 * 1000 * question.data.frequency;
  scheduleQuestionAroundTime(question.id, now + freq, randomRangeMultiplier * freq);
}

export function scheduleAllLoadedQuestions() {
  const ids = Object.keys(store.getState().questions);
  let now = (new Date()).getTime();
  for (const id of ids) {
    const question = store.getState().questions[id];
    if (question.scheduleFor != null) continue;
    if (now >= question.data.from.seconds * 1000) {
      store.dispatch({ type: 'MAKE_QUESTION_DUE', questionId: id });
    } else {
      scheduleQuestionAroundTime(id, question.data.from.seconds * 1000, 0);
    }
  }
  store.dispatch({ type: 'SHOW_NEXT_DUE_QUESTION' });
}


export function addAnswer(questionId, answer) {
  store.dispatch({ type: 'ADD_ANSWER', questionId: questionId, answer: answer, });
  Notifications.dismissAllNotificationsAsync();
  scheduleQuestionFromNow(questionId);
  // After adding the answer we should display the next due question
  store.dispatch({ type: 'SHOW_NEXT_DUE_QUESTION' });
  store.dispatch({ type: 'SPINNER_OFF' });
}
