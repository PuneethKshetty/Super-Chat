import React, { useRef, useState } from 'react';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyAEZZ45G_0GLQ0izqmkQDrgLD-L48-QPUI",
  authDomain: "superchat-ef8e1.firebaseapp.com",
  databaseURL: "https://superchat-ef8e1.firebaseio.com",
  projectId: "superchat-ef8e1",
  storageBucket: "superchat-ef8e1.appspot.com",
  messagingSenderId: "245295749236",
  appId: "1:245295749236:web:3bf39f4e2534d2b5759921",
  measurementId: "G-ZXYPL9503D"
})

const auth = firebase.auth();
const firestore = firebase.firestore();
const analytics = firebase.analytics();

function App() {

  const [user] = useAuthState(auth); //sign in user is an object and signed out is null
  return (
    <div className="App">
      <header className="App-header">
      <h1>⚛️🔥💬</h1>
         <SignOut/>
      </header>
      <section>

        {user ? <ChatRoom /> : <SignIn />} 
      </section>
    </div>
  );
}
 function SignIn() {
   const signInWithGoogle = () => {
      const provider = new firebase.auth.GoogleAuthProvider();
      auth.signInWithPopup(provider);
   }
   return (
     <>
     <button className="sign-in" onClick={signInWithGoogle}>Sign in with Google</button>
     <p>Do not violate the community guidelines or you will be banned for life!</p>
     </>
   )
 }

 function SignOut() {
  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
  )
}

 function ChatRoom() {

  const dummy = useRef();
   const messagesRef = firestore.collection('messages');
   const query = messagesRef.orderBy('createdAt').limit(25);

   const [messages] = useCollectionData(query, {idField: 'id'});
   const [formValue, setFormValue] = useState('');

   const sendMessage = async(e) => {
     e.preventDefault();

     const {uid, photoURL} = auth.currentUser;

     await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

     setFormValue('');
     dummy.current.scrollIntoView({ behaviour: 'smooth'});
   }

   return (
     <>
     <main>
      
             {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
             <span ref={dummy}></span>
      </main>

      <form onSubmit={sendMessage}>

        <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="say something nice"/>

        <button type="submit" disabled={!formValue}>🦅</button>
         </form>
        </> )
 }
 function ChatMessage(props) {
   const {text, uid ,photoURL} = props.message;
  const messageClass =uid === auth.currentUser.uid ? 'sent' : 'received';
   return (<>
     <div className={'message ${messageClass}'}>
        <img src={photoURL} />
          <p>{text}</p>
       </div>
       </>
   )
 }

export default App;
