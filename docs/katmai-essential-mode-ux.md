# Katmai Basic / Essential Mode UX Direction

## Information Architecture

### People-Centric Menu

Primary object: a person.

Structure:

- Fixed-width light glass window over the office environment by default, with an explicit fullscreen control.
- Search and roster: optimized for finding someone by name, current room, or status.
- Person rows are the primary surface. Each row includes avatar, name, current room, presence/status, and direct Chat, Jump to, and Summon actions.
- Selection is lightweight. A compact selected-person action strip can appear, but the view should not become a profile page or large profile inspector.
- Optional side surfaces: chat can open beside the people menu; a map peek could open later, but room selection should not happen here.

Actions:

- Chat: opens a conversation surface anchored beside the people menu.
- Jump to person: teleports to that person, separate from room jumping.
- Summon: sends a request to bring the person to the user.

Boundary:

- Room names are context only in this view. They should not behave like room-selection controls.

### Map-Centric Menu

Primary object: the office space.

Structure:

- Fixed-width light glass window over the office environment by default, with an explicit fullscreen control.
- Architectural map navigator: spatial 2D translation of the 3D office, with walls, room boundaries, door cues, furniture, and circulation paths.
- Room regions: names visible by default, occupancy visible without opening details.
- Hover preview: lightweight room name and occupancy.
- Fixed room card: opens on room click, anchored top-left of the map area.

Actions:

- Go here: available for empty rooms.
- Request to join: available for occupied rooms.
- Join room: only after permission is granted or in a future explicitly open-room case.

Boundary:

- Room selection lives only in the map surface.
- People are visible on the map, but selecting a room remains a room-level action.

## Key Flows

### Find And Contact A Person

1. Open People.
2. Search by name.
3. Select a person only if useful for a compact action strip.
4. Choose Chat, Jump to person, or Summon.

### Jump To A Person

1. Open People.
2. Select the person.
3. Choose Jump to person.
4. Teleport near the person, using their room as context but not as the selected target.

### Navigate To An Empty Room

1. Open Map.
2. Scan room names and occupancy.
3. Click an empty room.
4. Room card shows people list as empty and a Go here action.
5. Choose Go here.
6. Map closes after movement succeeds.

### Request To Join An Occupied Room

1. Open Map.
2. Hover a room to preview name and occupancy.
3. Click the room.
4. Room card shows occupants and Request to join.
5. After requesting, the room card enters a pending state and the map stays open.
6. If approved, the user is moved into the room and the map closes.
7. If denied, the room card shows a denied state and the user remains on the map.

## Shared Components

- Avatar / portrait: used in people roster, selected-person strip, map markers, room occupants, and presence stacks.
- Presence pill: available, busy, focus, empty, blocked, pending.
- Action button: Chat, Jump to person, Summon, Request to join, Go here.
- Room card: map-only component for room selection, occupancy, and permission state.
- Toast: lightweight confirmation for movement, summons, and request outcomes.
- Location context chip: shared language for current room or secondary room context.

## Connection Points

- People can expose a secondary room label, but not room selection.
- Map can expose people positions, but not a people-search-first workflow.
- Jump to person and room movement should remain separate commands in labels, telemetry, and permission handling.
- Chat can be launched from the people menu and may later be allowed as a sidecar from person markers if the map team wants it, but that should not make the map a people directory.

## Desktop And Smaller Screens

Desktop first:

- People menu defaults to a fixed-width roster window. Expanded mode may add a compact selected-person action pane, but not a profile inspector.
- Map menu defaults to a fixed-width floor-plan window. Expanded mode lets the architectural plan fill most of the viewport with the room card pinned inside the map area.

Smaller screens:

- People should keep the roster first and move the compact selected-person actions below it.
- Map can preserve room selection, but dense name labels may need adaptive shortening and larger touch targets.
- If map density becomes too high, keep names on by default but allow zoom/pan before adding filtering.
