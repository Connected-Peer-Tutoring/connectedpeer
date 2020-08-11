import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import io from 'socket.io-client';
import Dropzone from 'react-dropzone';
import moment from 'moment';
import Message from './Message';

import api from '../../api';

const imageMaxSize = 10000000; // bytes

class Chat extends Component {
  constructor(props) {
    super(props);

    this.handleWrite = this.handleWrite.bind(this);
    this.submitChatMessage = this.submitChatMessage.bind(this);

    this.verifyFile = this.verifyFile.bind(this);
    this.handleOnDrop = this.handleOnDrop.bind(this);

    this.state = {
      roomId: null,
      chatMessage: '',
      messages: [],
      waiting: false
    };
  }

  async componentDidMount() {
    this.setState({ roomId: await this.props.match.params.roomId });
    api.getMessages(await this.props.match.params.roomId).then(async (json) => {
      this.setState({
        messages: [...json, ...this.state.messages].sort(
          (a, b) =>
            moment(a.createdAt).valueOf() - moment(b.createdAt).valueOf()
        )
      });

      setTimeout(() => {
        if (this.messagesEnd) {
          this.messagesEnd.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500);
    });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      !this.props.user_data.chat_passwords &&
      nextProps.user_data.chat_passwords
    ) {
      let server = 'http://localhost:3001';
      this.socket = io(server);
      this.socket.emit(
        'connectToRoom',
        nextProps.match.params.roomId,
        nextProps.user_data.chat_passwords[nextProps.match.params.roomId]
      );

      this.socket.on('accessDenied', (messageFromServer) => {
        window.location.href = '/chat';
      });

      this.socket.on('newMessage', (messageFromServer) => {
        this.setState({
          messages: [...this.state.messages, messageFromServer].sort(
            (a, b) =>
              moment(a.createdAt).valueOf() - moment(b.createdAt).valueOf()
          )
        });
      });
    }
  }

  async componentDidUpdate() {
    if (this.messagesEnd) {
      this.messagesEnd.scrollIntoView({ behavior: 'smooth' });
    }
  }

  handleWrite(e) {
    this.setState({
      chatMessage: e.target.value
    });
  }

  submitChatMessage(e) {
    e.preventDefault();

    if (this.state.chatMessage !== '') {
      const newMessage = {
        chatRoom: this.state.roomId,
        message: this.state.chatMessage,
        sender: this.props.user_data._id,
        type: 'Text',
        createdAt: new Date().valueOf()
      };

      this.socket.emit('newMessageFromUser', newMessage);

      this.setState({
        chatMessage: '',
        messages: [...this.state.messages, newMessage].sort(
          (a, b) => a.createdAt - b.createdAt
        )
      });
    }
  }

  verifyFile(files) {
    if (files && files.length > 0) {
      const currentFile = files[0];
      const currentFileSize = currentFile.size;
      if (currentFileSize > imageMaxSize) {
        alert(
          'This file is not allowed. ' + currentFileSize + ' bytes is too large'
        );
        return false;
      }
      return true;
    }
  }

  handleOnDrop(files, rejectedFiles) {
    if (rejectedFiles && rejectedFiles.length > 0) {
      this.verifyFile(rejectedFiles);
    }

    if (files.length > 0) {
      this.setState({ waiting: true });

      let formData = new FormData();
      formData.append('file', files[0]);

      const config = {
        header: { 'content-type': 'multipart/form-data' }
      };

      api.postNewFile(formData, config).then((json) => {
        if (json.fileLink) {
          const newMessage = {
            chatRoom: this.state.roomId,
            message: json.fileLink,
            sender: this.props.user_data._id,
            type: 'File',
            createdAt: new Date().valueOf()
          };

          this.socket.emit('newMessageFromUser', newMessage);

          this.setState({
            chatMessage: '',
            messages: [...this.state.messages, newMessage].sort(
              (a, b) => a.createdAt - b.createdAt
            ),
            waiting: false
          });
        }
      });
    }
  }

  render() {
    if (!this.props.user_data._id) {
      return (
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
      );
    }
    return (
      <div className='col s12 xl8 offset-xl2'>
        <div className='row'>
          <div className='col s12'>
            <div className='card-panel chat-config' style={{ margin: '0.5em' }}>
              {this.state.messages.map((v, i, ar) => {
                if (i < ar.length - 1)
                  return (
                    <Message
                      key={i}
                      time={v.createdAt}
                      senderIsMe={v.sender === this.props.user_data._id}
                      type={v.type}
                      message={v.message}
                      image={
                        v.sender === this.props.user_data._id
                          ? this.props.user_data.image
                          : this.props.user_data.contacts_data[v.sender].image
                      }
                      firstName={
                        v.sender === this.props.user_data._id
                          ? this.props.user_data.firstName
                          : this.props.user_data.contacts_data[v.sender]
                              .firstName
                      }
                    />
                  );
                else
                  return (
                    <div key={i}>
                      <Message
                        time={v.createdAt}
                        senderIsMe={v.sender === this.props.user_data._id}
                        type={v.type}
                        message={v.message}
                        image={
                          v.sender === this.props.user_data._id
                            ? this.props.user_data.image
                            : this.props.user_data.contacts_data[v.sender].image
                        }
                        firstName={
                          v.sender === this.props.user_data._id
                            ? this.props.user_data.firstName
                            : this.props.user_data.contacts_data[v.sender]
                                .firstName
                        }
                      />
                      <div
                        ref={(el) => {
                          this.messagesEnd = el;
                        }}
                        style={{ float: 'left', clear: 'both' }}
                      />
                    </div>
                  );
              })}
            </div>
          </div>
        </div>
        {this.state.waiting ? (
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
        <div className='row'>
          <div className='col s12 xl11'>
            <textarea
              id='Message'
              className='materialize-textarea'
              value={this.state.chatMessage}
              onChange={this.handleWrite}
              style={{ margin: '0.5em' }}></textarea>
          </div>
          <div className='col s12 xl1'>
            <a
              href='#Send'
              className='btn waves-effect waves-light blue'
              onClick={this.submitChatMessage}
              style={{ margin: '0.5em' }}>
              <i className='material-icons'>send</i>
            </a>
            <Dropzone
              onDrop={this.handleOnDrop}
              multiple={false}
              maxSize={imageMaxSize}>
              {({ getRootProps, getInputProps }) => (
                <span {...getRootProps()}>
                  <input {...getInputProps()} />
                  <button
                    className='btn-floating btn waves-effect waves-light blue'
                    style={{ margin: '0.5em' }}>
                    <i className='material-icons'>attach_file</i>
                  </button>
                </span>
              )}
            </Dropzone>
          </div>
        </div>
      </div>
    );
  }
}

const ChatWithRouter = withRouter(Chat);
export default ChatWithRouter;
