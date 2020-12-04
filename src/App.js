// import logo from './logo.svg';
import React , {useState, useEffect} from 'react';
import Post from "./Post";
import "./app.css"
import { db, auth } from "./firebase";
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import ImageUpload from "./ImageUpload";
import InstagramEmbed from 'react-instagram-embed';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);

  const [posts, setPosts]= useState([]);
  const [open, setOpen]= useState(false);
  const [openSignIn, setOpenSignIn]= useState(false);
  const [username, setUsername]= useState('');
  const [email, setEmail]= useState('');
  const [password, setPassword]= useState('');
  const [user, setUser] = useState(null);

  useEffect(()=>{

    const unsubscribe= auth.onAuthStateChanged((authUser)=>{
      //console.log(authUser);
      if(authUser){
        //user has loged in..
        setUser(authUser);
      } else{
        //user has loged out..
        setUser(null);
      }
    })
    return()=>{
      //perform some cleanup action
      unsubscribe();
    }
  }, [user, username]);

  useEffect(()=>{
    //this is where the code runs
    db.collection('posts').onSnapshot(snapshot=>{
      //everytime a new post is added, this code fires...
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })));
    })
  }, []);

  //USEEFFECT: runs a piece of code based on a specific condition

  const signUp = (event)=>{
     event.preventDefault();

     auth
     .createUserWithEmailAndPassword(email,password)
     .then((authUser)=>{
       return authUser.user.updateProfile({
         displayName: username
       })
     })
     .catch((error)=>alert(error.message));

     setOpen(false);
  }

  const signIn = (event)=>{
    event.preventDefault();

    auth
    .signInWithEmailAndPassword(email, password)
    .catch((error)=>alert(error.message))

     setOpenSignIn(false)
  }

  return (
    <div className="app">

      <Modal
        open={open}
        onClose={()=>setOpen(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div style={modalStyle} className={classes.paper}>
          
          <form className="app__signup">
            <center>
              <img
              src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
              alt=""
              />
            </center>

            <Input
                placeholder="username"
                type="text"
                value={username}
                onChange={(e)=>setUsername(e.target.value)}
              />
              <Input
                placeholder="email"
                type="email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
              />
              <Input
                placeholder="password"
                type="password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
              />
              <Button type="submit" onClick={signUp}>SignUp</Button>
          </form>
        </div>
        
      </Modal>

      <Modal
        open={openSignIn}
        onClose={()=>setOpenSignIn(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
              src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
              alt=""
              />
            </center>

              <Input
                placeholder="email"
                type="email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
              />
              <Input
                placeholder="password"
                type="password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
              />
              <Button type="submit" onClick={signIn}>Sign In</Button>
          </form>
        </div>
        
      </Modal>

      <div className="app__header">
        <img className="app__headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt=""
        />

        {user ? (
          <Button onClick={()=>auth.signOut()}>Logout</Button>
        ):(
          <div className="app__loginContainer">
            <Button onClick={()=> setOpenSignIn(true)}>Sign In</Button>
            <Button onClick={()=> setOpen(true)}>Sign Up</Button>
          </div>
        )}
      </div>
      
      <div className="app__posts">
      {
        posts.map(({id, post}) => (
          <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl}/>
        ))
      }
      </div>

      <InstagramEmbed
        url='https://instagr.am/p/Zw9o4/'
        clientAccessToken='123|456'
        maxWidth={320}
        hideCaption={false}
        containerTagName='div'
        protocol=''
        injectScript
        onLoading={() => {}}
        onSuccess={() => {}}
        onAfterRender={() => {}}
        onFailure={() => {}}
      />

      {user?.displayName?(
        <ImageUpload username={user.displayName} />
      ):(
        <h2>Sorry you need to login to upload</h2>
      )}
      
    </div>
  );
}

export default App;
