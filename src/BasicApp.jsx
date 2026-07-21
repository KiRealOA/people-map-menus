import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Bell,
  Building2,
  ChevronDown,
  HelpCircle,
  Map as MapIcon,
  Maximize2,
  MessageCircle,
  Mic,
  MicOff,
  Minimize2,
  Search,
  Smile,
  SlidersHorizontal,
  UserPlus,
  Users,
  Video,
  VideoOff
} from "lucide-react";
import { CURRENT_USER, InviteUsersModal, MapSurface, PEOPLE, ROOMS } from "./App.jsx";
import katmaiMenuIcon from "./assets/katmai-menu-icon.svg";

const VISIBLE_PEOPLE = PEOPLE.filter((person) => person.presenceGroup === "space");

function BasicApp() {
  const [query, setQuery] = useState("");
  const [addedPeople, setAddedPeople] = useState([]);
  const [statusFilters, setStatusFilters] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [focusPersonId, setFocusPersonId] = useState(null);
  const [currentUserRoomId, setCurrentUserRoomId] = useState("south-pod");
  const [collapsedSections, setCollapsedSections] = useState({
    rooms: false,
    people: false
  });

  function toggleSection(section) {
    setCollapsedSections((current) => ({
      ...current,
      [section]: !current[section]
    }));
  }

  const people = useMemo(() => [...VISIBLE_PEOPLE, ...addedPeople], [addedPeople]);
  const statusOptions = useMemo(
    () => [...new Set(people.map((person) => person.status).filter(Boolean))],
    [people]
  );

  const filteredPeople = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return people.filter((person) => {
      const matchesQuery = !normalized || `${person.name} ${person.role} ${person.status || ""}`.toLowerCase().includes(normalized);
      return matchesQuery && (statusFilters.length === 0 || (person.status && statusFilters.includes(person.status)));
    });
  }, [people, query, statusFilters]);

  const activeRooms = useMemo(
    () =>
      ROOMS.map((room) => ({
        ...room,
        occupants: people.filter(
          (person) => person.presenceGroup === "space" && person.roomId === room.id
        )
      }))
        .filter((room) => room.occupants.length > 0)
        .sort((a, b) => b.occupants.length - a.occupants.length),
    [people]
  );

  function addUsers(invitations) {
    setAddedPeople((current) => [
      ...current,
      ...invitations.map(({ email, role }) => ({
        id: `basic-${crypto.randomUUID()}`,
        name: email.split("@")[0].replace(/[._-]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase()),
        role,
        roomId: "south-pod",
        presenceGroup: "space",
        palette: ["#eef1ff", "#8c9ee8", "#3f5fc4"]
      }))
    ]);
    setAddUserOpen(false);
  }

  return (
    <main className="basic-shell">
      <nav className="basic-rail" aria-label="Katmai Basic navigation">
        <a className="basic-mark" href="/" aria-label="Open Users Map">
          <img src={katmaiMenuIcon} alt="" />
        </a>
        <div className="basic-rail-group">
          <button className="active" type="button" aria-label="People and rooms">
            <Users size={20} aria-hidden="true" />
          </button>
          <button type="button" aria-label="Map">
            <MapIcon size={20} aria-hidden="true" />
          </button>
          <button type="button" aria-label="Messages">
            <MessageCircle size={20} aria-hidden="true" />
          </button>
          <button type="button" aria-label="Notifications">
            <Bell size={20} aria-hidden="true" />
          </button>
        </div>
        <div className="basic-rail-group basic-rail-bottom">
          <button type="button" aria-label="Help">
            <HelpCircle size={20} aria-hidden="true" />
          </button>
        </div>
      </nav>

      <aside className="basic-directory" aria-label="People and active rooms">
        <header className="basic-directory-heading">
          <div>
            <span>Katmai Basic</span>
            <h1>People</h1>
          </div>
          <span className="basic-online-count">{people.length} online</span>
        </header>

        <div className="basic-search-toolbar">
          <label className="basic-search">
            <Search size={17} aria-hidden="true" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search people"
              aria-label="Search people"
            />
          </label>
          <button className="basic-directory-action" type="button" aria-label="Add user" title="Add user" onClick={() => setAddUserOpen(true)}>
            <UserPlus size={18} aria-hidden="true" />
          </button>
          <div className="basic-filter">
            <button className={`basic-directory-action ${filterOpen || statusFilters.length ? "active" : ""}`} type="button" aria-label="Filter people by status" title="Filter people by status" aria-expanded={filterOpen} onClick={() => setFilterOpen((open) => !open)}>
              <SlidersHorizontal size={18} aria-hidden="true" />
              {statusFilters.length > 0 && <span>{statusFilters.length}</span>}
            </button>
            {filterOpen && (
              <div className="basic-filter-menu" role="menu" aria-label="Filter people by status">
                <strong>Status</strong>
                {statusOptions.map((status) => {
                  const selected = statusFilters.includes(status);
                  return (
                    <button key={status} type="button" role="menuitemcheckbox" aria-checked={selected} onClick={() => setStatusFilters((current) => selected ? current.filter((value) => value !== status) : [...current, status])}>
                      <span className={`basic-status ${status.toLowerCase().replaceAll(" ", "-")}`}>{status}</span>
                      {selected && <b>✓</b>}
                    </button>
                  );
                })}
                {statusFilters.length > 0 && <button className="basic-filter-clear" type="button" onClick={() => setStatusFilters([])}>Clear filters</button>}
              </div>
            )}
          </div>
        </div>

        <div className="basic-directory-scroll">
          <section className="basic-directory-section" aria-labelledby="basic-active-rooms">
            <button
              className="basic-section-heading"
              type="button"
              aria-expanded={!collapsedSections.rooms}
              aria-controls="basic-active-room-list"
              onClick={() => toggleSection("rooms")}
            >
              <h2 id="basic-active-rooms">Active rooms</h2>
              <span>{activeRooms.length}</span>
              <ChevronDown className={collapsedSections.rooms ? "collapsed" : ""} size={15} aria-hidden="true" />
            </button>
            {!collapsedSections.rooms && (
              <div className="basic-room-list" id="basic-active-room-list">
                {activeRooms.map((room) => (
                  <div className="basic-room-row" key={room.id}>
                    <span className="basic-room-icon"><Building2 size={15} aria-hidden="true" /></span>
                    <span>
                      <strong>{room.name}</strong>
                      <small>{room.occupants.map((person) => person.name.split(" ")[0]).join(", ")}</small>
                    </span>
                    <b>{room.occupants.length}</b>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="basic-directory-section" aria-labelledby="basic-everyone">
            <button
              className="basic-section-heading"
              type="button"
              aria-expanded={!collapsedSections.people}
              aria-controls="basic-person-list"
              onClick={() => toggleSection("people")}
            >
              <h2 id="basic-everyone">Everyone in this space</h2>
              <span>{filteredPeople.length}</span>
              <ChevronDown className={collapsedSections.people ? "collapsed" : ""} size={15} aria-hidden="true" />
            </button>
            {!collapsedSections.people && (
              <div className="basic-person-list" id="basic-person-list">
                {filteredPeople.map((person) => (
                  <button
                    type="button"
                    className={focusPersonId === person.id ? "selected" : ""}
                    key={person.id}
                    onClick={() => setFocusPersonId(person.id)}
                  >
                    <span className="basic-person-avatar">
                      {person.photo ? <img src={person.photo} alt="" referrerPolicy="no-referrer" /> : person.name[0]}
                    </span>
                    <span className="basic-person-copy">
                      <strong>{person.name}</strong>
                      {person.status && <span className={`basic-status ${person.status.toLowerCase().replaceAll(" ", "-")}`}>{person.status}</span>}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </section>
        </div>
      </aside>

      <InviteUsersModal open={addUserOpen} onClose={() => setAddUserOpen(false)} onInvite={addUsers} />

      <section className="basic-workspace" aria-label="Katmai Basic workspace">
        <MapSurface
          activeSurface="map"
          expanded
          embedded
          currentUserRoomId={currentUserRoomId}
          focusPersonId={focusPersonId}
          onFocusPersonHandled={() => {}}
          additionalPeople={addedPeople}
          overlay={<ConfidenceMonitor />}
          onMoveToRoom={(room) => setCurrentUserRoomId(room.id)}
          pushToast={() => {}}
          onJumpRequest={(_person, onResult) =>
            onResult({ status: "accepted", room: ROOMS.find((room) => room.id === currentUserRoomId) })
          }
        />
      </section>
    </main>
  );
}

const REACTIONS = ["🙂", "👋", "🎉", "❤️"];

function ConfidenceMonitor() {
  const monitorRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const dragRef = useRef(null);
  const reactionTimerRef = useRef(null);
  const [position, setPosition] = useState(null);
  const [minimized, setMinimized] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(false);
  const [micEnabled, setMicEnabled] = useState(false);
  const [streamVersion, setStreamVersion] = useState(0);
  const [mediaError, setMediaError] = useState("");
  const [reactionOpen, setReactionOpen] = useState(false);
  const [reaction, setReaction] = useState("");
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.srcObject = streamRef.current;
    if (videoEnabled) video.play().catch(() => {});
  }, [streamVersion, videoEnabled, minimized]);

  useEffect(() => () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    if (reactionTimerRef.current) window.clearTimeout(reactionTimerRef.current);
  }, []);

  useEffect(() => {
    if (!position) return;
    const frame = window.requestAnimationFrame(() => {
      const monitor = monitorRef.current;
      const boundary = monitor?.closest(".map-stage");
      if (!monitor || !boundary) return;
      setPosition((current) => current ? {
        x: Math.min(current.x, Math.max(8, boundary.clientWidth - monitor.offsetWidth - 8)),
        y: Math.min(current.y, Math.max(8, boundary.clientHeight - monitor.offsetHeight - 8))
      } : current);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [minimized]);

  async function enableMedia(kind) {
    setMediaError("");
    const existingTrack = streamRef.current?.getTracks().find((track) => track.kind === kind);
    if (existingTrack) {
      existingTrack.enabled = true;
      return true;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setMediaError("Camera and microphone access are unavailable in this browser.");
      return false;
    }

    try {
      const requestedStream = await navigator.mediaDevices.getUserMedia({
        video: kind === "video",
        audio: kind === "audio"
      });
      if (!streamRef.current) streamRef.current = new MediaStream();
      requestedStream.getTracks().forEach((track) => streamRef.current.addTrack(track));
      setStreamVersion((version) => version + 1);
      return true;
    } catch {
      setMediaError(`${kind === "video" ? "Camera" : "Microphone"} access was not granted.`);
      return false;
    }
  }

  async function toggleVideo() {
    if (videoEnabled) {
      streamRef.current?.getVideoTracks().forEach((track) => { track.enabled = false; });
      setVideoEnabled(false);
      return;
    }
    if (await enableMedia("video")) setVideoEnabled(true);
  }

  async function toggleMic() {
    if (micEnabled) {
      streamRef.current?.getAudioTracks().forEach((track) => { track.enabled = false; });
      setMicEnabled(false);
      return;
    }
    if (await enableMedia("audio")) setMicEnabled(true);
  }

  function sendReaction(nextReaction) {
    setReaction(nextReaction);
    setReactionOpen(false);
    if (reactionTimerRef.current) window.clearTimeout(reactionTimerRef.current);
    reactionTimerRef.current = window.setTimeout(() => setReaction(""), 1800);
  }

  function handlePointerDown(event) {
    event.stopPropagation();
    if (event.button !== 0 || event.target.closest("button")) return;
    const monitor = monitorRef.current;
    const boundary = monitor?.closest(".map-stage");
    if (!monitor || !boundary) return;
    const monitorRect = monitor.getBoundingClientRect();
    dragRef.current = {
      pointerId: event.pointerId,
      offsetX: event.clientX - monitorRect.left,
      offsetY: event.clientY - monitorRect.top
    };
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    updateDragPosition(event.clientX, event.clientY, drag);
  }

  function updateDragPosition(clientX, clientY, drag = dragRef.current) {
    if (!drag) return;
    const monitor = monitorRef.current;
    const boundary = monitor?.closest(".map-stage");
    if (!monitor || !boundary) return;
    const boundaryRect = boundary.getBoundingClientRect();
    setPosition({
      x: Math.min(Math.max(8, clientX - boundaryRect.left - drag.offsetX), Math.max(8, boundary.clientWidth - monitor.offsetWidth - 8)),
      y: Math.min(Math.max(8, clientY - boundaryRect.top - drag.offsetY), Math.max(8, boundary.clientHeight - monitor.offsetHeight - 8))
    });
  }

  function handleMouseDown(event) {
    event.stopPropagation();
    if (event.button !== 0 || event.target.closest("button")) return;
    const monitor = monitorRef.current;
    const boundary = monitor?.closest(".map-stage");
    if (!monitor || !boundary) return;
    const monitorRect = monitor.getBoundingClientRect();
    const drag = {
      pointerId: null,
      offsetX: event.clientX - monitorRect.left,
      offsetY: event.clientY - monitorRect.top
    };
    dragRef.current = drag;
    setDragging(true);
    event.preventDefault();

    function handleMouseMove(moveEvent) {
      updateDragPosition(moveEvent.clientX, moveEvent.clientY, drag);
    }

    function handleMouseUp() {
      dragRef.current = null;
      setDragging(false);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  }

  function handlePointerEnd(event) {
    if (dragRef.current?.pointerId !== event.pointerId) return;
    dragRef.current = null;
    setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  }

  const monitorStyle = position ? { left: position.x, top: position.y, right: "auto" } : undefined;

  return (
    <section
      ref={monitorRef}
      className={`confidence-monitor ${minimized ? "minimized" : "expanded"} ${dragging ? "dragging" : ""}`}
      style={monitorStyle}
      aria-label="Your camera and microphone"
      onClick={(event) => event.stopPropagation()}
      onMouseDown={handleMouseDown}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
    >
      {reaction && <div className="confidence-reaction-burst" role="status">{reaction}</div>}

      {minimized ? (
        <>
          <span className="confidence-compact-handle" aria-hidden="true" />
          <div className="confidence-compact-controls">
            <button className="confidence-expand" type="button" aria-label="Expand confidence monitor" title="Expand" onClick={() => setMinimized(false)}><Maximize2 size={19} /></button>
            <ConfidenceReactionButton open={reactionOpen} onToggle={() => setReactionOpen((open) => !open)} onReact={sendReaction} />
            <button className={`confidence-control ${micEnabled ? "" : "off"}`} type="button" aria-label={micEnabled ? "Mute microphone" : "Unmute microphone"} title={micEnabled ? "Mute" : "Unmute"} onClick={toggleMic}>{micEnabled ? <Mic size={19} /> : <MicOff size={19} />}</button>
            <button className={`confidence-control ${videoEnabled ? "" : "off"}`} type="button" aria-label={videoEnabled ? "Turn camera off" : "Turn camera on"} title={videoEnabled ? "Camera off" : "Camera on"} onClick={toggleVideo}>{videoEnabled ? <Video size={19} /> : <VideoOff size={19} />}</button>
          </div>
        </>
      ) : (
        <>
          <div className="confidence-video-ring">
            <video ref={videoRef} className={videoEnabled ? "" : "hidden"} autoPlay muted playsInline />
            {!videoEnabled && <img src={CURRENT_USER.photo} alt="Your camera is off" referrerPolicy="no-referrer" />}
          </div>
          <button className="confidence-minimize" type="button" aria-label="Minimize confidence monitor" title="Minimize" onClick={() => setMinimized(true)}><Minimize2 size={18} /></button>
          <div className="confidence-controls">
            <ConfidenceReactionButton open={reactionOpen} onToggle={() => setReactionOpen((open) => !open)} onReact={sendReaction} />
            <button className={`confidence-control ${micEnabled ? "" : "off"}`} type="button" aria-label={micEnabled ? "Mute microphone" : "Unmute microphone"} title={micEnabled ? "Mute" : "Unmute"} onClick={toggleMic}>{micEnabled ? <Mic size={19} /> : <MicOff size={19} />}</button>
            <button className={`confidence-control ${videoEnabled ? "" : "off"}`} type="button" aria-label={videoEnabled ? "Turn camera off" : "Turn camera on"} title={videoEnabled ? "Camera off" : "Camera on"} onClick={toggleVideo}>{videoEnabled ? <Video size={19} /> : <VideoOff size={19} />}</button>
          </div>
        </>
      )}
      {mediaError && <p className="confidence-media-error" role="alert">{mediaError}</p>}
    </section>
  );
}

function ConfidenceReactionButton({ open, onToggle, onReact }) {
  return (
    <div className="confidence-reactions">
      <button className="confidence-control" type="button" aria-label="Send a reaction" title="React" aria-expanded={open} onClick={onToggle}><Smile size={19} /></button>
      {open && <div className="confidence-reaction-menu" aria-label="Choose a reaction">{REACTIONS.map((reaction) => <button key={reaction} type="button" aria-label={`Send ${reaction}`} onClick={() => onReact(reaction)}>{reaction}</button>)}</div>}
    </div>
  );
}

export default BasicApp;
