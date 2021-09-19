import React, { useState, useEffect, useRef } from "react";
import { Comment } from "../components";
import FlipMove from "react-flip-move";
import { Image, Cancel } from "@material-ui/icons";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import { FaEllipsisV } from "react-icons/fa";
import { Avatar } from "@material-ui/core";
import axios from "../axios";
import "./Post.css";

import { useSelector } from "react-redux";

function Post({
  refreshValue,
  change,
  postid,
  name,
  text,
  comments,
  on,
  image,
}) {
  const userId = useSelector((state) => state.authDetails.userId);

  const [moreText, setmoreText] = useState(true);
  const [isCommentsOpen, setisCommentsOpen] = useState(false);
  let read_more_less = moreText ? "show more..." : "show less...";

  const [showDeleteBar, setShowDeleteBar] = useState(false);
  const [commentTextValue, setCommentTextValue] = useState("");
  const [commentImage, setCommentImage] = useState(null);
  const [commentData, setCommentData] = useState({
    text: "",
    image: null,
  });

  const inputFile = useRef(null);

  useEffect(() => {
    setCommentData({
      text: commentTextValue,
      image: commentImage,
    });
  }, [commentTextValue, commentImage]);

  const handleCommentImageUpload = (e) => {
    const { files } = e.target;
    if (files && files.length) {
      const filename = files[0].name;

      var parts = filename.split(".");
      const fileType = parts[parts.length - 1];

      let accepted = ["jpg", "png", "jpeg"];

      if (accepted.includes(fileType)) {
        setCommentImage(files);
      } else {
        setCommentImage(null);
      }
    }
  };
  let handleCommentImage = (e) => {
    e.preventDefault();
    inputFile.current.click();
  };

  let deleteCommentImage = (e) => {
    e.preventDefault();
    setCommentImage(null);
  };

  let handleCommentSubmit = async (e) => {
    e.preventDefault();
    // console.log(commentData);
    let value = {
      image: commentData.image ? commentData.image[0] : null,
      text: commentData.text,
      postid: postid,
    };

    try {
      if (value.text === "" && value.image === null) {
        throw Error("value is null");
      }
      let createCommentData = {
        text: value.text,
        postid: value.postid,
        img: {
          name: null,
          public_id: null,
        },
      };
      if (value.image) {
        let form = new FormData();
        form.append("name", Date.now() + value.image.name);
        form.append("image", value.image);
        // createCommentData.img = form.get("name");
        try {
          const responseAfterUpload = await axios.post("/upload", form);
          // console.log(responseAfterUpload);
          createCommentData.img = {
            name: responseAfterUpload.data.name,
            public_id: responseAfterUpload.data.public_id,
          };

          const responseAfterPost = await axios.post(
            "/Home/" + userId + "/comment",
            createCommentData
          );
          change(!refreshValue);
          //window.location.reload();
        } catch (err) {
          console.log(err);
        }
      } else {
        // console.log("without");
        try {
          const responseAfterPost = await axios.post(
            "/Home/" + userId + "/comment",
            createCommentData
          );
          change(!refreshValue);
          //window.location.reload();
        } catch (err) {
          console.log(err);
        }
      }
    } catch (err) {
      console.log(err);
    }
    setCommentTextValue("");
    setCommentImage(null);
    change(!refreshValue);
  };

  let handleDeleteBar = (e) => {
    e.preventDefault();
    setShowDeleteBar(!showDeleteBar);
  };

  let handlePostDelete = async (e) => {
    e.preventDefault();
    const postData = {
      postid: postid,
    };
    try {
      const responseAfterDeletePost = await axios.delete(
        "/Account/" + userId + "/post",
        { data: postData }
      );
      //console.log(responseAfterDeletePost);
      change(!refreshValue);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="posts">
      <FlipMove>
        <div className="post">
          <div className={on === "Account" ? "avatar__account" : "avatar"}>
            <Avatar
              className={
                on === "Account" ? "avatar__logo__account" : "avatar__logo"
              }
            >
              {name ? name.charAt(0).toUpperCase() : "G"}
            </Avatar>
            <h4
              className={
                on === "Account" ? "post__name__account" : "post__name"
              }
            >
              {name ? name : "Guest"}
            </h4>
            {on === "Account" && (
              <div className="ellipsis__icon">
                <FaEllipsisV onClick={handleDeleteBar} />
              </div>
            )}
          </div>
          {showDeleteBar && (
            <div className="delete__bar" onClick={handlePostDelete}>
              Delete
            </div>
          )}
          <div className="main__content">
            <div className="text">
              {text.length < 150 ? text : text.substring(0, 150)}

              {moreText ? "" : text.substring(150)}
              {text.length > 150 && (
                <div
                  role="button"
                  className="show__button"
                  onClick={() => {
                    setmoreText(!moreText);
                  }}
                >
                  {read_more_less}
                </div>
              )}
            </div>
            <div className="image">
              {image && <img src={image} alt={"Unable to load"} />}
            </div>
          </div>
          <div className="create__comment">
            <table>
              <thead>
                <tr>
                  <td colSpan="2" className="comment__logo">
                    Add Comment
                  </td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="2">
                    <input
                      className="comment__input"
                      type="text"
                      placeholder="Enter Something"
                      value={commentTextValue}
                      onChange={(e) => {
                        setCommentTextValue(e.target.value);
                      }}
                    />
                    <input
                      style={{ display: "none" }}
                      accept=".png,.jpg,.jpeg"
                      ref={inputFile}
                      onChange={handleCommentImageUpload}
                      type="file"
                    />
                    <Image
                      className="comment__image"
                      onClick={handleCommentImage}
                    />
                  </td>
                </tr>
                {commentImage && (
                  <tr className="on__upload">
                    <td>
                      <p className="comment__image__upload">
                        Image uploaded Successfully
                      </p>
                    </td>
                    <td>
                      <Cancel
                        className="cross__button"
                        onClick={deleteCommentImage}
                      />
                    </td>
                  </tr>
                )}
                <tr>
                  <td colSpan="2">
                    <button
                      type="submit"
                      className="comment__submit__button"
                      onClick={handleCommentSubmit}
                    >
                      Post
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="downbar">
            <div
              className={
                isCommentsOpen ? "comment__bar__open" : "comment__bar__close"
              }
              role="button"
              onClick={() => setisCommentsOpen(!isCommentsOpen)}
            >
              <h4>Comments</h4>

              <div className={"arrow" + (isCommentsOpen && " open")}>
                <ArrowDropDownIcon className="drop__down" />
              </div>
            </div>
            {isCommentsOpen && (
              <div className="comments">
                {comments.map((m) => (
                  <Comment
                    key={m._id}
                    m={m}
                    on={on}
                    userId={userId}
                    refreshValue={refreshValue}
                    on_change={change}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </FlipMove>
    </div>
  );
}

export default Post;
