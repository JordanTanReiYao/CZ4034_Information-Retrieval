import React, { useState, useEffect } from "react";
import tweetsService from "../services/tweetsService";
import TablePagination from '@mui/material/TablePagination';
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { useParams, useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Progress from './progress/progress.js';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ReactPaginate from 'react-paginate';
import './TweetsList.css';
import Grid from '@material-ui/core/Grid';
import retweeticon from '../assets/retweet.png';
import twitterlogo from '../assets/twitterlogo.png';
import clock from '../assets/clock.jpg';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DonutChart from "react-donut-chart";
import { useModal } from 'react-hooks-use-modal';
import Emoji from 'react-emoji-render';


export default function TweetsList(props) {
  const [tweets, setTweets] = useState(props.tweets);
  const [loading, setLoading] = useState(true);
  let { queryParam,sentimentTypeParam,sortByParam,sortOrderParam,numResultsParam } = useParams();
  const [sentimentType,setSentimentType]= useState();
  const [sortBy,setSortBy]=React.useState();
  const [sortOrder,setSortOrder]=React.useState();
  const [numResults,setNumResults]=React.useState('all');
  const [query, SetQuery] = React.useState();
  const [pageCount,setPageCount]=React.useState();
  const [perPage,setPerPage]=React.useState(20);
  const [displayData,setDisplayData]=React.useState([]);
  const [suggestions,setSuggestions]=React.useState([]);
  const [queryTime,setQueryTime]=React.useState(0);
  const [disableOrder,setDisableOrder]=React.useState(false)
  const [sentimentResults,setSentimentResults]=React.useState([
    {
      label: "Positive",
      value: -1,
      color: "#00E396"
    },
    {
      label: "Neutral",
      value: -1,
      color: "#FEB019"
    },
    {
      label: "Negative",
      value: -1,
      color: "#FF4560"
    },
    
  ])
  const [Modal, open, close, isOpen] = useModal('root', {
    preventScroll: true,
    closeOnOverlayClick: true
  });
  useEffect(() => {
    SetQuery(queryParam || "");
    setSentimentType(sentimentTypeParam);
    setSortBy(sortByParam);
    setSortOrder(sortOrderParam);
    setNumResults(numResultsParam);
    console.log(queryParam,sentimentTypeParam);
    retrieveTweets(queryParam, numResultsParam, sortByParam, sortOrderParam,sentimentTypeParam);
  }, [queryParam,sentimentTypeParam,sortByParam,sortOrderParam,numResultsParam ]);

  const retrieveTweets = (query, numResults, sortBy, sortOrder,sentiment) => {
    setLoading(true);
    setSuggestions([]);
    tweetsService
      .getTweets(query, numResults, sortBy, sortOrder,sentiment)
      .then((response) => {
        props.updateSuggestion(null)
        setTweets(response.data.docs);
        setLoading(false);
        setPageCount(Math.ceil(response.data.docs.length / perPage));
        setDisplayData(response.data.docs.slice(0,perPage))
        setQueryTime(response.data.queryTime)
        setSuggestions(response.data.suggestions.length>0?response.data.suggestions[1].suggestion[0]:[])
        const newSentiments =sentimentResults.map(sentiments=>{
          return {...sentiments, value: response.data.docs.filter (({sentiment}) => sentiment === sentiments.label.toLowerCase()).length}
        })
        setSentimentResults(newSentiments)
          
        })
      .catch((e) => {
        console.log(e);
      });
  };

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [minValue,setminValue]=React.useState(0);
  const [maxValue,setmaxValue]=React.useState(20);
  const [currentPage,setCurrentPage]=React.useState(0);
  const [offset,setOffset]=React.useState(0);
  const navigate = useNavigate();


  // To prevent shrinking of last page in case of empty rows
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - tweets.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChange = value => {
    if (value <= 1) {
      setminValue(0)
      setmaxValue(9)
  
    } else {
      setminValue(maxValue)
      setmaxValue(value*maxValue)
      
    }
  };

  const handlePageClick = (e) => {
    const selectedPage = e.selected;
    const offset = selectedPage * perPage;
    console.log(e.selected*perPage,e.selected*perPage+perPage);
    setCurrentPage(selectedPage);
    setOffset(offset);
    setDisplayData(tweets.slice(e.selected*perPage,e.selected*perPage+perPage))
    };

    function UrlExists(url) {
        var http = new XMLHttpRequest();
        http.open('HEAD', url, false);
        http.send();
        if (http.status != 404)
            return true;
        else
            return false;
    }

    <Grid
  container
  spacing={0}
  direction="column"
  alignItems="center"
  justify="center"
  style={{ minHeight: '100vh' }}
 ></Grid>



const clickSuggestion=e=>{
  console.log(suggestions)
  props.updateSuggestion(suggestions)
  //SetQuery(suggestions)
  //navigate("/search/" + suggestions+"/"+sortBy+"/"+sortOrder+"/"+sentimentType+"/"+numResults);
};
 

const reactDonutChartdata = [
  {
    label: "Positive",
    value: 25,
    color: "#00E396"
  },
  {
    label: "Neutral",
    value: 65,
    color: "#FEB019"
  },
  {
    label: "Negative",
    value: 100,
    color: "#FF4560"
  },
  
];
const reactDonutChartBackgroundColor = [
  "#00E396",
  "#FEB019",
  "#FF4560",
  "#775DD0"
];
const reactDonutChartInnerRadius = 0.5;
const reactDonutChartSelectedOffset = 0.04;
const reactDonutChartHandleClick = (item, toggled) => {
  if (toggled) {
    console.log(item);
  }
};
let reactDonutChartStrokeColor = "#FFFFFF";
const reactDonutChartOnMouseEnter = (item) => {
  let color = reactDonutChartdata.find((q) => q.label === item.label).color;
  reactDonutChartStrokeColor = color;
};

function unicodeToChar(text){
  return text.replace(/\\u[\dA-F]{4}/gi, function(match){
     return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));});
}

function addDefaultSrc(ev){
  ev.target.src = 'https://abs.twimg.com/sticky/default_profile_images/default_profile.png'
}

  return (
    
    <div style={{display:'flex',flexDirection:'column',justifyContent:'space-between',backgroundColor:'hsl(210, 36%, 96%)',margin:'0px'}}>
      
     
      {loading?<Progress message='Retrieving Tweets'/>:
    ( <div style={{backgroundColor:'hsl(210, 36%, 96%)'}}>
      <div style={{display:'flex',flexDirection:'row',justifyContent:'space-around',alignContent:'center',alignItems:'center'}}>
        <h3 style={{marginTop:'45px'}}><span style={{color:'red',fontSize:'36px'}}>{tweets.length}</span> tweets found</h3>
      <Button onClick={open} style={{backgroundColor:'white',border:'1px solid black',paddingLeft:'20px',paddingRight:'20px'}} >View Sentiment Visualization</Button>
      <h3 style={{marginTop:'45px'}}>Query Time: <span style={{color:'red',fontSize:'36px'}}>{queryTime}s</span></h3>
      </div>
      <hr  style={{
        marginTop:'0px',
    color: '#000000',
    backgroundColor: '#000000',
    height: .5,
    borderColor : '#000000'
}}/>
      {
      
      displayData.length > 0 && sentimentResults[0].value!=-1?
      displayData.slice(minValue, maxValue).map(tweet => (
      <Card className='card'>
      <CardContent style={{width:'100%', padding:'0px',marginTop:'1px'}}>
        <div style={{paddingTop:'20px',display:'flex',flexDirection:'column',justifyContent:'center',
        alignItems:'center',width:'100%',alignContent:'center',backgroundColor:'#92A8D1'}}>
          <div style={{width:'100%'}}>
          <img src={twitterlogo} style={{position:'absolute',left:'10px',top:'8px',height:'40px'}}/>
        <Tooltip title={<div ><span style={{ color: "lightblue", fontSize:16 }}>Acct Desc: {unicodeToChar(tweet.acctdesc)}</span><br></br><span charset="UTF-8" style={{ color: "lightblue", fontSize:16 }}>Location: {tweet.location}</span></div>} sx={{ fontSize: 13 }} >
        <img src={tweet.image_url} onError={addDefaultSrc} style={{borderRadius:'10px',height:'180px',marginBottom:'10px'}}/>
        </Tooltip>
        </div>
      <Typography className='userName' sx={{ fontSize: 20,mt:0.5,mb:1, width:'100%',fontWeight:'bold' }} color='blue' variant="h5" component="div" width='100%'>
          {tweet.username}
          
        </Typography>
        
        <div style={{display:'flex',flexDirection:'row',justifyContent:'center'}}>
        <Typography sx={{ fontSize: 13,fontWeight:'bold',mb:1.5,my:0,mr:2}}>Followers: <span style={{fontSize: 13,fontWeight:'bold',color:'blue'}}>{tweet.followers}</span></Typography>
        <Typography sx={{ fontSize: 13,my:0,mr:2,mb:1.5,fontWeight:'bold'  }} >Following: <span style={{fontSize: 13,fontWeight:'bold',color:'blue'}}>{tweet.following}</span></Typography>
        <Typography sx={{ fontSize: 13,my:0,fontWeight:'bold',mb:1.5 }} >Total Tweets: <span style={{fontSize: 13,fontWeight:'bold',color:'blue'}}>{tweet.totaltweets}</span></Typography>

        </div>
        </div>
        <Divider align='center' />
        <Grid container sx={{color:'blue'}} style={{padding:'17px'}}>
        <Typography sx={{ fontSize: 17,mt:5,mb:6.5, width:'100%' }} color="text.primary" gutterBottom>
          {tweet.text}
        </Typography>
        
        
        <Grid container direction="row" alignItems="center" justifyContent='space-between' display='flex' borderColor='red' width='100%' margin='0px'>
          <div style={{display:'flex',flexDirection:'row',alignItems:'center',margin:'0px',marginRight:'12px'}}>
       <FavoriteIcon sx={{ color: 'red',marginRight:'5px' }}/> 
        <Typography  sx={{ mr: 3 }}>{tweet.favoritecount}</Typography>
        <img src={retweeticon} style={{height:'35px',margin:'0px'}}/>
        <Typography>{tweet.retweetcount}</Typography>
        </div>
       <div style={{fontSize:'17px',fontWeight:'bold',backgroundColor:tweet.sentiment=='positive'?'green':(tweet.sentiment=='neutral'?'lightblue':'red'),color:'white',padding:'10px',borderRadius:'10px'}}>{tweet.sentiment.charAt(0).toUpperCase() + tweet.sentiment.slice(1)}</div>
        <div style={{display:'flex',flexDirection:'row',justifyContent:'space-between',alignContent:'center',alignItems:'center'}}>
          <img src={clock} style={{height:'29px',marginRight:'2.9px'}}/>
        <Typography sx={{ mb: 0 }} align='right' color="text.primary">
          {tweet.tweetcreatedts}
        </Typography>
        </div>
        </Grid>
        </Grid>
      </CardContent>
     
    </Card>
    
    
    )):<div style={{height:'100%',margin:'10px'}}>{suggestions.length>0?<div style={{fontSize:18,fontStyle:'italic'}}>Did you mean <span style={{fontSize:18,fontStyle:'italic',color:'red',textDecoration:'underline',cursor:'pointer'}} onClick={clickSuggestion}>{suggestions}</span>?</div>:null}<div style={{fontSize:30,color:'blue',marginTop:'40px',fontStyle:'italic'}}>No tweets found for <span style={{fontStyle:'italic',color:'red'}}>{queryParam}</span></div></div>
      }
      {displayData.length>0&&
      <div style={{marginTop:'50px',marginBottom:'50px'}}>
        <div style={{marginTop:'80px',fontSize:'17px'}}>
      <ReactPaginate
      
      previousLabel={"prev"}
      nextLabel={"next"}
      breakLabel={"..."}
      breakClassName={"break-me"}
      pageCount={pageCount}
      marginPagesDisplayed={2}
      pageRangeDisplayed={5}
      onPageChange={handlePageClick}
      containerClassName={"pagination"}
      subContainerClassName={"pages pagination"}
      activeClassName={"active"}/>
      </div>
        <div>
      
      <Modal>
        <div style={{backgroundColor:'white',padding:'0px',display:'flex',flexDirection:'column',
        justifyContent:'center',alignItems:'center',alignContent:'center',border:'2px solid red',
        height:'80vh',padding:'10px'}}>
          <h1 style={{marginBottom:'20px'}}>Distribution of Sentiment</h1>
        <DonutChart
        className="donut"
        style={{fontSize:'20px'}}
        width={700}
        onMouseEnter={(item) => reactDonutChartOnMouseEnter(item)}
        strokeColor={reactDonutChartStrokeColor}
        data={sentimentResults}
        colors={reactDonutChartBackgroundColor}
        innerRadius={reactDonutChartInnerRadius}
        selectedOffset={reactDonutChartSelectedOffset}
        onClick={(item, toggled) => reactDonutChartHandleClick(item, toggled)}
        />
          <Button onClick={close}>CLOSE</Button>
        </div>
      </Modal>
    </div>
      </div> 
      }            
      </div>)}
    </div>
  );
}