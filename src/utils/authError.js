import { showMessage } from 'react-native-flash-message';

export const handleAuthErrors = (error, translateObj) => {
  let obj = {
    title: translateObj.errorText,
    msg: '',
  };

  let { title, msg } = obj;

  switch (error.code) {
    case 'USER_INVALID':
      msg = translateObj.invalidCredantialsError;
      break;
    case 'PASSWORD_INVALID':
      msg = translateObj.wrongPassword;
      break;
    case 'PASSWORD_NOT_SET':
      msg = translateObj.useSocialLoginError;
      break;
    case 'USER_BLOCKED':
      msg = translateObj.userDisabled;
      break;
    case 'auth/email-already-in-use':
      msg = 'Email already in use';
      break;
    case 'auth/invalid-email':
      msg = 'Invalid email';
      break;
    case 'auth/operation-not-allowed':
      msg = 'Operation not allowed';
      break;
    case 'auth/weak-password':
      msg = 'Weak password';
      break;
    case 'auth/user-disabled':
      msg = 'User disabled';
      break;
    case 'auth/user-not-found':
      msg = 'User not found';
      break;
    case 'auth/wrong-password':
      msg = 'Wrong password';
      break;
    case 'auth/invalid-credential':
      msg = 'Provided credential are invalid.';
      break;
    case 'auth/invalid-verification-code':
      msg = 'Invalid verification code';
      break;
    case 'auth/invalid-verification-id':
      msg = 'Invalid verification id';
      break;
    case 'auth/code-expired':
      msg = 'Code expired';
      break;
    case 'auth/invalid-phone-number':
      msg = 'Invalid phone number';
      break;
    case 'auth/missing-phone-number':
      msg = 'Missing phone number';
      break;
    case 'auth/quota-exceeded':
      msg = 'Quota exceeded';
      break;
    case 'auth/captcha-check-failed':
      msg = 'Captcha check failed';
      break;
    case 'auth/missing-verification-code':
      msg = 'Missing verification code';
      break;
    case 'auth/missing-verification-id':
      msg = 'Missing verification id';
      break;
    case 'auth/app-deleted':
      msg = 'App deleted';
      break;
    case 'auth/app-not-authorized':
      msg = 'App not authorized';
      break;
    case 'auth/argument-error':
      msg = 'Argument error';
      break;
    default:
      msg = translateObj.somethingWrongError;
      break;
  }

  return showMessage({ message: title, description: msg, type: 'danger', duration: 3000 });
};
