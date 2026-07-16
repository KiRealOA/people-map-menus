import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  ArrowLeft,
  BellRing,
  Check,
  CheckCircle2,
  Clock3,
  Compass,
  DoorOpen,
  Download,
  FileUp,
  Map as MapIcon,
  Mail,
  MessageCircle,
  Navigation,
  Rocket,
  Search,
  Send,
  SlidersHorizontal,
  UserRound,
  UserPlus,
  Users,
  X,
  ZoomIn,
  ZoomOut,
  AlertCircle,
  LoaderCircle
} from "lucide-react";
import officeBackdrop from "./assets/katmai-office-backdrop.png";
import officeBackdropVideo from "./assets/Katmai_Office_bg_01.mp4";

const PERSON_PHOTOS = {
  maya: "https://randomuser.me/api/portraits/women/44.jpg",
  noah: "https://randomuser.me/api/portraits/men/32.jpg",
  sol: "https://randomuser.me/api/portraits/women/68.jpg",
  dana: "https://randomuser.me/api/portraits/women/52.jpg",
  eli: "https://randomuser.me/api/portraits/men/75.jpg",
  ren: "https://randomuser.me/api/portraits/men/41.jpg",
  jules: "https://randomuser.me/api/portraits/women/23.jpg",
  sam: "https://randomuser.me/api/portraits/men/15.jpg",
  emily: "https://randomuser.me/api/portraits/women/11.jpg",
  marcus: "https://randomuser.me/api/portraits/men/54.jpg",
  priya: "https://randomuser.me/api/portraits/women/37.jpg",
  omar: "https://randomuser.me/api/portraits/men/64.jpg",
  lina: "https://randomuser.me/api/portraits/women/60.jpg",
  theo: "https://randomuser.me/api/portraits/men/22.jpg",
  zoe: "https://randomuser.me/api/portraits/women/7.jpg",
  ari: "https://randomuser.me/api/portraits/women/26.jpg",
  nina: "https://randomuser.me/api/portraits/women/34.jpg",
  cam: "https://randomuser.me/api/portraits/men/48.jpg",
  isla: "https://randomuser.me/api/portraits/women/63.jpg",
  kenji: "https://randomuser.me/api/portraits/men/18.jpg",
  you: "https://randomuser.me/api/portraits/men/52.jpg"
};

const CURRENT_USER = {
  id: "you",
  name: "You",
  photo: PERSON_PHOTOS.you,
  palette: ["#efe9ff", "#8c52ff", "#5801eb"]
};

const USER_ROLES = ["Team Member", "Office Administrator", "Guest"];
const BILLING_CONFIG = {
  monthlyUserPrice: 15,
  currency: "USD"
};

const PEOPLE = [
  {
    id: "maya",
    name: "Maya Chen",
    role: "Product design",
    roomId: "river",
    presenceGroup: "space",
    status: "Private",
    signal: "private",
    experienceMode: "2d",
    planX: 466,
    planY: 104,
    palette: ["#eef1ff", "#7f86a9", "#061a35"]
  },
  {
    id: "noah",
    name: "Noah Patel",
    role: "Frontend",
    roomId: "river",
    presenceGroup: "space",
    planX: 532,
    planY: 104,
    palette: ["#f5f7ff", "#49b6e9", "#0b63d8"]
  },
  {
    id: "sol",
    name: "Sol Rivera",
    role: "Product",
    roomId: "huddle",
    presenceGroup: "space",
    status: "In conversation",
    signal: "conversation",
    planX: 324,
    planY: 344,
    palette: ["#eef1ff", "#aeaef1", "#3a0ca3"]
  },
  {
    id: "dana",
    name: "Dana Brooks",
    role: "Operations",
    roomId: "river",
    presenceGroup: "space",
    status: "Away",
    signal: "away",
    unreadCount: 2,
    experienceMode: "audio",
    planX: 662,
    planY: 154,
    palette: ["#f7f8ff", "#a3a8bf", "#5f527c"]
  },
  {
    id: "eli",
    name: "Eli Morgan",
    role: "Engineering",
    roomId: "garden",
    presenceGroup: "space",
    experienceMode: "essential",
    planX: 150,
    planY: 448,
    palette: ["#eef1ff", "#45b6e9", "#001a37"]
  },
  {
    id: "ren",
    name: "Ren Okafor",
    role: "Sales",
    roomId: "forum",
    presenceGroup: "space",
    status: "In conversation",
    signal: "conversation",
    planX: 842,
    planY: 448,
    palette: ["#e8e9fa", "#9985f6", "#5a11d8"]
  },
  {
    id: "jules",
    name: "Jules Kim",
    role: "Customer success",
    roomId: "forum",
    presenceGroup: "space",
    planX: 858,
    planY: 478,
    palette: ["#f5f7ff", "#8389a7", "#252047"]
  },
  {
    id: "sam",
    name: "Sam Ivers",
    role: "Workplace",
    roomId: "terrace",
    presenceGroup: "space",
    status: "Away",
    signal: "away",
    planX: 382,
    planY: 574,
    palette: ["#f5f7ff", "#208cdf", "#66567e"]
  },
  {
    id: "emily",
    name: "Emily Stone",
    role: "Brand",
    roomId: "river",
    presenceGroup: "elsewhere",
    planX: 338,
    planY: 152,
    palette: ["#eef1ff", "#a3a8bf", "#3a0ca3"]
  },
  {
    id: "marcus",
    name: "Marcus Lee",
    role: "Data",
    roomId: "river",
    presenceGroup: "elsewhere",
    status: "Guest",
    signal: "guest",
    planX: 456,
    planY: 58,
    palette: ["#f5f7ff", "#49b6e9", "#5f527c"]
  },
  {
    id: "priya",
    name: "Priya Shah",
    role: "Design systems",
    roomId: "product",
    presenceGroup: "space",
    experienceMode: "2d",
    planX: 682,
    planY: 344,
    palette: ["#eef1ff", "#9985f6", "#0b63d8"]
  },
  {
    id: "omar",
    name: "Omar Reed",
    role: "Finance",
    roomId: "cafe",
    presenceGroup: "space",
    status: "Private",
    signal: "private",
    planX: 176,
    planY: 350,
    palette: ["#f7f8ff", "#8389a7", "#061a35"]
  },
  {
    id: "lina",
    name: "Lina Park",
    role: "Support",
    roomId: "garden",
    presenceGroup: "space",
    planX: 178,
    planY: 476,
    palette: ["#f5f7ff", "#45b6e9", "#aeaef1"]
  },
  {
    id: "theo",
    name: "Theo Grant",
    role: "Engineering",
    roomId: "lab",
    presenceGroup: "elsewhere",
    status: "Away",
    signal: "away",
    planX: 820,
    planY: 350,
    palette: ["#eef1ff", "#a3a8bf", "#208cdf"]
  },
  {
    id: "zoe",
    name: "Zoe Walsh",
    role: "QA",
    roomId: "demo",
    presenceGroup: "elsewhere",
    planX: 646,
    planY: 574,
    palette: ["#f5f7ff", "#7f86a9", "#5a11d8"]
  },
  {
    id: "ari",
    name: "Ari Blake",
    role: "People",
    roomId: "phone",
    presenceGroup: "elsewhere",
    planX: 650,
    planY: 234,
    palette: ["#eef1ff", "#aeaef1", "#061a35"]
  },
  {
    id: "nina",
    name: "Nina Frost",
    role: "Legal",
    roomId: "focus",
    presenceGroup: "elsewhere",
    status: "Guest",
    signal: "guest",
    experienceMode: "audio",
    planX: 346,
    planY: 234,
    palette: ["#f5f7ff", "#49b6e9", "#9985f6"]
  },
  {
    id: "cam",
    name: "Cam Davis",
    role: "Growth",
    roomId: "grove",
    presenceGroup: "elsewhere",
    status: "Private",
    signal: "private",
    planX: 284,
    planY: 576,
    palette: ["#eef1ff", "#8389a7", "#0b63d8"]
  },
  {
    id: "isla",
    name: "Isla Turner",
    role: "Content",
    roomId: "river",
    presenceGroup: "elsewhere",
    planX: 554,
    planY: 58,
    palette: ["#f7f8ff", "#a3a8bf", "#5f527c"]
  },
  {
    id: "kenji",
    name: "Kenji Mori",
    role: "Infrastructure",
    roomId: "workshop",
    presenceGroup: "space",
    status: "In conversation",
    signal: "conversation",
    experienceMode: "2d",
    planX: 548,
    planY: 574,
    palette: ["#eef1ff", "#208cdf", "#3a0ca3"]
  }
].map((person) => ({
  ...person,
  photo: PERSON_PHOTOS[person.id]
}));

const MAP_ZONE_D =
  "M637.29 147.258L637.29 278.441L502.148 434.504L419.593 434.504L269.185 329.896L269.185 278.441L227.907 318.022L59.9703 318.022L2.86036 278.441L2.86036 173.268L59.9703 133.121L216.599 133.121L269.185 202.671L269.185 125.205L353.436 2.50367L436.557 2.50367L637.29 147.258Z";
const MAP_ZONE_OUTLINE_D =
  "M217.096 132.122L217.396 132.518L268.185 199.69L268.185 124.895L268.36 124.639L352.612 1.9373L352.91 1.50371L436.88 1.5037L437.142 1.69218L637.875 146.446L638.29 146.746L638.29 278.813L638.046 279.095L502.904 435.158L502.605 435.504L419.279 435.504L419.022 435.325L268.614 330.718L268.185 330.419L268.185 280.786L228.6 318.744L228.31 319.022L59.6572 319.022L59.4004 318.844L2.29103 279.263L1.86036 278.965L1.86036 172.749L2.28516 172.45L59.3955 132.304L59.6543 132.122L217.096 132.122Z";

const ROOMS = [
  { id: "forum", name: "Meeting Room #1", response: "approved", open: false },
  { id: "call", name: "Pod #1", response: "empty", open: true },
  { id: "lab", name: "Meeting Room #2", response: "approved", open: true },
  { id: "cafe", name: "Meeting Room #3", response: "approved", open: true },
  { id: "product", name: "Meeting Room #4", response: "approved", open: true },
  { id: "river", name: "Meeting Room #5", response: "approved", open: true },
  { id: "harbor", name: "Pod #2", response: "empty", open: true },
  { id: "observatory", name: "Office #1", response: "approved", open: true },
  { id: "studio", name: "Office #2", response: "approved", open: true },
  { id: "workshop", name: "Office #3", response: "approved", open: true },
  { id: "terrace", name: "Office #4", response: "approved", open: true },
  { id: "grove", name: "Office #5", response: "approved", open: true },
  { id: "wellness", name: "Office #6", response: "empty", open: true },
  { id: "south-pod", name: "Pod #3", response: "empty", open: true },
  { id: "atlas", name: "Office #7", response: "denied", open: false },
  { id: "library", name: "Office #8", response: "approved", open: true },
  { id: "demo", name: "Office #9", response: "approved", open: true },
  { id: "focus", name: "Office #10", response: "approved", open: false },
  { id: "quiet", name: "Pod #4", response: "empty", open: true },
  { id: "west-pod", name: "Pod #5", response: "empty", open: true },
  { id: "north-booth", name: "Office #11", response: "empty", open: true },
  { id: "phone", name: "Office #12", response: "approved", open: true },
  { id: "huddle", name: "Meeting Room #6", response: "approved", open: true },
  { id: "garden", name: "Meeting Room #7", response: "approved", open: true },
  { id: "west-suite", name: "Meeting Room #8", response: "empty", open: true },
  { id: "southwest-suite", name: "Meeting Room #9", response: "empty", open: true },
  { id: "west-archive", name: "Office #13", response: "empty", open: true },
  { id: "northwest-suite", name: "Meeting Room #10", response: "empty", open: true },
  { id: "west-booth", name: "Office #14", response: "empty", open: true },
  { id: "southwest-booth", name: "Office #15", response: "empty", open: true },
  { id: "west-nook", name: "Office #16", response: "empty", open: true },
  { id: "southwest-nook", name: "Office #17", response: "empty", open: true },
  { id: "south-table-a", name: "Pod #6", response: "empty", open: true },
  { id: "north-table-a", name: "Pod #7", response: "empty", open: true },
  { id: "west-table-a", name: "Pod #8", response: "empty", open: true },
  { id: "south-table-b", name: "Pod #9", response: "empty", open: true },
  { id: "north-table-b", name: "Pod #10", response: "empty", open: true },
  { id: "west-table-b", name: "Pod #11", response: "empty", open: true }
];

const roomById = Object.fromEntries(ROOMS.map((room) => [room.id, room]));

const INCOMING_REQUESTS = {
  sol: { kind: "jump" },
  dana: { kind: "summon" }
};

function getIncomingRequest(personId) {
  return INCOMING_REQUESTS[personId] || null;
}

const CHAT_THREADS = {
  maya: {
    incoming: "I can review the deck once I wrap this call.",
    outgoing: "Perfect. I’ll keep the next pass tight."
  },
  noah: {
    incoming: "The River Studio mockups are on point.",
    outgoing: "Nice. Let me know if you want a second pair of eyes."
  },
  sol: {
  },
  dana: {
    incoming: "Can we align on the team notes before lunch?",
    incomingSecond: "Also, can you join me in the River room when you have a minute?"
  },
  eli: {
    incoming: "I’ve got an update from the support queue.",
    outgoing: "Great, send it my way."
  },
  ren: {
    incoming: "Let’s close the loop on the pricing follow-up.",
    outgoing: "On it, I’ll circle back with a summary."
  },
  jules: {
    incoming: "I’m free for a quick check-in if you are.",
    outgoing: "Perfect, I’m nearby and can jump in."
  },
  sam: {
    incoming: "We should revisit the workspace layout today.",
    outgoing: "Agreed, I have a few notes."
  },
  emily: {
    incoming: "Can you glance at the library naming flow?",
    outgoing: "Yep, I’m reviewing it now."
  },
  marcus: {
    incoming: "I’ve got a fresh read on the data trends.",
    outgoing: "That’s helpful, send over the highlights."
  },
  priya: {
    incoming: "The design system cleanup is almost done.",
    outgoing: "Great, let’s keep the polish moving."
  },
  omar: {
    incoming: "Finance wants the latest projection numbers.",
    outgoing: "I’ll share the updated sheet."
  },
  lina: {
    incoming: "Support has a question about onboarding.",
    outgoing: "I can take that one."
  },
  theo: {
    incoming: "Lab access is ready if you need it.",
    outgoing: "Awesome, I’ll head there after this."
  },
  zoe: {
    incoming: "QA found a tiny edge case in the demo.",
    outgoing: "Thanks, I’ll fix it before the review."
  },
  ari: {
    incoming: "People ops wants the latest office update.",
    outgoing: "I’ll coordinate with them."
  },
  nina: {
    incoming: "We should double-check the review notes.",
    outgoing: "I’m on it."
  },
  cam: {
    incoming: "Growth has a quick question about the roadmap.",
    outgoing: "Happy to jump on it."
  },
  isla: {
    incoming: "The studio asset review is ready.",
    outgoing: "Nice, I’ll take a look."
  },
  kenji: {
    incoming: "The deployment checklist is nearly clear.",
    outgoing: "Excellent, I’m ready for the handoff."
  }
};

const CHAT_THEMES = [
  {
    incoming: "rgba(255, 255, 255, 0.98)",
    outgoing: "rgba(229, 239, 255, 0.92)",
    panel: "rgba(255, 255, 255, 0.48)"
  },
  {
    incoming: "rgba(255, 255, 255, 0.98)",
    outgoing: "rgba(239, 243, 255, 0.96)",
    panel: "rgba(255, 255, 255, 0.48)"
  },
  {
    incoming: "rgba(255, 255, 255, 0.98)",
    outgoing: "rgba(236, 247, 255, 0.96)",
    panel: "rgba(255, 255, 255, 0.48)"
  },
  {
    incoming: "rgba(255, 255, 255, 0.98)",
    outgoing: "rgba(241, 244, 249, 0.96)",
    panel: "rgba(255, 255, 255, 0.48)"
  }
];

function getChatTheme(personId) {
  const hash = personId
    .split("")
    .reduce((value, char) => value + char.charCodeAt(0), 0);
  return CHAT_THEMES[hash % CHAT_THEMES.length];
}

function getChatThread(person) {
  return CHAT_THREADS[person.id] ?? {
    incoming: `I’m in ${roomById[person.roomId].name} if you need me.`,
    outgoing: "Sounds good, I’ll follow up shortly."
  };
}
const ROOM_SHAPES = {
  forum: {
    kind: "path",
    d: "M426.944 422.064C424.446 422.064 422.421 420.039 422.421 417.54L422.421 347.425L484.62 347.425L484.62 417.54C484.62 420.039 482.595 422.064 480.096 422.064L426.944 422.064Z"
  },
  call: {
    kind: "path",
    d: "M397.541 255.823C395.043 255.823 393.018 253.798 393.018 251.299L393.018 200.409C393.018 197.911 395.043 195.886 397.541 195.886L443.908 195.886C446.406 195.886 448.431 197.911 448.431 200.409L448.431 251.299C448.431 253.798 446.406 255.823 443.908 255.823L397.541 255.823Z"
  },
  lab: {
    kind: "rect",
    x: 520.808,
    y: 242.252,
    width: 32.7958,
    height: 110.827,
    transform: "rotate(-90 520.808 242.252)"
  },
  cafe: {
    kind: "rect",
    x: 201.897,
    y: 264.87,
    width: 33.9267,
    height: 117.613,
    transform: "rotate(-90 201.897 264.87)"
  },
  product: {
    kind: "path",
    d: "M563.782 310.106L563.782 242.252L631.636 242.252L631.636 276.179L602.798 310.106L563.782 310.106Z"
  },
  river: {
    kind: "path",
    d: "M359.091 90.7132L359.091 18.3362C359.091 15.8379 361.116 13.8127 363.614 13.8127L416.766 13.8127C419.265 13.8127 421.29 15.8379 421.29 18.3362L421.29 90.7132L359.091 90.7132Z"
  },
  harbor: {
    kind: "path",
    d: "M492.536 277.31L492.536 246.776C492.536 244.278 494.561 242.253 497.06 242.253L535.51 242.253L535.51 268.263C535.51 273.26 531.459 277.31 526.463 277.31L492.536 277.31Z"
  },
  observatory: {
    kind: "path",
    d: "M345.521 125.771L345.521 99.7603C345.521 94.7637 349.571 90.7132 354.568 90.7132L388.494 90.7132L388.494 121.247C388.494 123.746 386.469 125.771 383.971 125.771L345.521 125.771Z"
  },
  studio: {
    kind: "path",
    d: "M524.2 139.341L493.666 139.341C491.168 139.341 489.143 137.316 489.143 134.818L489.143 96.3675L515.153 96.3675C520.15 96.3675 524.2 100.418 524.2 105.415L524.2 139.341Z"
  },
  workshop: {
    kind: "path",
    d: "M387.363 337.247L417.897 337.247C420.396 337.247 422.421 339.272 422.421 341.771L422.421 380.221L396.41 380.221C391.414 380.221 387.363 376.17 387.363 371.174L387.363 337.247Z"
  },
  terrace: {
    kind: "path",
    d: "M352.306 319.153L382.84 319.153C385.338 319.153 387.363 321.178 387.363 323.676L387.363 362.127L361.353 362.127C356.356 362.127 352.306 358.076 352.306 353.08L352.306 319.153Z"
  },
  grove: {
    kind: "path",
    d: "M319.51 264.87L319.51 299.928L286.714 299.928C281.717 299.928 277.667 295.877 277.667 290.881L277.667 264.87L319.51 264.87Z"
  },
  wellness: {
    kind: "path",
    d: "M319.51 195.886L319.51 230.944L277.667 230.944L277.667 204.933C277.667 199.937 281.717 195.886 286.714 195.886L319.51 195.886Z"
  },
  "south-pod": {
    kind: "path",
    d: "M319.51 299.928L347.782 299.928C350.28 299.928 352.306 301.953 352.306 304.451L352.306 342.902L328.557 342.902C323.56 342.902 319.51 338.851 319.51 333.854L319.51 299.928Z"
  },
  atlas: {
    kind: "path",
    d: "M489.143 118.985L458.609 118.985C456.11 118.985 454.085 116.96 454.085 114.462L454.085 76.0116L480.095 76.0116C485.092 76.0116 489.143 80.0621 489.143 85.0587L489.143 118.985Z"
  },
  library: {
    kind: "path",
    d: "M454.086 99.7603L421.29 99.7603L421.29 56.7865L445.039 56.7865C450.035 56.7865 454.086 60.837 454.086 65.8336L454.086 99.7603Z"
  },
  demo: {
    kind: "path",
    d: "M473.311 312.367L473.311 281.833C473.311 279.335 475.336 277.31 477.834 277.31L516.284 277.31L516.284 303.32C516.284 308.317 512.234 312.367 507.237 312.367L473.311 312.367Z"
  },
  focus: {
    kind: "path",
    d: "M326.295 160.828L326.295 134.818C326.295 129.821 330.345 125.771 335.342 125.771L369.269 125.771L369.269 156.305C369.269 158.803 367.243 160.828 364.745 160.828L326.295 160.828Z"
  },
  quiet: {
    kind: "path",
    d: "M455.217 347.425L455.217 316.891C455.217 314.393 457.242 312.368 459.74 312.368L498.191 312.368L498.191 338.378C498.191 343.375 494.14 347.425 489.144 347.425L455.217 347.425Z"
  },
  "west-pod": {
    kind: "path",
    d: "M308.2 195.886L308.2 169.876C308.2 164.879 312.251 160.828 317.247 160.828L351.174 160.828L351.174 191.362C351.174 193.861 349.149 195.886 346.65 195.886L308.2 195.886Z"
  },
  "north-booth": {
    kind: "rect",
    x: 521.938,
    y: 209.457,
    width: 35.0576,
    height: 42.9738,
    transform: "rotate(-90 521.938 209.457)"
  },
  phone: {
    kind: "path",
    d: "M521.938 174.399L521.938 139.341L560.389 139.341C562.887 139.341 564.912 141.367 564.912 143.865L564.912 174.399L521.938 174.399Z"
  },
  huddle: {
    kind: "path",
    d: "M201.897 230.943L201.897 190.231L243.74 190.231C248.737 190.231 252.788 194.282 252.788 199.278L252.788 230.943L201.897 230.943Z"
  },
  garden: {
    kind: "path",
    d: "M88 190L88 265L46 265C41.0295 265 37 260.971 37 256L37 199C37 194.029 41.0295 190 46 190L88 190Z"
  },
  "west-suite": {
    kind: "path",
    d: "M170.232 190.232L170.232 154.043L204.159 154.043C209.156 154.043 213.206 158.094 213.206 163.09L213.206 190.232L170.232 190.232Z"
  },
  "southwest-suite": {
    kind: "path",
    d: "M170.232 301.059L170.232 264.87L213.206 264.87L213.206 292.012C213.206 297.008 209.156 301.059 204.159 301.059L170.232 301.059Z"
  },
  "west-archive": {
    kind: "path",
    d: "M62.7971 301.059C57.8005 301.059 53.75 297.008 53.75 292.012L53.75 264.87L96.7238 264.87L96.7238 301.059L62.7971 301.059Z"
  },
  "northwest-suite": {
    kind: "path",
    d: "M62.7971 154C57.8005 154 53.75 158.051 53.75 163.047L53.75 190.189L96.7238 190.189L96.7238 154L62.7971 154Z"
  },
  "west-booth": {
    kind: "path",
    d: "M134.044 190.232L134.044 146.127L161.185 146.127C166.182 146.127 170.232 150.177 170.232 155.174L170.232 190.232L134.044 190.232Z"
  },
  "southwest-booth": {
    kind: "path",
    d: "M134.044 308.975L134.044 264.87L170.232 264.87L170.232 299.928C170.232 304.924 166.182 308.975 161.185 308.975L134.044 308.975Z"
  },
  "west-nook": {
    kind: "path",
    d: "M96.7246 190.232L96.7246 155.174C96.7246 150.177 100.775 146.127 105.772 146.127L134.044 146.127L134.044 190.232L96.7246 190.232Z"
  },
  "southwest-nook": {
    kind: "path",
    d: "M105.772 308.975C100.775 308.975 96.7246 304.924 96.7246 299.928L96.7246 264.87L134.044 264.87L134.044 308.975L105.772 308.975Z"
  },
  "south-table-a": {
    kind: "circle",
    cx: 402.63,
    cy: 282.964,
    r: 15.6479
  },
  "north-table-a": {
    kind: "circle",
    cx: 402.63,
    cy: 166.004,
    r: 15.6479
  },
  "west-table-a": {
    kind: "circle",
    cx: 127.375,
    cy: 227.072,
    r: 15.6479
  },
  "south-table-b": {
    kind: "circle",
    cx: 439.642,
    cy: 282.964,
    r: 15.6479
  },
  "north-table-b": {
    kind: "circle",
    cx: 439.642,
    cy: 166.004,
    r: 15.6479
  },
  "west-table-b": {
    kind: "circle",
    cx: 168.308,
    cy: 227.072,
    r: 15.6479
  }
};

function getShapeBounds(shape) {
  if (!shape) return { minX: 0, minY: 0, maxX: 0, maxY: 0 };

  if (shape.kind === "circle") {
    return {
      minX: shape.cx - shape.r,
      minY: shape.cy - shape.r,
      maxX: shape.cx + shape.r,
      maxY: shape.cy + shape.r
    };
  }

  if (shape.kind === "rect") {
    const points = [
      [shape.x, shape.y],
      [shape.x + shape.width, shape.y],
      [shape.x, shape.y + shape.height],
      [shape.x + shape.width, shape.y + shape.height]
    ];

    if (shape.transform?.startsWith("rotate(")) {
      const match = shape.transform.match(/rotate\(([^ ]+) ([^ ]+) ([^ )]+)\)/);
      if (match) {
        const [, angle, centerX, centerY] = match;
        const radians = (Number(angle) * Math.PI) / 180;
        const pivotX = Number(centerX);
        const pivotY = Number(centerY);
        const rotated = points.map(([x, y]) => {
          const dx = x - pivotX;
          const dy = y - pivotY;
          return [
            pivotX + dx * Math.cos(radians) - dy * Math.sin(radians),
            pivotY + dx * Math.sin(radians) + dy * Math.cos(radians)
          ];
        });
        return {
          minX: Math.min(...rotated.map(([x]) => x)),
          minY: Math.min(...rotated.map(([, y]) => y)),
          maxX: Math.max(...rotated.map(([x]) => x)),
          maxY: Math.max(...rotated.map(([, y]) => y))
        };
      }
    }

    return {
      minX: shape.x,
      minY: shape.y,
      maxX: shape.x + shape.width,
      maxY: shape.y + shape.height
    };
  }

  const numbers = (shape.d.match(/-?\d+(?:\.\d+)?/g) || []).map(Number);
  const xs = [];
  const ys = [];
  for (let index = 0; index < numbers.length; index += 2) {
    if (index + 1 >= numbers.length) break;
    xs.push(numbers[index]);
    ys.push(numbers[index + 1]);
  }

  return {
    minX: Math.min(...xs),
    minY: Math.min(...ys),
    maxX: Math.max(...xs),
    maxY: Math.max(...ys)
  };
}

function getShapeCenter(shape) {
  const bounds = getShapeBounds(shape);
  return {
    x: (bounds.minX + bounds.maxX) / 2,
    y: (bounds.minY + bounds.maxY) / 2
  };
}

function getRoomMarkerPosition(roomId, index, count) {
  const shape = ROOM_SHAPES[roomId];
  const bounds = getShapeBounds(shape);
  const center = getShapeCenter(shape);
  const width = bounds.maxX - bounds.minX;
  const height = bounds.maxY - bounds.minY;
  const spreadX = Math.max(8, Math.min(width * 0.15, 14));
  const spreadY = Math.max(7, Math.min(height * 0.15, 12));
  const roomSpreadX = Math.max(14, Math.min(width * 0.24, 22));
  const roomSpreadY = Math.max(12, Math.min(height * 0.24, 20));
  const horizontalRoom = width >= height * 1.15;

  if (count <= 1) {
    return center;
  }

  if (count === 2) {
    if (horizontalRoom) {
      return {
        x: center.x + (index === 0 ? -spreadX : spreadX),
        y: center.y
      };
    }

    return {
      x: center.x,
      y: center.y + (index === 0 ? -spreadY : spreadY)
    };
  }

  if (count >= 4) {
    if (count === 4) {
      const offsets = [
        { x: -roomSpreadX, y: -roomSpreadY * 0.75 },
        { x: roomSpreadX, y: -roomSpreadY * 0.75 },
        { x: -roomSpreadX, y: roomSpreadY * 0.75 },
        { x: roomSpreadX, y: roomSpreadY * 0.75 }
      ];
      const offset = offsets[index] || offsets[offsets.length - 1];
      return {
        x: center.x + offset.x,
        y: center.y + offset.y
      };
    }

    if (count === 5) {
      const offsets = [
        { x: 0, y: -roomSpreadY },
        { x: -roomSpreadX, y: -roomSpreadY * 0.2 },
        { x: roomSpreadX, y: -roomSpreadY * 0.2 },
        { x: -roomSpreadX * 0.72, y: roomSpreadY * 0.9 },
        { x: roomSpreadX * 0.72, y: roomSpreadY * 0.9 }
      ];
      const offset = offsets[index] || offsets[offsets.length - 1];
      return {
        x: center.x + offset.x,
        y: center.y + offset.y
      };
    }

    if (count === 6) {
      const offsets = [
        { x: 0, y: -roomSpreadY },
        { x: -roomSpreadX * 0.95, y: -roomSpreadY * 0.25 },
        { x: roomSpreadX * 0.95, y: -roomSpreadY * 0.25 },
        { x: -roomSpreadX * 0.95, y: roomSpreadY * 0.75 },
        { x: 0, y: roomSpreadY },
        { x: roomSpreadX * 0.95, y: roomSpreadY * 0.75 }
      ];
      const offset = offsets[index] || offsets[offsets.length - 1];
      return {
        x: center.x + offset.x,
        y: center.y + offset.y
      };
    }

    const radiusX = Math.max(16, Math.min(width * 0.22, 24));
    const radiusY = Math.max(12, Math.min(height * 0.18, 18));
    const angle = -Math.PI / 2 + (index / count) * Math.PI * 2;

    return {
      x: center.x + Math.cos(angle) * radiusX,
      y: center.y + Math.sin(angle) * radiusY
    };
  }

  const offsets = [
    { x: 0, y: -spreadY },
    { x: -spreadX, y: spreadY * 0.7 },
    { x: spreadX, y: spreadY * 0.7 }
  ];

  const offset = offsets[index] || offsets[offsets.length - 1];
  return {
    x: center.x + offset.x,
    y: center.y + offset.y
  };
}

function getPersonMarkerPosition(person, peopleByRoomSource = peopleByRoom) {
  const roomPeople = peopleByRoomSource[person.roomId] || [];
  const index = Math.max(
    0,
    roomPeople.findIndex((candidate) => candidate.id === person.id)
  );
  const count = roomPeople.length || 1;
  return getRoomMarkerPosition(person.roomId, index, count);
}

function getClusterMarkerPosition(roomId, placement = "center") {
  const shape = ROOM_SHAPES[roomId];
  const bounds = getShapeBounds(shape);
  const center = getShapeCenter(shape);
  const height = bounds.maxY - bounds.minY;
  const offsetY = Math.max(12, Math.min(height * 0.2, 18));

  if (placement === "above") {
    return { x: center.x, y: center.y - offsetY };
  }

  if (placement === "below") {
    return { x: center.x, y: center.y + offsetY };
  }

  return center;
}

const YOU_MARKER_POSITION = getShapeCenter(ROOM_SHAPES["south-pod"]);
const MAP_CLUSTER_THRESHOLD = 4;
const MAP_CLUSTER_BREAKPOINT = 1.4;

const peopleByRoom = ROOMS.reduce((acc, room) => {
  acc[room.id] = PEOPLE.filter((person) => person.roomId === room.id);
  return acc;
}, {});
const peopleByPresence = PEOPLE.reduce(
  (acc, person) => {
    const bucket = person.presenceGroup === "elsewhere" ? "elsewhere" : "space";
    acc[bucket].push(person);
    return acc;
  },
  { space: [], elsewhere: [] }
);

const SVG_WIDTH = 640;
const SVG_HEIGHT = 437;

function App() {
  const [surface, setSurface] = useState("people");
  const [expanded, setExpanded] = useState({ people: false, map: false });
  const [toasts, setToasts] = useState([]);
  const [mapFocusPersonId, setMapFocusPersonId] = useState(null);
  const [currentUserRoomId, setCurrentUserRoomId] = useState("south-pod");
  const jumpAttemptRef = useRef(0);
  const toastTimersRef = useRef(new globalThis.Map());

  function pushToast(message, tone = "clear") {
    toastTimersRef.current.forEach((timers) => {
      if (timers.close) window.clearTimeout(timers.close);
      if (timers.remove) window.clearTimeout(timers.remove);
    });
    toastTimersRef.current.clear();

    const id = crypto.randomUUID();
    setToasts([{ id, message, tone }]);
    const closeTimer = window.setTimeout(() => {
      setToasts((items) =>
        items.map((item) => (item.id === id ? { ...item, closing: true } : item))
      );
      const removeTimer = window.setTimeout(() => {
        setToasts((items) => items.filter((item) => item.id !== id));
        const timers = toastTimersRef.current.get(id);
        if (timers) {
          if (timers.close) window.clearTimeout(timers.close);
          if (timers.remove) window.clearTimeout(timers.remove);
          toastTimersRef.current.delete(id);
        }
      }, 260);

      toastTimersRef.current.set(id, { close: closeTimer, remove: removeTimer });
    }, 2850);

    toastTimersRef.current.set(id, { close: closeTimer, remove: null });
  }

  useEffect(() => {
    return () => {
      toastTimersRef.current.forEach((timers) => {
        if (timers.close) window.clearTimeout(timers.close);
        if (timers.remove) window.clearTimeout(timers.remove);
      });
      toastTimersRef.current.clear();
    };
  }, []);

  function toggleExpanded(kind) {
    setExpanded((state) => ({ ...state, [kind]: !state[kind] }));
  }

  function requestJump(person, onResult) {
    const attempt = jumpAttemptRef.current + 1;
    jumpAttemptRef.current = attempt;
    const room = roomById[person.roomId];
    const declined = attempt % 3 === 0;

    window.setTimeout(() => {
      if (declined) {
        onResult({ status: "declined", room });
        pushToast(`${person.name} declined your jump request`, "danger");
        return;
      }

      setCurrentUserRoomId(room.id);
      onResult({ status: "accepted", room });
      pushToast(`Jump accepted — you moved to ${room.name} with ${person.name}`, "success");
    }, 1400);
  }

  return (
    <main
      className="app-shell"
      style={{ "--office-backdrop": `url(${officeBackdrop})` }}
    >
      <SpatialBackdrop />

      {surface === "people" && (
        <PeopleSurface
          activeSurface={surface}
          expanded={false}
          onSurfaceChange={setSurface}
          onToggleExpanded={() => toggleExpanded("people")}
          onOpenMapForPerson={(personId) => {
            setMapFocusPersonId(personId);
            setSurface("map");
          }}
          onJumpRequest={requestJump}
        />
      )}

      {surface === "map" && (
        <MapSurface
          activeSurface={surface}
          expanded={expanded.map}
          onSurfaceChange={setSurface}
          onToggleExpanded={() => toggleExpanded("map")}
          currentUserRoomId={currentUserRoomId}
          focusPersonId={mapFocusPersonId}
          onFocusPersonHandled={() => setMapFocusPersonId(null)}
          onMoveToRoom={(room, message) => {
            setCurrentUserRoomId(room.id);
            pushToast(message, "success");
          }}
          pushToast={pushToast}
          onJumpRequest={requestJump}
        />
      )}

      {!surface && <DockHint />}
      <ToastStack toasts={toasts} />
    </main>
  );
}

function SpatialBackdrop() {
  return (
    <div className="spatial-backdrop" aria-hidden="true">
      <div className="office-photo" />
      <video
        className="office-video"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      >
        <source src={officeBackdropVideo} type="video/mp4" />
      </video>
      <div className="office-soften" />
    </div>
  );
}

function DockHint() {
  return (
    <section className="ambient-state glass" aria-label="Current room">
      <div className="ambient-avatar-stack">
        {PEOPLE.slice(0, 4).map((person) => (
          <Avatar key={person.id} person={person} size="small" portrait />
        ))}
      </div>
      <strong>Presence stays spatial.</strong>
      <span>Open People or Map when you need a lightweight surface.</span>
    </section>
  );
}

function WindowFrame({
  kind,
  title,
  subtitle,
  activeSurface,
  expanded,
  onSurfaceChange,
  onToggleExpanded,
  extraControls,
  hideChrome = false,
  children
}) {
  return (
    <div className={`surface-window ${kind}-window ${expanded ? "expanded" : ""} ${hideChrome ? "no-window-chrome" : ""}`}>
      {!hideChrome && <div className="window-chrome">
        <div className="window-heading">
          <h1>{title}</h1>
        </div>
        <div className="window-tools">
          <SurfaceSwitcher activeSurface={activeSurface} onSurfaceChange={onSurfaceChange} />
          {extraControls && (
            <div className="window-controls">
              {extraControls}
            </div>
          )}
        </div>
      </div>}
      <div className="window-body">{children}</div>
    </div>
  );
}

function SurfaceSwitcher({ activeSurface, onSurfaceChange }) {
  return (
    <nav className="surface-switcher" role="tablist" aria-label="Essential Mode surfaces">
      <button
        className={activeSurface === "people" ? "active" : ""}
        type="button"
        role="tab"
        aria-selected={activeSurface === "people"}
        onClick={() => onSurfaceChange("people")}
      >
        <Users size={17} aria-hidden="true" />
        People ({PEOPLE.length})
      </button>
      <button
        className={activeSurface === "map" ? "active" : ""}
        type="button"
        role="tab"
        aria-selected={activeSurface === "map"}
        onClick={() => onSurfaceChange("map")}
      >
        <MapIcon size={17} aria-hidden="true" />
        Map
      </button>
    </nav>
  );
}

function isValidInviteEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function parseInviteCsv(text) {
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const rows = [];
  const errors = [];
  if (!lines.length) return { rows, errors: ["The CSV file is empty."] };

  const firstCells = lines[0].split(",").map((cell) => cell.trim().toLowerCase());
  const startsWithHeader = firstCells[0] === "email" && firstCells[1] === "role";
  const dataLines = startsWithHeader ? lines.slice(1) : lines;

  dataLines.forEach((line, index) => {
    const rowNumber = startsWithHeader ? index + 2 : index + 1;
    const [email = "", role = "", ...extra] = line.split(",").map((cell) => cell.trim());
    const rowErrors = [];
    if (!email || !isValidInviteEmail(email)) rowErrors.push("Enter a valid email address.");
    if (!USER_ROLES.includes(role)) rowErrors.push(`Role must be ${USER_ROLES.join(", ")}.`);
    if (extra.length) rowErrors.push("Use one email and one role per row.");
    if (rowErrors.length) errors.push(`Row ${rowNumber}: ${rowErrors.join(" ")}`);
    else rows.push({ email: email.toLowerCase(), role });
  });

  const seen = new Set();
  const uniqueRows = rows.filter((row) => {
    if (seen.has(row.email)) {
      errors.push(`Duplicate email: ${row.email}.`);
      return false;
    }
    seen.add(row.email);
    return true;
  });
  return { rows: uniqueRows, errors };
}

function InviteUsersModal({ open, onClose, onInvite, embedded = false }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [manualInvitations, setManualInvitations] = useState([]);
  const [csvInvitations, setCsvInvitations] = useState([]);
  const [csvFileName, setCsvFileName] = useState("");
  const [csvErrors, setCsvErrors] = useState([]);
  const [emailAutomatically, setEmailAutomatically] = useState(true);
  const [status, setStatus] = useState("idle");
  const [formError, setFormError] = useState("");
  const dialogRef = useRef(null);
  const fileInputRef = useRef(null);

  const invitations = useMemo(
    () => [...manualInvitations, ...csvInvitations],
    [manualInvitations, csvInvitations]
  );
  const invitationEmails = useMemo(
    () => new Set(invitations.map((invitation) => invitation.email)),
    [invitations]
  );

  useEffect(() => {
    if (!open) return undefined;
    dialogRef.current?.focus();
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && status !== "submitting") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose, status]);

  useEffect(() => {
    if (!open) {
      setEmail("");
      setRole("");
      setManualInvitations([]);
      setCsvInvitations([]);
      setCsvFileName("");
      setCsvErrors([]);
      setStatus("idle");
      setFormError("");
    }
  }, [open]);

  if (!open) return null;

  function addManualUser(event) {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    if (!isValidInviteEmail(normalizedEmail) || !USER_ROLES.includes(role)) return;
    if (invitationEmails.has(normalizedEmail)) {
      setFormError("That email address is already in the invitation list.");
      return;
    }
    setManualInvitations((current) => [...current, { email: normalizedEmail, role }]);
    setEmail("");
    setRole("");
    setFormError("");
  }

  function handleCsvFile(file) {
    if (!file) return;
    setCsvFileName(file.name);
    setCsvInvitations([]);
    setCsvErrors([]);
    if (!file.name.toLowerCase().endsWith(".csv")) {
      setCsvErrors(["Please select a .csv file."]);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const parsed = parseInviteCsv(String(reader.result || ""));
      const duplicateErrors = parsed.rows
        .filter((row) => invitationEmails.has(row.email))
        .map((row) => `Duplicate email: ${row.email}.`);
      setCsvInvitations(parsed.rows.filter((row) => !invitationEmails.has(row.email)));
      setCsvErrors([...parsed.errors, ...duplicateErrors]);
    };
    reader.onerror = () => setCsvErrors(["The CSV file could not be read."]);
    reader.readAsText(file);
  }

  function downloadTemplate() {
    const blob = new Blob([`email,role\njohndoe@example.com,Team Member\n`], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "invite-users-template.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  function submitInvitations(event) {
    event.preventDefault();
    if (!invitations.length || csvErrors.length || status === "submitting") return;
    setStatus("submitting");
    setFormError("");
    window.setTimeout(() => {
      try {
        onInvite(invitations, { emailAutomatically });
        setStatus("success");
        window.setTimeout(onClose, 700);
      } catch {
        setStatus("error");
        setFormError("The invitations could not be added. Please try again.");
      }
    }, 350);
  }

  const canAddManualUser = isValidInviteEmail(email) && USER_ROLES.includes(role);
  const canSubmit = invitations.length > 0 && csvErrors.length === 0 && status !== "submitting";
  const submitLabel = invitations.length > 1 ? "Add Users" : "Add User";

  const modalContent = (
      <form
        ref={dialogRef}
        className={`invite-modal ${embedded ? "invite-modal-embedded" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="invite-users-title"
        tabIndex="-1"
        onSubmit={submitInvitations}
        onPointerDown={(event) => event.stopPropagation()}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="window-chrome invite-modal-header">
          <div className="window-heading"><h1 id="invite-users-title">Invite Users</h1></div>
          <button className="invite-modal-back" type="button" aria-label="Back to Users" onClick={onClose} disabled={status === "submitting"}>
            <ArrowLeft size={15} aria-hidden="true" />
            <span>Back to Users</span>
          </button>
        </header>

        <section className="invite-modal-section invite-modal-manual" aria-labelledby="manual-invite-heading">
          <h3 id="manual-invite-heading" className="sr-only">Add a user</h3>
          <div className="invite-modal-fields">
            <label>
              <span>Email address</span>
              <input
                type="email"
                name="invite-user-email"
                autoComplete="off"
                data-lpignore="true"
                data-1p-ignore="true"
                spellCheck="false"
                value={email}
                onChange={(event) => { setEmail(event.target.value); setFormError(""); }}
                placeholder="name@example.com"
              />
            </label>
            <label>
              <span>Assigned role</span>
              <select
                className={role ? "has-value" : ""}
                value={role}
                onChange={(event) => setRole(event.target.value)}
                aria-label="Assigned role"
              >
                <option value="">Select a role</option>
                {USER_ROLES.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
            </label>
          </div>
          <button className="invite-modal-secondary-action" type="button" onClick={addManualUser} disabled={!canAddManualUser}>
            <UserPlus size={16} aria-hidden="true" /> Add User
          </button>
          {formError && <p className="invite-modal-error" role="alert"><AlertCircle size={15} aria-hidden="true" />{formError}</p>}
        </section>

        <section className="invite-modal-section invite-modal-bulk" aria-labelledby="bulk-invite-heading">
          <div className="invite-modal-section-heading">
            <h3 id="bulk-invite-heading">Invite by CSV</h3>
            <button className="invite-modal-link" type="button" onClick={downloadTemplate}><Download size={14} aria-hidden="true" /> Download template</button>
          </div>
          <p className="invite-modal-copy">Upload a CSV with an email address and assigned role on each row.</p>
          <div className="invite-modal-example" aria-label="CSV example rows">
            <strong>Example</strong>
            <code>johndoe@example.com, Team Member</code>
            <code>janedoe@example.com, Office Administrator</code>
          </div>
          <div
            className="invite-modal-upload"
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => { event.preventDefault(); handleCsvFile(event.dataTransfer.files?.[0]); }}
          >
            <FileUp size={20} aria-hidden="true" />
            <div><strong>{csvFileName || "Choose a CSV file"}</strong><span>or drag and drop it here</span></div>
            <input ref={fileInputRef} type="file" accept=".csv,text/csv" onChange={(event) => handleCsvFile(event.target.files?.[0])} aria-label="Upload CSV file" />
            <button type="button" onClick={() => fileInputRef.current?.click()}>Browse</button>
          </div>
          {csvErrors.length > 0 && <div className="invite-modal-errors" role="alert" aria-label="CSV validation errors">{csvErrors.map((error, index) => <p key={`${error}-${index}`}><AlertCircle size={14} aria-hidden="true" />{error}</p>)}</div>}
        </section>

        {invitations.length > 0 && <ul className="invite-modal-list" aria-label="Users to invite">{invitations.map((invitation) => <li key={`${invitation.email}-${invitation.role}`}><span>{invitation.email}</span><small>{invitation.role}</small></li>)}</ul>}

        <div className="invite-modal-preferences">
          <label className="invite-modal-checkbox"><input type="checkbox" checked={emailAutomatically} onChange={(event) => setEmailAutomatically(event.target.checked)} /><span><strong>Email new users automatically</strong><small>Send an invitation email as soon as each user is added.</small></span></label>
          <p className="invite-modal-billing"><strong>${BILLING_CONFIG.monthlyUserPrice}/user monthly</strong><span>Added users are prorated for the active billing cycle.</span></p>
        </div>

        <footer className="invite-modal-footer">
          {status === "success" && <p className="invite-modal-success" role="status"><CheckCircle2 size={16} aria-hidden="true" /> Users added successfully.</p>}
          {status === "error" && <p className="invite-modal-error" role="alert"><AlertCircle size={15} aria-hidden="true" />{formError}</p>}
          <button className="invite-modal-primary-action" type="submit" disabled={!canSubmit}>{status === "submitting" ? <><LoaderCircle size={16} className="invite-modal-spinner" aria-hidden="true" /> Adding...</> : submitLabel}</button>
        </footer>
      </form>
  );

  if (embedded) return modalContent;

  return createPortal(
    <div className="invite-modal-backdrop" role="presentation" onClick={(event) => event.target === event.currentTarget && onClose()}>
      {modalContent}
    </div>,
    document.body
  );
}

function PeopleSurface({
  activeSurface,
  expanded,
  onSurfaceChange,
  onToggleExpanded,
  onOpenMapForPerson,
  onJumpRequest
}) {
  const [query, setQuery] = useState("");
  const [statusFilters, setStatusFilters] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [addedPeople, setAddedPeople] = useState([]);
  const [chatPersonId, setChatPersonId] = useState(null);
  const [chatClosing, setChatClosing] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState({
    space: false,
    elsewhere: false
  });
  const [chatRequests, setChatRequests] = useState({});
  const closeChatTimer = useRef(null);

  const people = useMemo(() => [...PEOPLE, ...addedPeople], [addedPeople]);

  const filteredPeople = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return people.filter((person) => {
      const matchesName = !normalized || person.name.toLowerCase().includes(normalized);
      const matchesStatus =
        statusFilters.length === 0 || statusFilters.includes(person.status);
      return matchesName && matchesStatus;
    });
  }, [people, query, statusFilters]);

  const statusOptions = useMemo(
    () => [...new Set(people.map((person) => person.status).filter(Boolean))],
    [people]
  );

  const chatPerson = people.find((person) => person.id === chatPersonId);

  function addUsers(invitations) {
    setAddedPeople((current) => [
      ...current,
      ...invitations.map(({ email, role }) => ({
        id: `user-${crypto.randomUUID()}`,
        name: email.split("@")[0].replace(/[._-]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase()),
        role,
        roomId: "south-pod",
        presenceGroup: "space",
        status: "Available",
        palette: ["#eef1ff", "#8c9ee8", "#3f5fc4"]
      }))
    ]);
    setAddUserOpen(false);
  }

  function openChat(personId) {
    if (closeChatTimer.current) {
      window.clearTimeout(closeChatTimer.current);
      closeChatTimer.current = null;
    }
    setChatClosing(false);
    setChatPersonId(personId);
  }

  function closeChat() {
    setChatClosing(true);
    closeChatTimer.current = window.setTimeout(() => {
      setChatPersonId(null);
      setChatClosing(false);
      closeChatTimer.current = null;
    }, 300);
  }

  function addRequestMessage(person, kind) {
    const id = crypto.randomUUID();
    const room = roomById[person.roomId];
    const copy =
      kind === "jump"
        ? `Request: Can I jump to you in ${room.name}?`
        : "Request: Can you come to my location?";

    setChatRequests((state) => ({
      ...state,
      [person.id]: [
        ...(state[person.id] || []),
        {
          id,
          kind,
          text: copy,
          status: "pending"
        }
      ]
    }));

    if (kind === "jump") {
      onJumpRequest?.(person, (result) => {
        setChatRequests((state) => ({
          ...state,
          [person.id]: (state[person.id] || []).map((message) =>
            message.id === id
              ? { ...message, status: result.status, roomName: result.room.name }
              : message
          )
        }));
      });
    }
  }

  function handleJump(person) {
    openChat(person.id);
    addRequestMessage(person, "jump");
  }

  function handleSummon(person) {
    openChat(person.id);
    addRequestMessage(person, "summon");
  }

  return (
    <section
      className={`surface people-surface ${expanded ? "expanded" : ""} ${
        chatPerson ? "chat-open" : ""
      } ${chatClosing ? "chat-closing" : ""}`}
      aria-label="People menu"
    >
      <WindowFrame
        kind="people"
        title="Users"
        subtitle=""
        activeSurface={activeSurface}
        expanded={expanded}
        onSurfaceChange={onSurfaceChange}
        onToggleExpanded={onToggleExpanded}
        hideChrome={addUserOpen}
      >
        <div
          className={`people-content ${addUserOpen ? "invite-users-open" : ""} ${expanded ? "expanded" : ""} ${
            chatPerson ? "with-chat" : ""
          }`}
        >
          <div className="people-list-area">
            <div className="people-search-toolbar">
              <label className="search-field">
                <Search size={18} aria-hidden="true" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search people"
                  aria-label="Search people by name"
                />
              </label>

              <button
                className="add-user-button"
                type="button"
                title="Add user"
                aria-label="Add user"
                onClick={() => setAddUserOpen((open) => !open)}
                aria-expanded={addUserOpen}
              >
                <UserPlus size={16} aria-hidden="true" />
              </button>

              <div className="status-filter">
                <button
                  className={`filter-button ${filterOpen || statusFilters.length ? "active" : ""}`}
                  type="button"
                  title="Filter by status"
                  aria-label="Filter by status"
                  aria-haspopup="true"
                  aria-expanded={filterOpen}
                  onClick={() => setFilterOpen((open) => !open)}
                >
                  <SlidersHorizontal size={16} aria-hidden="true" />
                  {statusFilters.length > 0 && (
                    <span className="filter-count">{statusFilters.length}</span>
                  )}
                </button>

                {filterOpen && (
                  <div className="status-filter-menu" role="menu" aria-label="Filter by status">
                    <div className="status-filter-heading">Status</div>
                    {statusOptions.map((status) => {
                      const selected = statusFilters.includes(status);
                      return (
                        <button
                          key={status}
                          className={`status-filter-option ${selected ? "selected" : ""}`}
                          type="button"
                          role="menuitemcheckbox"
                          aria-checked={selected}
                          onClick={() =>
                            setStatusFilters((current) =>
                              selected
                                ? current.filter((value) => value !== status)
                                : [...current, status]
                            )
                          }
                        >
                          <span className="status-filter-check" aria-hidden="true">
                            {selected ? "✓" : ""}
                          </span>
                          <span
                            className={`status-filter-badge ${
                              status === "In conversation"
                                ? "conversation"
                                : status.toLowerCase()
                            }`}
                          >
                            {status}
                          </span>
                        </button>
                      );
                    })}
                    {statusFilters.length > 0 && (
                      <button
                        className="status-filter-clear"
                        type="button"
                        onClick={() => setStatusFilters([])}
                      >
                        Clear filters
                      </button>
                    )}
                  </div>
                )}
              </div>

              {false && addUserOpen && (
                <div className="invite-users-backdrop" role="presentation" onClick={() => setAddUserOpen(false)}>
                  <form className="invite-users-modal" role="dialog" aria-modal="true" aria-labelledby="people-invite-users-title" onSubmit={addUser} onClick={(event) => event.stopPropagation()}>
                    <button className="invite-users-close" type="button" aria-label="Close invite users" onClick={() => setAddUserOpen(false)}>×</button>
                    <div className="invite-users-heading"><UserPlus size={25} aria-hidden="true" /><h2 id="people-invite-users-title">Invite Users</h2></div>
                    <div className="invite-users-fields">
                      <label><span>Email</span><div className="invite-input-wrap"><Mail size={18} aria-hidden="true" /><input autoFocus type="email" value={newUserName} onChange={(event) => setNewUserName(event.target.value)} placeholder="Email" /></div></label>
                      <label><span>Assigned role</span><select value={newUserRole} onChange={(event) => setNewUserRole(event.target.value)}><option value="">Select a Role</option><option>Team Member</option><option>Office Administrator</option><option>Guest</option></select></label>
                    </div>
                    <button className="invite-add-row" type="submit" disabled={!newUserName.trim()}><UserPlus size={21} aria-hidden="true" /> ADD USER</button>
                    <div className="invite-divider" />
                    <p className="invite-copy">Inviting a large group? Simplify the process by uploading a CSV file with user emails and their assigned roles.</p>
                    <p className="invite-example"><strong>For example:</strong><br /><u>johndoe@example.com</u>, Team Member<br /><u>janedoe@example.com</u>, Office Administrator</p>
                    <span className="invite-section-label">File uploader</span>
                    <label className="invite-upload"><input type="file" accept=".csv,text/csv" onChange={(event) => setCsvFileName(event.target.files?.[0]?.name || "")} /><span className="invite-upload-icon">↑</span><span>{csvFileName || <>Upload a <strong>CSV file</strong></>}</span></label>
                    <button className="invite-template-link" type="button">↧ Download our CSV template file</button>
                    <label className="invite-checkbox"><input type="checkbox" checked={emailAutomatically} onChange={(event) => setEmailAutomatically(event.target.checked)} /><span>Email new users automatically</span><small>?</small></label>
                    <button className="invite-submit" type="submit" disabled={!newUserName.trim()}>ADD USER</button>
                    <p className="invite-billing">$15 per user / per month. Users added during an active billing cycle will be pro-rated in the next billing cycle.</p>
                  </form>
                </div>
              )}
            </div>

            <div className="people-sections">
              <PeopleRosterSection
                title="Everyone in the space"
                count={filteredPeople.filter((person) => (person.presenceGroup || "space") === "space").length}
                people={filteredPeople.filter((person) => (person.presenceGroup || "space") === "space")}
                collapsed={collapsedSections.space}
                onToggleCollapsed={() =>
                  setCollapsedSections((current) => ({ ...current, space: !current.space }))
                }
                chatPersonId={chatPersonId}
                onChat={openChat}
              />

              <PeopleRosterSection
                title="Online elsewhere"
                count={filteredPeople.filter((person) => person.presenceGroup === "elsewhere").length}
                people={filteredPeople.filter((person) => person.presenceGroup === "elsewhere")}
                collapsed={collapsedSections.elsewhere}
                onToggleCollapsed={() =>
                  setCollapsedSections((current) => ({
                    ...current,
                    elsewhere: !current.elsewhere
                  }))
                }
                chatPersonId={chatPersonId}
                onChat={openChat}
              />
            </div>
          </div>

          {chatPerson && (
            <ChatPanel
              person={chatPerson}
              requestMessages={chatRequests[chatPerson.id] || []}
              closing={chatClosing}
              onClose={closeChat}
              onJump={() => handleJump(chatPerson)}
              onSummon={() => handleSummon(chatPerson)}
              onMap={() => onOpenMapForPerson(chatPerson.id)}
            />
          )}
        </div>
        {addUserOpen && <InviteUsersModal embedded open onClose={() => setAddUserOpen(false)} onInvite={addUsers} />}
      </WindowFrame>
    </section>
  );
}

function PersonRow({
  person,
  active,
  onChat
}) {
  const incomingRequest = getIncomingRequest(person.id);
  const unreadItemCount = (person.unreadCount || 0) + (incomingRequest ? 1 : 0);

  return (
    <article
      className={`person-row ${active ? "active" : ""}`}
      aria-current={active}
      role="button"
      tabIndex="0"
      onClick={onChat}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onChat();
        }
      }}
    >
      <div className="person-hit">
        <Avatar person={person} size="small" portrait />
        <span className="person-copy">
          <span className="person-line">
            <strong>{person.name}</strong>
          </span>
        </span>
        {person.status && <Presence signal={person.signal} label={person.status} />}
        {unreadItemCount ? (
          <span
            className={`unread-badge ${incomingRequest ? "has-action" : ""}`}
            aria-label={`${unreadItemCount} unread items${incomingRequest ? ", including an action required" : ""}`}
          >
            {unreadItemCount}
          </span>
        ) : null}
      </div>

    </article>
  );
}

function PeopleRosterSection({
  title,
  count,
  people,
  collapsed,
  onToggleCollapsed,
  chatPersonId,
  onChat
}) {
  if (!people.length) return null;

  return (
    <section
      className={`people-section ${collapsed ? "collapsed" : ""}`}
      aria-label={title}
    >
      <button
        className="people-section-heading"
        type="button"
        aria-expanded={!collapsed}
        onClick={onToggleCollapsed}
      >
        <h2 className="people-section-title">{`${title} (${count})`}</h2>
        <span className="people-section-state">{collapsed ? "Show" : "Hide"}</span>
      </button>
      {!collapsed && (
        <div className="roster" aria-label={title}>
          {people.map((person) => (
            <PersonRow
              key={person.id}
              person={person}
              active={person.id === chatPersonId}
              onChat={() => onChat(person.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function ChatPanel({ person, requestMessages, closing, onClose, onJump, onSummon, onMap }) {
  const thread = getChatThread(person);
  const theme = getChatTheme(person.id);
  const incomingRequest = getIncomingRequest(person.id);
  const [incomingRequestState, setIncomingRequestState] = useState("pending");
  const incomingTime = person.id.charCodeAt(0) % 2 === 0 ? "10:42 AM" : "10:38 AM";
  const outgoingTime = person.id.charCodeAt(person.id.length - 1) % 2 === 0 ? "10:44 AM" : "10:41 AM";

  useEffect(() => {
    setIncomingRequestState("pending");
  }, [person.id]);

  return (
    <aside
      className={`chat-panel ${closing ? "closing" : ""}`}
      aria-label={`Chat with ${person.name}`}
      style={{
        "--chat-incoming-bg": theme.incoming,
        "--chat-outgoing-bg": theme.outgoing,
        "--chat-panel-bg": theme.panel
      }}
    >
      <div className="chat-heading">
        <div className="chat-heading-copy">
          <div className="chat-title-row">
            <Avatar person={person} size="tiny" portrait />
            <strong>{person.name}</strong>
            <div className="chat-heading-actions" aria-label={`Actions for ${person.name}`}>
              <ActionButton label="Jump to" onClick={onJump}>
                <Rocket size={16} />
              </ActionButton>
              <ActionButton label="Summon" onClick={onSummon}>
                <BellRing size={16} />
              </ActionButton>
              <ActionButton label="Map" onClick={onMap}>
                <MapIcon size={16} />
              </ActionButton>
            </div>
          </div>
        </div>
        <IconButton label="Close chat" onClick={onClose}>
          <X size={18} />
        </IconButton>
      </div>

      <div className="chat-thread">
        {thread.incoming && (
          <div className="message-group incoming">
            <div className="message-meta">{person.name} · {incomingTime}</div>
            <p className="message incoming">{thread.incoming}</p>
          </div>
        )}
        {thread.incomingSecond && (
          <div className="message-group incoming">
            <div className="message-meta">{person.name} · 10:47 AM</div>
            <p className="message incoming">{thread.incomingSecond}</p>
          </div>
        )}
        {thread.outgoing && (
          <div className="message-group outgoing">
            <div className="message-meta">You · {outgoingTime}</div>
            <p className="message outgoing">{thread.outgoing}</p>
          </div>
        )}
        {incomingRequest && (
          <IncomingRequestCard
            kind={incomingRequest.kind}
            person={person}
            state={incomingRequestState}
            onResolve={setIncomingRequestState}
          />
        )}
        {requestMessages.map((message) => (
          <div className={`request-toast ${message.status || "pending"}`} key={message.id} role="status">
            <span className="request-toast-icon" aria-hidden="true">
              {message.kind === "jump"
                ? message.status === "accepted" ? <Check size={16} /> : <Rocket size={16} />
                : <BellRing size={16} />}
            </span>
            <div className="request-toast-copy">
              <strong>
                {message.kind !== "jump"
                  ? "Summon request sent"
                  : message.status === "accepted"
                  ? "Jump request accepted"
                  : message.status === "declined"
                  ? "Jump request declined"
                  : "Jump request sent"}
              </strong>
              <span>
                {message.kind === "jump"
                  ? message.status === "accepted"
                    ? `You moved to ${message.roomName}.`
                    : message.status === "declined"
                    ? `${person.name} declined the request.`
                    : "Waiting for approval to move to their room."
                  : "Waiting for approval to bring them here."}
              </span>
            </div>
          </div>
        ))}
      </div>

      <label className="composer">
        <input placeholder={`Message ${person.name}`} />
        <button type="button" aria-label="Send message">
          <Send size={17} aria-hidden="true" />
        </button>
      </label>
    </aside>
  );
}

function IncomingRequestCard({ kind, person, state, onResolve }) {
  const isJump = kind === "jump";
  const isPending = state === "pending";

  return (
    <div className={`incoming-request-card ${kind} ${state}`} role="status">
      <div className="incoming-request-heading">
        <span className="incoming-request-icon" aria-hidden="true">
          {isJump ? <Rocket size={17} /> : <BellRing size={17} />}
        </span>
        <div>
          <strong>{isJump ? "Jump request" : "Summon request"}</strong>
          <span>
            {isPending
              ? isJump
                ? `${person.name} wants to jump to your location.`
                : `${person.name} wants you to join their room.`
              : state === "accepted"
              ? isJump
                ? `${person.name} can now join you.`
                : `You accepted ${person.name}'s summon.`
              : "Request declined."}
          </span>
        </div>
      </div>
      {isPending ? (
        <div className="incoming-request-actions">
          <button type="button" className="request-approve" onClick={() => onResolve("accepted")}>
            <Check size={14} /> Approve
          </button>
          <button type="button" className="request-decline" onClick={() => onResolve("declined")}>
            <X size={14} /> Decline
          </button>
        </div>
      ) : (
        <span className="incoming-request-result">{state === "accepted" ? "Approved" : "Declined"}</span>
      )}
    </div>
  );
}

function MapSurface({
  activeSurface,
  expanded,
  onSurfaceChange,
  onToggleExpanded,
  currentUserRoomId,
  focusPersonId,
  onFocusPersonHandled,
  onMoveToRoom,
  pushToast,
  onJumpRequest
}) {
  const [hoveredRoomId, setHoveredRoomId] = useState(null);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [focusedRoomId, setFocusedRoomId] = useState(null);
  const [requestStates, setRequestStates] = useState({});
  const [zoom, setZoom] = useState(1);
  const [mapQuery, setMapQuery] = useState("");
  const [selectedPersonId, setSelectedPersonId] = useState(null);
  const [chatPersonId, setChatPersonId] = useState(null);
  const [radarMode, setRadarMode] = useState(false);
  const [radarFocusPersonId, setRadarFocusPersonId] = useState(null);
  const [chatClosing, setChatClosing] = useState(false);
  const [chatRequests, setChatRequests] = useState({});
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserRole, setNewUserRole] = useState("");
  const [csvFileName, setCsvFileName] = useState("");
  const [emailAutomatically, setEmailAutomatically] = useState(true);
  const [addedPeople, setAddedPeople] = useState([]);
  const chatCloseTimer = useRef(null);
  const panStartRef = useRef(null);
  const ignoreStageClickRef = useRef(false);
  const planCanvasRef = useRef(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);

  const mapPeople = useMemo(() => [...PEOPLE, ...addedPeople], [addedPeople]);
  const peopleByRoomForMap = useMemo(
    () =>
      ROOMS.reduce((acc, room) => {
        acc[room.id] = mapPeople.filter((person) => person.roomId === room.id);
        return acc;
      }, {}),
    [mapPeople]
  );

  const hoveredRoom = ROOMS.find((room) => room.id === hoveredRoomId);
  const selectedRoom = ROOMS.find((room) => room.id === selectedRoomId);
  const radarBaseScale = 1.45;
  const mapBaseScale = radarMode ? radarBaseScale : 1;
  const effectiveZoom = zoom * mapBaseScale;
  const currentUserMarkerPosition = getShapeCenter(
    ROOM_SHAPES[currentUserRoomId] || ROOM_SHAPES["south-pod"]
  );
  const selectedRoomCenter = selectedRoom ? getShapeCenter(ROOM_SHAPES[selectedRoom.id]) : null;
  const roomDetailPlacement = selectedRoom && selectedRoomCenter
    ? {
        left: `${(Math.min(Math.max(selectedRoomCenter.x, 92), SVG_WIDTH - 92) / SVG_WIDTH) * 100}%`,
        top:
          selectedRoomCenter.y < SVG_HEIGHT * 0.38
            ? `${((selectedRoomCenter.y + 18) / SVG_HEIGHT) * 100}%`
            : `${((selectedRoomCenter.y - 20) / SVG_HEIGHT) * 100}%`,
        below: selectedRoomCenter.y < SVG_HEIGHT * 0.38
      }
    : null;
  const mapMatches = useMemo(() => {
    const normalized = mapQuery.trim().toLowerCase();
    if (!normalized) return mapPeople;
    return mapPeople.filter((person) => {
      const room = roomById[person.roomId];
      return `${person.name} ${room.name} ${person.status || ""}`
        .toLowerCase()
        .includes(normalized);
    });
  }, [mapPeople, mapQuery]);
  const matchingPersonIds = new Set(mapMatches.map((person) => person.id));
  const showMapPortraits = zoom >= 1;
  const isRadarTrackingPerson = radarMode && Boolean(radarFocusPersonId);
  const radarFocusPerson = isRadarTrackingPerson
    ? mapPeople.find((person) => person.id === radarFocusPersonId) || null
    : null;
  const personMarkerTargetScale = zoom <= 1 ? 1 : Math.min(1.12, 1 + (zoom - 1) * 0.25);
  const personMarkerScale = personMarkerTargetScale / effectiveZoom;
  const clusterRooms = zoom < MAP_CLUSTER_BREAKPOINT;
  const hasSelectedPerson = Boolean(selectedPersonId);
  const clusteredRoomIds = useMemo(
    () =>
      new Set(
        Object.entries(peopleByRoomForMap)
          .filter(([, people]) => clusterRooms && people.length >= MAP_CLUSTER_THRESHOLD)
          .map(([roomId]) => roomId)
      ),
    [clusterRooms]
  );
  const clusteredMapMarkers = useMemo(() => {
    const markers = [];

    for (const room of ROOMS) {
      const roomPeople = peopleByRoomForMap[room.id] || [];
      if (!clusteredRoomIds.has(room.id)) continue;
      if (isRadarTrackingPerson) continue;

      const selectedPerson =
        roomPeople.find((person) => person.id === selectedPersonId) || null;

      if (selectedPerson) {
        const otherPeople = roomPeople.filter((person) => person.id !== selectedPerson.id);
        if (otherPeople.length) {
          markers.push({
            type: "cluster",
            roomId: room.id,
            count: otherPeople.length,
            people: otherPeople,
            label: `+${otherPeople.length} people`,
            position: getClusterMarkerPosition(room.id, "below"),
            highlighted: true,
            dimmed: false
          });
        }
        continue;
      }

      const roomMatches = roomPeople.filter((person) => matchingPersonIds.has(person.id));
      const isHighlighted =
        focusedRoomId === room.id ||
        hoveredRoomId === room.id ||
        selectedRoomId === room.id ||
        roomMatches.length > 0;
      const isDimmed =
        hasSelectedPerson
          ? true
          : Boolean(mapQuery.trim()) && roomMatches.length === 0;

      markers.push({
        type: "cluster",
        roomId: room.id,
        count: roomPeople.length,
        people: roomPeople,
        label: `${roomPeople.length} people`,
        position: getClusterMarkerPosition(room.id),
        highlighted: isHighlighted,
        dimmed: isDimmed
      });
    }

    return markers;
  }, [
    clusteredRoomIds,
    focusedRoomId,
    hasSelectedPerson,
    hoveredRoomId,
    isRadarTrackingPerson,
    mapQuery,
    matchingPersonIds,
    selectedPersonId,
    selectedRoomId,
    peopleByRoomForMap
  ]);

  const chatPerson = mapPeople.find((person) => person.id === chatPersonId);

  useEffect(() => {
    if (!focusPersonId) return;
    const person = mapPeople.find((item) => item.id === focusPersonId);
    if (!person) return;
    activatePerson(person);
    setChatPersonId(person.id);
    onFocusPersonHandled?.();
  }, [focusPersonId, mapPeople, onFocusPersonHandled]);

  useEffect(() => {
    if (!chatPerson) return;
    if (radarMode) return;

    const frame = window.requestAnimationFrame(() => {
      focusMapOnPerson(chatPerson);
    });
    const settleTimer = window.setTimeout(() => {
      focusMapOnPerson(chatPerson);
    }, 320);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(settleTimer);
    };
  }, [chatPersonId, zoom, expanded, radarMode]);

  useEffect(() => {
    if (!radarMode) return;

    const targetPosition = radarFocusPerson
      ? {
          x: (currentUserMarkerPosition.x + getPersonMarkerPosition(radarFocusPerson).x) / 2,
          y: (currentUserMarkerPosition.y + getPersonMarkerPosition(radarFocusPerson).y) / 2
        }
      : currentUserMarkerPosition;

    const frame = window.requestAnimationFrame(() => {
      focusMapOnPoint(targetPosition, { desiredXFactor: 0.5, desiredYFactor: 0.5 });
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [radarFocusPerson, radarMode, zoom, currentUserMarkerPosition]);

  function openChat(personId) {
    if (chatCloseTimer.current) {
      window.clearTimeout(chatCloseTimer.current);
      chatCloseTimer.current = null;
    }
    setChatClosing(false);
    setChatPersonId(personId);
  }

  function closeChat() {
    setChatClosing(true);
    setSelectedPersonId(null);
    setSelectedRoomId(null);
    setFocusedRoomId(null);
    setHoveredRoomId(null);
    chatCloseTimer.current = window.setTimeout(() => {
      setChatPersonId(null);
      setChatClosing(false);
      chatCloseTimer.current = null;
    }, 300);
  }

  function clearSelections() {
    setSelectedPersonId(null);
    setSelectedRoomId(null);
    setFocusedRoomId(null);
    setHoveredRoomId(null);
    setRadarFocusPersonId(null);
  }

  function enterRadarMode() {
    if (chatCloseTimer.current) {
      window.clearTimeout(chatCloseTimer.current);
      chatCloseTimer.current = null;
    }
    setChatPersonId(null);
    setChatClosing(false);
    clearSelections();
    setMapQuery("");
    setRadarMode(true);
  }

  function exitRadarMode() {
    setRadarMode(false);
    clearSelections();
  }

  function openRadarForPerson(person) {
    if (chatCloseTimer.current) {
      window.clearTimeout(chatCloseTimer.current);
      chatCloseTimer.current = null;
    }
    setChatPersonId(null);
    setChatClosing(false);
    setMapQuery("");
    setSelectedRoomId(null);
    setHoveredRoomId(person.roomId);
    setFocusedRoomId(person.roomId);
    setSelectedPersonId(person.id);
    setRadarFocusPersonId(person.id);
    setRadarMode(true);
  }

  function addRequestMessage(person, kind) {
    const id = crypto.randomUUID();
    setChatRequests((state) => ({
      ...state,
      [person.id]: [
        ...(state[person.id] || []),
        {
          id,
          kind,
          text: kind === "jump" ? "Request to jump" : "Summon request",
          status: "pending"
        }
      ]
    }));

    if (kind === "jump") {
      onJumpRequest?.(person, (result) => {
        setChatRequests((state) => ({
          ...state,
          [person.id]: (state[person.id] || []).map((message) =>
            message.id === id
              ? { ...message, status: result.status, roomName: result.room.name }
              : message
          )
        }));
      });
    }
  }

  function goToRoom(room) {
    setRequestStates((state) => ({ ...state, [room.id]: undefined }));
    setSelectedRoomId(null);
    setFocusedRoomId(null);
    setHoveredRoomId(null);
    onMoveToRoom(room, `Going to ${room.name}`);
  }

  function requestJoin(room) {
    setRequestStates((state) => ({ ...state, [room.id]: "pending" }));

    window.setTimeout(() => {
      if (room.response === "denied") {
        setRequestStates((state) => ({ ...state, [room.id]: "denied" }));
        pushToast(`${room.name} declined the request`, "danger");
        return;
      }

      setRequestStates((state) => ({ ...state, [room.id]: "approved" }));
      window.setTimeout(() => {
        setRequestStates((state) => ({ ...state, [room.id]: undefined }));
        setSelectedRoomId(null);
        setFocusedRoomId(null);
        setHoveredRoomId(null);
        onMoveToRoom(room, `${room.name} approved — you moved there`);
      }, 450);
    }, 1800);
  }

  function canStartPan(target) {
    return !target.closest(
      ".plan-room, .room-card, .map-tools, .map-compass-control, .radar-control, .person-marker, .user-marker, .map-search-results, .invite-modal-backdrop"
    );
  }

  function focusMapOnPoint(position, options = {}) {
    const canvas = planCanvasRef.current;
    if (!canvas) return;

    const canvasWidth = canvas.clientWidth;
    const canvasHeight = canvas.clientHeight;
    const desiredX = canvasWidth * (options.desiredXFactor ?? (mapQuery.trim() ? 0.38 : 0.5));
    const desiredY = canvasHeight * (options.desiredYFactor ?? 0.5);
    const markerX = (position.x / SVG_WIDTH) * canvasWidth;
    const markerY = (position.y / SVG_HEIGHT) * canvasHeight;
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;

    setPan({
      x: desiredX - centerX - effectiveZoom * (markerX - centerX),
      y: desiredY - centerY - effectiveZoom * (markerY - centerY)
    });
  }

  function focusMapOnPerson(person) {
    const position = clusteredRoomIds.has(person.roomId)
      ? getClusterMarkerPosition(person.roomId)
      : getPersonMarkerPosition(person, peopleByRoomForMap);

    focusMapOnPoint(position);
  }

  function activatePerson(person) {
    setSelectedPersonId(person.id);
    setSelectedRoomId(null);
    setFocusedRoomId(person.roomId);
    setHoveredRoomId(person.roomId);
    focusMapOnPerson(person);
  }

  function addMapUser(event) {
    event.preventDefault();
    const email = newUserName.trim();
    if (!email) return;
    const name = email.split("@")[0].replace(/[._-]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

    setAddedPeople((current) => [
      ...current,
      {
        id: `user-${crypto.randomUUID()}`,
        name,
        role: newUserRole.trim() || "New user",
        roomId: "south-pod",
        presenceGroup: "space",
        status: "Available",
        palette: ["#eef1ff", "#8c9ee8", "#3f5fc4"]
      }
    ]);
    setNewUserName("");
    setNewUserRole("");
    setCsvFileName("");
    setAddUserOpen(false);
  }

  function addMapUsers(invitations) {
    setAddedPeople((current) => [
      ...current,
      ...invitations.map(({ email, role }) => ({
        id: `user-${crypto.randomUUID()}`,
        name: email.split("@")[0].replace(/[._-]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase()),
        role,
        roomId: "south-pod",
        presenceGroup: "space",
        status: "Available",
        palette: ["#eef1ff", "#8c9ee8", "#3f5fc4"]
      }))
    ]);
    setAddUserOpen(false);
  }

  function handleStagePointerDown(event) {
    if (!canStartPan(event.target)) return;
    panStartRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      panX: pan.x,
      panY: pan.y,
      moved: false
    };
    setIsPanning(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handleStagePointerMove(event) {
    const gesture = panStartRef.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;
    const deltaX = event.clientX - gesture.startX;
    const deltaY = event.clientY - gesture.startY;
    if (Math.abs(deltaX) > 2 || Math.abs(deltaY) > 2) {
      gesture.moved = true;
    }
    setPan({
      x: gesture.panX + deltaX,
      y: gesture.panY + deltaY
    });
  }

  function handleStagePointerEnd(event) {
    const gesture = panStartRef.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;
    if (gesture.moved) {
      ignoreStageClickRef.current = true;
    }
    panStartRef.current = null;
    setIsPanning(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  const mapStage = (
    <div
      className={`map-stage ${isPanning ? "is-panning" : ""} ${radarMode ? "radar-stage" : ""}`}
      role="application"
      aria-label="Architectural office map"
      onClick={(event) => {
        if (event.target.closest?.(".invite-modal-backdrop")) return;
        if (radarMode) return;
        if (ignoreStageClickRef.current) {
          ignoreStageClickRef.current = false;
          return;
        }
        clearSelections();
      }}
      onPointerDown={radarMode ? undefined : handleStagePointerDown}
      onPointerMove={radarMode ? undefined : handleStagePointerMove}
      onPointerUp={radarMode ? undefined : handleStagePointerEnd}
      onPointerCancel={radarMode ? undefined : handleStagePointerEnd}
    >
      {!radarMode && (
        <div className="map-tools" onClick={(event) => event.stopPropagation()}>
          <MapPersonSearch
            query={mapQuery}
            matches={mapMatches}
            selectedPersonId={selectedPersonId}
            addUserOpen={addUserOpen}
            newUserName={newUserName}
            newUserRole={newUserRole}
            csvFileName={csvFileName}
            emailAutomatically={emailAutomatically}
            onAddUser={() => setAddUserOpen((open) => !open)}
            onNewUserNameChange={setNewUserName}
            onNewUserRoleChange={setNewUserRole}
            onCsvFileChange={setCsvFileName}
            onEmailAutomaticallyChange={setEmailAutomatically}
            onSubmitAddUser={addMapUser}
            onCancelAddUser={() => setAddUserOpen(false)}
            onInviteUsers={addMapUsers}
            onSelectPerson={(person) => {
              activatePerson(person);
            }}
            onChat={(person) => {
              activatePerson(person);
              openChat(person.id);
            }}
            onCompass={(person) => {
              activatePerson(person);
              openRadarForPerson(person);
            }}
            onQueryChange={(value) => {
              setMapQuery(value);
              clearSelections();
            }}
          />

          <div className="map-zoom-controls" aria-label="Map zoom controls">
            <button
              type="button"
              aria-label="Zoom in"
              disabled={zoom >= 1.8}
              onClick={() => setZoom((value) => Math.min(1.8, value + 0.2))}
            >
              <ZoomIn size={16} aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Zoom out"
              disabled={zoom <= 0.8}
              onClick={() => setZoom((value) => Math.max(0.8, value - 0.2))}
            >
              <ZoomOut size={16} aria-hidden="true" />
            </button>
          </div>

        </div>
      )}

      {!radarMode && (
        <button
          className="map-compass-control"
          type="button"
          aria-label="Open compass view"
          title="Open compass view"
          onClick={(event) => {
            event.stopPropagation();
            enterRadarMode();
          }}
        >
          <Compass size={18} aria-hidden="true" />
        </button>
      )}

      <div
        className={`plan-canvas ${radarMode ? "radar-canvas" : ""}`}
        ref={planCanvasRef}
        style={{
          "--map-zoom": zoom,
          "--map-base-scale": mapBaseScale,
          "--room-card-scale": `calc(1 / ${zoom})`,
          "--pan-x": `${pan.x}px`,
          "--pan-y": `${pan.y}px`
        }}
      >
        <FloorPlan
          interactive={!radarMode}
          hoveredRoomId={hoveredRoomId}
          focusedRoomId={focusedRoomId}
          selectedRoomId={selectedRoomId}
          onHover={setHoveredRoomId}
          onSelect={(roomId) => {
            if (radarMode) return;
            setSelectedRoomId(roomId);
            setFocusedRoomId(roomId);
            setSelectedPersonId(null);
          }}
        />

        <UserMarker
          showPortrait={showMapPortraits}
          markerScale={personMarkerScale}
          position={currentUserMarkerPosition}
          radarOnly={radarMode}
        />

        {mapPeople.filter((person) => {
          if (isRadarTrackingPerson) return person.id === radarFocusPersonId;
          return !clusteredRoomIds.has(person.roomId) || person.id === selectedPersonId;
        }).map((person) => (
          <PersonMarker
            key={person.id}
            person={person}
            markerScale={personMarkerScale}
            highlighted={
              person.id === selectedPersonId ||
              (!hasSelectedPerson && mapQuery.trim() && matchingPersonIds.has(person.id))
            }
            dimmed={
              isRadarTrackingPerson
                ? person.id !== radarFocusPersonId
                : hasSelectedPerson
                ? person.id !== selectedPersonId
                : Boolean(mapQuery.trim()) && !matchingPersonIds.has(person.id)
            }
            showPortrait={showMapPortraits}
            positionOverride={
              clusteredRoomIds.has(person.roomId) && person.id === selectedPersonId
              ? getClusterMarkerPosition(person.roomId, "above")
                : undefined
            }
          />
        ))}

        {clusteredMapMarkers.map((marker) => (
          <ClusterMarker
            key={`cluster-${marker.roomId}`}
            marker={marker}
          />
        ))}

        {!radarMode && selectedRoom && (
          <RoomDetailCard
            room={selectedRoom}
            people={peopleByRoomForMap[selectedRoom.id]}
            state={
              selectedRoom.open === false && peopleByRoomForMap[selectedRoom.id].length > 0
                ? "closed"
                : requestStates[selectedRoom.id]
            }
            onGo={() => goToRoom(selectedRoom)}
            onRequest={() => requestJoin(selectedRoom)}
            onJoin={() => onMoveToRoom(selectedRoom, `Joining ${selectedRoom.name}`)}
            onSelectPerson={(person) => {
              activatePerson(person);
            }}
            onChatPerson={(person) => {
              activatePerson(person);
              openChat(person.id);
            }}
            onCompassPerson={(person) => {
              activatePerson(person);
              openRadarForPerson(person);
            }}
            onClose={() => {
              setSelectedRoomId(null);
              setFocusedRoomId(null);
              setHoveredRoomId(null);
            }}
            onReset={() =>
              setRequestStates((states) => ({
                ...states,
                [selectedRoom.id]: undefined
              }))
            }
            placement={roomDetailPlacement}
          />
        )}
      </div>
    </div>
  );

  if (radarMode) {
    return (
      <section className="surface map-surface radar-mode" aria-label="Map radar">
        <div className="radar-dock">
          {mapStage}
          <div className="radar-controls" aria-label="Radar controls">
            <button
              className="radar-control"
              type="button"
              aria-label="Zoom in radar"
              disabled={zoom >= 1.8}
              onClick={() => setZoom((value) => Math.min(1.8, value + 0.2))}
            >
              <ZoomIn size={18} />
            </button>
            <button
              className="radar-control"
              type="button"
              aria-label="Zoom out radar"
              disabled={zoom <= 0.8}
              onClick={() => setZoom((value) => Math.max(0.8, value - 0.2))}
            >
              <ZoomOut size={18} />
            </button>
            <button
              className="radar-control"
              type="button"
              aria-label="Return to full map"
              onClick={exitRadarMode}
            >
              <MapIcon size={18} />
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`surface map-surface ${expanded ? "expanded" : ""} ${chatPerson ? "chat-open" : ""}`}
      aria-label="Map navigator"
    >
      <WindowFrame
        kind="map"
        title="Users"
        subtitle=""
        activeSurface={activeSurface}
        expanded={expanded}
        onSurfaceChange={onSurfaceChange}
        onToggleExpanded={onToggleExpanded}
        hideChrome={addUserOpen}
      >
        <div className={`map-content ${addUserOpen ? "invite-users-open" : ""} ${chatPerson ? "with-chat" : ""}`}>
          {mapStage}

          {chatPerson && (
            <ChatPanel
              person={chatPerson}
              requestMessages={chatRequests[chatPerson.id] || []}
              closing={chatClosing}
              onClose={closeChat}
              onJump={() => addRequestMessage(chatPerson, "jump")}
              onSummon={() => addRequestMessage(chatPerson, "summon")}
              onMap={() => {
                activatePerson(chatPerson);
              }}
            />
          )}

        </div>
        {addUserOpen && <InviteUsersModal embedded open onClose={() => setAddUserOpen(false)} onInvite={addMapUsers} />}
      </WindowFrame>
    </section>
  );
}

function MapPersonSearch({
  query,
  matches,
  selectedPersonId,
  onSelectPerson,
  onChat,
  onCompass,
  onQueryChange,
  addUserOpen,
  newUserName,
  newUserRole,
  csvFileName,
  emailAutomatically,
  onAddUser,
  onNewUserNameChange,
  onNewUserRoleChange,
  onCsvFileChange,
  onEmailAutomaticallyChange,
  onSubmitAddUser,
  onCancelAddUser,
  onInviteUsers
}) {
  const hasQuery = query.trim().length > 0;

  return (
    <div className="map-person-search">
      <div className="map-search-actions-row">
        <label className="map-search-field">
          <Search size={16} aria-hidden="true" />
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Find person on map"
          />
        </label>
        <button className="map-add-users-button" type="button" onClick={onAddUser} aria-expanded={addUserOpen}>
          <UserPlus size={15} aria-hidden="true" />
          <span>Add users</span>
        </button>
      </div>

      {false && addUserOpen && (
        <div className="invite-users-backdrop" role="presentation" onClick={onCancelAddUser}>
          <form className="invite-users-modal" role="dialog" aria-modal="true" aria-labelledby="invite-users-title" onSubmit={onSubmitAddUser} onClick={(event) => event.stopPropagation()}>
            <button className="invite-users-close" type="button" aria-label="Close invite users" onClick={onCancelAddUser}>×</button>
            <div className="invite-users-heading">
              <UserPlus size={25} aria-hidden="true" />
              <h2 id="invite-users-title">Invite Users</h2>
            </div>

            <div className="invite-users-fields">
              <label>
                <span>Email</span>
                <div className="invite-input-wrap"><Mail size={18} aria-hidden="true" /><input autoFocus type="email" value={newUserName} onChange={(event) => onNewUserNameChange(event.target.value)} placeholder="Email" /></div>
              </label>
              <label>
                <span>Assigned role</span>
                <select value={newUserRole} onChange={(event) => onNewUserRoleChange(event.target.value)}>
                  <option value="">Select a Role</option>
                  <option>Team Member</option>
                  <option>Office Administrator</option>
                  <option>Guest</option>
                </select>
              </label>
            </div>

            <button className="invite-add-row" type="submit" disabled={!newUserName.trim()}><UserPlus size={21} aria-hidden="true" /> ADD USER</button>
            <div className="invite-divider" />
            <p className="invite-copy">Inviting a large group? Simplify the process by uploading a CSV file with user emails and their assigned roles.</p>
            <p className="invite-example"><strong>For example:</strong><br /><u>johndoe@example.com</u>, Team Member<br /><u>janedoe@example.com</u>, Office Administrator</p>
            <span className="invite-section-label">File uploader</span>
            <label className="invite-upload">
              <input type="file" accept=".csv,text/csv" onChange={(event) => onCsvFileChange(event.target.files?.[0]?.name || "")} />
              <span className="invite-upload-icon">↑</span>
              <span>{csvFileName || <>Upload a <strong>CSV file</strong></>}</span>
            </label>
            <button className="invite-template-link" type="button" onClick={() => {}}>↧ Download our CSV template file</button>
            <label className="invite-checkbox"><input type="checkbox" checked={emailAutomatically} onChange={(event) => onEmailAutomaticallyChange(event.target.checked)} /><span>Email new users automatically</span><small>?</small></label>
            <button className="invite-submit" type="submit" disabled={!newUserName.trim()}>ADD USER</button>
            <p className="invite-billing">$15 per user / per month. Users added during an active billing cycle will be pro-rated in the next billing cycle.</p>
          </form>
        </div>
      )}
      {hasQuery && (
        <div className="map-search-results glass" aria-label="Map people search results">
          {matches.length ? (
            matches.map((person) => {
              const room = roomById[person.roomId];
              const active = person.id === selectedPersonId;

              return (
                <article
                  className={`map-search-result ${active ? "active" : ""}`}
                  key={person.id}
                >
                  <button
                    className="map-search-person"
                    type="button"
                    onClick={() => onSelectPerson(person)}
                  >
                    <Avatar person={person} size="tiny" portrait />
                    <span>
                      <strong>{person.name}</strong>
                      <small>{room.name}</small>
                    </span>
                  </button>

                  <div className="map-search-actions" aria-label={`Actions for ${person.name}`}>
                    <IconButton
                      label={`Locate ${person.name} in compass`}
                      onClick={() => onCompass(person)}
                    >
                      <Compass size={16} />
                    </IconButton>
                    <IconButton label={`Chat with ${person.name}`} onClick={() => onChat(person)}>
                      <MessageCircle size={16} />
                    </IconButton>
                  </div>
                </article>
              );
            })
          ) : (
            <span className="map-search-empty">No people found</span>
          )}
        </div>
      )}
    </div>
  );
}

function FloorPlan({ hoveredRoomId, focusedRoomId, selectedRoomId, onHover, onSelect, interactive = true }) {
  const activeRoomIds = new Set([hoveredRoomId, focusedRoomId, selectedRoomId].filter(Boolean));
  const orderedRooms = [
    ...ROOMS.filter((room) => !activeRoomIds.has(room.id)),
    ...ROOMS.filter((room) => activeRoomIds.has(room.id))
  ];

  return (
    <div className="floor-plan-shell">
      <svg
        className="floor-plan"
        viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
        preserveAspectRatio="xMidYMid meet"
        aria-label="Office floor plan"
      >
        <path className="map-zone-fill" d={MAP_ZONE_D} />
        <path className="map-zone-outline" d={MAP_ZONE_OUTLINE_D} />
        {orderedRooms.map((room) => (
          <RoomRegion
            key={room.id}
            room={room}
            people={peopleByRoom[room.id]}
            focused={room.id === focusedRoomId}
            hovered={room.id === hoveredRoomId}
            selected={room.id === selectedRoomId}
            interactive={interactive}
            onHover={onHover}
            onSelect={onSelect}
          />
        ))}
      </svg>
    </div>
  );
}

function RoomRegion({ room, people, hovered, focused, selected, interactive, onHover, onSelect }) {
  const roomShape = ROOM_SHAPES[room.id];
  function handleKeyDown(event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect(room.id);
    }
  }

  return (
    <g
      className={`plan-room ${selected ? "selected" : ""} ${focused ? "focused" : ""} ${hovered ? "hovered" : ""} ${
        people.length ? "occupied" : "empty"
      } ${room.open === false && people.length > 0 ? "closed" : ""}`}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-label={`${room.name}, ${people.length} people, ${
        room.open === false && people.length > 0 ? "closed" : "open"
      }`}
      onMouseEnter={interactive ? () => onHover(room.id) : undefined}
      onMouseLeave={interactive ? () => onHover(null) : undefined}
      onFocus={interactive ? () => onHover(room.id) : undefined}
      onBlur={interactive ? () => onHover(null) : undefined}
      onClick={(event) => {
        if (!interactive) return;
        event.stopPropagation();
        onSelect(room.id);
      }}
      onKeyDown={interactive ? handleKeyDown : undefined}
      data-room-id={room.id}
    >
      {roomShape.kind === "rect" ? (
        <rect
          x={roomShape.x}
          y={roomShape.y}
          width={roomShape.width}
          height={roomShape.height}
          transform={roomShape.transform}
          rx={roomShape.rx || undefined}
          className={`room-hit ${room.open === false && people.length > 0 ? "closed-room" : ""}`}
        />
      ) : roomShape.kind === "circle" ? (
        <circle
          cx={roomShape.cx}
          cy={roomShape.cy}
          r={roomShape.r}
          transform={roomShape.transform}
          className={`room-hit ${room.open === false && people.length > 0 ? "closed-room" : ""}`}
        />
      ) : (
        <path
          d={roomShape.d}
          className={`room-hit ${room.open === false && people.length > 0 ? "closed-room" : ""}`}
        />
      )}
    </g>
  );
}

function RoomDetailCard({
  room,
  people,
  state,
  onGo,
  onRequest,
  onJoin,
  onSelectPerson,
  onChatPerson,
  onCompassPerson,
  onClose,
  onReset,
  placement
}) {
  const isEmpty = people.length === 0;
  const isClosed = room.open === false && !isEmpty;
  const countLabel = isEmpty ? "0 people" : people.length === 1 ? "1 person" : `${people.length} people`;
  const statusLabel = isClosed ? "Door closed" : "Door open";

  return (
    <aside
      className={`room-card glass inline ${placement?.below ? "below" : "above"} ${state || ""}`}
      aria-label={`${room.name} details`}
      style={
        placement
          ? {
              left: placement.left,
              top: placement.top
            }
          : undefined
      }
      onClick={(event) => event.stopPropagation()}
    >
      <div className="room-card-heading">
        <div>
          <h2>{room.name}</h2>
          <div className="room-card-meta">
            {countLabel} · {statusLabel}
          </div>
        </div>
        <IconButton label="Close room info" onClick={onClose}>
          <X size={16} />
        </IconButton>
      </div>

      <div className="occupants" aria-label="People in room">
        {isEmpty ? (
          <div className="empty-room-state">
            <DoorOpen size={22} aria-hidden="true" />
            <span>Open room</span>
          </div>
        ) : (
          people.map((person) => (
            <div className="occupant" key={person.id}>
              <button
                className="occupant-person"
                type="button"
                onClick={() => onSelectPerson?.(person)}
                aria-label={`Focus ${person.name} on map`}
              >
                <Avatar person={person} size="small" portrait />
                <span>{person.name}</span>
              </button>
              <div className="occupant-actions">
                <IconButton
                  label={`Locate ${person.name} in compass`}
                  onClick={() => onCompassPerson?.(person)}
                >
                  <Compass size={14} />
                </IconButton>
                <IconButton
                  label={`Chat with ${person.name}`}
                  onClick={() => onChatPerson?.(person)}
                >
                  <MessageCircle size={14} />
                </IconButton>
              </div>
            </div>
          ))
        )}
      </div>

      <RoomCallToAction
        isEmpty={isEmpty}
        state={isClosed ? "closed" : state}
        onGo={onGo}
        onRequest={onRequest}
        onJoin={onJoin}
        onReset={onReset}
      />
    </aside>
  );
}

function RoomCallToAction({ isEmpty, state, onGo, onRequest, onJoin, onReset }) {
  if (state === "closed") {
    return (
      <button className="room-cta closed" type="button" disabled>
        <X size={18} aria-hidden="true" />
        Door closed
      </button>
    );
  }

  if (isEmpty) {
    return (
      <button className="room-cta go" type="button" onClick={onGo}>
        <Navigation size={18} aria-hidden="true" />
        Go here
      </button>
    );
  }

  if (state === "pending") {
    return (
      <button className="room-cta pending" type="button" disabled>
        <Clock3 size={18} aria-hidden="true" />
        Request pending
      </button>
    );
  }

  if (state === "approved") {
    return (
      <button className="room-cta approved" type="button" disabled>
        <Check size={18} aria-hidden="true" />
        Moving to room…
      </button>
    );
  }

  if (state === "denied") {
    return (
      <div className="denied-actions">
        <button className="room-cta denied" type="button" disabled>
          <X size={18} aria-hidden="true" />
          Request denied
        </button>
        <button className="secondary-reset" type="button" onClick={onReset}>
          Request again
        </button>
      </div>
    );
  }

  return (
    <button className="room-cta request" type="button" onClick={onRequest}>
      <UserRound size={18} aria-hidden="true" />
      Request to join
    </button>
  );
}

function UserMarker({ showPortrait, markerScale, position, radarOnly = false }) {
  if (!radarOnly) {
    return (
      <div
        className={`person-marker user-marker ${showPortrait ? "with-portrait" : "name-only"}`}
        aria-label="You are here"
        style={{
          "--person-marker-scale": markerScale,
          left: `${(position.x / SVG_WIDTH) * 100}%`,
          top: `${(position.y / SVG_HEIGHT) * 100}%`
        }}
      >
        {showPortrait ? (
          <Avatar person={CURRENT_USER} size="map" portrait />
        ) : (
          <span className="user-marker-dot" />
        )}
        <span className="user-marker-label">You</span>
      </div>
    );
  }

  return (
    <div
      className="user-marker radar-only"
      aria-label="You are here"
      style={{
        "--person-marker-scale": markerScale,
        left: `${(position.x / SVG_WIDTH) * 100}%`,
        top: `${(position.y / SVG_HEIGHT) * 100}%`
      }}
    >
      <span className="user-radar-cone" aria-hidden="true" />
      <span className="user-marker-dot" />
    </div>
  );
}

function PersonMarker({ person, highlighted, dimmed, showPortrait, markerScale, positionOverride }) {
  const position = positionOverride || getPersonMarkerPosition(person);
  const targetScale = markerScale * (highlighted ? 1.04 : 1);

  return (
    <div
      className={`person-marker ${showPortrait ? "with-portrait" : "name-only"} ${
        highlighted ? "highlighted" : ""
      } ${
        dimmed ? "dimmed" : ""
      }`}
      style={{
        "--person-marker-scale": targetScale,
        left: `${(position.x / SVG_WIDTH) * 100}%`,
        top: `${(position.y / SVG_HEIGHT) * 100}%`
      }}
      aria-label={`${person.name} on map`}
    >
      {showPortrait ? (
        <Avatar person={person} size="map" portrait />
      ) : null}
      <span className="person-marker-label">{person.name}</span>
    </div>
  );
}

function ClusterMarker({ marker }) {
  return (
    <div
      className={`person-marker cluster-marker ${marker.highlighted ? "highlighted" : ""} ${
        marker.dimmed ? "dimmed" : ""
      }`}
      style={{
        left: `${(marker.position.x / SVG_WIDTH) * 100}%`,
        top: `${(marker.position.y / SVG_HEIGHT) * 100}%`
      }}
      aria-label={`${marker.count} people in ${roomById[marker.roomId]?.name || "room"}`}
    >
      <span className="cluster-stack" aria-hidden="true">
        {marker.people.slice(0, 3).map((person) => (
          <Avatar key={person.id} person={person} size="tiny" portrait />
        ))}
      </span>
      <span className="cluster-label">{marker.label}</span>
    </div>
  );
}

function ActionButton({ label, onClick, active = false, variant = "", badge, children }) {
  return (
    <button
      className={`action-button ${active ? "active" : ""} ${variant}`}
      type="button"
      aria-label={label}
      data-tooltip={label}
      onClick={onClick}
    >
      {children}
      {badge ? <span className="action-badge">{badge}</span> : null}
    </button>
  );
}

function Avatar({ person, size = "medium", portrait = false, modeBadge = "" }) {
  const initial = person.name.trim().charAt(0).toUpperCase();
  const [start, middle, end] = person.palette;
  const badgeLabel =
    modeBadge === "2d" ? "2D" : modeBadge === "audio" ? "AU" : modeBadge === "essential" ? "ES" : "";
  const badgeTone = modeBadge === "2d" ? "two-d" : modeBadge === "audio" ? "audio" : "essential";

  return (
    <span
      className={`avatar ${size}`}
      style={
        portrait
          ? { "--avatar-bg": "linear-gradient(135deg, #f3f6fb 0%, #e7edf9 100%)" }
          : {
              "--avatar-bg": `linear-gradient(135deg, ${start} 0%, ${middle} 48%, ${end} 100%)`
            }
      }
      aria-hidden="true"
    >
      {portrait && person.photo ? (
        <img
          className="avatar-photo"
          src={person.photo}
          alt=""
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      ) : (
        initial
      )}
      {badgeLabel ? (
        <span className={`avatar-mode-badge ${badgeTone}`} aria-hidden="true">
          {badgeLabel}
        </span>
      ) : null}
    </span>
  );
}

function Presence({ signal, label }) {
  return <span className={`presence ${signal}`}>{label}</span>;
}

function IconButton({ label, onClick, active = false, children }) {
  return (
    <button
      className={`icon-button ${active ? "active" : ""}`}
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function ToastStack({ toasts }) {
  return (
    <div className="toast-stack" aria-live="polite" aria-atomic="true">
      {toasts.map((toast) => (
        <div className={`toast glass ${toast.tone} ${toast.closing ? "closing" : ""}`} key={toast.id}>
          <span className="toast-icon" aria-hidden="true">
            {toast.tone === "danger" ? <X size={16} /> : <Check size={16} />}
          </span>
          <div className="toast-copy">
            <strong>{toast.tone === "danger" ? "Error" : toast.tone === "success" ? "Success" : "Default"}</strong>
            <span>{toast.message}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;
