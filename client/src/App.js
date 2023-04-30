import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Provider, useDispatch } from 'react-redux';
import store, { ACTION_TYPE } from './store';
import Home from './pages/Home/Home';
import HomeArtist from './pages/Home-Artist/Home-Artist';
import HomeArtistFollows from './pages/Home-Artist-Follows/Home-Artist-Follows';
import Login from './pages/Login/Login';
import Profile from './pages/Profile/Profile';
import Like from './pages/Like/Like';
import PageNotFound from './pages/PageNotFound/PageNotFound';
import { get } from './utils/request';
import './App.css';
import RequireAuth from './components/RequireAuth';

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isReady, setIsReady] = useState(false);
  //for user and artist router check

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

        {/* user routes */}
        <Route element={<RequireAuth role="user" redirectUrl="/" />}>
          <Route path="/home" exact element={<Home />} />
          <Route path="/like" exact element={<Like />} />
          <Route path="/profile" exact element={<Profile />} />
        </Route>

        {/* artist Routes */}
        <Route element={<RequireAuth role="artist" redirectUrl="/" />}>
          <Route path="/home-artist" exact element={<HomeArtist />} />
          <Route
            path="/home-artist-follows"
            exact
            element={<HomeArtistFollows />}
          />
        </Route>

        {/* 404 routes */}
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
