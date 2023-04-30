import qs from 'querystring';
import { useLocation } from 'react-router';

function useParams() {
  const location = useLocation();
  return qs.parse(location.search.replace('?', ''));
}

export default useParams;
