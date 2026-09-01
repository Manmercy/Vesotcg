const overlay = document.querySelector('#overlay-root');
const state = {
  following: false,
  checkedIn: localStorage.getItem('verso_checked_in') === 'true',
  pinned: false,
  matchStatus: 'pending',
  deckPrivate: false,
  currentView: 'home',
  currentActivity: 'match-onepiece',
  navigation: [],
  recordedMatch: localStorage.getItem('verso_recorded_match') === 'true',
};

const users = [
  ['Manny', 'One Piece', 'Collector · Traveler', 'M'], ['Poom', 'One Piece', 'Competitive Player', 'P'],
  ['May', 'Pokémon', 'Grail Hunter', 'M'], ['Bam', 'Gundam', 'Community Host', 'B'],
  ['Nook', 'Magic', 'Weekend Warrior', 'N'], ['Fern', 'Lorcana', 'Collector', 'F'],
  ['Nine', 'One Piece', 'Event Hunter', '9'], ['Aim', 'Pokémon', 'Community Player', 'A'],
];
const badges = [
  ['First Match','Player','✦'],['10 Matches','Player','10'],['100 Matches','Player','100'],['1,000 Matches','Player','1K'],
  ['Deck Loyalist','Player','▱'],['Rivalry','Player','VS'],['Winning Streak','Player','5'],['First Pull','Collector','◇'],
  ['First Grail','Collector','✧'],['Binder Starter','Collector','▤'],['Grail Hunter','Collector','★'],['Set Hunter','Collector','◫'],
  ['First Deck','Brewer','＋'],['Deck Builder','Brewer','▱'],['Still Testing','Brewer','?'],['Multi Deck','Brewer','≋'],
  ['First Follow','Community','♡'],['Meet 10 Players','Community','10'],['Community Builder','Community','◎'],['Local Regular','Community','⌖'],
  ['First Shop','Traveler','⌂'],['5 Shops','Traveler','5'],['Cardboard Tourist','Traveler','10'],['Multi City','Traveler','⌁'],
  ['First Event','Event','◇'],['5 Events','Event','5'],['Tournament Regular','Event','♜'],['Top Finish','Event','1'],
  ['Same Rival. Again.','Lifestyle','VS'],['Just One Pack','Lifestyle','!'],['Weekend Warrior','Lifestyle','W'],['Night Owl','Lifestyle','☾'],
];

const activities = {
  'match-recorded': {type:'match', eyebrow:'NEW · CONFIRMED SESSION', title:'Manny defeated Poom 2–1', author:'Manny × Poom', avatar:'manny', time:'just now', game:'ONE PIECE CARD GAME', location:'Mana House', visual:'duo', score:'2 — 1', players:['Manny','Poom'], decks:['Blue Doflamingo','Red Zoro'], duration:'1h 34m', copy:'Game three went down to the last card. Added from Record Match and confirmed by both players.'},
  'match-onepiece': {type:'match', eyebrow:'CONFIRMED COLLABORATION', title:'Same rival. One more chapter.', author:'Manny × Poom', avatar:'manny', time:'18m', game:'ONE PIECE CARD GAME', location:'Mana House', visual:'duo', score:'2 — 1', players:['Manny','Poom'], decks:['Blue Doflamingo','Red Zoro'], duration:'1h 34m', copy:'Game three went down to the last card. Same rival, again.'},
  'event-community': {type:'event', eyebrow:'ON GOING · COMMUNITY', title:'VERSO Community Night', author:'Bam N.', avatar:'bank', time:'1h', game:'MULTI-TCG', location:'Mana House', visual:'group', date:'28 AUG · 18:00', people:'18 players are here', copy:'Cards, friends, trades, and one more round with the local community.'},
  'badge-tourist': {type:'badge', eyebrow:'ACHIEVEMENT UNLOCKED', title:'Cardboard Tourist', author:'May K.', avatar:'may', time:'2h', location:'10 different card shops', visual:'tourist', rarity:'RARE · 8.4% OF PLAYERS', copy:'Every shop and every table adds another place to the story.'},
  'match-lorcana': {type:'match', eyebrow:'CONFIRMED COLLABORATION', title:'Ruby / Amethyst takes the set', author:'Fern × Aim', avatar:'fern', time:'3h', game:'DISNEY LORCANA', location:'Side Deck', visual:'new-lorcana', score:'2 — 0', players:['Fern','Aim'], decks:['Ruby / Amethyst','Amber / Steel'], duration:'52m', copy:'A friendly launch-week match with two close games and a clean finish.'},
  'moment-binder': {type:'moment', eyebrow:'COLLECTION MOMENT', title:'Trade binder finally organized', author:'Nook W.', avatar:'nook', time:'4h', game:'COLLECTION', location:'Chiang Mai', visual:'binder', copy:'Three cities, too many sleeves, zero regrets. Ready for the next trade night.'},
  'shop-mana': {type:'shop', eyebrow:'PASSPORT CHECK-IN', title:'Mana House unlocked', author:'Manny', avatar:'manny', time:'6h', game:'SHOP JOURNEY', location:'Mana House · Chiang Mai', visual:'shop', copy:'The 18th shop in Manny’s passport and a new partner-store badge earned.'},
  'match-magic': {type:'match', eyebrow:'CONFIRMED COLLABORATION', title:'Azorius Control closes game three', author:'Nook × Bam', avatar:'nook', time:'yesterday', game:'MAGIC: THE GATHERING', location:'Community Night', visual:'new-magic', score:'1 — 2', players:['Nook','Bam'], decks:['Mono Red','Azorius Control'], duration:'1h 12m', copy:'A long final game turned on one patient answer at exactly the right time.'},
  'match-yugioh': {type:'match', eyebrow:'CONFIRMED COLLABORATION', title:'Snake-Eye wins a fast set', author:'Nine × Poom', avatar:'nine', time:'yesterday', game:'YU-GI-OH! TRADING CARD GAME', location:'Dragon Link Games', visual:'new-yugioh', score:'2 — 1', players:['Nine','Poom'], decks:['Snake-Eye','Branded'], duration:'47m', copy:'Quick turns, a close side-deck game, and a high-five after the final draw.'},
  'graded-gem': {type:'card', eyebrow:'NEW COLLECTION STORY', title:'A grail found under neon light', author:'May K.', avatar:'may', time:'yesterday', game:'COLLECTION', location:'Profile Album', visual:'new-card', rarity:'ALT ART · FIRST COPY', copy:'Found the card I kept coming back for. It is now saved in the profile album and ready for the next trade night.'},
  'event-regional': {type:'event', eyebrow:'REGIONAL SERIES · BANGKOK', title:'One Piece City Clash', author:'Bam N.', avatar:'bank', time:'2d', game:'ONE PIECE CARD GAME', location:'ICONSIAM Hall 7', visual:'regional', date:'12 SEP · 10:00', people:'64 VERSO players are going', copy:'A 256-player regional with side events, artist alley, and VERSO community check-in.'},
  'event-lorcana': {type:'event', eyebrow:'COMMUNITY EVENT', title:'Ink & Friends Launch Party', author:'Fern P.', avatar:'fern', time:'3d', game:'DISNEY LORCANA', location:'Side Deck · Chiang Mai', visual:'launch', date:'30 AUG · 18:30', people:'22 players are going', copy:'A relaxed launch party for new decks, first matches, and friendly trades.'},
  'badge-first-match': {type:'badge', eyebrow:'ACHIEVEMENT UNLOCKED', title:'First Match', author:'Manny', avatar:'manny', time:'4d', location:'Mana House', visual:'first', rarity:'PLAYER · UNCOMMON', copy:'The first confirmed match in Manny’s VERSO journey.'},
};

const feedActivityOrder = ['match-onepiece','event-community','badge-tourist','match-lorcana','moment-binder','shop-mana','match-magic','match-yugioh','graded-gem','event-regional','event-lorcana','badge-first-match'];

const activityPresentation = {
  'match-recorded': {media:'manny-poom', verb:'recorded a confirmed match', likes:0, comments:0, achievement:'CREATED FROM RECORD MATCH', metrics:[['2 — 1','FINAL SCORE'],['1h 34m','SESSION'],['3','GAMES']]},
  'match-onepiece': {media:'manny-poom', verb:'played together', likes:48, comments:6, achievement:'SAME RIVAL. AGAIN. · 25 MATCHES TOGETHER', metrics:[['2 — 1','FINAL SCORE'],['1h 34m','SESSION'],['3','GAMES']]},
  'event-community': {media:'bam-event', verb:'hosted a community night', likes:92, comments:14, achievement:'COMMUNITY SPARK · 18 PLAYERS TOGETHER', metrics:[['18','HERE NOW'],['4','FRIENDS'],['LIVE','STATUS']]},
  'badge-tourist': {media:'badge-tourist', verb:'unlocked a new badge', likes:74, comments:9, achievement:'VISITED 10 DIFFERENT CARD SHOPS', metrics:[['RARE','RARITY'],['10','SHOPS'],['8.4%','PLAYERS']]},
  'match-lorcana': {media:'fern-aim', verb:'confirmed a match', likes:34, comments:5, achievement:'CLEAN SET · FIRST MATCH TOGETHER', metrics:[['2 — 0','FINAL SCORE'],['52m','SESSION'],['2','GAMES']]},
  'moment-binder': {media:'nook-binder', verb:'shared a collection moment', likes:126, comments:18, achievement:'BINDER READY · COLLECTION MILESTONE', metrics:[['72','CARDS'],['3','CITIES'],['1','BINDER']]},
  'shop-mana': {media:'shop-mana', verb:'checked in at a partner shop', likes:41, comments:8, achievement:'NEW SHOP BADGE · MANA HOUSE REGULAR', metrics:[['18','SHOPS'],['6','CITIES'],['24','STAMPS']]},
  'match-magic': {media:'match-magic', verb:'confirmed a match', likes:27, comments:4, achievement:'GAME THREE COMEBACK', metrics:[['1 — 2','FINAL SCORE'],['1h 12m','SESSION'],['3','GAMES']]},
  'match-yugioh': {media:'match-yugioh', verb:'confirmed a match', likes:53, comments:11, achievement:'FASTEST SET THIS WEEK', metrics:[['2 — 1','FINAL SCORE'],['47m','SESSION'],['3','GAMES']]},
  'graded-gem': {media:'new-card', verb:'added a new card', likes:188, comments:31, achievement:'FIRST COPY · SAVED TO PROFILE ALBUM', metrics:[['1st','COPY'],['ALT ART','RARITY'],['48','ALBUM']]},
  'event-regional': {media:'event-regional', verb:'is going to an event', likes:96, comments:18, achievement:'REGIONAL JOURNEY · REGISTRATION OPEN', metrics:[['256','PLAYERS'],['64','VERSO'],['12 SEP','DATE']]},
  'event-lorcana': {media:'event-launch', verb:'joined a community event', likes:68, comments:9, achievement:'OPENING CREW · LAUNCH PARTY', metrics:[['22','GOING'],['3','FRIENDS'],['30 AUG','DATE']]},
  'badge-first-match': {media:'badge-first', verb:'unlocked a badge', likes:117, comments:22, achievement:'THE FIRST CONFIRMED CHAPTER', metrics:[['FIRST','MILESTONE'],['PLAYER','TYPE'],['1','SESSION']]},
};

Object.entries(activityPresentation).forEach(([id, presentation]) => Object.assign(activities[id], presentation));

const avatarClassFor = (name = '') => ({Manny:'manny',Poom:'poom',May:'may',Bam:'bank',Nook:'nook',Fern:'fern',Aim:'aim',Nine:'nine'}[name.split(' ')[0]] || 'manny');
const socialActions = (item) => `<footer class="activity-actions journey-actions"><button data-action="like"><span>♡</span><b>${item.likes}</b></button><button data-action="comment"><span>◯</span><b>${item.comments}</b></button><button data-action="share"><span>↗</span>Share</button><button class="view-detail" data-action="activity-detail">View activity →</button></footer>`;
const journeyMetrics = (item) => `<div class="journey-metrics">${item.metrics.map(([value,label])=>`<span><small>${label}</small><strong>${value}</strong></span>`).join('')}</div>`;
const collaborationHeader = (item) => `<header class="activity-head collab-head"><button class="collab-avatars" data-action="activity-detail" aria-label="${item.author}"><span class="avatar ${avatarClassFor(item.players[0])}">${item.players[0]}</span><span class="avatar ${avatarClassFor(item.players[1])}">${item.players[1]}</span></button><div><strong>${item.players[0]} <i>×</i> ${item.players[1]}</strong><p>${item.verb} · ${item.time} · ${item.location}</p></div><button class="more" aria-label="More">•••</button></header>`;
const authorHeader = (item) => `<header class="activity-head"><button class="avatar ${item.avatar}" data-action="activity-detail">${item.author}</button><div><strong>${item.author}</strong><p>${item.verb} · ${item.time} · ${item.location}</p></div><button class="more" aria-label="More">•••</button></header>`;

const journeyMedia = (item) => {
  if (item.type === 'badge') return `<button class="journey-badge-hero bare wide" data-action="activity-detail"><span class="badge-aura"></span><span class="badge-art ${item.visual}"></span><div><small>${item.eyebrow}</small><strong>${item.title}</strong><p>${item.rarity}</p></div><i>✦</i></button>`;
  if (item.type === 'shop') return `<button class="journey-shop-hero bare wide" data-action="activity-detail"><span class="passport-stamp"><b>MH</b><strong>MANA HOUSE</strong><small>CHIANG MAI · 2026</small></span><div><small>VERSO PARTNER SHOP</small><strong>Stamp unlocked</strong><p>Scan. Check in. Keep the place in your story.</p></div></button>`;
  return `<button class="journey-media media-${item.media} bare wide" data-action="activity-detail"><span class="journey-media-shade"></span><span class="journey-media-tag">${item.type === 'match' ? 'VERSO VERIFIED ✓' : item.eyebrow}</span><span class="journey-media-caption"><strong>${item.type === 'match' ? item.game : item.title}</strong><small>${item.location}</small></span></button>`;
};

const renderActivityCard = (id) => {
  const item = activities[id];
  const header = item.type === 'match' ? collaborationHeader(item) : authorHeader(item);
  return `<article class="activity-card journey-card-v6 type-${item.type}" data-activity="${id}">${header}<div class="journey-title"><small>${item.eyebrow}</small><h2>${item.title}</h2></div>${journeyMetrics(item)}<div class="journey-achievement"><span>✦</span><strong>${item.achievement}</strong></div>${journeyMedia(item)}<p class="journey-copy">${item.copy}</p>${item.type === 'event' ? `<div class="event-going compact"><div class="attendee-stack">${avatarFor(0,'Manny')}${avatarFor(1,'Poom')}${avatarFor(2,'May')}${avatarFor(3,'Bam')}</div><span><strong>${item.people}</strong><small>Friends and local players in the same story</small></span></div>` : ''}${socialActions(item)}</article>`;
};

function renderFeedActivities() {
  const feed = document.querySelector('#activity-feed');
  if (feed) feed.innerHTML = feedActivityOrder.map(renderActivityCard).join('');
}

const toast = (message) => {
  const el = document.querySelector('#toast');
  el.textContent = message; el.classList.add('show');
  clearTimeout(window.versoToast);
  window.versoToast = setTimeout(() => el.classList.remove('show'), 1900);
};

const panel = (title, subtitle, body, actions = '', variant = '') => `
  ${variant.includes('activity-detail-panel') ? '<button class="detail-backdrop" data-action="back" aria-label="Close activity detail"></button>' : ''}<section class="prototype-panel ${variant}" aria-label="${title}">
    <header class="panel-bar"><button class="back-btn" data-action="back" aria-label="Back"><span>←</span><b>Back</b></button><div><small>${subtitle}</small><h1>${title}</h1></div><button class="panel-close" data-action="back" aria-label="Close">×</button></header>
    <div class="panel-content">${body}</div>${actions}
  </section>`;

const statRow = (items) => `<div class="stat-row">${items.map(([n,l]) => `<div><strong>${n}</strong><span>${l}</span></div>`).join('')}</div>`;
const chip = (text) => `<span class="ui-chip">${text}</span>`;
const avatarNames = ['manny','poom','may','bank','nook','fern','nine','aim','kai'];
const avatarFor = (index, label = '') => `<span class="avatar ${avatarNames[index % avatarNames.length]}">${label}</span>`;
const qrMarkup = (seed = 7) => `<div class="mock-qr" aria-label="Mock QR code">${Array.from({length:441},(_,i)=>`<i class="${((i * seed + (i % 21) * 3 + Math.floor(i / 21)) % 11) < 5 ? 'on' : ''}"></i>`).join('')}</div>`;
const calendarActivity = {2:'match',4:'match',7:'badge',8:'match',11:'match',13:'event',15:'match',18:'shop',20:'match',22:'match',24:'event',27:'match',28:'match',30:'badge'};
const calendarActivityId = {2:'match-yugioh',4:'match-magic',7:'badge-first-match',8:'match-lorcana',11:'match-onepiece',13:'event-lorcana',15:'match-magic',18:'shop-mana',20:'match-yugioh',22:'match-lorcana',24:'event-regional',27:'match-onepiece',28:'event-community',30:'badge-tourist'};
const calendarLevel = {2:2,4:3,7:1,8:4,11:2,13:3,15:4,18:1,20:3,22:4,24:2,27:4,28:3,30:1};
const weekdayLabels = `<div class="week-labels"><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span></div>`;
const calendarCells = () => Array.from({length:42},(_,index) => {
  const day = index - 4;
  if (day < 1 || day > 31) return '<i class="calendar-day empty"></i>';
  const activity = calendarActivity[day];
  if (activity) return `<button class="calendar-day lv${calendarLevel[day] || 0}" data-action="activity-detail" data-activity="${calendarActivityId[day]}" aria-label="Open activity from August ${day}"><span>${day}</span><b class="activity-dot ${activity}" aria-hidden="true"></b></button>`;
  return `<i class="calendar-day lv0"><span>${day}</span></i>`;
}).join('');
const calendarMarkup = () => `<div class="profile-calendar-shell">${weekdayLabels}<div class="profile-calendar">${calendarCells()}</div></div>`;

const noticeContent = () => `
  <div class="notice-priority"><span class="avatar poom">P</span><div><small>MATCH REQUEST · NOW</small><strong>Poom added a match with you.</strong><p>Select your deck and confirm the result.</p></div><button data-action="confirm-request">Review →</button></div>
  <div class="notification-list"><button><span class="note-icon">✦</span><span><strong>Badge unlocked!</strong><small>1,000 Matches · 2h</small></span></button><button><span class="avatar may">M</span><span><strong>May liked your match.</strong><small>Blue Doflamingo vs Red Zoro · 3h</small></span></button><button><span class="note-icon lavender">♡</span><span><strong>Bam followed you.</strong><small>Community host · 5h</small></span></button><button><span class="note-icon orange">◇</span><span><strong>One Piece Weekly tomorrow.</strong><small>Mana House · 1d</small></span></button></div>`;

const detailVisual = (item) => {
  if (item.type === 'match') return `<div class="activity-detail-visual match-detail ${item.visual}"><span class="activity-photo-layer media-${item.media}"></span><div class="detail-score"><small>${item.game}</small><strong>${item.score}</strong><span>${item.players[0]} · ${item.decks[0]} <i>VS</i> ${item.players[1]} · ${item.decks[1]}</span></div></div>`;
  if (item.type === 'event') return `<div class="activity-detail-visual event-detail-art ${item.visual}"><span class="activity-photo-layer media-${item.media}"></span><div><small>${item.eyebrow}</small><strong>${item.title}</strong><p>${item.date}</p><b>${item.people}</b></div></div>`;
  if (item.type === 'badge') return `<div class="activity-detail-visual single-badge-detail"><span class="badge-art ${item.visual}"></span><div><small>${item.eyebrow}</small><strong>${item.title}</strong><p>${item.rarity}</p></div></div>`;
  if (item.type === 'card') return `<div class="activity-detail-visual new-card-detail"><span class="activity-photo-layer new-card"></span><div><small>${item.eyebrow}</small><strong>${item.title}</strong><p>${item.rarity}</p></div></div>`;
  if (item.type === 'shop') return `<div class="activity-detail-visual shop-detail-art"><span class="passport-stamp big"><b>MH</b><strong>MANA HOUSE</strong><small>CHIANG MAI · 2026</small></span><div><small>NEW PASSPORT STAMP</small><strong>18TH SHOP UNLOCKED</strong><p>+ Mana House Regular badge</p></div></div>`;
  return `<div class="activity-detail-visual moment-detail"><span class="activity-photo-layer media-${item.media}"></span><div><small>${item.eyebrow}</small><strong>${item.title}</strong></div></div>`;
};

const detailAuthorHeader = (item) => item.type === 'match'
  ? `<header class="activity-page-author collab-detail-author"><span class="collab-avatars"><i class="avatar ${avatarClassFor(item.players[0])}">${item.players[0]}</i><i class="avatar ${avatarClassFor(item.players[1])}">${item.players[1]}</i></span><div><strong>${item.players[0]} <i>×</i> ${item.players[1]}</strong><small>${item.time} · ${item.location}</small></div><span class="verified-pill">VERSO VERIFIED ✦</span></header>`
  : `<header class="activity-page-author"><span class="avatar ${item.avatar}">${item.author}</span><div><strong>${item.author}</strong><small>${item.time} · ${item.location}</small></div><span class="verified-pill">VERSO VERIFIED ✦</span></header>`;

const activityDetail = (id) => {
  const item = activities[id] || activities['match-onepiece'];
  const facts = item.type === 'match'
    ? [['TOTAL SESSION',item.duration],['GAME',item.game],['LOCATION',item.location]]
    : [['POSTED BY',item.author],['ACTIVITY',item.type.toUpperCase()],['LOCATION',item.location]];
  return panel(item.title, `${item.eyebrow} · ${item.time}`, `
    <article class="activity-page" data-activity="${id}">
      ${detailAuthorHeader(item)}
      ${detailVisual(item)}
      <div class="journey-achievement detail-achievement"><span>✦</span><strong>${item.achievement}</strong></div>
      <p class="activity-page-copy">${item.copy}</p>
      <div class="activity-page-facts">${facts.map(([label,value])=>`<span><small>${label}</small><strong>${value}</strong></span>`).join('')}</div>
      ${item.type === 'event' ? `<div class="event-going compact"><div class="attendee-stack">${avatarFor(0,'Manny')}${avatarFor(1,'Poom')}${avatarFor(2,'May')}${avatarFor(3,'Bam')}</div><span><strong>${item.people}</strong><small>Friends and local players from VERSO</small></span></div>` : ''}
      ${item.type === 'event' ? `<div class="activity-event-tools"><button class="secondary" data-action="location">⌖ Open location</button><button class="secondary" data-action="calendar">＋ Add to calendar</button></div>` : ''}
      ${item.type === 'match' ? `<div class="detail-deck-pair"><span><small>${item.players[0]}'S DECK</small><strong>${item.decks[0]}</strong></span><b>VS</b><span><small>${item.players[1]}'S DECK</small><strong>${item.decks[1]}</strong></span></div>` : ''}
      ${item.type === 'badge' ? `<div class="badge-share-note"><span>✦</span><div><strong>One badge. One moment.</strong><p>This activity and its share card contain only ${item.title}.</p></div></div>` : ''}
      <section class="comments"><h2>Activity talk</h2><p><span class="avatar may">May</span><b>May</b> This belongs in the story ✦</p></section>
    </article>`, `<footer class="panel-actions activity-page-actions"><button class="secondary" data-action="like">♡ Like</button><button class="secondary" data-action="comment">◯ Comment</button><button class="primary" data-action="share" data-activity="${id}">↗ Share</button></footer>`, 'activity-detail-panel');
};

const screens = {
  explore: () => panel('Explore', 'PLAYERS · SHOPS · EVENTS', `
    <label class="search-box">⌕ <input aria-label="Search" placeholder="Search players, shops or events" /></label>
    <div class="segment"><button class="active">Map</button><button>Players</button><button>Shops</button><button>Events</button></div>
    <section class="explore-map" aria-label="Mock map of nearby TCG activity">
      <div class="map-roads"><i></i><i></i><i></i><i></i></div>
      <button class="map-pin shop p1" data-screen="shop"><span>⌂</span><b>Mana House</b><small>1.2 km</small></button>
      <button class="map-pin battle p2" data-action="record"><span>VS</span><b>Open Battle</b><small>4 players</small></button>
      <button class="map-pin shop p3" data-screen="shop"><span>⌂</span><b>Side Deck</b><small>4.1 km</small></button>
      <button class="map-pin event p4" data-screen="event"><span>◇</span><b>Weekly</b><small>18 going</small></button>
      <span class="you-pin"><i class="avatar manny">Manny</i><b>You</b></span>
      <div class="map-key"><span><i class="shop-dot"></i>Shop</span><span><i class="battle-dot"></i>Battle</span><span><i class="event-dot"></i>Event</span></div>
    </section>
    <section class="content-section"><header><h2>Players around you</h2><button>View all</button></header><div class="people-strip">${users.slice(1,7).map((u,i) => `<button data-screen="player">${avatarFor(i+1,u[0])}<strong>${u[0]}</strong><small>${u[1]}</small><i>${u[2]}</i></button>`).join('')}</div></section>
    <section class="content-section"><header><h2>Shops near you</h2><button>Map view</button></header><div class="entity-grid">
      ${[['Mana House','Chiang Mai','1.2 km','One Piece · Pokémon'],['Dragon Link Games','Bangkok','3.8 km','Magic · Gundam'],['Side Deck','Chiang Mai','4.1 km','Pokémon · Lorcana'],['Card Base','Bangkok','6.4 km','Multi-TCG']].map((s,i)=>`<button class="entity-card" data-screen="shop"><span class="shop-art s${i}">⌂<b>PARTNER</b></span><span><strong>${s[0]}</strong><small>⌖ ${s[1]} · ${s[2]}</small><i>${s[3]}</i></span><em>›</em></button>`).join('')}
    </div></section>
    <section class="content-section"><header><h2>Upcoming events</h2></header><div class="list-stack">${[['28','AUG','One Piece Weekly','Mana House · 18:00'],['30','AUG','Pokémon League Night','Side Deck · 19:00'],['04','SEP','Gundam Casual Friday','Card Base · 20:00'],['12','SEP','VERSO TCG Fest 2026','ICONSIAM Hall 7']].map(e=>`<button class="list-row" data-screen="event"><span class="date-chip"><b>${e[0]}</b>${e[1]}</span><span><strong>${e[2]}</strong><small>${e[3]}</small></span><i>›</i></button>`).join('')}</div></section>`),

  player: () => profileScreen(false),
  profile: () => profileScreen(true),

  match: () => panel('Match Session', 'CONFIRMED COLLABORATION ✓', `
    <div class="session-photo"><span class="match-photo-sprite duo"></span><div><small>SESSION #VT-01248</small><strong>Same rival. One more chapter.</strong><p>Mana House · Friday local</p></div></div>
    <div class="hero-match"><p>ONE PIECE CARD GAME · LOCAL</p><div><span><i class="avatar poom">P</i><strong>Poom</strong><small>Red Zoro</small></span><b><em>1</em> — <em class="win">2</em><small>FINAL</small></b><span><i class="avatar manny">M</i><strong>Manny</strong><small>Blue Doflamingo</small></span></div><label>CONFIRMED BY BOTH PLAYERS ✓</label></div>
    <div class="session-facts"><span><small>TOTAL SESSION</small><strong>1h 34m</strong></span><span><small>GAMES PLAYED</small><strong>3</strong></span><span><small>ROUNDS</small><strong>Best of 3</strong></span></div>
    <div class="detail-card"><dl><div><dt>Shop</dt><dd><button data-screen="shop">Mana House →</button></dd></div><div><dt>Event</dt><dd><button data-screen="event">One Piece Weekly →</button></dd></div><div><dt>Started</dt><dd>Aug 27 · 19:42</dd></div><div><dt>Finished</dt><dd>Aug 27 · 21:16</dd></div></dl></div>
    <blockquote>“Game three went down to the last card. Same rival, again.”</blockquote>
    <div class="deck-preview-grid"><button class="deck-preview-card blue" data-screen="deck"><span class="deck-cover"><i>ONE<br>PIECE</i><b>BLUE<br>DOFLAMINGO</b><em>▱</em></span><span><small>MANNY'S DECK</small><strong>Blue Doflamingo</strong><i>28 sessions · 61% win rate</i></span></button><button class="deck-preview-card red" data-screen="deck"><span class="deck-cover"><i>ONE<br>PIECE</i><b>RED<br>ZORO</b><em>▱</em></span><span><small>POOM'S DECK</small><strong>Red Zoro</strong><i>46 sessions · 65% win rate</i></span></button></div>
    <div class="comments"><h2>Match talk</h2><p><span class="avatar may">M</span><b>May</b> This rivalry is getting serious 🔥</p></div>`, `<footer class="panel-actions"><button class="secondary" data-action="like">♡ Like</button><button class="secondary">◯ Comment</button><button class="primary" data-action="share">↗ Share</button></footer>`, 'activity-detail-panel'),

  decks: () => panel('My Decks', '4 ACTIVE DECKS', `
    <div class="page-intro"><p>Supporting your play, not defining it.</p><button class="primary small">＋ Create deck</button></div>
    <div class="list-stack">${[['Blue Doflamingo','One Piece','PUBLIC','28','17W · 11L','61%'],['Purple Luffy','One Piece','PRIVATE','12','6W · 6L','50%'],['Gardevoir ex','Pokémon','PUBLIC','19','11W · 8L','58%'],['Zeon Tempo','Gundam','PUBLIC','7','4W · 3L','57%']].map((d,i)=>`<button class="deck-row" data-screen="deck"><span class="deck-icon d${i}">▱</span><span><small>${d[1]} · ${d[2]}</small><strong>${d[0]}</strong><i>Updated ${i+1}d ago</i></span><span><b>${d[5]}</b><small>${d[3]} matches</small><i>${d[4]}</i></span><em>›</em></button>`).join('')}</div>`),

  deck: () => panel('Blue Doflamingo', 'ONE PIECE CARD GAME', `
    <div class="deck-hero"><span class="deck-icon d0">▱</span><div><p>CONTROL · MANNY</p><h2>Blue Doflamingo</h2><span id="privacy-label">${state.deckPrivate?'PRIVATE DECK 🔒':'PUBLIC DECK'}</span></div><label class="toggle"><input type="checkbox" data-action="privacy" ${state.deckPrivate?'checked':''}><i></i></label></div>
    ${statRow([['28','matches'],['17','wins'],['11','losses'],['61%','win rate']])}
    <section class="content-section"><header><h2>Deck list</h2><button>Edit</button></header><div id="deck-list" class="deck-list ${state.deckPrivate?'hidden-list':''}">${state.deckPrivate?'<div class="private-state">🔒<strong>Private deck</strong><p>Other players can still see the deck name and performance.</p></div>':['4 × Perona','4 × Gecko Moria','4 × Jinbe','3 × Gravity Blade Raging Tiger','2 × Kaido','11 × Other cards'].map((x,i)=>`<div><span>${x}</span><i>${i<3?'CORE':'TECH'}</i></div>`).join('')}</div></section>
    <section class="content-section"><header><h2>Recent matches</h2></header><button class="match-row" data-screen="match"><b class="win-text">WIN 2–1</b><span>vs Poom<small>Mana House · Aug 27</small></span><i>›</i></button><button class="match-row"><b class="loss-text">LOSS 0–2</b><span>vs May<small>Aug 25</small></span><i>›</i></button></section>`),

  passport: () => panel("Manny's Passport", 'SEASON 2026', `
    <div class="passport-cover"><span class="passport-logo">V<span>✦</span></span><small>VERSO</small><strong>PASSPORT</strong><p>Where Your TCG Story Lives.</p><label>PLAYER #0001 · MANNY</label></div>
    ${statRow([['18','shops'],['37','events'],['6','cities'],['24','stamps']])}
    <section class="passport-scan-card"><div>${qrMarkup(7)}<small>SHOP CHECK-IN QR</small></div><span><p>SCAN AT PARTNER SHOP</p><h2>Unlock the shop stamp</h2><small>Open this QR at the counter, or scan the shop QR to confirm your visit.</small><button class="primary" data-action="scan-shop">Simulate scan →</button></span></section>
    <section class="content-section partner-network"><header><div><small>VERSO PARTNER NETWORK</small><h2>Places that remember your visit</h2></div><button data-screen="explore">Open map →</button></header><div class="partner-shop-grid">${[['MANA HOUSE','Chiang Mai','Checked in · Aug 27','MH'],['SIDE DECK','Chiang Mai','3 upcoming events','SD'],['CARD BASE','Bangkok','1 badge available','CB'],['DRAGON LINK','Bangkok','Weekly match night','DL']].map((s,i)=>`<button data-screen="shop"><span>${s[3]}</span><div><small>${s[1]}</small><strong>${s[0]}</strong><i>${s[2]}</i></div><em>${i===0?'✓':'›'}</em></button>`).join('')}</div></section>
    <section class="content-section"><header><h2>Shop stamps</h2><span>18 unlocked</span></header><div class="stamp-grid">${[['MANA HOUSE','CHIANG MAI','MH'],['SIDE DECK','CHIANG MAI','SD'],['CARD BASE','BANGKOK','CB'],['DRAGON LINK','BANGKOK','DL'],['VERSUS','BANGKOK','VS'],['???','VISIT TO UNLOCK','?']].map((s,i)=>`<button class="passport-stamp ${i===5?'locked':''}"><b>${s[2]}</b><strong>${s[0]}</strong><small>${s[1]}</small></button>`).join('')}</div></section>
    <section class="content-section"><header><h2>Journey milestones</h2></header><div class="timeline"><p><b>Aug 27</b><span>Mana House stamp unlocked</span></p><p><b>Aug 21</b><span>VERSO TCG Fest attended</span></p><p><b>Aug 08</b><span>Bangkok city unlocked</span></p></div></section>`, `<footer class="panel-actions"><button class="primary" data-action="share">↗ Share passport</button></footer>`),

  shop: () => panel('Mana House', 'PARTNER SHOP · CHIANG MAI', `
    <div class="shop-hero"><div class="shop-banner"><span>⌂</span><b>VERSO PARTNER</b></div><div><h2>Mana House Chiang Mai</h2><p>Where the north comes to play.</p><div>${chip('ONE PIECE')}${chip('POKÉMON')}${chip('GUNDAM')}</div></div></div>
    ${statRow([['2.4K','followers'],['384','check-ins'],['1.8K','matches'],['12','events']])}
    <div class="action-grid"><button class="secondary" data-action="follow">${state.following?'Following ✓':'＋ Follow'}</button><button class="primary" data-action="checkin">${state.checkedIn?'Checked in ✓':'⌖ Check in'}</button></div>
    <section class="content-section"><header><h2>Upcoming events</h2><button>View all</button></header><button class="list-row" data-screen="event"><span class="date-chip"><b>28</b>AUG</span><span><strong>One Piece Weekly</strong><small>18:00 · 16 players</small></span><i>›</i></button></section>
    <section class="content-section"><header><h2>Shop info</h2></header><div class="detail-card"><dl><div><dt>Location</dt><dd>Chang Moi, Chiang Mai</dd></div><div><dt>Hours</dt><dd>12:00–22:00 daily</dd></div><div><dt>Community</dt><dd>Friendly · Competitive</dd></div></dl></div></section>`),

  event: () => panel('One Piece Weekly', 'EVENT · MANA HOUSE', `
    <div class="event-detail-grid"><div class="event-poster-large"><span class="poster-logo">V<span>✦</span></span><small>EVERY FRIDAY · CHIANG MAI</small><strong>ONE PIECE<br>WEEKLY</strong><p>PLAY · COLLECT · CONNECT</p><b>28 AUG · 18:00</b></div><div class="event-information"><p>EVENT INFORMATION</p><h2>Weekly Local Night</h2><label>● ON GOING · REGISTRATION OPEN</label><div class="event-info-list"><span><small>DATE & TIME</small><strong>Friday, 28 August · 18:00</strong></span><span><small>GAME & FORMAT</small><strong>One Piece · Standard · Best of 3</strong></span><span><small>ENTRY & CAPACITY</small><strong>฿150 · 16 seats</strong></span><span><small>EXPECTED DURATION</small><strong>2 hours · 3 rounds</strong></span></div><div class="event-top-actions"><button class="secondary" data-action="save-event">♡ Save</button><button class="secondary" data-action="calendar">＋ Add to Calendar</button><button class="primary" data-action="join">Join event</button></div></div></div>
    <div class="event-going"><div class="attendee-stack">${avatarFor(0,'Manny')}${avatarFor(1,'Poom')}${avatarFor(2,'May')}${avatarFor(3,'Bam')}${avatarFor(4,'Nook')}</div><span><strong>18 people are going</strong><small>Manny, Poom, May and 15 others</small></span><button>See all →</button></div>
    <section class="event-location"><header><div><small>LOCATION</small><h2>Mana House Chiang Mai</h2><p>Chang Moi Road · 1.2 km from you</p></div><button class="secondary" data-action="location">⌖ Open location</button></header><div class="event-map"><i></i><i></i><i></i><span class="map-shop-pin">⌂<b>Mana House</b></span><span class="map-you-pin">●<b>You</b></span></div></section>
    <section class="event-notes"><h2>About this event</h2><p>Friday night cards, familiar faces, and one more page in your TCG story. Deck lists are optional; sleeves and a positive table attitude are required.</p><div>${chip('BEGINNER FRIENDLY')}${chip('PRIZE SUPPORT')}${chip('VERSO CHECK-IN')}</div></section>`),

  notifications: () => panel('Notifications', '2 NEW', noticeContent()),
};

const profileActivityActions = (likes, comments) => `<footer class="activity-actions"><button data-action="like"><span>♡</span><b>${likes}</b></button><button><span>◯</span>${comments}</button><button data-action="share"><span>↗</span>Share</button></footer>`;

const profileTabs = (active) => [['overview','Overview','profile'],['sessions','Sessions','profile-sessions'],['decks','Decks','profile-decks'],['passport','Passport','profile-passport'],['badges','Badges','profile-badges']].map(([key,label,screen])=>`<button class="${active===key?'active':''}" data-screen="${screen}">${label}</button>`).join('');

function profileBody(own, active) {
  if (active === 'sessions') return `<section class="content-section sessions-head"><header><div><small>PROFILE FEED</small><h2>All activity</h2></div><button>Filter ▾</button></header><div class="filter-row">${chip('ALL')}${chip('MATCH')}${chip('EVENT')}${chip('COLLECTION')}${chip('BADGE')}</div></section><div class="profile-session-feed">
    <article class="profile-feed-card" data-activity="match-onepiece"><header class="activity-head"><span class="activity-symbol onepiece">VS</span><div><strong>Won a One Piece session 2–1</strong><p>with Poom · Mana House · 18m</p></div></header><button class="profile-feed-photo match-photo-sprite duo" data-action="activity-detail"><span>1h 34m session · View details →</span></button><p>Game three went down to the last card. Same rival, again.</p>${profileActivityActions(48,6)}</article>
    <article class="profile-feed-card" data-activity="event-community"><header class="activity-head"><span class="activity-symbol event">◇</span><div><strong>Went to VERSO Community Night</strong><p>with 18 players · 1h</p></div></header><button class="profile-feed-photo match-photo-sprite group" data-action="activity-detail"><span>View activity & location →</span></button>${profileActivityActions(92,14)}</article>
    <article class="profile-feed-card" data-activity="badge-tourist"><header class="activity-head"><span class="activity-symbol badge">✦</span><div><strong>Unlocked Cardboard Tourist</strong><p>Visited 10 card shops · 2h</p></div></header><button class="profile-feed-badge" data-action="activity-detail"><span class="badge-art tourist"></span><div><small>RARE ACHIEVEMENT</small><strong>Cardboard Tourist</strong><p>Every table has a new story.</p></div></button>${profileActivityActions(74,9)}</article>
    <article class="profile-feed-card" data-activity="graded-gem"><header class="activity-head"><span class="activity-symbol badge">✦</span><div><strong>Added a new card</strong><p>Alt art · first copy · yesterday</p></div></header><button class="profile-new-card bare wide" data-action="activity-detail"><span>A grail found under neon light</span></button>${profileActivityActions(188,31)}</article>
  </div>`;

  if (active === 'decks') return `<section class="content-section"><header><h2>Decks in rotation</h2><button class="primary small">＋ New deck</button></header><div class="profile-deck-grid">${[['blue','Blue Doflamingo','ONE PIECE','28 sessions · 61% WR'],['purple','Purple Luffy','ONE PIECE','12 sessions · 50% WR'],['pink','Gardevoir ex','POKÉMON','19 sessions · 58% WR'],['gold','Zeon Tempo','GUNDAM','7 sessions · 57% WR']].map(d=>`<button class="profile-deck-tile ${d[0]}" data-screen="deck"><span class="deck-cover"><i>${d[2]}</i><b>${d[1]}</b><em>▱</em></span><span><small>${d[2]}</small><strong>${d[1]}</strong><i>${d[3]}</i></span></button>`).join('')}</div></section>`;

  if (active === 'passport') return `<section class="content-section"><header><h2>Passport</h2><span>Season 2026</span></header>${statRow([['18','shops'],['37','events'],['6','cities'],['24','stamps']])}<section class="passport-scan-card"><div>${qrMarkup(7)}<small>SHOP CHECK-IN QR</small></div><span><p>SCAN AT PARTNER SHOP</p><h2>Unlock the shop stamp</h2><small>Scan at the counter to confirm your visit and earn the shop badge.</small><button class="primary" data-action="scan-shop">Simulate scan →</button></span></section><div class="stamp-grid">${[['MANA HOUSE','CHIANG MAI','MH'],['SIDE DECK','CHIANG MAI','SD'],['CARD BASE','BANGKOK','CB'],['DRAGON LINK','BANGKOK','DL']].map(s=>`<button class="passport-stamp"><b>${s[2]}</b><strong>${s[0]}</strong><small>${s[1]}</small></button>`).join('')}</div></section>`;

  if (active === 'badges') return `<section class="content-section"><header><h2>Pinned badges</h2><button data-action="pin">Edit pins</button></header><div class="badge-pin-shelf"><button data-action="activity-detail" data-activity="badge-tourist"><span class="badge-art grail"></span><strong>Grail Found</strong></button><button data-action="activity-detail" data-activity="badge-tourist"><span class="badge-art tourist"></span><strong>Cardboard Tourist</strong></button><button data-action="activity-detail" data-activity="badge-first-match"><span class="badge-art event"></span><strong>I Was There</strong></button></div></section><section class="content-section"><header><div><h2>Badge collection</h2><small class="collection-count">6 featured earned · 4 of 8 locked shown</small></div><span>32 / 40 earned</span></header><div class="badge-art-grid">${[['first','First Match',true,'badge-first-match'],['grail','Grail Found',true,'badge-tourist'],['local','Local Legend',true,'badge-tourist'],['tourist','Cardboard Tourist',true,'badge-tourist'],['event','I Was There',true,'badge-first-match'],['owl','Night Owl',true,'badge-first-match'],['grail','Top Cut',false,'badge-tourist'],['local','Story Builder',false,'badge-first-match'],['event','See You Next Year',false,'badge-first-match'],['owl','Spark Born',false,'badge-first-match']].map(b=>`<button class="${b[2]?'earned':'locked'}" data-action="activity-detail" data-activity="${b[3]}"><span class="badge-art ${b[0]}"></span><strong>${b[1]}</strong>${b[2]?'<small>EARNED</small>':'<small>🔒 LOCKED</small>'}</button>`).join('')}</div></section>`;

  return `<section class="content-section profile-album"><header><h2>Album</h2><button>View all 48</button></header><div class="album-grid"><button class="match-photo-sprite duo"><span>After the match</span></button><button class="match-photo-sprite group"><span>Community night</span></button><button class="match-photo-sprite shuffle"><span>Deck testing</span></button><button class="match-photo-sprite binder"><span>Binder day</span></button></div></section>
    <section class="content-section stats-lab"><header><h2>Stats lab</h2><button data-screen="profile-sessions">Full stats →</button></header><div class="stat-switch"><button class="active" data-action="stat" data-stat="matches">Sessions</button><button data-action="stat" data-stat="games">Games</button><button data-action="stat" data-stat="places">Places</button></div><div class="chart-card"><div><small id="chart-label">SESSIONS · LAST 8 WEEKS</small><strong id="chart-total">86</strong><span id="chart-change">↑ 18% from last period</span></div><div class="bar-chart" id="profile-chart">${[38,62,44,76,58,88,70,96].map((h,i)=>`<i style="height:${h}%"><b>${['W1','W2','W3','W4','W5','W6','W7','NOW'][i]}</b></i>`).join('')}</div></div></section>
    <section class="content-section"><header><h2>Pinned badges</h2><button data-screen="profile-badges">View all</button></header><div class="badge-pin-shelf compact"><button data-screen="badge"><span class="badge-art grail"></span><strong>Grail Found</strong></button><button data-screen="badge"><span class="badge-art tourist"></span><strong>Cardboard Tourist</strong></button><button data-screen="badge"><span class="badge-art event"></span><strong>I Was There</strong></button></div></section>
    <section class="content-section streak-profile"><header><h2>Play streak</h2><span>4 weeks active · 🔥</span></header><div class="calendar-head"><strong>August 2026</strong><small>12 session days · Best 9 weeks</small></div>${calendarMarkup()}<div class="activity-key"><span><i class="match"></i>Session</span><span><i class="event"></i>Event</span><span><i class="shop"></i>Shop</span><span><i class="badge"></i>Badge</span></div></section>
    <section class="content-section"><header><h2>Decks in rotation</h2><button data-screen="profile-decks">All decks →</button></header><div class="deck-carousel"><button class="soft-card" data-screen="deck"><small>ONE PIECE · PUBLIC</small><strong>Blue Doflamingo</strong><span>28 sessions · 61% win rate</span></button><button class="soft-card" data-screen="deck"><small>ONE PIECE · PRIVATE</small><strong>Purple Luffy 🔒</strong><span>12 sessions · 50% win rate</span></button></div></section>
    <section class="content-section"><header><h2>Recent activity</h2><button data-screen="profile-sessions">See all →</button></header><div class="profile-activity-list"><button data-action="activity-detail" data-activity="match-onepiece"><span class="activity-symbol onepiece">VS</span><span><small>CONFIRMED SESSION · ONE PIECE</small><strong>Won 2–1 vs ${own?'Poom':'Manny'}</strong><i>Blue Doflamingo · Mana House</i></span><em>18m</em></button><button data-action="activity-detail" data-activity="event-community"><span class="activity-symbol event">◇</span><span><small>EVENT</small><strong>Joined VERSO Community Night</strong><i>18 players were there</i></span><em>1h</em></button><button data-action="activity-detail" data-activity="badge-tourist"><span class="activity-symbol badge">✦</span><span><small>BADGE UNLOCKED</small><strong>Cardboard Tourist</strong><i>Visited 10 card shops</i></span><em>2h</em></button></div></section>`;
}

function profileScreen(own, active = 'overview') {
  const name = own ? 'Manny S.' : 'Poom T.';
  const tags = own ? ['COLLECTOR','CONTROL PLAYER','TRAVELER','EVENT HUNTER'] : ['COMPETITIVE','AGGRO PLAYER','LOCAL REGULAR'];
  return panel(name, own ? '@MANNY · CHIANG MAI' : '@POOM · BANGKOK', `
    <div class="profile-identity-block"><div class="profile-hero"><span class="avatar xl ${own?'manny':'poom'}">${name}</span><div><h2>${name}</h2><p>${own?'One Piece player. Binder enjoyer. Always looking for the next card shop.':'Red Zoro grinder. Here for close games and good rivals.'}</p><div>${tags.map(chip).join('')}</div></div><div class="profile-actions">${own?'<button class="secondary">Edit profile</button><button class="secondary qr-btn" data-action="profile-qr">▦ Share QR</button>':`<button class="primary" data-action="follow">${state.following?'Following ✓':'＋ Follow'}</button>`}</div></div><section class="profile-level"><span>LV. 24</span><div><small>VERSO SPIRIT LEVEL</small><strong>Storykeeper</strong><div class="progress"><i style="width:72%"></i></div><p>1,840 / 2,500 SP · 660 to next level</p></div><b>✦</b></section>${statRow(own?[['1,248','sessions'],['37','events'],['18','shops'],['32','badges'],['86','opponents']]:[['842','sessions'],['21','events'],['9','shops'],['24','badges'],['64','opponents']])}</div>
    <div class="segment profile-subnav">${profileTabs(active)}</div>${profileBody(own, active)}`);
}

screens['profile-sessions'] = () => profileScreen(true, 'sessions');
screens['profile-decks'] = () => profileScreen(true, 'decks');
screens['profile-passport'] = () => profileScreen(true, 'passport');
screens['profile-badges'] = () => profileScreen(true, 'badges');

screens.matches = () => profileScreen(true, 'sessions');
screens.badges = () => panel('Badge Collection', '32 EARNED · 8 IN PROGRESS', `<div class="badge-summary"><span>✦</span><div><strong>Identity, earned over time.</strong><p>Every badge says something about the player you are.</p></div></div><div class="badge-grid">${badges.map((b,i)=>`<button data-screen="badge" class="${i>23?'locked':''}"><span class="badge-shape c${i%6}">${b[2]}</span><strong>${b[0]}</strong><small>${b[1]}</small>${i>23?'<i>LOCKED</i>':''}</button>`).join('')}</div>`);
screens.badge = () => panel('Cardboard Tourist', 'TRAVELER · RARE', `<div class="badge-detail"><span class="badge-shape hero">10</span><h2>Cardboard Tourist</h2><p>Visit 10 different card shops. Every table has a new story.</p><div>${chip('RARE')}${chip('8.4% UNLOCKED')}</div></div><div class="detail-card"><dl><div><dt>Unlocked</dt><dd>August 27, 2026</dd></div><div><dt>Category</dt><dd>Traveler</dd></div><div><dt>Progress</dt><dd>10 / 10 shops</dd></div></dl></div>`, `<footer class="panel-actions"><button class="secondary" data-action="pin">${state.pinned?'Pinned ✓':'Pin to profile'}</button><button class="primary" data-action="share" data-activity="badge-tourist">↗ Share badge</button></footer>`);

const createSheet = () => `<div class="scrim create-scrim"><section class="bottom-sheet" role="dialog" aria-label="Create activity"><div class="sheet-grab"></div><header><div><small>ADD TO YOUR JOURNEY</small><h2>What happened?</h2></div><button data-action="close">×</button></header><div class="create-options"><button data-action="record"><span class="gradient-icon">VS</span><strong>Record match</strong><small>Play, confirm, remember.</small><i>›</i></button><button data-action="moment"><span class="pink-icon">✦</span><strong>Post a moment</strong><small>Pulls, cards, hobby life.</small><i>›</i></button><button data-action="checkin"><span class="orange-icon">⌖</span><strong>Check in</strong><small>Unlock a passport stamp.</small><i>›</i></button><button data-screen="event"><span class="lav-icon">◇</span><strong>Join / post event</strong><small>See what’s happening nearby.</small><i>›</i></button></div><p class="sheet-line">PLAY. COLLECT. CONNECT.</p></section></div>`;

const recordMatch = () => panel('Record Match', 'STEP 1 OF 2', `<div class="form-stack"><label>Game<select><option>One Piece Card Game</option><option>Yu-Gi-Oh! Trading Card Game</option><option>Disney Lorcana</option><option>Magic: The Gathering</option><option>Pokémon TCG</option><option>Gundam Card Game</option></select></label><label>Your deck<select><option>Blue Doflamingo</option><option>Purple Luffy</option><option>No deck</option></select></label><label>Opponent<button class="select-field"><span class="avatar poom">Poom</span><b>Poom T.</b><small>@poom</small><i>✓</i></button></label><div class="score-input"><label>Your score<button>−</button><strong>2</strong><button>＋</button></label><span>—</span><label>Opponent<button>−</button><strong>1</strong><button>＋</button></label></div><label>Shop · optional<select><option>Mana House</option><option>Side Deck</option><option>None</option></select></label><label>Note · optional<textarea>Game three went down to the last card.</textarea></label></div>`, `<footer class="panel-actions"><button class="secondary" data-action="back">Cancel</button><button class="primary" data-action="send-match">Send to Poom →</button></footer>`);

const pendingMatch = () => panel('Waiting for Poom', 'MATCH COLLABORATION', `<div class="pending-state"><span class="pulse-ring">↗</span><h2>Match sent.</h2><p>Poom will choose their deck and confirm the score. This activity stays pending until both players agree.</p></div><div class="hero-match compact"><p>ONE PIECE CARD GAME</p><div><span><i class="avatar manny">M</i><strong>Manny</strong><small>Blue Doflamingo</small></span><b><em>2</em> — <em>1</em><small>PENDING</small></b><span><i class="avatar poom">P</i><strong>Poom</strong><small>Deck not selected</small></span></div></div><div class="demo-hint"><b>PROTOTYPE DEMO</b><p>Switch perspective to complete the collaboration flow.</p><button class="primary" data-action="confirm-request">Continue as Poom →</button></div>`);

const confirmMatch = () => panel('Confirm Match', 'POOM’S VIEW', `<div class="notice-priority"><span class="avatar manny">M</span><div><small>MATCH REQUEST</small><strong>Manny added a match with you.</strong><p>Review the score and choose your deck.</p></div></div><div class="hero-match compact"><p>ONE PIECE CARD GAME</p><div><span><i class="avatar manny">M</i><strong>Manny</strong><small>Blue Doflamingo</small></span><b><em>2</em> — <em>1</em><small>REVIEW</small></b><span><i class="avatar poom">P</i><strong>Poom</strong><small>Choose below</small></span></div></div><label class="form-label">Your deck<select><option>Red Zoro</option><option>Blackbeard Control</option><option>No deck</option></select></label><p class="trust-note">By confirming, this match is added to both player journeys.</p>`, `<footer class="panel-actions"><button class="secondary" data-action="dispute">Dispute</button><button class="primary" data-action="verify">Confirm match ✓</button></footer>`);

const verified = () => panel('Match Confirmed ✓', 'ACTIVITY CARD CREATED', `<div class="verified-burst"><span>✦</span><h2>Another page in the story.</h2><p>The confirmed match is now a real Activity Card at the top of the feed.</p></div><div class="hero-match"><p>ONE PIECE CARD GAME · LOCAL</p><div><span><i class="avatar manny">M</i><strong>Manny</strong><small>Blue Doflamingo</small></span><b><em class="win">2</em> — <em>1</em><small>FINAL</small></b><span><i class="avatar poom">P</i><strong>Poom</strong><small>Red Zoro</small></span></div><label>CONFIRMED ✓ · POSTED TO BOTH JOURNEYS</label></div>`, `<footer class="panel-actions"><button class="secondary" data-action="activity-detail" data-activity="match-recorded">View Activity Card</button><button class="primary" data-action="share" data-activity="match-recorded">↗ Share match</button></footer>`);

const shareModal = (id = state.currentActivity) => {
  const item = activities[id] || activities['match-onepiece'];
  const photoClass = `media-${item.media}`;
  const hero = item.type === 'match'
    ? `<small>${item.eyebrow}</small><h3><span>${item.players[0]}</span><b>${item.score}</b><span>${item.players[1]}</span></h3><p>${item.decks[0]} · ${item.decks[1]}</p>`
    : item.type === 'badge'
      ? `<small>${item.eyebrow}</small><span class="share-single-badge badge-art ${item.visual}"></span><h3 class="single-title">${item.title}</h3><p>${item.rarity}</p>`
      : `<small>${item.eyebrow}</small><h3 class="single-title">${item.title}</h3><p>${item.location}</p>`;
  return `<div class="scrim"><section class="share-modal share-studio" data-activity="${id}"><header><div><small>SHARE YOUR MOMENT</small><h2>Share Studio</h2></div><button data-action="close">×</button></header><div class="share-workspace"><div class="share-preview story with-photo with-logo with-mascot with-background" id="share-preview"><span class="share-photo activity-photo-layer ${photoClass}"></span><span class="brand-guide-logo share-brand"></span><img class="share-mascot" src="./public/assets/verso-spirit-wave-v2.gif" alt="VERSO Spirit" /><div class="share-content">${hero}</div><footer>${item.location}<span>PLAY. COLLECT. CONNECT.</span></footer></div><div class="share-controls"><p>SHARE TO</p><div class="share-platforms"><button class="active" data-action="share-platform" data-platform="instagram">◎ Instagram Story</button><button data-action="share-platform" data-platform="post">▦ Instagram Post</button><button data-action="share-platform" data-platform="link">↗ Copy Link</button></div><p>FORMAT</p><div class="format-tabs"><button class="active" data-action="share-format" data-format="story">Story 9:16</button><button data-action="share-format" data-format="square">Square 1:1</button></div><p>CARD OPTIONS</p><div class="share-options"><button class="active" data-action="share-toggle" data-option="photo">Photo</button><button class="active" data-action="share-toggle" data-option="logo">Logo</button><button class="active" data-action="share-toggle" data-option="mascot">Mascot</button><button class="active" data-action="share-toggle" data-option="background">Background</button></div><div class="share-backgrounds"><button class="active" data-action="share-theme" data-theme="ink" aria-label="Ink background"></button><button data-action="share-theme" data-theme="cream" aria-label="Cream background"></button><button data-action="share-theme" data-theme="flame" aria-label="Flame background"></button><button data-action="share-theme" data-theme="dream" aria-label="Dream background"></button></div></div></div><div class="action-grid"><button class="secondary" data-action="download">↓ Save card</button><button class="primary" data-action="share-instagram">Share to Instagram Story ↗</button></div></section></div>`;
};

const stampUnlock = () => `<div class="scrim"><section class="unlock-modal"><div class="sparkle">✦</div><span class="passport-stamp big"><b>MH</b><strong>MANA HOUSE</strong><small>CHIANG MAI · 2026</small></span><small>NEW PASSPORT STAMP + SHOP BADGE</small><h2>Mana House unlocked!</h2><p>You also earned the <strong>Mana House Regular</strong> partner badge. Your TCG map keeps growing.</p><div class="shop-badge-earned"><span>MH</span><b>MANA HOUSE REGULAR</b><small>PARTNER SHOP BADGE</small></div><div class="action-grid"><button class="secondary" data-action="close">Not now</button><button class="primary" data-screen="passport">Open passport →</button></div></section></div>`;

const profileQrModal = () => `<div class="scrim"><section class="share-modal profile-qr-modal"><header><div><small>SHARE PLAYER PROFILE</small><h2>Scan to meet Manny</h2></div><button data-action="close">×</button></header><div class="qr-profile-card"><span class="brand-guide-logo qr-logo"></span><span class="avatar xl manny">Manny</span><h3>Manny S.</h3><p>@manny · Chiang Mai</p>${qrMarkup(9)}<small>verso.app/manny</small><div>${chip('COLLECTOR')}${chip('TRAVELER')}${chip('CONTROL')}</div></div><div class="action-grid"><button class="secondary" data-action="download">↓ Save QR</button><button class="primary" data-action="copy">⧉ Copy profile link</button></div></section></div>`;

const notificationPopover = () => `<div class="notice-layer"><button class="notice-backdrop" data-action="close-notice" aria-label="Close notifications"></button><section class="notice-popover" role="dialog" aria-label="Notifications"><header><div><small>2 NEW</small><h2><span class="bell-icon">●</span> Notifications</h2></div><button data-action="close-notice" aria-label="Close notifications">×</button></header>${noticeContent()}</section></div>`;

const welcomeModal = () => `<div class="scrim welcome-scrim"><section class="welcome-modal"><span class="brand-guide-logo welcome-logo"></span><img class="mascot-animated" src="./public/assets/verso-spirit-wave-v2.gif" alt="VERSO Spirit waving hello" /><p>TINY MISCHIEF. BIG LOVE FOR THE GAME.</p><h2>Good evening, Manny!</h2><span>There’s always room for one more match, pull, place, or person in your story.</span><button class="primary" data-action="welcome-close">Let’s play →</button><small>PLAY. COLLECT. CONNECT.</small></section></div>`;

function setOverlay(html, key, push = true) {
  if (push) state.navigation.push({html: overlay.innerHTML, key: state.currentView});
  overlay.innerHTML = html;
  state.currentView = key;
  overlay.querySelector('.prototype-panel')?.scrollTo(0,0);
}

function goBack() {
  const previous = state.navigation.pop();
  if (!previous) { openScreen('home', false); return; }
  overlay.innerHTML = previous.html;
  state.currentView = previous.key;
  overlay.querySelector('.prototype-panel')?.scrollTo(0,0);
}

function openActivity(id, push = true) {
  if (state.currentView === `activity:${id}` && overlay.querySelector('.activity-detail-panel')) return;
  state.currentActivity = id;
  setOverlay(activityDetail(id), `activity:${id}`, push);
}

function openScreen(name, push = true) {
  const navName = name.startsWith('profile-') ? 'profile' : name;
  document.querySelectorAll('.bottom-nav [data-screen], .rail-nav [data-screen]').forEach((item) => item.classList.toggle('active', item.dataset.screen === navName));
  if (name === 'home') {
    overlay.innerHTML = '';
    state.currentView = 'home';
    state.navigation = [];
    window.scrollTo({top:0,behavior:'smooth'});
    return;
  }
  if (name === 'notifications') { setOverlay(notificationPopover(), 'notifications', push); return; }
  if (screens[name]) setOverlay(screens[name](), name, push);
}

const recordedActivityCard = () => renderActivityCard('match-recorded').replace('journey-card-v6', 'journey-card-v6 recorded-activity');

function ensureRecordedActivity() {
  if (!document.querySelector('[data-activity="match-recorded"]')) document.querySelector('#activity-feed')?.insertAdjacentHTML('afterbegin', recordedActivityCard());
}

function bindFeedActivities() {
  let index = 0;
  document.querySelectorAll('#main-view .activity-card').forEach((card) => {
    if (!card.dataset.activity) card.dataset.activity = feedActivityOrder[index++];
    const footer = card.querySelector('.activity-actions');
    if (!footer) return;
    let detail = footer.querySelector('.view-detail');
    if (!detail) {
      footer.insertAdjacentHTML('beforeend', '<button class="view-detail" data-action="activity-detail">View activity →</button>');
      detail = footer.querySelector('.view-detail');
    }
    detail.textContent = 'View activity →';
    detail.dataset.action = 'activity-detail';
    detail.removeAttribute('data-screen');
  });
}

document.addEventListener('click', (event) => {
  const target = event.target;
  const actionNode = target.closest('[data-action]');
  const screenNode = target.closest('[data-screen]');
  const activityCard = target.closest('[data-activity]');
  if (screenNode) {
    event.preventDefault();
    if (activityCard?.classList.contains('activity-card')) openActivity(activityCard.dataset.activity);
    else openScreen(screenNode.dataset.screen);
    return;
  }
  if (!actionNode) {
    const commentButton = target.closest('.activity-actions button');
    if (commentButton?.querySelector('span')?.textContent === '◯') toast('Comments opened (prototype)');
    return;
  }
  const action = actionNode.dataset.action;
  if (action === 'back' || action === 'close') goBack();
  if (action === 'close-notice') goBack();
  if (action === 'welcome-close') openScreen('home');
  if (action === 'create') setOverlay(createSheet(), 'create');
  if (action === 'record') setOverlay(recordMatch(), 'record-match');
  if (action === 'send-match') setOverlay(pendingMatch(), 'pending-match');
  if (action === 'confirm-request') setOverlay(confirmMatch(), 'confirm-match');
  if (action === 'verify') { state.matchStatus = 'confirmed'; state.recordedMatch = true; localStorage.setItem('verso_recorded_match','true'); ensureRecordedActivity(); bindFeedActivities(); setOverlay(verified(), 'verified-match'); }
  if (action === 'dispute') toast('Match marked for review');
  if (action === 'activity-detail') openActivity(actionNode.dataset.activity || activityCard?.dataset.activity || state.currentActivity);
  if (action === 'share') {
    const id = actionNode.dataset.activity || activityCard?.dataset.activity || state.currentActivity;
    state.currentActivity = id;
    setOverlay(shareModal(id), `share:${id}`);
  }
  if (action === 'profile-qr') setOverlay(profileQrModal(), 'profile-qr');
  if (action === 'download') toast('Share card saved (prototype)');
  if (action === 'copy') { navigator.clipboard?.writeText(location.href); toast('Link copied'); }
  if (action === 'share-instagram') toast('Instagram Story card prepared ✦');
  if (action === 'share-format') {
    document.querySelectorAll('[data-action="share-format"]').forEach(button => button.classList.toggle('active', button === actionNode));
    const preview = document.querySelector('#share-preview');
    preview.classList.toggle('story', actionNode.dataset.format === 'story');
    preview.classList.toggle('square', actionNode.dataset.format === 'square');
  }
  if (action === 'share-toggle') {
    actionNode.classList.toggle('active');
    document.querySelector('#share-preview')?.classList.toggle(`with-${actionNode.dataset.option}`, actionNode.classList.contains('active'));
  }
  if (action === 'share-theme') {
    document.querySelectorAll('[data-action="share-theme"]').forEach(button => button.classList.toggle('active', button === actionNode));
    const preview = document.querySelector('#share-preview');
    preview.dataset.theme = actionNode.dataset.theme;
  }
  if (action === 'share-platform') {
    document.querySelectorAll('[data-action="share-platform"]').forEach(button => button.classList.toggle('active', button === actionNode));
    const shareButton = document.querySelector('[data-action="share-instagram"]');
    shareButton.textContent = actionNode.dataset.platform === 'instagram' ? 'Share to Instagram Story ↗' : actionNode.dataset.platform === 'post' ? 'Prepare Instagram Post ↗' : 'Copy activity link ↗';
  }
  if (action === 'comment') toast('Comments opened (prototype)');
  if (action === 'follow') { state.following = !state.following; actionNode.textContent = state.following ? 'Following ✓' : '＋ Follow'; toast(state.following ? 'Now following' : 'Unfollowed'); }
  if (action === 'join') { actionNode.textContent = 'Joined ✓'; toast('Event added to your journey'); }
  if (action === 'save-event') { actionNode.textContent = 'Saved ✓'; toast('Event saved'); }
  if (action === 'calendar') toast('Added to your calendar · Aug 28, 18:00');
  if (action === 'location') toast('Opening Mana House location (prototype)');
  if (action === 'checkin') { state.checkedIn = true; localStorage.setItem('verso_checked_in','true'); setOverlay(stampUnlock(), 'stamp-unlock'); }
  if (action === 'scan-shop') { state.checkedIn = true; localStorage.setItem('verso_checked_in','true'); setOverlay(stampUnlock(), 'stamp-unlock'); }
  if (action === 'pin') { state.pinned = !state.pinned; actionNode.textContent = state.pinned ? 'Pinned ✓' : 'Pin to profile'; toast(state.pinned ? 'Badge pinned to profile' : 'Badge unpinned'); }
  if (action === 'privacy') { state.deckPrivate = actionNode.checked; openScreen('deck'); toast(state.deckPrivate ? 'Deck list is private' : 'Deck list is public'); }
  if (action === 'moment') toast('Moment posted to your feed ✦');
  if (action === 'stat') {
    const stats = {
      matches: {label:'SESSIONS · LAST 8 WEEKS',total:'86',change:'↑ 18% from last period',bars:[38,62,44,76,58,88,70,96]},
      games: {label:'GAMES PLAYED · BY TCG',total:'4',change:'One Piece is your main game',bars:[96,48,35,22,16,10,8,5]},
      places: {label:'SHOPS + CITIES · THIS SEASON',total:'24',change:'↑ 6 new places this season',bars:[20,30,34,48,56,63,79,91]}
    };
    const selected = stats[actionNode.dataset.stat];
    document.querySelectorAll('.stat-switch button').forEach(button => button.classList.toggle('active', button === actionNode));
    document.querySelector('#chart-label').textContent = selected.label;
    document.querySelector('#chart-total').textContent = selected.total;
    document.querySelector('#chart-change').textContent = selected.change;
    document.querySelectorAll('#profile-chart i').forEach((bar,index)=>bar.style.height = `${selected.bars[index]}%`);
  }
  if (action === 'like') {
    const count = actionNode.querySelector('b'); const active = actionNode.classList.toggle('liked');
    const heart = actionNode.querySelector('span'); if (heart) heart.textContent = active ? '♥' : '♡';
    if (count) {
      if (!count.dataset.base) count.dataset.base = String(Number.parseInt(count.textContent, 10) || 0);
      count.textContent = String(Number(count.dataset.base) + (active ? 1 : 0));
    }
  }
});

window.addEventListener('keydown', (event) => { if (event.key === 'Escape') goBack(); });

renderFeedActivities();
document.querySelectorAll('[data-calendar]').forEach((calendar) => {
  calendar.innerHTML = calendarCells();
});

if (state.recordedMatch) ensureRecordedActivity();
bindFeedActivities();
state.currentView = 'welcome';
overlay.innerHTML = welcomeModal();
