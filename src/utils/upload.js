import axios from "axios";

const upload = async (file) => {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "fiverr"); // Make sure this preset is UNSIGNED in Cloudinary

  try {
    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/dveabjyht/image/upload",
      data
    );

    const { secure_url } = res.data;
    return secure_url; // ✅ This is the correct field
  } catch (err) {
    console.log("Cloudinary upload error:", err.response?.data || err.message);
    throw err;
  }
};

export default upload;
