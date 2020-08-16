import React from 'react';

function MessageContent(props) {
  if (props.type === 'Text') {
    return <span>{props.message}</span>;
  } else if (props.type === 'File') {
    if (
      props.message
        .substring(props.message.length - 5, props.message.length)
        .toLowerCase() === '.jpeg' ||
      props.message
        .substring(props.message.length - 4, props.message.length)
        .toLowerCase() === '.jpg' ||
      props.message
        .substring(props.message.length - 4, props.message.length)
        .toLowerCase() === '.png' ||
      props.message
        .substring(props.message.length - 4, props.message.length)
        .toLowerCase() === '.gif'
    )
      return <img src={props.message} alt={props.message} width={'200vw'} />;
    else
      return (
        <a href={props.message} target='_blank' rel='noopener noreferrer'>
          {props.message.substring(75, props.message.length)}
        </a>
      );
  }
}

export default MessageContent;
