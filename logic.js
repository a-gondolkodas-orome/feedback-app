import * as firebase from 'firebase';
import '@firebase/firestore';
import { activateNextJoke } from './Joke';
import { Notifications } from 'expo';
import { store } from './reducers';
import * as actions from './actions'
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
      store.dispatch(actions.clearQuestions());
      questions = new Array();
      for (let i = 0; i < querySnapshot.docs.length; i++) {
        const doc = querySnapshot.docs[i];
        questions.push({id: doc.id, data: doc.data()});
      }
      questions.sort((a, b) => a.data.order - b.data.order);
      for (let i = 0; i < questions.length; i++) {
        const next = (i + 1 < questions.length ? questions[i + 1].id : "");
        store.dispatch(actions.addQuestion(questions[i].id, questions[i].data, i, next));
      }
      let now = (new Date()).getTime();
      if (now < store.getState().event.data.from.seconds * 1000) {
        console.log("Event hasn't started, we will schedule a notification to the start.");
        store.dispatch(actions.changeText(strings.EVENT_LATER_TEXT));
        scheduleNotification();
      } else {
        store.dispatch(actions.showFirst());
      }
    })
    .catch(function(error) {
      console.log("Error getting questions: ", error);
      store.dispatch(actions.changeText(strings.ERROR_TEXT));
    });
    store.dispatch(actions.spinnerOff());
}

export function saveAnswer(questionId, answerObject) {
  store.dispatch(actions.spinnerOn());
  const db = firebase.firestore();
  db.collection("events").doc(store.getState().event.id).collection("questions")
    .doc(questionId).collection('answers')
    .add(answerObject)
    .catch(function(error) {
        console.error("Error adding document: ", error);
        store.dispatch(actions.spinnerOff());
    })
    .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id, " data: ", answerObject);
        handleAnswer(questionId, answerObject);
    });
}

function handleAnswer(questionId, answer) {
  store.dispatch(actions.addAnswer(questionId, answer));
  if (questionId == store.getState().firstQuestion) {
    Notifications.dismissAllNotificationsAsync();
    scheduleNotification();
  }
  if ("" == store.getState().questionToShow) {
    activateNextJoke();
  }
  store.dispatch(actions.spinnerOff());
}

function scheduleNotification() {
  // Cancel all active ones.
  Notifications.cancelAllScheduledNotificationsAsync();
  let now = (new Date()).getTime();
  const event = store.getState().event.data;
  const freq = 60 * 1000 * event.frequency;
  scheduleFor = now + Math.floor(freq * (0.85 + 0.2 * Math.random())); // 85% +- 10%, because it takes time to answer questions
  // Check that we don't schedule after the end of event.
  if (event.until && scheduleFor > event.until.seconds * 1000) {
    logTime(now, scheduleFor, "No notification. Schedule time is past the end of the event");
    store.dispatch(actions.endEvent());
    return;
  }
  // Check that we don't schedule after the max duration of the event.
  const firstQuestion = store.getState().questions[store.getState().firstQuestion];
  if (firstQuestion && firstQuestion.answerCount > 0 && event.duration &&
      scheduleFor > firstQuestion.firstAnswerTime.getTime() + event.duration * 3600 * 1000) {
    logTime(now, scheduleFor, "No notification. Schedule time is after the max duration of the event");
    store.dispatch(actions.endEvent());
    return;
  }
  if (now < event.from.seconds * 1000) {
    scheduleFor = event.from.seconds * 1000 + Math.floor(120 * 1000 * Math.random()); // Random time within 2 minutes after start.
  }
  
  scheduleFor = adjustScheduleTime(scheduleFor, event);

  if (scheduleFor > event.until.seconds * 1000) {
    logTime(now, scheduleFor, "No notification. Schedule time is past the end of the event");
    store.dispatch(actions.endEvent());
    return;
  }

  logTime(now, scheduleFor, "");

  Notifications.scheduleLocalNotificationAsync({
      title: strings.NOTIFICATION_TITLE,
      body: strings.NOTIFICATION_TEXT,
      ios: { sound: false },
      android: { channelId: "StudyMeterNewQuestion", icon: "./assets/kisfej96bw.png" }
    },
    {
      time: scheduleFor,
      // intervalMs: 5 * 60000, -> throws exception :S
      repeat: "minute"
    }
  );
  console.log("Notification set for: " + (new Date(scheduleFor).toLocaleTimeString()));
}

function adjustScheduleTime(scheduleTime, event) {
  let dateSchedule = new Date(scheduleTime);
  if (event.morning && dateSchedule.getHours() < event.morning ||
      event.evening && dateSchedule.getHours() >= event.evening) {
    dateSchedule.setHours(event.morning, 0);
    if (dateSchedule.getTime() < scheduleTime) {
      dateSchedule.setDate(dateSchedule.getDate() + 1);
    }
    return dateSchedule.getTime();
  }
  return scheduleTime;
}

function logTime(now, scheduleFor, message) {
  let dateNow = new Date(now);
  let dateSchedule = new Date(scheduleFor);
  console.log("Now: ", dateNow.getHours(), dateNow.getMinutes(), dateNow.getSeconds());
  console.log("Schedule: ", dateSchedule.getHours(), dateSchedule.getMinutes(), dateSchedule.getSeconds());
  console.log(message);
}
