import React, { useState } from "react";

import shortid from "shortid";

import FileList from "./FileList";

export default function FileLoader() {
  const [fileItems, setFileItems] = useState([]);

  const fileToDataUrl = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();

      fileReader.addEventListener("load", (evt) => {
        resolve(evt.currentTarget.result);
      });

      fileReader.addEventListener("error", (evt) => {
        reject(new Error(evt.currentTarget.error));
      });

      fileReader.readAsDataURL(file);
    });
  };

  const handleSelect = async (evt) => {
    const files = [...evt.target.files];
    const urls = await Promise.all(files.map((o) => fileToDataUrl(o)));

    const matched = urls.filter(
      (el) => fileItems.findIndex((item) => item.value === el) === -1
    );

    const newArr = matched.map((el) => ({ value: el, id: shortid.generate() }));

    setFileItems((prevFiles) => [...prevFiles, ...newArr]);
  };

  function handleRemoveItem(id) {
    setFileItems((prevFiles) => [
      ...prevFiles.filter((elem) => elem.id !== id),
    ]);
  }

  return (
    <div className="file-loader">
      <div className="file-loader-header mb-20">
        <div className="input-box">
          <input
            className="file-loader-input"
            type="file"
            name="file"
            accept="image/png, image/gif, image/jpeg"
            multiple="multiple"
            onChange={handleSelect}
          />
          <div className="file-loader-curtain">Click to select</div>
        </div>
      </div>
      <FileList files={fileItems} onRemoveItem={handleRemoveItem} />
    </div>
  );
}
