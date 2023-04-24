import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { get, put } from '../utils/request';
import { Button } from '@mui/material';
import PageLayout from '../components/PageLayout';
import './Home.css';
import { ACTION_TYPE } from '../store';
import { getQueryVariable } from '../utils';

function Home() {
  const dispatch = useDispatch();

  const [keyword, setKeyword] = useState(getQueryVariable('keyword') || '');
  const [language, setLanguage] = useState(getQueryVariable('language') || '');
  const [genre, setGenre] = useState(getQueryVariable('genre') || '');
  // getQueryVariable returns a string!
  const [page, setPage] = useState(Number(getQueryVariable('page')) || 1); 
  const [total, setTotal] = useState(0);
  const [data, setData] = useState([]);
  const [errMsg, setErrMsg] = useState();
  const [successMsg, setSuccessMsg] = useState();
  const { userInfo } = useSelector((store) => store);
  const { followedArtists = [], likedSongs = [] } = userInfo;

  const search = (_page = 1) => {
    window.history.pushState(
      '',
      '',
      `/home?keyword=${keyword}&language=${language}&genre=${genre}&page=${_page}`
    );

    setPage(_page);
    get(
      `/api/songs?keyword=${keyword}&language=${language}&genre=${genre}&page=${_page}`
    ).then((resp) => {
      if (resp.success) {
        setData(resp.data || []);
        setTotal(resp.total || 0);
      }
    });
  };

  const refreshUserInfo = () => {
    get('/api/user').then((resp) => {
      dispatch({ type: ACTION_TYPE.UPDATE_PROFILE, payload: resp.user });
    });
  };

  useEffect(() => {
    search(page);
    // eslint-disable-next-line
  }, []);

  const handleFilter = () => {
    search(1);
  };

  const handleReset = () => {
    setKeyword('');
    setLanguage('');
    setGenre('');
  };

  const handleFollow = (item) => {
    put('/api/user/artists/follow', {
      follow: item.artist,
    }).then((resp) => {
      if (resp.success) {
        setErrMsg();
        search(page);
        refreshUserInfo();
        setSuccessMsg('Success');
      } else {
        setErrMsg(resp.message);
      }
    });
  };
  const handleUnFollow = (item) => {
    put('/api/user/artists/follow', {
      follow: item.artist,
      unlike: 'YES',
    }).then((resp) => {
      if (resp.success) {
        setErrMsg();
        search(page);
        refreshUserInfo();
        setSuccessMsg('Success');
      } else {
        setErrMsg(resp.message);
      }
    });
  };

  const handleLike = (item) => {
    put('/api/user/songs/like', {
      songId: item._id,
    }).then((resp) => {
      if (resp.success) {
        setErrMsg();
        search(page);
        refreshUserInfo();
        setSuccessMsg('Success');
      } else {
        setErrMsg(resp.message);
      }
    });
  };

  const handleUnLike = (item) => {
    put('/api/user/songs/like', {
      songId: item._id,
      unlike: 'YES',
    }).then((resp) => {
      if (resp.success) {
        setErrMsg();
        search(page);
        refreshUserInfo();
        setSuccessMsg('Success');
      } else {
        setErrMsg(resp.message);
      }
    });
  };

  return (
    <PageLayout url="/home" errMsg={errMsg} successMsg={successMsg}>
      <h2 className="white" style={{ textAlign: 'left' }}>
        Search Results
      </h2>

      <div className="search">
        <div className="group">
          <div className="label">Keyword</div>
          <input
            type="text"
            name="keyword"
            required
            value={keyword}
            placeholder="Keyword"
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
        <div className="group">
          <div className="label">Language</div>
          <input
            type="text"
            name="Language"
            required
            value={language}
            placeholder="Language"
            onChange={(e) => setLanguage(e.target.value)}
          />
        </div>
        <div className="group">
          <div className="label">Genre</div>
          <input
            type="text"
            name="Genre"
            required
            value={genre}
            placeholder="Genre"
            onChange={(e) => setGenre(e.target.value)}
          />
        </div>
        <button type="submit" onClick={handleFilter} style={{ marginLeft: 12 }}>
          Filter
        </button>
        <button type="submit" onClick={handleReset} style={{ marginLeft: 12 }}>
          Reset
        </button>
      </div>

      <div className="results">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Artist</th>
              <th>Album</th>
              <th>Genre</th>
              <th>Language</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => {
              return (
                <tr key={index}>
                  <td>{item.title}</td>
                  <td>
                    {item.artist}
                    {!followedArtists.includes(item.artist) ? (
                      <div
                        className="text-link"
                        onClick={() => handleFollow(item)}
                      >
                        Follow
                      </div>
                    ) : (
                      <div
                        className="text-link"
                        onClick={() => handleUnFollow(item)}
                      >
                        UnFollow
                      </div>
                    )}
                  </td>
                  <td>{item.album}</td>
                  <td>{item.genre}</td>
                  <td>{item.language}</td>
                  <td>
                    {!likedSongs.includes(item._id) ? (
                      <div
                        className="text-link"
                        onClick={() => handleLike(item)}
                      >
                        Like
                      </div>
                    ) : (
                      <div
                        className="text-link"
                        onClick={() => handleUnLike(item)}
                      >
                        UnLike
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="footer">
          <div className="meta">
            <span>
              Total Page: {Math.ceil(total / 5)}
              &nbsp; Current Page: {page}
              &nbsp; Total Count: {total}
            </span>

            <Button
              variant="outlined"
              style={{ marginLeft: 12 }}
              disabled={page === 1}
              onClick={() => search(page - 1)}
            >
              Previous Page
            </Button>
            <Button
              variant="outlined"
              style={{ marginLeft: 12 }}
              disabled={page === Math.ceil(total / 5)}
              onClick={() => search(page + 1)}
            >
              Next Page
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

export default Home;
