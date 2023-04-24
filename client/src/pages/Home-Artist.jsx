import { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { del, get } from '../utils/request';
import SongDialog from '../components/SongDialog';
import PageLayout from '../components/PageLayout';
import mySong from '../assets/my-songs.png';
import myFollow from '../assets/my-followers.png';

const menus = [
  { label: 'My Songs', icon: mySong, url: '/home-artist' },
  { label: 'My Followers', icon: myFollow, url: '/home-artist-follows' },
];

function HomeArtist() {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [item, setItem] = useState({});

  const getData = () => {
    get(`/api/artist/songs`).then((resp) => {
      if (resp.success) {
        setData(resp.data || []);
      }
    });
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line
  }, []);

  const handleAdd = () => {
    setItem({
      title: '',
      album: '',
      genre: '',
      language: '',
    });
    setOpen(true);
  };

  const handleEdit = (item) => {
    setItem(item);
    setOpen(true);
  };

  const handleDelete = (item) => {
    del(`/api/songs?id=${item._id}`).then((resp) => {
      if (resp.success) {
        getData();
      }
    });
  };

  return (
    <PageLayout url="/home-artist" menus={menus}>
      <h2 className="white" style={{ textAlign: 'left' }}>
        My Songs
      </h2>
      <Button variant="outlined" onClick={handleAdd}>
        Add Song
      </Button>

      <SongDialog
        item={item}
        open={open}
        setOpen={setOpen}
        onOk={() => {
          getData();
          setOpen(false);
        }}
      />
      <TableContainer component={Paper}>
        <Table style={{ width: 1000 }}>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              {/* <TableCell align="right">Artist</TableCell> */}
              <TableCell align="right">Album</TableCell>
              <TableCell align="right">Genre</TableCell>
              <TableCell align="right">Language</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow
                key={row._id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.title}
                </TableCell>
                <TableCell align="right">{row.album}</TableCell>
                <TableCell align="right">{row.genre}</TableCell>
                <TableCell align="right">{row.language}</TableCell>
                <TableCell align="right">
                  <Button variant="outlined" onClick={() => handleEdit(row)}>
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    style={{ marginLeft: 12 }}
                    onClick={() => handleDelete(row)}
                  >
                    DELETE
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </PageLayout>
  );
}

export default HomeArtist;
