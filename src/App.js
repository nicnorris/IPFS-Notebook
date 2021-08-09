import {useState} from "react";
import uuid from "react-uuid";
import './App.css';
import Sidebar from "./Sidebar";
import Main from "./Main";
import { Web3Storage } from 'web3.storage/dist/bundle.esm.min.js';
const API_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDRlZjc1NTlEOUE1NjcxOUVEMjQ2OEMxODJhMTViNTA0QTkxMkJCNjYiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2Mjg0MzEzNTU3NDgsIm5hbWUiOiJIYWNrZnMifQ.E4TMeK7nY7gxk4lfYQdIdxDsge6c-SFR5adMjWaAtdo';


function App() {
  const [notes, setNotes ] = useState([]);
  const [activeNote, setActiveNote] = useState(false);

  const onAddNote = () => {
    const newNote = {
      id: uuid(), //creates random id for new note... CHANGE this
      title: "Untitled Note",
      body: "",
      lastModified: Date.now(),
    };
    setNotes([newNote, ...notes]);
  };

  const onUpdateNote = (updatedNote) => {
    const updatedNotesArray = notes.map((note) => {
      if(note.id === activeNote){
        return updatedNote;
      }
      return note;
    });

    setNotes(updatedNotesArray);
  }


  const onDeleteNote = (idToDelete) => {
    setNotes(notes.filter((note) => note.id !== idToDelete));
  }

  const getActiveNote = () => {
    return notes.find((note) => note.id === activeNote);
  }

  const retrieveNote = async (cid) => {
    const storageClient = new Web3Storage({token: API_TOKEN});
    const res = await storageClient.get(cid);
    if(!res.ok){
      throw new Error(`failed to get ${cid}`);
    }
    const files = await res.files();
    const myfile = files[0];
    const note = await myfile.text();
    const noteJson = JSON.parse(note);
    const newNote = {
      id: noteJson.id, //creates random id for new note... CHANGE this
      title: noteJson.title,
      body: noteJson.body,
      lastModified: noteJson.lastModified,
    };
    setNotes([newNote, ...notes]);
    
  }

  return (
    <div className="App" >

    <Sidebar
     notes={notes} 
     onAddNote={onAddNote} 
     onDeleteNote={onDeleteNote} 
     activeNote ={activeNote}
     setActiveNote ={setActiveNote}
     retrieveNote = {retrieveNote}
     />
    <Main activeNote={getActiveNote()} onUpdateNote={onUpdateNote} />

    </div>
  );
}

export default App;
