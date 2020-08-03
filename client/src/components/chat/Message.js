import React from 'react';
import moment from 'moment';
import MessageContent from './MessageContent';

function Message(props) {
  if (props.senderIsMe) {
    return (
      <div className='row'>
        <div className='col s12 xl6 offset-xl6'>
          <div className='card-panel right'>
            <img
              className='circle right'
              src={props.image}
              alt={props.firstName + "'s pfp"}
              style={{ height: '2em' }}
            />
            <span className='right' style={{ margin: '0.5em' }}>
              <MessageContent type={props.type} message={props.message} />
            </span>
          </div>
          <span className='right' style={{ margin: '0.5em' }}>
            {moment(props.time).local().format('MMM Do h:mm A')}
          </span>
        </div>
      </div>
    );
  } else {
    return (
      <div className='row'>
        <div className='col s12 xl6'>
          <div className='card-panel left'>
            <img
              className='circle left'
              src={props.image}
              alt={props.firstName + "'s pfp"}
              style={{ height: '2em' }}
            />
            <span className='left' style={{ margin: '0.5em' }}>
              <MessageContent type={props.type} message={props.message} />
            </span>
          </div>
          <span className='left' style={{ margin: '0.5em' }}>
            {moment(props.time).local().format('MMM Do h:mm A')}
          </span>
        </div>
      </div>
    );
  }
}

export default Message;
