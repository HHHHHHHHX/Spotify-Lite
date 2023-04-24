import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Checkbox } from '@mui/material';
import PageLayout from '../components/PageLayout';
import { get, put } from '../utils/request';
import { ACTION_TYPE } from '../store';

import './Like.css';

function Like() {
  const [errMsg, setErrMsg] = useState();
  const dispatch = useDispatch();

  const [songs, setSongs] = useState([]);
  const [artists, setArtists] = useState([]);

  const [checkIndex, setCheckIndexs] = useState({});

  const refreshUserInfo = () => {
    get('/api/user').then((resp) => {
      // update
      dispatch({ type: ACTION_TYPE.UPDATE_PROFILE, payload: resp.user });
    });
  };

  const getSongs = () => {
    get('/api/user/songs').then((resp) => {
      if (resp.success) {
        setCheckIndexs({});
        setSongs(resp.data);
        refreshUserInfo();
      }
    });
  };

  const getArtists = () => {
    get('/api/user/artists').then((resp) => {
      if (resp.success) {
        setArtists(resp.data);
        refreshUserInfo();
      }
    });
  };

  const getData = () => {
    getSongs();
    getArtists();
  };

  const handleUnLike = (item) => {
    put('/api/user/songs/like', {
      songId: item._id,
      unlike: 'YES',
    }).then((resp) => {
      if (resp.success) {
        getSongs();
      } else {
        setErrMsg(resp.message);
      }
    });
  };

  const handleUnFollow = (item) => {
    put('/api/user/artists/follow', {
      follow: item,
      unlike: 'YES',
    }).then((resp) => {
      if (resp.success) {
        getArtists();
      } else {
        setErrMsg(resp.message);
      }
    });
  };

  const handleUnlikeAll = () => {
    const unlikeIds = [];
    Object.keys(checkIndex).forEach((key) => {
      if (checkIndex[key]) {
        unlikeIds.push(songs[key]._id);
      }
    });
    
    if(unlikeIds.length === 0){
      return;
    }

    put('/api/user/songs/like', {
      songIds: unlikeIds,
      unlike: 'YES',
    }).then((resp) => {
      if (resp.success) {
        getSongs();
      } else {
        setErrMsg(resp.message);
      }
    });
  };
  useEffect(() => {
    getData();
    // eslint-disable-next-line
  }, []);

  return (
    <PageLayout url="/like" errMsg={errMsg}>
      <h2 className="white" style={{ textAlign: 'left' }}>
        My Liked Singers
      </h2>

      <Button variant="outlined" onClick={handleUnlikeAll}>
        Unlike All
      </Button>

      <div className="results">
        <table>
          <thead>
            <tr>
              <th style={{ width: 40, color: '#fff' }}></th>
              <th>Title</th>
              <th>Artist</th>
              <th>Album</th>
              <th>Genre</th>
              <th>Language</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {songs.map((item, index) => {
              return (
                <tr key={index}>
                  <td style={{ width: 40, color: '#fff' }}>
                    <Checkbox
                      checked={Boolean(checkIndex[index])}
                      onChange={(e) =>
                        setCheckIndexs({
                          ...checkIndex,
                          [index]: e.target.checked,
                        })
                      }
                    />
                  </td>
                  <td>{item.title}</td>
                  <td>{item.artist}</td>
                  <td>{item.album}</td>
                  <td>{item.genre}</td>
                  <td>{item.language}</td>
                  <td>
                    <Button
                      variant="outlined"
                      onClick={() => handleUnLike(item)}
                    >
                      UnLike
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {songs.length === 0 && <div className="empty">No Data</div>}
      </div>

      <h2 className="white" style={{ textAlign: 'left' }}>
        My Liked Artists
      </h2>

      <div className="results">
        <table>
          <thead>
            <tr>
              <th>Artist Name</th>
              <th style={{ width: 160 }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {artists.map((item, index) => {
              return (
                <tr key={index}>
                  <td>{item}</td>
                  <td>
                    <Button
                      variant="outlined"
                      onClick={() => handleUnFollow(item)}
                    >
                      UnFollow
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {artists.length === 0 && <div className="empty">No Data</div>}
      </div>
    </PageLayout>
  );
}

export default Like;
