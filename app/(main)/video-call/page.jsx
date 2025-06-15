import VideoCall from "./_components/video-call";

const VideoCallPage = async ({ searchParams }) => {
  const { sessionId, token } = await searchParams;
  return (
    <div>
      <VideoCall sessionId={sessionId} token={token} />
    </div>
  );
};
export default VideoCallPage;
