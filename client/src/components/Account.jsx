import React, { useState, useEffect } from "react";
import { Topbar, Post, Loading } from "../components";
import axios from "../axios";
import "./Account.css";
import { useDispatch } from "react-redux";
import { signout } from "../actions";

import { useSelector } from "react-redux";
function Account() {
  const dispatch = useDispatch();
  const userID = useSelector((state) => state.authDetails.userId);
  const [postsData, setPostsData] = useState(null);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    let a = async () => {
      try {
        const p = await axios.get("/Account/" + userID);
        setPostsData(p.data);
        //console.log(postsData);
      } catch (err) {
        console.log(err.response);
      }
    };
    a();
  }, [refresh]);
  return postsData === null ? (
    <Loading />
  ) : (
    <div className="Account">
      <Topbar togo={"Home"} />

      <div className="Posts">
        <div className="posts__on__Account">
          <div className="each__post">
            {postsData.posts.map((m) => {
              return (
                <Post
                  key={m.post._id}
                  name={m.post.name}
                  text={m.post.text}
                  comments={m.comments}
                  image={m.post.image.name}
                  on={"Account"}
                  postid={m.post._id}
                  refreshValue={refresh}
                  change={setRefresh}
                />
              );
            })}
          </div>
        </div>
        <div className="rightbar">
          <button
            className="signout"
            onClick={(e) => {
              e.preventDefault();
              dispatch(signout());
              localStorage.setItem("userId", "");
            }}
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}

export default Account;
