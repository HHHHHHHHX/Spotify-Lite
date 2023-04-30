import PageLayout from '../../components/PageLayout';
import { useEffect, useState } from 'react';
import validator from 'validator';
import { get, put } from '../../utils/request';
import { useDispatch, useSelector } from 'react-redux';
import { TextField } from '@mui/material';
import { ACTION_TYPE } from '../../store';
import './Profile.css';

function Profile() {
  const [errMsg, setErrMsg] = useState();
  const [successMsg, setSuccessMsg] = useState();
  const [formErrors, setFormErrors] = useState({
    username: null,
    email: null,
    password: null,
  });

  const { userInfo } = useSelector((store) => store);
  const dispatch = useDispatch();

  const [username, setUsername] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  useEffect(() => {
    setUsername(userInfo.username);
    setEmail(userInfo.email);
    setPassword(userInfo.password);
  }, [userInfo]);

  const refreshUserInfo = () => {
    get('/api/user').then((resp) => {
      dispatch({ type: ACTION_TYPE.UPDATE_PROFILE, payload: resp.user });
    });
  };

  const updateProfile = () => {
    // validation
    let errors = {};
    if (!validator.isLength(username, { min: 3, max: 30 })) {
      errors.username = 'The length of the username is between 3-30 characters';
    }
    if (!validator.isEmail(email)) {
      errors.email = 'Incorrect email format';
    }
    if (!validator.isLength(password, { min: 3, max: 30 })) {
      errors.password = 'The length of the password is between 3-30 characters';
    }
    if (Object.keys(errors).length > 0) {
      return setFormErrors(errors);
    }
    setFormErrors({});

    put('/api/user/info', {
      username,
      email,
      password,
    }).then((resp) => {
      if (resp.success) {
        setSuccessMsg('Updated success');
        refreshUserInfo();
      } else {
        setErrMsg(resp.message);
      }
    });
  };

  return (
    <PageLayout url="/profile" errMsg={errMsg} successMsg={successMsg}>
      <h2 className="white" style={{ textAlign: 'left' }}>
        My Profile
      </h2>
      <div className="profile-form">
        <div className="group">
          <TextField
            error={formErrors.username}
            helperText={formErrors.username}
            style={{ width: '100%' }}
            label="Username"
            variant="outlined"
            value={username}
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="group">
          <TextField
            error={formErrors.email}
            helperText={formErrors.email}
            style={{ width: '100%' }}
            label="Email"
            variant="outlined"
            value={email}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="group">
          <TextField
            error={formErrors.password}
            helperText={formErrors.password}
            style={{ width: '100%' }}
            label="Password"
            variant="outlined"
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          className="default"
          style={{ width: '100%' }}
          onClick={updateProfile}
        >
          Update Profile
        </button>
      </div>
    </PageLayout>
  );
}

export default Profile;
