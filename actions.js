/*
 * Action types
 */

export const SET_EVENT = 'SET_EVENT'
export const SET_NAME = 'SET_NAME'
export const ADD_QUESTION = 'ADD_QUESTION'
export const ADD_ANSWER = 'ADD_ANSWER'
export const SHOW_NEXT_DUE_QUESTION = 'SHOW_NEXT_DUE_QUESTION'
export const MAKE_QUESTION_DUE = 'MAKE_QUESTION_DUE'
export const SET_QUESTION_SCHEDULE_TIME = 'SET_QUESTION_SCHEDULE_TIME'
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

export function addQuestion(id, data) {
  return { type: ADD_QUESTION, id, data }
}

export function addAnswer(questionId, answer) {
  return { type: ADD_ANSWER, questionId, answer }
}

export function showNextDueQuestion() {
  return { type: SHOW_NEXT_DUE_QUESTION }
}

export function makeQuestionDue(questionId) {
  return { type: MAKE_QUESTION_DUE, questionId }
}

export function setQuestionScheduleTime(questionId, timestamp) {
  return { type: ADD_ANSWER, questionId, timestamp }
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