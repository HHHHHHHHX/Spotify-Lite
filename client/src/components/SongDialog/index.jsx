import { useEffect, useState } from 'react';
import validator from 'validator';
import {
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import Button from '@mui/material/Button';
import { post, put } from '../../utils/request';

function SongDialog(props) {
  const { open, setOpen, onOk } = props;
  const [data, setData] = useState({
    title: '',
    album: '',
    genre: '',
    language: '',
  });
  const [formErrors, setFormErrors] = useState({
    title: '',
    album: '',
    genre: '',
    language: '',
  });

  useEffect(() => {
    if (props.item) {
      setData(props.item);
    }
  }, [props.item]);

  const handleSubmit = () => {
    // validation
    let errors = {};
    if (validator.isEmpty(data.title)) {
      errors.title = 'Requried';
    }
    if (validator.isEmpty(data.album)) {
      errors.album = 'Requried';
    }
    if (validator.isEmpty(data.genre)) {
      errors.genre = 'Requried';
    }
    if (validator.isEmpty(data.language)) {
      errors.language = 'Requried';
    }
    if (Object.keys(errors).length > 0) {
      return setFormErrors(errors);
    }
    setFormErrors({});

    if (data._id) {
      // update
      put('/api/songs', data).then((resp) => {
        if (resp.success) {
          onOk();
        }
      });
    } else {
      // add
      post('/api/songs', data).then((resp) => {
        if (resp.success) {
          onOk();
        }
      });
    }
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Add/Edit Song</DialogTitle>
      <DialogContent style={{ width: 500, paddingTop: 24 }}>
        <div className="group">
          <TextField
            error={formErrors.title}
            helperText={formErrors.title}
            style={{ width: '100%' }}
            label="Title"
            variant="outlined"
            value={data.title}
            onChange={(e) => setData({ ...data, title: e.target.value })}
          />
        </div>
        <div className="group">
          <TextField
            error={formErrors.album}
            helperText={formErrors.album}
            style={{ width: '100%' }}
            label="Album"
            variant="outlined"
            value={data.album}
            onChange={(e) => setData({ ...data, album: e.target.value })}
          />
        </div>
        <div className="group">
          <TextField
            error={formErrors.genre}
            helperText={formErrors.genre}
            style={{ width: '100%' }}
            label="Genre"
            variant="outlined"
            value={data.genre}
            onChange={(e) => setData({ ...data, genre: e.target.value })}
          />
        </div>
        <div className="group">
          <TextField
            error={formErrors.language}
            helperText={formErrors.language}
            style={{ width: '100%' }}
            label="Language"
            variant="outlined"
            value={data.language}
            onChange={(e) => setData({ ...data, language: e.target.value })}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>Cancel</Button>
        <Button onClick={handleSubmit}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
}

export default SongDialog;
