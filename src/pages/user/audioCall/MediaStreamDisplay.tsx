import { useEffect, useRef } from "react";

const MediaStreamDisplay: React.FC<{ stream: MediaStream | null }> = ({ stream }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) videoRef.current.srcObject = stream;
  }, [stream]);

  return (
    <div>
      <video
        ref={videoRef}
        autoPlay
        muted={true}
        style={{ transform: "scaleX(-1)" }} 
      />
    </div>
  );
};

export default MediaStreamDisplay;
