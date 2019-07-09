import * as firebase from 'firebase';
import '@firebase/firestore';
import { store } from './reducers'

export function chooseQuestion() {
    // Just show the first wordcloud question.
    const ids = Object.keys(store.getState().questions)
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
            store.dispatch({ type: 'ADD_QUESTION', id: doc.id, data: doc.data() });
          }
        }
        chooseQuestion();
      })
      .catch(function(error) {
        console.log("Error getting questions: ", error);
        // TODO: display error
      });
  }
  