import React, { useState } from "react";
import { FaEllipsisV } from "react-icons/fa";
import "./Comment.css";
import axios from "../axios";
const serverPath = "http://localhost:4000/images/";
function Comment({ on, m, userId, on_change, refreshValue }) {
  const [showDeleteBar, setShowDeleteBar] = useState(false);

  let handleDeleteBar = (e) => {
    e.preventDefault();
    setShowDeleteBar(!showDeleteBar);
  };

  let handleCommentDelete = async (e) => {
    e.preventDefault();
    let commentData = {
      commentid: m._id,
    };
    try {
      let responseAfterCommentDelete = await axios.delete(
        "/Account/" + userId + "/comment",
        { data: commentData }
      );
      // console.log(responseAfterCommentDelete);
      on_change(!refreshValue);
    } catch (err) {
      console.log(err.response);
    }
  };

  return (
    <div className="comment">
      <div className="comment__header">
        <div
          className={
            on === "Account" || on === "Home"
              ? "comment__name__account"
              : "comment__name"
          }
        >
          {m.name}
        </div>
        {(on === "Account" || on === "Home") && (
          <div className="ellipsis__icon">
            <FaEllipsisV onClick={handleDeleteBar} />
          </div>
        )}
      </div>
      {showDeleteBar && (
        <div className="delete__bar__comment" onClick={handleCommentDelete}>
          Delete
        </div>
      )}
      <div className="comment__text">{m.text && m.text}</div>
      <div className="image">
        {m.image.name && <img src={m.image.name} alt={"Unable to load"} />}
      </div>
    </div>
  );
}

export default Comment;
