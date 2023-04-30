import { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { get } from '../../utils/request';
import PageLayout from '../../components/PageLayout';
import mySong from '../../assets/my-songs.png';
import myFollow from '../../assets/my-followers.png';

const menus = [
  { label: 'My Songs', icon: mySong, url: '/home-artist' },
  { label: 'My Followers', icon: myFollow, url: '/home-artist-follows' },
];

function HomeArtistFollow() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);


  const getData = () => {
    setLoading(true);
    get(`/api/artist/follows`).then((resp) => {
      setLoading(false);
      if (resp.success) {
        setData(resp.data || []);
      }
    });
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line
  }, []);

  return (
    <PageLayout url="/home-artist-follows" menus={menus}>
      <h2 className="white" style={{ textAlign: 'left' }}>
        My Followers{loading ? '(loading...)' : ''}
      </h2>
      <TableContainer component={Paper}>
        <Table style={{ width: 600 }}>
          <TableHead>
            <TableRow>
              <TableCell align="left">Username</TableCell>
              <TableCell align="left">Email</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow
                key={row._id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell align="left">{row.username}</TableCell>
                <TableCell align="left">{row.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </PageLayout>
  );
}

export default HomeArtistFollow;
