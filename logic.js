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
}

export function scheduleAllLoadedQuestions() {
  // only a first solution to check if it works
  // schedule all in 5 seconds
  let timestamp = (new Date()).getTime() + 5000;

  const ids = Object.keys(store.getState().questions);
  for (const id of ids) {
    const question = store.getState().questions[id];
    // TO DO: schedule notifications here based on question.data
    Notifications.scheduleLocalNotificationAsync({
        title: 'Bejövő kérdés',
        body: 'Új kérdésed érkezett! Próbálj minél hamarabb válaszolni rá, csak pár percet vesz igénybe.',
//        data: {text: 'This is the data of the hello notification'}, // OPTIONAL
      },
      {
        time: timestamp,
      }
    );

    store.dispatch({ type: 'SET_QUESTION_SCHEDULE_TIME', questionId: id, timestamp: timestamp, });
  }
}


export function addAnswer(questionId, answer) {
  store.dispatch({ type: 'ADD_ANSWER', questionId: questionId, answer: answer, });
  // After adding the answer we should display the next due question
  store.dispatch({ type: 'SHOW_NEXT_DUE_QUESTION' });
}
