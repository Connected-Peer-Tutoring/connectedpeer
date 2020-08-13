import React, { useState, useRef, useCallback } from 'react';
import GetTutorResults from './GetTutorResults';
import TutorResult from './TutorResult';

export default function TutorSearchHelper(props) {
  const [pageNumber, setPageNumber] = useState(0);

  const { tutors, hasMore, loading } = GetTutorResults(props.query, pageNumber);

  const observer = useRef();
  const lastTutorElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  return (
    <>
      {tutors
        .filter((v) => v !== props.user_data._id)
        .map((tutor, index) => {
          if (tutors.length === index + 1) {
            return (
              <div ref={lastTutorElementRef}>
                <TutorResult
                  tutor={tutor}
                  time={props.query.time}
                  user_data={props.user_data}
                  updateState={props.updateState}
                  tutor_data={props.tutor_data}
                  chosenDate={props.chosenDate}
                  setState={props.setState}
                />
              </div>
            );
          } else {
            return (
              <TutorResult
                key={tutor}
                tutor={tutor}
                time={props.query.time}
                user_data={props.user_data}
                updateState={props.updateState}
                tutor_data={props.tutor_data}
                chosenDate={props.chosenDate}
                setState={props.setState}
              />
            );
          }
        })}
      <div>
        {loading ? (
          <div className='center'>
            <div className='preloader-wrapper big active'>
              <div className='spinner-layer spinner-blue-only'>
                <div className='circle-clipper left'>
                  <div className='circle'></div>
                </div>
                <div className='gap-patch'>
                  <div className='circle'></div>
                </div>
                <div className='circle-clipper right'>
                  <div className='circle'></div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}
