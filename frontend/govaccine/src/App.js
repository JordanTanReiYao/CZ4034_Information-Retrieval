import "./App.css";
import "./bootstrap/css/bootstrap.css";
import SearchBar from "./components/searchBar";
import NavBar from "./components/navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TweetsList from "./components/TweetsList";
import React from "react";
import {useRef} from "react";

function App() {
  const [suggestion,setSuggestion]=React.useState(null)
  const [uploaded,setUploaded]=React.useState(false)
  const updateSuggestion=(value)=>{
    if (value!='nochangeatall'){
    console.log('hihih')
    setSuggestion(value)}
  }
  const updateUploaded=(value)=>{
    setUploaded(value)
  }
  return (
    <div className="App" style={{backgroundColor:'hsl(210, 36%, 96%)',width:'100%',margin:'0px',padding:'0px'}}>
       <meta charset="UTF-8"></meta>
      <NavBar />
      <div className="row mt-5 h-100" style={{backgroundColor:'hsl(210, 36%, 96%)',width:'100%',margin:'0px',padding:'0px'}}>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <div style={{height:'100%',width:'100%',backgroundColor:'hsl(210, 36%, 96%)',margin:'0px'}}> 
                  <h1>GO VACCINE</h1>
                  <br />
                  <SearchBar suggestion={suggestion} updateSuggestion={updateSuggestion} updateUploaded={updateUploaded}></SearchBar>
                
                </div>
              }
            />
            <Route
              path="/search/:queryParam/:sortByParam/:sortOrderParam/:sentimentTypeParam/:numResultsParam"
              element={
                <div style={{height:'100%',width:'100%',backgroundColor:'hsl(210, 36%, 96%)',margin:'0px'}}>
                  <SearchBar suggestion={suggestion} updateSuggestion={updateSuggestion} updateUploaded={updateUploaded}></SearchBar>
                  
                  <TweetsList updateSuggestion={updateSuggestion} uploaded={uploaded} updateUploaded={updateUploaded}></TweetsList>
                </div>
              }
              // render={(routeProps) => (
              //   <TweetList routeProps={routeProps} animate={true} />
              // )}
            />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
