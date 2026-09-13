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
  galleryIndex: 0,
  currentUserId: 'manny',
  currentDeckId: 'deck-manny-blue',
  currentShopId: 'mana',
  currentEventId: 'community',
  draftSession: null,
  newActivityId: null,
  editSessionId: null,
  currentBadgeId: 'badge_cardboard_tourist',
  pendingUploads: [],
  currentListingId: 'listing_mana_onepiece',
};

const {badges, activities, feedActivityOrder} = window.VERSO_DATA;
const db = window.VERSO_DB;
const databaseStatus = db.validate();
const escapeText = value => String(value ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const badgeCategoryIcon = category => ({
  Play:'⚔','Deck / Brewer':'▱',Competitive:'♛',Collector:'✦',Community:'♡',Events:'◇',Lifestyle:'☾','Shop / Journey':'⌖',Marketplace:'↔','VERSO Special':'V','Partner Shop':'⌖'
}[category] || '✦');
const profileActionIcon = name => ({
  edit:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z"/></svg>',
  qr:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="6" height="6" rx="1"/><rect x="15" y="3" width="6" height="6" rx="1"/><rect x="3" y="15" width="6" height="6" rx="1"/><path d="M15 15h2v2h-2zM19 15h2v6h-6v-2M15 19h2"/></svg>',
  settings:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21h-4v-.1A1.7 1.7 0 0 0 8.5 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.1-.4H3v-4h.1A1.7 1.7 0 0 0 4.6 8.5a1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1.1V3h4v.1A1.7 1.7 0 0 0 15.5 4.6a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.4 9c.14.37.36.7.66.96.3.26.68.4 1.08.4H21v4h-.1A1.7 1.7 0 0 0 19.4 15Z"/></svg>',
  follow:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="8" r="4"/><path d="M2.5 21v-2a5 5 0 0 1 5-5h3a5 5 0 0 1 3.7 1.6M19 8v6M22 11h-6"/></svg>',
  following:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m8.5 12 2.2 2.2 4.8-5"/></svg>',
  unfollow:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="8" r="4"/><path d="M2.5 21v-2a5 5 0 0 1 5-5h3a5 5 0 0 1 3.7 1.6M17 11h5"/></svg>'
}[name] || '');
const badgeArtwork = (badge, extra = '') => {
  if (!badge) return '';
  const placeholder=String(badge.artwork || '').startsWith('ph-');
  const classes=['badge-art',placeholder?'badge-art-placeholder':'badge-art-sprite',badge.artwork,extra].filter(Boolean).join(' ');
  const label=`${badge.name}, ${badge.rarity} ${badge.category || 'badge'}`;
  return `<span class="${classes}" data-badge-id="${escapeText(badge.id)}" data-badge-category="${escapeText(badge.category || 'Badge')}" role="img" aria-label="${escapeText(label)}">${placeholder?`<i class="badge-placeholder-spark">✦</i><em>${badgeCategoryIcon(badge.category)}</em><b>${escapeText(badge.name)}</b><small>${escapeText(badge.rarity)}</small><span>V</span>`:''}</span>`;
};
function syncPhotoStyles(){let style=document.querySelector('#canonical-photo-styles');if(!style){style=document.createElement('style');style.id='canonical-photo-styles';document.head.append(style);}style.textContent=Object.values(db.photos).filter(p=>db.isPhoto(p)&&!db.assets[p.assetId].path.includes('sprite')).map(p=>`.media-${p.visualKey}{background-image:url(${JSON.stringify(db.assets[p.assetId].path)})!important;background-size:cover!important;background-position:center!important}`).join('\n');}
syncPhotoStyles();
window.addEventListener('verso-storage-error',()=>toast('Storage full: this change is available only until you close the page. Try fewer or smaller photos.'));

const userById = (id = 'manny') => db.users[id] || db.users.manny;
const userIdFromName = (name = '') => Object.values(db.users).find(user => user.shortName === name.split(' ')[0] || user.name === name)?.id || 'manny';
const avatarClassFor = (name = '') => userById(userIdFromName(name)).avatar;
const userAvatarButton = (userId, extra = '') => { const user=userById(userId); return `<button class="avatar ${user.avatar} ${extra}" data-action="open-user" data-user-id="${user.id}" aria-label="Open ${user.name} profile">${user.shortName}</button>`; };
const userAvatarVisual = (userId, extra = '') => { const user=userById(userId); return `<span class="avatar ${user.avatar} ${extra}" aria-hidden="true">${user.shortName}</span>`; };
const socialActions = (item) => `<footer class="activity-actions journey-actions"><button class="${item.liked?'liked':''}" data-action="like" aria-label="Like"><span class="action-icon">${item.liked?'♥':'♡'}</span><b>${item.likes}</b></button><button data-action="comment" aria-label="Comment"><span class="action-icon">◯</span><b>${item.comments}</b></button><button data-action="share" aria-label="Share"><span class="action-icon">↗</span><b>Share</b></button></footer>`;
const shopIdForActivity = (item) => item.shopId || (item.sessionId ? db.sessions[item.sessionId]?.shopId : null) || (item.eventId ? db.events[item.eventId]?.shopId : null);
const locationLink = (item) => { const shopId=shopIdForActivity(item); return shopId ? `<button class="activity-location" data-action="open-shop" data-shop-id="${shopId}">⌖ ${item.location}</button>` : `<span>⌖ ${item.location}</span>`; };
const headerMeta = (item) => `<p><span>${item.time}</span><i>·</i>${locationLink(item)}</p>`;
const collaborationHeader = (item) => `<header class="activity-head collab-head"><span class="collab-avatars linked-avatars">${item.playerIds.map(userId=>userAvatarButton(userId)).join('')}</span><div><strong>${item.playerIds.map((userId,index)=>`<button data-action="open-user" data-user-id="${userId}">${userById(userId).shortName}</button>${index===0?' <i>×</i> ':''}`).join('')}</strong>${headerMeta(item)}</div><button class="more" data-action="session-menu" data-session-id="${item.sessionId}" aria-label="Session actions">•••</button></header>`;
const authorHeader = (item) => { const user=userById(item.authorUserId); return `<header class="activity-head">${userAvatarButton(user.id)}<div><strong><button data-action="open-user" data-user-id="${user.id}">${user.name}</button></strong>${headerMeta(item)}</div><button class="more" data-action="activity-menu" data-activity-id="${item.id}" aria-label="Post options">•••</button></header>`; };

const attendeeAvatar = (userId) => userAvatarButton(userId, 'attendee-avatar');
const attendeeStack = (item) => `<div class="attendee-stack linked-attendees">${(item.attendeeIds || []).slice(0,5).map(attendeeAvatar).join('')}</div>`;

const eventPoster = (item, compact = false) => `<div class="verso-event-poster poster-${item.poster || 'community'} ${compact ? 'compact' : ''}" style="--poster-image:url('./public/assets/${item.posterAsset || 'event-poster-community-v8.webp'}')"><span class="poster-brand">V<span>✦</span> VERSO</span><small>${item.game}</small><strong>${item.title}</strong><p>${item.date}</p><label>${item.location}</label><i>${item.posterCode || 'VERSO'}</i></div>`;

const duelGraphic = (item) => `<button class="journey-duel minimal-duel-graphic duel-${item.media.replace('duel-','')} bare wide" data-action="activity-detail" aria-label="Open ${item.title}"><span class="duel-grid"></span><span class="duel-card-back left"><i>V</i></span><b>VS</b><span class="duel-card-back right"><i>V</i></span><em>${item.game}</em></button>`;

const cardPullGraphic = (item) => `<button class="card-pull-graphic bare wide" data-action="activity-detail"><span class="pull-rays"></span><span class="pull-seal">GRAIL<br>FOUND</span><span class="pull-card"><i>✦</i><small>ORIGINAL TCG CARD</small><strong>MANGA RARE</strong></span><span class="pull-spark s1">✦</span><span class="pull-spark s2">✦</span><label>${item.rarity}</label></button>`;

const mediaCarousel = (item) => `<section class="activity-carousel" aria-label="${item.title} photo carousel"><button class="carousel-arrow prev" data-action="carousel-prev" aria-label="Previous photo">‹</button><div class="carousel-track">${item.gallery.map((media,index)=>`<button class="carousel-slide media-${media} ${index===0?'active':''}" data-action="gallery-open" data-index="${index}" aria-label="Open photo ${index+1} of ${item.gallery.length}"></button>`).join('')}</div><button class="carousel-arrow next" data-action="carousel-next" aria-label="Next photo">›</button><div class="carousel-dots">${item.gallery.map((_,index)=>`<button class="${index===0?'active':''}" data-action="carousel-go" data-index="${index}" aria-label="Show photo ${index+1}"></button>`).join('')}</div></section>`;

const eventFeedCarousel = (item) => {
  const gallery=item.imageIds || [];
  return `<section class="activity-carousel event-feed-carousel" aria-label="${item.title} post photo carousel"><button class="carousel-arrow prev" data-action="carousel-prev" aria-label="Previous post photo">‹</button><div class="carousel-track">${gallery.map((media,index)=>`<button class="carousel-slide media-${media} ${index===0?'active':''}" data-action="activity-detail" data-activity="${item.id}" data-index="${index}" aria-label="Open ${userById(item.authorUserId).name}'s post from photo ${index+1} of ${gallery.length}"></button>`).join('')}</div><button class="carousel-arrow next" data-action="carousel-next" aria-label="Next post photo">›</button><div class="carousel-dots">${gallery.map((_,index)=>`<button class="${index===0?'active':''}" data-action="carousel-go" data-index="${index}" aria-label="Show post photo ${index+1}"></button>`).join('')}</div></section>`;
};

const journeyMedia = (item) => {
  if (item.type === 'badge') { const badge=db.badges[item.badgeId]; return `<button class="journey-badge-hero bare wide" data-action="activity-detail" data-activity="${item.id}"><span class="badge-aura"></span>${badgeArtwork(badge,'feed-badge-art')}<div><small>${item.eyebrow}</small><strong>${badge?.name || item.title}</strong><p>${badge?.rarity || item.rarity}</p></div><i>✦</i></button>`; }
  if (item.type === 'event' && item.imageIds?.length) return eventFeedCarousel(item);
  if (item.type === 'shop' && item.photoIds?.length) return `<button class="journey-media media-${item.media} bare wide" data-action="activity-detail" aria-label="Open ${item.title}"></button>`;
  if (item.type === 'shop') {
    const shop=db.shops[item.shopId] || db.shops.mana;
    const stamp=Object.values(db.passportStamps).find(record=>record.userId===item.authorUserId&&record.shopId===shop.id);
    const visitLabel=(stamp?.visits || 1)===1?'First Visit':`${stamp.visits} Visits`;
    return `<button class="journey-shop-hero feed-stamp-unlock bare wide powered-stamp" data-action="activity-detail" aria-label="Open ${shop.name} stamp unlock"><span class="stamp-energy"></span><i class="stamp-spark spark-one" aria-hidden="true">✦</i><i class="stamp-spark spark-two" aria-hidden="true">✦</i><small class="stamp-partner-label">VERSO PARTNER SHOP</small><span class="passport-stamp"><b>${shop.code}</b><strong>${shop.name}</strong><small>${shop.city.toUpperCase()} · 2026</small></span><div class="stamp-unlock-copy"><strong>STAMP UNLOCKED</strong><b>${shop.name}</b><p>${visitLabel} · ${shop.city}</p></div></button>`;
  }
  if (item.type === 'collect' && item.media === 'card-graphic') return cardPullGraphic(item);
  if (item.gallery?.length > 1) return mediaCarousel(item);
  if (item.type === 'match' && item.media.startsWith('duel-')) return duelGraphic(item);
  return `<button class="journey-media media-${item.media} bare wide" data-action="activity-detail" aria-label="Open ${item.title}">${item.game ? `<span class="journey-media-tag">${item.game}</span>` : ''}</button>`;
};

const compactSummary = (item) => {
  const badgeIcons=(item.earnedBadgeIds || []).slice(0,3);
  const badgeAction=`data-action="activity-detail" data-activity="${item.id}"`;
  const badgeMarkup=badgeIcons.length ? `<button class="post-achievement-icons" ${badgeAction} aria-label="Open activity achievement details">${badgeIcons.map(()=>`<i>✦</i>`).join('')}<span>${badgeIcons.length}</span></button>` : '';
  if (item.type === 'match') return `<div class="post-summary match-summary"><span><small>Final</small><strong>${item.score}</strong></span><span><small>${item.game}</small><b>${item.duration} · ${item.metrics[2][0]} games</b></span>${badgeMarkup}</div>`;
  if (item.type === 'event') return `<div class="post-summary"><span><small>${item.date}</small><strong>${item.people}</strong></span>${badgeMarkup}</div>`;
  if (item.type === 'collect') return `<div class="post-summary"><span><small>${item.game || 'COLLECTION'}</small><strong>${item.grade || item.rarity || item.title}</strong></span>${badgeMarkup}</div>`;
  return `<div class="post-summary"><span><small>${item.game || 'VERSO'}</small><strong>${item.title}</strong></span>${badgeMarkup}</div>`;
};

const eventContext = (item) => {
  if (item.type !== 'event') return '';
  const event=db.events[item.eventId],author=userById(item.authorUserId),isHost=event?.hostId===author.id;
  return `<div class="event-post-context"><span class="host-label">${isHost?'HOST':'POST'}</span><strong>${author.name} shared a moment from ${event.title}</strong><small>${isHost?'Event host · ':''}${(item.taggedUserIds || []).length} friends tagged · ${item.attendeeIds.length} going</small></div>`;
};

const renderActivityCard = (id) => {
  const item = activities[id];
  if (!item || item.archived) return '';
  const header = item.type === 'match' ? collaborationHeader(item) : authorHeader(item);
  return `<article class="activity-card journey-card-v6 social-session-card type-${item.type}" data-activity="${id}">${header}${eventContext(item)}<p class="post-caption"><strong>${item.title}</strong>${item.copy}</p>${journeyMedia(item)}${compactSummary(item)}${item.type === 'event' ? `<div class="event-going compact">${attendeeStack(item)}<span><strong>${item.people}</strong><small>${item.attendees.length} connected profiles</small></span></div>` : ''}${socialActions(item)}</article>`;
};

function renderFeedActivities() {
  const feed = document.querySelector('#activity-feed');
  if (feed) feed.innerHTML = feedActivityOrder.filter(id=>{const a=activities[id];if(state.feedMode==='following')return db.belongsTo(a,'manny') || (a.playerIds || [a.authorUserId]).some(uid=>db.preferences.following.includes(uid));if(state.feedMode==='local')return (db.shops[shopIdForActivity(a)]?.city || userById(a.authorUserId).city)===db.users.manny.city;return true;}).map(renderActivityCard).join('');
  syncRelatedChrome();
}

const toast = (message) => {
  const el = document.querySelector('#toast');
  el.textContent = message; el.classList.add('show');
  clearTimeout(window.versoToast);
  window.versoToast = setTimeout(() => el.classList.remove('show'), 1900);
};

const panel = (title, subtitle, body, actions = '', variant = '') => `
  ${variant.includes('activity-detail-panel') ? '<button class="detail-backdrop" data-action="back" aria-label="Close activity detail"></button>' : ''}<section class="prototype-panel ${variant}" aria-label="${title}">
    <header class="panel-bar"><button class="back-btn" data-action="back" aria-label="Back" title="Back"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" /></svg></button><div><small>${subtitle}</small><h1>${title}</h1></div></header>
    <div class="panel-content">${body}</div>${actions}
  </section>`;

const statRow = (items) => `<div class="stat-row">${items.map(([n,l]) => `<div><strong>${n}</strong><span>${l}</span></div>`).join('')}</div>`;
const chip = (text) => `<span class="ui-chip">${text}</span>`;
const avatarNames = ['manny','poom','may','bank','nook','fern','nine','aim','kai'];
const avatarFor = (index, label = '') => `<span class="avatar ${avatarNames[index % avatarNames.length]}">${label}</span>`;
const qrMarkup = (seed = 7) => {
  const size = 29;
  const inFinder = (x,y,ox,oy) => x >= ox && x < ox + 7 && y >= oy && y < oy + 7;
  const finderOn = (x,y,ox,oy) => {
    const dx=x-ox, dy=y-oy;
    return dx===0 || dx===6 || dy===0 || dy===6 || (dx>=2 && dx<=4 && dy>=2 && dy<=4);
  };
  const cells = Array.from({length:size*size},(_,i)=>{
    const x=i%size,y=Math.floor(i/size);
    const corners=[[0,0],[22,0],[0,22]];
    const corner=corners.find(([ox,oy])=>inFinder(x,y,ox,oy));
    const on=corner ? finderOn(x,y,...corner) : ((x*7+y*11+seed*(x+y)+(x*y)%13)%17<8);
    return `<i class="${on?'on':''}"></i>`;
  }).join('');
  return `<div class="mock-qr real-qr" aria-label="VERSO shop check-in QR code"><span class="qr-grid">${cells}</span><b class="qr-center">V</b></div>`;
};
const partnerShopCards = (limit = Object.keys(db.shops).length) => Object.values(db.shops).slice(0,limit).map((shop,index)=>`<button data-action="open-shop" data-shop-id="${shop.id}" class="${shop.checked?'checked':'locked'} badge-style-${index%6}"><span><i>${shop.code}</i><b>✦</b></span><div><small>${shop.city.toUpperCase()}</small><strong>${shop.name.toUpperCase()}</strong><i>${shop.checked ? `Stamp ${index+1} · Badge available` : 'Visit to unlock this partner'}</i></div><em>${shop.checked?'✓':'›'}</em></button>`).join('');
const partnerStampGrid = () => Object.values(db.shops).map((shop,index)=>`<button class="passport-stamp partner-badge badge-style-${index%6} ${shop.checked?'':'locked'}" data-action="open-shop" data-shop-id="${shop.id}"><span class="partner-badge-mark"><b>${shop.code}</b><i>✦</i></span><strong>${shop.name.toUpperCase()}</strong><small>${shop.checked?shop.city.toUpperCase():'VISIT TO UNLOCK'}</small><em>${shop.checked?'✓':index-14}</em></button>`).join('');
const calendarActivity = {2:'match',4:'match',7:'badge',8:'match',11:'match',13:'event',15:'match',18:'shop',20:'match',22:'match',24:'event',27:'match',28:'match',30:'badge'};
const calendarActivityId = {2:'match-manny-pokemon',4:'match-manny-yugioh',7:'badge-first-match',8:'match-manny-lorcana',11:'match-onepiece',13:'event-lorcana',15:'match-manny-magic',18:'shop-mana',20:'match-yugioh',22:'match-lorcana',24:'event-regional',27:'match-onepiece',28:'event-community',30:'badge-tourist'};
const calendarLevel = {2:2,4:3,7:1,8:4,11:2,13:3,15:4,18:1,20:3,22:4,24:2,27:4,28:3,30:1};
const weekdayLabels = `<div class="week-labels"><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span></div>`;
const calendarIcon = {match:'VS',event:'◇',shop:'⌖',badge:'✦'};
const activityInvolvesUser = (item, userId) => !userId
  || item?.authorUserId === userId
  || item?.playerIds?.includes(userId)
  || item?.attendeeIds?.includes(userId);
state.calendarMonth='2026-08';
const calendarDays=(userId)=>Object.values(activities).filter(a=>!a.archived&&(!userId||db.belongsTo(a,userId))&&a.date?.startsWith(state.calendarMonth));
const calendarCells = (userId=null) => {
 const [year,month]=state.calendarMonth.split('-').map(Number),offset=(new Date(year,month-1,1).getDay()+6)%7,count=new Date(year,month,0).getDate(),items=calendarDays(userId);
 return Array.from({length:Math.ceil((count+offset)/7)*7},(_,i)=>{const day=i-offset+1;if(day<1||day>count)return '<i class="calendar-day empty"></i>';const hits=items.filter(a=>Number(a.date.slice(8,10))===day);return hits.length?`<button class="calendar-day has-activity" data-action="calendar-day" data-day="${day}" data-user-id="${userId||''}" aria-label="${day}: ${hits.length} activities"><span>${day}</span><b class="activity-dot ${hits[0].type}" aria-hidden="true"></b></button>`:`<i class="calendar-day"><span>${day}</span></i>`;}).join('');
};
const calendarMarkup = (userId=state.currentUserId) => {const items=calendarDays(userId),weeks=new Set(items.map(a=>Math.floor((Number(a.date.slice(8,10))-1)/7)));return `<div class="strava-calendar"><header><button data-action="calendar-month" data-delta="-1" aria-label="Previous month">‹</button><div><strong>${new Date(state.calendarMonth+'-02').toLocaleDateString('en',{month:'long',year:'numeric'})}</strong><span>${items.length} activities · ${weeks.size} active weeks</span></div><button data-action="calendar-month" data-delta="1" aria-label="Next month">›</button></header><div class="profile-calendar-shell">${weekdayLabels}<div class="profile-calendar">${calendarCells(userId)}</div></div></div>`;};



function syncRelatedChrome(){
 const mine=Object.values(activities).filter(a=>db.belongsTo(a,'manny')&&!a.archived),matches=mine.filter(a=>a.type==='match'),days=mine.map(a=>a.date).filter(Boolean).sort(),last=days.at(-1),weekly=matches.filter(a=>last&&(new Date(last)-new Date(a.date))<7*86400000),weeks=new Set(matches.map(a=>Math.floor((new Date(a.date)-new Date('2026-01-01'))/(7*86400000))));
 const widget=document.querySelector('.streak-widget');if(widget){widget.querySelector('h2').textContent=weeks.size+' weeks active';widget.querySelector('.streak-summary strong').textContent=weekly.length;widget.querySelector('.streak-summary>span:last-child').innerHTML='matches in latest week<small>'+matches.length+' total matches</small>';widget.querySelector('[data-calendar]').innerHTML=calendarCells('manny');}
 const next=Object.values(db.badges).find(b=>!db.users.manny.badgeIds.includes(b.id)),body=document.querySelector('.right-panel .badge-body');if(next&&body)body.innerHTML=`<button class="badge-art-button" data-action="open-badge" data-badge-id="${next.id}" aria-label="View ${next.name}">${badgeArtwork(next,'compact')}</button><div><strong>${next.name}</strong><p>${next.criteria}</p><small>Not yet earned</small></div>`;
}
const profileChartBars=userId=>{const own=Object.values(activities).filter(a=>db.belongsTo(a,userId)&&!a.archived),end=new Date(own.map(a=>a.date).sort().at(-1)||'2026-08-28');const counts=Array.from({length:8},(_,i)=>own.filter(a=>{const age=(end-new Date(a.date))/86400000;return age>=(7-i)*7&&age<(8-i)*7}).length),max=Math.max(1,...counts);return counts.map((count,i)=>`<i title="${count} activities" style="height:${Math.max(5,count/max*100)}%"><b>${count}</b></i>`).join('');};
const noticeContent = () => `
  <div class="notice-priority"><span class="avatar poom">P</span><div><small>SESSION CONFIRMED · NOW</small><strong>Poom confirmed your 2–1 result.</strong><p>Same rival. One more chapter.</p></div><button data-action="activity-detail" data-activity="match-onepiece">View →</button></div>
  <div class="notification-list">
    <button data-action="open-badge" data-badge-id="badge_same_rival"><span class="note-icon">✦</span><span><strong>Badge unlocked!</strong><small>Same Rival. Again. · 8m</small></span></button>
    <button data-action="open-user" data-user-id="may"><span class="avatar may">M</span><span><strong>May liked your session.</strong><small>Blue Doflamingo vs Red Zoro · 24m</small></span></button>
    <button data-action="activity-detail" data-activity="match-manny-magic"><span class="note-icon orange">VS</span><span><strong>Bam commented on game three.</strong><small>North Gate Cards · 1h</small></span></button>
    <button data-action="open-user" data-user-id="bam"><span class="avatar bank">B</span><span><strong>Bam followed you.</strong><small>Community host · 3h</small></span></button>
    <button data-action="open-event" data-event-id="community"><span class="note-icon lavender">◇</span><span><strong>Community Night starts soon.</strong><small>Mana House · Today 18:00</small></span></button>
    <button data-action="open-shop" data-shop-id="side"><span class="note-icon orange">⌖</span><span><strong>Side Deck added a new stamp.</strong><small>Passport partner update · 6h</small></span></button>
    <button data-action="activity-detail" data-activity="match-manny-lorcana"><span class="avatar fern">F</span><span><strong>Fern gave you a rematch.</strong><small>Sapphire / Steel · Yesterday</small></span></button>
    <button data-action="activity-detail" data-activity="collect-alt-art"><span class="note-icon">✦</span><span><strong>Your collector post reached 200 likes.</strong><small>The chase card finally showed up · 1d</small></span></button>
  </div>`;

const eventPostGallery = (item) => item.imageIds || item.gallery || [];

const detailVisual = (item) => {
  if (item.type === 'match' && item.gallery?.length > 1) return `<div class="match-detail-carousel">${mediaCarousel(item)}</div>`;
  if (item.type === 'match' && item.media.startsWith('duel-')) return `<div class="activity-detail-visual detail-duel minimal-duel-graphic duel-${item.media.replace('duel-','')}"><span class="duel-grid"></span><span class="duel-card-back left"><i>V</i></span><b>VS</b><span class="duel-card-back right"><i>V</i></span><em>${item.game}</em></div>`;
  if (item.type === 'match') return `<div class="activity-detail-visual match-detail ${item.visual}"><span class="activity-photo-layer media-${item.media}"></span></div>`;
  if (item.type === 'event') {
    const gallery=eventPostGallery(item);
    if (gallery.length > 1) return `<div class="event-post-detail-media">${mediaCarousel({...item,gallery})}</div>`;
    return `<button class="activity-detail-visual event-post-detail-media media-${gallery[0] || item.media}" data-action="gallery-open" data-index="0" aria-label="Open post photo"></button>`;
  }
  if (item.type === 'badge') { const badge=db.badges[item.badgeId]; return `<div class="activity-detail-visual single-badge-detail">${badgeArtwork(badge,'detail-badge-art')}<div><small>${item.eyebrow}</small><strong>${badge?.name || item.title}</strong><p>${badge?.rarity || item.rarity}</p></div></div>`; }
  if (item.type === 'collect' && item.media === 'card-graphic') return `<div class="activity-detail-visual card-detail-graphic">${cardPullGraphic(item).replace('card-pull-graphic','card-pull-graphic detail-card-pull')}</div>`;
  if (item.type === 'collect' && item.gallery?.length > 1) return `<div class="collector-detail-media"><span class="collector-grade">${item.grade || 'COLLECTOR COPY'}</span>${mediaCarousel(item)}</div>`;
  if (item.type === 'shop') return `<div class="activity-detail-visual shop-detail-art powered-stamp"><span class="stamp-energy"></span><span class="passport-stamp big"><b>${db.shops[item.shopId].code}</b><strong>${db.shops[item.shopId].name}</strong><small>${db.shops[item.shopId].city} · 2026</small></span><div><small>PARTNER CHECK-IN</small><strong>${db.shops[item.shopId].name}</strong><p>${item.achievement || "A new place in your story"}</p></div></div>`;
  return `<div class="activity-detail-visual moment-detail"><span class="activity-photo-layer media-${item.media}"></span><div><small>${item.eyebrow}</small><strong>${item.title}</strong></div></div>`;
};

const detailAuthorHeader = (item) => item.type === 'match'
  ? `<header class="activity-page-author collab-detail-author"><span class="collab-avatars linked-avatars">${item.playerIds.map(userId=>userAvatarButton(userId)).join('')}</span><div><strong>${item.playerIds.map(userId=>`<button data-action="open-user" data-user-id="${userId}">${userById(userId).shortName}</button>`).join(' <i>×</i> ')}</strong><small>${item.time} · ${item.location}</small></div><span class="verified-pill">VERSO VERIFIED ✦</span></header>`
  : (()=>{const user=userById(item.authorUserId);return `<header class="activity-page-author">${userAvatarButton(user.id)}<div><strong><button data-action="open-user" data-user-id="${user.id}">${user.name}</button></strong><small>${item.time} · ${item.location}</small></div><span class="verified-pill">${item.type==='event'?'USER POST · EVENT TAGGED':'VERSO VERIFIED ✦'}</span></header>`;})();

const matchDeckDetail = (item) => `<section class="session-decks"><header><div><small>DECKS USED IN THIS SESSION</small><h2>Session loadout</h2></div><span>${item.sessionNo || 'VERIFIED'}</span></header><div>${item.deckIds.map((deckId,index)=>{const deck=db.decks[deckId];const owner=userById(deck.ownerId);return deck.public?`<button class="session-deck-card deck-${index?'b':'a'}" data-action="open-deck" data-deck-id="${deck.id}"><span class="deck-card-cover"><i>${deck.game}</i><b>${deck.name}</b><em>V</em></span><span><small>${owner.shortName}'S PUBLIC DECK</small><strong>${deck.name}</strong><p>${deck.sessions} sessions · ${deck.winRate}% win rate</p></span><em>›</em></button>`:`<div class="session-deck-card private-deck deck-${index?'b':'a'}"><span class="deck-card-cover"><i>${deck.game}</i><b>PRIVATE DECK</b><em>🔒</em></span><span><small>${owner.shortName}'S DECK</small><strong>Deck list private</strong><p>Session result remains public.</p></span></div>`}).join('')}</div></section>`;

const earnedBadgeDetail = (item) => item.earnedBadgeIds?.length ? `<section class="session-earned"><small>${item.type==='match'?'EARNED FROM THIS SESSION':'EARNED FROM THIS POST'}</small><div>${item.earnedBadgeIds.map((badgeId)=>{const badge=db.badges[badgeId];return `<button data-action="open-badge" data-badge-id="${badgeId}">${badgeArtwork(badge,'mini')}<strong>${badge.name}</strong><i>${badge.rarity} · View badge</i></button>`;}).join('')}</div></section>` : '';
const activityComments = (item) => {
  const records=(item.commentIds||[]).map(commentId=>db.comments[commentId]).filter(Boolean);
  const fallback=[{id:'fallback',userId:'may',text:'This belongs in the story ✦',time:'now'}];
  return `<section class="comments comments-v19"><header><div><h2>Activity talk</h2><small>${records.length || 1} comments</small></div><button data-action="comment">＋ Add comment</button></header>${(records.length?records:fallback).map(comment=>{const user=userById(comment.userId);return `<article>${userAvatarButton(user.id)}<div><strong><button data-action="open-user" data-user-id="${user.id}">${user.name}</button><small>${comment.time}</small></strong><p>${comment.text}</p><footer><button data-action="like">♡ Like</button><button data-action="comment">Reply</button></footer></div></article>`}).join('')}<div class="comment-composer">${userAvatarButton('manny')}<button data-action="comment">Write a comment…</button></div></section>`;
};

const eventPostTaggedFriends = (item) => {
  const tagged=(item.taggedUserIds || []).map(userById);
  if (!tagged.length) return '';
  return `<section class="event-post-tagged"><header><div><small>TAGGED IN THIS POST</small><h2>${tagged.length} friends</h2></div></header><div>${tagged.map(user=>`<button data-action="open-user" data-user-id="${user.id}" aria-label="Open ${user.name} profile">${userAvatarVisual(user.id)}<span><strong>${user.name}</strong><small>${user.handle}</small></span><i aria-hidden="true">›</i></button>`).join('')}</div></section>`;
};

const eventPostReference = (item) => {
  const event=db.events[item.eventId],shop=db.shops[event.shopId],host=userById(event.hostId);
  return `<section class="event-post-reference"><small>LINKED EVENT</small><button data-action="open-event" data-event-id="${event.id}" aria-label="View ${event.title} event"><span class="event-reference-date"><b>${event.date.split(' ')[0]}</b>${event.date.split(' ')[1]}</span><span><strong>${event.title}</strong><small>${event.date} · ${shop.name}</small><em>Hosted by ${host.name} · ${event.attendeeIds.length} going</em></span><b>View Event →</b></button></section>`;
};

const activityDetail = (id) => {
  const item = activities[id];
  if(!item)return panel('Activity unavailable','', '<p>This activity has been removed. Go back to your previous page.</p>');
  const isEventPost=item.type==='event';
  const facts = item.type === 'match'
    ? [['FINAL SCORE',item.score],['TOTAL SESSION',item.duration],['GAME',item.game]]
    : isEventPost
      ? [['POSTED BY',item.author],['POST CONTEXT','USER MOMENT'],['LOCATION',item.location]]
      : [['POSTED BY',item.author],['ACTIVITY',item.type.toUpperCase()],['LOCATION',item.location]];
  const panelTitle=isEventPost?`Post by ${item.author}`:item.title;
  const panelSubtitle=isEventPost?`${item.time} · EVENT-TAGGED POST`:`${item.time} · ${item.location}`;
  return panel(panelTitle, panelSubtitle, `
    <article class="activity-page ${isEventPost?'event-user-post-detail':''}" data-activity="${id}">
      ${detailAuthorHeader(item)}
      ${isEventPost?`<div class="event-post-detail-intro"><small>USER POST</small><strong>${item.author} shared ${eventPostGallery(item).length>1?'photos':'a moment'} from ${item.title}</strong>${item.postRole==='host-announcement'?'<span>Event host</span>':''}</div>`:''}
      <div class="activity-page-facts">${facts.map(([label,value])=>`<span><small>${label}</small><strong>${value}</strong></span>`).join('')}</div>
      ${detailVisual(item)}
      <p class="activity-page-copy">${item.copy}</p>
      <div class="journey-achievement detail-achievement"><span>✦</span><strong>${item.achievement}</strong></div>
      ${isEventPost ? eventPostTaggedFriends(item) : ''}
      ${isEventPost ? eventPostReference(item) : ''}
      ${item.type === 'match' ? `<div class="activity-event-tools"><button class="secondary" data-action="open-shop" data-shop-id="${db.sessions[item.sessionId].shopId}">⌂ ${item.location}</button>${db.sessions[item.sessionId].eventId?`<button class="secondary" data-action="open-event" data-event-id="${db.sessions[item.sessionId].eventId}">◇ Linked event</button>`:''}</div>` : ''}
      ${item.type === 'shop' ? `<div class="activity-event-tools"><button class="secondary" data-action="open-shop" data-shop-id="${item.shopId}">⌂ Open partner shop page</button></div>` : ''}
      ${item.type === 'match' ? matchDeckDetail(item) : ''}
      ${item.earnedBadgeIds?.length ? earnedBadgeDetail(item) : ''}
      ${item.type === 'badge' ? `<div class="badge-share-note"><span>✦</span><div><strong>One badge. One moment.</strong><p>This activity and its share card contain only ${item.title}.</p></div></div>` : ''}
      
    </article>`, '', 'activity-detail-panel');
};

const explorePlayerCard = user => `<button class="explore-player-card" data-action="open-user" data-user-id="${user.id}" data-search-text="${user.name} ${user.handle} ${user.city} ${user.game} ${user.role}" aria-label="Open ${user.name} profile">${userAvatarVisual(user.id,'explore-avatar')}<span><strong>${user.name}</strong><small>${user.handle} · ${user.city}</small><i>${user.game}</i><em>${user.role}</em></span><b aria-hidden="true">›</b></button>`;
const exploreShopCard = (shop,index=0) => { const cover=db.assets[shop.coverAssetId]?.path; return `<button class="explore-shop-card badge-style-${index%6}" data-action="open-shop" data-shop-id="${shop.id}" data-search-text="${shop.name} ${shop.city} ${shop.games.join(' ')}" aria-label="Open ${shop.name}"><span class="explore-shop-art" ${cover?.startsWith('public/')?`style="background-image:linear-gradient(0deg,#0b0b0cdd,#0b0b0c25),url('./${cover}')"`:''}><i>${shop.code}</i><b>VERSO PARTNER</b></span><span><strong>${shop.name}</strong><small>⌖ ${shop.city}</small><i>${shop.games.join(' · ')}</i></span><b aria-hidden="true">›</b></button>`; };
const exploreEventCard = event => { const shop=db.shops[event.shopId],host=userById(event.hostId); return `<button class="explore-event-card" data-action="open-event" data-event-id="${event.id}" data-search-text="${event.title} ${event.game} ${shop.name} ${shop.city} ${host.name}" aria-label="Open ${event.title}"><span class="explore-event-poster" style="background-image:linear-gradient(0deg,#09090be8,#09090b18),url('./public/assets/${event.posterAsset}')"><small>${event.game}</small><strong>${event.posterCode}</strong></span><span><small>${event.date}</small><strong>${event.title}</strong><i>${shop.name} · ${shop.city}</i><em>${event.attendeeIds.length} going · Hosted by ${host.shortName}</em></span><b aria-hidden="true">›</b></button>`; };
const exploreNearbyMarkup = () => {
  const nearbyUsers=[['manny','1.2 km'],['may','2.6 km'],['bam','3.1 km']];
  const nearbyShops=[['mana','1.2 km'],['side','4.1 km'],['north','4.8 km']];
  const upcomingEvents=['community','lorcana','regional'];
  const playerRows=nearbyUsers.map(([id,distance])=>{const user=userById(id);return `<button class="nearby-row nearby-player" data-action="open-user" data-user-id="${user.id}" aria-label="Open ${user.name} profile">${userAvatarVisual(user.id,'nearby-avatar')}<span><strong>${user.name}</strong><small>${user.game} · ${user.city}</small></span><em>${distance}</em><b aria-hidden="true">›</b></button>`;}).join('');
  const shopRows=nearbyShops.map(([id,distance])=>{const shop=db.shops[id];return `<button class="nearby-row nearby-shop" data-action="open-shop" data-shop-id="${shop.id}" aria-label="Open ${shop.name}"><i class="nearby-mark">${shop.code}</i><span><strong>${shop.name}</strong><small>${shop.games.join(' · ')}</small></span><em>${distance}</em><b aria-hidden="true">›</b></button>`;}).join('');
  const eventRows=upcomingEvents.map(id=>{const event=db.events[id],shop=db.shops[event.shopId],date=event.date.split(' · ')[0];return `<button class="nearby-row nearby-event" data-action="open-event" data-event-id="${event.id}" aria-label="Open ${event.title}"><i class="nearby-mark">${event.posterCode.split('-')[0]}</i><span><strong>${event.title}</strong><small>${shop.name} · ${event.attendeeIds.length} going</small></span><em>${date}</em><b aria-hidden="true">›</b></button>`;}).join('');
  const group=(title,pane,rows)=>`<section class="nearby-group"><header><h2>${title}</h2><button data-action="explore-tab" data-pane="${pane}" aria-label="View all ${title.toLowerCase()}">View all →</button></header><div>${rows}</div></section>`;
  return `<div class="explore-nearby" aria-label="Nearby discovery">${group('Nearby Players','players',playerRows)}${group('Nearby Partner Shops','shops',shopRows)}${group('Upcoming Events','events',eventRows)}</div>`;
};
const exploreSearchMarkup = query => {
  const q=query.trim().toLocaleLowerCase();
  const users=Object.values(db.users).filter(user=>`${user.name} ${user.handle} ${user.city} ${user.game} ${user.role}`.toLocaleLowerCase().includes(q));
  const shops=Object.values(db.partnerShops).filter(shop=>`${shop.name} ${shop.city} ${shop.games.join(' ')}`.toLocaleLowerCase().includes(q));
  const events=Object.values(db.events).filter(event=>{const shop=db.shops[event.shopId],host=userById(event.hostId);return `${event.title} ${event.game} ${shop.name} ${shop.city} ${host.name}`.toLocaleLowerCase().includes(q);});
  const group=(title,count,content)=>count?`<section class="explore-result-group"><header><h2>${title}</h2><span>${count}</span></header>${content}</section>`:'';
  return `<header class="explore-results-head"><div><small>SEARCH RESULTS</small><h2>${users.length+shops.length+events.length} found for “${escapeText(query.trim())}”</h2></div></header>${group('Players',users.length,`<div class="explore-player-grid">${users.map(explorePlayerCard).join('')}</div>`)}${group('Partner Shops',shops.length,`<div class="explore-shop-grid">${shops.map(exploreShopCard).join('')}</div>`)}${group('Events',events.length,`<div class="explore-event-grid">${events.map(exploreEventCard).join('')}</div>`)}${users.length+shops.length+events.length?'':'<div class="explore-empty"><span>⌕</span><strong>No matches yet</strong><p>Try a player name, game, city, shop, or event.</p></div>'}`;
};
const setExploreSearch = query => {
  const input=overlay.querySelector('[data-field="explore-search"]'),results=overlay.querySelector('[data-explore-results]'),clear=overlay.querySelector('[data-action="explore-search-clear"]');
  if(!input||!results)return;
  const hasQuery=Boolean(query.trim());
  clear.hidden=!hasQuery;
  results.hidden=!hasQuery;
  overlay.querySelectorAll('[data-explore-pane]').forEach(pane=>pane.hidden=hasQuery || !pane.classList.contains('active'));
  if(hasQuery)results.innerHTML=exploreSearchMarkup(query);
};
const exploreScreen = () => panel('Explore', 'PLAYERS · SHOPS · EVENTS', `
    <label class="search-box explore-search"><span aria-hidden="true">⌕</span><input data-field="explore-search" type="search" aria-label="Search players, partner shops and events" placeholder="Search players, partner shops or events" autocomplete="off" /><button data-action="explore-search-clear" aria-label="Clear search" hidden>×</button></label>
    <div class="segment explore-tabs" role="tablist" aria-label="Explore categories"><button class="active" role="tab" aria-selected="true" data-action="explore-tab" data-pane="map">Map</button><button role="tab" aria-selected="false" data-action="explore-tab" data-pane="players">Players</button><button role="tab" aria-selected="false" data-action="explore-tab" data-pane="shops">Partner Shops</button><button role="tab" aria-selected="false" data-action="explore-tab" data-pane="events">Events</button></div>
    <section class="explore-pane explore-map-pane active" data-explore-pane="map">
      <div class="explore-map active" aria-label="Mock map of nearby TCG activity">
        <div class="map-roads"><i></i><i></i><i></i><i></i></div>
        <button class="map-pin shop p1" data-action="open-shop" data-shop-id="mana"><span>⌂</span><b>Mana House</b><small>1.2 km</small></button>
        <button class="map-pin battle p2" data-action="record"><span>VS</span><b>Open Battle</b><small>4 players</small></button>
        <button class="map-pin shop p3" data-action="open-shop" data-shop-id="side"><span>⌂</span><b>Side Deck</b><small>4.1 km</small></button>
        <button class="map-pin event p4" data-action="open-event" data-event-id="community"><span>◇</span><b>Community Night</b><small>${db.events.community.attendeeIds.length} going</small></button>
        <span class="you-pin"><i class="avatar manny">Manny</i><b>You</b></span>
        <div class="map-key"><span><i class="shop-dot"></i>Shop</span><span><i class="battle-dot"></i>Battle</span><span><i class="event-dot"></i>Event</span></div>
      </div>
      ${exploreNearbyMarkup()}
    </section>
    <section class="explore-pane explore-directory" data-explore-pane="players"><header><div><small>DISCOVER PLAYERS</small><h2>Players around the community</h2></div><span>${Object.keys(db.users).length} profiles</span></header><div class="explore-player-grid">${Object.values(db.users).map(explorePlayerCard).join('')}</div></section>
    <section class="explore-pane explore-directory" data-explore-pane="shops"><header><div><small>VERSO NETWORK</small><h2>Partner Shops</h2></div><span>${Object.keys(db.partnerShops).length} locations</span></header><div class="explore-shop-grid">${Object.values(db.partnerShops).map(exploreShopCard).join('')}</div></section>
    <section class="explore-pane explore-directory" data-explore-pane="events"><header><div><small>UPCOMING</small><h2>Events</h2></div><span>${Object.keys(db.events).length} events</span></header><div class="explore-event-grid">${Object.values(db.events).map(exploreEventCard).join('')}</div></section>
    <section class="explore-search-results" data-explore-results hidden aria-live="polite"></section>`);

const screens = {
  explore: () => exploreScreen(),

  player: () => profileScreen(state.currentUserId),
  profile: () => profileScreen('manny'),

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
    <section class="content-section"><header><h2>Recent matches</h2></header><button class="match-row" data-action="activity-detail" data-activity="match-onepiece"><b class="win-text">WIN 2–1</b><span>vs Poom<small>Mana House · Aug 27</small></span><i>›</i></button><button class="match-row" data-action="activity-detail" data-activity="match-manny-pokemon"><b class="loss-text">LOSS 1–2</b><span>vs May<small>Mana House · Aug 21</small></span><i>›</i></button></section>`),

  passport: () => panel('Passport', 'MANNY · SEASON 2026', `
    <div class="passport-cover passport-adventure"><div><span class="passport-logo">V<span>✦</span></span><small>VERSO JOURNEY INDEX</small><strong>CHECK IN.<br>COLLECT THE WORLD.</strong><p>Your card-shop adventure, remembered one badge at a time.</p><label>PLAYER #0001 · MANNY</label></div><span class="passport-route-progress"><b>15</b><small>OF 18 PARTNER NODES FOUND</small></span></div>
    ${statRow([['15','partner shops'],['37','events'],['9','cities'],['24','stamps']])}
    <section class="passport-scan-card qr-passport-v17"><div>${qrMarkup(7)}<small>PERSONAL CHECK-IN QR</small></div><span><p>SCAN AT A VERSO PARTNER</p><h2>Check in. Unlock the place.</h2><small>Each verified scan adds a shop stamp and progresses that partner’s badge.</small><code>VERSO://CHECKIN/MANNY-0001</code><button class="primary" data-action="scan-shop">Simulate verified scan →</button></span></section>
    <section class="content-section partner-network"><header><div><small>18 VERSO PARTNER SHOPS</small><h2>Places that remember your visit</h2></div><button data-screen="explore">Open map →</button></header><div class="partner-shop-grid">${partnerShopCards(8)}</div></section>
    <section class="content-section passport-collection"><header><div><h2>Partner stamps & badges</h2><small>15 earned · 3 places left to discover</small></div><span>15 / 18</span></header><div class="stamp-grid">${partnerStampGrid()}</div></section>
    <section class="content-section"><header><h2>Journey milestones</h2></header><div class="timeline"><p><b>Aug 27</b><span>Mana House stamp unlocked</span></p><p><b>Aug 21</b><span>VERSO TCG Fest attended</span></p><p><b>Aug 08</b><span>Bangkok city unlocked</span></p></div></section>`, `<footer class="panel-actions"><button class="primary" data-action="share" data-activity="shop-mana">↗ Share passport</button></footer>`),

  shop: () => panel('Mana House', 'PARTNER SHOP · CHIANG MAI', `
    <div class="shop-hero"><div class="shop-banner"><span>⌂</span><b>VERSO PARTNER</b></div><div><h2>Mana House Chiang Mai</h2><p>Where the north comes to play.</p><div>${chip('ONE PIECE')}${chip('POKÉMON')}${chip('GUNDAM')}</div></div></div>
    ${statRow([['2.4K','followers'],['384','check-ins'],['1.8K','matches'],['12','events']])}
    <div class="action-grid"><button class="secondary" data-action="follow">${state.following?'Following ✓':'＋ Follow'}</button><button class="primary" data-action="checkin">${state.checkedIn?'Checked in ✓':'⌖ Check in'}</button></div>
    <section class="content-section"><header><h2>Upcoming events</h2><button>View all</button></header><button class="list-row" data-screen="event"><span class="date-chip"><b>28</b>AUG</span><span><strong>One Piece Weekly</strong><small>18:00 · 16 players</small></span><i>›</i></button></section>
    <section class="content-section"><header><h2>Shop info</h2></header><div class="detail-card"><dl><div><dt>Location</dt><dd>Chang Moi, Chiang Mai</dd></div><div><dt>Hours</dt><dd>12:00–22:00 daily</dd></div><div><dt>Community</dt><dd>Friendly · Competitive</dd></div></dl></div></section>`),

  event: () => panel('One Piece Weekly', 'EVENT · MANA HOUSE', `
    <div class="event-detail-grid"><div class="event-poster-large"><span class="poster-logo">V<span>✦</span></span><small>EVERY FRIDAY · CHIANG MAI</small><strong>ONE PIECE<br>WEEKLY</strong><p>PLAY · COLLECT · CONNECT</p><b>28 AUG · 18:00</b></div><div class="event-information"><p>EVENT INFORMATION</p><h2>Weekly Local Night</h2><label>● ON GOING · REGISTRATION OPEN</label><div class="event-info-list"><span><small>DATE & TIME</small><strong>Friday, 28 August · 18:00</strong></span><span><small>GAME & FORMAT</small><strong>One Piece · Standard · Best of 3</strong></span><span><small>ENTRY & CAPACITY</small><strong>฿150 · 16 seats</strong></span><span><small>EXPECTED DURATION</small><strong>2 hours · 3 rounds</strong></span></div><div class="event-top-actions"><button class="secondary" data-action="save-event">${db.preferences.savedEvents.includes(event.id)?'Saved ✓':'♡ Save'}</button><button class="secondary" data-action="calendar">＋ Add to Calendar</button><button class="primary" data-action="join">${event.attendeeIds.includes('manny')?'Joined ✓':'Join event'}</button></div></div></div>
    <div class="event-going">${attendeeStack(activities['event-community'])}<span><strong>18 people are going</strong><small>Manny, Poom, May and 15 others</small></span><button>See all →</button></div>
    <section class="event-location"><header><div><small>LOCATION</small><h2>Mana House Chiang Mai</h2><p>Chang Moi Road · 1.2 km from you</p></div><button class="secondary" data-action="location">⌖ Open location</button></header><div class="event-map"><i></i><i></i><i></i><span class="map-shop-pin">⌂<b>Mana House</b></span><span class="map-you-pin">●<b>You</b></span></div></section>
    <section class="event-notes"><h2>About this event</h2><p>Friday night cards, familiar faces, and one more page in your TCG story. Deck lists are optional; sleeves and a positive table attitude are required.</p><div>${chip('BEGINNER FRIENDLY')}${chip('PRIZE SUPPORT')}${chip('VERSO CHECK-IN')}</div></section>`),

  notifications: () => panel('Notifications', '6 NEW', noticeContent()),
};

const deckScreen = (deckId = state.currentDeckId) => {
  const deck=db.decks[deckId] || db.decks['deck-manny-blue'];
  const owner=userById(deck.ownerId);
  const relatedSessions=Object.values(db.sessions).filter(session=>session.deckIds.includes(deck.id));
  return panel(deck.name, `${deck.game} · ${deck.public?'PUBLIC':'PRIVATE'}`, `<div class="deck-hero deck-hero-v19"><span class="deck-card-cover deck-color-${deck.color}"><i>${deck.game}</i><b>${deck.name}</b><em>V</em></span><div><p>${deck.format} · OWNER</p><h2>${deck.name}</h2><button class="deck-owner-link" data-action="open-user" data-user-id="${owner.id}">${userAvatarVisual(owner.id)}<span><small>BUILT BY</small><strong>${owner.name}</strong></span></button><label>${deck.public?'PUBLIC DECK · SESSION LINKS ENABLED':'PRIVATE DECK · SESSION RESULTS ONLY'}</label></div></div>${statRow([[String(deck.sessions),'sessions'],[`${deck.winRate}%`,'win rate'],[String(deck.cards),'cards'],[deck.updated,'updated']])}<section class="content-section"><header><h2>Deck list</h2><span>${deck.public?'Visible to everyone':'Owner only'}</span></header>${deck.public?`<div class="deck-list">${['4 × Core engine','4 × Primary searcher','4 × Interaction slot','3 × Matchup answer','2 × Finisher','Remaining support cards'].map((card,index)=>`<div><span>${card}</span><i>${index<3?'CORE':'TECH'}</i></div>`).join('')}</div>`:'<div class="private-state">🔒<strong>Private deck</strong><p>The deck was used in a verified session, but its list is hidden by the owner.</p></div>'}</section><section class="content-section"><header><h2>Linked sessions</h2><small>${relatedSessions.length} verified records</small></header><div class="deck-linked-sessions">${relatedSessions.length?relatedSessions.map(session=>`<button data-action="activity-detail" data-activity="${session.activityId}"><span>${session.number}</span><strong>${session.title}</strong><small>${session.score.join(' — ')} · ${db.shops[session.shopId].name}</small><em>›</em></button>`).join(''):'<p>No linked sessions yet.</p>'}</div></section>`);
};

const shopScreen = (shopId = state.currentShopId || 'mana') => {
  const shop=db.shops[shopId] || db.shops.mana;
  const shopEvents=Object.values(db.events).filter(event=>event.shopId===shop.id);
  const shopSessions=Object.values(db.sessions).filter(session=>session.shopId===shop.id&&!activities[session.activityId]?.archived);
  const stamp=Object.values(db.passportStamps).find(record=>record.userId==='manny'&&record.shopId===shop.id);
  const cover=db.assets[shop.coverAssetId]?.path;
  const listings=shop.marketplaceListingIds.map(id=>db.marketplaceListings[id]).filter(Boolean);
  return panel(shop.name, `PARTNER SHOP · ${shop.city.toUpperCase()}`, `<div class="shop-cover-v193 ${cover?.startsWith('public/')?'has-photo':''}" ${cover?.startsWith('public/')?`style="background-image:linear-gradient(0deg,#09090be8,#09090b20 65%),url('./${cover}')"`:''}><span>${shop.code}</span><div><small>VERSO VERIFIED PARTNER</small><h2>${shop.name}</h2><p>${shop.description}</p></div><b>${stamp?'STAMPED ✓':'NOT YET VISITED'}</b></div><div class="shop-info-strip"><span><small>ADDRESS</small><strong>${shop.address}</strong></span><span><small>OPENING HOURS</small><strong>${shop.openingHours}</strong></span><span><small>PARTNER STATUS</small><strong>Verified · ${shop.city}</strong></span></div>${statRow([[String(shopSessions.length),'sessions'],[String(shopEvents.length),'events'],[stamp?String(stamp.visits):'0','visits'],[String(listings.length),'market listings']])}<div class="action-grid"><button class="secondary" data-action="follow">＋ Follow</button><button class="secondary" data-action="shop-badge" data-shop-id="${shop.id}">✦ Shop Badge</button><button class="primary" data-action="checkin">${stamp?'Check in again':'⌖ Check in'}</button></div><section class="content-section"><header><h2>Events at this shop</h2><span>${shopEvents.length} events</span></header><div class="list-stack">${shopEvents.length?shopEvents.map(event=>`<button class="list-row" data-action="open-event" data-event-id="${event.id}"><span class="date-chip"><b>${event.date.split(' ')[0]}</b>${event.date.split(' ')[1]}</span><span><strong>${event.title}</strong><small>${event.game} · ${event.attendeeIds.length} going</small></span><i>›</i></button>`).join(''):'<p class="empty-state">No upcoming events yet.</p>'}</div></section>${listings.length?`<section class="content-section"><header><h2>Marketplace at ${shop.name}</h2><span>${listings.length} listing</span></header><div class="market-grid">${listings.map(marketplaceListingCard).join('')}</div></section>`:''}<section class="content-section"><header><h2>Verified sessions here</h2></header><div class="deck-linked-sessions">${shopSessions.map(session=>`<button data-action="activity-detail" data-activity="${session.activityId}"><span>${session.number}</span><strong>${session.title}</strong><small>${session.duration} · ${session.score.join(' — ')}</small><em>›</em></button>`).join('') || '<p class="empty-state">No sessions yet.</p>'}</div></section>`);
};

const eventScreen = (eventId = state.currentEventId || 'community') => {
  const event=db.events[eventId] || db.events.community;
  const host=userById(event.hostId),shop=db.shops[event.shopId];
  const activity={attendeeIds:event.attendeeIds};
  return panel(event.title, `EVENT · ${shop.name.toUpperCase()}`, `<div class="event-detail-grid"><div class="event-poster-large verso-event-poster" style="--poster-image:url('./public/assets/${event.posterAsset}')"><span class="poster-logo">V<span>✦</span></span><small>${event.game}</small><strong>${event.title}</strong><p>PLAY · COLLECT · CONNECT</p><b>${event.date}</b></div><div class="event-information"><p>EVENT INFORMATION</p><h2>${event.title}</h2><label>● REGISTRATION OPEN</label><div class="event-info-list"><span><small>DATE & TIME</small><strong>${event.date}</strong></span><span><small>GAME</small><strong>${event.game}</strong></span><span><small>HOST</small><button data-action="open-user" data-user-id="${host.id}">${host.name} →</button></span><span><small>PARTNER SHOP</small><button data-action="open-shop" data-shop-id="${shop.id}">${shop.name} →</button></span></div><div class="event-top-actions"><button class="secondary" data-action="save-event">♡ Save</button><button class="secondary" data-action="calendar">＋ Add to Calendar</button><button class="primary" data-action="join">Join event</button></div></div></div><div class="event-going">${attendeeStack(activity)}<span><strong>${event.attendeeIds.length} connected users are going</strong><small>${event.attendeeIds.map(id=>userById(id).shortName).join(', ')}</small></span></div><section class="event-location"><header><div><small>LOCATION</small><h2>${shop.name}</h2><p>${shop.address} · ${shop.city}</p></div><button class="secondary" data-action="open-shop" data-shop-id="${shop.id}">Open Partner Shop →</button></header><div class="event-map"><i></i><i></i><i></i><span class="map-shop-pin">⌂<b>${shop.name}</b></span><span class="map-you-pin">●<b>You</b></span></div></section><section class="event-notes"><h2>About this event</h2><p>${event.game} players meet at a verified VERSO Partner Shop. Join the table, check in, and keep the event in your connected journey.</p><div>${chip('COMMUNITY EVENT')}${chip('PARTNER CHECK-IN')}${chip(event.game)}</div></section><section class="content-section"><header><h2>People at this event</h2><span>The people making it happen</span></header><div class="event-user-grid">${event.attendeeIds.map(userId=>{const user=userById(userId);return `<button data-action="open-user" data-user-id="${user.id}">${userAvatarVisual(user.id)}<strong>${user.name}</strong><small>${user.role}</small></button>`}).join('')}</div></section>`);
};

const marketplaceListingCard = listing => {
  const shop=db.shops[listing.shopId];
  const seller=listing.sellerType==='user'?db.users[listing.sellerId]:shop;
  return `<article class="market-listing" data-listing-id="${listing.id}"><button class="market-art market-${listing.id.replace('listing_','')}" data-action="open-listing" data-listing-id="${listing.id}" aria-label="Open ${listing.title}"><span>${listing.game}</span><b>${listing.title.split(' ').slice(0,2).join(' ')}</b><i>V</i></button><div><small>${listing.condition} · ${listing.game}</small><h3>${listing.title}</h3><button data-action="${listing.sellerType==='user'?'open-user':'open-shop'}" ${listing.sellerType==='user'?`data-user-id="${listing.sellerId}"`:`data-shop-id="${listing.shopId}"`}>${seller.name} →</button><footer><strong>฿${listing.price.toLocaleString()}</strong><button data-action="open-listing" data-listing-id="${listing.id}">Details</button></footer></div></article>`;
};

const marketplaceScreen = () => { const listings=Object.values(db.marketplaceListings),partner=listings.filter(x=>x.sellerType==='shop'),community=listings.filter(x=>x.sellerType==='user'); return panel('Marketplace','PARTNER SHOPS · COMMUNITY SELLERS',`<section class="market-hero"><div><small>VERSO MARKETPLACE</small><h2>Cards move.<br>Stories continue.</h2><p>Discover listings from connected players and verified Partner Shops. Find a new favorite, or pass a good card on to its next player.</p></div><span class="market-hero-card"><i>V</i><b>TRADE<br>WITH TRUST</b><small>PLAY · COLLECT · CONNECT</small></span></section><section class="content-section market-section partner-market"><header><div><small>${partner.length} VERIFIED LISTINGS</small><h2>Partner Shop inventory</h2></div><span>Verified stock and pickup</span></header><div class="market-grid">${partner.map(marketplaceListingCard).join('')}</div></section><section class="content-section market-section user-market"><header><div><small>${community.length} COMMUNITY LISTINGS</small><h2>From connected players</h2></div><span>User sales and trades</span></header><div class="market-grid">${community.map(marketplaceListingCard).join('')}</div></section><section class="market-reward">${badgeArtwork(db.badges.badge_shop_supporter,'compact')}<div><small>MARKETPLACE BADGE PROGRESS</small><h2>Shop Supporter</h2><p>Purchase from 5 verified Partner Shops.</p><button data-action="open-badge" data-badge-id="badge_shop_supporter">View badge →</button></div><strong>2 / 5</strong></section>`); };

const listingScreen = (listingId=state.currentListingId) => {
  const listing=db.marketplaceListings[listingId] || Object.values(db.marketplaceListings)[0];
  const shop=db.shops[listing.shopId];
  const seller=listing.sellerType==='user'?db.users[listing.sellerId]:shop;
  return panel(listing.title,`${listing.condition.toUpperCase()} · ${listing.game}`,`<div class="listing-detail"><div class="market-art market-${listing.id.replace('listing_','')}"><span>${listing.game}</span><b>${listing.title}</b><i>V</i></div><div><small>${listing.sellerType==='shop'?'PARTNER SHOP LISTING':'COMMUNITY LISTING'}</small><h2>${listing.title}</h2><strong>฿${listing.price.toLocaleString()}</strong><p>Arrange a trade with the seller and meet at the partner shop below.</p><button class="seller-link" data-action="${listing.sellerType==='user'?'open-user':'open-shop'}" ${listing.sellerType==='user'?`data-user-id="${listing.sellerId}"`:`data-shop-id="${listing.shopId}"`}>${seller.name} · ${listing.sellerType==='shop'?'Verified Partner':'Connected Player'} →</button><button class="seller-link" data-action="open-shop" data-shop-id="${shop.id}">Pickup at ${shop.name} →</button><button class="seller-link" data-action="open-badge" data-badge-id="${listing.badgeRewardId}">Reward: ${db.badges[listing.badgeRewardId].name} →</button></div></div>`,`<footer class="panel-actions"><button class="secondary" data-action="share-listing" data-listing-id="${listing.id}">↗ Copy listing link</button><button class="primary" data-action="purchase">Message seller</button></footer>`,'listing-detail-panel');
};

screens.deck = () => deckScreen();
screens.decks = () => panel('Deck Database', `${Object.keys(db.decks).length} DECKS · V1`, `<div class="profile-deck-grid">${Object.values(db.decks).map(deck=>`<button class="profile-deck-tile ${deck.color}" data-action="open-deck" data-deck-id="${deck.id}"><span class="deck-cover"><i>${deck.game}</i><b>${deck.name}</b><em>${deck.public?'▱':'🔒'}</em></span><span><small>${deck.public?'PUBLIC':'PRIVATE'}</small><strong>${deck.name}</strong><i>${userById(deck.ownerId).name} · ${deck.sessions} sessions</i></span></button>`).join('')}</div>`);
screens.shop = () => shopScreen();
screens.event = () => eventScreen();
screens.marketplace = () => marketplaceScreen();
screens.settings = () => panel('Settings', 'ACCOUNT · PROTOTYPE', `<section class="settings-account"><div>${userAvatarVisual('manny','xl')}<span><small>SIGNED IN AS</small><h2>Manny S.</h2><p>@manny</p></span></div><div class="settings-list"><button data-action="open-archive"><span>▱</span><strong>Archived activities</strong><i>›</i></button><button disabled><span>◉</span><strong>Appearance</strong><small>Dark · VERSO Ink</small><i>›</i></button><button disabled><span>⌁</span><strong>Privacy</strong><small>Public profile · Public activities</small><i>›</i></button><button data-screen="notifications"><span>♢</span><strong>Notifications</strong><small>Matches, events and badges</small><i>›</i></button></div><button class="logout-button" data-action="logout">Log out to Homepage</button><p>Prototype account data remains available after logout.</p></section>`);

const profileActivityActions = (likes, comments) => `<footer class="activity-actions"><button data-action="like"><span>♡</span><b>${likes}</b></button><button><span>◯</span>${comments}</button><button data-action="share"><span>↗</span>Share</button></footer>`;

const userSessionActivityIds = userId => db.activityIdsFor(userId);
const userDecks = (userId) => Object.values(db.decks).filter(deck=>deck.ownerId===userId);
const userEventIds = (userId) => Object.values(db.events).filter(event=>event.hostId===userId || event.attendeeIds.includes(userId)).map(event=>event.id);
const profileTabs = (active) => [['overview','Overview'],['sessions','Sessions'],['passport','Passport'],['decks','Decks'],['badges','Badges'],['listings','Listings']].map(([key,label])=>`<button class="${active===key?'active':''}" data-action="profile-tab" data-tab="${key}">${label}</button>`).join('');
const profileActionsMarkup = (user, own) => {
  if (own) return `<button class="profile-action-button" data-action="edit-profile" title="Edit profile" aria-label="Edit profile">${profileActionIcon('edit')}<b>Edit Profile</b></button><button class="profile-action-button qr-btn" data-action="profile-qr" title="QR code" aria-label="QR code">${profileActionIcon('qr')}<b>QR Code</b></button><button class="profile-action-button" data-screen="settings" title="Settings" aria-label="Settings">${profileActionIcon('settings')}<b>Settings</b></button>`;
  const following=db.preferences.following.includes(user.id);
  return `<div class="profile-follow-control">${following?`<button class="profile-follow-button is-following" data-action="follow-menu" aria-expanded="false">${profileActionIcon('following')}<b>Following</b><span>✓</span></button>`:`<button class="profile-follow-button is-follow primary" data-action="follow">${profileActionIcon('follow')}<b>Follow</b></button>`}</div>`;
};

function profileBody(userId, active) {
  const user=userById(userId),sessionIds=userSessionActivityIds(userId),decksForUser=userDecks(userId),eventIds=userEventIds(userId);
  if (active === 'sessions') return `<section class="content-section sessions-head"><header><div><small>VERIFIED ACTIVITY</small><h2>Sessions</h2></div><span>${sessionIds.length} total</span></header><div class="filter-row">${chip('ALL')}${[...new Set(sessionIds.map(id=>activities[id].game))].map(chip).join('')}</div></section><div class="profile-session-feed unified-session-feed">${sessionIds.length?sessionIds.map(renderActivityCard).join(''):'<div class="empty-state"><strong>No sessions yet</strong><p>This player has not recorded a session.</p></div>'}</div>`;

  if (active === 'decks') return `<section class="content-section"><header><div><small>PLAY LOADOUT</small><h2>Decks</h2></div><span>${decksForUser.length} records</span></header><div class="profile-deck-grid">${decksForUser.length?decksForUser.map(deck=>`<button class="profile-deck-tile ${deck.color}" data-action="open-deck" data-deck-id="${deck.id}"><span class="deck-cover"><i>${deck.game}</i><b>${deck.name}</b><em>${deck.public?'▱':'🔒'}</em></span><span><small>${deck.public?'PUBLIC · CLICK TO VIEW':'PRIVATE · OWNER ONLY'}</small><strong>${deck.name}</strong><i>${deck.sessions} sessions · ${deck.winRate}% WR</i></span></button>`).join(''):'<p class="empty-state">No deck records for this user.</p>'}</div></section>`;

  if (active === 'passport') {
    const stamps=Object.values(db.passportStamps).filter(stamp=>stamp.userId===userId);
    const visited=new Set(stamps.map(stamp=>stamp.shopId));
    const unvisited=Object.values(db.partnerShops).filter(shop=>!visited.has(shop.id));
    const cities=new Set(stamps.map(stamp=>db.shops[stamp.shopId].city));
    const shopCard=(shop,earned,index)=>`<button class="passport-stamp partner-badge badge-style-${index%6} ${earned?'earned':'locked'}" data-action="open-shop" data-shop-id="${shop.id}"><span class="partner-badge-mark"><b>${shop.code}</b><i>✦</i></span><strong>${shop.name}</strong><small>${earned?`${shop.city} · STAMPED`:`${shop.city} · NOT YET VISITED`}</small><em>${earned?'✓':'○'}</em></button>`;
    return `<section class="content-section passport-v193"><header><div><small>PARTNER JOURNEY</small><h2>Passport</h2></div><span>${stamps.length} / ${Object.keys(db.partnerShops).length} visited</span></header><div class="passport-cover passport-adventure profile-passport-cover"><div><span class="passport-logo">V<span>✦</span></span><small>VERSO JOURNEY INDEX</small><strong>CHECK IN.<br>COLLECT THE WORLD.</strong><p>Your card-shop adventure, remembered one badge at a time.</p><label>${user.handle.toUpperCase()}</label></div><span class="passport-route-progress"><b>${stamps.length}</b><small>OF ${Object.keys(db.partnerShops).length} PARTNER NODES FOUND</small></span></div>${statRow([[String(stamps.length),'visited'],[String(unvisited.length),'not yet visited'],[String(Object.keys(db.partnerShops).length),'total shops'],[String(cities.size),'cities']])}<section class="passport-scan-card qr-passport-v17"><div>${qrMarkup(user.level)}<small>PERSONAL CHECK-IN QR</small></div><span><p>${user.handle.toUpperCase()}</p><h2>Check in. Unlock the place.</h2><small>A verified scan creates one Passport Stamp linked to one Partner Shop and its Shop Badge.</small>${userId==='manny'?'<button class="primary" data-action="scan-shop">Simulate verified scan →</button>':''}</span></section><section class="passport-group"><header><h3>Visited / stamped</h3><span>${stamps.length}</span></header><div class="stamp-grid">${stamps.map((stamp,index)=>shopCard(db.shops[stamp.shopId],true,index)).join('') || '<p>No stamps yet.</p>'}</div></section><section class="passport-group"><header><h3>Not yet visited</h3><span>${unvisited.length}</span></header><div class="stamp-grid">${unvisited.map((shop,index)=>shopCard(shop,false,index+stamps.length)).join('')}</div></section></section>`;
  }

  if (active === 'badges') {
    const earned=new Set(user.badgeIds);
    const earnedBadges=Object.values(db.badges).filter(badge=>earned.has(badge.id));
    const lockedBadges=Object.values(db.badges).filter(badge=>!earned.has(badge.id));
    const badgeCard=(badge,isEarned)=>`<button class="${isEarned?'earned':'locked'} badge-record" data-action="open-badge" data-badge-id="${badge.id}">${badgeArtwork(badge)}<strong>${badge.name}</strong><small>${badge.category} · ${badge.rarity}</small><i>${isEarned?'EARNED':`0 / ${badge.targetValue} · ${badge.criteria}`}</i></button>`;
    return `<section class="content-section badge-library"><header><div><small>ACHIEVEMENT SYSTEM</small><h2>Badge Collection</h2></div><span>${earnedBadges.length} earned · ${lockedBadges.length} locked</span></header><h3>Earned</h3><div class="badge-art-grid">${earnedBadges.map((badge,index)=>badgeCard(badge,true,index)).join('')}</div><h3>Locked / in progress</h3><div class="badge-art-grid locked-grid">${lockedBadges.map((badge,index)=>badgeCard(badge,false,index)).join('')}</div></section>`;
  }

  if (active === 'listings') { const listings=Object.values(db.marketplaceListings).filter(item=>item.sellerType==='user'&&item.sellerId===userId); return `<section class="content-section profile-listings"><header><div><small>COMMUNITY MARKETPLACE</small><h2>Listings & history</h2></div><span>${listings.length} active</span></header><div class="market-grid">${listings.map(marketplaceListingCard).join('') || '<p class="empty-state">No active listings.</p>'}</div><div class="listing-history"><h3>Trade history</h3><p>No completed trades yet.</p></div></section>`; }

  const albumPhotos=user.albumPhotoIds.map(photoId=>db.photos[photoId]).filter(db.isPhoto);
  const recentIds=[...new Set([...sessionIds,...user.albumActivityIds.filter(id=>activities[id])])].slice(0,5);
  const pinned=user.pinnedBadgeIds.map(badgeId=>db.badges[badgeId]).filter(Boolean);
  return `<section class="content-section pinned-badges"><header><div><small>PROFILE IDENTITY</small><h2>Pinned Badges</h2></div><span>${pinned.length} pinned</span></header><div>${pinned.map(badge=>`<button data-action="open-badge" data-badge-id="${badge.id}">${badgeArtwork(badge)}<strong>${badge.name}</strong><small>${badge.category} · ${badge.rarity}</small></button>`).join('')}</div></section><section class="content-section profile-album"><header><h2>Photo Album</h2><span>${albumPhotos.length} photos</span></header><div class="profile-photo-grid">${albumPhotos.map(photo=>`<button class="profile-photo media-${photo.visualKey}" data-action="photo-viewer" data-photo-id="${photo.id}" aria-label="Open photo"></button>`).join('') || '<p class="empty-state">No photos posted yet.</p>'}</div></section><section class="content-section stats-lab"><header><h2>Stats at a glance</h2><button data-action="profile-tab" data-tab="sessions">Full sessions →</button></header><div class="chart-card"><div><small>LAST 8 WEEKS</small><strong>${sessionIds.length}</strong><span>${decksForUser.length} decks · ${eventIds.length} events</span></div><div class="bar-chart">${profileChartBars(userId)}</div></div></section><section class="content-section streak-profile"><header><h2>Play calendar</h2><span>${sessionIds.length} linked sessions</span></header>${calendarMarkup(userId)}<div class="activity-key"><span><i class="match"></i>Session</span><span><i class="event"></i>Event</span><span><i class="shop"></i>Shop</span><span><i class="badge"></i>Badge</span></div></section><section class="content-section"><header><h2>Recent journey</h2><button data-action="profile-tab" data-tab="sessions">Sessions →</button></header><div class="profile-activity-list">${recentIds.map(id=>{const item=activities[id];return `<button data-action="activity-detail" data-activity="${id}"><span class="activity-symbol ${item.type}">${item.type==='match'?'VS':'✦'}</span><span><strong>${item.title}</strong><i>${item.location}</i></span><em>${item.time}</em></button>`}).join('')}</div></section>`;
}

function profileScreen(userId = 'manny', active = 'overview') {
  const user=userById(userId),sessionIds=userSessionActivityIds(user.id),decksForUser=userDecks(user.id),eventsForUser=userEventIds(user.id),own=user.id==='manny';
  const xp=user.xp,level=Math.max(1,Math.floor(xp/250)),progress=xp%250;
  return panel('Profile', `${user.name.toUpperCase()} · ${user.city.toUpperCase()}`, `<div class="profile-identity-block profile-v19"><div class="profile-hero">${userAvatarVisual(user.id,'xl')}<div class="profile-main-copy"><small>${user.handle.toUpperCase()} · ${user.city.toUpperCase()}</small><h2>${user.name}</h2><p>${user.bio}</p></div><div class="profile-actions polished-actions">${profileActionsMarkup(user,own)}</div></div><section class="profile-level"><span>LV. ${level}</span><div><small>XP FROM SESSIONS + BADGES</small><strong>${user.levelName}</strong><div class="progress"><i style="width:${Math.round(progress/250*100)}%"></i></div><p>${xp.toLocaleString()} XP · ${sessionIds.length} Sessions + ${user.badgeIds.length} Badges</p></div><b>✦</b></section>${statRow([[String(sessionIds.length),'sessions'],[String(eventsForUser.length),'events'],[String(decksForUser.length),'decks'],[String(user.badgeIds.length),'badges'],[String(user.albumPhotoIds.length),'photos']])}</div><div class="segment profile-subnav">${profileTabs(active)}</div>${profileBody(user.id,active)}`, '', 'profile-layout-panel');
}

screens['profile-sessions'] = () => profileScreen(state.currentUserId, 'sessions');
screens['profile-decks'] = () => profileScreen(state.currentUserId, 'decks');
screens['profile-passport'] = () => profileScreen(state.currentUserId, 'passport');
screens['profile-badges'] = () => profileScreen(state.currentUserId, 'badges');
screens['profile-listings'] = () => profileScreen(state.currentUserId, 'listings');
screens.matches = () => profileScreen(state.currentUserId, 'sessions');
const badgeScreen = (badgeId=state.currentBadgeId,userId=state.currentUserId || 'manny') => {
  const badge=db.badges[badgeId] || db.badges.badge_first_match;
  const earnedRecord=Object.values(db.userBadges).find(record=>record.userId===userId&&record.badgeId===badge.id);
  const linkedSessions=Object.values(activities).filter(a=>db.belongsTo(a,userId)&&a.earnedBadgeIds?.includes(badge.id)).map(a=>({activityId:a.id,number:a.type==='match'?a.sessionNo:'✦',title:a.title,shopId:shopIdForActivity(a),date:a.date}));
  const progress=earnedRecord?badge.targetValue:0;
  return panel(badge.name,`${badge.category.toUpperCase()} · ${badge.rarity.toUpperCase()}`,`<div class="badge-detail badge-detail-v193"><span class="badge-aura"></span>${badgeArtwork(badge,'hero')}<small>${earnedRecord?'BADGE EARNED':'BADGE IN PROGRESS'}</small><h2>${badge.name}</h2><p>${badge.description}</p><div>${chip(badge.rarity.toUpperCase())}${chip(badge.category.toUpperCase())}${badge.limited?chip('LIMITED'):''}</div></div><div class="detail-card badge-criteria"><dl><div><dt>Requirement</dt><dd>${badge.criteria}</dd></div><div><dt>Progress</dt><dd>${progress} / ${badge.targetValue}</dd></div><div><dt>Status</dt><dd>${earnedRecord?`Earned ${earnedRecord.earnedDate}`:'Locked'}</dd></div></dl><div class="progress"><i style="width:${Math.min(100,progress/badge.targetValue*100)}%"></i></div></div><section class="content-section"><header><h2>Connected journey</h2><span>${linkedSessions.length} Sessions</span></header><div class="deck-linked-sessions">${linkedSessions.map(session=>`<button data-action="activity-detail" data-activity="${session.activityId}"><span>${session.number}</span><strong>${session.title}</strong><small>${db.shops[session.shopId]?.name || userById(userId).city} · ${session.date}</small><em>›</em></button>`).join('') || '<p class="empty-state">No recorded activity for this badge yet.</p>'}</div></section>`,`<footer class="panel-actions"><button class="secondary" data-action="pin-badge" data-badge-id="${badge.id}">${userById(userId).pinnedBadgeIds.includes(badge.id)?'Pinned ✓':'Pin to profile'}</button><button class="primary" data-action="share-badge" data-badge-id="${badge.id}">↗ Share badge</button></footer>`,'badge-detail-panel');
};
screens.badges = () => profileScreen(state.currentUserId,'badges');
screens.badge = () => badgeScreen();


function refreshProfile(){if(state.currentView.startsWith('profile')){const parts=state.currentView.split(':');const tab=parts[2] || (parts[0].startsWith('profile-')?parts[0].slice(8):'overview');setOverlay(profileScreen(state.currentUserId,tab),state.currentView,false,overlay.querySelector('.prototype-panel')?.scrollTop||0);}}
const commentsScreen=id=>{const item=activities[id];if(!item)return activityDetail(id);return panel('Conversation',item.title,`<section class="comments" data-activity="${id}">${item.commentIds.map(cid=>{const c=db.comments[cid];return `<article>${userAvatarButton(c.userId)}<div><strong>${userById(c.userId).name}</strong><p>${c.text}</p><small>${c.time}</small>${c.userId==='manny'?`<button data-action="delete-comment" data-comment-id="${c.id}" aria-label="Delete your comment">Delete</button>`:''}</div></article>`;}).join('') || '<p>Start the conversation.</p>'}<label class="form-stack">Your comment<textarea data-field="comment" maxlength="1000" placeholder="Give a little good-game energy…"></textarea></label><button class="primary" data-action="post-comment">Post comment</button></section>`);};
const editProfileScreen=()=>panel('Edit profile','Your story',`<div class="form-stack"><label>Name<input data-field="profile-name" value="${db.users.manny.name}" maxlength="60"></label><label>About you<textarea data-field="profile-bio" maxlength="240">${db.users.manny.bio}</textarea></label></div>`, '<footer class="panel-actions"><button class="primary" data-action="save-profile">Save profile</button></footer>');
const momentForm=()=>panel('Post a moment','Keep the story',`<div class="form-stack"><label>Title<input data-field="moment-title" maxlength="100" placeholder="A grail worth waiting for"></label><label>Caption<textarea data-field="moment-copy" maxlength="1000"></textarea></label><label>Moment<select data-field="moment-type"><option value="collect">New card in my collection</option><option value="moment">Around the table</option></select></label><label>Photos · optional, up to 4<input type="file" multiple data-field="session-image" accept="image/jpeg,image/png,image/webp"></label><div data-upload-preview hidden><div class="upload-thumbs"></div><strong></strong></div></div>`,'<footer class="panel-actions"><button class="primary" data-action="publish-moment">Publish moment</button></footer>');

const copyLink=(type,id)=>navigator.clipboard?.writeText(location.href.split('?')[0]+'?'+type+'='+encodeURIComponent(id)).then(()=>toast('Link copied')).catch(()=>toast('Copy is unavailable in this browser'));
const shopBadgeScreen=shopId=>{const shop=db.shops[shopId],badge=db.shopBadges[shop.shopBadgeId],stamp=Object.values(db.passportStamps).find(s=>s.userId==='manny'&&s.shopId===shopId);return panel(badge.name,shop.name,`<div class="badge-detail badge-detail-v193">${badgeArtwork(badge,'hero')}<h2>${badge.name}</h2><p>${badge.criteria}</p><strong>${Math.min(stamp?.visits||0,5)} / 5 visits</strong><p>${(stamp?.visits||0)>=5?'Badge earned':'Keep exploring your local table.'}</p><button class="primary" data-action="open-shop" data-shop-id="${shopId}">Open ${shop.name} →</button></div>`,'','badge-detail-panel');};
const archiveScreen=()=>panel('Archived activities','Only you can see these',Object.values(activities).filter(a=>a.archived&&db.belongsTo(a,'manny')).map(a=>`<div class="detail-card"><h2>${a.title}</h2><button class="primary" data-action="restore-activity" data-activity-id="${a.id}">Restore to journey</button></div>`).join('')+Object.values(db.trash).map(t=>`<div class="detail-card"><small>RECENTLY REMOVED</small><h2>${t.activity.title || t.session?.title || 'Activity'}</h2><button class="primary" data-action="recover-activity" data-activity-id="${t.activity.id}">Recover activity</button></div>`).join('')||'<p>No archived activities.</p>');
const editPostScreen=id=>{const a=activities[id];return panel('Edit post','Your story',`<div class="form-stack"><label>Title<input data-field="post-title" value="${a.title}"></label><label>Caption<textarea data-field="post-copy">${a.copy}</textarea></label></div>`,`<footer class="panel-actions"><button class="primary" data-action="save-post" data-activity-id="${id}">Save post</button></footer>`);};
const createSheet = () => `<div class="scrim create-scrim"><section class="bottom-sheet" role="dialog" aria-label="Create activity"><div class="sheet-grab"></div><header><div><small>ADD TO YOUR JOURNEY</small><h2>What happened?</h2></div><button data-action="close">×</button></header><div class="create-options"><button data-action="record"><span class="gradient-icon">VS</span><strong>Record match</strong><small>Play, confirm, remember.</small><i>›</i></button><button data-action="moment"><span class="pink-icon">✦</span><strong>Post a moment</strong><small>Pulls, cards, hobby life.</small><i>›</i></button><button data-action="checkin"><span class="orange-icon">⌖</span><strong>Check in</strong><small>Unlock a passport stamp.</small><i>›</i></button><button data-screen="event"><span class="lav-icon">◇</span><strong>Join / post event</strong><small>See what’s happening nearby.</small><i>›</i></button></div><p class="sheet-line">PLAY. COLLECT. CONNECT.</p></section></div>`;

const uploadPreviewMarkup = () => state.pendingUploads.length ? state.pendingUploads.map((file,index)=>`<span class="upload-thumb" style="background-image:url('${file.url}')"><i>${index+1}</i></span>`).join('') : '';
const recordMatch = () => { const myDecks=userDecks('manny'); return panel('Create Session Card', 'STEP 1 OF 2', `<div class="session-builder-status"><span>1</span><div><strong>Session data</strong><small>Choose the decks, your table, and the result.</small></div><i>PLAY. CONFIRM. REMEMBER.</i></div><div class="form-stack session-builder-form"><label>Session title<input data-field="title" value="One more round at the local" /></label><label>Your deck<select data-field="your-deck">${myDecks.map(deck=>`<option value="${deck.id}">${deck.name} · ${deck.public?'Public':'Private'}</option>`).join('')}</select></label><label>Opponent<select data-field="opponent">${Object.values(db.users).filter(user=>user.id!=='manny').map(user=>`<option value="${user.id}" ${user.id==='poom'?'selected':''}>${user.name} · ${user.game}</option>`).join('')}</select></label><div class="score-input"><label>Your score<select data-field="your-score"><option>0</option><option>1</option><option selected>2</option><option>3</option></select></label><span>—</span><label>Opponent score<select data-field="opponent-score"><option>0</option><option selected>1</option><option>2</option><option>3</option></select></label></div><label>Partner shop<select data-field="shop">${Object.values(db.shops).map(shop=>`<option value="${shop.id}">${shop.name} · ${shop.city}</option>`).join('')}</select></label><label>Total duration<select data-field="duration"><option>42m</option><option>58m</option><option selected>1h 16m</option><option>1h 34m</option></select></label><label>Session note<textarea data-field="note">A close final game and another good chapter at the local.</textarea></label><label class="session-image-upload"><span>Session photos <small>Optional · up to 4 images</small></span><input type="file" multiple data-field="session-image" accept="image/jpeg,image/png,image/webp" /><strong>＋ Choose photos</strong><i>One photo creates a single post; two or more create a real carousel without stretching.</i></label><div class="upload-preview upload-preview-multiple" data-upload-preview ${state.pendingUploads.length?'':'hidden'}><div class="upload-thumbs">${uploadPreviewMarkup()}</div><div><strong>${state.pendingUploads.length ? `${state.pendingUploads.length} photo${state.pendingUploads.length>1?'s':''} ready` : 'Photos ready'}</strong><small>Original proportions preserved</small><button data-action="remove-upload">Remove all</button></div></div></div>`, `<footer class="panel-actions"><button class="secondary" data-action="back">Cancel</button><button class="primary" data-action="send-match">Send confirmation →</button></footer>`); };

const editSession = (sessionId) => {
  const session=db.sessions[sessionId];
  if (!session) return '';
  return panel('Edit Session', `${session.number} · ${db.shops[session.shopId].name}`, `<div class="session-builder-status"><span>✎</span><div><strong>Update the same Session record</strong><small>Feed, Profile, Deck and Share Card will update together.</small></div><i>ONE RECORD · EVERY VIEW</i></div><div class="form-stack session-builder-form edit-session-form"><label>Session title<input data-field="edit-title" value="${session.title}" /></label><div class="score-input"><label>Your score<select data-field="edit-your-score">${[0,1,2,3].map(score=>`<option ${score===session.score[0]?'selected':''}>${score}</option>`).join('')}</select></label><span>—</span><label>Opponent score<select data-field="edit-opponent-score">${[0,1,2,3].map(score=>`<option ${score===session.score[1]?'selected':''}>${score}</option>`).join('')}</select></label></div><label>Total duration<input data-field="edit-duration" value="${session.duration}" /></label><label>Caption<textarea data-field="edit-note">${session.copy}</textarea></label></div>`, `<footer class="panel-actions"><button class="secondary" data-action="back">Cancel</button><button class="primary" data-action="save-session-edit" data-session-id="${session.id}">Save changes</button></footer>`);
};

const sessionActionsMenu = (sessionId) => {
  const session=db.sessions[sessionId];
  if(!session.playerIds.includes('manny'))return `<div class="session-actions-popover"><button data-action="activity-detail" data-activity="${session.activityId}">View session</button></div>`;
  return `<div class="session-actions-popover" role="menu" aria-label="Session actions"><button data-action="edit-session" data-session-id="${session.id}"><span>✎</span><strong>Edit</strong></button><button data-action="archive-session" data-session-id="${session.id}"><span>▱</span><strong>Archive</strong></button><button class="danger-row" data-action="remove-session" data-session-id="${session.id}"><span>⌫</span><strong>Remove</strong></button></div>`;
};

const deleteConfirmation = (sessionId) => {
  const session=db.sessions[sessionId];
  return `<div class="scrim"><section class="delete-confirm" role="alertdialog" aria-label="Confirm session deletion"><span>!</span><h2>Delete this Session?</h2><p>“${session.title}” will be removed from Feed, both profiles, linked decks, badges and photo relationships.</p><div><button class="secondary" data-action="back">Keep Session</button><button class="danger" data-action="delete-session" data-session-id="${session.id}">Delete permanently</button></div></section></div>`;
};

const draftOpponentDecks = () => Object.values(db.decks).filter(deck=>deck.ownerId===state.draftSession.opponentId && deck.public && deck.game===db.decks[state.draftSession.yourDeckId]?.game);
const pendingMatch = () => { const draft=state.draftSession,me=userById('manny'),opponent=userById(draft.opponentId),myDeck=db.decks[draft.yourDeckId]; return panel(`Waiting for ${opponent.shortName}`, 'MATCH COLLABORATION · DRAFT', `<div class="pending-state"><span class="pulse-ring">↗</span><h2>Session request sent.</h2><p>${opponent.name} will choose a public deck and confirm the result. The Activity Card is created only after both users agree.</p></div><div class="hero-match compact"><p>${myDeck.game}</p><div><span>${userAvatarVisual(me.id)}<strong>${me.shortName}</strong><small>${myDeck.name}</small></span><b><em>${draft.score[0]}</em> — <em>${draft.score[1]}</em><small>PENDING</small></b><span>${userAvatarVisual(opponent.id)}<strong>${opponent.shortName}</strong><small>Deck not selected</small></span></div></div><div class="database-link-preview"><span>USER <b>${me.id}</b></span><i>↔</i><span>USER <b>${opponent.id}</b></span><i>↔</i><span>SHOP <b>${draft.shopId}</b></span></div><div class="demo-hint"><b>PROTOTYPE DEMO</b><p>Continue as your opponent to try the confirmation step.</p><button class="primary" data-action="confirm-request">Continue as ${opponent.shortName} →</button></div>`); };

const confirmMatch = () => { const draft=state.draftSession,opponent=userById(draft.opponentId),availableDecks=draftOpponentDecks(); return panel('Confirm Session', `${opponent.name.toUpperCase()} · STEP 2 OF 2`, `<div class="notice-priority">${userAvatarVisual('manny')}<div><small>MATCH REQUEST</small><strong>Manny added a verified session with you.</strong><p>${draft.title} · ${draft.score.join(' — ')}</p></div></div><label class="form-label">${opponent.shortName}'s public deck<select data-field="opponent-deck">${availableDecks.map(deck=>`<option value="${deck.id}">${deck.name} · ${deck.game}</option>`).join('')}</select></label>${availableDecks.length?'':'<p class="trust-note error">This player has no public deck for your selected game. Go back and choose a matching deck or opponent.</p>'}<p class="trust-note">Demo confirmation: both players are simulated in this prototype.</p>`, `<footer class="panel-actions"><button class="secondary" data-action="dispute">Dispute</button><button class="primary" data-action="verify" ${availableDecks.length?'':'disabled'}>Confirm + create card ✓</button></footer>`); };

const verified = () => { const item=activities[state.newActivityId],session=db.sessions[item.sessionId]; return panel('Session created', 'DATABASE V1.9.4 · RELATIONSHIPS VALID', `<div class="verified-burst"><span>✦</span><h2>Session published.</h2><p>Your match is on the feed and both player profiles. Good game.</p></div><div class="hero-match"><p>${item.game}</p><div><span>${userAvatarVisual(item.playerIds[0])}<strong>${item.players[0]}</strong><small>${item.decks[0]}</small></span><b><em class="win">${session.score[0]}</em> — <em>${session.score[1]}</em><small>FINAL</small></b><span>${userAvatarVisual(item.playerIds[1])}<strong>${item.players[1]}</strong><small>${item.decks[1]}</small></span></div><label>PLAY. COLLECT. CONNECT.</label></div>`, `<footer class="panel-actions"><button class="secondary" data-action="activity-detail" data-activity="${state.newActivityId}">Open Session</button><button class="primary" data-action="share" data-activity="${state.newActivityId}">↗ Share session</button></footer>`); };

const galleryViewer = (item, index = 0) => `<div class="scrim gallery-viewer-scrim"><section class="gallery-viewer" role="dialog" aria-label="${item.title} photo viewer"><header><div><small>${item.kind || 'ACTIVITY ALBUM'}</small><h2>${item.title}</h2></div><button data-action="close" aria-label="Close gallery">×</button></header><div class="gallery-stage media-${item.gallery[index]}" data-gallery-index="${index}"><span>${index+1} / ${item.gallery.length}</span><button class="prev" data-action="gallery-prev" aria-label="Previous photo">‹</button><button class="next" data-action="gallery-next" aria-label="Next photo">›</button></div><div class="gallery-thumbs">${item.gallery.map((media,i)=>`<button class="media-${media} ${i===index?'active':''}" data-action="gallery-go" data-index="${i}" aria-label="View photo ${i+1}"></button>`).join('')}</div><p>Linked to the same activity in Feed and Profile.</p></section></div>`;

const photoViewer = (photoId) => {
  const photo=db.photos[photoId];
  if (!photo) return '';
  const owner=userById(photo.ownerUserId),activity=activities[photo.activityId];
  return `<div class="scrim photo-viewer-scrim"><section class="photo-viewer" role="dialog" aria-label="Photo by ${owner.name}"><header><button data-action="open-user" data-user-id="${owner.id}">${userAvatarVisual(owner.id)}<span><small>PHOTO BY</small><strong>${owner.name}</strong></span></button><button data-action="close" aria-label="Close photo">×</button></header><div class="photo-viewer-stage media-${photo.visualKey}"></div><footer><div><small>LINKED SESSION</small><strong>${activity?.title || 'VERSO activity'}</strong></div>${activity?`<button class="primary" data-action="activity-detail" data-activity="${activity.id}">Open Session →</button>`:''}</footer></section></div>`;
};

function updateCarousel(node, requestedIndex) {
  const carousel = node.closest('.activity-carousel');
  if (!carousel) return;
  const slides = [...carousel.querySelectorAll('.carousel-slide')];
  const current = Math.max(0, slides.findIndex(slide => slide.classList.contains('active')));
  const index = (requestedIndex + slides.length) % slides.length;
  slides.forEach((slide,i)=>slide.classList.toggle('active',i===index));
  carousel.querySelectorAll('.carousel-dots button').forEach((dot,i)=>dot.classList.toggle('active',i===index));
}

function updateGalleryViewer(requestedIndex) {
  const item = activities[state.currentActivity];
  const stage = document.querySelector('.gallery-stage');
  if (!stage || !item?.gallery?.length) return;
  const index = (requestedIndex + item.gallery.length) % item.gallery.length;
  stage.className = `gallery-stage media-${item.gallery[index]}`;
  stage.dataset.galleryIndex = index;
  stage.querySelector('span').textContent = `${index+1} / ${item.gallery.length}`;
  document.querySelectorAll('.gallery-thumbs button').forEach((thumb,i)=>thumb.classList.toggle('active',i===index));
}

const shareModal = (id = state.currentActivity) => {
  const item = activities[id] || activities['match-onepiece'];
  const shareRecord = db.shareCards[item.id];
  const photoClass = `media-${shareRecord.media}`;
  const pose = item.type === 'match' ? 'cheer' : item.type === 'collect' ? 'card' : item.type === 'event' ? 'run' : 'peek';
  const cheer = shareRecord.cheer;
  const hero = item.type === 'match'
    ? `<small>${item.title}</small><h3><span>${item.players[0]}</span><b>${item.score}</b><span>${item.players[1]}</span></h3><p>${item.decks[0]} · ${item.decks[1]}</p>`
    : item.type === 'badge'
      ? `<small>${item.eyebrow}</small>${badgeArtwork(db.badges[item.badgeId],'share-single-badge')}<h3 class="single-title">${item.title}</h3><p>${item.rarity}</p>`
      : `<small>${item.eyebrow}</small><h3 class="single-title">${item.title}</h3><p>${item.grade || item.location}</p>`;
  return `<div class="scrim"><section class="share-modal share-studio" data-activity="${id}" data-share-record="${shareRecord.id}"><header><div><small>${shareRecord.id.toUpperCase()} · ${item.id.toUpperCase()}</small><h2>Share Studio</h2></div><button data-action="close">×</button></header><div class="share-workspace"><div class="share-preview story frame-${shareRecord.frame} with-photo with-logo with-mascot with-background" id="share-preview"><span class="share-photo activity-photo-layer ${photoClass}"></span><span class="brand-guide-logo share-brand"></span><span class="share-mascot-sprite mascot-pose-${pose}" aria-label="VERSO Spirit cheering"></span><div class="share-frame-ornament"><i></i><i></i><i></i><i></i></div><div class="share-content">${hero}<blockquote>${cheer}</blockquote></div><footer>${shareRecord.location}<span>PLAY. COLLECT. CONNECT.</span></footer></div><div class="share-controls"><p>SHARE TO</p><div class="share-platforms"><button class="active" data-action="share-platform" data-platform="instagram">◎ Instagram Story</button><button data-action="share-platform" data-platform="post">▦ Instagram Post</button><button data-action="share-platform" data-platform="link">↗ Copy Link</button></div><p>FORMAT</p><div class="format-tabs"><button class="active" data-action="share-format" data-format="story">Story 9:16</button><button data-action="share-format" data-format="square">Square 1:1</button></div><p>CARD FRAME</p><div class="share-frames">${['stats','victory','collector','journey'].map(frame=>`<button class="${frame===shareRecord.frame?'active':''}" data-action="share-frame" data-frame="${frame}">${frame[0].toUpperCase()+frame.slice(1)}</button>`).join('')}</div><p>CARD OPTIONS</p><div class="share-options"><button class="active" data-action="share-toggle" data-option="photo">Photo</button><button class="active" data-action="share-toggle" data-option="logo">Logo</button><button class="active" data-action="share-toggle" data-option="mascot">Mascot</button><button class="active" data-action="share-toggle" data-option="background">Background</button></div><div class="share-backgrounds"><button class="active" data-action="share-theme" data-theme="ink" aria-label="Ink background"></button><button data-action="share-theme" data-theme="cream" aria-label="Cream background"></button><button data-action="share-theme" data-theme="flame" aria-label="Flame background"></button><button data-action="share-theme" data-theme="dream" aria-label="Dream background"></button></div></div></div><div class="action-grid"><button class="secondary" data-action="download">↓ Save PNG</button><button class="primary" data-action="share-instagram">Share to Instagram Story ↗</button></div></section></div>`;
};

const shareMediaMap = {
  'may-graded-v19':{src:'./public/assets/activity-may-graded-card-v19.webp'},
  'manny-poom':{src:'./public/assets/activity-manny-poom-v6.webp'},
  'fern-aim':{src:'./public/assets/activity-fern-aim-v6.webp'},
  'nook-binder':{src:'./public/assets/activity-nook-binder-v6.webp'},
  'bam-event':{src:'./public/assets/activity-bam-event-v6.webp'},
  'new-card':{src:'./public/assets/activity-new-card-v5.webp'},
  'duo-old':{src:'./public/assets/tcg-life-sprite-v1.webp',cell:[0,0]},
  'group-old':{src:'./public/assets/tcg-life-sprite-v1.webp',cell:[1,0]},
  'shuffle-old':{src:'./public/assets/tcg-life-sprite-v1.webp',cell:[0,1]},
  'binder-old':{src:'./public/assets/tcg-life-sprite-v1.webp',cell:[1,1]},
  'victory-old':{src:'./public/assets/activity-life-sprite-v4.webp',cell:[0,1]},
  'graded-old':{src:'./public/assets/activity-life-sprite-v4.webp',cell:[1,1]},
  'event-regional':{src:'./public/assets/event-poster-regional-v8.webp'},
  'event-launch':{src:'./public/assets/event-poster-ink-v8.webp'},
};
const loadShareImage = (src) => new Promise((resolve,reject)=>{ const image=new Image(); image.onload=()=>resolve(image); image.onerror=reject; image.src=src; });
const drawCover = (context,image,source,width,height) => {
  const sx=source.cell ? source.cell[0]*image.width/2 : 0;
  const sy=source.cell ? source.cell[1]*image.height/2 : 0;
  const sw=source.cell ? image.width/2 : image.width;
  const sh=source.cell ? image.height/2 : image.height;
  const scale=Math.max(width/sw,height/sh),cropW=width/scale,cropH=height/scale;
  context.drawImage(image,sx+(sw-cropW)/2,sy+(sh-cropH)/2,cropW,cropH,0,0,width,height);
};
const drawWrappedText = (context,text,x,y,maxWidth,lineHeight,maxLines=3) => {
  const words=text.split(/\s+/); let line='',lines=[];
  words.forEach(word=>{ const test=line?`${line} ${word}`:word; if(context.measureText(test).width>maxWidth && line){lines.push(line);line=word;}else line=test; });
  if(line) lines.push(line);
  lines.slice(0,maxLines).forEach((value,index)=>context.fillText(value,x,y+index*lineHeight));
};
const downloadShareCard = async (id = state.currentActivity) => {
  const item=activities[id],record=db.shareCards[id],preview=document.querySelector('#share-preview');
  if (!item || !record || !preview) return;
  const square=preview.classList.contains('square'),canvas=document.createElement('canvas');
  canvas.width=1080; canvas.height=square?1080:1920;
  const context=canvas.getContext('2d'),width=canvas.width,height=canvas.height;
  const gradient=context.createLinearGradient(0,0,width,height); gradient.addColorStop(0,'#24150f'); gradient.addColorStop(.48,'#111114'); gradient.addColorStop(1,'#301326'); context.fillStyle=gradient; context.fillRect(0,0,width,height);
  if (preview.classList.contains('with-photo') && (shareMediaMap[record.media] || record.photoIds?.length)) {
    try { const photo=Object.values(db.photos).find(p=>p.visualKey===record.media),source=shareMediaMap[record.media] || {src:db.assets[photo?.assetId]?.path},image=await loadShareImage(source.src); drawCover(context,image,source,width,height); } catch (error) { console.warn('Share photo export fallback',error); }
  }
  const shade=context.createLinearGradient(0,0,0,height); shade.addColorStop(0,'rgba(8,8,10,.28)'); shade.addColorStop(.48,'rgba(8,8,10,.08)'); shade.addColorStop(1,'rgba(8,8,10,.96)'); context.fillStyle=shade; context.fillRect(0,0,width,height);
  if (preview.classList.contains('with-background')) { context.strokeStyle='#ff9a38'; context.lineWidth=5; context.strokeRect(34,34,width-68,height-68); }
  if (preview.classList.contains('with-logo')) { context.fillStyle='#fff7e6'; context.font='700 54px "IBM Plex Sans", "Noto Sans Thai", sans-serif'; context.fillText('V  VERSO',72,112); }
  if (preview.classList.contains('with-mascot')) {
    try { const mascot=await loadShareImage('./public/assets/verso-mascot-poses-v8.webp'); const pose=item.type==='match'?[0,0]:item.type==='collect'?[1,0]:item.type==='event'?[1,1]:[0,1]; const size=mascot.width/2; context.drawImage(mascot,pose[0]*size,pose[1]*size,size,size,width-330,105,235,235); } catch (error) { console.warn('Mascot export skipped',error); }
  }
  const baseY=square?650:1390; context.fillStyle='#ff9a38'; context.font='700 28px "IBM Plex Sans", "Noto Sans Thai", sans-serif'; context.fillText(record.location.toUpperCase(),72,baseY);
  context.fillStyle='#fff7e6'; context.font='700 68px "IBM Plex Sans", "Noto Sans Thai", sans-serif'; drawWrappedText(context,item.title,72,baseY+86,width-144,78,3);
  context.fillStyle='#ffc83d'; context.font='700 92px "IBM Plex Sans", sans-serif'; if(item.type==='match') context.fillText(item.score,72,baseY+320);
  context.fillStyle='#eee7dc'; context.font='500 30px "IBM Plex Sans", "Noto Sans Thai", sans-serif'; drawWrappedText(context,item.type==='match'?`${item.players.join(' × ')} · ${item.duration} · ${item.game}`:item.copy,72,baseY+(item.type==='match'?380:300),width-144,42,3);
  context.fillStyle='#ff709e'; context.font='700 24px "IBM Plex Sans", sans-serif'; context.fillText(record.cheer,72,height-105);
  canvas.toBlob(blob=>{ if(!blob)return; const link=document.createElement('a'); link.href=URL.createObjectURL(blob); link.download=`verso-${item.id}-${square?'square':'story'}.png`; link.click(); setTimeout(()=>URL.revokeObjectURL(link.href),1000); },'image/png');
  toast('PNG share card saved');
};

const stampUnlock = () => {const shop=db.shops[state.currentShopId],stamps=Object.values(db.passportStamps).filter(s=>s.userId==='manny'),stamp=stamps.find(s=>s.shopId===shop.id),badge=db.shopBadges[stamp?.shopBadgeId];return panel('Check-in complete',shop.city,`<section class="unlock-modal powered-unlock"><div class="stamp-burst"><span class="stamp-energy"></span><span class="passport-stamp big"><b>${shop.code}</b><strong>${shop.name}</strong><small>${shop.city} · 2026</small></span></div><h2>${shop.name} unlocked!</h2><p>Visit ${stamp?.visits || 1} · ${stamps.length} of ${Object.keys(db.shops).length} partner shops explored</p><div class="shop-badge-earned"><span>${shop.code}</span><div><small>PARTNER JOURNEY</small><b>${badge?.name || shop.name}</b><p>${badge?.criteria || 'Keep coming back to your local.'}</p></div></div><div class="action-grid"><button class="secondary" data-action="activity-detail" data-activity="${stamp?.activityId || state.currentActivity}">View check-in</button><button class="primary" data-screen="profile-passport">Open Passport →</button></div></section>`);};

const profileQrModal = () => `<div class="scrim"><section class="share-modal profile-qr-modal"><header><div><small>SHARE PLAYER PROFILE</small><h2>Scan to meet Manny</h2></div><button data-action="close">×</button></header><div class="qr-profile-card"><span class="brand-guide-logo qr-logo"></span><span class="avatar xl manny">Manny</span><h3>Manny S.</h3><p>@manny · Chiang Mai</p>${qrMarkup(9)}<small>DEMO QR · @manny</small><div>${chip('COLLECTOR')}${chip('TRAVELER')}${chip('CONTROL')}</div></div><div class="action-grid"><button class="primary" data-action="copy-profile-link">⧉ Copy profile link</button></div></section></div>`;

const notificationPopover = () => `<div class="notice-layer"><button class="notice-backdrop" data-action="close-notice" aria-label="Close notifications"></button><section class="notice-popover" role="dialog" aria-label="Notifications"><header><div><small>6 NEW</small><h2><span class="bell-icon">●</span> Notifications</h2></div><button data-action="close-notice" aria-label="Close notifications">×</button></header>${noticeContent()}</section></div>`;

const homepageMockup = () => `<div class="entry-gate verso-homepage login-only-home public-gate-v194 logged-out-home-v1911"><header><span class="brand-guide-logo"></span><small>TCG LIFESTYLE &amp; CULTURE PLATFORM</small></header><main><section class="landing-copy"><small>VERSO</small><h1>Where Your<br><em>TCG Story</em> Lives.</h1><p>Your matches, cards, shops, events and memories—together in one connected TCG journey.</p><h2>Play. Collect. Connect.</h2><div class="landing-auth-actions"><button class="primary" data-action="open-login">Log In →</button><button class="secondary" data-action="create-account">Create Account</button></div><small class="login-required-note">LOGIN REQUIRED · COMMUNITY PROFILES ARE NOT PUBLIC</small></section><section class="landing-visual abstract-landing-visual" aria-label="Verso Spirit welcomes players to VERSO"><div class="landing-orbit" aria-hidden="true"><i></i><i></i><i></i></div><div class="landing-spirit-hero"><span class="welcome-mascot-badge mascot-pose-cheer" role="img" aria-label="Verso Spirit cheering"></span><div><small>VERSO SPIRIT</small><strong>Ready for your next story.</strong></div></div><p>EVERY GAME.<br>EVERY CARD.<br>EVERY STORY.</p></section><section class="landing-principles" aria-label="What you can do on VERSO"><span><i>V</i><b>PLAY</b><small>Record matches, sessions and competitive moments.</small></span><span><i>✦</i><b>COLLECT</b><small>Track cards, decks, badges and your TCG journey.</small></span><span><i>⌁</i><b>CONNECT</b><small>Discover players, partner shops, events and communities.</small></span></section></main><footer>VERSO · TCG LIFESTYLE &amp; CULTURE<span>YOUR STORY STARTS AT THE TABLE</span></footer></div>`;

const createAccountMockup = () => `<div class="entry-gate login-page create-account-page"><section class="login-brand-panel"><span class="brand-guide-logo"></span><div class="welcome-mascot-badge mascot-pose-peek"></div><small>NEW PLAYER PROFILE</small><h1>Start your<br>TCG story.</h1><p>This prototype creates a preview account and keeps the canonical V1.9.4 data untouched.</p></section><section class="login-form-panel"><button class="login-close" data-action="open-landing" aria-label="Back to homepage">×</button><div><small>CREATE ACCOUNT</small><h2>Join VERSO</h2><label>Display name<input value="New Player" /></label><label>Email<input type="email" placeholder="you@example.com" /></label><label>Home city<input value="Chiang Mai" /></label><button class="primary login-submit" data-action="enter-app">Create prototype account →</button><p>Already have a profile? <button data-action="open-login">Log in</button></p></div></section></div>`;

const loginMockup = () => `<div class="entry-gate login-page login-polished"><section class="login-brand-panel"><header class="login-brand-top"><span class="brand-guide-logo"></span><small>TCG LIFESTYLE &amp; CULTURE</small></header><div class="login-brand-composition"><div class="login-hero-copy"><small>VERSO</small><h1>Where Your<br><em>TCG Story</em> Lives.</h1><h2>Play. Collect. Connect.</h2><p>Your matches, cards, shops, events and memories—together in one journey.</p></div><div class="login-spirit-stage"><span class="welcome-mascot-badge mascot-pose-card" role="img" aria-label="Verso Spirit holding a card"></span><small>VERSO SPIRIT · READY FOR YOUR NEXT STORY</small></div></div></section><section class="login-form-panel"><button class="login-close" data-action="open-landing" aria-label="Back to homepage">×</button><div class="login-form-card"><small>WELCOME BACK</small><h2>Sign in to VERSO</h2><p>Continue your TCG journey and reconnect with your community.</p><label>Email or username<input type="email" value="manny@verso.app" /></label><label>Password<input type="password" value="versostory" /></label><div class="login-meta"><label><input type="checkbox" checked /> Remember me</label><button>Forgot password?</button></div><button class="primary login-submit" data-action="login-submit">Log In →</button><span class="login-divider">OR CONTINUE WITH</span><div class="login-social"><button>G&nbsp; Google</button><button>◉&nbsp; Apple</button></div><div class="login-create-account"><span>New to the table?</span><button class="secondary" data-action="enter-app">Create Account</button></div></div></section></div>`;

const welcomeModal = () => `<div class="scrim welcome-scrim"><section class="welcome-modal"><span class="brand-guide-logo welcome-logo"></span><span class="welcome-mascot-badge mascot-pose-cheer" role="img" aria-label="VERSO Spirit cheering"></span><p>TINY MISCHIEF. BIG LOVE FOR THE GAME.</p><h2>Good evening, Manny!</h2><span>There’s always room for one more match, pull, place, or person in your story.</span><button class="primary" data-action="welcome-close">Let’s play →</button><small>PLAY. COLLECT. CONNECT.</small></section></div>`;

function syncOverlayScroll() { document.body.classList.toggle('overlay-open', Boolean(overlay.innerHTML.trim()));const gate=['landing','login','create-account','welcome'].includes(state.currentView);document.querySelector('.app-shell').inert=gate; }

function setOverlay(html, key, push = true, scrollTop = 0) {
  if(key==='profile')key=`profile:${state.currentUserId}:overview`;
  else if(key.startsWith('profile-') && ['sessions','decks','passport','badges','listings'].includes(key.slice(8)))key=`profile:${state.currentUserId}:${key.slice(8)}`;
  if (push) state.navigation.push({html: overlay.innerHTML, key: state.currentView, scroll: overlay.querySelector('.prototype-panel')?.scrollTop || 0});
  overlay.innerHTML = html;
  state.currentView = key;
  overlay.querySelector('.prototype-panel')?.scrollTo(0,scrollTop);
  syncOverlayScroll();
}

function goBack() {
  const previous = state.navigation.pop();
  if (!previous) { openScreen('home', false); return; }
  const [route,id,tab]=previous.key.split(':');
  if(route==='profile' && id)state.currentUserId=id;
  if(route==='shop' && id)state.currentShopId=id;
  if(route==='event' && id)state.currentEventId=id;
  if(route==='deck' && id)state.currentDeckId=id;
  if(route==='activity' && id)state.currentActivity=id;
  const fresh=route==='profile'&&id?profileScreen(id,tab||'overview'):route==='activity'?activityDetail(id):route==='shop'&&id?shopScreen(id):route==='event'&&id?eventScreen(id):route==='deck'&&id?deckScreen(id):screens[previous.key]?.();
  overlay.innerHTML=fresh || previous.html;
  state.currentView=previous.key;
  overlay.querySelector('.prototype-panel')?.scrollTo(0,previous.scroll || 0);
  renderFeedActivities();
  syncOverlayScroll();
}

function openActivity(id, push = true) {
  if (state.currentView === `activity:${id}` && overlay.querySelector('.activity-detail-panel')) return;
  state.currentActivity = id;
  setOverlay(activityDetail(id), `activity:${id}`, push);
}

function openScreen(name, push = true) {
  if (name === 'profile') state.currentUserId = 'manny';
  const navName = name.startsWith('profile-') ? 'profile' : name;
  document.querySelectorAll('.bottom-nav [data-screen], .rail-nav [data-screen]').forEach((item) => item.classList.toggle('active', item.dataset.screen === navName));
  if (name === 'home') {
    overlay.innerHTML = '';
    state.currentView = 'home';
    state.navigation = [];
    syncOverlayScroll();
    window.scrollTo({top:0,behavior:'auto'});
    return;
  }
  if (name === 'notifications') { setOverlay(notificationPopover(), 'notifications', push); return; }
  if (screens[name]) {
    const preserveProfileScroll = state.currentView.startsWith('profile') && name.startsWith('profile');
    const scrollTop = preserveProfileScroll ? (overlay.querySelector('.prototype-panel')?.scrollTop || 0) : 0;
    setOverlay(screens[name](), name, push, scrollTop);
    if (['explore','marketplace','profile','profile-sessions','profile-passport','profile-decks','profile-badges','settings'].includes(name)) overlay.querySelector('.prototype-panel')?.classList.add('destination-screen');
  }
}

const captureSessionDraft = () => {
  const field=(name)=>overlay.querySelector(`[data-field="${name}"]`)?.value;
  const opponentId=field('opponent') || 'poom';
  state.draftSession={title:field('title') || 'New local session',yourDeckId:field('your-deck') || 'deck-manny-blue',opponentId,score:[Number(field('your-score')??2),Number(field('opponent-score')??1)],shopId:field('shop') || 'mana',duration:field('duration') || '1h 16m',note:field('note') || 'A new chapter at the local.',uploads:[...state.pendingUploads]};
  return state.draftSession;
};

const createSessionFromDraft = () => {
  const draft=state.draftSession,opponentDeckId=overlay.querySelector('[data-field="opponent-deck"]')?.value || draftOpponentDecks()[0]?.id;
  if (!draft || !opponentDeckId) return null;
  const myDeck=db.decks[draft.yourDeckId],opponent=userById(draft.opponentId);
  const session={sessionId:db.uid('session'),activityId:db.uid('match'),number:`#${Object.keys(db.sessions).length+1240}`,playerIds:['manny',opponent.id],opponentIds:[opponent.id],deckIds:[myDeck.id,opponentDeckId],shopId:draft.shopId,locationId:draft.shopId,eventId:null,score:draft.score,result:draft.score[0]>draft.score[1]?'win':draft.score[0]===draft.score[1]?'draw':'loss',date:new Date().toISOString().slice(0,10),duration:draft.duration,games:draft.score.reduce((a,b)=>a+b,0),photoIds:[],media:'duel-'+(myDeck.game.includes('MAGIC')?'magic':myDeck.game.includes('LORCANA')?'lorcana':myDeck.game.includes('YU-')?'yugioh':myDeck.game.includes('POK')?'pokemon':'onepiece'),visual:'duo',title:escapeText(draft.title),time:'just now',copy:escapeText(draft.note),achievement:'SESSION BUILDER',earnedBadgeIds:['badge_session_builder'],earnedBadges:['Session Builder']};
  let activity=db.registerSession(session);
  (draft.uploads || []).forEach((upload,index)=>{
    const photoId=db.uid('photo'),assetId=db.uid('upload'),visualKey=photoId;
    db.assets[assetId]={id:assetId,type:'user-upload',path:upload.url,usedBy:['session','activity','profile-album','share-card'],ownerId:'manny',relatedEntityId:session.activityId,source:'local-file-preview'};
    document.documentElement.style.setProperty(`--created-session-photo-${index+1}`,`url("${upload.url.replace(/"/g,'')}")`);
    db.registerPhoto({id:photoId,ownerUserId:'manny',activityId:session.activityId,assetId,visualKey});
    activity=db.activities[session.activityId];
  });
  state.newActivityId=activity.id;
  state.recordedMatch=true;
  db.reconcile();db.persist();syncPhotoStyles();state.pendingUploads=[];
  return db.activities[activity.id];
};

const recordedActivityCard = () => state.newActivityId ? renderActivityCard(state.newActivityId).replace('journey-card-v6', 'journey-card-v6 recorded-activity') : '';

function ensureRecordedActivity() {
  if (state.newActivityId && !document.querySelector(`[data-activity="${state.newActivityId}"]`)) document.querySelector('#activity-feed')?.insertAdjacentHTML('afterbegin', recordedActivityCard());
}

function bindFeedActivities() {
  document.querySelectorAll('#main-view .activity-card .view-detail').forEach(button=>button.remove());
}

document.addEventListener('click', async (event) => {
  const target = event.target;
  const actionNode = target.closest('[data-action]');
  const screenNode = target.closest('[data-screen]');
  const activityCard = target.closest('[data-activity]');
  if (!target.closest('.session-actions-popover') && actionNode?.dataset.action !== 'session-menu') document.querySelectorAll('.session-actions-popover').forEach(menu=>menu.remove());
  if (!target.closest('.profile-follow-control')) document.querySelectorAll('.profile-follow-menu').forEach(menu=>menu.remove());
  if (screenNode) {
    event.preventDefault();
    if (activityCard?.classList.contains('activity-card')) openActivity(activityCard.dataset.activity);
    else openScreen(screenNode.dataset.screen);
    return;
  }
  if (!actionNode) {
    const commentButton = target.closest('.activity-actions button');
    if (commentButton?.querySelector('span')?.textContent === '◯') toast('Comments opened (prototype)');
    else if (activityCard?.classList.contains('activity-card') && activities[activityCard.dataset.activity]?.type === 'event') openActivity(activityCard.dataset.activity);
    return;
  }
  const action = actionNode.dataset.action;
  if(action==='feed-filter'){state.feedMode=actionNode.dataset.mode;document.querySelectorAll('.feed-tabs button').forEach(b=>b.classList.toggle('active',b===actionNode));renderFeedActivities();}
  if (action === 'open-landing') setOverlay(homepageMockup(), 'landing', false);
  if (action === 'open-login') setOverlay(loginMockup(), 'login', false);
  if (action === 'create-account') setOverlay(createAccountMockup(), 'create-account', false);
  if (action === 'enter-app' || action === 'login-submit') setOverlay(welcomeModal(), 'welcome', false);
  if (action === 'back' || action === 'close') goBack();
  if (action === 'close-notice') goBack();
  if(action==='welcome-close'){openScreen('home');const q=new URLSearchParams(location.search);if(q.has('activity')&&activities[q.get('activity')])openActivity(q.get('activity'));else if(q.has('profile')&&db.users[q.get('profile')]){state.currentUserId=q.get('profile');setOverlay(profileScreen(state.currentUserId),`profile:${state.currentUserId}`);}else if(q.has('listing')&&db.marketplaceListings[q.get('listing')]){state.currentListingId=q.get('listing');setOverlay(listingScreen(state.currentListingId),`listing:${state.currentListingId}`);}}
  if (action === 'create') {state.pendingUploads=[];setOverlay(createSheet(), 'create');}
  if (action === 'record') setOverlay(recordMatch(), 'record-match');
  if(action==='activity-menu'){
    const id=actionNode.dataset.activityId,a=activities[id];document.querySelectorAll('.session-actions-popover').forEach(n=>n.remove());
    actionNode.closest('.activity-card').insertAdjacentHTML('beforeend',a.authorUserId==='manny'?`<div class="session-actions-popover"><button data-action="edit-post" data-activity-id="${id}">Edit</button><button data-action="archive-post" data-activity-id="${id}">Archive</button><button data-action="remove-post" data-activity-id="${id}">Remove</button></div>`:`<div class="session-actions-popover"><button data-action="activity-detail" data-activity="${id}">View activity</button></div>`);
  }
  if(action==='edit-post')setOverlay(editPostScreen(actionNode.dataset.activityId),'edit-post');
  if(action==='save-post'){const id=actionNode.dataset.activityId;Object.assign(db.baseActivities[id],{title:escapeText(overlay.querySelector('[data-field="post-title"]').value),copy:escapeText(overlay.querySelector('[data-field="post-copy"]').value)});db.reconcile();db.persist();renderFeedActivities();openActivity(id,false);}
  if(action==='archive-post'){db.archiveActivity(actionNode.dataset.activityId);renderFeedActivities();refreshProfile();}
  if(action==='remove-post'){db.deleteActivity(actionNode.dataset.activityId);renderFeedActivities();refreshProfile();}
  if(action==='recover-activity'){db.restoreActivity(actionNode.dataset.activityId);renderFeedActivities();setOverlay(archiveScreen(),'archive',false);}
  if(action==='open-archive')setOverlay(archiveScreen(),'archive');
  if(action==='restore-activity'){db.archiveActivity(actionNode.dataset.activityId,false);renderFeedActivities();setOverlay(archiveScreen(),'archive',false);}
  if (action === 'session-menu') {
    document.querySelectorAll('.session-actions-popover').forEach(menu=>menu.remove());
    const card=actionNode.closest('.activity-card');
    if (card) card.insertAdjacentHTML('beforeend',sessionActionsMenu(actionNode.dataset.sessionId));
  }
  if (action === 'confirm-delete-session') setOverlay(deleteConfirmation(actionNode.dataset.sessionId),`delete-confirm:${actionNode.dataset.sessionId}`);
  if (action === 'send-match') { captureSessionDraft(); setOverlay(pendingMatch(), 'pending-match'); }
  if (action === 'confirm-request') setOverlay(confirmMatch(), 'confirm-match');
  if (action === 'verify') { const created=createSessionFromDraft(); if (created) { state.matchStatus='confirmed'; ensureRecordedActivity(); bindFeedActivities(); setOverlay(verified(), 'verified-match'); } else toast('Choose a public opponent deck first'); }
  if (action === 'edit-session') {
    document.querySelectorAll('.session-actions-popover').forEach(menu=>menu.remove());
    state.editSessionId=actionNode.dataset.sessionId;
    setOverlay(editSession(state.editSessionId),`edit-session:${state.editSessionId}`);
  }
  if (action === 'archive-session') {
    db.archiveActivity(db.sessions[actionNode.dataset.sessionId]?.activityId);
    renderFeedActivities();refreshProfile();
    document.querySelectorAll('.session-actions-popover').forEach(menu=>menu.remove());
    toast('Session archived · record preserved');
  }
  if (action === 'remove-session') {
    const sessionId=actionNode.dataset.sessionId;
    document.querySelectorAll('.session-actions-popover').forEach(menu=>menu.remove());
    const deleted=db.deleteSession(sessionId);
    if (deleted) { renderFeedActivities(); refreshProfile(); bindFeedActivities(); toast('Session removed from connected views'); }
  }
  if (action === 'save-session-edit') {
    const sessionId=actionNode.dataset.sessionId;
    const value=(field)=>overlay.querySelector(`[data-field="${field}"]`)?.value;
    const changes={title:escapeText(value('edit-title')),score:[Number(value('edit-your-score')),Number(value('edit-opponent-score'))],duration:value('edit-duration'),copy:escapeText(value('edit-note'))};
    const updated=db.updateSession(sessionId,changes);
    if (updated) {
      const edits=JSON.parse(localStorage.getItem('verso_session_edits_v194') || '{}');
      edits[sessionId]=changes;
      localStorage.setItem('verso_session_edits_v194',JSON.stringify(edits));
      if (sessionId==='s-created-01') localStorage.setItem('verso_created_session_v194',JSON.stringify(db.sessions[sessionId]));
      renderFeedActivities();
      bindFeedActivities();
      state.currentActivity=updated.id;
      setOverlay(activityDetail(updated.id),`activity:${updated.id}`,false);
      toast('Session updated everywhere');
    }
  }
  if (action === 'delete-session') {
    const sessionId=actionNode.dataset.sessionId;
    const deleted=db.deleteSession(sessionId);
    if (deleted) {
      const deletedIds=JSON.parse(localStorage.getItem('verso_deleted_sessions_v194') || '[]');
      if (!deletedIds.includes(sessionId)) deletedIds.push(sessionId);
      localStorage.setItem('verso_deleted_sessions_v194',JSON.stringify(deletedIds));
      if (sessionId==='s-created-01') localStorage.removeItem('verso_created_session_v194');
      renderFeedActivities();
      bindFeedActivities();
      openScreen('home',false);
      toast('Session deleted from Feed, Profiles and Database');
    }
  }
  if (action === 'logout') {
    state.navigation=[];
    state.currentView='landing';
    overlay.innerHTML=homepageMockup();
    syncOverlayScroll();
    window.scrollTo({top:0,behavior:'auto'});
  }
  if (action === 'dispute') toast('Match marked for review');
  if (action === 'activity-detail') openActivity(actionNode.dataset.activity || activityCard?.dataset.activity || state.currentActivity);
  if (action === 'open-user') {
    const userId=actionNode.dataset.userId;
    state.currentUserId=userId;
    setOverlay(profileScreen(userId,'overview'),`profile:${userId}`);
  }
  if (action === 'profile-tab') {
    const scrollTop=overlay.querySelector('.prototype-panel')?.scrollTop || 0;
    setOverlay(profileScreen(state.currentUserId,actionNode.dataset.tab),`profile:${state.currentUserId}:${actionNode.dataset.tab}`,false,scrollTop);
  }
  if (action === 'open-deck') {
    state.currentDeckId=actionNode.dataset.deckId;
    setOverlay(deckScreen(state.currentDeckId),`deck:${state.currentDeckId}`);
  }
  if (action === 'open-shop') {
    state.currentShopId=actionNode.dataset.shopId;
    setOverlay(shopScreen(state.currentShopId),`shop:${state.currentShopId}`);
  }
  if (action === 'open-event') {
    state.currentEventId=actionNode.dataset.eventId;
    setOverlay(eventScreen(state.currentEventId),`event:${state.currentEventId}`);
  }
  if (action === 'open-listing') {
    state.currentListingId=actionNode.dataset.listingId;
    setOverlay(listingScreen(state.currentListingId),`listing:${state.currentListingId}`);
  }
  if(action==='purchase')toast('Demo only: no message was sent. Contact the seller outside this prototype.');
  if(action==='share-listing'){copyLink('listing',actionNode.dataset.listingId);}
  if(action==='shop-badge')setOverlay(shopBadgeScreen(actionNode.dataset.shopId),`shop-badge:${actionNode.dataset.shopId}`);
  if(action==='delete-comment'){delete db.comments[actionNode.dataset.commentId];db.reconcile();db.persist();renderFeedActivities();setOverlay(commentsScreen(state.currentActivity),`comments:${state.currentActivity}`,false);}
  if (action === 'explore-tab') {
    const pane=actionNode.dataset.pane;
    const search=overlay.querySelector('[data-field="explore-search"]');
    if(search)search.value='';
    overlay.querySelectorAll('[data-action="explore-tab"]').forEach(button=>{const selected=button.dataset.pane===pane;button.classList.toggle('active',selected);if(button.getAttribute('role')==='tab')button.setAttribute('aria-selected',String(selected));});
    overlay.querySelectorAll('[data-explore-pane]').forEach(section=>{const selected=section.dataset.explorePane===pane;section.classList.toggle('active',selected);section.hidden=!selected;});
    setExploreSearch('');
    overlay.querySelector('.prototype-panel')?.scrollTo({top:0,behavior:'auto'});
  }
  if(action==='explore-search-clear'){
    const input=overlay.querySelector('[data-field="explore-search"]');
    if(input){input.value='';setExploreSearch('');input.focus();}
  }
  if (action === 'photo-viewer') setOverlay(photoViewer(actionNode.dataset.photoId),`photo:${actionNode.dataset.photoId}`);
  if (action === 'open-badge') {
    const sourceActivityId=actionNode.closest('[data-activity]')?.dataset.activity;
    const sourceActivity=activities[sourceActivityId];
    if (sourceActivity?.authorUserId) state.currentUserId=sourceActivity.authorUserId;
    else if (sourceActivity?.playerIds?.length) state.currentUserId=sourceActivity.playerIds[0];
    state.currentBadgeId=actionNode.dataset.badgeId;
    setOverlay(badgeScreen(state.currentBadgeId,state.currentUserId),`badge:${state.currentBadgeId}`);
  }
  if (action === 'pin-badge') {
    if(state.currentUserId!=='manny'||!db.users.manny.badgeIds.includes(actionNode.dataset.badgeId)){toast('Only your earned badges can be pinned');return;}
    const user=userById(state.currentUserId),badgeId=actionNode.dataset.badgeId,index=user.pinnedBadgeIds.indexOf(badgeId);
    if (index>=0) user.pinnedBadgeIds.splice(index,1); else user.pinnedBadgeIds.unshift(badgeId);
    db.persist();actionNode.textContent=index>=0?'Pin to profile':'Pinned ✓';
    toast(index>=0?'Badge removed from pinned':'Badge pinned to Profile');
  }
  if(action==='share-badge'){const id=Object.values(activities).find(a=>db.belongsTo(a,state.currentUserId)&&a.earnedBadgeIds?.includes(actionNode.dataset.badgeId))?.id;if(id)setOverlay(shareModal(id),`share:${id}`);else toast('No activity to share for this badge yet');}
  if (action === 'trait-info') toast('Player Traits are calculated from Sessions, Decks, Events, collection posts and Partner visits.');
  if (action === 'carousel-prev' || action === 'carousel-next') {
    const carousel = actionNode.closest('.activity-carousel');
    const slides = [...carousel.querySelectorAll('.carousel-slide')];
    const current = Math.max(0, slides.findIndex(slide => slide.classList.contains('active')));
    updateCarousel(actionNode, current + (action === 'carousel-next' ? 1 : -1));
  }
  if (action === 'carousel-go') updateCarousel(actionNode, Number(actionNode.dataset.index));
  if (action === 'gallery-open') {
    const id = activityCard?.dataset.activity || state.currentActivity;
    state.currentActivity = id;
    const item = activities[id];
    const gallery=item?.type==='event'?eventPostGallery(item):item?.gallery;
    if (gallery?.length) setOverlay(galleryViewer({...item,gallery}, Number(actionNode.dataset.index || 0)), `gallery:${id}`);
  }
  if (action === 'gallery-prev' || action === 'gallery-next') {
    const current = Number(document.querySelector('.gallery-stage')?.dataset.galleryIndex || 0);
    updateGalleryViewer(current + (action === 'gallery-next' ? 1 : -1));
  }
  if (action === 'gallery-go') updateGalleryViewer(Number(actionNode.dataset.index));
  if (action === 'share') {
    const id = actionNode.dataset.activity || activityCard?.dataset.activity || state.currentActivity;
    state.currentActivity = id;
    setOverlay(shareModal(id), `share:${id}`);
  }
  if (action === 'profile-qr') setOverlay(profileQrModal(), 'profile-qr');
  if(action==='copy-profile-link')copyLink('profile',state.currentUserId);
  if (action === 'download') actionNode.closest('.share-studio') ? downloadShareCard(state.currentActivity) : toast('QR card saved (prototype)');
  if (action === 'copy') { navigator.clipboard?.writeText(location.href); toast('Link copied'); }
  if(action==='share-instagram'){const mode=document.querySelector('[data-action="share-platform"].active')?.dataset.platform;if(mode==='link')copyLink('activity',state.currentActivity);else {await downloadShareCard(state.currentActivity);toast('Image saved. Upload it to Instagram to share.');}}
  if (action === 'share-format') {
    document.querySelectorAll('[data-action="share-format"]').forEach(button => button.classList.toggle('active', button === actionNode));
    const preview = document.querySelector('#share-preview');
    preview.classList.toggle('story', actionNode.dataset.format === 'story');
    preview.classList.toggle('square', actionNode.dataset.format === 'square');
  }
  if (action === 'share-frame') {
    document.querySelectorAll('[data-action="share-frame"]').forEach(button => button.classList.toggle('active', button === actionNode));
    const preview = document.querySelector('#share-preview');
    [...preview.classList].filter(name => name.startsWith('frame-')).forEach(name => preview.classList.remove(name));
    preview.classList.add(`frame-${actionNode.dataset.frame}`);
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
  if (action === 'comment') {const id=activityCard?.dataset.activity || state.currentActivity;state.currentActivity=id;setOverlay(commentsScreen(id),`comments:${id}`);}
  if(action==='post-comment'){db.addComment(state.currentActivity,escapeText(overlay.querySelector('[data-field="comment"]').value));setOverlay(commentsScreen(state.currentActivity),`comments:${state.currentActivity}`,false);renderFeedActivities();}
  if(action==='edit-profile')setOverlay(editProfileScreen(),'edit-profile');
  if(action==='save-profile'){db.users.manny.name=escapeText(overlay.querySelector('[data-field="profile-name"]').value.trim()||'Manny S.');db.users.manny.bio=escapeText(overlay.querySelector('[data-field="profile-bio"]').value.trim());db.persist();goBack();renderFeedActivities();}
  if(action==='follow-menu'){
    const control=actionNode.closest('.profile-follow-control'),existing=control.querySelector('.profile-follow-menu');
    if(existing){existing.remove();actionNode.setAttribute('aria-expanded','false');}
    else{control.insertAdjacentHTML('beforeend',`<div class="profile-follow-menu" role="menu"><button data-action="unfollow-user">${profileActionIcon('unfollow')}<b>Unfollow</b></button></div>`);actionNode.setAttribute('aria-expanded','true');}
  }
  if(action==='unfollow-user'){
    const list=db.preferences.following,index=list.indexOf(state.currentUserId);if(index>=0)list.splice(index,1);db.persist();refreshProfile();toast(`Unfollowed ${userById(state.currentUserId).name}`);
  }
  if(action==='follow'){
    const shop=state.currentView.startsWith('shop'),id=shop?`shop:${state.currentShopId}`:state.currentUserId,list=db.preferences.following,index=list.indexOf(id);
    if(index<0)list.push(id);else list.splice(index,1);db.persist();
    if(shop)actionNode.textContent=index<0?'Following ✓':'＋ Follow';else{refreshProfile();toast(index<0?`Following ${userById(id).name}`:`Unfollowed ${userById(id).name}`);}
  }
  if (action === 'join') { db.joinEvent(state.currentEventId);setOverlay(eventScreen(state.currentEventId),`event:${state.currentEventId}`,false);renderFeedActivities();toast('You are on the guest list'); }
  if (action === 'save-event') {if(!db.preferences.savedEvents.includes(state.currentEventId))db.preferences.savedEvents.push(state.currentEventId);db.persist();actionNode.textContent='Saved ✓';toast('Event saved');}
  if(action==='calendar')toast(`${db.events[activities[state.currentActivity]?.eventId || state.currentEventId]?.date || ''} · Calendar preview only; no calendar was changed`);
  if (action === 'location') toast('Opening Mana House location (prototype)');
  if (action === 'checkin' || action === 'scan-shop') {const item=db.checkIn(state.currentShopId);if(item)state.currentActivity=item.id;renderFeedActivities();setOverlay(stampUnlock(),'stamp-unlock');}
  if (action === 'remove-upload') {
    state.pendingUploads=[];
    const preview=overlay.querySelector('[data-upload-preview]');
    if (preview) { preview.hidden=true; const thumbs=preview.querySelector('.upload-thumbs'); if(thumbs) thumbs.innerHTML=''; }
    const input=overlay.querySelector('[data-field="session-image"]');
    if (input) input.value='';
  }
  if (action === 'pin') { state.pinned = !state.pinned; actionNode.textContent = state.pinned ? 'Pinned ✓' : 'Pin to profile'; toast(state.pinned ? 'Badge pinned to profile' : 'Badge unpinned'); }
  if (action === 'privacy') { state.deckPrivate = actionNode.checked; openScreen('deck'); toast(state.deckPrivate ? 'Deck list is private' : 'Deck list is public'); }
  if (action === 'moment') {state.pendingUploads=[];setOverlay(momentForm(),'moment');}
  if(action==='publish-moment'){
    const field=name=>overlay.querySelector('[data-field="'+name+'"]').value;
    const item=db.createMoment({title:escapeText(field('moment-title').trim()||'A moment at the table'),copy:escapeText(field('moment-copy')),type:field('moment-type')});
    state.pendingUploads.forEach(upload=>{const assetId=db.uid('upload'),id=db.uid('photo');db.assets[assetId]={id:assetId,path:upload.url,ownerId:'manny',usedBy:[id],relatedEntityId:item.id};db.registerPhoto({id,ownerUserId:'manny',activityId:item.id,assetId,visualKey:id});});
    db.reconcile();db.persist();syncPhotoStyles();state.pendingUploads=[];renderFeedActivities();openActivity(item.id,false);toast('Your moment is published');
  }
  if(action==='calendar-month'){const d=new Date(state.calendarMonth+'-02');d.setMonth(d.getMonth()+Number(actionNode.dataset.delta));state.calendarMonth=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0');refreshProfile();}
  if(action==='calendar-day'){const hits=calendarDays(actionNode.dataset.userId||null).filter(a=>Number(a.date.slice(8,10))===Number(actionNode.dataset.day));if(hits.length===1)openActivity(hits[0].id);else setOverlay(panel('Your day',state.calendarMonth+'-'+actionNode.dataset.day,hits.map(a=>renderActivityCard(a.id)).join('')),'calendar-day');}
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
    const id=activityCard?.dataset.activity;if(id){db.toggleLike(id);const a=activities[id];document.querySelectorAll('[data-activity="'+id+'"] [data-action="like"]').forEach(button=>{button.classList.toggle('liked',a.liked);button.querySelector('b').textContent=a.likes;button.querySelector('span').textContent=a.liked?'♥':'♡';});}
  }
});

document.addEventListener('change', (event) => {
  const input=event.target.closest('[data-field="session-image"]');
  if (!input?.files?.length) return;
  const files=[...input.files].slice(0,4);
  if (files.some(file=>!/^image\/(jpeg|png|webp)$/.test(file.type))) { toast('Choose JPG, PNG or WebP images'); input.value=''; return; }
  if (files.some(file=>file.size>8*1024*1024)) { toast('Each image must be smaller than 8 MB'); input.value=''; return; }
  Promise.all(files.map(file=>new Promise(resolve=>{const reader=new FileReader();reader.onerror=()=>resolve(null);reader.onload=()=>resolve({url:String(reader.result),name:file.name});reader.readAsDataURL(file);}))).then(uploads=>{
    state.pendingUploads=uploads.filter(Boolean);
    const preview=overlay.querySelector('[data-upload-preview]');
    if (preview) { preview.hidden=false; preview.querySelector('.upload-thumbs').innerHTML=uploadPreviewMarkup(); preview.querySelector('strong').textContent=`${uploads.length} photo${uploads.length>1?'s':''} ready`; }
  });
});

document.addEventListener('input',event=>{
  const input=event.target.closest('[data-field="explore-search"]');
  if(input)setExploreSearch(input.value);
});

window.addEventListener('keydown', (event) => { if (event.key === 'Escape') goBack(); });


renderFeedActivities();
document.querySelectorAll('[data-calendar]').forEach(calendar=>calendar.innerHTML=calendarCells('manny'));
const greeting=document.querySelector('.feed-head .eyebrow');if(greeting)greeting.textContent='HOME · '+new Date().toLocaleDateString('en',{weekday:'long',day:'numeric',month:'long'}).toUpperCase();

bindFeedActivities();
state.currentView = 'landing';
overlay.innerHTML = homepageMockup();
syncOverlayScroll();
