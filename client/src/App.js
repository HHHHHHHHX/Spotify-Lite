import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import store, { ACTION_TYPE } from './store';
import Home from './pages/Home';
import HomeArtist from './pages/Home-Artist';
import HomeArtistFollows from './pages/Home-Artist-Follows';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Like from './pages/Like';
import PageNotFound from './pages/PageNotFound';
import { get } from './utils/request';
import './App.css';

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isReady, setIsReady] = useState(false);

  const { userInfo } = useSelector((store) => store);
  const isUser = userInfo.role === 'user';
  const isArtist = userInfo.role === 'artist';

  // check session state
  useEffect(() => {
    get('/api/user').then((resp) => {
      setIsReady(true);
      if (resp.success) {
        dispatch({ type: ACTION_TYPE.LOG_IN, payload: resp.user });
      } else {
        navigate('/');
      }
    });
    // eslint-disable-next-line
  }, []);

  if (!isReady) {
    return null;
  }

  return (
    <div className="App">
      <Routes>
        <Route path="/" exact element={<Login />} />
        {isArtist && (
          <Route path="/home-artist" exact element={<HomeArtist />} />
        )}
        {isArtist && (
          <Route
            path="/home-artist-follows"
            exact
            element={<HomeArtistFollows />}
          />
        )}

        {isUser && <Route path="/home" exact element={<Home />} />}
        {isUser && <Route path="/like" exact element={<Like />} />}
        {isUser && <Route path="/profile" exact element={<Profile />} />}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
}

// with redux context and react-router context
function AppWrapper() {
  return (
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
  );
}

export default AppWrapper;
