import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import {
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import logo from '../../assets/logo.png';
import { ACTION_TYPE } from '../../store';
import { post } from '../../utils/request';
import './Login.css';
import { validLoginOrSignup } from '../../utils';

function Login() {
  const [errMsg, setErrMsg] = useState('');
  const [formErrors, setFormErrors] = useState({
    username: null,
    email: null,
    password: null,
  });

  const [isSignUp, setIsSignUp] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');

  const toggle = () => {
    setEmail('');
    setPassword('');
    setUsername('');
    setErrMsg('');
    setIsSignUp(!isSignUp);
  };

  const handleLogin = () => {
    const errors = validLoginOrSignup({ email, password }, false);
    if (errors) {
      return setFormErrors(errors);
    }
    setFormErrors({});
    // submit and dispath login action
    post('/api/user/login', { email, password }).then((resp) => {
      if (resp.success) {
        dispatch({ type: ACTION_TYPE.LOG_IN, payload: resp.data });
        navigate(resp.data.role === 'user' ? '/home' : '/home-artist');
      } else {
        setErrMsg(resp.message);
      }
    });
  };

  const handleSignUp = () => {
    const errors = validLoginOrSignup({ email, password, username }, true);
    if (errors) {
      return setFormErrors(errors);
    }
    setFormErrors({});

    // submit and dispath login action
    post('/api/user/signup', { username, email, password, role }).then(
      (resp) => {
        if (resp.success) {
          dispatch({ type: ACTION_TYPE.LOG_IN, payload: resp.data });
          navigate(role === 'user' ? '/home' : '/home-artist');
        } else {
          setErrMsg(resp.message);
        }
      }
    );
  };

  return (
    <div>
      <header className="header">
        <img src={logo} width={144} height={44} alt="logo" />
      </header>
      <div className="form">
        {/* isSignUp is truthy */}
        {isSignUp && (
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
        )}

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
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* isSignUp is truthy */}
        {isSignUp && (
          <div className="group">
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Role</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                value={role}
                label="Role"
                variant="outlined"
                placeholder="Role"
                onChange={(e) => {
                  setRole(e.target.value);
                }}
                style={{ width: '100%' }}
              >
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="artist">Artist</MenuItem>
              </Select>
            </FormControl>
          </div>
        )}

        <div className="error-msg">{errMsg}</div>

        <div className="group" style={{ textAlign: 'right' }}>
          {isSignUp ? (
            <button onClick={handleSignUp}>Sign Up</button>
          ) : (
            <button onClick={handleLogin}>Log In</button>
          )}
        </div>

        <div className="line"></div>

        {isSignUp ? (
          <div>
            Already have an account?
            <span className="text-link" onClick={toggle}>
              Log in
            </span>
          </div>
        ) : (
          <div>
            <h2>Don't have an account?</h2>

            <button
              className="default"
              style={{ width: '100%' }}
              onClick={toggle}
            >
              Sign Up
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;
