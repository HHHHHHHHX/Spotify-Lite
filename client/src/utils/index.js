import validator from 'validator';

export const validLoginOrSignup = (values = {}, isSignup = false) => {
  let errors = {};
  if (!validator.isEmail(values.email)) {
    errors.email = 'Incorrect email format';
  }
  if (!validator.isLength(values.password, { min: 3, max: 30 })) {
    errors.password = 'The length of the password is between 3-30 characters';
  }

  if (isSignup) {
    if (!validator.isLength(values.username, { min: 3, max: 30 })) {
      errors.username = 'The length of the username is between 3-30 characters';
    }
  }

  if (Object.keys(errors).length > 0) {
    return errors;
  }
  // pass
  return null;
};
