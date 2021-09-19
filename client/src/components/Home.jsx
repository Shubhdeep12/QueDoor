import React, { useState, useEffect, useRef } from "react";
import { Topbar, CreatePost, Post, Loading } from "../components";
import { useHistory } from "react-router-dom";
import "./Home.css";
import { useSelector, useDispatch } from "react-redux";
import axios from "../axios";

import { signout } from "../actions";

function Home() {
  const history = useHistory();
  const userId = useSelector((state) => state.authDetails.userId);
  const [postsData, setPostsData] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const dispatch = useDispatch();
  useEffect(async () => {
    try {
      const status = await axios.get("/status", { userId });

      const p = await axios.get("/Home/" + userId);
      //console.log("refreshed");
      setPostsData(p.data);
      // console.log(p.data);
    } catch (err) {
      console.log(err.response);
      await axios.get("/logout");
      dispatch(signout());
      localStorage.setItem("userId", "");
      setRefresh(!refresh);
    }
  }, [refresh]);

  const handleCreatePostValue = async (value) => {
    //console.log(value);

    try {
      if (value.text === "" && value.image === null) {
        throw Error("value is null");
      }
      let createPostData = {
        text: value.text,
        img: {
          name: null,
          public_id: null,
        },
      };

      if (value.image) {
        let form = new FormData();
        form.append("name", Date.now() + value.image[0].name);
        form.append("image", value.image[0]);

        try {
          const responseAfterUpload = await axios.post("/upload", form);
          // console.log(responseAfterUpload);
          createPostData.img = {
            name: responseAfterUpload.data.name,
            public_id: responseAfterUpload.data.public_id,
          };
          //   console.log(responseAfterUpload);
          const responseAfterPost = await axios.post(
            "/Home/" + userId + "/post",
            createPostData
          );

          setRefresh(!refresh);
        } catch (err) {
          console.log(err);
        }
      } else {
        try {
          let responseAfterPost = await axios.post(
            "/Home/" + userId + "/post",
            createPostData
          );

          setRefresh(!refresh);
        } catch (err) {
          console.log(err);
        }
      }
    } catch (err) {}
  };
  return postsData === null ? (
    <Loading />
  ) : (
    <div className="Home">
      <Topbar togo={"Filter"} />
      <div className="Posts">
        <div className="create">
          <CreatePost postValues={handleCreatePostValue} />
        </div>
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
                  on={"Home"}
                  postid={m.post._id}
                  refreshValue={refresh}
                  change={setRefresh}
                />
              );
            })}
          </div>
        </div>
        <div className="rightbar"></div>
      </div>
    </div>
  );
}

export default Home;
