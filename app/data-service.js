/* Canonical runtime state. Seed records stay in database-v1.js; all mutations
   reconcile derived views and persist together, including uploaded photos. */
(() => {
  const db = window.VERSO_DB;
  const key = 'verso_database_v194_2';
  const seed=JSON.parse(JSON.stringify({sessions:db.sessions,baseActivities:db.baseActivities,comments:db.comments,photos:db.photos,assets:db.assets}));
  db.trash={};
  const tables = ['users','sessions','baseActivities','photos','assets','comments','passportStamps','events','eventAttendance','userBadges','trash'];
  const uid = prefix => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`;
  db.preferences = {following:[], savedEvents:[]};
  db.uid = uid;
  db.belongsTo = (a, userId) => !!a && (a.authorUserId === userId || a.playerIds?.includes(userId));
  db.isPhoto = photo => !!photo && photo.type !== 'session-graphic' && !!db.assets[photo.assetId] && !photo.assetId.startsWith('graphic_');
  db.activityIdsFor = (userId, includeArchived = false) => Object.values(db.activities).filter(a => db.belongsTo(a,userId) && (includeArchived || !a.archived)).sort((a,b) => (b.createdAt || b.date || '').localeCompare(a.createdAt || a.date || '')).map(a=>a.id);
  db.persist = () => {
    try { localStorage.setItem(key, JSON.stringify({version:2,...Object.fromEntries(tables.map(t=>[t,db[t]])),feedActivityOrder:db.feedActivityOrder,preferences:db.preferences})); return true; }
    catch (error) { window.dispatchEvent(new CustomEvent('verso-storage-error')); return false; }
  };
  const originalValidate = db.validate;
  db.reconcile = () => {
    Object.values(db.sessions).forEach(s=>{if(s.eventId&&db.events[s.eventId]?.shopId!==s.shopId)s.eventId=null;});
    Object.keys(db.activities).forEach(id => { if (!db.baseActivities[id]) { delete db.activities[id]; delete db.shareCards[id]; } });
    Object.values(db.baseActivities).forEach((base,index) => {
      base.commentIds = Object.values(db.comments).filter(c=>c.activityId===base.id).map(c=>c.id);
      base.earnedBadgeIds = [...new Set(base.earnedBadgeIds || (base.badgeId ? [base.badgeId] : []))].filter(id=>db.badges[id]);
      base.date ||= db.sessions[base.sessionId]?.date || `2026-08-${String(28-index%20).padStart(2,'0')}`;
      const a = db.materializeActivity(base.id);
      a.date = base.date;
      a.gallery = a.photoIds?.length > 1 ? a.photoIds.map(id=>db.photos[id]?.visualKey).filter(Boolean) : null;
      a.earnedBadges = (a.earnedBadgeIds || []).map(id=>db.badges[id].name);
      db.activities[a.id] = a;
      db.shareCards[a.id] = {...db.shareCards[a.id],id:`share-${a.id}`,activityId:a.id,title:a.title,location:a.location,media:a.gallery?.[0] || a.media,photoIds:a.photoIds || [],earnedBadgeIds:a.earnedBadgeIds || [],frame:a.type==='match'?'stats':a.type==='collect'?'collector':'journey',cheer:a.type==='match'?'GOOD GAME. RUN IT BACK.':'EVERY CARD. EVERY STORY.'};
    });
    db.feedActivityOrder.splice(0,db.feedActivityOrder.length,...[...new Set([...db.feedActivityOrder,...Object.keys(db.activities)])].filter(id=>db.activities[id]&&!db.activities[id].archived));
    Object.values(db.users).forEach(user => {
      const own = Object.values(db.activities).filter(a=>db.belongsTo(a,user.id));
      user.albumActivityIds = own.filter(a=>a.photoIds?.some(id=>db.isPhoto(db.photos[id]))).map(a=>a.id);
      user.albumPhotoIds = Object.values(db.photos).filter(p=>p.ownerUserId===user.id && db.isPhoto(p) && !db.activities[p.activityId]?.archived).map(p=>p.id);
      Object.values(db.userBadges).filter(r=>r.userId===user.id&&r.sourceActivityIds).forEach(r=>delete db.userBadges[r.id]);
      const earned = new Set(Object.values(db.userBadges).filter(r=>r.userId===user.id).map(r=>r.badgeId));
      own.forEach(a => (a.earnedBadgeIds || []).forEach(badgeId => {
        const id=`earned-${user.id}-${badgeId}`;
        const record=db.userBadges[id] ||= {id,userId:user.id,badgeId,earnedDate:a.date,sourceActivityIds:[]};
        record.sourceActivityIds.push(a.id); earned.add(badgeId);
      }));
      user.badgeIds=[...earned];
      user.pinnedBadgeIds=user.pinnedBadgeIds.filter(id=>earned.has(id));
      user.xp=own.length*160+earned.size*240;
    });
    Object.values(db.decks).forEach(deck => {
      const sessions=Object.values(db.sessions).filter(s=>s.deckIds.includes(deck.id));
      deck.sessions=sessions.length;
      deck.winRate=sessions.length?Math.round(sessions.filter(s=>{const i=s.deckIds.indexOf(deck.id);return s.score[i]>s.score[1-i];}).length/sessions.length*100):0;
    });
    Object.values(db.shops).forEach(shop=>{shop.checked=Object.values(db.passportStamps).some(s=>s.userId==='manny'&&s.shopId===shop.id);});
    Object.values(db.assets).forEach(asset=>{asset.usedBy=(asset.usedBy || []).filter(id=>db.photos[id]||db.activities[id]||db.users[id]||db.shops[id]||db.events[id]||db.badges[id]||db.marketplaceListings[id]);});
  };
  const register=db.registerSession, update=db.updateSession, remove=db.deleteSession;
  db.registerSession = draft => {
    const sessionId=draft.sessionId || uid('session'),activityId=draft.activityId || uid('match');
    if(db.sessions[sessionId] || db.baseActivities[activityId]) throw new Error('Duplicate session ID');
    draft={...draft,sessionId,activityId,photoIds:draft.photoIds || [],earnedBadgeIds:draft.earnedBadgeIds || []};
    if(draft.playerIds.length!==2 || draft.deckIds.some((id,i)=>db.decks[id]?.ownerId!==draft.playerIds[i]) || !db.shops[draft.shopId]) throw new Error('Invalid session relationships');
    draft.games=draft.score.reduce((n,v)=>n+v,0);
    register(draft); db.reconcile(); db.persist(); return db.activities[activityId];
  };
  db.updateSession = (id,changes) => { const result=update(id,changes); if(!result)return null;const s=db.sessions[id];s.games=s.score.reduce((n,v)=>n+v,0);s.result=s.score[0]>s.score[1]?'win':s.score[0]<s.score[1]?'loss':'draw';db.reconcile();db.persist();return db.activities[s.activityId]; };
  db.deleteSession = id => {const s=db.sessions[id];if(s)db.trash[s.activityId]={session:JSON.parse(JSON.stringify(s)),activity:db.baseActivities[s.activityId],photos:Object.values(db.photos).filter(p=>p.activityId===s.activityId),comments:Object.values(db.comments).filter(c=>c.activityId===s.activityId)};const result=remove(id);db.reconcile();db.persist();return result;};
  db.restoreActivity=id=>{const t=db.trash[id];if(!t)return false;if(t.session)db.sessions[t.session.id]=t.session;db.baseActivities[id]=t.activity;t.photos.forEach(p=>db.photos[p.id]=p);t.comments.forEach(c=>db.comments[c.id]=c);delete db.trash[id];db.feedActivityOrder.unshift(id);db.reconcile();db.persist();return true;};
  db.archiveActivity = (id,archived=true) => {if(!db.baseActivities[id])return;db.baseActivities[id].archived=archived;db.reconcile();db.persist();};
  db.deleteActivity = id => {const a=db.baseActivities[id];if(!a)return false;if(a.sessionId)return db.deleteSession(a.sessionId);Object.keys(db.photos).forEach(pid=>{if(db.photos[pid].activityId===id)delete db.photos[pid];});Object.keys(db.comments).forEach(cid=>{if(db.comments[cid].activityId===id)delete db.comments[cid];});Object.values(db.passportStamps).forEach(stamp=>{if(stamp.activityId===id)delete stamp.activityId;});delete db.baseActivities[id];db.reconcile();db.persist();return true;};
  db.addComment = (activityId,text) => {
    if(!db.activities[activityId] || !text.trim())return null;
    const id=uid('comment');db.comments[id]={id,activityId,userId:'manny',text:text.trim().slice(0,1000),time:'just now'};db.reconcile();db.persist();return db.comments[id];
  };
  db.toggleLike = id => {const a=db.baseActivities[id];if(!a)return;a.liked=!a.liked;a.likes=Math.max(0,(a.likes||0)+(a.liked?1:-1));db.reconcile();db.persist();};
  db.checkIn = shopId => {
    const shop=db.shops[shopId];if(!shop)return null;
    const stampId=`stamp-manny-${shopId}`, previous=Object.values(db.passportStamps).find(s=>s.userId==='manny'&&s.shopId===shopId);
    if(previous?.lastCheckIn===new Date().toISOString().slice(0,10))return db.activities[previous.activityId] || null;
    const activityId=uid('checkin'),date=new Date().toISOString().slice(0,10);
    const stamp=previous || {id:stampId,userId:'manny',shopId,shopBadgeId:shop.shopBadgeId || `shop_badge_${shopId}`,visits:0};
    stamp.visits=(stamp.visits||0)+1;stamp.lastCheckIn=date;stamp.activityId=activityId;db.passportStamps[stamp.id]=stamp;
    db.baseActivities[activityId]={id:activityId,type:'shop',authorUserId:'manny',shopId,shopBadgeId:stamp.shopBadgeId,title:`A new chapter at ${shop.name}`,copy:'Checked in, found a table, and kept another place in my story.',date,time:'just now',media:'stamp-graphic',photoIds:[],likes:0,commentIds:[],earnedBadgeIds:[],achievement:`${shop.name} · visit ${stamp.visits}`};
    db.feedActivityOrder.unshift(activityId);db.reconcile();db.persist();return db.activities[activityId];
  };
  db.joinEvent = eventId => {const event=db.events[eventId];if(!event)return; if(!event.attendeeIds.includes('manny'))event.attendeeIds.push('manny');const id=`attendance-${eventId}-manny`;db.eventAttendance[id]={id,userId:'manny',eventId,status:'registered'};db.reconcile();db.persist();};
  db.createMoment = ({title,copy,photoIds=[],type='moment'}) => {const id=uid('post');db.baseActivities[id]={id,type,authorUserId:'manny',title,copy,photoIds,media:'card-graphic',date:new Date().toISOString().slice(0,10),time:'just now',likes:0,commentIds:[],earnedBadgeIds:type==='collect'?['badge_grail_found']:[],achievement:type==='collect'?'Grail Found':'A moment worth keeping',rarity:'COLLECTOR STORY'};db.feedActivityOrder.unshift(id);db.reconcile();return db.activities[id];};
  try {
    const saved=JSON.parse(localStorage.getItem(key) || 'null');
    if(saved?.version===2){tables.forEach(t=>{Object.keys(db[t]).forEach(id=>delete db[t][id]);Object.assign(db[t],saved[t]);});db.feedActivityOrder.splice(0,db.feedActivityOrder.length,...saved.feedActivityOrder);Object.assign(db.preferences,saved.preferences);}
  } catch(error){console.warn('Saved prototype data could not be restored',error);}
  Object.values(seed.baseActivities).filter(a=>!db.baseActivities[a.id]).forEach(a=>{db.trash[a.id]={activity:a,session:seed.sessions[a.sessionId],photos:Object.values(seed.photos).filter(p=>p.activityId===a.id),comments:Object.values(seed.comments).filter(c=>c.activityId===a.id)};});
  db.reconcile();
  db.validate = () => {
    const result=originalValidate();
    Object.values(db.activities).forEach(a=>{
      if(db.shareCards[a.id]?.title!==a.title)result.errors.push(`Stale share ${a.id}`);
      (a.earnedBadgeIds || []).forEach(id=>{if(!db.badges[id])result.errors.push(`Unknown earned badge ${a.id}:${id}`);});
      (a.photoIds || []).forEach(id=>{if(db.photos[id]?.activityId!==a.id)result.errors.push(`Photo activity mismatch ${a.id}:${id}`);});
    });
    Object.values(db.sessions).forEach(s=>{if(s.games!==s.score.reduce((n,v)=>n+v,0))result.errors.push(`Game count mismatch ${s.id}`);});
    result.ok=!result.errors.length;return result;
  };
})();
