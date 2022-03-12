import React, { useState, useEffect } from "react";
import tweetsService from "../services/tweetsService";
import TablePagination from '@mui/material/TablePagination';
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { useParams } from "react-router-dom";
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
import Progress from './progress/progress.js';


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


export default function TweetsList() {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  let { queryParam } = useParams();
  const [query, SetQuery] = React.useState();

  useEffect(() => {
    SetQuery(queryParam || "");
    console.log(queryParam);
    retrieveTweets(queryParam, "all", "tweetcreatedts", "desc");
  }, [queryParam]);

  const retrieveTweets = (query, numResults, sortBy, sortOrder) => {
    setLoading(true);
    tweetsService
      .getTweets(query, numResults, sortBy, sortOrder)
      .then((response) => {
        console.log(response.data);
        setTweets(response.data.docs);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

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

  return (
    <div>{loading?<Progress message='Retrieving Tweets'/>:
    (<TableContainer component={Paper}>
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
    </TableContainer>)}
    </div>
  );
}


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
