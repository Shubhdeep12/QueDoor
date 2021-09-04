import React, { useState, useRef, useEffect } from "react";
import "./CreatePost.css";
import { Image, RadioButtonChecked, Cancel } from "@material-ui/icons";
function CreatePost({ postValues }) {
  const [postTextValue, setPostTextValue] = useState("");
  const [image, setImagestate] = useState(null);
  const [postData, setPostData] = useState({
    text: "",
    image: null,
  });
  const inputFile = useRef(null);

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  const mic = new SpeechRecognition();

  mic.continuous = false;
  mic.lang = "en-US";
  mic.interimResults = false;
  mic.maxAlternatives = 1;

  const [isListening, setIslistening] = useState(false);

  const handleListen = () => {
    if (isListening) {
      mic.start();
      mic.onend = () => {};
    } else {
      mic.stop();
      mic.onend = () => {};
    }

    mic.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join("");

      setPostTextValue(transcript);
    };
  };

  useEffect(() => {
    handleListen();
  }, [isListening]);

  useEffect(() => {
    setPostData({
      text: postTextValue,
      image: image,
    });
  }, [postTextValue, image]);

  const handleImageUpload = (e) => {
    const { files } = e.target;
    if (files && files.length) {
      const filename = files[0].name;

      var parts = filename.split(".");
      const fileType = parts[parts.length - 1];

      let accepted = ["jpg", "png", "jpeg"];

      if (accepted.includes(fileType)) {
        setImagestate(files);
      } else {
        setImagestate(null);
      }
    }
  };
  let handleImage = (e) => {
    e.preventDefault();
    inputFile.current.click();
  };

  let deleteImage = (e) => {
    e.preventDefault();
    setImagestate(null);
  };

  let handleSubmit = (e) => {
    setPostTextValue(postTextValue);
    postValues(postData);
    setPostTextValue("");
    setImagestate(null);
  };
  return (
    <div className="content">
      <div className="create__post">
        <div className="post__text">
          <textarea
            className="text"
            value={postTextValue}
            onChange={(e) => {
              setPostTextValue(e.target.value);
            }}
            placeholder="Enter Something..."
          />
        </div>

        <div className="create__buttons">
          {image !== null && (
            <span className="upload">
              <span className="uploaded">File Uploaded Successfully</span>
              <Cancel className="Cross" onClick={deleteImage} />
            </span>
          )}
          <input
            style={{ display: "none" }}
            accept=".png,.jpg,.jpeg"
            ref={inputFile}
            onChange={handleImageUpload}
            type="file"
          />
          <Image className="Image" onClick={handleImage} />
          <RadioButtonChecked
            onClick={() => {
              setIslistening((prevState) => !prevState);
            }}
            className="Radio"
          />
          <input
            type="button"
            value="Post"
            className="post__submit"
            onClick={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}

export default CreatePost;
