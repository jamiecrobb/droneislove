import AudioRecorder from "../components/AudioRecorder";
import { Navbar } from "../components/Navbar";

function mic() {
    return (
        <div>
            <Navbar />
            <AudioRecorder />
        </div>
    )
}

export default mic;