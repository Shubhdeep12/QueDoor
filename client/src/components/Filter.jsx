import React, { useState, useEffect } from "react";
import { Topbar, CreatePost, Post } from "../components";
import "./Filter.css";
import axios from "../axios";
function Filter() {
  const [filterPosts, setFilterPosts] = useState({
    posts: null,
  });
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    //console.log("1" + filterPosts);
    setFilterPosts(filterPosts);
  }, [refresh]);
  const handleCreatePostValue = async (value) => {
    // console.log(value);

    try {
      if (value.text === "" && value.image === null) {
        throw Error("value is null");
      }
      let createFilterPostData = {
        text: value.text ? value.text : null,
        img: {
          name: null,
          public_id: null,
        },
      };

      if (value.image) {
        let form = new FormData();
        form.append("name", Date.now() + value.image[0].name);
        form.append("image", value.image[0]);
        //createFilterPostData.img = form.get("name");
        try {
          const responseAfterFilterUpload = await axios.post("/upload", form);
          //console.log(responseAfterFilterUpload);
          createFilterPostData.img = {
            name: responseAfterFilterUpload.data.name,
            public_id: responseAfterFilterUpload.data.public_id,
          };
          console.log(responseAfterFilterUpload.data.public_id);
          const responseAfterFilterPost = await axios.post(
            "/Filter",
            createFilterPostData
          );
          setFilterPosts(responseAfterFilterPost.data);
        } catch (err) {
          console.log(err.response);
        }
      } else {
        try {
          let responseAfterFilterPost = await axios.post(
            "/Filter",
            createFilterPostData
          );
          // console.log(responseAfterFilterPost);
          setFilterPosts(responseAfterFilterPost.data);
        } catch (err) {
          console.log(err.response);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="Filter">
      <Topbar togo={"Home"} />
      <div className="filter__bar">
        <p>This is Filter Area. Use only to Filter the Post based on Search.</p>
      </div>
      <div className="Posts">
        <div className="create">
          <CreatePost postValues={handleCreatePostValue} />
        </div>

        <div className="posts">
          <div className="each__post">
            {filterPosts.posts &&
              filterPosts.posts.map((m) => {
                return (
                  <Post
                    key={m.post._id}
                    name={m.post.name}
                    text={m.post.text}
                    comments={m.comments}
                    image={m.post.image.name}
                    on={"Filter"}
                    postid={m.post._id}
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

export default Filter;
