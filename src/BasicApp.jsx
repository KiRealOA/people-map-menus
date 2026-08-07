import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Boxes,
  Cast,
  ChevronDown,
  CircleHelp,
  Clock,
  DoorOpen,
  HelpCircle,
  Headphones,
  GraduationCap,
  Grid2X2Plus,
  Map as MapIcon,
  MapPin,
  Maximize2,
  MessageCircle,
  Mic,
  MicOff,
  Minimize2,
  MoreHorizontal,
  Lock,
  LockOpen,
  PanelLeftClose,
  PanelLeftOpen,
  Palette,
  RefreshCw,
  Search,
  Settings,
  MapPinned,
  Smile,
  SlidersHorizontal,
  UserPlus,
  Users,
  Video,
  VideoOff,
  X
} from "lucide-react";
import { ChatPanel, InviteUsersModal, MapSurface, PEOPLE, ROOMS, getEffectivePeople, getPersonStatuses } from "./App.jsx";
import {
  ConversationBoundary,
  ConversationMapPreview,
  DestinationTransition,
} from "./BasicConversation.jsx";
import katmaiMenuIcon from "./assets/katmai-menu-icon.svg";
import roomIcon from "./assets/room-icon.svg";
import exitMeetingIcon from "./assets/exit-meeting.svg";
import logOutCircleIcon from "./assets/log-out-circle.svg";
import videoMutePlaceholder from "./assets/video-mute-placeholder.png";
import {
  CUSTOM_STATUS_PRESETS,
  STATUS_ICON_OPTIONS,
  StatusIcon,
  getStatusIconOption,
  getStatusMeta,
} from "./statusIcons.jsx";
import { ModeIcon, ModeIndicator, getModeMeta } from "./presenceMeta.jsx";

const VISIBLE_PEOPLE = PEOPLE;

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

function BasicStatusEmoji({ status, customStatus, className = "" }) {
  const systemMeta = status ? getStatusMeta(status) : null;
  const meta = customStatus || systemMeta;
  if (!meta) return null;
  const tone = getStatusIconOption(meta.iconId)?.tone || "navy";
  const label = customStatus
    ? `${customStatus.text}${systemMeta ? ` · ${systemMeta.description}` : ""}`
    : meta.description;
  return (
    <span
      className={`basic-status-emoji status-tone-${tone} ${customStatus ? "custom" : "automatic"} ${className}`.trim()}
      role="img"
      tabIndex="0"
      aria-label={label}
      data-status-tooltip={label}
    >
      <StatusIcon iconId={meta.iconId} emoji={meta.emoji} size={16} />
    </span>
  );
}

function BasicAvatarModeBadge({ mode }) {
  const meta = getModeMeta(mode);
  if (meta.id === "3d") return null;
  return (
    <span className={`avatar-mode-indicator basic-avatar-mode-indicator mode-${meta.id}`} aria-label={`${meta.label} mode`}>
      <ModeIcon mode={mode} size={10} />
    </span>
  );
}

function BasicRailSelfMonitor({ minimized, videoEnabled, micEnabled, stream, customStatus, onExpand, onSetStatus, onShowGrid }) {
  const rootRef = useRef(null);
  const videoRef = useRef(null);
  const previewVideoRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const statusTone = getStatusIconOption(customStatus?.iconId)?.tone || "navy";

  useEffect(() => {
    [videoRef.current, previewVideoRef.current].filter(Boolean).forEach((video) => {
      video.srcObject = stream || null;
      if (videoEnabled && stream) video.play().catch(() => {});
    });
  }, [stream, videoEnabled]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    function closeMenu(event) {
      if (!rootRef.current?.contains(event.target)) setMenuOpen(false);
    }
    document.addEventListener("mousedown", closeMenu);
    return () => document.removeEventListener("mousedown", closeMenu);
  }, [menuOpen]);

  function runAction(action) {
    setMenuOpen(false);
    action?.();
  }

  if (!minimized) {
    return customStatus ? (
      <div className="basic-rail-self-status-only">
        <button
          className={`basic-rail-self-status standalone status-tone-${statusTone}`}
          type="button"
          aria-label={`Your status: ${customStatus.text}. Edit status`}
          title={customStatus.text}
          onClick={onSetStatus}
        >
          <StatusIcon iconId={customStatus.iconId} emoji={customStatus.emoji} size={15} />
        </button>
      </div>
    ) : null;
  }

  return (
    <div ref={rootRef} className={`basic-rail-self-monitor minimized ${menuOpen ? "menu-open" : ""}`}>
      {customStatus ? (
        <button
          className={`basic-rail-self-status status-tone-${statusTone}`}
          type="button"
          aria-label={`Your status: ${customStatus.text}. Edit status`}
          title={customStatus.text}
          onClick={() => runAction(onSetStatus)}
        >
          <StatusIcon iconId={customStatus.iconId} emoji={customStatus.emoji} size={15} />
        </button>
      ) : null}
      <button
        className="basic-rail-self-monitor-button"
        type="button"
        aria-label="Open self view options"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((open) => !open)}
      >
        <video ref={videoRef} className={videoEnabled && stream ? "" : "hidden"} autoPlay muted playsInline />
        {(!videoEnabled || !stream) && <img src={videoMutePlaceholder} alt="" />}
      </button>

      <div className={`basic-rail-self-preview ${micEnabled ? "" : "mic-off"}`} role="tooltip" aria-label="Your self view">
        <video ref={previewVideoRef} className={videoEnabled && stream ? "" : "hidden"} autoPlay muted playsInline />
        {(!videoEnabled || !stream) && <img src={videoMutePlaceholder} alt="Your camera is off" />}
        {customStatus ? (
          <span className={`basic-rail-self-preview-status status-tone-${statusTone}`} aria-label={`Your status: ${customStatus.text}`}>
            <StatusIcon iconId={customStatus.iconId} emoji={customStatus.emoji} size={14} />
          </span>
        ) : null}
      </div>

      {menuOpen ? (
        <div className="basic-rail-self-menu confidence-view-menu" role="menu" aria-label="Self view options">
          <button type="button" role="menuitem" onClick={() => runAction(onSetStatus)}><Smile size={16} aria-hidden="true" />{customStatus ? "Edit status" : "Set a status"}</button>
          <button type="button" role="menuitem" onClick={() => runAction(onShowGrid)}><Grid2X2Plus size={16} aria-hidden="true" />Show in a grid</button>
          <button type="button" role="menuitem" onClick={() => runAction(onExpand)}><Maximize2 size={15} aria-hidden="true" />Show on map</button>
        </div>
      ) : null}
    </div>
  );
}

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
  const [selfViewMode, setSelfViewMode] = useState("grid");
  const [selfMedia, setSelfMedia] = useState({ videoEnabled: false, micEnabled: false, stream: null });
  const [customStatus, setCustomStatus] = useState(null);
  const [statusEditorOpen, setStatusEditorOpen] = useState(false);
  const [activeSidebarSelection, setActiveSidebarSelection] = useState(null);
  const [sidebarTab, setSidebarTab] = useState("people");
  const [officeHoursActive, setOfficeHoursActive] = useState(false);
  const [hideLobbyNames, setHideLobbyNames] = useState(false);
  const [videoInput, setVideoInput] = useState("integrated-camera");
  const [audioInput, setAudioInput] = useState("default-microphone");
  const [audioOutput, setAudioOutput] = useState("default-speakers");
  const [graphicsMode, setGraphicsMode] = useState("balanced");
  const [basicPreferences, setBasicPreferences] = useState({
    doubleClickToMove: true,
    autoMeetingMode: false,
    auto2DMode: true,
    joystick: false,
    backgroundBlur: true,
    noiseReduction: true
  });
  const [helpfulHintsHidden, setHelpfulHintsHidden] = useState(false);
  const [leaveToast, setLeaveToast] = useState(null);
  const [roomRefreshKey, setRoomRefreshKey] = useState(0);
  const [directoryCollapsed, setDirectoryCollapsed] = useState(false);
  const transitionTimerRef = useRef(null);
  const leaveToastTimerRef = useRef(null);
  const confirmationReturnStateRef = useRef(BASIC_VIEW.MAP);
  const [collapsedSections, setCollapsedSections] = useState({
    rooms: false,
    people: false
  });

  useEffect(() => () => {
    if (transitionTimerRef.current) window.clearTimeout(transitionTimerRef.current);
    if (leaveToastTimerRef.current) window.clearTimeout(leaveToastTimerRef.current);
  }, []);

  useEffect(() => {
    if (!customStatus?.expiresAt) return undefined;
    const remaining = customStatus.expiresAt - Date.now();
    if (remaining <= 0) {
      setCustomStatus(null);
      return undefined;
    }
    const timer = window.setTimeout(() => setCustomStatus(null), Math.min(remaining, 2147483647));
    return () => window.clearTimeout(timer);
  }, [customStatus]);

  function toggleSection(section) {
    setCollapsedSections((current) => ({
      ...current,
      [section]: !current[section]
    }));
  }

  function toggleBasicPreference(preference) {
    setBasicPreferences((current) => ({
      ...current,
      [preference]: !current[preference]
    }));
  }

  function openSidebarTab(tab) {
    setSidebarTab(tab);
    setDirectoryCollapsed(false);
  }

  const handleMapChatStateChange = useCallback((selection) => {
    setChatOpen(Boolean(selection));
    setActiveSidebarSelection(selection || null);
  }, []);

  const people = useMemo(() => getEffectivePeople([...VISIBLE_PEOPLE, ...addedPeople]), [addedPeople]);
  const allPeople = useMemo(() => getEffectivePeople([...PEOPLE, ...addedPeople]), [addedPeople]);
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
      ROOMS.map((room) => {
        const occupants = allPeople.filter(
          (person) => person.roomId === room.id
        );
        return {
          ...room,
          occupants,
          peopleCount: occupants.length + (room.id === currentUserRoomId ? 1 : 0)
        };
      })
        .filter((room) => room.peopleCount >= 2)
        .sort((a, b) => b.peopleCount - a.peopleCount),
    [allPeople, currentUserRoomId]
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
  const roomChatPerson = allPeople.find((person) => person.id === roomChatPersonId) || null;
  const officeHoursHosts = [PEOPLE[0], PEOPLE[4]].filter(Boolean);

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

  function leaveCurrentRoom() {
    const emptyRooms = ROOMS.filter(
      (room) => room.id !== currentUserRoomId && roomOccupants(room.id).length === 0
    );
    if (emptyRooms.length === 0) return;
    const previousRoom = currentRoom;
    const previousState = {
      roomId: currentUserRoomId,
      conversation: conversation ? { ...conversation } : null,
      viewState,
      roomDoorOpen
    };
    const destinationRoom = emptyRooms[Math.floor(Math.random() * emptyRooms.length)];
    setScreenSharing(false);
    setChatOpen(false);
    setActiveSidebarSelection(null);
    enterConversation(destinationRoom, conversation?.mode === "audio" ? "audio" : "video");
    setLeaveToast({ roomName: previousRoom.name, previousState });
    if (leaveToastTimerRef.current) window.clearTimeout(leaveToastTimerRef.current);
    leaveToastTimerRef.current = window.setTimeout(() => {
      setLeaveToast(null);
      leaveToastTimerRef.current = null;
    }, 5000);
  }

  function leaveKatmai() {
    setScreenSharing(false);
    setConversation(null);
    setRoomChatPersonId(null);
    setRoomGroupChatOpen(false);
    setActiveSidebarSelection(null);
    setViewState(BASIC_VIEW.MAP);
  }

  function returnToLeftRoom() {
    if (!leaveToast) return;
    const { previousState } = leaveToast;
    if (leaveToastTimerRef.current) window.clearTimeout(leaveToastTimerRef.current);
    leaveToastTimerRef.current = null;
    setCurrentUserRoomId(previousState.roomId);
    setConversation(previousState.conversation);
    setViewState(previousState.viewState);
    setRoomDoorOpen(previousState.roomDoorOpen);
    setRoomChatPersonId(null);
    setRoomGroupChatOpen(false);
    setDestination(null);
    setLeaveToast(null);
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
    setActiveSidebarSelection({ type: "person", id: person.id });
  }

  function openRoomGroupChat() {
    setRoomChatPersonId(null);
    setRoomGroupChatOpen(true);
    setActiveSidebarSelection({ type: "room", id: currentUserRoomId });
  }

  function toggleRoomGroupChat() {
    if (roomGroupChatOpen) {
      setRoomGroupChatOpen(false);
      setActiveSidebarSelection(null);
      return;
    }
    openRoomGroupChat();
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
    <main className={`basic-shell ${directoryCollapsed ? "basic-shell-directory-collapsed" : ""}`}>
      <nav className="basic-rail" aria-label="Katmai Basic navigation">
        <button
          className="basic-mark"
          type="button"
          aria-label={directoryCollapsed ? "Expand people and active rooms sidebar" : "Collapse people and active rooms sidebar"}
          title={directoryCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          onClick={() => setDirectoryCollapsed((collapsed) => !collapsed)}
        >
          <img src={katmaiMenuIcon} alt="" />
          <span className="basic-mark-toggle-icon" aria-hidden="true">
            {directoryCollapsed ? <PanelLeftOpen size={19} /> : <PanelLeftClose size={19} />}
          </span>
        </button>
        <div className="basic-rail-group">
          <button className={!directoryCollapsed && sidebarTab === "people" ? "active" : ""} type="button" aria-label="People and rooms" onClick={() => openSidebarTab("people")}>
            <Users size={20} aria-hidden="true" />
          </button>
          <button className={!directoryCollapsed && sidebarTab === "office-hours" ? "active" : ""} type="button" aria-label="Office Hours" onClick={() => openSidebarTab("office-hours")}>
            <Clock size={20} aria-hidden="true" />
          </button>
          <button className={!directoryCollapsed && sidebarTab === "settings" ? "active" : ""} type="button" aria-label="Settings" onClick={() => openSidebarTab("settings")}>
            <Settings size={20} aria-hidden="true" />
          </button>
          <button className={!directoryCollapsed && sidebarTab === "help" ? "active" : ""} type="button" aria-label="Help" onClick={() => openSidebarTab("help")}>
            <HelpCircle size={20} aria-hidden="true" />
          </button>
        </div>
        <div className="basic-rail-group basic-rail-bottom">
          {selfViewMode === "minimized" || customStatus ? (
            <BasicRailSelfMonitor
              minimized={selfViewMode === "minimized"}
              videoEnabled={selfMedia.videoEnabled}
              micEnabled={selfMedia.micEnabled}
              stream={selfMedia.stream}
              customStatus={customStatus}
              onExpand={() => setSelfViewMode("floating")}
              onSetStatus={() => setStatusEditorOpen(true)}
              onShowGrid={() => setSelfViewMode("grid")}
            />
          ) : null}
          <button type="button" aria-label="Refresh session" title="Refresh session" onClick={() => window.location.reload()}>
            <RefreshCw size={20} aria-hidden="true" />
          </button>
        </div>
      </nav>

      <aside className={`basic-directory ${directoryCollapsed ? "basic-directory-collapsed" : ""}`} aria-label={`${sidebarTab} sidebar`}>
        {!directoryCollapsed && (
          <>
            <header className="basic-directory-heading">
              <div>
                <span>Katmai Basic</span>
                <h1>{sidebarTab === "people" ? "People" : sidebarTab === "office-hours" ? "Office Hours" : sidebarTab === "settings" ? "Settings" : "Help"}</h1>
              </div>
              {sidebarTab === "people" && <div className="basic-directory-heading-actions">
                <span className="basic-online-count">{people.length} online</span>
              </div>}
            </header>

            {sidebarTab === "people" && <>
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
                  const statusMeta = getStatusMeta(status);
                  return (
                    <button key={status} type="button" role="menuitemcheckbox" aria-checked={selected} onClick={() => setStatusFilters((current) => selected ? current.filter((value) => value !== status) : [...current, status])}>
                      <span className="basic-filter-status-option">
                        <span className={`basic-filter-status-icon status-tone-${getStatusIconOption(statusMeta.iconId)?.tone || "navy"}`} aria-hidden="true">
                          <StatusIcon iconId={statusMeta.iconId} size={13} />
                        </span>
                        {status}
                      </span>
                      {selected && <b>✓</b>}
                    </button>
                  );
                })}
                {statusFilters.length > 0 && <button className="basic-filter-clear" type="button" onClick={() => setStatusFilters([])}>Clear filters</button>}
              </div>
            )}
          </div>
            </div>

          <section className={`basic-directory-section basic-current-room-section basic-current-room-pinned ${roomDoorOpen ? "" : "closed"} ${activeSidebarSelection?.type === "room" && activeSidebarSelection.id === currentUserRoomId ? "selected" : ""}`} aria-labelledby="basic-current-room">
            <div className="basic-current-room-heading">
              <div className="basic-current-room-title">
                <MapPin size={15} aria-hidden="true" />
                <button type="button" onClick={openCurrentRoom} aria-label={`Open ${currentRoom.name}`}>{currentRoom.name}</button>
              </div>
              <div className="basic-current-room-actions" aria-label={`Actions for ${currentRoom.name}`}>
                <button className={`basic-room-door-action ${roomDoorOpen ? "" : "active"}`} type="button" aria-label={roomDoorOpen ? "Close room door" : "Open room door"} title={roomDoorOpen ? "Close room door" : "Open room door"} onClick={() => setRoomDoorOpen((open) => !open)}>
                  {roomDoorOpen ? <LockOpen size={15} /> : <Lock size={15} />}
                  <span>{roomDoorOpen ? "Close Door" : "Open Door"}</span>
                </button>
              </div>
            </div>
            <div className="basic-current-room-summary">
              <span className={`basic-room-door ${roomDoorOpen ? "open" : "closed"}`}>{roomDoorOpen ? "Open" : "Closed"}</span>
              <small>{isSoloRoom ? "You're here by yourself" : `${currentRoomParticipants.length + 1} people in room`}</small>
            </div>
            {!isSoloRoom && (
              <div className="basic-person-list basic-current-room-list" aria-label={`People in ${currentRoom.name}`}>
                {currentRoomParticipants.map((person) => (
                  <button className={activeSidebarSelection?.type === "person" && activeSidebarSelection.id === person.id ? "selected" : ""} type="button" key={person.id} onClick={() => openRoomChat(person)}>
                    <span className="basic-person-avatar">{person.photo ? <img src={person.photo} alt="" referrerPolicy="no-referrer" /> : person.name[0]}<BasicAvatarModeBadge mode={person.experienceMode} /></span>
                    <span className="basic-person-copy">
                      <span className="basic-person-name-row">
                        <strong>{person.name}</strong>
                      <span className="basic-person-statuses">
                        {getPersonStatuses(person).map((status) => <BasicStatusEmoji key={status} status={status} customStatus={person.customStatus} className="sidebar-name-status" />)}
                      </span>
                      </span>
                      <ModeIndicator mode={person.experienceMode} showLabel textOnly className="basic-person-mode-row" />
                    </span>
                  </button>
                ))}
              </div>
            )}
          </section>

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
                {activeRooms.map((room) => {
                  const isClosed = currentUserRoomId === room.id ? !roomDoorOpen : room.open === false;
                  return (
                    <button className={`basic-room-row ${isClosed ? "closed" : ""} ${activeSidebarSelection?.type === "room" && activeSidebarSelection.id === room.id ? "selected" : ""} ${currentUserRoomId === room.id ? "current" : ""}`} type="button" key={room.id} onClick={() => selectRoom(room, true)}>
                      <span className={`basic-room-icon ${isClosed ? "closed" : ""}`} title={isClosed ? "Closed room" : "Open room"}>
                        {isClosed ? <Lock size={15} aria-label="Closed room" /> : <img src={roomIcon} alt="" aria-hidden="true" />}
                      </span>
                      <span>
                        <strong>{room.name}</strong>
                        <small>{room.occupants.map((person) => person.name.split(" ")[0]).join(", ")}</small>
                      </span>
                      {currentUserRoomId === room.id && <span className="basic-room-current-indicator" aria-label="You are here">You</span>}
                      <b>{room.peopleCount}</b>
                    </button>
                  );
                })}
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
                    className={
                      activeSidebarSelection?.type === "person" &&
                      activeSidebarSelection.id === person.id &&
                      !currentRoomParticipants.some((participant) => participant.id === person.id)
                        ? "selected"
                        : ""
                    }
                    key={person.id}
                    onClick={() => showConversation ? openRoomChat(person) : setFocusPersonId(person.id)}
                  >
                    <span className="basic-person-avatar">
                      {person.photo ? <img src={person.photo} alt="" referrerPolicy="no-referrer" /> : person.name[0]}
                      <BasicAvatarModeBadge mode={person.experienceMode} />
                    </span>
                    <span className="basic-person-copy">
                      <span className="basic-person-name-row">
                        <strong>{person.name}</strong>
                        <span className="basic-person-statuses">
                          {getPersonStatuses(person).map((status) => <BasicStatusEmoji key={status} status={status} customStatus={person.customStatus} className="sidebar-name-status" />)}
                        </span>
                      </span>
                      <ModeIndicator mode={person.experienceMode} showLabel textOnly className="basic-person-mode-row" />
                    </span>
                  </button>
                ))}
              </div>
            )}
          </section>
            </div>
            </>}
            {sidebarTab === "office-hours" && (
              <div className="basic-side-panel">
                <button className={`basic-primary-cta ${officeHoursActive ? "active" : ""}`} type="button" onClick={() => setOfficeHoursActive((active) => !active)}>
                  <Clock size={17} aria-hidden="true" />
                  {officeHoursActive ? "End Office Hours" : "Start Office Hours"}
                </button>

                <section className="basic-side-section basic-start-own-section">
                  <h2>Start your own</h2>
                  <p>Want to make yourself available for drop-ins? Start Office Hours to let others know you're open to chat. Everyone in the office will get a notification that you’ve started.</p>
                  <div className="basic-setting-row">
                    <div><strong>Hide names in lobby</strong><p>Replace participant names with initials for people waiting to join. Only you will see who's in line.</p></div>
                    <button className={`basic-toggle ${hideLobbyNames ? "active" : ""}`} type="button" role="switch" aria-checked={hideLobbyNames} aria-label="Hide names in lobby" onClick={() => setHideLobbyNames((hidden) => !hidden)}><span /></button>
                  </div>
                </section>

                <section className="basic-side-section">
                  <h2>Available Hosts</h2>
                  <p>These team members are currently hosting Office Hours. Join their queue for a quick 1:1 conversation.</p>
                  <div className="basic-host-list">
                    {officeHoursHosts.map((host, index) => (
                      <button type="button" key={host.id} className="basic-host-row">
                        <span className="basic-person-avatar">{host.photo ? <img src={host.photo} alt="" referrerPolicy="no-referrer" /> : host.name[0]}<BasicAvatarModeBadge mode={host.experienceMode} /></span>
                        <span><strong>{host.name}</strong><small>{index === 0 ? "2 people in queue" : "1 person in queue"}</small></span>
                        <span className="basic-queue-pill">Join</span>
                      </button>
                    ))}
                  </div>
                </section>

              </div>
            )}
            {sidebarTab === "settings" && (
              <div className="basic-side-panel">
                <div className="basic-settings-actions">
                  <button type="button"><Palette size={16} aria-hidden="true" />Brand your space</button>
                  <button type="button"><Boxes size={16} aria-hidden="true" />Switch your architecture</button>
                  <button type="button"><MapPinned size={16} aria-hidden="true" />Switch Location</button>
                </div>
                <section className="basic-side-section basic-settings-group">
                  <h2>Devices</h2>
                  <label className="basic-select-setting">
                    <span><Video size={16} aria-hidden="true" /><strong>Video input</strong></span>
                    <select aria-label="Video input" value={videoInput} onChange={(event) => setVideoInput(event.target.value)}>
                      <option value="integrated-camera">Integrated Camera</option>
                      <option value="external-camera">External USB Camera</option>
                      <option value="virtual-camera">Virtual Camera</option>
                    </select>
                  </label>
                  <label className="basic-select-setting">
                    <span><Mic size={16} aria-hidden="true" /><strong>Audio input</strong></span>
                    <select aria-label="Audio input" value={audioInput} onChange={(event) => setAudioInput(event.target.value)}>
                      <option value="default-microphone">Default — Microphone</option>
                      <option value="headset-microphone">Headset Microphone</option>
                      <option value="external-microphone">External Microphone</option>
                    </select>
                  </label>
                  <label className="basic-select-setting">
                    <span><Headphones size={16} aria-hidden="true" /><strong>Audio output</strong></span>
                    <select aria-label="Audio output" value={audioOutput} onChange={(event) => setAudioOutput(event.target.value)}>
                      <option value="default-speakers">Default — Speakers</option>
                      <option value="headphones">Headphones</option>
                      <option value="display-audio">Display Audio</option>
                    </select>
                  </label>
                </section>
                <section className="basic-side-section basic-settings-group">
                  <h2>Graphics</h2>
                  <label className="basic-select-setting">
                    <span><SlidersHorizontal size={16} aria-hidden="true" /><strong>Graphics quality</strong></span>
                    <select aria-label="Graphics quality" value={graphicsMode} onChange={(event) => setGraphicsMode(event.target.value)}>
                      <option value="safe">Safe mode</option>
                      <option value="efficient">Efficient</option>
                      <option value="balanced">Balanced</option>
                      <option value="enhanced">Enhanced</option>
                    </select>
                  </label>
                </section>
                <section className="basic-side-section basic-settings-group">
                  <h2>Experience</h2>
                  {[
                    ["doubleClickToMove", "Double click to move"],
                    ["autoMeetingMode", "Auto Meeting Mode"],
                    ["auto2DMode", "Auto 2D mode"],
                    ["joystick", "Joystick"],
                    ["backgroundBlur", "Background Blur"],
                    ["noiseReduction", "Noise Reduction"]
                  ].map(([preference, label]) => (
                    <div className="basic-setting-row basic-setting-row-compact" key={preference}>
                      <strong>{label}</strong>
                      <button
                        className={`basic-toggle ${basicPreferences[preference] ? "active" : ""}`}
                        type="button"
                        role="switch"
                        aria-checked={basicPreferences[preference]}
                        aria-label={label}
                        onClick={() => toggleBasicPreference(preference)}
                      >
                        <span />
                      </button>
                    </div>
                  ))}
                </section>
                <section className="basic-side-section basic-settings-group basic-helpful-hints-section">
                  <div className="basic-hint-setting">
                    <h2>Helpful Hints</h2>
                    <div>
                      <button type="button" onClick={() => setHelpfulHintsHidden((hidden) => !hidden)}>{helpfulHintsHidden ? "Show" : "Hide"}</button>
                      <button type="button" onClick={() => setHelpfulHintsHidden(false)}>Restart</button>
                    </div>
                  </div>
                </section>
              </div>
            )}
            {sidebarTab === "help" && (
              <div className="basic-side-panel">
                <div className="basic-settings-actions">
                  <button type="button"><GraduationCap size={16} aria-hidden="true" />Tutorial</button>
                  <button type="button"><CircleHelp size={16} aria-hidden="true" />Help Center</button>
                  <button type="button"><Headphones size={16} aria-hidden="true" />Contact support</button>
                </div>
                <section className="basic-side-section basic-shortcuts-section">
                  <h2>Shortcuts</h2>
                  {[['Moving', 'Z'], ['Jump', 'Space'], ['Move faster', 'Shift'], ['Sleep Mode', 'Z'], ['Turn off camera', 'V'], ['Turn off microphone', 'M'], ['Hide self view', 'C'], ['Meeting mode', 'Alt', 'V']].map(([label, ...keys]) => <div className="basic-shortcut-row" key={label}><span>{label}</span><span>{keys.map((key) => <kbd key={key}>{key}</kbd>)}</span></div>)}
                </section>
              </div>
            )}
          </>
        )}
      </aside>

      <InviteUsersModal open={addUserOpen} onClose={() => setAddUserOpen(false)} onInvite={addUsers} />
      <CustomStatusModal
        open={statusEditorOpen}
        value={customStatus}
        onClose={() => setStatusEditorOpen(false)}
        onSave={(status) => {
          setCustomStatus(status);
          setStatusEditorOpen(false);
        }}
        onClear={() => {
          setCustomStatus(null);
          setStatusEditorOpen(false);
        }}
      />

      <section className="basic-workspace" aria-label="Katmai Basic workspace">
        <div className={`basic-workspace-stage ${chatOpen || roomGroupChatOpen || (showConversation && Boolean(roomChatPerson)) ? "right-panel-open" : ""}`}>
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
              selfView={selfViewMode === "grid" ? {
                videoEnabled: selfMedia.videoEnabled,
                stream: selfMedia.stream,
                placeholder: videoMutePlaceholder,
                customStatus,
                onSetStatus: () => setStatusEditorOpen(true),
                onRemove: () => setSelfViewMode("floating"),
                onMinimize: () => setSelfViewMode("minimized")
              } : null}
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
              onChatStateChange={handleMapChatStateChange}
              roomDetailsMode="panel"
              openChatOnPersonSelect
              hideMapAddUsers
              hideMapSearch
              pushToast={() => {}}
              onJumpRequest={(_person, onResult) => {
                window.setTimeout(() => onResult({ status: "accepted", room: ROOMS.find((room) => room.id === currentUserRoomId) }), 650);
              }}
            />
          )}

          <ConfidenceMonitor
            chatOpen={chatOpen || (showConversation && (Boolean(roomChatPerson) || roomGroupChatOpen))}
            screenSharing={screenSharing}
            onToggleScreenSharing={() => setScreenSharing((sharing) => !sharing)}
            roomChatOpen={roomGroupChatOpen}
            canOpenRoomChat={!isSoloRoom}
            onToggleRoomChat={toggleRoomGroupChat}
            canLeaveRoom={currentRoomParticipants.length > 0}
            onLeaveRoom={leaveCurrentRoom}
            onLeaveKatmai={leaveKatmai}
            viewMode={selfViewMode}
            onViewModeChange={setSelfViewMode}
            onMediaStateChange={setSelfMedia}
            customStatus={customStatus}
            onSetStatus={() => setStatusEditorOpen(true)}
            gridVisible={showConversation}
          >
            {() => (
              <PresenceSwitcher
                room={currentRoom}
                roomActive={showConversation}
                onOpenRoom={openCurrentRoom}
                onOpenMap={() => conversation ? openMapDuringConversation() : setViewState(BASIC_VIEW.MAP)}
              />
            )}
          </ConfidenceMonitor>

          {roomGroupChatOpen && (
            <RoomGroupChatPanel
              room={currentRoom}
              participants={currentRoomParticipants}
              onClose={() => {
                setRoomGroupChatOpen(false);
                setActiveSidebarSelection(null);
              }}
            />
          )}

          {showConversation && !roomGroupChatOpen && roomChatPerson && (
            <RoomChatPanel
              person={roomChatPerson}
              onClose={() => {
                setRoomChatPersonId(null);
                setActiveSidebarSelection(null);
              }}
              onOpenMap={openMapDuringConversation}
            />
          )}

          {viewState === BASIC_VIEW.MAP_WHILE_IN_CONVERSATION && currentConversationRoom && conversationParticipants.length > 0 && (
            <ConversationMapPreview room={currentConversationRoom} participants={conversationParticipants} mode={conversation.mode} onReturn={returnToConversation} />
          )}

          {viewState === BASIC_VIEW.DESTINATION_TRANSITION && destination && (
            <DestinationTransition destination={destinationLabel} />
          )}

          {leaveToast && (
            <div className="basic-leave-room-toast" role="status">
              <span>You left <strong>{leaveToast.roomName}</strong></span>
              <button type="button" onClick={returnToLeftRoom}>Return</button>
            </div>
          )}

        </div>
      </section>
    </main>
  );
}

function getCustomStatusExpiry(duration) {
  const now = Date.now();
  if (duration === "hour") return now + 60 * 60 * 1000;
  if (duration === "four-hours") return now + 4 * 60 * 60 * 1000;
  if (duration === "today") {
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    return endOfDay.getTime();
  }
  if (duration === "week") return now + 7 * 24 * 60 * 60 * 1000;
  return null;
}

function CustomStatusModal({ open, value, onClose, onSave, onClear }) {
  const [iconId, setIconId] = useState(value?.iconId || "focus");
  const [emoji, setEmoji] = useState(value?.emoji || "");
  const [text, setText] = useState(value?.text || "");
  const [duration, setDuration] = useState(value?.duration || "never");
  const inputRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    setIconId(value?.iconId || "focus");
    setEmoji(value?.emoji || "");
    setText(value?.text || "");
    setDuration(value?.duration || "never");
    const frame = window.requestAnimationFrame(() => inputRef.current?.focus());
    return () => window.cancelAnimationFrame(frame);
  }, [open, value]);

  useEffect(() => {
    if (!open) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  function choosePreset(preset) {
    setIconId(preset.iconId);
    setEmoji("");
    setText(preset.text);
    setDuration(preset.duration);
  }

  function submitStatus(event) {
    event.preventDefault();
    const trimmedText = text.trim();
    if (!trimmedText) return;
    onSave({
      iconId,
      emoji,
      text: trimmedText,
      duration,
      expiresAt: getCustomStatusExpiry(duration)
    });
  }

  return (
    <div className="basic-status-modal-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <form className="basic-status-modal" role="dialog" aria-modal="true" aria-labelledby="basic-status-modal-title" onSubmit={submitStatus}>
        <header>
          <h2 id="basic-status-modal-title">Set a status</h2>
          <button type="button" aria-label="Close status editor" onClick={onClose}><X size={20} /></button>
        </header>

        <label className="basic-status-composer">
          <span className={`basic-status-selected-emoji status-icon-tile ${getStatusIconOption(iconId)?.tone || "navy"}`} aria-hidden="true"><StatusIcon iconId={iconId} emoji={emoji} size={14} /></span>
          <input ref={inputRef} value={text} onChange={(event) => setText(event.target.value)} maxLength={80} placeholder="What's your status?" aria-label="Status text" />
          {text && <button type="button" aria-label="Clear status text" onClick={() => setText("")}><X size={15} /></button>}
        </label>

        <div className="basic-status-emoji-picker" aria-label="Choose a status icon">
          {STATUS_ICON_OPTIONS.map((option) => (
            <button className={iconId === option.id && !emoji ? "selected" : ""} type="button" key={option.id} aria-label={`Use ${option.label} status icon`} aria-pressed={iconId === option.id && !emoji} onClick={() => { setIconId(option.id); setEmoji(""); }}>
              <span className={`status-icon-tile ${option.tone}`}><StatusIcon iconId={option.id} size={18} /></span>
            </button>
          ))}
        </div>

        <label className="basic-status-custom-emoji">
          <span>Custom emoji</span>
          <input value={emoji} onChange={(event) => setEmoji(event.target.value)} maxLength={4} placeholder="Paste an emoji" aria-label="Paste an emoji fallback" />
        </label>

        <section className="basic-status-presets" aria-labelledby="basic-status-presets-title">
          <h3 id="basic-status-presets-title">Suggested</h3>
          {CUSTOM_STATUS_PRESETS.map((preset) => (
            <button type="button" key={preset.text} onClick={() => choosePreset(preset)}>
              <span className={`basic-status-preset-icon status-tone-${getStatusIconOption(preset.iconId)?.tone || "navy"}`} aria-hidden="true"><StatusIcon iconId={preset.iconId} size={16} /></span>
              <strong>{preset.text}</strong>
              <small>{preset.duration === "never" ? "Don't clear" : preset.duration === "today" ? "Today" : preset.duration === "four-hours" ? "4 hours" : "1 hour"}</small>
            </button>
          ))}
        </section>

        <label className="basic-status-duration">
          <span>Remove status after</span>
          <select value={duration} onChange={(event) => setDuration(event.target.value)}>
            <option value="never">Don't clear</option>
            <option value="hour">1 hour</option>
            <option value="four-hours">4 hours</option>
            <option value="today">Today</option>
            <option value="week">1 week</option>
          </select>
        </label>

        <footer>
          {value && <button className="clear" type="button" onClick={onClear}>Clear status</button>}
          <button type="button" onClick={onClose}>Cancel</button>
          <button className="primary" type="submit" disabled={!text.trim()}>Save</button>
        </footer>
      </form>
    </div>
  );
}

function PresenceSwitcher({ room, roomActive, selfPreview, onOpenRoom, onOpenMap }) {
  return (
    <section className={`basic-presence-switcher ${selfPreview ? "with-self-preview" : ""}`} aria-label="Your room and workspace view">
      {selfPreview}
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

function ConfidenceMonitor({
  chatOpen = false,
  screenSharing = false,
  onToggleScreenSharing,
  roomChatOpen = false,
  canOpenRoomChat = false,
  onToggleRoomChat,
  canLeaveRoom = false,
  onLeaveRoom,
  onLeaveKatmai,
  viewMode = "floating",
  onViewModeChange,
  onMediaStateChange,
  customStatus,
  onSetStatus,
  gridVisible = false,
  children
}) {
  const monitorRef = useRef(null);
  const expandedVideoRef = useRef(null);
  const streamRef = useRef(null);
  const dragRef = useRef(null);
  const reactionTimerRef = useRef(null);
  const [position, setPosition] = useState(null);
  const [chatDockRight, setChatDockRight] = useState(null);
  const [viewMenuOpen, setViewMenuOpen] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(false);
  const [micEnabled, setMicEnabled] = useState(false);
  const [streamVersion, setStreamVersion] = useState(0);
  const [mediaError, setMediaError] = useState("");
  const [reactionOpen, setReactionOpen] = useState(false);
  const [reaction, setReaction] = useState("");
  const [dragging, setDragging] = useState(false);
  const minimized = viewMode === "minimized";
  const floatingVisible = viewMode === "floating" || (viewMode === "grid" && !gridVisible);

  useEffect(() => {
    [expandedVideoRef.current]
      .filter(Boolean)
      .forEach((video) => {
        video.srcObject = streamRef.current;
        if (videoEnabled) video.play().catch(() => {});
      });
  }, [streamVersion, videoEnabled, minimized, floatingVisible]);

  useEffect(() => () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    if (reactionTimerRef.current) window.clearTimeout(reactionTimerRef.current);
  }, []);

  useEffect(() => {
    onMediaStateChange?.({
      videoEnabled,
      micEnabled,
      stream: streamRef.current
    });
  }, [videoEnabled, micEnabled, streamVersion, onMediaStateChange]);

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
    const protectedPanel = boundary?.querySelector(
      ".basic-map-boundary .chat-panel, .basic-map-boundary .room-details-panel, .basic-room-chat-panel"
    );
    if (!boundary || !protectedPanel) return;

    const updateDock = () => {
      const boundaryRect = boundary.getBoundingClientRect();
      const panelRect = protectedPanel.getBoundingClientRect();
      setChatDockRight(Math.max(8, boundaryRect.right - panelRect.left + 18));
    };

    updateDock();
    window.addEventListener("resize", updateDock);
    protectedPanel.addEventListener("animationend", updateDock);
    const settleTimer = window.setTimeout(updateDock, 260);
    return () => {
      window.removeEventListener("resize", updateDock);
      protectedPanel.removeEventListener("animationend", updateDock);
      window.clearTimeout(settleTimer);
    };
  }, [chatOpen, position, minimized]);

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
    setPosition(null);
    setViewMenuOpen(false);
    onViewModeChange?.("minimized");
  }

  function showMonitorInGrid() {
    setPosition(null);
    setViewMenuOpen(false);
    onViewModeChange?.("grid");
  }

  function openStatusEditor() {
    setViewMenuOpen(false);
    onSetStatus?.();
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
    <>
      {typeof children === "function" ? children({ selfPreview: null }) : children}

      {floatingVisible && (
        <section
          ref={monitorRef}
          className={`confidence-monitor expanded ${dragging ? "dragging" : ""} ${micEnabled ? "" : "mic-off"}`}
          style={monitorStyle}
          aria-label="Your expanded self view"
          onClick={(event) => event.stopPropagation()}
          onMouseDown={handleMouseDown}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
          onPointerCancel={handlePointerEnd}
        >
          <div className="confidence-video-ring">
            <video ref={expandedVideoRef} className={videoEnabled ? "" : "hidden"} autoPlay muted playsInline />
            {!videoEnabled && <img src={videoMutePlaceholder} alt="Your camera is off" />}
          </div>
          <div className="confidence-view-options">
            <button
              className="confidence-minimize"
              type="button"
              aria-label="Self view options"
              title="Self view options"
              aria-expanded={viewMenuOpen}
              onClick={() => setViewMenuOpen((open) => !open)}
            >
              <MoreHorizontal size={19} />
            </button>
            {viewMenuOpen && (
              <div className="confidence-view-menu" role="menu" aria-label="Self view options">
                <button type="button" role="menuitem" onClick={openStatusEditor}><Smile size={16} aria-hidden="true" />{customStatus ? "Edit status" : "Set a status"}</button>
                <button type="button" role="menuitem" onClick={showMonitorInGrid}><Grid2X2Plus size={16} aria-hidden="true" />Show in a grid</button>
                <button type="button" role="menuitem" onClick={minimizeMonitor}><Minimize2 size={15} />Minimize</button>
              </div>
            )}
          </div>
        </section>
      )}

      <div className="confidence-call-dock" aria-label="Call controls">
        {reaction && <div className="confidence-reaction-burst" role="status">{reaction}</div>}
        <ConfidenceReactionButton open={reactionOpen} onToggle={() => setReactionOpen((open) => !open)} onReact={sendReaction} />
        <button className={`confidence-control ${micEnabled ? "" : "off"}`} type="button" aria-label={micEnabled ? "Mute microphone" : "Unmute microphone"} title={micEnabled ? "Mute" : "Unmute"} onClick={toggleMic}>{micEnabled ? <Mic size={19} /> : <MicOff size={19} />}</button>
        <button className={`confidence-control ${videoEnabled ? "" : "off"}`} type="button" aria-label={videoEnabled ? "Turn camera off" : "Turn camera on"} title={videoEnabled ? "Camera off" : "Camera on"} onClick={toggleVideo}>{videoEnabled ? <Video size={19} /> : <VideoOff size={19} />}</button>
        <button className={`confidence-control ${screenSharing ? "active" : ""}`} type="button" aria-pressed={screenSharing} aria-label={screenSharing ? "Stop sharing screen" : "Share screen"} title={screenSharing ? "Stop sharing screen" : "Share screen"} onClick={onToggleScreenSharing}><Cast size={19} /></button>
        {canOpenRoomChat && <button className={`confidence-control ${roomChatOpen ? "active" : ""}`} type="button" aria-pressed={roomChatOpen} aria-label={roomChatOpen ? "Close room chat" : "Open room chat"} title="Room chat" onClick={onToggleRoomChat}><MessageCircle size={19} /></button>}
        {canLeaveRoom && <button className="confidence-control leave-room" type="button" aria-label="Leave room" title="Leave room" onClick={onLeaveRoom}><img src={exitMeetingIcon} alt="" aria-hidden="true" /></button>}
        <button className="confidence-control leave-katmai" type="button" aria-label="Leave Katmai" title="Leave Katmai" onClick={onLeaveKatmai}><img src={logOutCircleIcon} alt="" aria-hidden="true" /></button>
        {mediaError && <p className="confidence-media-error" role="alert">{mediaError}</p>}
      </div>
    </>
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
