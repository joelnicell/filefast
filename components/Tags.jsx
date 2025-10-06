import Tag from './Tag';
const Tags = ({ outputType, outputExtension, setOutputExtension }) => {

  if (outputType == "video") {
    return <div className="tag-container">
      <Tag onClick={() => setOutputExtension("mp4")} active={outputExtension == "mp4"}>.mp4</Tag>
    </div>
  }
  if (outputType == "image") {
    return <div className="tag-container">
      <Tag onClick={() => setOutputExtension("jpg")} active={outputExtension == "jpg"}>.jpeg</Tag>
      <Tag onClick={() => setOutputExtension("png")} active={outputExtension == "png"}>.png</Tag>
      <Tag onClick={() => setOutputExtension("webp")} active={outputExtension == "webp"}>.webp</Tag>
      <Tag onClick={() => setOutputExtension("avif")} active={outputExtension == "avif"}>.avif</Tag>
    </div>
  }
  return null;
}

export default Tags;