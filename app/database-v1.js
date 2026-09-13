/* VERSO Mock Database V1.0
   Canonical relationships for users, sessions, decks, events, shops, comments and activities. */
window.VERSO_DB = (() => {
  const users = {
    manny:{id:'manny',name:'Manny S.',shortName:'Manny',handle:'@manny',city:'Chiang Mai',avatar:'manny',game:'Multi-TCG',role:'Collector · Control Player',bio:'One Piece player, binder enjoyer, and card-shop traveler.',tags:['COLLECTOR','CONTROL PLAYER','TRAVELER','EVENT HUNTER'],level:24,levelName:'Storykeeper',sp:1840,badges:['Grail Found','Cardboard Tourist','First Match','Same Rival. Again.','Session Builder'],albumActivityIds:['match-onepiece','match-manny-magic','match-manny-lorcana','match-manny-yugioh','match-manny-pokemon','event-community','collect-alt-art','badge-first-match']},
    poom:{id:'poom',name:'Poom T.',shortName:'Poom',handle:'@poom',city:'Bangkok',avatar:'poom',game:'One Piece',role:'Competitive · Aggro Player',bio:'Red Zoro grinder. Here for close games and good rivals.',tags:['COMPETITIVE','AGGRO PLAYER','LOCAL REGULAR'],level:21,levelName:'Rival',sp:1510,badges:['Same Rival. Again.','Top Cut'],albumActivityIds:['match-onepiece','match-yugioh','event-regional']},
    may:{id:'may',name:'May K.',shortName:'May',handle:'@may.cards',city:'Chiang Mai',avatar:'may',game:'Pokémon',role:'Collector · Grail Hunter',bio:'Graded cards, beautiful binders, and the chase for one perfect copy.',tags:['COLLECTOR','GRAIL HUNTER','PHOTOGRAPHER'],level:20,levelName:'Grailkeeper',sp:1440,badges:['Grail Found','Cardboard Tourist'],albumActivityIds:['collect-gem-photo','graded-gem','badge-tourist','event-community']},
    bam:{id:'bam',name:'Bam N.',shortName:'Bam',handle:'@bam.table',city:'Chiang Mai',avatar:'bank',game:'Magic',role:'Community Host',bio:'Building welcoming tables and running friendly multi-TCG nights.',tags:['COMMUNITY HOST','EVENT CREW','BREWER'],level:26,levelName:'Tablemaker',sp:2120,badges:['Community Builder','Local Legend'],albumActivityIds:['event-community','event-regional','match-magic']},
    nook:{id:'nook',name:'Nook W.',shortName:'Nook',handle:'@nook.draw',city:'Bangkok',avatar:'nook',game:'Magic',role:'Weekend Warrior',bio:'Control decks, trade binders, and long final games.',tags:['CONTROL PLAYER','TRADER','WEEKEND WARRIOR'],level:19,levelName:'Tactician',sp:1375,badges:['Binder Starter','Trust the Process'],albumActivityIds:['moment-binder','match-magic','event-regional']},
    fern:{id:'fern',name:'Fern P.',shortName:'Fern',handle:'@fern.ink',city:'Chiang Mai',avatar:'fern',game:'Lorcana',role:'Collector · Event Hunter',bio:'Ink, stories, launch parties, and friendly games.',tags:['LORCANA','COLLECTOR','EVENT HUNTER'],level:18,levelName:'Storyfinder',sp:1260,badges:['Opening Crew','Good Game!'],albumActivityIds:['match-lorcana','event-lorcana','collect-gem-photo']},
    aim:{id:'aim',name:'Aim R.',shortName:'Aim',handle:'@aim.table',city:'Chiang Mai',avatar:'aim',game:'Lorcana',role:'Community Player',bio:'New decks, good games, and meeting people at the table.',tags:['COMMUNITY','LORCANA','DECK TESTER'],level:15,levelName:'Spark',sp:980,badges:['Good Game!'],albumActivityIds:['match-lorcana','event-lorcana']},
    nine:{id:'nine',name:'Nine C.',shortName:'Nine',handle:'@nine.duels',city:'Bangkok',avatar:'nine',game:'Yu-Gi-Oh!',role:'Event Hunter',bio:'Fast sets, tournament weekends, and sharp side-deck calls.',tags:['YU-GI-OH!','COMPETITIVE','EVENT HUNTER'],level:23,levelName:'Duelist',sp:1760,badges:['Top Cut','Night Owl'],albumActivityIds:['match-yugioh','event-regional']},
    krit:{id:'krit',name:'Krit V.',shortName:'Krit',handle:'@krit.control',city:'Chiang Mai',avatar:'kai',game:'One Piece',role:'Control Player',bio:'Patient turns and late-night rematches at the local.',tags:['CONTROL PLAYER','LOCAL REGULAR'],level:17,levelName:'Planner',sp:1140,badges:['First Rivalry'],albumActivityIds:['match-krit-win','event-community']},
    win:{id:'win',name:'Win J.',shortName:'Win',handle:'@win.cards',city:'Chiang Mai',avatar:'win',game:'One Piece',role:'Local Regular',bio:'Learning every matchup one friendly session at a time.',tags:['LOCAL REGULAR','PURPLE PLAYER'],level:14,levelName:'Challenger',sp:850,badges:['First Rivalry'],albumActivityIds:['match-krit-win','event-community']},
  };

  const decks = {
    'deck-manny-blue':{id:'deck-manny-blue',ownerId:'manny',name:'Blue Doflamingo',game:'ONE PIECE CARD GAME',color:'blue',public:true,format:'Standard',sessions:28,winRate:61,cards:50,updated:'2 days ago',cover:'CONTROL THE CURRENT'},
    'deck-manny-purple':{id:'deck-manny-purple',ownerId:'manny',name:'Purple Luffy',game:'ONE PIECE CARD GAME',color:'purple',public:false,format:'Standard',sessions:12,winRate:50,cards:50,updated:'1 week ago',cover:'PRIVATE TEST LIST'},
    'deck-manny-dimir':{id:'deck-manny-dimir',ownerId:'manny',name:'Dimir Midrange',game:'MAGIC: THE GATHERING',color:'blue',public:true,format:'Standard',sessions:8,winRate:57,cards:60,updated:'today',cover:'READ THE TABLE'},
    'deck-manny-steel':{id:'deck-manny-steel',ownerId:'manny',name:'Sapphire / Steel',game:'DISNEY LORCANA',color:'gold',public:true,format:'Core Constructed',sessions:6,winRate:50,cards:60,updated:'2 days ago',cover:'INK THE ANSWER'},
    'deck-manny-lab':{id:'deck-manny-lab',ownerId:'manny',name:'Labrynth',game:'YU-GI-OH! TRADING CARD GAME',color:'purple',public:true,format:'Advanced',sessions:9,winRate:56,cards:40,updated:'3 days ago',cover:'WELCOME HOME'},
    'deck-manny-charizard':{id:'deck-manny-charizard',ownerId:'manny',name:'Charizard ex',game:'POKÉMON TCG',color:'red',public:true,format:'Standard',sessions:7,winRate:54,cards:60,updated:'4 days ago',cover:'BURN BRIGHT'},
    'deck-poom-zoro':{id:'deck-poom-zoro',ownerId:'poom',name:'Red Zoro',game:'ONE PIECE CARD GAME',color:'red',public:true,format:'Standard',sessions:46,winRate:65,cards:50,updated:'today',cover:'RUSH THE TABLE'},
    'deck-poom-branded':{id:'deck-poom-branded',ownerId:'poom',name:'Branded',game:'YU-GI-OH! TRADING CARD GAME',color:'gold',public:true,format:'Advanced',sessions:17,winRate:59,cards:40,updated:'3 days ago',cover:'FUSION LINE'},
    'deck-krit-teach':{id:'deck-krit-teach',ownerId:'krit',name:'Black Teach',game:'ONE PIECE CARD GAME',color:'black',public:true,format:'Standard',sessions:22,winRate:57,cards:50,updated:'yesterday',cover:'DARK TIDE'},
    'deck-win-luffy':{id:'deck-win-luffy',ownerId:'win',name:'Purple Luffy',game:'ONE PIECE CARD GAME',color:'purple',public:true,format:'Standard',sessions:14,winRate:51,cards:50,updated:'4 days ago',cover:'DON!! ENGINE'},
    'deck-fern-ruby':{id:'deck-fern-ruby',ownerId:'fern',name:'Ruby / Amethyst',game:'DISNEY LORCANA',color:'pink',public:true,format:'Core Constructed',sessions:19,winRate:63,cards:60,updated:'today',cover:'INK & ANSWERS'},
    'deck-aim-amber':{id:'deck-aim-amber',ownerId:'aim',name:'Amber / Steel',game:'DISNEY LORCANA',color:'gold',public:true,format:'Core Constructed',sessions:11,winRate:48,cards:60,updated:'5 days ago',cover:'SONGBOOK'},
    'deck-nook-mono':{id:'deck-nook-mono',ownerId:'nook',name:'Mono Red',game:'MAGIC: THE GATHERING',color:'red',public:true,format:'Standard',sessions:31,winRate:55,cards:60,updated:'2 days ago',cover:'BURN LINE'},
    'deck-bam-azorius':{id:'deck-bam-azorius',ownerId:'bam',name:'Azorius Control',game:'MAGIC: THE GATHERING',color:'blue',public:true,format:'Standard',sessions:38,winRate:64,cards:60,updated:'today',cover:'PATIENT ANSWER'},
    'deck-nine-snake':{id:'deck-nine-snake',ownerId:'nine',name:'Snake-Eye',game:'YU-GI-OH! TRADING CARD GAME',color:'orange',public:true,format:'Advanced',sessions:33,winRate:66,cards:40,updated:'today',cover:'COMBO ROUTE'},
    'deck-may-gardevoir':{id:'deck-may-gardevoir',ownerId:'may',name:'Gardevoir ex',game:'POKÉMON TCG',color:'pink',public:true,format:'Standard',sessions:19,winRate:58,cards:60,updated:'1 week ago',cover:'PSYCHIC STORY'},
  };

  const shops = {
    mana:{id:'mana',name:'Mana House',city:'Chiang Mai',code:'MH',partner:true,checked:true,games:['One Piece','Pokémon'],address:'Chang Moi Road, Chiang Mai'},
    side:{id:'side',name:'Side Deck',city:'Chiang Mai',code:'SD',partner:true,checked:true,games:['Lorcana','Pokémon'],address:'Nimman Road, Chiang Mai'},
    north:{id:'north',name:'North Gate Cards',city:'Chiang Mai',code:'NG',partner:true,checked:true,games:['One Piece','Magic'],address:'Mueang Chiang Mai'},
    playground:{id:'playground',name:'Playground TCG',city:'Chiang Mai',code:'PG',partner:true,checked:true,games:['Multi-TCG'],address:'Suthep, Chiang Mai'},
    cardbase:{id:'cardbase',name:'Card Base',city:'Bangkok',code:'CB',partner:true,checked:true,games:['Multi-TCG'],address:'Siam, Bangkok'},
    dragon:{id:'dragon',name:'Dragon Link',city:'Bangkok',code:'DL',partner:true,checked:true,games:['Yu-Gi-Oh!','Magic'],address:'Huai Khwang, Bangkok'},
    versus:{id:'versus',name:'Versus Arena',city:'Bangkok',code:'VS',partner:true,checked:true,games:['Multi-TCG'],address:'Ratchada, Bangkok'},
    drawtwo:{id:'drawtwo',name:'Draw Two',city:'Bangkok',code:'D2',partner:true,checked:true,games:['Magic','Lorcana'],address:'Ari, Bangkok'},
    mulligan:{id:'mulligan',name:'Mulligan Club',city:'Bangkok',code:'MC',partner:true,checked:true,games:['Magic'],address:'Phaya Thai, Bangkok'},
    cardroom:{id:'cardroom',name:'The Card Room',city:'Bangkok',code:'CR',partner:true,checked:true,games:['Multi-TCG'],address:'Bang Na, Bangkok'},
    sleeveup:{id:'sleeveup',name:'Sleeve Up',city:'Khon Kaen',code:'SU',partner:true,checked:true,games:['Multi-TCG'],address:'Mueang Khon Kaen'},
    deckyard:{id:'deckyard',name:'Deck Yard',city:'Phuket',code:'DY',partner:true,checked:true,games:['One Piece'],address:'Phuket Town'},
    turnone:{id:'turnone',name:'Turn One',city:'Hat Yai',code:'T1',partner:true,checked:true,games:['Yu-Gi-Oh!'],address:'Hat Yai'},
    castle:{id:'castle',name:'Card Castle',city:'Chonburi',code:'CC',partner:true,checked:true,games:['Pokémon'],address:'Mueang Chonburi'},
    legend:{id:'legend',name:'Local Legend',city:'Ayutthaya',code:'LL',partner:true,checked:true,games:['Multi-TCG'],address:'Ayutthaya'},
    tabletop:{id:'tabletop',name:'Tabletop Town',city:'Nakhon Ratchasima',code:'TT',partner:true,checked:false,games:['Multi-TCG'],address:'Korat'},
    shuffle:{id:'shuffle',name:'Shuffle Space',city:'Udon Thani',code:'SS',partner:true,checked:false,games:['Multi-TCG'],address:'Udon Thani'},
    nextdraw:{id:'nextdraw',name:'Next Draw',city:'Rayong',code:'ND',partner:true,checked:false,games:['Multi-TCG'],address:'Rayong'},
  };

  const events = {
    community:{id:'community',title:'VERSO Community Night',hostId:'bam',shopId:'mana',game:'MULTI-TCG',date:'28 AUG · 18:00',attendeeIds:['manny','poom','may','bam','nook','krit','win'],posterAsset:'event-poster-community-v8.webp',poster:'community',posterCode:'VNT-028',gallery:['bam-event','group-old','shuffle-old']},
    regional:{id:'regional',title:'One Piece City Clash',hostId:'bam',shopId:'cardbase',game:'ONE PIECE CARD GAME',date:'12 SEP · 10:00',attendeeIds:['nine','poom','manny','nook','may'],posterAsset:'event-poster-regional-v8.webp',poster:'regional',posterCode:'CC-256',gallery:['group-old','victory-old','shuffle-old']},
    lorcana:{id:'lorcana',title:'Ink & Friends Launch Party',hostId:'fern',shopId:'side',game:'DISNEY LORCANA',date:'30 AUG · 18:30',attendeeIds:['fern','aim','may','bam'],posterAsset:'event-poster-ink-v8.webp',poster:'launch',posterCode:'INK-030',gallery:['fern-aim','group-old','binder-old']},
  };

  const sessions = {
    s1248:{id:'s1248',activityId:'match-onepiece',number:'#1248',playerIds:['manny','poom'],deckIds:['deck-manny-blue','deck-poom-zoro'],shopId:'mana',eventId:'community',score:[2,1],duration:'1h 34m',games:3,media:'duo-old',visual:'duo',title:'Same rival. One more chapter.',time:'18m',copy:'Game three went down to the last card. Same rival, again.',achievement:'SAME RIVAL. AGAIN. · 25 MATCHES TOGETHER',earnedBadges:['Same Rival. Again.','Deck Loyalist']},
    s1247:{id:'s1247',activityId:'match-krit-win',number:'#1247',playerIds:['krit','win'],deckIds:['deck-krit-teach','deck-win-luffy'],shopId:'north',eventId:'community',score:[2,1],duration:'1h 08m',games:3,media:'manny-poom',visual:'duo',title:'A late-night rematch at the local.',time:'36m',copy:'A patient third game and a photo together before the shop closed.',achievement:'NEW RIVALRY · FIRST SESSION TOGETHER',earnedBadges:['First Rivalry']},
    s1246:{id:'s1246',activityId:'match-lorcana',number:'#1246',playerIds:['fern','aim'],deckIds:['deck-fern-ruby','deck-aim-amber'],shopId:'side',eventId:'lorcana',score:[2,0],duration:'52m',games:2,media:'fern-aim',visual:'new-lorcana',title:'Ruby / Amethyst takes the set',time:'3h',copy:'A friendly launch-week match with two close games and a clean finish.',achievement:'CLEAN SET · FIRST MATCH TOGETHER',earnedBadges:['Good Game!']},
    s1245:{id:'s1245',activityId:'match-magic',number:'#1245',playerIds:['nook','bam'],deckIds:['deck-nook-mono','deck-bam-azorius'],shopId:'mana',eventId:'community',score:[1,2],duration:'1h 12m',games:3,media:'duel-magic',visual:'new-magic',title:'Azorius Control closes game three',time:'yesterday',copy:'A long final game turned on one patient answer at exactly the right time.',achievement:'GAME THREE COMEBACK',earnedBadges:['Trust the Process']},
    s1244:{id:'s1244',activityId:'match-yugioh',number:'#1244',playerIds:['nine','poom'],deckIds:['deck-nine-snake','deck-poom-branded'],shopId:'dragon',eventId:'regional',score:[2,1],duration:'47m',games:3,media:'duel-yugioh',visual:'new-yugioh',title:'Snake-Eye wins a fast set',time:'yesterday',copy:'Quick turns, a close side-deck game, and a high-five after the final draw.',achievement:'FASTEST SET THIS WEEK',earnedBadges:['Top Cut']},
    s1243:{id:'s1243',activityId:'match-manny-magic',number:'#1243',playerIds:['manny','bam'],deckIds:['deck-manny-dimir','deck-bam-azorius'],shopId:'north',eventId:null,score:[1,2],duration:'1h 22m',games:3,media:'group-old',gallery:['group-old','shuffle-old','binder-old'],visual:'new-magic',title:'A patient game three at North Gate',time:'2d',copy:'We kept one more round going after closing time. The last answer belonged to Bam.',achievement:'THREE-GAME SET · NEW DECK TEST',earnedBadges:['Deck Tester']},
    s1242:{id:'s1242',activityId:'match-manny-lorcana',number:'#1242',playerIds:['manny','fern'],deckIds:['deck-manny-steel','deck-fern-ruby'],shopId:'side',eventId:'lorcana',score:[2,1],duration:'58m',games:3,media:'duel-lorcana',visual:'new-lorcana',title:'First night with Sapphire / Steel',time:'3d',copy:'The new list finally clicked in game three. Fern already asked for the rematch.',achievement:'FIRST WIN · SAPPHIRE / STEEL',earnedBadges:['First Brew']},
    s1241:{id:'s1241',activityId:'match-manny-yugioh',number:'#1241',playerIds:['manny','nine'],deckIds:['deck-manny-lab','deck-nine-snake'],shopId:'dragon',eventId:'regional',score:[2,0],duration:'41m',games:2,media:'duel-yugioh',visual:'new-yugioh',title:'Labrynth held the line',time:'5d',copy:'Two focused games, clean side-deck calls, and plenty to talk about after the set.',achievement:'CLEAN SET · FIRST YU-GI-OH SESSION',earnedBadges:['Good Game!']},
    s1240:{id:'s1240',activityId:'match-manny-pokemon',number:'#1240',playerIds:['manny','may'],deckIds:['deck-manny-charizard','deck-may-gardevoir'],shopId:'mana',eventId:null,score:[1,2],duration:'49m',games:3,media:'duel-pokemon',visual:'new-pokemon',title:'Charizard met Gardevoir',time:'1w',copy:'A relaxed collector-versus-collector set before we compared binder pages.',achievement:'CROSS-GAME WEEK · FRIENDLY SET',earnedBadges:['Good Game!']},
  };

  const comments = {
    c1:{id:'c1',activityId:'match-onepiece',userId:'may',text:'This rivalry needs its own season recap 🔥',time:'12m'},
    c2:{id:'c2',activityId:'match-onepiece',userId:'bam',text:'Game three was the loudest table in the shop.',time:'9m'},
    c3:{id:'c3',activityId:'event-community',userId:'nook',text:'Thanks for making the new players feel welcome!',time:'42m'},
    c4:{id:'c4',activityId:'event-community',userId:'fern',text:'Next week I’m bringing the new Lorcana list.',time:'31m'},
    c5:{id:'c5',activityId:'collect-gem-photo',userId:'manny',text:'That slab presentation is perfect. Huge grade!',time:'2h'},
    c6:{id:'c6',activityId:'collect-gem-photo',userId:'nine',text:'GEM MINT 10 is a proper profile pin.',time:'1h'},
    c7:{id:'c7',activityId:'match-lorcana',userId:'bam',text:'Clean set. Both deck lists look fun.',time:'2h'},
    c8:{id:'c8',activityId:'match-magic',userId:'may',text:'The patient answer always wins the story.',time:'6h'},
    c9:{id:'c9',activityId:'match-yugioh',userId:'nook',text:'Forty-seven minutes for three games is wild.',time:'8h'},
    c10:{id:'c10',activityId:'moment-binder',userId:'poom',text:'Save me a trade page for Friday.',time:'3h'},
    c11:{id:'c11',activityId:'event-regional',userId:'nine',text:'See everyone at check-in. Let’s go!',time:'1d'},
    c12:{id:'c12',activityId:'graded-gem',userId:'fern',text:'The graphic feels like a real pull moment ✦',time:'1d'},
    c13:{id:'c13',activityId:'match-krit-win',userId:'bam',text:'That last photo feels exactly like local-night energy.',time:'24m'},
    c14:{id:'c14',activityId:'match-krit-win',userId:'manny',text:'Run it back next Thursday—I want to watch game three.',time:'18m'},
    c15:{id:'c15',activityId:'event-lorcana',userId:'may',text:'The poster is gorgeous. Saving a spot for launch night!',time:'5h'},
    c16:{id:'c16',activityId:'collect-alt-art',userId:'poom',text:'Last-pack magic is real. Bring it to the next trade night.',time:'1d'},
    c17:{id:'c17',activityId:'collect-alt-art',userId:'nook',text:'Centering looks clean from here—huge pull.',time:'22h'},
    c18:{id:'c18',activityId:'shop-mana',userId:'krit',text:'The staff here always makes the table feel welcoming.',time:'4h'},
    c19:{id:'c19',activityId:'badge-tourist',userId:'fern',text:'Ten shops is a proper adventure. Next stop: Side Deck!',time:'1h'},
    c20:{id:'c20',activityId:'badge-first-match',userId:'win',text:'Every long story needs a first table.',time:'3d'},
    c21:{id:'c21',activityId:'event-regional',userId:'poom',text:'Deck list ready. See you at player check-in.',time:'20h'},
    c22:{id:'c22',activityId:'match-manny-magic',userId:'nook',text:'That game three looked properly tense. Great set.',time:'2d'},
    c23:{id:'c23',activityId:'match-manny-magic',userId:'may',text:'The table photo feels like a real late-night local.',time:'2d'},
    c24:{id:'c24',activityId:'match-manny-lorcana',userId:'aim',text:'Sapphire / Steel finally online! Rematch next launch night?',time:'3d'},
    c25:{id:'c25',activityId:'match-manny-lorcana',userId:'bam',text:'New deck, first win—this one belongs on the profile.',time:'3d'},
    c26:{id:'c26',activityId:'match-manny-yugioh',userId:'poom',text:'Clean 2–0. The Labrynth list is looking sharp.',time:'5d'},
    c27:{id:'c27',activityId:'match-manny-yugioh',userId:'nine',text:'Good set. I already changed the side deck for next time.',time:'5d'},
    c28:{id:'c28',activityId:'match-manny-pokemon',userId:'may',text:'Collector match of the week. The binder review took longer than the set.',time:'1w'},
    c29:{id:'c29',activityId:'match-manny-pokemon',userId:'fern',text:'Charizard versus Gardevoir is always a good table.',time:'1w'},
  };

  const baseActivities = {
    'match-onepiece':{id:'match-onepiece',type:'match',sessionId:'s1248',eyebrow:'CONFIRMED COLLABORATION',verb:'played together',likes:48,commentIds:['c1','c2']},
    'match-krit-win':{id:'match-krit-win',type:'match',sessionId:'s1247',eyebrow:'CONFIRMED COLLABORATION',verb:'finished a local session',likes:31,commentIds:['c13','c14']},
    'match-lorcana':{id:'match-lorcana',type:'match',sessionId:'s1246',eyebrow:'CONFIRMED COLLABORATION',verb:'confirmed a match',likes:34,commentIds:['c7']},
    'match-magic':{id:'match-magic',type:'match',sessionId:'s1245',eyebrow:'CONFIRMED COLLABORATION',verb:'confirmed a match',likes:27,commentIds:['c8']},
    'match-yugioh':{id:'match-yugioh',type:'match',sessionId:'s1244',eyebrow:'CONFIRMED COLLABORATION',verb:'confirmed a match',likes:53,commentIds:['c9']},
    'match-manny-magic':{id:'match-manny-magic',type:'match',sessionId:'s1243',eyebrow:'CONFIRMED COLLABORATION',verb:'played a local set',likes:44,commentIds:['c22','c23']},
    'match-manny-lorcana':{id:'match-manny-lorcana',type:'match',sessionId:'s1242',eyebrow:'CONFIRMED COLLABORATION',verb:'tested a new deck',likes:71,commentIds:['c24','c25']},
    'match-manny-yugioh':{id:'match-manny-yugioh',type:'match',sessionId:'s1241',eyebrow:'CONFIRMED COLLABORATION',verb:'played a fast set',likes:63,commentIds:['c26','c27']},
    'match-manny-pokemon':{id:'match-manny-pokemon',type:'match',sessionId:'s1240',eyebrow:'CONFIRMED COLLABORATION',verb:'played a friendly set',likes:58,commentIds:['c28','c29']},
    'event-community':{id:'event-community',type:'event',eventId:'community',authorUserId:'bam',postRole:'host-announcement',taggedUserIds:['manny','poom','may','nook'],imageIds:['bam-event','group-old','shuffle-old'],kind:'EVENT STORY',eyebrow:'ON GOING · COMMUNITY',time:'1h',visual:'group',media:'bam-event',copy:'I created and host VERSO Community Night at Mana House. Manny, Poom, May and Nook are joining this table tonight.',verb:'created and hosts this event',likes:92,commentIds:['c3','c4'],achievement:'COMMUNITY SPARK · 7 PLAYERS TOGETHER',earnedBadgeIds:['badge_community_builder'],metrics:[['7','GOING'],['4','TAGGED'],['HOST','BAM']]},
    'event-regional':{id:'event-regional',type:'event',eventId:'regional',authorUserId:'bam',imageIds:['group-old','victory-old','shuffle-old'],kind:'EVENT STORY',eyebrow:'REGIONAL SERIES · BANGKOK',time:'2d',visual:'regional',media:'event-regional',copy:'A 256-player regional with side events, artist alley, and VERSO community check-in.',verb:'is going to an event',likes:96,commentIds:['c11','c21'],achievement:'REGIONAL JOURNEY · REGISTRATION OPEN',metrics:[['256','PLAYERS'],['64','VERSO'],['12 SEP','DATE']]},
    'event-lorcana':{id:'event-lorcana',type:'event',eventId:'lorcana',authorUserId:'fern',postRole:'host-announcement',taggedUserIds:['aim','may','bam'],imageIds:['fern-aim','group-old','binder-old'],kind:'EVENT STORY',eyebrow:'COMMUNITY EVENT',time:'3d',visual:'launch',media:'event-launch',copy:'I’m hosting Ink & Friends Launch Party at Side Deck—new decks, first matches and friendly trades. Aim, May and Bam are going.',verb:'created and hosts this event',likes:68,commentIds:['c15'],achievement:'OPENING CREW · LAUNCH PARTY',earnedBadgeIds:['badge_opening_crew'],metrics:[['4','GOING'],['3','TAGGED'],['HOST','FERN']]},
    'collect-gem-photo':{id:'collect-gem-photo',type:'collect',authorUserId:'may',kind:'NEW CARD · PHOTO',eyebrow:'COLLECTOR SHOWCASE',title:'Gem Mint 10 came home',time:'5h',game:'GRADED CARD',location:'Mana House',shopId:'mana',visual:'graded',media:'may-graded-v19',grade:'GEM MINT 10',rarity:'ALT ART · FIRST GRADED COPY',copy:'The grade landed. Sleeved, slabbed, and immediately added to the story.',verb:'showed a newly graded card',likes:184,commentIds:['c5','c6'],achievement:'GRAIL FOUND · PERSONAL BEST GRADE',earnedBadgeIds:['badge_grail_found'],metrics:[['10','GRADE'],['1st','SLAB'],['98%','POP HIGH']]},
    'graded-gem':{id:'graded-gem',type:'collect',authorUserId:'may',kind:'NEW CARD · GRAPHIC',eyebrow:'NEW COLLECTION STORY',title:'A grail found under neon light',time:'yesterday',game:'COLLECTION',location:'Profile Album',visual:'new-card',media:'card-graphic',grade:'RAW',rarity:'MANGA RARE · FIRST COPY',copy:'Okay, that pull was insane. Finally found the one card I’ve been chasing all year.',verb:'shared a TCG moment',likes:126,commentIds:['c12'],achievement:'GRAIL FOUND · SAVED TO PROFILE ALBUM',metrics:[['1st','COPY'],['GRAIL','RARITY'],['48','ALBUM']]},
    'collect-alt-art':{id:'collect-alt-art',type:'collect',authorUserId:'manny',kind:'NEW CARD · GRAPHIC',eyebrow:'COLLECTOR SHOWCASE',title:'The chase card finally showed up',time:'2d',game:'ONE PIECE COLLECTION',shopId:'mana',visual:'new-card',media:'card-graphic',grade:'CENTERING 9.5',rarity:'PARALLEL RARE · FIRST COPY',copy:'Pulled at the local after one last pack. This one goes straight into the display case.',verb:'posted a new card flex',likes:203,commentIds:['c16','c17'],achievement:'FIRST GRAIL · CHASE COMPLETE',metrics:[['9.5','CENTERING'],['1','COPY'],['0.7%','PULL RATE']]},
    'moment-binder':{id:'moment-binder',type:'collect',authorUserId:'nook',kind:'COLLECTOR POST',eyebrow:'COLLECTION MOMENT',title:'Trade binder finally organized',time:'4h',game:'COLLECTION',location:'Chiang Mai',visual:'binder',media:'nook-binder',copy:'Three cities, too many sleeves, zero regrets. Ready for the next trade night.',verb:'shared a collection moment',likes:126,commentIds:['c10'],achievement:'BINDER READY · COLLECTION MILESTONE',metrics:[['72','CARDS'],['3','CITIES'],['1','BINDER']],gallery:['nook-binder','binder-old','shuffle-old']},
    'shop-mana':{id:'shop-mana',type:'shop',authorUserId:'manny',shopId:'mana',eyebrow:'PASSPORT CHECK-IN',title:'Mana House unlocked',time:'6h',game:'SHOP JOURNEY',visual:'shop',media:'shop-mana',copy:'The 15th partner shop in Manny’s passport and a new shop badge earned.',verb:'checked in at a partner shop',likes:41,commentIds:['c18'],achievement:'NEW SHOP BADGE · MANA HOUSE REGULAR',metrics:[['15','SHOPS'],['6','CITIES'],['24','STAMPS']]},
    'shop-north-meetup':{id:'shop-north-meetup',type:'shop',authorUserId:'krit',shopId:'north',eyebrow:'PASSPORT CHECK-IN',title:'One more stop at North Gate',time:'1d',game:'SHOP JOURNEY',visual:'shop',media:'krit-win-v193',copy:'Dropped by North Gate Cards, met Win and planned the next rematch before heading home.',verb:'checked in with a friend',likes:29,commentIds:[],achievement:'NORTH GATE VISIT · PASSPORT PROGRESS',metrics:[['4','VISITS'],['1','FRIEND'],['NG','STAMP']]},
    'badge-tourist':{id:'badge-tourist',type:'badge',authorUserId:'may',eyebrow:'ACHIEVEMENT UNLOCKED',title:'Cardboard Tourist',time:'2h',location:'10 different card shops',visual:'tourist',rarity:'RARE · 8.4% OF PLAYERS',copy:'Every shop and every table adds another place to the story.',media:'badge-tourist',verb:'unlocked a new badge',likes:74,commentIds:['c19'],achievement:'VISITED 10 DIFFERENT CARD SHOPS',metrics:[['RARE','RARITY'],['10','SHOPS'],['8.4%','PLAYERS']]},
    'badge-first-match':{id:'badge-first-match',type:'badge',authorUserId:'manny',eyebrow:'ACHIEVEMENT UNLOCKED',title:'First Match',time:'4d',shopId:'mana',visual:'first',rarity:'PLAYER · UNCOMMON',copy:'The first confirmed match in Manny’s VERSO journey.',media:'badge-first',verb:'unlocked a badge',likes:117,commentIds:['c20'],achievement:'THE FIRST CONFIRMED CHAPTER',metrics:[['FIRST','MILESTONE'],['PLAYER','TYPE'],['1','SESSION']]},
  };

  const feedActivityOrder = ['match-onepiece','collect-gem-photo','event-community','match-manny-magic','match-manny-lorcana','match-krit-win','shop-north-meetup','graded-gem','match-manny-yugioh','badge-tourist','match-lorcana','moment-binder','shop-mana','match-magic','match-manny-pokemon','match-yugioh','collect-alt-art','event-regional','event-lorcana','badge-first-match'];
  const badges = {
    badge_first_match:{id:'badge_first_match',name:'First Match',category:'Play',description:'Record the first confirmed match in your VERSO story.',artwork:'first',rarity:'Common',criteria:'Complete 1 verified session',progressType:'count',targetValue:1,hidden:false,limited:false},
    badge_deck_loyalist:{id:'badge_deck_loyalist',name:'Deck Loyalist',category:'Deck / Brewer',description:'Build a history with one trusted deck.',artwork:'ph-deck-loyalist',rarity:'Uncommon',criteria:'Play 10 sessions with one deck',progressType:'count',targetValue:10,hidden:false,limited:false},
    badge_same_rival:{id:'badge_same_rival',name:'Same Rival. Again.',category:'Play',description:'A rivalry becomes a story when both players keep returning.',artwork:'ph-same-rival',rarity:'Rare',criteria:'Play the same opponent 5 times',progressType:'count',targetValue:5,hidden:false,limited:false},
    badge_top_cut:{id:'badge_top_cut',name:'Top Cut',category:'Competitive',description:'Reach the elimination stage of a competitive event.',artwork:'ph-top-cut',rarity:'Rare',criteria:'Reach a tournament top cut',progressType:'event',targetValue:1,hidden:false,limited:false},
    badge_grail_found:{id:'badge_grail_found',name:'Grail Found',category:'Collector',description:'Add a personal chase card to your collection story.',artwork:'grail',rarity:'Epic',criteria:'Post a card marked as a personal grail',progressType:'count',targetValue:1,hidden:false,limited:false},
    badge_cardboard_tourist:{id:'badge_cardboard_tourist',name:'Cardboard Tourist',category:'Shop / Journey',description:'Every shop is another page in the journey.',artwork:'tourist',rarity:'Rare',criteria:'Check in at 10 partner shops',progressType:'count',targetValue:10,hidden:false,limited:false},
    badge_community_builder:{id:'badge_community_builder',name:'Community Builder',category:'Community',description:'Bring players together at a welcoming table.',artwork:'ph-community-builder',rarity:'Rare',criteria:'Play with 10 unique players',progressType:'count',targetValue:10,hidden:false,limited:false},
    badge_local_legend:{id:'badge_local_legend',name:'Local Legend',category:'Community',description:'Become part of the rhythm of one local shop.',artwork:'local',rarity:'Epic',criteria:'Complete 25 sessions at one shop',progressType:'count',targetValue:25,hidden:false,limited:false},
    badge_opening_crew:{id:'badge_opening_crew',name:'Opening Crew',category:'Events',description:'Show up for a new set, a new shop, or a new community.',artwork:'ph-opening-crew',rarity:'Uncommon',criteria:'Attend a launch event',progressType:'event',targetValue:1,hidden:false,limited:false},
    badge_night_owl:{id:'badge_night_owl',name:'Night Owl',category:'Lifestyle',description:'Some of the best games start after the shop should have closed.',artwork:'owl',rarity:'Uncommon',criteria:'Finish 5 sessions after 22:00',progressType:'count',targetValue:5,hidden:false,limited:false},
    badge_good_game:{id:'badge_good_game',name:'Good Game!',category:'Play',description:'Celebrate the player across the table.',artwork:'ph-good-game',rarity:'Common',criteria:'Receive 10 post-session reactions',progressType:'count',targetValue:10,hidden:false,limited:false},
    badge_first_rivalry:{id:'badge_first_rivalry',name:'First Rivalry',category:'Play',description:'Complete a rematch with the same opponent.',artwork:'ph-first-rivalry',rarity:'Uncommon',criteria:'Play a rematch',progressType:'count',targetValue:2,hidden:false,limited:false},
    badge_binder_starter:{id:'badge_binder_starter',name:'Binder Starter',category:'Collector',description:'Begin a collection album with intention.',artwork:'ph-binder-starter',rarity:'Common',criteria:'Post 25 cards to collection activities',progressType:'count',targetValue:25,hidden:false,limited:false},
    badge_trust_process:{id:'badge_trust_process',name:'Trust the Process',category:'Deck / Brewer',description:'Keep testing until the list tells its story.',artwork:'ph-trust-process',rarity:'Uncommon',criteria:'Edit and replay one deck 5 times',progressType:'count',targetValue:5,hidden:false,limited:false},
    badge_session_builder:{id:'badge_session_builder',name:'Session Builder',category:'VERSO Special',description:'Create a complete linked Session record.',artwork:'ph-session-builder',rarity:'Special',criteria:'Create a session with players, decks and location',progressType:'count',targetValue:1,hidden:false,limited:false},
    badge_first_brew:{id:'badge_first_brew',name:'First Brew',category:'Deck / Brewer',description:'Bring a new deck to its first verified match.',artwork:'ph-first-brew',rarity:'Common',criteria:'Play a newly created deck',progressType:'count',targetValue:1,hidden:false,limited:false},
    badge_deck_tester:{id:'badge_deck_tester',name:'Deck Tester',category:'Deck / Brewer',description:'Put a fresh idea through real games.',artwork:'ph-deck-tester',rarity:'Uncommon',criteria:'Play 5 sessions with recently updated decks',progressType:'count',targetValue:5,hidden:false,limited:false},
    badge_event_hopper:{id:'badge_event_hopper',name:'Event Hopper',category:'Events',description:'Find new tables through community events.',artwork:'ph-event-hopper',rarity:'Rare',criteria:'Attend 8 unique events',progressType:'count',targetValue:8,hidden:false,limited:false},
    badge_city_to_city:{id:'badge_city_to_city',name:'City to City',category:'Shop / Journey',description:'Take the collection beyond one hometown.',artwork:'ph-city-to-city',rarity:'Epic',criteria:'Check in across 5 cities',progressType:'count',targetValue:5,hidden:false,limited:false},
    badge_trade_story:{id:'badge_trade_story',name:'Trade Story',category:'Marketplace',description:'Complete a safe community marketplace trade.',artwork:'ph-trade-story',rarity:'Uncommon',criteria:'Complete 3 marketplace trades',progressType:'count',targetValue:3,hidden:false,limited:false},
    badge_shop_supporter:{id:'badge_shop_supporter',name:'Shop Supporter',category:'Marketplace',description:'Support partner inventory through VERSO Marketplace.',artwork:'ph-shop-supporter',rarity:'Rare',criteria:'Purchase from 5 partner shops',progressType:'count',targetValue:5,hidden:false,limited:false},
    badge_storyteller:{id:'badge_storyteller',name:'Storyteller',category:'VERSO Special',description:'Turn play, people and place into a complete TCG story.',artwork:'ph-storyteller',rarity:'Epic',criteria:'Post 20 activities with meaningful details',progressType:'count',targetValue:20,hidden:false,limited:false},
    badge_one_more_pack:{id:'badge_one_more_pack',name:'Just One Pack',category:'Lifestyle',description:'The lighter side of the chase.',artwork:'ph-just-one-pack',rarity:'Secret',criteria:'Hidden until unlocked',progressType:'hidden',targetValue:1,hidden:true,limited:false},
    badge_regional_2026:{id:'badge_regional_2026',name:'First Regional 2026',category:'Events',description:'Remember the first major competitive trip of the season.',artwork:'ph-regional-2026',rarity:'Limited',criteria:'Attend a 2026 Regional',progressType:'event',targetValue:1,hidden:false,limited:true}
  };
  const badgeNameToId = Object.fromEntries(Object.values(badges).map(badge => [badge.name,badge.id]));
  const badgeCatalog = Object.values(badges).map(badge => [badge.name,badge.category,badge.artwork,badge.id]);

  const playerProfiles = Object.fromEntries(Object.values(users).map(user => [`profile_${user.id}`,{id:`profile_${user.id}`,userId:user.id,city:user.city,game:user.game,role:user.role,bio:user.bio,level:user.level,levelName:user.levelName,sp:user.sp}]));
  const userBadges = {};
  Object.values(users).forEach(user => {
    user.badgeIds=(user.badges || []).map(name=>badgeNameToId[name]).filter(Boolean);
    user.badgeIds.forEach((badgeId,index)=>{const id=`user_badge_${user.id}_${badgeId.replace('badge_','')}`;userBadges[id]={id,userId:user.id,badgeId,earnedDate:`2026-08-${String(12+index).padStart(2,'0')}`,progress:badges[badgeId].targetValue};});
    user.pinnedBadgeIds=user.id==='manny'?['badge_same_rival','badge_cardboard_tourist','badge_first_match']:user.badgeIds.slice(0,2);
  });

  const photos = {
    photo_session_1248:{id:'photo_session_1248',ownerUserId:'manny',activityId:'match-onepiece',assetId:'img_session_1248',visualKey:'duo-old',type:'session',ratio:'4:3',source:'project-original'},
    photo_session_1247:{id:'photo_session_1247',ownerUserId:'krit',activityId:'match-krit-win',assetId:'img_session_1248',visualKey:'duo-old',type:'session',ratio:'4:3',source:'project-original'},
    photo_session_1246:{id:'photo_session_1246',ownerUserId:'fern',activityId:'match-lorcana',assetId:'img_session_1246',visualKey:'fern-aim',type:'session',ratio:'4:3',source:'project-original'},
    photo_session_1245:{id:'photo_session_1245',ownerUserId:'nook',activityId:'match-magic',assetId:'img_session_nook_bam_v193',visualKey:'nook-bam-v193',type:'session',ratio:'4:3',source:'generated'},
    photo_session_1245_friendly:{id:'photo_session_1245_friendly',ownerUserId:'nook',activityId:'match-magic',assetId:'img_session_nook_bam_friendly_v194',visualKey:'nook-bam-friendly-v194',type:'session',ratio:'4:3',source:'generated'},
    photo_session_1244:{id:'photo_session_1244',ownerUserId:'nine',activityId:'match-yugioh',assetId:'graphic_session_yugioh',visualKey:'duel-yugioh',type:'session-graphic',ratio:'4:3',source:'code-native'},
    photo_session_1242:{id:'photo_session_1242',ownerUserId:'manny',activityId:'match-manny-lorcana',assetId:'graphic_session_lorcana',visualKey:'duel-lorcana',type:'session-graphic',ratio:'4:3',source:'code-native'},
    photo_session_1241:{id:'photo_session_1241',ownerUserId:'manny',activityId:'match-manny-yugioh',assetId:'graphic_session_yugioh_manny',visualKey:'duel-yugioh',type:'session-graphic',ratio:'4:3',source:'code-native'},
    photo_session_1240:{id:'photo_session_1240',ownerUserId:'manny',activityId:'match-manny-pokemon',assetId:'graphic_session_pokemon',visualKey:'duel-pokemon',type:'session-graphic',ratio:'4:3',source:'code-native'},
    photo_collect_may_grade:{id:'photo_collect_may_grade',ownerUserId:'may',activityId:'collect-gem-photo',assetId:'img_collect_may_grade',visualKey:'may-graded-v19',type:'collect',ratio:'4:3',source:'generated'},
    photo_binder_nook:{id:'photo_binder_nook',ownerUserId:'nook',activityId:'moment-binder',assetId:'img_binder_nook',visualKey:'nook-binder',type:'collect',ratio:'4:3',source:'generated'},
    photo_event_community:{id:'photo_event_community',ownerUserId:'bam',activityId:'event-community',assetId:'img_event_community',visualKey:'bam-event',type:'event-post',ratio:'4:3',source:'generated'},
    photo_shop_north_krit:{id:'photo_shop_north_krit',ownerUserId:'krit',activityId:'shop-north-meetup',assetId:'img_shop_north_meetup_v194',visualKey:'krit-win-v193',type:'shop-post',ratio:'4:3',source:'generated'}
  };

  const shopBadges = {};
  const passportStamps = {};
  const majorShopVisuals={mana:'shop-mana-v193',side:'shop-side-v193',north:'shop-north-v193',dragon:'shop-dragon-v193'};
  Object.values(shops).forEach((shop,index)=>{
    shop.coordinates={lat:18.7883+(index%5)*0.014,lng:98.9853+(index%6)*0.018};
    shop.description=`${shop.name} is a VERSO partner table for ${shop.games.join(', ')} players in ${shop.city}.`;
    shop.openingHours=index%2?'12:00–22:00 · Tue–Sun':'11:00–21:00 · Daily';
    shop.partnerStatus='verified';
    shop.logoAssetId=`logo_shop_${shop.id}`;
    shop.coverAssetId=majorShopVisuals[shop.id]?`img_${majorShopVisuals[shop.id]}`:`graphic_shop_${shop.id}`;
    shop.galleryImageIds=[];
    shop.shopBadgeId=`shop_badge_${shop.id}`;
    shop.passportStampAsset=`stamp_${shop.id}`;
    shop.marketplaceListingIds=[];
    shop.eventIds=Object.values(events).filter(event=>event.shopId===shop.id).map(event=>event.id);
    shopBadges[shop.shopBadgeId]={id:shop.shopBadgeId,shopId:shop.id,name:`${shop.name} Regular`,category:'Partner Shop',description:`A shop-specific Passport badge for returning to ${shop.name}.`,artwork:`ph-shop-${shop.id}`,rarity:'Partner',criteria:`Check in at ${shop.name} 5 times`};
    if(index<15){const id=`stamp_manny_${shop.id}`;passportStamps[id]={id,userId:'manny',shopId:shop.id,shopBadgeId:shop.shopBadgeId,earnedAt:`2026-08-${String(Math.min(28,index+3)).padStart(2,'0')}`,visits:1+(index%5)};}
  });

  const eventAttendance = {};
  Object.values(events).forEach(event=>event.attendeeIds.forEach((userId,index)=>{const id=`attendance_${event.id}_${userId}`;eventAttendance[id]={id,eventId:event.id,userId,status:index<2?'going':'attended'};}));

  const marketplaceListings = {
    listing_mana_onepiece:{id:'listing_mana_onepiece',sellerType:'shop',sellerId:'mana',shopId:'mana',title:'One Piece Tournament Pack',game:'ONE PIECE CARD GAME',price:390,currency:'THB',condition:'Sealed',imageAssetId:'graphic_market_onepiece',badgeRewardId:'badge_shop_supporter'},
    listing_side_lorcana:{id:'listing_side_lorcana',sellerType:'shop',sellerId:'side',shopId:'side',title:'Lorcana League Kit',game:'DISNEY LORCANA',price:1290,currency:'THB',condition:'New',imageAssetId:'graphic_market_lorcana',badgeRewardId:'badge_shop_supporter'},
    listing_north_sleeves:{id:'listing_north_sleeves',sellerType:'shop',sellerId:'north',shopId:'north',title:'North Gate Art Sleeves',game:'ACCESSORIES',price:420,currency:'THB',condition:'New',imageAssetId:'graphic_market_sleeves',badgeRewardId:'badge_trade_story'},
    listing_dragon_box:{id:'listing_dragon_box',sellerType:'shop',sellerId:'dragon',shopId:'dragon',title:'Duelist Storage Box',game:'YU-GI-OH!',price:650,currency:'THB',condition:'New',imageAssetId:'graphic_market_duel',badgeRewardId:'badge_shop_supporter'},
    listing_may_gardevoir:{id:'listing_may_gardevoir',sellerType:'user',sellerId:'may',shopId:'mana',title:'Gardevoir ex — Trade Copy',game:'POKÉMON TCG',price:780,currency:'THB',condition:'Near Mint',imageAssetId:'img_collect_may_grade',badgeRewardId:'badge_trade_story'},
    listing_nook_binder:{id:'listing_nook_binder',sellerType:'user',sellerId:'nook',shopId:'cardbase',title:'Curated Trade Binder Lot',game:'MULTI-TCG',price:1800,currency:'THB',condition:'Mixed',imageAssetId:'img_binder_nook',badgeRewardId:'badge_trade_story'}
    ,listing_manny_altart:{id:'listing_manny_altart',sellerType:'user',sellerId:'manny',shopId:'mana',title:'One Piece Alt Art Trade',game:'ONE PIECE CARD GAME',price:1450,currency:'THB',condition:'Near Mint',imageAssetId:'graphic_market_onepiece',badgeRewardId:'badge_trade_story'}
    ,listing_manny_sleeves:{id:'listing_manny_sleeves',sellerType:'user',sellerId:'manny',shopId:'north',title:'Control Player Sleeve Set',game:'ACCESSORIES',price:320,currency:'THB',condition:'Like New',imageAssetId:'graphic_market_sleeves',badgeRewardId:'badge_trade_story'}
  };
  Object.values(marketplaceListings).forEach(listing=>{if(listing.shopId && shops[listing.shopId])shops[listing.shopId].marketplaceListingIds.push(listing.id);});

  const traitDefinitions={collector:{id:'collector',label:'COLLECTOR'},control_player:{id:'control_player',label:'CONTROL PLAYER'},traveler:{id:'traveler',label:'TRAVELER'},event_hunter:{id:'event_hunter',label:'EVENT HUNTER'}};
  const calculatePlayerTraits = userId => {
    const collectionPosts=Object.values(baseActivities).filter(a=>a.authorUserId===userId&&a.type==='collect').length;
    const controlDecks=Object.values(decks).filter(d=>d.ownerId===userId&&/(control|dimir|labrynth)/i.test(`${d.name} ${d.cover}`)).length;
    const visitedShops=new Set(Object.values(passportStamps).filter(s=>s.userId===userId).map(s=>s.shopId));
    const cities=new Set([...visitedShops].map(id=>shops[id].city));
    const attended=Object.values(eventAttendance).filter(a=>a.userId===userId).length;
    const values=[
      {traitId:'collector',sourceMetrics:['collection_posts','collector_badges'],score:Math.min(100,28+collectionPosts*24+(users[userId].badgeIds.includes('badge_grail_found')?28:0))},
      {traitId:'control_player',sourceMetrics:['control_decks','deck_sessions'],score:Math.min(100,20+controlDecks*26)},
      {traitId:'traveler',sourceMetrics:['passport_stamps','unique_cities'],score:Math.min(100,visitedShops.size*4+cities.size*8)},
      {traitId:'event_hunter',sourceMetrics:['event_attendance','event_badges'],score:Math.min(100,attended*18+(users[userId].badgeIds.includes('badge_opening_crew')?20:0))}
    ];
    return values.filter(t=>t.score>=20).sort((a,b)=>b.score-a.score).map((trait,index)=>({...trait,userId,level:index===0?'primary':trait.score>=60?'strong':'developing'}));
  };
  const playerTraits=Object.fromEntries(Object.keys(users).map(userId=>[userId,calculatePlayerTraits(userId)]));
  Object.values(users).forEach(user=>{user.tags=playerTraits[user.id].slice(0,4).map(trait=>traitDefinitions[trait.traitId].label);user.albumPhotoIds=Object.values(photos).filter(photo=>photo.ownerUserId===user.id).map(photo=>photo.id);});

  Object.values(sessions).forEach((session,index)=>{
    const legacyToPhoto={s1248:'photo_session_1248',s1247:'photo_session_1247',s1246:'photo_session_1246',s1245:'photo_session_1245_friendly',s1244:'photo_session_1244',s1242:'photo_session_1242',s1241:'photo_session_1241',s1240:'photo_session_1240'};
    session.opponentIds=[session.playerIds[1]];
    session.locationId=session.shopId;
    session.result=session.score[0]>session.score[1]?'win':session.score[0]<session.score[1]?'loss':'draw';
    session.date=`2026-08-${String(28-index*2).padStart(2,'0')}`;
    session.photoIds=[legacyToPhoto[session.id]].filter(Boolean);
    session.earnedBadgeIds=(session.earnedBadges||[]).map(name=>badgeNameToId[name]).filter(Boolean);
  });
  sessions.s1245.photoIds=['photo_session_1245_friendly','photo_session_1245'];
  sessions.s1243.photoIds=[];
  sessions.s1243.media='duel-magic';
  sessions.s1243.gallery=null;
  photos.photo_session_1247.assetId='img_krit_win_original';
  photos.photo_session_1247.visualKey='manny-poom';

  const assets = {
    img_krit_win_original:{id:'img_krit_win_original',type:'session',path:'public/assets/activity-manny-poom-v6.webp',usedBy:['photo_session_1247'],ownerId:'krit',relatedEntityId:'s1247',source:'project-original'},
    img_session_1248:{id:'img_session_1248',type:'session',path:'public/assets/tcg-life-sprite-v1.webp',usedBy:['photo_session_1248'],ownerId:'manny',relatedEntityId:'s1248',source:'project-original'},
    img_shop_north_meetup_v194:{id:'img_shop_north_meetup_v194',type:'shop-post',path:'public/assets/activity-krit-win-v193.webp',usedBy:['photo_shop_north_krit'],ownerId:'krit',relatedEntityId:'shop-north-meetup',source:'generated'},
    img_session_nook_bam_v193:{id:'img_session_nook_bam_v193',type:'session',path:'public/assets/activity-nook-bam-v193.webp',usedBy:['photo_session_1245'],ownerId:'nook',relatedEntityId:'s1245',source:'generated'},
    img_session_nook_bam_friendly_v194:{id:'img_session_nook_bam_friendly_v194',type:'session',path:'public/assets/activity-nook-bam-friendly-v194.webp',usedBy:['photo_session_1245_friendly'],ownerId:'nook',relatedEntityId:'s1245',source:'generated'},
    img_session_manny_bam_v193:{id:'img_session_manny_bam_v193',type:'session',path:'public/assets/activity-manny-bam-v193.webp',usedBy:['photo_session_1243'],ownerId:'manny',relatedEntityId:'s1243',source:'generated'},
    img_session_1246:{id:'img_session_1246',type:'session',path:'public/assets/activity-fern-aim-v6.webp',usedBy:['photo_session_1246'],ownerId:'fern',relatedEntityId:'s1246',source:'project-original'},
    img_collect_may_grade:{id:'img_collect_may_grade',type:'collect',path:'public/assets/activity-may-graded-card-v19.webp',usedBy:['photo_collect_may_grade','listing_may_gardevoir'],ownerId:'may',relatedEntityId:'collect-gem-photo',source:'generated'},
    img_binder_nook:{id:'img_binder_nook',type:'collect',path:'public/assets/activity-nook-binder-v6.webp',usedBy:['photo_binder_nook','listing_nook_binder'],ownerId:'nook',relatedEntityId:'moment-binder',source:'generated'},
    img_event_community:{id:'img_event_community',type:'event-post',path:'public/assets/activity-bam-event-v6.webp',usedBy:['photo_event_community'],ownerId:'bam',relatedEntityId:'community',source:'generated'},
    img_event_lorcana:{id:'img_event_lorcana',type:'event-post',path:'public/assets/activity-fern-aim-v6.webp',usedBy:['photo_event_lorcana'],ownerId:'fern',relatedEntityId:'lorcana',source:'generated'},
    img_shop_mana_v193:{id:'img_shop_mana_v193',type:'shop',path:'public/assets/shop-mana-v193.webp',usedBy:['mana'],ownerId:'mana',relatedEntityId:'mana',source:'generated'},
    img_shop_side_v193:{id:'img_shop_side_v193',type:'shop',path:'public/assets/shop-side-v193.webp',usedBy:['side'],ownerId:'side',relatedEntityId:'side',source:'generated'},
    img_shop_north_v193:{id:'img_shop_north_v193',type:'shop',path:'public/assets/shop-north-v193.webp',usedBy:['north'],ownerId:'north',relatedEntityId:'north',source:'generated'},
    img_shop_dragon_v193:{id:'img_shop_dragon_v193',type:'shop',path:'public/assets/shop-dragon-v193.webp',usedBy:['dragon'],ownerId:'dragon',relatedEntityId:'dragon',source:'generated'}
  };

  Object.assign(assets,{
    img_event_poster_community:{id:'img_event_poster_community',type:'event-poster',path:'public/assets/event-poster-community-v8.webp',usedBy:['community'],ownerId:'bam',relatedEntityId:'community',source:'generated'},
    img_event_poster_regional:{id:'img_event_poster_regional',type:'event-poster',path:'public/assets/event-poster-regional-v8.webp',usedBy:['regional'],ownerId:'bam',relatedEntityId:'regional',source:'generated'},
    img_event_poster_lorcana:{id:'img_event_poster_lorcana',type:'event-poster',path:'public/assets/event-poster-ink-v8.webp',usedBy:['lorcana'],ownerId:'fern',relatedEntityId:'lorcana',source:'generated'},
    img_badge_system:{id:'img_badge_system',type:'badge-artwork',path:'public/assets/verso-badge-sticker-sprite-v3.webp',usedBy:Object.keys(badges),ownerId:'verso',relatedEntityId:'badge-system-v1',source:'generated'},
    img_player_avatars:{id:'img_player_avatars',type:'player-avatar',path:'public/assets/player-avatars-v1.webp',usedBy:Object.keys(users),ownerId:'verso',relatedEntityId:'user-directory',source:'generated'}
  });
  events.community.posterAssetId='img_event_poster_community';
  events.regional.posterAssetId='img_event_poster_regional';
  events.lorcana.posterAssetId='img_event_poster_lorcana';
  events.community.photoIds=['photo_event_community'];
  events.lorcana.photoIds=[];
  events.regional.photoIds=[];
  baseActivities['badge-tourist'].badgeId='badge_cardboard_tourist';
  baseActivities['badge-first-match'].badgeId='badge_first_match';
  baseActivities['shop-mana'].shopBadgeId='shop_badge_mana';
  baseActivities['shop-mana'].earnedBadgeIds=[];
  baseActivities['collect-gem-photo'].photoIds=['photo_collect_may_grade'];
  baseActivities['moment-binder'].photoIds=['photo_binder_nook'];
  baseActivities['event-community'].photoIds=['photo_event_community'];
  baseActivities['event-lorcana'].photoIds=[];
  baseActivities['shop-north-meetup'].photoIds=['photo_shop_north_krit'];

  const materializeActivity = (id) => {
    const base = baseActivities[id];
    if (!base) return null;
    if (base.type === 'match') {
      const session = sessions[base.sessionId];
      const playerRecords = session.playerIds.map(userId => users[userId]);
      const deckRecords = session.deckIds.map(deckId => decks[deckId]);
      const shop = shops[session.shopId];
      const sessionPhotos=session.photoIds.map(photoId=>photos[photoId]).filter(Boolean);
      const media=sessionPhotos[0]?.visualKey || session.media;
      const gallery=sessionPhotos.length>1?sessionPhotos.map(photo=>photo.visualKey):null;
      return {...base,kind:'MATCH SESSION',title:session.title,author:playerRecords.map(u=>u.shortName).join(' × '),avatar:playerRecords[0].avatar,time:session.time,game:deckRecords[0].game,location:shop.name,visual:session.visual,media,gallery,photoIds:session.photoIds,score:session.score.join(' — '),players:playerRecords.map(u=>u.shortName),playerIds:session.playerIds,decks:deckRecords.map(d=>d.name),deckIds:session.deckIds,duration:session.duration,sessionNo:session.number,copy:session.copy,achievement:session.achievement,earnedBadgeIds:session.earnedBadgeIds,earnedBadges:session.earnedBadgeIds.map(badgeId=>badges[badgeId].name),metrics:[[session.score.join(' — '),'FINAL SCORE'],[session.duration,'SESSION'],[String(session.games),'GAMES']],comments:base.commentIds.length,commentIds:base.commentIds};
    }
    const author = users[base.authorUserId];
    const event = base.eventId ? events[base.eventId] : null;
    const shop = base.shopId ? shops[base.shopId] : event?.shopId ? shops[event.shopId] : null;
    const linkedPhotos=(base.photoIds || event?.photoIds || []).map(photoId=>photos[photoId]).filter(Boolean);
    return {...base,photoIds:linkedPhotos.map(photo=>photo.id),media:linkedPhotos[0]?.visualKey || base.media,author:author.name,avatar:author.avatar,location:base.location || shop?.name || author.city,comments:base.commentIds.length,commentIds:base.commentIds,...(event?{title:event.title,game:event.game,date:event.date,people:`${event.attendeeIds.length} players are going`,attendees:event.attendeeIds.map(uid=>users[uid].shortName),attendeeIds:event.attendeeIds,gallery:linkedPhotos.length>1?linkedPhotos.map(photo=>photo.visualKey):null,poster:event.poster,posterAsset:event.posterAsset,posterAssetId:event.posterAssetId,posterCode:event.posterCode}:{})};
  };

  const activities = Object.fromEntries(Object.keys(baseActivities).map(id => [id,materializeActivity(id)]));
  const shareCardFor = (activity) => ({
    id:`share-${activity.id}`,
    activityId:activity.id,
    frame:activity.type === 'match' ? 'stats' : activity.type === 'collect' ? 'collector' : activity.type === 'event' ? 'journey' : 'victory',
    media:activity.gallery?.[0] || activity.media,
    cheer:activity.type === 'match' ? 'GOOD GAME. RUN IT BACK.' : activity.type === 'collect' ? 'THE CHASE WAS WORTH IT.' : activity.type === 'event' ? 'SEE YOU AT THE NEXT TABLE.' : activity.type === 'shop' ? 'NEW PLACE. NEW STORY.' : 'YOU EARNED THIS ONE.',
    title:activity.title,
    location:activity.location,
  });
  const shareCards = Object.fromEntries(Object.values(activities).map(activity => [activity.id,shareCardFor(activity)]));

  const registerSession = (draft) => {
    const sessionId = draft.sessionId || 's-created-01';
    const activityId = draft.activityId || 'match-created-01';
    sessions[sessionId] = {...draft,id:sessionId,activityId};
    baseActivities[activityId] = {id:activityId,type:'match',sessionId,eyebrow:'CONFIRMED COLLABORATION',verb:'created a confirmed session',likes:0,commentIds:[]};
    activities[activityId] = materializeActivity(activityId);
    shareCards[activityId] = shareCardFor(activities[activityId]);
    draft.deckIds.forEach(deckId => { if (decks[deckId]) decks[deckId].sessions += 1; });
    if (!feedActivityOrder.includes(activityId)) feedActivityOrder.unshift(activityId);
    return activities[activityId];
  };

  const registerPhoto = ({id,ownerUserId,activityId,assetId,visualKey,source='user-upload'}) => {
    if (!users[ownerUserId] || !baseActivities[activityId]) return null;
    photos[id]={id,ownerUserId,activityId,assetId,visualKey,type:'session',ratio:'4:3',source};
    const user=users[ownerUserId];
    if(!user.albumPhotoIds.includes(id)) user.albumPhotoIds.unshift(id);
    const activity=baseActivities[activityId];
    activity.photoIds=[...(activity.photoIds||[]),id];
    if(activity.sessionId && sessions[activity.sessionId]) sessions[activity.sessionId].photoIds=[...(sessions[activity.sessionId].photoIds||[]),id];
    activities[activityId]=materializeActivity(activityId);
    shareCards[activityId]=shareCardFor(activities[activityId]);
    return photos[id];
  };

  const updateSession = (sessionId, changes = {}) => {
    const session=sessions[sessionId];
    if (!session) return null;
    const allowed=['title','score','duration','copy'];
    allowed.forEach(key => {
      if (changes[key] !== undefined) session[key]=changes[key];
    });
    if (Array.isArray(session.score)) session.games=Math.max(...session.score)+1;
    activities[session.activityId]=materializeActivity(session.activityId);
    shareCards[session.activityId]=shareCardFor(activities[session.activityId]);
    return activities[session.activityId];
  };

  const deleteSession = (sessionId) => {
    const session=sessions[sessionId];
    if (!session) return false;
    const activityId=session.activityId;
    session.deckIds.forEach(deckId => { if (decks[deckId]) decks[deckId].sessions=Math.max(0,decks[deckId].sessions-1); });
    Object.values(users).forEach(user => { user.albumActivityIds=user.albumActivityIds.filter(id=>id!==activityId);user.albumPhotoIds=user.albumPhotoIds.filter(photoId=>photos[photoId]?.activityId!==activityId); });
    Object.keys(photos).forEach(photoId=>{if(photos[photoId].activityId===activityId)delete photos[photoId];});
    Object.keys(comments).forEach(commentId => { if (comments[commentId].activityId===activityId) delete comments[commentId]; });
    const feedIndex=feedActivityOrder.indexOf(activityId);
    if (feedIndex>=0) feedActivityOrder.splice(feedIndex,1);
    delete shareCards[activityId];
    delete activities[activityId];
    delete baseActivities[activityId];
    delete sessions[sessionId];
    return true;
  };

  const validate = () => {
    const errors = [];
    const tables={users,playerProfiles,sessions,decks,baseActivities,photos,badges,userBadges,shops,shopBadges,passportStamps,events,eventAttendance,marketplaceListings,assets};
    Object.entries(tables).forEach(([tableName,table])=>{
      const values=Array.isArray(table)?table:Object.values(table);
      const ids=values.map(record=>record.id || `${record.userId}:${record.traitId}`);
      if(new Set(ids).size!==ids.length) errors.push(`${tableName} contains duplicate IDs`);
      if(!Array.isArray(table)) Object.entries(table).forEach(([key,record])=>{if(record.id && record.id!==key && tableName!=='playerTraits')errors.push(`${tableName} key mismatch ${key}`);});
    });
    Object.values(playerProfiles).forEach(profile=>{if(!users[profile.userId])errors.push(`Profile ${profile.id} missing user ${profile.userId}`);});
    Object.values(decks).forEach(deck => { if (!users[deck.ownerId]) errors.push(`Deck ${deck.id} has no owner`); });
    Object.values(sessions).forEach(session => {
      session.playerIds.forEach(uid => { if (!users[uid]) errors.push(`Session ${session.id} missing user ${uid}`); });
      session.deckIds.forEach((deckId,index) => { const deck=decks[deckId]; if (!deck) errors.push(`Session ${session.id} missing deck ${deckId}`); else if (deck.ownerId !== session.playerIds[index]) errors.push(`Session ${session.id} deck owner mismatch ${deckId}`); });
      if (!shops[session.shopId]) errors.push(`Session ${session.id} missing shop ${session.shopId}`);
      if (session.eventId && !events[session.eventId]) errors.push(`Session ${session.id} missing event ${session.eventId}`);
      if (!baseActivities[session.activityId] || baseActivities[session.activityId].sessionId !== session.id) errors.push(`Session ${session.id} activity link mismatch`);
      session.photoIds.forEach(photoId=>{const photo=photos[photoId];if(!photo)errors.push(`Session ${session.id} missing photo ${photoId}`);else if(!session.playerIds.includes(photo.ownerUserId))errors.push(`Session ${session.id} photo owner mismatch ${photoId}`);});
      session.earnedBadgeIds.forEach(badgeId=>{if(!badges[badgeId])errors.push(`Session ${session.id} missing badge ${badgeId}`);});
    });
    Object.values(events).forEach(event => {
      if (!users[event.hostId]) errors.push(`Event ${event.id} missing host`);
      if (!shops[event.shopId]) errors.push(`Event ${event.id} missing shop`);
      event.attendeeIds.forEach(uid => { if (!users[uid]) errors.push(`Event ${event.id} missing attendee ${uid}`); });
      if(event.posterAssetId && !assets[event.posterAssetId])errors.push(`Event ${event.id} missing poster asset ${event.posterAssetId}`);
    });
    Object.values(photos).forEach(photo=>{if(!users[photo.ownerUserId])errors.push(`Photo ${photo.id} missing owner`);if(!baseActivities[photo.activityId])errors.push(`Photo ${photo.id} missing activity`);if(!assets[photo.assetId] && !photo.assetId.startsWith('graphic_'))errors.push(`Photo ${photo.id} missing asset ${photo.assetId}`);});
    Object.values(userBadges).forEach(record=>{if(!users[record.userId])errors.push(`User badge ${record.id} missing user`);if(!badges[record.badgeId])errors.push(`User badge ${record.id} missing badge`);});
    const badgeArtworkOwners=new Map();
    Object.values(badges).forEach(badge=>{
      ['id','name','category','rarity','description','artwork'].forEach(field=>{if(!badge[field])errors.push(`Badge ${badge.id || 'unknown'} missing ${field}`);});
      if(badgeArtworkOwners.has(badge.artwork))errors.push(`Badge artwork ${badge.artwork} reused by ${badgeArtworkOwners.get(badge.artwork)} and ${badge.id}`);
      else badgeArtworkOwners.set(badge.artwork,badge.id);
    });
    const shopBadgeArtworkOwners=new Map();
    Object.values(shopBadges).forEach(record=>{
      if(!shops[record.shopId])errors.push(`Shop badge ${record.id} missing shop`);
      ['id','name','category','rarity','description','artwork'].forEach(field=>{if(!record[field])errors.push(`Shop badge ${record.id || 'unknown'} missing ${field}`);});
      if(shopBadgeArtworkOwners.has(record.artwork))errors.push(`Shop badge artwork ${record.artwork} reused by ${shopBadgeArtworkOwners.get(record.artwork)} and ${record.id}`);
      else shopBadgeArtworkOwners.set(record.artwork,record.id);
    });
    Object.values(passportStamps).forEach(stamp=>{if(!users[stamp.userId])errors.push(`Stamp ${stamp.id} missing user`);if(!shops[stamp.shopId])errors.push(`Stamp ${stamp.id} missing shop`);if(!shopBadges[stamp.shopBadgeId])errors.push(`Stamp ${stamp.id} missing shop badge`);});
    Object.values(eventAttendance).forEach(record=>{if(!users[record.userId])errors.push(`Attendance ${record.id} missing user`);if(!events[record.eventId])errors.push(`Attendance ${record.id} missing event`);});
    Object.values(marketplaceListings).forEach(listing=>{if(listing.sellerType==='user'&&!users[listing.sellerId])errors.push(`Listing ${listing.id} missing seller`);if(listing.sellerType==='shop'&&!shops[listing.sellerId])errors.push(`Listing ${listing.id} missing shop seller`);if(listing.shopId&&!shops[listing.shopId])errors.push(`Listing ${listing.id} missing shop`);if(!badges[listing.badgeRewardId])errors.push(`Listing ${listing.id} missing reward badge`);});
    Object.entries(playerTraits).forEach(([userId,traits])=>{if(!users[userId])errors.push(`Traits missing user ${userId}`);traits.forEach(trait=>{if(!traitDefinitions[trait.traitId]||!trait.sourceMetrics.length||!Number.isFinite(trait.score))errors.push(`Invalid trait ${userId}:${trait.traitId}`);});});
    Object.values(comments).forEach(comment => {
      if (!users[comment.userId]) errors.push(`Comment ${comment.id} missing user`);
      if (!baseActivities[comment.activityId]) errors.push(`Comment ${comment.id} missing activity`);
    });
    Object.values(baseActivities).forEach(activity => {
      if (activity.authorUserId && !users[activity.authorUserId]) errors.push(`Activity ${activity.id} missing author`);
      if (activity.sessionId && !sessions[activity.sessionId]) errors.push(`Activity ${activity.id} missing session`);
      if (activity.eventId && !events[activity.eventId]) errors.push(`Activity ${activity.id} missing event`);
      if (activity.shopId && !shops[activity.shopId]) errors.push(`Activity ${activity.id} missing shop`);
      if(activity.type==='badge' && !badges[activity.badgeId])errors.push(`Badge activity ${activity.id} missing canonical badge`);
      (activity.earnedBadgeIds || []).forEach(badgeId=>{if(!badges[badgeId])errors.push(`Activity ${activity.id} missing earned badge ${badgeId}`);});
      activity.commentIds.forEach(commentId => { if (!comments[commentId] || comments[commentId].activityId !== activity.id) errors.push(`Activity ${activity.id} comment link mismatch ${commentId}`); });
      if (!shareCards[activity.id] || shareCards[activity.id].activityId !== activity.id) errors.push(`Activity ${activity.id} missing share card`);
    });
    Object.values(users).forEach(user => user.albumPhotoIds.forEach(photoId => { const photo=photos[photoId];if(!photo)errors.push(`User ${user.id} album missing photo ${photoId}`);else if(photo.ownerUserId!==user.id)errors.push(`User ${user.id} album ownership mismatch ${photoId}`); }));
    feedActivityOrder.forEach(activityId => { if (!baseActivities[activityId]) errors.push(`Feed missing activity ${activityId}`); });
    return {ok:errors.length===0,errors,counts:{users:Object.keys(users).length,profiles:Object.keys(playerProfiles).length,sessions:Object.keys(sessions).length,decks:Object.keys(decks).length,events:Object.keys(events).length,shops:Object.keys(shops).length,photos:Object.keys(photos).length,badges:Object.keys(badges).length,userBadges:Object.keys(userBadges).length,passportStamps:Object.keys(passportStamps).length,traits:Object.values(playerTraits).flat().length,listings:Object.keys(marketplaceListings).length,activities:Object.keys(baseActivities).length,comments:Object.keys(comments).length,assets:Object.keys(assets).length}};
  };

  const db = {version:'1.9.4',users,playerProfiles,sessions,decks,baseActivities,activities,photos,badges,userBadges,shops,partnerShops:shops,shopBadges,passportStamps,events,eventAttendance,playerTraits,traitDefinitions,marketplaceListings,assets,comments,feedActivityOrder,badgeCatalog,shareCards,materializeActivity,registerSession,registerPhoto,updateSession,deleteSession,validate};
  window.VERSO_DATA = {
    users:Object.values(users).map(u=>[u.shortName,u.game,u.role,u.shortName[0]]),
    badges:badgeCatalog,
    partnerShops:Object.values(shops).map(s=>[s.name.toUpperCase(),s.city.toUpperCase(),s.code,s.checked]),
    activities,
    feedActivityOrder,
  };
  return db;
})();
