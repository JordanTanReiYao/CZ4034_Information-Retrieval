import "./App.css";
import "./bootstrap/css/bootstrap.css";
import SearchBar from "./components/searchBar";
import NavBar from "./components/navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TweetsList from "./components/TweetsList";
import React from "react";

function App() {
  

  return (
    <div className="App">
      <NavBar />
      <div className="row mt-5 h-100">
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <div>
                  <h1>GO VACCINES</h1>
                  <br />
                  <SearchBar ></SearchBar>
                
                </div>
              }
            />
            <Route
              path="/search/:queryParam/:sortByParam/:sortOrderParam/:sentimentTypeParam/:numResultsParam"
              element={
                <div>
                  <SearchBar></SearchBar>
                  
                  <TweetsList ></TweetsList>
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
