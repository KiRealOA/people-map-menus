import React from "react";
import {
  ArrowRight,
  Check,
  Clock3,
  DoorOpen,
  Grid2X2,
  Headphones,
  Map as MapIcon,
  Mic,
  Navigation,
  UserPlus,
  X
} from "lucide-react";
import emptyOfficeBackground from "./assets/basic-conversation-office.jpg";
import peerAFeed from "./assets/peer-a.mp4";
import peerBFeed from "./assets/peer-b.mp4";
import peerCFeed from "./assets/peer-c.mp4";

const conversationFeeds = [peerAFeed, peerBFeed, peerCFeed];

export function ConversationBoundary({
  room,
  participants,
  mode,
  solo,
  onModeChange,
  onOpenMap,
  onSummon,
  refreshKey
}) {
  return (
    <section className={`basic-conversation-stage ${solo ? "solo" : mode}`} aria-label={`${room.name} conversation`} key={refreshKey}>
      <img className="basic-conversation-backdrop" src={emptyOfficeBackground} alt="" />
      <div className="basic-conversation-scrim" />

      <header className="basic-conversation-header">
        <div className="basic-conversation-header-actions">
          {!solo && (
            <div className="basic-mode-switch" aria-label="Conversation mode">
              <button className={mode === "video" ? "active" : ""} type="button" aria-pressed={mode === "video"} onClick={() => onModeChange("video")}>
                <Grid2X2 size={16} /> 2D
              </button>
              <button className={mode === "audio" ? "active" : ""} type="button" aria-pressed={mode === "audio"} onClick={() => onModeChange("audio")}>
                <Headphones size={17} /> Audio only
              </button>
            </div>
          )}
        </div>
      </header>

      {solo ? (
        <div className="basic-empty-room-card">
          <span className="basic-empty-room-icon"><DoorOpen size={30} /></span>
          <h3>You're here by yourself</h3>
          <p>Still office backdrop. People appear here when they join.</p>
          <div className="basic-solo-actions">
            <button className="primary" type="button" aria-label="Summon someone" title="Summon someone" onClick={onSummon}><UserPlus size={18} /></button>
            <button type="button" aria-label="Open map" title="Open map" onClick={onOpenMap}><MapIcon size={18} /></button>
          </div>
        </div>
      ) : (
        <div className={`basic-honeycomb ${mode} count-${Math.min(participants.length, 7)}`} aria-label={`${mode === "video" ? "Video" : "Audio"} participants`}>
          {participants.slice(0, 7).map((participant, index) => (
            <article className={`basic-honeycomb-person ${index === 0 ? "current" : ""} ${mode === "audio" && index === 1 ? "speaking" : ""}`} key={participant.id}>
              <div className="basic-honeycomb-avatar">
                {participant.photo ? (
                  mode === "video" ? (
                    <video src={conversationFeeds[index % conversationFeeds.length]} autoPlay loop muted playsInline aria-label={`${participant.name}'s video feed`} />
                  ) : (
                    <img src={participant.photo} alt="" referrerPolicy="no-referrer" />
                  )
                ) : (
                  <span style={{ background: `linear-gradient(145deg, ${participant.palette?.[1] || "#8c52ff"}, ${participant.palette?.[2] || "#4300b5"})` }}>
                    {participant.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}
                  </span>
                )}
                {mode === "audio" && (
                  <span className="basic-audio-indicator" aria-label={index === 1 ? "Speaking" : "Microphone active"}>
                    <Mic size={15} />
                    <i /><i /><i />
                  </span>
                )}
              </div>
              <strong>{participant.id === "you" ? "You" : participant.name.split(" ")[0]}</strong>
              {mode === "audio" && <small>{index === 1 ? "Speaking" : "Listening"}</small>}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export function PersonRequestPanel({ person, room, requestKind, status, onRequest, onResolve, onEnter, onClose }) {
  const isIdle = status === "idle";
  const isPending = status === "pending";
  return (
    <aside className={`basic-flow-panel person-request ${status}`} aria-live="polite">
      <button className="basic-flow-close" type="button" aria-label="Close person actions" onClick={onClose}><X size={18} /></button>
      <div className="basic-flow-person">
        <span>{person.photo ? <img src={person.photo} alt="" referrerPolicy="no-referrer" /> : person.name[0]}</span>
        <div><small>{person.status || "Available"}</small><h3>{person.name}</h3><p>{room.name}</p></div>
      </div>

      {isIdle && (
        <>
          <p className="basic-flow-copy">Connect with {person.name.split(" ")[0]} without leaving the map.</p>
          <div className="basic-flow-actions stacked">
            <button className="primary" type="button" onClick={() => onRequest("jump")}><Navigation size={18} /> Jump to {person.name.split(" ")[0]}</button>
            <button type="button" onClick={() => onRequest("summon")}><UserPlus size={18} /> Summon here</button>
          </div>
        </>
      )}

      {isPending && (
        <>
          <div className="basic-request-state"><Clock3 size={21} /><div><strong>{requestKind === "summon" ? "Summon sent" : "Jump request sent"}</strong><span>Waiting for {person.name.split(" ")[0]} to respond…</span></div></div>
          <p className="basic-test-label">Mock response controls</p>
          <div className="basic-flow-actions">
            <button className="primary" type="button" onClick={() => onResolve("accepted")}><Check size={17} /> Accept</button>
            <button type="button" onClick={() => onResolve("declined")}><X size={17} /> Decline</button>
          </div>
        </>
      )}

      {status === "accepted" && (
        <>
          <div className="basic-request-state accepted"><Check size={21} /><div><strong>Request accepted</strong><span>{person.name.split(" ")[0]} is ready in {room.name}.</span></div></div>
          <button className="basic-wide-primary" type="button" onClick={onEnter}>Enter conversation <ArrowRight size={18} /></button>
        </>
      )}

      {status === "declined" && (
        <>
          <div className="basic-request-state declined"><X size={21} /><div><strong>Request declined</strong><span>You are still on the map and can try again.</span></div></div>
          <div className="basic-flow-actions"><button className="primary" type="button" onClick={() => onRequest(requestKind || "jump")}>Try again</button><button type="button" onClick={onClose}>Back to map</button></div>
        </>
      )}
    </aside>
  );
}

export function RoomRequestPanel({ room, peopleCount, status, onRequest, onResolve, onEnter, onClose }) {
  const empty = peopleCount === 0;
  return (
    <aside className={`basic-flow-panel room-request ${status}`} aria-live="polite">
      <button className="basic-flow-close" type="button" aria-label="Close room actions" onClick={onClose}><X size={18} /></button>
      <span className="basic-room-action-icon"><DoorOpen size={25} /></span>
      <small>{empty ? "Empty · available" : `${peopleCount} ${peopleCount === 1 ? "person" : "people"}`}</small>
      <h3>{room.name}</h3>
      {status === "idle" && <button className="basic-wide-primary" type="button" onClick={empty ? onEnter : onRequest}>{empty ? "Enter empty room" : "Request to join"}<ArrowRight size={18} /></button>}
      {status === "pending" && <><div className="basic-request-state"><Clock3 size={21} /><div><strong>Request pending</strong><span>Waiting for someone in the room…</span></div></div><p className="basic-test-label">Mock response controls</p><div className="basic-flow-actions"><button className="primary" type="button" onClick={() => onResolve("accepted")}><Check size={17} /> Accept</button><button type="button" onClick={() => onResolve("declined")}><X size={17} /> Decline</button></div></>}
      {status === "accepted" && <><div className="basic-request-state accepted"><Check size={21} /><div><strong>Request accepted</strong><span>The room is ready for you.</span></div></div><button className="basic-wide-primary" type="button" onClick={onEnter}>Enter conversation <ArrowRight size={18} /></button></>}
      {status === "declined" && <><div className="basic-request-state declined"><X size={21} /><div><strong>Request declined</strong><span>You have not left your current location.</span></div></div><div className="basic-flow-actions"><button className="primary" type="button" onClick={onRequest}>Try again</button><button type="button" onClick={onClose}>Back to map</button></div></>}
    </aside>
  );
}

export function DestinationConfirmation({ current, destination, onCancel, onConfirm }) {
  return (
    <div className="basic-confirm-backdrop" role="presentation">
      <section className="basic-confirm-panel" role="dialog" aria-modal="true" aria-labelledby="basic-leave-title">
        <span className="basic-confirm-icon"><Navigation size={24} /></span>
        <small>Confirm destination</small>
        <h3 id="basic-leave-title">Leave this conversation?</h3>
        <div className="basic-route-summary">
          <span><small>Current location</small><strong>{current}</strong></span>
          <ArrowRight size={19} />
          <span><small>Destination</small><strong>{destination}</strong></span>
        </div>
        <p>Your current conversation stays active until you confirm.</p>
        <div className="basic-flow-actions"><button type="button" onClick={onCancel}>Cancel</button><button className="primary" type="button" onClick={onConfirm}>Leave and move</button></div>
      </section>
    </div>
  );
}

export function ConversationMapStatus({ room, mode, onReturn }) {
  return (
    <div className="basic-conversation-map-status">
      <span className="basic-live-dot" />
      <div><small>Conversation continues</small><strong>{room.name} · {mode === "video" ? "Video" : "Audio only"}</strong></div>
      <button type="button" onClick={onReturn}>Return</button>
    </div>
  );
}

export function DestinationTransition({ destination }) {
  return (
    <div className="basic-transition-overlay" role="status">
      <span><Navigation size={25} /></span>
      <small>Moving to</small>
      <strong>{destination}</strong>
    </div>
  );
}
