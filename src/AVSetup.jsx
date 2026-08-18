import React, { useEffect, useRef, useState } from "react";
import {
  ArrowLeftCircle,
  Camera,
  Check,
  Image as ImageIcon,
  Mic,
  MicOff,
  Settings,
  UserRound,
  Video,
  VideoOff,
  X,
} from "lucide-react";
import katmaiHorizontalLogo from "./assets/katmai-logo-horizontal.png";
import avSetupBackground from "./assets/av-setup-background.png";
import emptyProfilePicture from "./assets/empty-profile-picture.png";
import zoeProfile from "./assets/zoe-profile.png";
import videoMutePlaceholder from "./assets/video-mute-placeholder.png";

export default function AVSetup() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const captureTimerRef = useRef(null);
  const countdownTimerRef = useRef(null);
  const [name, setName] = useState("");
  const [savedImage, setSavedImage] = useState("");
  const [displayMode, setDisplayMode] = useState("live");
  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [showReplacePrompt, setShowReplacePrompt] = useState(false);
  const [captureConfirmed, setCaptureConfirmed] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [entering, setEntering] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function startCamera() {
      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraError("Camera preview is unavailable in this browser.");
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
        setCameraReady(true);
      } catch {
        if (!cancelled) setCameraError("Allow camera access to capture your profile image.");
      }
    }

    startCamera();
    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((track) => track.stop());
      if (captureTimerRef.current) window.clearTimeout(captureTimerRef.current);
      if (countdownTimerRef.current) window.clearTimeout(countdownTimerRef.current);
    };
  }, []);

  function toggleCamera() {
    const next = !cameraOn;
    streamRef.current?.getVideoTracks().forEach((track) => { track.enabled = next; });
    setCameraOn(next);
    if (!next) setDisplayMode("live");
  }

  function requestCapture() {
    if (countdown !== null) return;
    if (savedImage) {
      setShowReplacePrompt(true);
      return;
    }
    startCaptureCountdown();
  }

  function startCaptureCountdown() {
    setShowReplacePrompt(false);
    setCaptureConfirmed(false);
    setDisplayMode("live");
    if (!cameraOn) toggleCamera();

    let nextCount = 3;
    setCountdown(nextCount);
    if (countdownTimerRef.current) window.clearTimeout(countdownTimerRef.current);

    const advanceCountdown = () => {
      nextCount -= 1;
      if (nextCount > 0) {
        setCountdown(nextCount);
        countdownTimerRef.current = window.setTimeout(advanceCountdown, 1000);
        return;
      }
      setCountdown(null);
      countdownTimerRef.current = null;
      captureImage();
    };

    countdownTimerRef.current = window.setTimeout(advanceCountdown, 1000);
  }

  function captureImage() {
    setShowReplacePrompt(false);
    const canvas = document.createElement("canvas");
    const video = videoRef.current;
    const size = 480;
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext("2d");

    if (video?.videoWidth && cameraOn) {
      const sourceSize = Math.min(video.videoWidth, video.videoHeight);
      const sourceX = (video.videoWidth - sourceSize) / 2;
      const sourceY = (video.videoHeight - sourceSize) / 2;
      context.translate(size, 0);
      context.scale(-1, 1);
      context.drawImage(video, sourceX, sourceY, sourceSize, sourceSize, 0, 0, size, size);
    } else {
      const fallback = new Image();
      fallback.onload = () => finishCapture(drawFallback(context, fallback, size));
      fallback.src = zoeProfile;
      return;
    }

    finishCapture(canvas.toDataURL("image/jpeg", 0.9));
  }

  function drawFallback(context, image, size) {
    const sourceSize = Math.min(image.naturalWidth, image.naturalHeight);
    context.drawImage(
      image,
      (image.naturalWidth - sourceSize) / 2,
      (image.naturalHeight - sourceSize) / 2,
      sourceSize,
      sourceSize,
      0,
      0,
      size,
      size,
    );
    return context.canvas.toDataURL("image/jpeg", 0.9);
  }

  function finishCapture(image) {
    setSavedImage(image);
    setDisplayMode("saved");
    setCaptureConfirmed(true);
    if (captureTimerRef.current) window.clearTimeout(captureTimerRef.current);
    captureTimerRef.current = window.setTimeout(() => {
      setDisplayMode("live");
      setCaptureConfirmed(false);
    }, 1000);
  }

  function selectDisplayMode(mode) {
    if (mode === "live" && !cameraOn) toggleCamera();
    setDisplayMode(mode);
    setCaptureConfirmed(false);
  }

  function submit(event) {
    event.preventDefault();
    if (!name.trim()) return;
    setEntering(true);
    window.setTimeout(() => {
      window.location.assign(`${import.meta.env.BASE_URL}basic`);
    }, 650);
  }

  const photoModeSelected = displayMode === "saved";
  const showingEmptyPhoto = photoModeSelected && !savedImage;
  const showingSaved = Boolean(savedImage && (photoModeSelected || !cameraOn));
  const showingCameraOffPlaceholder = !cameraOn && !savedImage;
  const showingCameraUnavailableFallback = cameraOn && !cameraReady && !showingEmptyPhoto;

  return (
    <main className="av-setup" style={{ "--av-background": `url(${avSetupBackground})` }}>
      <header className="av-setup-header">
        <a className="av-logo" href={import.meta.env.BASE_URL} aria-label="Katmai home">
          <img src={katmaiHorizontalLogo} alt="Katmai" />
        </a>
        <a className="av-back" href={import.meta.env.BASE_URL}>
          <ArrowLeftCircle size={21} />
          Back to dashboard
        </a>
      </header>

      <section className="av-entry" aria-labelledby="av-entry-title">
        <h1 id="av-entry-title">Entering <strong>Corporate HQ</strong></h1>
        <form className="av-card" onSubmit={submit}>
          <div className={`av-self-monitor ${micOn ? "" : "mic-off"} ${cameraOn ? "" : "camera-off"}`}>
            <div className="av-avatar-ring" aria-live="polite">
              <video
                ref={videoRef}
                className={showingSaved || showingEmptyPhoto || showingCameraOffPlaceholder || showingCameraUnavailableFallback ? "is-hidden" : ""}
                autoPlay
                muted
                playsInline
                aria-label="Live camera preview"
              />
              {showingCameraUnavailableFallback && <img src={zoeProfile} alt="Camera preview placeholder" />}
              {showingCameraOffPlaceholder && <img src={videoMutePlaceholder} alt="Your camera is off" />}
              {showingEmptyPhoto && <img className="av-empty-photo" src={emptyProfilePicture} alt="No saved profile photo" />}
              {showingSaved && <img src={savedImage} alt="Your saved profile" />}
              {!micOn && <span className="av-muted-pill" role="status">Muted</span>}
              {countdown === null && !captureConfirmed && (savedImage || showingEmptyPhoto) && (
                <button
                  className={`av-photo-action ${savedImage ? "is-replace" : "is-first"}`}
                  type="button"
                  onClick={requestCapture}
                  aria-label={savedImage ? "Replace profile photo" : "Take profile photo"}
                >
                  <Camera size={18} aria-hidden="true" />
                  <span>{savedImage ? "Replace photo" : "Take photo"}</span>
                </button>
              )}
              {countdown !== null && (
                <span className="av-countdown" key={countdown} role="status" aria-live="assertive" aria-label={`${countdown}`}>
                  <svg viewBox="0 0 104 104" aria-hidden="true">
                    <circle cx="52" cy="52" r="46" />
                  </svg>
                  <strong>{countdown}</strong>
                </span>
              )}
              {captureConfirmed && <span className="av-capture-confirmed"><span className="av-capture-check"><Check size={24} /></span>Saved</span>}
            </div>

            <button className="av-rim-control av-settings" type="button" aria-label="Open settings">
              <Settings size={18} />
              <span>Settings</span>
            </button>
            <button className={`av-rim-control av-audio ${micOn ? "" : "off"}`} type="button" onClick={() => setMicOn((on) => !on)} aria-label={micOn ? "Mute microphone" : "Unmute microphone"}>
              {micOn ? <Mic size={19} /> : <MicOff size={19} />}
              <span>Audio</span>
            </button>
            <button className={`av-rim-control av-video ${cameraOn ? "" : "off"}`} type="button" onClick={toggleCamera} aria-label={cameraOn ? "Turn camera off" : "Turn camera on"}>
              {cameraOn ? <Video size={19} /> : <VideoOff size={19} />}
              <span>Video</span>
            </button>
          </div>

          <div className="av-view-options">
            <div className="av-view-toggle" role="group" aria-label="Choose avatar preview">
              <button className={photoModeSelected ? "" : "active"} type="button" aria-pressed={!photoModeSelected} onClick={() => selectDisplayMode("live")}><Video size={13} aria-hidden="true" />Live</button>
              <button className={photoModeSelected ? "active" : ""} type="button" aria-pressed={photoModeSelected} onClick={() => selectDisplayMode("saved")}><ImageIcon size={13} aria-hidden="true" />Photo</button>
            </div>
            <p className="av-view-description" aria-live="polite">
              {showingEmptyPhoto ? "You haven’t taken a profile photo yet." : photoModeSelected ? "This is your saved profile photo." : "This is your live preview."}
            </p>
          </div>

          <label className="av-name-field">
            <UserRound size={20} aria-hidden="true" />
            <span className="sr-only">Your name</span>
            <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Enter your name" autoComplete="name" />
          </label>
          <button className="av-enter" type="submit" disabled={!name.trim() || entering}>
            {entering ? "Entering…" : "Enter space"}
          </button>
          {cameraError && <p className="av-helper" role="status">{cameraError}</p>}
        </form>
      </section>

      {showReplacePrompt && (
        <div className="av-dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowReplacePrompt(false); }}>
          <section className="av-dialog" role="alertdialog" aria-modal="true" aria-labelledby="replace-image-title" aria-describedby="replace-image-copy">
            <header className="av-dialog-header">
              <Camera size={20} aria-hidden="true" />
              <h2 id="replace-image-title">Replace your image?</h2>
              <button className="av-dialog-close" type="button" onClick={() => setShowReplacePrompt(false)} aria-label="Close"><X size={20} /></button>
            </header>
            <div className="av-dialog-body">
              <p id="replace-image-copy">This will delete your current image. Do you wish to proceed?</p>
              <div className="av-dialog-actions">
                <button className="primary" type="button" onClick={startCaptureCountdown}>Replace image</button>
                <button type="button" onClick={() => setShowReplacePrompt(false)}>Cancel</button>
              </div>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
