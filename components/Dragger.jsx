import { Upload } from "antd";
import { useState } from "react";
import { InboxOutlined } from '@ant-design/icons';
import { rmExtension } from "../lib/utils";

const Dragger = ({ setFile, setFileList}) => {
  const [hasUploaded, setHasUploaded] = useState(false);
  return <Upload
    multiple
    beforeUpload={(file, fileList) => {
      if (hasUploaded) return false;
      console.log("Files uploaded")
      console.log("file", file);
      console.log("listList", fileList);
      setFile(file);
      if (fileList.length > 1) {
        setFileList(fileList); // still triggers every time.
        setHasUploaded(true);
      } else {
        setFileList(p => [...p, file]);
      }
      setName(file.name);
      setOutputName(rmExtension(file.name));
      return false;
    }}
  >
    <p className="ant-upload-drag-icon">
      <InboxOutlined />
    </p>
    <p className="ant-upload-text">Click or drag file</p>
  </Upload>
}

export default Dragger;