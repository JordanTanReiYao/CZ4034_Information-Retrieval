import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NormalDropdown from './Dropdown/NormalDropdown.js'

export default function SearchBar(props) {
  let { queryParam,sentimentTypeParam,sortByParam,sortOrderParam,numResultsParam} = useParams();
  const [sentimentType,setSentimentType]= React.useState();
  const [sortBy,setSortBy]=React.useState();
  const [sortOrder,setSortOrder]=React.useState();
  const [numResults,setNumResults]=React.useState('all');
  const numResultsInput=React.useRef(null)
  const navigate = useNavigate();
  const [query, SetQuery] = React.useState();

  function handleChange(event) {
    SetQuery(event.target.value || "");
  }

  const handleSentimentType=(event)=>{
    console.log(event.target.value)
      setSentimentType(event.target.value)
      console.log(sentimentType)
  };

  const handleSortBy=(event)=>{
    console.log(event.target.value)
      setSortBy(event.target.value)
  };
  const handleSortOrder=(event)=>{
    console.log(event.target.value)
      setSortOrder(event.target.value)
  };

  const handleNumInputChange=()=>{
    setNumResults(numResultsInput.current.value)
  };
  function onClick(event) {
    if (query !== "") {
      navigate("/search/" + query+"/"+sortBy+"/"+sortOrder+"/"+sentimentType+"/"+numResults);
      
    }
  }

  useEffect(() => {
    SetQuery(queryParam || "");
    setSentimentType(sentimentTypeParam);
    setNumResults(numResultsParam);
    setSortBy(sortByParam);
    setSortOrder(sortOrderParam);
  }, [queryParam,sentimentTypeParam,sortByParam,sortOrderParam,numResultsParam]);

  return (
    <div className="col-6 m-auto">
      <input
        type="text"
        className="form-control rounded-pill"
        id="formGroupExampleInput"
        onChange={handleChange}
        value={query}
        placeholder="Ask me anything about vaccines"
      ></input>
      <br />
      <div className="searchBar">
      <div className="searchParams">
      
      <NormalDropdown
      value={sortBy}
      title={'Sort By'}
      array={['relevance','tweetcreatedts','retweetcount','favoritecount']}
      handleChange={handleSortBy}
      />
      <NormalDropdown
      value={sortOrder}
      title={'Sort Order'}
      array={['asc','desc']}
      handleChange={handleSortOrder}
      />
      <NormalDropdown
      value={sentimentType}
      title={'Sentiment Type'}
      array={['all','positive','neutral','negative']}
      handleChange={handleSentimentType}
      />
      <input
         style={{'margin-left':'5px'}}
         type="number"
         ref={numResultsInput}
         placeholder={'Number of results'}
         onChange={handleNumInputChange}
         step={1}
         value={numResults}
         min={10}
         
        />
    
</div>
<div style={{'margin':'12px'}}>
      <button
        type="button"
        onClick={onClick}
        className="btn btn-light btn-outline-dark font-weight-bold"
      >
        Search
      </button>
      </div>
      </div>
      
    </div>
  );
}
