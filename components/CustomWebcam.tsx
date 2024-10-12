"use client"

import Webcam from "react-webcam";
import { useCallback, useRef } from "react";

const CustomWebcam = ({ imgSrc, setImgSrc }: {imgSrc: any, setImgSrc: any}) => {
    const webcamRef = useRef<Webcam>(null);

    const capture = useCallback(() => {
        if (webcamRef.current) { // Ensure webcamRef.current is not null
            const imageSrc = webcamRef.current.getScreenshot();
            setImgSrc(imageSrc);
        }
    }, [webcamRef]);

    const retake = () => {
        setImgSrc(null);
    };

    return (
        <div className="container">
            {imgSrc ? (
                <img src={imgSrc} alt="webcam" />
            ) : (
                <Webcam height={600} width={600} ref={webcamRef} />
            )}
            <div className="btn-container">
                {imgSrc ? (
                    <button className="text-black" onClick={retake}>Retake photo</button>
                ) : (
                    <button className="text-black" onClick={capture}>Capture photo</button>
                )}
            </div>
        </div>
    );
};

export default CustomWebcam;
