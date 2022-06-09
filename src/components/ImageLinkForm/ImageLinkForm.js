import React from 'react';
import './ImageLinkForm.css';

const ImageLinkForm = ({onInputChange, onButtonSubmit}) =>{
    return(
        <div>
            <p className='f4'>{'This Magic brain will detect faces in your picures. Give it a try!'}</p>
            <div className='center'>
                <div className='form pa4 br3 shadow-5 center'>
                    <input className='f4 pa2 w-70 center' style={{outline:0}} type='tex'onChange={onInputChange}/>
                    <button 
                    className='f4 w-30 grow link ph3 pv2 dib white bg-light-purple ba bw-0.5 b--white'
                    onClick={onButtonSubmit}>
                        Detect</button>
                </div>
            </div>
        </div>
    );
}

export default ImageLinkForm;