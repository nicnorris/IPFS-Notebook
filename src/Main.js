/*import ReactMarkdown from "react-markdown";*/

const cryptojs = require('crypto-js');

function Main({ activeNote, onUpdateNote }){

    const onEditField= (key, value) => {
        onUpdateNote({
            ...activeNote,
            [key]: value,
            lastModified:Date.now(),
        });
    };

    const encrypt = () => {
        const ciphertext = cryptojs.AES.encrypt(activeNote.body, 'secret key 123').toString();
        onUpdateNote({
            ...activeNote,
            body: ciphertext,
        });
    };

    const decrypt = () => {
        const bytes  = cryptojs.AES.decrypt(activeNote.body, 'secret key 123');
        const originalText = bytes.toString(cryptojs.enc.Utf8);
        onUpdateNote({
            ...activeNote,
            body: originalText,
        });
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
                Encrypt
            </button>
            <button onClick={decrypt}>
                Decrypt
            </button>
        </div>
        {/*<div className="app-main-note-preview">
            <h1 className="preview-title">{activeNote.title}</h1>
            <ReactMarkdown className="markdown-preview">{activeNote.body}</ReactMarkdown>
        </div>*/}


    </div>;

}


export default Main;