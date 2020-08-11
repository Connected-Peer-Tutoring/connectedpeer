import React from 'react';

function MessageContent(props) {
  if (props.type === 'Text') {
    return <span>{props.message}</span>;
  } else if (props.type === 'File') {
    if (
      props.message.substring(
        props.message.length - 5,
        props.message.length
      ) === '.jpeg' ||
      props.message.substring(
        props.message.length - 4,
        props.message.length
      ) === '.jpg' ||
      props.message.substring(
        props.message.length - 4,
        props.message.length
      ) === '.png' ||
      props.message.substring(
        props.message.length - 4,
        props.message.length
      ) === '.gif'
    )
      return <img src={props.message} alt={props.message} width={'200vw'} />;
    else
      return (
        <a href={props.message} target='_blank' rel='noopener noreferrer'>
          {props.message.substring(76, props.message.length)}
        </a>
      );
  }
}

export default MessageContent;
