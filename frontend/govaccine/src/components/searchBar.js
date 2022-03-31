import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NormalDropdown from "./Dropdown/NormalDropdown.js";
import "./searchBar.css";
import tweetsService from "../services/tweetsService";
import Progress from "./progress/progress.js";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import { margin } from "@mui/system";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";

export default function SearchBar(props) {
  let {
    queryParam,
    sentimentTypeParam,
    sortByParam,
    sortOrderParam,
    numResultsParam,
  } = useParams();
  const [sentimentType, setSentimentType] = React.useState(null);
  const [sortBy, setSortBy] = React.useState(null);
  const [sortOrder, setSortOrder] = React.useState(null);
  const [numResults, setNumResults] = React.useState(null);
  const numResultsInput = React.useRef("all");
  const navigate = useNavigate();
  const [query, SetQuery] = React.useState();
  const [disableOrder, setDisableOrder] = React.useState(false);
  const [sortByChange, setSortByChange] = React.useState(false);
  const [beforeNull, setbeforeNull] = React.useState();
  const [uploaded, setUploaded] = React.useState(false);
  const [file, setFile] = React.useState(null);
  const [uploading, setUploading] = React.useState(false);
  const [ErrorMessageOpen, setErrorMessageOpen] = React.useState(false);
  useEffect(() => {
    if (props.suggestion != null) {
      console.log("PPOP");
      SetQuery(props.suggestion);
      console.log(props.suggestion);

      if (
        props.suggestion !== "" &&
        sortBy != null &&
        sortOrder != null &&
        sentimentType != null
      ) {
        console.log(numResults);
        if (!numResults || numResults < 1)
          navigate(
            "/search/" +
              props.suggestion +
              "/" +
              sortBy +
              "/" +
              sortOrder +
              "/" +
              sentimentType +
              "/" +
              "all"
          );
        else
          navigate(
            "/search/" +
              props.suggestion +
              "/" +
              sortBy +
              "/" +
              sortOrder +
              "/" +
              sentimentType +
              "/" +
              numResults
          );
      }
    }
  }, [props.suggestion]);

  const handleClose = () => {
    setErrorMessageOpen(false);
  };
  function handleChange(event) {
    SetQuery(event.target.value || "");
  }

  const handleSentimentType = (event) => {
    console.log(event.target.value);
    setSentimentType(event.target.value);
    console.log(sentimentType);
  };

  const handleSortBy = (event) => {
    if (event.target.value == "relevance") {
      setbeforeNull(sortOrder);
      setDisableOrder(true);
      setSortOrder("NA");
    } else {
      setSortOrder(sortOrder == "NA" ? beforeNull : sortOrder);
      setDisableOrder(false);
    }
    console.log(event.target.value);
    setSortBy(event.target.value);
  };
  const handleSortOrder = (event) => {
    console.log(event.target.value);
    setSortOrder(event.target.value);
  };
  const handleNoOfResults = (event) => {
    console.log(event.target.value);
    setNumResults(event.target.value);
  };
  const handleNumInputChange = () => {
    setNumResults(numResultsInput.current.value);
  };
  const onClick = (event) => {
    console.log(sortBy);
    console.log(sortOrder);
    console.log(sentimentType);
    console.log(numResults);
    console.log(query);

    if (uploaded) {
      console.log(22, uploaded);
      props.updateUploaded(uploaded);
    }
    if (
      query !== "" &&
      sortBy != null &&
      sortOrder != null &&
      sentimentType != null
    ) {
      console.log(numResults);
      if (!numResults || numResults < 1)
        navigate(
          "/search/" +
            query +
            "/" +
            sortBy +
            "/" +
            sortOrder +
            "/" +
            sentimentType +
            "/" +
            "all"
        );
      else
        navigate(
          "/search/" +
            query +
            "/" +
            sortBy +
            "/" +
            sortOrder +
            "/" +
            sentimentType +
            "/" +
            numResults
        );
    } else {
      setErrorMessageOpen(true);
    }

    if (uploaded) {
      setTimeout(() => {
        setUploaded(false);
        props.updateUploaded(false);
      }, 5);
    }
  };
  const handleFileChange = (event) => {
    console.log(event.target.files[0]);
    setFile(event.target.files[0]);
  };

  const uploadFile = () => {
    console.log(file);
    if (file != null) {
      setUploading(true);
      let formData = new FormData();
      formData.append("file1", file);
      console.log(formData.get("file1"));
      tweetsService.postFile(formData).then((res) => {
        setUploaded(true);
        alert(res.data.message);
        setUploading(false);
        setUploaded(true);
        setFile(null);
      });
    }
  };

  useEffect(() => {
    SetQuery(queryParam || "");
    setSentimentType(sentimentTypeParam);
    setNumResults(numResultsParam);

    setSortOrder(sortOrderParam);
    setSortBy(sortByParam);
    setDisableOrder(sortByParam == "relevance" ? true : false);
  }, [
    queryParam,
    sentimentTypeParam,
    sortByParam,
    sortOrderParam,
    numResultsParam,
  ]);

  return (
    <div className="col-6 m-auto">
      <input
        type="text"
        className="form-control rounded-pill"
        style={{
          fontSize: "17px",
          height: "40px",
          display: "inline",
          width: "60%",
        }}
        id="formGroupExampleInput"
        onChange={handleChange}
        value={query}
        placeholder="Ask me anything about vaccines"
      ></input>
      <IconButton aria-label="delete" color="primary" onClick={onClick}>
        <SearchIcon />
      </IconButton>

      <div className="searchBar">
        <div className="searchParams">
          <FormControl style={{ width: 120, margin: 10 }}>
            <FormHelperText>Sort By</FormHelperText>

            <Select
              value={sortBy}
              onChange={handleSortBy}
              displayEmpty
              style={{ fontSize: 15 }}
            >
              <MenuItem value="relevance">relevance</MenuItem>
              <MenuItem value="tweetcreatedts">
                tweet created timestamp
              </MenuItem>
              <MenuItem value="retweetcount">retweet count</MenuItem>
              <MenuItem value="favoritecount">favorite count</MenuItem>
            </Select>
          </FormControl>

          {/* <NormalDropdown
      value={sortBy}
      title={'Sort By'}
      array={['relevance','tweetcreatedts','retweetcount','favoritecount']}
      handleChange={handleSortBy}
      /> */}
          <FormControl style={{ width: 120, margin: 10 }}>
            <FormHelperText>Sort Order</FormHelperText>

            <Select
              value={disableOrder ? "Sort Order" : sortOrder}
              disabled={disableOrder}
              onChange={handleSortOrder}
              displayEmpty
              style={{ fontSize: 15 }}
            >
              <MenuItem value="asc">ascending</MenuItem>
              <MenuItem value="desc">descending</MenuItem>
            </Select>
          </FormControl>
          {/* <NormalDropdown
            value={disableOrder ? "Sort Order" : sortOrder}
            disable={disableOrder}
            title={"Sort Order"}
            array={["asc", "desc"]}
            handleChange={handleSortOrder}
          /> */}
          {/* <NormalDropdown
            value={sentimentType}
            title={"Sentiment Type"}
            array={["all", "positive", "neutral", "negative"]}
            handleChange={handleSentimentType}
          /> */}
          <FormControl style={{ width: 120, margin: 10 }}>
            <FormHelperText>Sentiment Type</FormHelperText>

            <Select
              value={sentimentType}
              onChange={handleSentimentType}
              displayEmpty
              style={{ fontSize: 15 }}
            >
              <MenuItem value="all">all</MenuItem>
              <MenuItem value="positive">positive</MenuItem>
              <MenuItem value="neutral">neutral</MenuItem>
              <MenuItem value="negative">negative</MenuItem>
            </Select>
          </FormControl>
          <FormControl style={{ width: 150, margin: 10 }}>
            <FormHelperText>Number of results</FormHelperText>
            <TextField
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
              placeholder={"Number of results"}
              onChange={handleNoOfResults}
              value={numResults}
            />{" "}
          </FormControl>
          {/* <input
            style={{
              "margin-left": "5px",
              borderRadius: "6px",
              border: "1px solid black",
              height: "32.3px",
            }}
            type="number"
            ref={numResultsInput}
            placeholder={"Number of results"}
            onChange={handleNumInputChange}
            step={1}
            value={numResults}
            min={1}
          /> */}
        </div>
        {/* <div style={{ margin: "5px" }}>
          <button
            type="button"
            onClick={onClick}
            style={{
              paddingTop: "auto",
              paddingBottom: "auto",
              textAlign: "center",
              verticalAlign: "middle",
              display: "inline-flex",
              alignItems: "center",
            }}
            className="btn btn-light btn-outline-dark font-weight-bold"
          >
            Search
          </button>
        </div> */}
        <div style={{ marginTop: "23px" }}>
          <fieldset className="fs">
            <div
              style={{
                backgroundColor: "azure",
                borderWidth: "0px",
                borderRight: "1px solid black",
                padding: "0px",
                paddingLeft: "3px",
                verticalAlign: "middle",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                paddingRight: "3px",
                margin: "0px",
                borderRadius: "5px 0px 0px 5px",
              }}
            >
              Upload Tweets
            </div>
            <input
              style={{
                borderRadius: "0px",
                paddingLeft: "5px",
                borderColor: "black",
                margin: "auto",
                paddingTop: "1px",
                paddingBottom: "0px",
                borderWidth: "0px",
                paddingRight: "3px",
                height: "32.3px",
              }}
              onChange={handleFileChange}
              type="file"
            />
            <button
              type="button"
              onClick={uploadFile}
              style={{
                borderWidth: "0px",
                borderLeft: "1px solid black",
                paddingTop: "auto",
                paddingBottom: "auto",
                borderRadius: "0px 5px 5px 0px",
                display: "inline-flex",
                alignItems: "center",
              }}
              className="btn btn-light btn-outline-dark font-weight-bold"
            >
              Upload
            </button>
          </fieldset>
        </div>
      </div>
      <Dialog
        open={ErrorMessageOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Hold on! Something is missing"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Please key in a query and select all filters
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>OK</Button>
        </DialogActions>
      </Dialog>
      {uploading && <Progress message="Uploading Tweets" />}
    </div>
  );
}
