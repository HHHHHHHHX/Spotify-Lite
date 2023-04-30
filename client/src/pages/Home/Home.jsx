import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { get } from '../../utils/request';
import PageLayout from '../../components/PageLayout';
import './Home.css';
import { ACTION_TYPE } from '../../store';
import { useNavigate } from 'react-router';
import useParams from '../../hooks/useParams';
import TableData from './components/TableData';
import Pagination from './components/Pagination';

function Home() {
  const dispatch = useDispatch();
  const params = useParams();

  const [keyword, setKeyword] = useState(params.keyword || '');
  const [language, setLanguage] = useState(params.language || '');
  const [genre, setGenre] = useState(params.genre || '');
  const [page, setPage] = useState(Number(params.page) || 1);
  const [total, setTotal] = useState(0);
  const [data, setData] = useState([]);
  const [errMsg, setErrMsg] = useState();
  const [successMsg, setSuccessMsg] = useState();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const search = (_page = 1) => {
    navigate(
      `/home?keyword=${keyword}&language=${language}&genre=${genre}&page=${_page}`
    );
    setPage(_page);
    setLoading(true);
    get(
      `/api/songs?keyword=${keyword}&language=${language}&genre=${genre}&page=${_page}`
    ).then((resp) => {
      setLoading(false);
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

  return (
    <PageLayout url="/home" errMsg={errMsg} successMsg={successMsg}>
      <h2 className="white" style={{ textAlign: 'left' }}>
        Search Results {loading ? '(loading...)' : ''}
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
        <TableData
          data={data}
          onRefresh={() => {
            setErrMsg();
            search(page);
            refreshUserInfo();
            setSuccessMsg('Success');
          }}
          onError={(mes) => setErrMsg(mes)}
        />

        <Pagination total={total} page={page} search={search} />
      </div>
    </PageLayout>
  );
}

export default Home;
