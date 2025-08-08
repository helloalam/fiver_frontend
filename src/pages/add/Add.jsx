import React, { useReducer, useState } from "react";
import "./Add.scss";
import { gigReducer, INITIAL_STATE } from "../../reducers/gigReducer";
import upload from "../../utils/upload";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";

const Add = () => {
  const [singleFile, setSingleFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [state, dispatch] = useReducer(gigReducer, INITIAL_STATE);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleChange = (e) => {
    dispatch({
      type: "CHANGE_INPUT",
      payload: { name: e.target.name, value: e.target.value },
    });
  };

  const handleFeature = (e) => {
    e.preventDefault();
    const featureValue = e.target.elements[0].value.trim();
    if (featureValue) {
      dispatch({ type: "ADD_FEATURE", payload: featureValue });
      e.target.reset();
    }
  };

  const handleUpload = async () => {
    setUploading(true);
    try {
      const cover = await upload(singleFile);
      const images = await Promise.all(
        [...files].map((file) => upload(file))
      );
      dispatch({ type: "ADD_IMAGES", payload: { cover, images } });
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  const mutation = useMutation({
    mutationFn: (gig) => newRequest.post("/gigs", gig, { withCredentials: true }),
    onSuccess: () => {
      queryClient.invalidateQueries(["myGigs"]);
      navigate("/mygigs");
    },
    onError: (error) => {
      console.error("Gig creation failed:", error.response?.data || error.message);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(state);
  };

  return (
    <div className="add">
      <div className="container">
        <h1>Add New Gig</h1>
        <div className="sections">
          <div className="info">
            <label>Title</label>
            <input
              type="text"
              name="title"
              placeholder="e.g. I will do something I'm really good at"
              onChange={handleChange}
            />

            <label>Category</label>
            <select name="cat" onChange={handleChange} defaultValue="">
              <option value="" disabled>Select category</option>
              <option value="design">Design</option>
              <option value="web">Web Development</option>
              <option value="animation">Animation</option>
              <option value="music">Music</option>
            </select>

            <div className="images">
              <div className="imagesInputs">
                <label>Cover Image</label>
                <input
                  type="file"
                  onChange={(e) => setSingleFile(e.target.files[0])}
                />

                <label>Upload Images</label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => setFiles(e.target.files)}
                />
              </div>
              <button onClick={handleUpload} disabled={uploading}>
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </div>

            <label>Description</label>
            <textarea
              name="desc"
              placeholder="Brief descriptions to introduce your service to customers"
              rows="6"
              onChange={handleChange}
            ></textarea>

            <button onClick={handleSubmit}>Create</button>
          </div>

          <div className="details">
            <label>Service Title</label>
            <input
              type="text"
              name="shortTitle"
              placeholder="e.g. One-page web design"
              onChange={handleChange}
            />

            <label>Short Description</label>
            <textarea
              name="shortDesc"
              placeholder="Short description of your service"
              rows="4"
              onChange={handleChange}
            ></textarea>

            <label>Delivery Time (in days)</label>
            <input type="number" name="deliveryTime" onChange={handleChange} />

            <label>Revision Number</label>
            <input type="number" name="revisionNumber" onChange={handleChange} />

            <label>Add Features</label>
            <form onSubmit={handleFeature} className="add-feature-form">
              <input type="text" placeholder="e.g. page design" />
              <button type="submit">Add</button>
            </form>

            <div className="addedFeatures">
              {state.features.map((f, index) => (
                <div className="item" key={index}>
                  <button onClick={() => dispatch({ type: "REMOVE_FEATURE", payload: f })}>
                    {f} <span>X</span>
                  </button>
                </div>
              ))}
            </div>

            <label>Price</label>
            <input type="number" name="price" onChange={handleChange} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Add;
