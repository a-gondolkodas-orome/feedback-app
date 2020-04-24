/*
 * Action types
 */

export const SET_EVENT = 'SET_EVENT'
export const SET_NAME = 'SET_NAME'
export const CLEAR_QUESTIONS = 'CLEAR_QUESTIONS'
export const ADD_QUESTION = 'ADD_QUESTION'
export const ADD_ANSWER = 'ADD_ANSWER'
export const SHOW_FIRST = 'SHOW_FIRST'
export const CHANGE_TEXT = 'CHANGE_TEXT'
export const ADD_JOKES = 'ADD_JOKES'
export const UPDATE_JOKE = 'UPDATE_JOKE'
export const SET_JOKE_INFO = 'SET_JOKE_INFO'
export const SPINNER_ON = 'SPINNER_ON'
export const SPINNER_OFF = 'SPINNER_OFF'
export const LEAVE_EVENT = 'LEAVE_EVENT'
export const RESET = 'RESET'

/*
 * Action creators
 */

export function setEvent(event) {
  return { type: SET_EVENT, event }
}

export function setName(name) {
  return { type: SET_NAME, name }
}

export function clearQuestions() {
  return { type: CLEAR_QUESTIONS }
}

export function addQuestion(id, data, index, next) {
  return { type: ADD_QUESTION, id, data, index, next }
}

export function addAnswer(questionId, answer) {
  return { type: ADD_ANSWER, questionId, answer }
}

export function changeText(text) {
  return { type: CHANGE_TEXT, text }
}

export function showFirst() {
  return { type: SHOW_FIRST }
}

export function addJokes(jokes) {
  return { type: ADD_JOKES, jokes }
}

export function updateJoke() {
  return { type: UPDATE_JOKE }
}

export function setJokeInfo(info) {
  return { type: SET_JOKE_INFO, info }
}

export function spinnerOn() {
  return { type: SPINNER_ON }
}

export function spinnerOff() {
  return { type: SPINNER_OFF }
}

export function leaveEvent() {
  return { type: LEAVE_EVENT }
}