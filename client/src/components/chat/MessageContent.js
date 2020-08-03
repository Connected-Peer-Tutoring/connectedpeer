import React from 'react';

function MessageContent(props) {
  if (props.type === 'Text') {
    return <span>{props.message}</span>;
  } else if (props.type === 'File') {
    return null;
  }
}

export default MessageContent;
