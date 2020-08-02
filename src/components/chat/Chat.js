import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import io from 'socket.io-client';
import moment from 'moment';
import Dropzone from 'react-dropzone';
import Message from './Message';

class Chat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      roomId: null,
      message: ''
    };
  }

  async componentDidMount() {
    const roomId = await this.props.match.params.roomId;
    this.setState({ roomId: roomId });

    console.log(roomId);
    console.log(await this.props.user_data.chat_passwords[roomId]);

    let server = 'http://localhost:3001';

    this.socket = io(server);

    this.socket.emit('connectToRoom', roomId);
    console.log('connected');

    this.socket.on('accessDenied', (messageFromServer) => {
      console.log(messageFromServer);
      window.location.href = '/chat';
    });

    this.socket.on('newMessage', (messageFromServer) => {
      console.log(messageFromServer);
    });
  }

  componentDidUpdate() {
    // this.messagesEnd.scrollIntoView({ behavior: 'smooth' });
  }

  hanleSearchChange = (e) => {
    this.setState({
      chatMessage: e.target.value
    });
  };

  onDrop = (files) => {
    console.log(files);
  };

  submitChatMessage = (e) => {
    e.preventDefault();

    let chatMessage = this.state.chatMessage;
    let userId = this.props.user_data._id;
    let nowTime = moment();
    let type = 'Text';

    this.socket.emit('Input Chat Message', {
      chatMessage,
      userId,
      nowTime,
      type
    });
    this.setState({ chatMessage: '' });
  };

  render() {
    return (
      <div className='col s12 xl8 offset-xl2'>
        <div className='row'>
          <div className='col s12'>
            <div className='card-panel chat-config' style={{ margin: '0.5em' }}>
              <Message
                key={null}
                message='Hello World'
                image={this.props.user_data.image}
                firstName={this.props.user_data.firstName}
              />
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='col s12 xl11'>
            <textarea
              id='Message'
              className='materialize-textarea'
              style={{ margin: '0.5em' }}></textarea>
          </div>
          <div className='col s12 xl1'>
            <a
              href='#Send'
              className='btn waves-effect waves-light blue'
              style={{ margin: '0.5em' }}>
              <i className='material-icons'>send</i>
            </a>
            <a
              href='#Send'
              className='btn-floating btn waves-effect waves-light blue'
              style={{ margin: '0.5em' }}>
              <i className='material-icons'>attach_file</i>
            </a>
          </div>
        </div>
      </div>
    );
  }
}

const ChatWithRouter = withRouter(Chat);
export default ChatWithRouter;
