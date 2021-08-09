/*import ReactMarkdown from "react-markdown";*/

import { useState } from 'react';
import { Web3Storage } from 'web3.storage/dist/bundle.esm.min.js';
const cryptojs = require('crypto-js');
const API_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDRlZjc1NTlEOUE1NjcxOUVEMjQ2OEMxODJhMTViNTA0QTkxMkJCNjYiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2Mjg0MzEzNTU3NDgsIm5hbWUiOiJIYWNrZnMifQ.E4TMeK7nY7gxk4lfYQdIdxDsge6c-SFR5adMjWaAtdo';

function Main({ activeNote, onUpdateNote }){

    const [key, setKey] = useState('');
    const [cid, setCid] = useState('');

    const onEditField= (key, value) => {
        onUpdateNote({
            ...activeNote,
            [key]: value,
            lastModified:Date.now(),
        });
    };

    const encrypt = () => {
        const ciphertext = cryptojs.AES.encrypt(activeNote.body, key).toString();
        onUpdateNote({
            ...activeNote,
            body: ciphertext,
        });
    };

    const decrypt = () => {
        try{ 
            const bytes  = cryptojs.AES.decrypt(activeNote.body, key);
            const originalText = bytes.toString(cryptojs.enc.Utf8);
            onUpdateNote({
                ...activeNote,
                body: originalText,
            });
        }
        catch(e){
            onUpdateNote({
                ...activeNote,
                body: 'bad decryption'
            });
        }
    }

    const saveNote = async () => {
        const storageClient = new Web3Storage({token: API_TOKEN});
        let blob = new Blob([JSON.stringify(activeNote)], { type: 'application/json' });
        let file = new File([blob], `${activeNote.title}.json`);
        const cid = await storageClient.put([file]);
        // onUpdateNote({
        //     ...activeNote,
        //     body: activeNote.body + cid,
        // });
        setCid(cid);
    }

    if(!activeNote) 
    return <div className="no-active-note">you have not selected a note, add one!</div>

    return <div className="app-main">
        <div className="app-main-note-edit">
            <input 
            type="text" 
            id="title" 
            value= {activeNote.title} 
            onChange= {(e) => onEditField("title", e.target.value)} 
            autoFocus 

            />
            <textarea 
            id="body" 
            placeholder="start writing here..." 
            value={activeNote.body} 
            onChange= {(e) => onEditField("body", e.target.value)} 
            />
            <button onClick={encrypt}>
                ENCRYPT
            </button>
            <button onClick={decrypt}>
                DECRYPT
            </button>
            <button onClick={saveNote}>
                SAVE
            </button>
            <input type='text' id='key' placeholder="Enter encryption key here" onChange={(e) => setKey(e.target.value)}/>
            <h3 id='cid'>Save this CID: {cid}</h3>
        </div>
        {/*<div className="app-main-note-preview">
            <h1 className="preview-title">{activeNote.title}</h1>
            <ReactMarkdown className="markdown-preview">{activeNote.body}</ReactMarkdown>
        </div>*/}


    </div>;

}


export default Main;