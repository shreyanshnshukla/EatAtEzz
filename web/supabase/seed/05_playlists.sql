-- 24 starter Food Playlists for Lucknow (curated by the EatAtEzz team)
with p(pos, slug, title, tagline, description, section, items) as (values
 (1,'galouti-gang','Galouti Gang','Melt-in-the-mouth, no chewing needed','The kebabs Lucknow is famous for: galouti, kakori and seekh from the old-city legends and their best rivals.','non_veg',
   array['tunday-kababi-chowk','tunday-kababi-aminabad','mughal-kakori-kabab','awadhi-kakori-kabab','abdul-wahid-kakori-seekh-kebab','al-anas-dora-kabab','kareem-kababi','akbar-ali-kabab-parathe']),
 (2,'biryani-bhai-log','Biryani Bhai Log','Dum pe pakki, dil pe likhi','Awadhi dum biryani, lighter and more fragrant than you think. Start at Idrees and argue from there.','non_veg',
   array['idrees-biryani','lalla-biryani','wahid-biryani','shakeel-biryani-corner','zeeshan-biryani','hafiz-ji-biryani-wala','badshah-biryani','mashi-biryani-world']),
 (3,'nihari-before-noon','Nihari Before Noon','Old-city mornings, slow-cooked','Nihari, kulcha and sheermal. Go early: the best pots run out before lunch.','non_veg',
   array['raheem-s-kulcha-nahari','abdul-rahim-hotel-nihari-khulcha','raheem-hotel','mubeen-s','mubeen-s-the-real-mughlai-cuisine','salman-sheermal-wale','zam-zam-sheermal']),
 (4,'nawabi-dawat','Nawabi Dawat','Sit down, slow down, eat like a nawab','Awadhi sit-down meals for when you want korma, kebab platters and a proper dastarkhwan.','non_veg',
   array['naimat-khana','dastarkhwan-tulsi-theatre','the-awadh-s-dastarkhwan','the-mughal-s-dastarkhwan','naushijaan','aadab-e-dastarkhwan-restaurant','alamgir-hotel']),
 (5,'roll-call','Roll Call','Wrapped, rolled, gone in five bites','Kathi rolls, shawarma and Mughlai rolls for eating on the move.','non_veg',
   array['m-f-lebanese-shawarma','abdul-kadeer-shawarma-roll','orhan-shawarma-house-khurram-nagar','mughlai-roll-corner','rollarappaa','kathi-junction-lucknow','supreme-kathi-roll']),
 (6,'old-city-crawl','Old City Non-Veg Crawl','Akbari Gate to Chowk, one bite at a time','A walking trail through Chowk: kebab, biryani, nihari, sheermal, and a paan to finish.','non_veg',
   array['tunday-kababi-chowk','idrees-biryani','raheem-s-kulcha-nahari','mubeen-s','salman-sheermal-wale','kebabchi-lucknow','lucknow-ki-shaan-azhar-bhai-ka-paan']),
 (7,'fried-chicken-fix','Fried Chicken Fix','Crunch first, questions later','Lucknow does fried chicken too. These are the local crunch spots.','non_veg',
   array['arabecue-fried-chicken','arabecue-fried-chicken-chowk','chiqby-fried-chicken-lucknow','lucknow-fried-chicken','efc-esselate-fried-chicken']),
 (8,'chaat-pe-charcha','Chaat Pe Charcha','Khatta, meetha, teekha: sab ek plate mein','Basket chaat, tikki, matar and dahi bade from the city''s most argued-about chaat counters.','veg',
   array['royal-cafe-hazratganj','shukla-chaat-house','pandit-chat-corner-c-for-chat','jagdish-chaat-house','verma-chat-bhandar','halwasiya-matar-chaat','gpo-ke-thandey-dahi-bade','madan-bhai-khasta-matar-chaat-wale']),
 (9,'kachori-before-class','Kachori Before Class','The breakfast that runs Lucknow','Hot kachori, khasta and aloo sabzi. Best before 10 am.','veg',
   array['bajpayee-kachodi-bhandar','rattilal-s','sahu-kachodi-bhandar','shri-sahu-khasta-corner','moti-lal-kachowdi-bhandar','shree-kachaudi-corner','murli-ke-khaste','durga-kachori-bhandar']),
 (10,'kulfi-kingdom','Kulfi Kingdom','Thick, slow, saffron-gold','Matka kulfi and falooda, from Prakash in Aminabad to the neighbourhood favourites.','veg',
   array['prakash-ki-mashoor-kulfi','prakash-ki-mashoor-kulfi-chowk','chanakya-kulfi','harish-kulfi','gaurav-kulfi-makhan-malai','sahu-kulfi-makkhan-malai','mr-kulfi-kalakaar','firki-by-kulfiwala']),
 (11,'makhan-malai-mornings','Makhan Malai Mornings','Winter only. Gone by sunrise.','Nimish: whipped milk foam that disappears on your tongue and from the stalls by mid-morning. November to February.','veg',
   array['makhan-malai-corner-deepak-mishra','gaurav-kulfi-makhan-malai','sahu-kulfi-makkhan-malai','bajpai-kachowdi-bhandar','ram-asrey']),
 (12,'meetha-mohalla','Meetha Mohalla','Malai gilori and other good decisions','Lucknow''s mithai counters, from Ram Asrey''s gilori to Chhappan Bhog''s boxes.','veg',
   array['ram-asrey','chhappan-bhog','madhurima-sweets','netram','radhey-lal-parampara-sweets-chowk','sewak-ram-misthan-bhandar','agarwal-sweets','mahangi-lal-sweet-house']),
 (13,'chai-pe-chalein','Chai Pe Chalein','Kulhad, bun makkhan, aur baatein','Tea stalls where Lucknow actually talks. Bun makkhan is mandatory.','veg',
   array['sharma-chai','sharma-ji-ki-chai','bun-makkhan-chai-bmc','kewal-tea-centre','new-shukla-tea-stall','kulhad-chai-munshi-pulia','yaadgaar-chai-the-kulhad-chuski','bewafa-chai-lal-bagh']),
 (14,'paan-ki-dukaan','Paan Ki Dukaan','Khaike paan Lucknow wala','Sweet paan, malai paan and gilori from old-school paan bhandars.','veg',
   array['satish-chaurasia-paan-bhandar','lucknow-ki-shaan-azhar-bhai-ka-paan','tambulam-paan-cafe-hazratganj','bhola-pan-bhandar','mehrotra-pan-center','the-paan-villa','kukku-paan-bhandar']),
 (15,'pure-veg-full-pet','Pure Veg, Full Pet','Thali, tandoor and second helpings','Sit-down vegetarian meals: thalis, North Indian and tandoori, all pure veg.','veg',
   array['moti-mahal-restaurant','curry-leaf-hazratganj','manbhavan-premium-thali-restaurant','agni-lucknow-pure-veg-tandoori-kitchen','neelkanth-green','kanchan-restaurant-a-pure-veg-delight','aachman-veg-restaurant','bansuri-pure-veg-restaurant-in-jankipuram-lucknow']),
 (16,'veg-kebab-bhi-hota-hai','Veg Kebab Bhi Hota Hai','Galouti, but make it veg','Vegetarian kebab parathas, chaap and the city''s best answers to "what about veg?".','veg',
   array['veg-kabab-parathe','narayan-veg-kabab','lalley-di-chaap','taste-on-wheels-soya-chaap-chinese','mr-singh-fast-food-chaap-corner','naimat-khana']),
 (17,'dosa-detour','Dosa Detour','Lucknow goes south for a bit','Crisp dosas, idli and filter-coffee energy, all across the city.','veg',
   array['madhavam-andhra-dosa-mad-dosa','gattu-s-south-indian-kitchen','anna-s-dosa','dosa-lane-lucknow','rameshwaram-dosa','tamil-nadu-dosa-point','the-sambhar-saga-best-south-indian-restraunt-in-lucknow-best','dosa-planet']),
 (18,'lassi-thandai-stop','Lassi & Thandai Stop','Thandi, gaadhi, malai maar ke','Thick lassi and kesariya thandai for Lucknow summers (and Holi).','veg',
   array['narayan-lassi','shree-lassi-sons','kesariya-thandai','chaurasia-lassi','ashwini-lassi','shri-radhey-lal-thandai-corner','chedilal-shakes-juice']),
 (19,'plant-plate-lucknow','Plant Plate Lucknow','Vegan in the city of kebabs? Haan ji.','Dedicated vegan and salad kitchens, plus street food that''s plant-based if you skip the curd and ask about ghee.','vegan',
   array['o-vegan-cloud-kitchen','salad-soul-lucknow','salado-fresh-healthy-salad','halwasiya-matar-chaat','verma-ji-golgappe-point','arshad-pani-batashe-chaat-corner','juiceghar']),
 (20,'underrated-gems','Underrated Gems','Not on every list. Should be.','Smaller stalls that locals swear by and food blogs mostly skip.','underrated',
   array['interested-in-tikki','madan-bhai-khasta-matar-chaat-wale','bhojpuri-zayka','verma-ji-golgappe-point','singh-samosa-corner','zam-zam-sheermal','sardar-ji-ke-mashoor-chole-bhature','murli-ke-khaste']),
 (21,'momo-mafia','Momo Mafia','Steamed, fried, tandoori, repeat','Lucknow''s momo obsession, from Nainital Momos to the neighbourhood carts.','underrated',
   array['nainital-momos-multigrain-momos','momo-monk','the-fat-dumpling-momo-cafe','mansa-butter-momos','deurali-momos-chef-ishwar-kumar','pokhara-momos','sangti-momos-indira-nagar','wow-momo']),
 (22,'pocket-friendly-picks','Pocket-Friendly Picks','Jeb halki, pet bhaari','Street-side favourites that won''t dent a student budget.','underrated',
   array['bajpayee-kachodi-bhandar','singh-samosa-corner','pandit-chat-corner-c-for-chat','sharma-chai','verma-ji-golgappe-point','rattilal-s','gpo-ke-thandey-dahi-bade']),
 (23,'hazratganj-evening-walk','Hazratganj Evening Walk','Ganjing, the tasty way','A slow evening on the Ganj: chaat, dahi bade, kulfi, paan and chai.','area',
   array['royal-cafe-hazratganj','shukla-chaat-house','gpo-ke-thandey-dahi-bade','bajpayee-kachodi-bhandar','satish-chaurasia-paan-bhandar','mio-marito-gelato','new-shukla-tea-stall']),
 (24,'gomti-nagar-weekend','Gomti Nagar Weekend','New Lucknow, same appetite','A weekend loop through Gomti Nagar: chaat, momos, kebabs, kulfi and coffee.','area',
   array['verma-chat-bhandar','jalori-gate-restaurant','nainital-momos-multigrain-momos','the-awadh-s-dastarkhwan','tunday-kababi-vibhuti-khand-gomtinagar','prakash-ki-mashoor-kulfi-gomti-nagar','roastery-coffee-house-gomti-nagar'])
), ins as (
  insert into public.playlists (city_id, slug, title, tagline, description, section, position)
  select c.id, p.slug, p.title, p.tagline, p.description, p.section, p.pos
  from p, public.cities c where c.slug = 'lucknow'
  returning id, slug
)
insert into public.playlist_items (playlist_id, vendor_id, position)
select ins.id, v.id, s.ord
from ins
join p on p.slug = ins.slug
cross join lateral unnest(p.items) with ordinality as s(vslug, ord)
join public.vendors v on v.slug = s.vslug;
