import React, { useState, useEffect } from "react";
import { Topbar, Post, Loading } from "../components";
import axios from "../axios";
import "./Account.css";
import { useDispatch, useSelector } from "react-redux";
import { signout } from "../actions";

function Account() {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.authDetails.userId);
  const [postsData, setPostsData] = useState(null);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    let a = async () => {
      try {
        const status = await axios.get("/status", { userId });
        const p = await axios.get("/Account/" + userId);
        setPostsData(p.data);
        //console.log(postsData);
      } catch (err) {
        console.log(err.response);
        await axios.get("/logout");
        dispatch(signout());
        localStorage.setItem("userId", "");
        setRefresh(!refresh);
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
        <div className="posts">
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
              axios.get("/logout");
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
