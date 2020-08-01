import { useEffect, useState } from 'react';
import api from '../../api';

export default function GetTutorResults(query, pageNumber) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [tutors, setTutors] = useState([]);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setTutors([]);
  }, [query]);

  useEffect(() => {
    setLoading(true);
    setError(false);
    api.getTutorResults({ q: query, page: pageNumber }).then((json) => {
      setTutors((prevTutors) => {
        return [...new Set([...prevTutors, ...json.tutorIDs])];
      });
      setHasMore(json.hasMore);
      setLoading(false);
    });
  }, [query, pageNumber]);

  return { loading, error, tutors, hasMore };
}
