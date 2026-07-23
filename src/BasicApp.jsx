import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Bell,
  Building2,
  ChevronDown,
  DoorClosed,
  DoorOpen,
  HelpCircle,
  Map as MapIcon,
  MapPin,
  Maximize2,
  MessageCircle,
  Mic,
  MicOff,
  Minimize2,
  MonitorUp,
  Search,
  Smile,
  SlidersHorizontal,
  UserPlus,
  Users,
  Video,
  VideoOff
} from "lucide-react";
import { ChatPanel, InviteUsersModal, MapSurface, PEOPLE, ROOMS } from "./App.jsx";
import {
  ConversationBoundary,
  ConversationMapStatus,
  DestinationTransition,
} from "./BasicConversation.jsx";
import katmaiMenuIcon from "./assets/katmai-menu-icon.svg";
import videoMutePlaceholder from "./assets/video-mute-placeholder.png";

const VISIBLE_PEOPLE = PEOPLE.filter((person) => person.presenceGroup === "space");

const BASIC_VIEW = Object.freeze({
  MAP: "map",
  PERSON_REQUEST_PENDING: "person-request-pending",
  ROOM_INCOMING_REQUEST: "room-incoming-request",
  ROOM_VIDEO: "room-video",
  ROOM_AUDIO: "room-audio",
  ROOM_SOLO: "room-solo",
  MAP_WHILE_IN_CONVERSATION: "map-while-in-conversation",
  LEAVE_CONFIRMATION: "leave-confirmation",
  DESTINATION_TRANSITION: "destination-transition"
});

function BasicApp() {
  const [query, setQuery] = useState("");
  const [addedPeople, setAddedPeople] = useState([]);
  const [statusFilters, setStatusFilters] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [focusPersonId, setFocusPersonId] = useState(null);
  const [focusRoomId, setFocusRoomId] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [roomChatPersonId, setRoomChatPersonId] = useState(null);
  const [roomGroupChatOpen, setRoomGroupChatOpen] = useState(false);
  const [currentUserRoomId, setCurrentUserRoomId] = useState("south-pod");
  const [viewState, setViewState] = useState(BASIC_VIEW.MAP);
  const [conversation, setConversation] = useState(null);
  const [destination, setDestination] = useState(null);
  const [roomDoorOpen, setRoomDoorOpen] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [roomRefreshKey, setRoomRefreshKey] = useState(0);
  const transitionTimerRef = useRef(null);
  const confirmationReturnStateRef = useRef(BASIC_VIEW.MAP);
  const [collapsedSections, setCollapsedSections] = useState({
    rooms: false,
    people: false
  });

  useEffect(() => () => {
    if (transitionTimerRef.current) window.clearTimeout(transitionTimerRef.current);
  }, []);

  function toggleSection(section) {
    setCollapsedSections((current) => ({
      ...current,
      [section]: !current[section]
    }));
  }

  const people = useMemo(() => [...VISIBLE_PEOPLE, ...addedPeople], [addedPeople]);
  const allPeople = useMemo(() => [...PEOPLE, ...addedPeople], [addedPeople]);
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
        occupants: allPeople.filter(
          (person) => person.roomId === room.id && (person.presenceGroup === "space" || room.id === "river")
        )
      }))
        .filter((room) => room.occupants.length > 0)
        .sort((a, b) => b.occupants.length - a.occupants.length),
    [allPeople]
  );

  const currentRoom = ROOMS.find((room) => room.id === currentUserRoomId) || ROOMS[0];
  const currentConversationRoom = conversation
    ? ROOMS.find((room) => room.id === conversation.roomId)
    : currentRoom;
  const conversationParticipants = conversation
    ? [...PEOPLE, ...addedPeople].filter((person) => person.roomId === conversation.roomId)
    : [];
  const currentRoomParticipants = allPeople.filter((person) => person.roomId === currentUserRoomId);
  const isSoloRoom = currentRoomParticipants.length === 0;
  const roomChatPerson = people.find((person) => person.id === roomChatPersonId) || null;

  const conversationViews = new Set([
    BASIC_VIEW.ROOM_VIDEO,
    BASIC_VIEW.ROOM_AUDIO,
    BASIC_VIEW.ROOM_SOLO
  ]);
  const showConversation = conversationViews.has(viewState) || (
    viewState === BASIC_VIEW.LEAVE_CONFIRMATION &&
    confirmationReturnStateRef.current !== BASIC_VIEW.MAP_WHILE_IN_CONVERSATION
  );

  function roomOccupants(roomId) {
    return [...PEOPLE, ...addedPeople].filter((person) => person.roomId === roomId);
  }

  function resetMapSelection() {
    setDestination(null);
  }

  function selectPerson(person) {
    if (conversation) {
      confirmationReturnStateRef.current = viewState;
      setDestination({ type: "person", person });
      setViewState(BASIC_VIEW.LEAVE_CONFIRMATION);
    }
  }

  function selectRoom(room, focusOnMap = false) {
    if (room.id === currentUserRoomId) {
      openCurrentRoom();
      return;
    }
    if (showConversation) {
      setRoomChatPersonId(null);
      setRoomGroupChatOpen(false);
      setFocusRoomId(room.id);
      setViewState(conversation ? BASIC_VIEW.MAP_WHILE_IN_CONVERSATION : BASIC_VIEW.MAP);
      return;
    }
    if (focusOnMap) setFocusRoomId(room.id);
  }

  function enterConversation(room, preferredMode = "video") {
    const solo = roomOccupants(room.id).length === 0;
    setCurrentUserRoomId(room.id);
    setConversation({ roomId: room.id, mode: preferredMode });
    setRoomChatPersonId(null);
    setRoomGroupChatOpen(false);
    setDestination(null);
    setViewState(solo ? BASIC_VIEW.ROOM_SOLO : preferredMode === "audio" ? BASIC_VIEW.ROOM_AUDIO : BASIC_VIEW.ROOM_VIDEO);
  }

  function openCurrentRoom() {
    const preferredMode = conversation?.mode === "audio" ? "audio" : "video";
    const solo = currentRoomParticipants.length === 0;
    setConversation({ roomId: currentUserRoomId, mode: preferredMode });
    setDestination(null);
    setViewState(solo ? BASIC_VIEW.ROOM_SOLO : preferredMode === "audio" ? BASIC_VIEW.ROOM_AUDIO : BASIC_VIEW.ROOM_VIDEO);
  }

  function beginDestinationTransition(target) {
    setDestination(target);
    setViewState(BASIC_VIEW.DESTINATION_TRANSITION);
    if (transitionTimerRef.current) window.clearTimeout(transitionTimerRef.current);
    transitionTimerRef.current = window.setTimeout(() => {
      if (target.type === "person") {
        setConversation(null);
        setFocusPersonId(target.person.id);
        setDestination(null);
        setViewState(BASIC_VIEW.MAP);
        return;
      }
      const previousMode = conversation?.mode === "audio" ? "audio" : "video";
      enterConversation(target.room, previousMode);
    }, 650);
  }

  function openMapDuringConversation() {
    resetMapSelection();
    setViewState(BASIC_VIEW.MAP_WHILE_IN_CONVERSATION);
  }

  function returnToConversation() {
    if (!conversation) return;
    setViewState(conversationParticipants.length === 0 ? BASIC_VIEW.ROOM_SOLO : conversation.mode === "audio" ? BASIC_VIEW.ROOM_AUDIO : BASIC_VIEW.ROOM_VIDEO);
  }

  function changeConversationMode(mode) {
    setConversation((current) => current ? { ...current, mode } : current);
    setViewState(mode === "audio" ? BASIC_VIEW.ROOM_AUDIO : BASIC_VIEW.ROOM_VIDEO);
  }

  function leaveConversation() {
    openMapDuringConversation();
  }

  function handleMapRoomMove(room) {
    beginDestinationTransition({ type: "room", room });
  }

  function handleMapRoomAction(room, action) {
    if (action === "go" || action === "join") {
      beginDestinationTransition({ type: "room", room });
      return true;
    }
    return false;
  }

  function openRoomChat(person) {
    setRoomGroupChatOpen(false);
    setRoomChatPersonId(person.id);
  }

  function openRoomGroupChat() {
    setRoomChatPersonId(null);
    setRoomGroupChatOpen(true);
  }

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

  const destinationLabel = destination?.type === "person"
    ? destination.person.name
    : destination?.room.name;

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
          <section className="basic-directory-section basic-current-room-section" aria-labelledby="basic-current-room">
            <div className="basic-current-room-heading">
              <div className="basic-current-room-title">
                <MapPin size={15} aria-hidden="true" />
                <button type="button" onClick={openCurrentRoom} aria-label={`Open ${currentRoom.name}`}>{currentRoom.name}</button>
              </div>
              <div className="basic-current-room-actions" aria-label={`Actions for ${currentRoom.name}`}>
                <button className={screenSharing ? "active" : ""} type="button" aria-label={screenSharing ? "Stop sharing screen" : "Share screen"} title={screenSharing ? "Stop sharing screen" : "Share screen"} onClick={() => setScreenSharing((sharing) => !sharing)}><MonitorUp size={15} /></button>
                <button className={roomDoorOpen ? "" : "active"} type="button" aria-label={roomDoorOpen ? "Close room door" : "Open room door"} title={roomDoorOpen ? "Close room door" : "Open room door"} onClick={() => setRoomDoorOpen((open) => !open)}>{roomDoorOpen ? <DoorOpen size={15} /> : <DoorClosed size={15} />}</button>
                <button type="button" aria-label="Open meeting mode" title="Meeting mode" onClick={openCurrentRoom}><Video size={15} /></button>
                {!isSoloRoom && <button className="basic-current-room-chat" type="button" aria-label={`Open chat for ${currentRoom.name}`} title="Room chat" onClick={openRoomGroupChat}><MessageCircle size={15} /></button>}
              </div>
            </div>
            <div className="basic-current-room-summary">
              <span className={`basic-room-door ${roomDoorOpen ? "open" : "closed"}`}>{roomDoorOpen ? "Open" : "Closed"}</span>
              <small>{isSoloRoom ? "You're here by yourself" : `${currentRoomParticipants.length + 1} people in room`}</small>
            </div>
            {!isSoloRoom && (
              <div className="basic-person-list basic-current-room-list" aria-label={`People in ${currentRoom.name}`}>
                {currentRoomParticipants.map((person) => (
                  <button type="button" key={person.id} onClick={() => openRoomChat(person)}>
                    <span className="basic-person-avatar">{person.photo ? <img src={person.photo} alt="" referrerPolicy="no-referrer" /> : person.name[0]}</span>
                    <span className="basic-person-copy"><strong>{person.name}</strong></span>
                  </button>
                ))}
              </div>
            )}
          </section>

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
                  <button className="basic-room-row" type="button" key={room.id} onClick={() => selectRoom(room, true)}>
                    <span className="basic-room-icon"><Building2 size={15} aria-hidden="true" /></span>
                    <span>
                      <strong>{room.name}</strong>
                      <small>{room.occupants.map((person) => person.name.split(" ")[0]).join(", ")}</small>
                    </span>
                    <b>{room.occupants.length}</b>
                  </button>
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
                    className=""
                    key={person.id}
                    onClick={() => showConversation ? openRoomChat(person) : setFocusPersonId(person.id)}
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
        <div className="basic-workspace-stage">
          {showConversation && currentConversationRoom ? (
            <ConversationBoundary
              room={currentConversationRoom}
              participants={conversationParticipants}
              mode={conversation?.mode === "audio" ? "audio" : "video"}
              solo={conversationParticipants.length === 0}
              onModeChange={changeConversationMode}
              onOpenMap={openMapDuringConversation}
              onSummon={openMapDuringConversation}
              refreshKey={roomRefreshKey}
            />
          ) : (
            <MapSurface
              activeSurface="map"
              expanded
              embedded
              currentUserRoomId={currentUserRoomId}
              focusPersonId={focusPersonId}
              onFocusPersonHandled={() => setFocusPersonId(null)}
              focusRoomId={focusRoomId}
              onFocusRoomHandled={() => setFocusRoomId(null)}
              additionalPeople={addedPeople}
              onMoveToRoom={handleMapRoomMove}
              onRoomSelect={selectRoom}
              onRoomAction={handleMapRoomAction}
              onChatStateChange={setChatOpen}
              roomDetailsMode="panel"
              openChatOnPersonSelect
              hideMapAddUsers
              pushToast={() => {}}
              onJumpRequest={(_person, onResult) => {
                window.setTimeout(() => onResult({ status: "accepted", room: ROOMS.find((room) => room.id === currentUserRoomId) }), 650);
              }}
            />
          )}

          <PresenceSwitcher
            room={currentRoom}
            roomActive={showConversation}
            onOpenRoom={openCurrentRoom}
            onOpenMap={() => conversation ? openMapDuringConversation() : setViewState(BASIC_VIEW.MAP)}
          />

          {showConversation && roomGroupChatOpen && (
            <RoomGroupChatPanel
              room={currentRoom}
              participants={currentRoomParticipants}
              onClose={() => setRoomGroupChatOpen(false)}
            />
          )}

          {showConversation && !roomGroupChatOpen && roomChatPerson && (
            <RoomChatPanel
              person={roomChatPerson}
              onClose={() => setRoomChatPersonId(null)}
              onOpenMap={openMapDuringConversation}
            />
          )}

          {viewState === BASIC_VIEW.MAP_WHILE_IN_CONVERSATION && currentConversationRoom && conversationParticipants.length > 0 && (
            <ConversationMapStatus room={currentConversationRoom} mode={conversation.mode} onReturn={returnToConversation} />
          )}

          {viewState === BASIC_VIEW.DESTINATION_TRANSITION && destination && (
            <DestinationTransition destination={destinationLabel} />
          )}

          <ConfidenceMonitor chatOpen={chatOpen || (showConversation && (Boolean(roomChatPerson) || roomGroupChatOpen))} />
        </div>
      </section>
    </main>
  );
}

function PresenceSwitcher({ room, roomActive, onOpenRoom, onOpenMap }) {
  return (
    <section className="basic-presence-switcher" aria-label="Your room and workspace view">
      <button className="basic-presence-location" type="button" onClick={onOpenRoom}>
        <MapPin size={17} aria-hidden="true" />
        <span><small>You're in</small><strong>{room.name}</strong></span>
      </button>
      <div className="basic-presence-views" role="group" aria-label="Workspace view">
        <button className={roomActive ? "active" : ""} type="button" aria-pressed={roomActive} onClick={onOpenRoom}><DoorOpen size={14} aria-hidden="true" />Room</button>
        <button className={!roomActive ? "active" : ""} type="button" aria-pressed={!roomActive} onClick={onOpenMap}><MapIcon size={14} aria-hidden="true" />Map</button>
      </div>
    </section>
  );
}

function RoomChatPanel({ person, onClose, onOpenMap }) {
  return (
    <div className="basic-room-chat-panel">
      <ChatPanel
        person={person}
        requestMessages={[]}
        closing={false}
        onClose={onClose}
        onJump={onOpenMap}
        onSummon={onOpenMap}
        onMap={onOpenMap}
      />
    </div>
  );
}

function RoomGroupChatPanel({ room, participants, onClose }) {
  const speaker = participants[0];
  const responder = participants[1];

  return (
    <aside className="basic-room-chat-panel basic-room-group-chat" aria-label={`Chat with ${room.name}`}>
      <header className="basic-room-group-chat-heading">
        <div>
          <span className="basic-room-group-chat-icon"><MessageCircle size={17} /></span>
          <div><small>Room chat</small><strong>{room.name}</strong></div>
        </div>
        <button type="button" aria-label="Close room chat" title="Close room chat" onClick={onClose}>×</button>
      </header>
      <div className="basic-room-group-members" aria-label="People in this room">
        {participants.map((person) => <span key={person.id} title={person.name}>{person.photo ? <img src={person.photo} alt="" referrerPolicy="no-referrer" /> : person.name[0]}</span>)}
        <small>{participants.length + 1} in this room</small>
      </div>
      <div className="basic-room-group-thread">
        {speaker && <div className="basic-room-group-message incoming"><small>{speaker.name} · 10:38 AM</small><p>Glad we’re all here. Let’s align on the next step.</p></div>}
        {responder && <div className="basic-room-group-message incoming"><small>{responder.name} · 10:40 AM</small><p>I’ve added the latest notes to the shared board.</p></div>}
        <div className="basic-room-group-message outgoing"><small>You · 10:41 AM</small><p>Perfect — I’m reviewing them now.</p></div>
      </div>
      <label className="basic-room-group-composer">
        <input placeholder={`Message everyone in ${room.name}`} />
        <button type="button" aria-label="Send room message">↗</button>
      </label>
    </aside>
  );
}

const REACTIONS = ["🙂", "👋", "🎉", "❤️"];

function ConfidenceMonitor({ chatOpen = false }) {
  const monitorRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const dragRef = useRef(null);
  const reactionTimerRef = useRef(null);
  const [position, setPosition] = useState(null);
  const [chatDockRight, setChatDockRight] = useState(null);
  const [minimized, setMinimized] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(false);
  const [micEnabled, setMicEnabled] = useState(false);
  const [streamVersion, setStreamVersion] = useState(0);
  const [mediaError, setMediaError] = useState("");
  const [reactionOpen, setReactionOpen] = useState(false);
  const [reaction, setReaction] = useState("");
  const [dragging, setDragging] = useState(false);
  const [hasCollapsed, setHasCollapsed] = useState(false);

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
      const boundary = monitor?.closest(".basic-workspace-stage, .map-stage");
      if (!monitor || !boundary) return;
      setPosition((current) => current ? {
        x: Math.min(current.x, Math.max(8, boundary.clientWidth - monitor.offsetWidth - 8)),
        y: Math.min(current.y, Math.max(8, boundary.clientHeight - monitor.offsetHeight - 8))
      } : current);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [minimized]);

  useEffect(() => {
    if (position || !chatOpen) {
      setChatDockRight(null);
      return;
    }

    const monitor = monitorRef.current;
    const boundary = monitor?.closest(".basic-workspace-stage");
    const protectedPanel = boundary?.querySelector(".basic-map-boundary .map-stage, .basic-room-chat-panel");
    if (!boundary || !protectedPanel) return;

    const updateDock = () => {
      const boundaryRect = boundary.getBoundingClientRect();
      const panelRect = protectedPanel.getBoundingClientRect();
      setChatDockRight(Math.max(8, boundaryRect.right - panelRect.left + 18));
    };

    updateDock();
    window.addEventListener("resize", updateDock);
    return () => window.removeEventListener("resize", updateDock);
  }, [chatOpen, position]);

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

  function minimizeMonitor() {
    if (!hasCollapsed) {
      setPosition(null);
      setHasCollapsed(true);
    }
    setMinimized(true);
  }

  function handlePointerDown(event) {
    event.stopPropagation();
    if (event.button !== 0 || event.target.closest("button")) return;
    const monitor = monitorRef.current;
    const boundary = monitor?.closest(".basic-workspace-stage, .map-stage");
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
    const boundary = monitor?.closest(".basic-workspace-stage, .map-stage");
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
    const boundary = monitor?.closest(".basic-workspace-stage, .map-stage");
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

  const monitorStyle = position
    ? { left: position.x, top: position.y, right: "auto" }
    : chatDockRight === null
      ? undefined
      : { right: chatDockRight };

  return (
    <section
      ref={monitorRef}
      className={`confidence-monitor ${minimized ? "minimized" : "expanded"} ${dragging ? "dragging" : ""} ${micEnabled ? "" : "mic-off"}`}
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
            {!videoEnabled && <img src={videoMutePlaceholder} alt="Your camera is off" />}
          </div>
          <button className="confidence-minimize" type="button" aria-label="Minimize confidence monitor" title="Minimize" onClick={minimizeMonitor}><Minimize2 size={18} /></button>
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
