import * as firebase from 'firebase';
import '@firebase/firestore';
import { Notifications } from 'expo';
import { store } from './reducers';
import { addQuestion, addAnswer, spinnerOff, clearQuestions, showFirst, changeText } from './actions'
import * as strings from './strings';

export function loadQuestions() {
  const db = firebase.firestore();
  db.collection("events").doc(store.getState().event.id).collection("questions")
    .get()
    .then(function(querySnapshot) {
      if (querySnapshot.size == 0) {
        console.log("Did not find questions for event: " + eventRef.path);
        return;
      }
      store.dispatch(clearQuestions());
      questions = new Array();
      for (let i = 0; i < querySnapshot.docs.length; i++) {
        const doc = querySnapshot.docs[i];
        questions.push({id: doc.id, data: doc.data()});
      }
      questions.sort((a, b) => a.data.order - b.data.order);
      for (let i = 0; i < questions.length; i++) {
        const next = (i + 1 < questions.length ? questions[i + 1].id : "");
        store.dispatch(addQuestion(questions[i].id, questions[i].data, i, next));
      }
      let now = (new Date()).getTime();
      if (now < store.getState().event.data.from.seconds * 1000) {
        console.log("Event hasn't started, we will schedule a notification to the start.");
        store.dispatch(changeText(strings.EVENT_LATER_TEXT));
        scheduleNotification();
      } else {
        store.dispatch(showFirst());
      }
    })
    .catch(function(error) {
      console.log("Error getting questions: ", error);
      store.dispatch(changeText(strings.ERROR_TEXT));
    });
    store.dispatch(spinnerOff());
}

export function saveAnswer(questionId, answer) {
  store.dispatch(addAnswer(questionId, answer));
  if (questionId == store.getState().firstQuestion) {
    Notifications.dismissAllNotificationsAsync();
    scheduleNotification();
  }
  store.dispatch(spinnerOff());
}

function scheduleNotification() {
  // Cancel all active ones.
  Notifications.cancelAllScheduledNotificationsAsync();
  let now = (new Date()).getTime();
  const event = store.getState().event;
  const freq = 60 * 1000 * event.data.frequency;
  scheduleFor = now + Math.floor(freq * (0.85 + 0.2 * Math.random())); // 85% +- 10%, because it takes time to answer questions
  if (scheduleFor > event.data.until.seconds * 1000) {
    // Past the end of event.
    return;
  }
  if (scheduleFor < event.data.from.seconds * 1000) {
    scheduleFor = event.data.from.seconds * 1000 + Math.floor(120 * 1000 * Math.random()); // Random time within 2 minutes after start.
  }

  Notifications.scheduleLocalNotificationAsync({
      title: strings.NOTIFICATION_TITLE,
      body: strings.NOTIFICATION_TEXT,
      ios: { sound: true },
      android: { channelId: "FeedbackAppNewQuestion", icon: "./assets/kisfej.png" }
    },
    {
      time: scheduleFor,
      repeat: 'minute'
    }
  );
  console.log("Notification set for: " + (new Date(scheduleFor).toLocaleTimeString()));
}
