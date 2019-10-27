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

export function makeQuestionDue(id) {
  return { type: MAKE_QUESTION_DUE, id }
}

