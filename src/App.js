import {useState} from "react";
import uuid from "react-uuid";
import './App.css';
import Sidebar from "./Sidebar";
import Main from "./Main";
import { Web3Storage } from 'web3.storage/dist/bundle.esm.min.js';
const ethers = require('ethers');
const server = "http://localhost:3042";
require('dotenv').config();

function App() {
  const [notes, setNotes ] = useState([]);
  const [activeNote, setActiveNote] = useState(false);
  const [isWeb3Connected, setIsWeb3Connected] = useState(false);
  const [userAddress, setUserAddress] = useState('');

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
    try{
      const storageClient = new Web3Storage({token: process.env.REACT_APP_API_TOKEN});
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
    catch(e){
      return;
    }
  }            

  const connectWeb3 = async () => {
    if(isWeb3Connected){
      return;
    }
    if(window.ethereum){
        await window.ethereum.enable()
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setUserAddress(address);
        setIsWeb3Connected(true);
        if(address){  
          await getNotesDb(address);
        }
    }
  }

  const saveNoteDb = async(cid) => {
    if(!isWeb3Connected){
      return;
    }
    const request = new Request(`${server}/send/${userAddress}/${cid}`, { method: 'POST' });
    try{
      await fetch(request);
    }
    catch(err){
      console.log(err);
    }
  }
  
  const getNotesDb = async(address) => {
    try{
      const myreq = `${server}/cids/${address}`;
      const response = await fetch(myreq);
      const responseArr = await response.json();
      let noteCids = '';
      for(let i=0; i<responseArr.length; i++){
        const cid = responseArr[i].cid;
        console.log(cid);
        noteCids += cid + '\n';
      }
      const newNote = {
        id: uuid(),
        title: "Your CIDs",
        body: noteCids,
        lastModified: Date.now(),
      };
      setNotes([newNote, ...notes]);

    } 
    catch(err){
      console.log(err);
    }
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
     connectWeb3 = {connectWeb3}
     />
    <Main activeNote={getActiveNote()} onUpdateNote={onUpdateNote} saveNoteDb={saveNoteDb}/>

    </div>
  );
}

export default App;
