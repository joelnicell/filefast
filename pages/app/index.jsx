import { Spin, Upload, Input, Button, message, Slider } from "antd";
import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import { InboxOutlined } from "@ant-design/icons";
import { fileTypeFromBuffer } from "file-type";
import { Analytics } from "@vercel/analytics/react";
import numerify from "numerify/lib/index.cjs";
import { formatQuality, rmExtension, getExtensionType } from "../utils";
import qs from "query-string";
import JSZip from "jszip";
import ActionBtn from "../../components/ActionBtn";
import Tag from "../../components/Tag";
import Tags from "../../components/Tags";
import ArrowRight from "../../components/ArrowRight";
// import Dragger from "../../components/Dragger"; // not being used, error with styling

const { Dragger } = Upload;

const SLIDER_MAX = 100;

const App = () => {
  const [spinning, setSpinning] = useState(false);
  const [tip, setTip] = useState(false);

  // default options
  const [quality, setQuality] = useState(SLIDER_MAX * 0.7);
  const [compression, setCompression] = useState(SLIDER_MAX * 0.8);
  const [outputExtension, setOutputExtension] = useState("jpg");
  const [action, setAction] = useState("convert"); // convert, compress
  const [names, setNames] = useState([]);

  const [ogOn, setOgOn] = useState(true);
  const [customOn, setCustomOn] = useState(true);
  const [type, setType] = useState("image"); // image, video, audio, none

  const [href, setHref] = useState("");
  const [file, setFile] = useState(); // deprecate and just iterate over the fileList
  const [fileList, setFileList] = useState([]); // files from the uploader
  const [customOutput, setCustomOutput] = useState("_converted"); // deprecate and create output name during exec. 
  const [downloadFileName, setDownloadFileName] = useState("output.jpg");
  const ffmpeg = useRef();
  const currentFSls = useRef([]);
  
  const formattedQuality = useMemo(() => formatQuality(outputExtension, quality), [outputExtension, quality]);
  const outputName = useCallback((name) => {
    let output = "";
    if (ogOn) {
      output += rmExtension(name);
    }
    if (customOn) {
      output += customOutput;
    }
    output += `.${outputExtension}`;
    return output;
  }, [ogOn, customOn, customOutput, outputExtension]);

  const handleExec = async () => {
    if (!file) {
      return;
    }
    setOutputFiles([]);
    setHref("");
    setDownloadFileName("");
    try {
      setTip("Loading file into browser");
      setSpinning(true);
      // load files from state into ffmpeg file system
      for (const fileItem of fileList) {
        ffmpeg.current.FS(
          "writeFile",
          fileItem.name,
          await fetchFile(fileItem)
        );
      }
      currentFSls.current = ffmpeg.current.FS("readdir", ".");
      setTip("start executing the command");
      // loop over names and execute ffmpeg for all
      for (const name of names) {
        await ffmpeg.current.run(
          "-i",
          name,
          "-q:v",
          formattedQuality,
          outputName(name));
      }
      setSpinning(false);
      const FSls = ffmpeg.current.FS("readdir", ".");
      const outputFiles = FSls.filter((i) => !currentFSls.current.includes(i));
      if (outputFiles.length === 1) {
        const data = ffmpeg.current.FS("readFile", outputFiles[0]);
        const type = await fileTypeFromBuffer(data.buffer);

        const objectURL = URL.createObjectURL(
          new Blob([data.buffer], { type: type.mime })
        );
        setHref(objectURL);
        setDownloadFileName(outputFiles[0]);
        message.success(
          "Run successfully, click the download button to download the output file",
          10
        );
      } else if (outputFiles.length > 1) {
        var zip = new JSZip();
        outputFiles.forEach((filleName) => {
          const data = ffmpeg.current.FS("readFile", filleName);
          zip.file(filleName, data);
        });
        const zipFile = await zip.generateAsync({ type: "blob" });
        const objectURL = URL.createObjectURL(zipFile);
        setHref(objectURL);
        setDownloadFileName("output.zip");
        message.success(
          "Run successfully, click the download button to download the output file",
          10
        );
      } else {
        message.success(
          "Run successfully, No files are generated, if you want to see the output of the ffmpeg command, please open the console",
          10
        );
      }
    } catch (err) {
      console.error(err);
      message.error(
        "Failed to run, please check if the command is correct or open the console to view the error details",
        10
      );
    }
  };

  // load ffmpeg
  useEffect(() => {
    (async () => {
      ffmpeg.current = createFFmpeg({
        log: true,
        corePath: 'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js',
      });
      ffmpeg.current.setProgress(({ ratio }) => {
        console.log(ratio);
        setTip(numerify(ratio, "0.0%"));
      });
      setTip("ffmpeg static resource loading...");
      setSpinning(true);
      await ffmpeg.current.load();
      setSpinning(false);
    })();
  }, []);

  useEffect(() => {
    const { quality, compression, output } = qs.parse(
      window.location.search
    );
    if (quality) {
      setQuality(quality);
    }
    if (compression) {
      setCompression(compression);
    }
    if (output) { // todo: replace this with new custom name later.
      setCustomOutput(output);
    }
  }, []);

  useEffect(() => {
    // run after outputOptions set from querystring
    setTimeout(() => {
      let queryString = qs.stringify({ quality, compression, output: customOutput }); // todo: replace this with new custom name later.
      const newUrl = `${location.origin}${location.pathname}?${queryString}`;
      history.pushState("", "", newUrl);
    });
  }, [quality, compression, customOutput]);

  return (
    <main>
      {spinning && (
        <Spin spinning={spinning} tip={tip}>
          <div className="component-spin" />
        </Spin>
      )}

      <h1 align="center">FileFast</h1>
      <div className="section-container">
        <section>
          <h3>Select file(s)</h3>
          <p className="muted small">
            Your files will not be uploaded to the server, only processed in the
            browser
          </p>
          <Dragger
            multiple
            beforeUpload={(file, fileList) => {
              setFile(file); // not needed, but is needed for button at the end to run.
              setType(getExtensionType(fileList[0].name));
              console.log(getExtensionType(fileList[0].name));
              if (fileList.length > 1) {
                setFileList(fileList); // still triggers every time.
                setNames(fileList.map(f => f.name));
              } else {
                setFileList(p => [...p, file]);
                setNames(p => [...p, file.name]);
              }
              return false;
            }}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag file</p>
          </Dragger> 
        </section>
        <ArrowRight disabled={names.length === 0}/>

        <section className={names.length === 0 ? "section-disabled" : ""}>
          <h3>What do you want to do?</h3>
          <div className="btn-container">
            <ActionBtn onClick={() => setAction("convert")} active={action == "convert"}>Convert</ActionBtn>
            <ActionBtn onClick={() => setAction("compress")} active={action == "compress"}>Compress</ActionBtn>
          </div>
          <Tags outputType={type} outputExtension={outputExtension} setOutputExtension={setOutputExtension} />
          <div className="exec">
            <h4>Quality</h4>
            <Slider 
              min={0}
              max={100}
              value={quality}
              onChange={(value) => setQuality(value)}
              handleActiveColor="#2da8b0"
              />
            <p className="muted small">Higher quality means larger file size</p>
            <h4>Compression</h4>
            <Slider 
              value={compression}
              onChange={(value) => setCompression(value)}
              min={0}
              max={100}
              className=""
            />
            <p className="muted small">Higher compression has better results, but may take longer to process. Not yet implemented</p>
            {/* 
            <Input
              value={name}
              placeholder="please enter input filename"
              onChange={(event) => setName(event.target.value)}
            />
            */}

            {/* <div className={"command-text muted"}> include compression here 
              ffmpeg -i {name} -q:v {formattedQuality} {outputName}.{outputExtension} replace this with new custom name later.
            </div>
            */}

          </div>
        </section>
        <ArrowRight disabled={names.length === 0}/>
        <section className={names.length === 0 ? "section-disabled" : ""}>
          <h3>Output</h3>
          <h4>Pattern</h4>
          <Tag large onClick={() => setOgOn(p => !p)} active={ogOn}>Original Name</Tag>
          <Tag large onClick={() => setCustomOn(p => !p)}active={customOn}>Custom</Tag>
          <Input
              value={customOutput} // todo: remove and replace this with custom name feature later.
              placeholder="Custom output"
              onChange={(event) => setCustomOutput(event.target.value)}
            /> 
            {names.length > 0 && <p className="muted small">Example output: {outputName(names[0])}</p>}
          <Button type="primary" disabled={!Boolean(fileList[0])} onClick={handleExec}>
            run
          </Button>
          <br />
          <br />
          {href && (
            <a href={href} download={downloadFileName}>
              download file
            </a>
          )}
      </section>
    </div>
      {/* <a
        href="https://github.com/xiguaxigua/ffmpeg-online"
        target="_blank"
        className="github-corner"
        aria-label="View source on GitHub"
        rel="noreferrer"
      >
        <svg
          width="80"
          height="80"
          viewBox="0 0 250 250"
          style={{
            fill: "#151513",
            color: "#fff",
            position: "absolute",
            top: 0,
            border: 0,
            right: 0,
          }}
          aria-hidden="true"
        >
          <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path>
          <path
            d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2"
            fill="currentColor"
            style={{
              transformOrigin: "130px 106px",
            }}
            className="octo-arm"
          ></path>
          <path
            d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z"
            fill="currentColor"
            className="octo-body"
          ></path>
        </svg>
      </a> */}
      <Analytics />
    </main>
  );
};

export default App;
