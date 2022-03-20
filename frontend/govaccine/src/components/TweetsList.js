import React, { useState, useEffect } from "react";
import tweetsService from "../services/tweetsService";
import TablePagination from '@mui/material/TablePagination';
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { useParams, useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
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
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ReactPaginate from 'react-paginate';
import './TweetsList.css';
import Grid from '@material-ui/core/Grid';
import retweeticon from '../assets/retweet.png';
import { styled } from '@mui/material/styles';
import { makeStyles } from "@material-ui/core/styles";
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

function TweetsListPaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}


TweetsListPaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};


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
        console.log(response.data);
        setTweets(response.data.docs);
        setLoading(false);
        setPageCount(Math.ceil(response.data.docs.length / perPage));
        setDisplayData(response.data.docs.slice(0,perPage))
        setSuggestions(response.data.suggestions.length>0?response.data.suggestions[1].suggestion[0]:[])
        console.log(suggestions)
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

    <Grid
  container
  spacing={0}
  direction="column"
  alignItems="center"
  justify="center"
  style={{ minHeight: '100vh' }}
 ></Grid>

 const useStyles = makeStyles(() => ({
  lowerMetaData: {
    alignItems: "center",
    display: "flex",
    flexDirection:'row',
    justifyContent:'flex-start',
    alignContent:'flex-start',
    width:'100%',
    margin:'0px'
  }
}));

const clickSuggestion=e=>{
  SetQuery(suggestions)
  navigate("/search/" + suggestions+"/"+sortBy+"/"+sortOrder+"/"+sentimentType+"/"+numResults);
};
 
const classes = useStyles();

  return (
    
    <div style={{height:'100vh',display:'flex',flexDirection:'column',justifyContent:'space-between'}}>
    
      {loading?<Progress message='Retrieving Tweets'/>:
    ( <div >
      {
      
      displayData.length > 0?
      displayData.slice(minValue, maxValue).map(tweet => (
      <Card className='card'>
      <CardContent style={{width:'100%', padding:'0px'}}>
        <div style={{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',width:'100%',alignContent:'center',backgroundColor:'#92A8D1'}}>
        <AccountCircleIcon sx={{ color: 'grey',m:0,mt:2,fontSize:50 }}/>
      <Tooltip title={<div><span style={{ color: "lightblue", fontSize:16 }}>Acct Desc: {tweet.acctdesc}</span><br></br><span style={{ color: "lightblue", fontSize:16 }}>Location: {tweet.location}</span></div>} sx={{ fontSize: 13 }} >
      <Typography className='userName' sx={{ fontSize: 20,mt:0.5,mb:0.5, width:'100%',fontWeight:'bold' }} color='blue' variant="h5" component="div" width='100%'>
          {tweet.username}
          
        </Typography>
        </Tooltip>
        <div style={{display:'flex',flexDirection:'row',justifyContent:'center'}}>
        <Typography sx={{ fontSize: 13,fontWeight:'bold',mb:1.5,my:0,mr:2}}>Followers: <span style={{fontSize: 13,fontWeight:'bold',color:'blue'}}>{tweet.followers}</span></Typography>
        <Typography sx={{ fontSize: 13,my:0,mr:2,mb:1.5,fontWeight:'bold'  }} >Following: <span style={{fontSize: 13,fontWeight:'bold',color:'blue'}}>{tweet.following}</span></Typography>
        <Typography sx={{ fontSize: 13,my:0,fontWeight:'bold',mb:1.5 }} >Total Tweets: <span style={{fontSize: 13,fontWeight:'bold',color:'blue'}}>{tweet.totaltweets}</span></Typography>

        </div>
        </div>
        <Divider align='center' />
        <Grid container sx={{color:'blue'}} style={{padding:'17px'}}>
        <Typography sx={{ fontSize: 17,my:3, width:'100%' }} color="text.primary" gutterBottom>
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
        <Typography sx={{ mb: 0 }} align='right' color="text.primary">
          {tweet.tweetcreatedts}
        </Typography>
        </Grid>
        </Grid>
      </CardContent>
     
    </Card>
    )):<div style={{height:'100%'}}>{suggestions.length>0?<div style={{fontSize:18,fontStyle:'italic'}}>Did you mean <span style={{fontSize:18,fontStyle:'italic',color:'red',textDecoration:'underline',cursor:'pointer'}} onClick={clickSuggestion}>{suggestions}</span>?</div>:null}<div style={{fontSize:30,color:'blue',marginTop:'40px',fontStyle:'italic'}}>No Tweets Found</div></div>
      }
      {displayData.length>0&&
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
                    activeClassName={"active"}/>}
      </div>)}
   
    </div>
  );
}
      /*<TableContainer component={Paper}>
      <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
        <TableBody>
          {(rowsPerPage > 0
            ? tweets.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : tweets
          ).map((tweet) => (
            <TableRow key={tweet.text}>
              <TableCell component="th" scope="row">
                {tweet.text}
              </TableCell>
              <TableCell style={{ width: 160 }} align="right">
                {tweet.username}
              </TableCell>
              <TableCell style={{ width: 160 }} align="right">
                {tweet.tweetcreatedts}
              </TableCell>
            </TableRow>
          ))}

          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[10, 20, 50, { label: 'All', value: -1 }]}
              colSpan={3}
              count={tweets.length}
              rowsPerPage={rowsPerPage}
              labelRowsPerPage={"Tweets Per Page:"}
              page={page}
              SelectProps={{
                inputProps: {
                  'aria-label': 'rows per page',
                },
                native: true,
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TweetsListPaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
      
    </TableContainer>*/


// export default function TweetList() {
//   // const [tweets, setTweets] = useState();
//   const [tweets, setTweets] = useState([]);
//   let { queryParam } = useParams();
//   const [query, SetQuery] = React.useState();

//   useEffect(() => {
//     SetQuery(queryParam || "");
//     console.log(queryParam);
//     retrieveTweets(queryParam, 10, "tweetcreatedts", "desc");
//   }, [queryParam]);

//   const retrieveTweets = (query, numResults, sortBy, sortOrder) => {
//     tweetsService
//       .getTweets(query, numResults, sortBy, sortOrder)
//       .then((response) => {
//         console.log(response.data);
//         setTweets(response.data.docs);
//       })
//       .catch((e) => {
//         console.log(e);
//       });
//   };
//   //   const retrieveTweets = () => {
//   //     setTweets([
//   //       { username: "Ford", text: 15000 , key:1},
//   //       { username: "toyota", text: 12000 , key:2 },
//   //       { username: "Rover", text: 14000 , key:3 }
//   //     ]);
//   //     console.log(tweets);
//   //   };
//   return (
//     <div className="row m-5">
//       <div className="col-2">
//           <div className="FilterPanel">Filter placeholder</div>
//       </div>
//       <div className="col-10">
//         {tweets.map((tweet) => {
//           return (
//             <Card sx={{ minWidth: 275 }} variant="outlined">
//               <CardContent>
//                 <div className="row">
//                   <div className="col-1 align-middle">
//                     <Avatar src="/broken-image.jpg" />
//                   </div>

//                   <div className="col-8 text-start">
//                     <div>
                      
//                       {tweet.username} -&nbsp;
//                       <label className="TweetDateLabel">
//                         {tweet.tweetcreatedts}
//                       </label>
//                     </div>
//                     <div> {tweet.text}</div>
//                   </div>
//                   <div className="col-3 ">
//                     <label>Sentiment placeholder</label>
//                   </div>

//                 </div>
//               </CardContent>
//             </Card>
//           );
//         })}
//         <br />
//         <div className="ml-auto">
//           <Pagination count={10} showFirstButton showLastButton color="secondary" />
//         </div>
//       </div>
//     </div>
//   );
// }
