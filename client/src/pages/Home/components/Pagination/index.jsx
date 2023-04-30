import { Button } from '@mui/material';

function Pagination({ total, page, search }) {
  return (
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
  );
}

export default Pagination;
