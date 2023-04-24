import { createStore } from 'redux';

const ACTION_TYPE = {
  LOG_IN: 'LOG_IN',
  LOG_OUT: 'LOG_OUT',
  UPDATE_PROFILE: 'UPDATE_PROFILE',
};

const initState = {
  isLogined: false,
  userInfo: {},
};

function userReducer(state, action) {
  switch (action.type) {
    case ACTION_TYPE.LOG_IN:
    case ACTION_TYPE.UPDATE_PROFILE:
      return { isLogined: true, userInfo: action.payload };
    case ACTION_TYPE.LOG_OUT:
      return { isLogined: false, userInfo: {} };
    default:
      return initState;
  }
}

const store = createStore(userReducer);

export default store;

export { ACTION_TYPE };
