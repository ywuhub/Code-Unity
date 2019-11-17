import React from 'react';
import '@/Style/AvatarPicker.css';
import { handleResponse } from '@/_helpers';
import ImagePicker from 'react-image-picker'
import { ChromePicker, SwatchesPicker, PhotoshopPicker,CirclePicker } from 'react-color';
import 'react-image-picker/dist/index.css'

class AvatarPicker extends React.Component {
    constructor(props) {
        super(props);
        this.featureSwitch = this.featureSwitch.bind(this);
        this.onPick = this.onPick.bind(this);
        this.handleColourChangeComplete = this.handleColourChangeComplete.bind(this);
        this.state = {
            "eyeList":["eyes1","eyes10","eyes2","eyes3","eyes4","eyes5","eyes6","eyes7","eyes9"],
            "noseList":["nose2","nose3","nose4","nose5","nose6","nose7","nose8","nose9"],
            "mouthList":["mouth1","mouth10","mouth11","mouth3","mouth5","mouth6","mouth7","mouth9"],
            image: null,
            "eye":"eye1",
            "nose":"nose2",
            "mouth":"mouth1",
            "colour":"9e4f00",
            "featureSelected":"eye"
        };
    }

   componentDidMount() {
        console.log("========componentWillReceiveProps")
        //I cannot fix the cors issues. So I'm going to hard code the avator feature types.

        // fetch("https://api.adorable.io/avatars/list", { method: 'GET', 
        //                                                 headers: 
        //                                                     {'Content-Type': 'application/json',
        //                                                     'Access-Control-Allow-Origin':'*'
        //                                                     },
        //                                                 mode: 'cors',
        //                                                 dataType: "jsonp",
        //                                             })
        //     .then(handleResponse)
        //     .then(data => {
        //         this.setState({ 
        //             Data: data
        //         });
        //     })
        console.log(this.state)
    }
    onPick(image) {
        console.log(image.value)
        const type = this.state.featureSelected;

        this.setState({
            [type]:image.value
        })

    }
    featureSwitch(e) {
        this.setState({
            featureSelected:e.target.value
        })
        console.log(this.state)
    }
    handleColourChangeComplete(color,event) {
        console.log(color.hex.substr(1))
        this.setState({
            colour:color.hex.substr(1)
        })
    }
    render() {
        let keyValue =0;
        return(
                <div className="modal fade" tabIndex="-1" role="dialog" id={this.props._id} aria-hidden="true">
                  <div className="modal-dialog modal-lg avatar-modal-dialog" role="document">
                        <div className="modal-content avatar-modal-content">
                          <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLongTitle">Choose my Avatar</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                              <span aria-hidden="true">&times;</span>
                            </button>
                          </div>
                          <div className="modal-body avatar-modal-body mb-3 container-fluid row">
                                <div className="col-sm-5 avatar-scollbar-left">
                                    <div className="d-flex align-items-center justify-content-center row">
                                        <img src={`https://api.adorable.io/avatars/face/${this.state.eye}/${this.state.nose}/${this.state.mouth}/${this.state.colour}`} 
                                        className="mx-auto img-fluid img-circle d-block rounded-circle avatar-image-left" alt="avatar" />                                        
                                    </div>   
                                    <div className="d-flex align-items-center justify-content-center row mt-5">
                                        <CirclePicker 
                                            onChangeComplete={ this.handleColourChangeComplete } />   
                                    </div>
                                </div>
                                <div className="col-sm-7 border-left">
                                    <div className="row d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center ml-3 mr-3 mt-2 pb-2 mb-3 border-bottom">
                                        <div class="form-check form-check-inline">
                                          <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="eye" onClick={this.featureSwitch}/>
                                          <label class="form-check-label" htmlFor="inlineRadio1">eye</label>
                                        </div>
                                        <div class="form-check form-check-inline">
                                          <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="nose" onClick={this.featureSwitch}/>
                                          <label class="form-check-label" htmlFor="inlineRadio2">nose</label>
                                        </div>
                                        <div class="form-check form-check-inline">
                                          <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio3" value="mouth" onClick={this.featureSwitch}/>
                                          <label class="form-check-label" htmlFor="inlineRadio3">mouth</label>
                                        </div>
                                    </div>
                                    <div className="avatar-scollbar container">
                                        {(this.state.featureSelected == "eye") &&
                                        <div className="eye">
                                            <ImagePicker 
                                              images={this.state.eyeList.map((feature, i) => (
                                                {src: `https://api.adorable.io/avatars/face/${feature}/${this.state.nose}/${this.state.mouth}/${this.state.colour}`, 
                                                value: feature})
                                              )}
                                                onPick={this.onPick}
                                            />
                                        </div>        
                                        }
                                        {(this.state.featureSelected == "nose") &&
                                        <div className="nose">
                                            <ImagePicker 
                                              images={this.state.noseList.map((feature, i) => (
                                                {src: `https://api.adorable.io/avatars/face/${this.state.eye}/${feature}/${this.state.mouth}/${this.state.colour}`, 
                                                value: feature})
                                              )}
                                                onPick={this.onPick}
                                            />
                                        </div>        
                                        }
                                        {(this.state.featureSelected == "mouth") &&
                                        <div className="mouth">
                                            <ImagePicker 
                                              images={this.state.mouthList.map((feature, i) => (
                                                {src: `https://api.adorable.io/avatars/face/${this.state.eye}/${this.state.nose}/${feature}/${this.state.colour}`, 
                                                value: feature})
                                              )}
                                                onPick={this.onPick}
                                            />
                                        </div>        
                                        }
                                    </div>
                                </div>
                          </div>
                          <div className="modal-footer mb-3">
                              <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                              <button type="button" className="btn btn-primary" type="submit">Save changes</button>
                          </div>
                        </div>
                  </div>
                </div>
            );
        }
};
export { AvatarPicker };