import React, { useState } from "react";
import axios from "axios";

const ImageUpload = () => {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("samples", file);
    formData.append("upload_preset", "mern-estate"); // your preset name

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dkbd8qtc4/image/upload",
        formData
      );
      setImageUrl(response.data.secure_url);
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  return (
    <div className="p-4">
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
        Upload
      </button>
      {imageUrl && (
        <div className="mt-4">
          <p>Uploaded Image:</p>
          <img src={imageUrl} alt="Uploaded" className="max-w-xs border" />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
