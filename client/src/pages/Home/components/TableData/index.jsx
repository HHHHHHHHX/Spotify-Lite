import { useSelector } from 'react-redux';
import { put } from '../../../../utils/request';

function TableData({ data = [], onRefresh, onError }) {
  const { userInfo } = useSelector((store) => store);
  const { followedArtists = [], likedSongs = [] } = userInfo;
  const handleFollow = (item) => {
    put('/api/user/artists/follow', {
      follow: item.artist,
    }).then((resp) => {
      if (resp.success) {
        if (onRefresh) onRefresh();
      } else {
        if (onError) onError(resp.message);
      }
    });
  };
  const handleUnFollow = (item) => {
    put('/api/user/artists/follow', {
      follow: item.artist,
      unlike: 'YES',
    }).then((resp) => {
      if (resp.success) {
        if (onRefresh) onRefresh();
      } else {
        if (onError) onError(resp.message);
      }
    });
  };

  const handleLike = (item) => {
    put('/api/user/songs/like', {
      songId: item._id,
    }).then((resp) => {
      if (resp.success) {
        if (onRefresh) onRefresh();
      } else {
        if (onError) onError(resp.message);
      }
    });
  };

  const handleUnLike = (item) => {
    put('/api/user/songs/like', {
      songId: item._id,
      unlike: 'YES',
    }).then((resp) => {
      if (resp.success) {
        if (onRefresh) onRefresh();
      } else {
        if (onError) onError(resp.message);
      }
    });
  };
  return (
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
                  <div className="text-link" onClick={() => handleFollow(item)}>
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
                  <div className="text-link" onClick={() => handleLike(item)}>
                    Like
                  </div>
                ) : (
                  <div className="text-link" onClick={() => handleUnLike(item)}>
                    UnLike
                  </div>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default TableData;
