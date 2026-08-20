import arcRoom from "./assets/room-arc.jpg";
import emptyOfficeRoom from "./assets/room-empty-office.jpg";
import libraryRoom from "./assets/room-library.jpg";
import loungeRoom from "./assets/room-lounge.jpg";
import summitRoom from "./assets/room-summit.jpg";

const ROOM_BACKGROUNDS = [summitRoom, loungeRoom, libraryRoom, arcRoom, emptyOfficeRoom];

export function getRoomBackground(roomId) {
  const hash = [...roomId].reduce((total, character) => total + character.charCodeAt(0), 0);
  return ROOM_BACKGROUNDS[hash % ROOM_BACKGROUNDS.length];
}
