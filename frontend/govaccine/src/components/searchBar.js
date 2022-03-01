import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function SearchBar(props) {
  let { queryParam } = useParams();

  const navigate = useNavigate();
  const [query, SetQuery] = React.useState();

  function handleChange(event) {
    SetQuery(event.target.value || "");
  }

  function onClick(event) {
    if (query != "") {
      navigate("/search/" + query);
    }
  }

  useEffect(() => {
    SetQuery(queryParam || "");
  }, []);

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

      <button
        type="button"
        onClick={onClick}
        className="btn btn-light btn-outline-dark font-weight-bold"
      >
        Search
      </button>
    </div>
  );
}
