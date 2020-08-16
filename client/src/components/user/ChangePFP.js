import React, { Component } from 'react';
import M from 'materialize-css';
import api from '../../api';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

import Dropzone from 'react-dropzone';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

import {
  base64StringtoFile,
  extractImageFileExtensionFromBase64,
  image64toCanvasRef
} from '../fileUtils/imageUtils';

const imageMaxSize = 5000000; // bytes
const acceptedFileTypes =
  'image/x-png, image/png, image/jpg, image/jpeg, image/gif';
const acceptedFileTypesArray = acceptedFileTypes.split(',').map((item) => {
  return item.trim();
});

class ChangePFP extends Component {
  constructor(props) {
    super(props);

    this.imagePreviewCanvasRef = React.createRef();
    this.fileInputRef = React.createRef();

    this.verifyFile = this.verifyFile.bind(this);
    this.handleOnDrop = this.handleOnDrop.bind(this);
    this.handleOnCropChange = this.handleOnCropChange.bind(this);
    this.handleOnCropComplete = this.handleOnCropComplete.bind(this);
    this.handleClearToDefault = this.handleClearToDefault.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
    this.handleFileSelect = this.handleFileSelect.bind(this);

    this.state = {
      imgSrc: null,
      imgSrcExt: null,
      cropped: false,
      waiting: false,
      crop: {
        aspect: 1 / 1
      },
      openErrFile: false,
      openErr: false,
      openSuccess: false
    };
  }

  verifyFile(files) {
    if (files && files.length > 0) {
      const currentFile = files[0];
      const currentFileType = currentFile.type;
      const currentFileSize = currentFile.size;
      if (currentFileSize > imageMaxSize) {
        this.setState({ openErrFile: true });
        return false;
      }
      if (!acceptedFileTypesArray.includes(currentFileType)) {
        this.setState({ openErrFile: true });
        return false;
      }
      return true;
    }
  }

  handleOnDrop(files, rejectedFiles) {
    if (rejectedFiles && rejectedFiles.length > 0) {
      this.verifyFile(rejectedFiles);
    }

    if (files && files.length > 0) {
      const isVerified = this.verifyFile(files);
      if (isVerified) {
        // imageBase64Data
        const currentFile = files[0];
        const myFileItemReader = new FileReader();
        myFileItemReader.addEventListener(
          'load',
          () => {
            const myResult = myFileItemReader.result;
            this.setState({
              imgSrc: myResult,
              imgSrcExt: extractImageFileExtensionFromBase64(myResult)
            });
          },
          false
        );

        myFileItemReader.readAsDataURL(currentFile);
      }
    }
  }

  handleOnCropChange(crop) {
    this.setState({ crop: crop });
  }

  handleOnCropComplete(crop, pixelCrop) {
    const canvasRef = this.imagePreviewCanvasRef.current;
    const { imgSrc } = this.state;
    image64toCanvasRef(canvasRef, imgSrc, pixelCrop);
    this.setState({ cropped: true });
  }

  handleClearToDefault(event) {
    if (event) event.preventDefault();
    const canvas = this.imagePreviewCanvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    this.setState({
      imgSrc: null,
      imgSrcExt: null,
      cropped: false,
      waiting: false,
      crop: {
        aspect: 1 / 1
      },
      openErr: false,
      openSuccess: false
    });
    this.fileInputRef.current = null;
  }

  async handleUpload(event) {
    event.preventDefault();
    this.setState({ waiting: true });
    const { imgSrc } = this.state;
    if (imgSrc) {
      const canvasRef = this.imagePreviewCanvasRef.current;

      const { imgSrcExt } = this.state;
      const imageData64 = canvasRef.toDataURL('image/' + imgSrcExt);

      const myFilename =
        this.props.user_data._id + '_Profile_Picture.' + imgSrcExt;

      // file to be uploaded
      const myNewCroppedFile = base64StringtoFile(imageData64, myFilename);
      // post PFP
      let formData = new FormData();

      const config = {
        header: { 'content-type': 'multipart/form-data' }
      };

      formData.append('file', myNewCroppedFile);

      api.postNewPFP(formData, config).then((json) => {
        if (json.sucess) {
          this.setState({ openSuccess: true });
          this.handleClearToDefault(event);
          window.location.reload();
        } else {
          this.setState({ openErr: true });
          this.handleClearToDefault(event);
        }
      });
    }
  }

  handleFileSelect(event) {
    const files = event.target.files;
    if (files && files.length > 0) {
      const isVerified = this.verifyFile(files);
      if (isVerified) {
        // imageBase64Data
        const currentFile = files[0];
        const myFileItemReader = new FileReader();
        myFileItemReader.addEventListener(
          'load',
          () => {
            const myResult = myFileItemReader.result;
            this.setState({
              imgSrc: myResult,
              imgSrcExt: extractImageFileExtensionFromBase64(myResult)
            });
          },
          false
        );

        myFileItemReader.readAsDataURL(currentFile);
      }
    }
  }

  componentDidMount() {
    M.AutoInit();
  }

  render() {
    const { imgSrc } = this.state;
    return (
      <span
        onClick={(e) => this.setState({ openErr: false, openSuccess: false })}>
        <div id={'changePFPModal'} className='modal'>
          <div className='modal-content'>
            <h3 className='primary-color'>Change Profile Picture</h3>
            {imgSrc !== null ? (
              <div className='row'>
                <div className='col s12 xl6 offset-xl3'>
                  <div className='card-panel center'>
                    <ReactCrop
                      src={imgSrc}
                      crop={this.state.crop}
                      onComplete={this.handleOnCropComplete}
                      onChange={this.handleOnCropChange}
                    />
                    <canvas
                      ref={this.imagePreviewCanvasRef}
                      style={{ height: '0' }}
                    />
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
                    ) : (
                      <div>
                        {this.state.cropped ? (
                          <div>
                            <button
                              className='waves-effect waves-light btn'
                              style={{ margin: '0.5em' }}
                              onClick={this.handleUpload}>
                              Change{' '}
                              <i className='material-icons right'>send</i>
                            </button>
                          </div>
                        ) : (
                          <h6 className='primary-color'>Crop your picture</h6>
                        )}
                        <button
                          className='waves-effect waves-light btn'
                          style={{ margin: '0.5em' }}
                          onClick={this.handleClearToDefault}>
                          Clear
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <Dropzone
                onDrop={this.handleOnDrop}
                accept={acceptedFileTypes}
                multiple={false}
                maxSize={imageMaxSize}>
                {({ getRootProps, getInputProps }) => (
                  <div
                    className='card-panel center'
                    style={{ margin: '0.5em', height: '35vh' }}
                    {...getRootProps()}>
                    <input {...getInputProps()} />
                    <h5 className='primary-color'>
                      Drop or upload new PFP {'&'} crop
                    </h5>
                  </div>
                )}
              </Dropzone>
            )}
          </div>
        </div>
        <Snackbar
          open={this.state.openErrFile}
          autoHideDuration={6000}
          onClose={this.handleClose}
          onClick={() => {
            this.setState({ openErrFile: false });
          }}>
          <MuiAlert
            elevation={6}
            variant='filled'
            onClose={this.handleClose}
            severity='error'>
            Only images under 5 mb are accepted
          </MuiAlert>
        </Snackbar>
        <Snackbar
          open={this.state.openErr}
          autoHideDuration={6000}
          onClose={this.handleClose}
          onClick={() => {
            this.setState({ openErr: false });
          }}>
          <MuiAlert
            elevation={6}
            variant='filled'
            onClose={this.handleClose}
            severity='error'>
            Profile picture could not be changed
          </MuiAlert>
        </Snackbar>
        <Snackbar
          open={this.state.openSuccess}
          autoHideDuration={6000}
          onClose={this.handleClose}
          onClick={() => {
            this.setState({ openSuccess: false });
          }}>
          <MuiAlert
            elevation={6}
            variant='filled'
            onClose={this.handleClose}
            severity='success'>
            Profile picture was successfully changed
          </MuiAlert>
        </Snackbar>
      </span>
    );
  }
}

export default ChangePFP;
