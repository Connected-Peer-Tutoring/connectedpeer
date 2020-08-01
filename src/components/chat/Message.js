import React from 'react';
import moment from 'moment';

function Message(props) {
  return (
    <div className='card-panel row'>
      <span className='left'>{props.message}</span>
      <img
        className='circle right'
        src={props.image}
        alt={props.firstName + "'s pfp"}
        style={{ height: '2em' }}
      />
    </div>
  );
}

export default Message;
