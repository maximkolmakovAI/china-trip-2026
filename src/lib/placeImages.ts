/**
 * Place images manifest.
 * Maps place IDs to their downloaded image files in /images/places/.
 * Generated from download-place-images.py
 *
 * Used by DetailModal, IdeaCard, and ProgramItem to show photo galleries.
 */

// Dynamic import that checks file existence at runtime
// We use static listing since Next.js static export doesn't support fs at runtime

export interface PlaceImageEntry {
  id: string;
  name: string; // RU name for matching
  images: string[];
  aliases?: string[]; // alternative names to match against program items / ideas
}

/**
 * Full registry of places with images.
 * The images array contains paths relative to /images/places/<id>/.
 */
export const PLACE_IMAGES: PlaceImageEntry[] = [
  // === SHANGHAI ===
  { id: "bund", name: "Бунд (Вайтань)", aliases: ["Вайтань", "The Bund", "Бунд"], images: ["/images/places/bund/bund_1.jpg", "/images/places/bund/bund_2.jpg", "/images/places/bund/bund_3.jpg"] },
  { id: "nanjing_road", name: "Нанкин Роуд", aliases: ["Нанкин", "Nanjing Road"], images: ["/images/places/nanjing_road/nanjing_road_1.jpg", "/images/places/nanjing_road/nanjing_road_2.jpg", "/images/places/nanjing_road/nanjing_road_3.jpg"] },
  { id: "pudong", name: "Пудун", aliases: ["Пудун", "Pudong", "Lujiazui", "Луцзяцзуй"], images: ["/images/places/pudong/pudong_1.jpg", "/images/places/pudong/pudong_2.jpg", "/images/places/pudong/pudong_3.jpg"] },
  { id: "shanghai_tower", name: "Shanghai Tower", aliases: ["Shanghai Tower"], images: ["/images/places/shanghai_tower/shanghai_tower_1.jpg", "/images/places/shanghai_tower/shanghai_tower_2.jpg", "/images/places/shanghai_tower/shanghai_tower_3.jpg"] },
  { id: "jin_mao", name: "Башня Цзинь Мао", aliases: ["Цзинь Мао", "Jin Mao"], images: ["/images/places/jin_mao/jin_mao_1.jpg", "/images/places/jin_mao/jin_mao_2.jpg", "/images/places/jin_mao/jin_mao_3.jpg"] },
  { id: "oriental_pearl", name: "Восточная жемчужина", aliases: ["Восточная жемчужина", "Oriental Pearl"], images: [] },
  { id: "disneyland", name: "Shanghai Disneyland", aliases: ["Disneyland", "Диснейленд", "Disney"], images: ["/images/places/disneyland/disneyland_1.jpg", "/images/places/disneyland/disneyland_2.jpg"] },
  { id: "yuyuan", name: "Юй Юань", aliases: ["Юй Юань", "Yuyuan", "Yu Garden"], images: ["/images/places/yuyuan/yuyuan_1.jpg", "/images/places/yuyuan/yuyuan_2.jpg", "/images/places/yuyuan/yuyuan_3.jpg"] },
  { id: "old_town", name: "Старый город (Чэнхуанмяо)", aliases: ["Чэнхуанмяо", "Старый город", "Chenghuangmiao"], images: ["/images/places/old_town/old_town_1.jpg", "/images/places/old_town/old_town_2.jpg", "/images/places/old_town/old_town_3.jpg"] },
  { id: "tianzifang", name: "Tianzifang", aliases: ["Tianzifang"], images: ["/images/places/tianzifang/tianzifang_1.jpg", "/images/places/tianzifang/tianzifang_2.jpg"] },
  { id: "french_concession", name: "Французская концессия", aliases: ["Французская концессия", "French Concession"], images: ["/images/places/french_concession/french_concession_1.jpg", "/images/places/french_concession/french_concession_2.jpg"] },
  { id: "shanghai_museum", name: "Шанхайский музей", aliases: ["Шанхайский музей", "Shanghai Museum"], images: ["/images/places/shanghai_museum/shanghai_museum_1.jpg", "/images/places/shanghai_museum/shanghai_museum_2.jpg", "/images/places/shanghai_museum/shanghai_museum_3.jpg"] },
  { id: "peoples_square", name: "Народная площадь", aliases: ["Народная площадь", "People's Square"], images: ["/images/places/peoples_square/peoples_square_1.jpg", "/images/places/peoples_square/peoples_square_2.jpg", "/images/places/peoples_square/peoples_square_3.jpg"] },
  { id: "peoples_park", name: "Народный парк", aliases: ["Народный парк", "People's Park"], images: ["/images/places/peoples_park/peoples_park_1.jpg", "/images/places/peoples_park/peoples_park_2.jpg", "/images/places/peoples_park/peoples_park_3.jpg"] },
  { id: "m50", name: "M50", aliases: ["M50"], images: ["/images/places/m50/m50_1.jpg", "/images/places/m50/m50_2.jpg", "/images/places/m50/m50_3.jpg"] },
  { id: "1933", name: "1933", aliases: ["1933"], images: ["/images/places/1933/1933_1.jpg"] },
  { id: "planetarium", name: "Шанхайский планетарий", aliases: ["Планетарий", "Astronomy Museum", "Planetarium"], images: ["/images/places/planetarium/planetarium_1.jpg", "/images/places/planetarium/planetarium_2.jpg", "/images/places/planetarium/planetarium_3.jpg"] },
  { id: "science_museum", name: "Музей науки", aliases: ["Музей науки", "Science Museum"], images: ["/images/places/science_museum/science_museum_1.jpg", "/images/places/science_museum/science_museum_2.jpg"] },
  { id: "zhujiajiao", name: "Чжуцзяцзяо", aliases: ["Чжуцзяцзяо", "Zhujiajiao"], images: ["/images/places/zhujiajiao/zhujiajiao_1.jpg"] },
  { id: "auto_museum", name: "Shanghai Auto Museum", aliases: ["Auto Museum", "Авто музей"], images: ["/images/places/auto_museum/auto_museum_1.jpg", "/images/places/auto_museum/auto_museum_2.jpg", "/images/places/auto_museum/auto_museum_3.jpg"] },
  { id: "oceanarium", name: "Шанхайский океанариум", aliases: ["Океанариум", "Ocean Aquarium"], images: ["/images/places/oceanarium/oceanarium_1.jpg", "/images/places/oceanarium/oceanarium_2.jpg"] },
  { id: "longhua_temple", name: "Храм Лунхуа", aliases: ["Лунхуа", "Longhua"], images: ["/images/places/longhua_temple/longhua_temple_1.jpg"] },
  { id: "wenmiao", name: "Храм Конфуция (Веньмао)", aliases: ["Веньмао", "Конфуция", "Wenmiao", "Confucian Temple"], images: ["/images/places/wenmiao/wenmiao_1.jpg", "/images/places/wenmiao/wenmiao_2.jpg"] },
  { id: "fuxing_park", name: "Фуксин (Fuxing Park)", aliases: ["Фуксин", "Fuxing"], images: ["/images/places/fuxing_park/fuxing_park_1.jpg", "/images/places/fuxing_park/fuxing_park_2.jpg", "/images/places/fuxing_park/fuxing_park_3.jpg"] },
  { id: "jewish_museum", name: "Музей еврейских беженцев", aliases: ["еврейских беженцев", "Jewish Refugees"], images: ["/images/places/jewish_museum/jewish_museum_1.jpg", "/images/places/jewish_museum/jewish_museum_2.jpg", "/images/places/jewish_museum/jewish_museum_3.jpg"] },
  { id: "lujiazui_bridge", name: "Пешеходный мост Луцзяцзуй", aliases: ["мост Луцзяцзуй", "Lujiazui"], images: ["/images/places/lujiazui_bridge/lujiazui_bridge_1.jpg"] },
  { id: "urban_planning", name: "Выставочный центр городского планирования", aliases: ["городского планирования", "Urban Planning"], images: ["/images/places/urban_planning/urban_planning_1.jpg", "/images/places/urban_planning/urban_planning_2.jpg", "/images/places/urban_planning/urban_planning_3.jpg"] },
  { id: "tianshan_tea", name: "Tianshan Tea City", aliases: ["Tianshan", "чайный рынок", "Tea City"], images: ["/images/places/tianshan_tea/tianshan_tea_1.jpg", "/images/places/tianshan_tea/tianshan_tea_2.jpg"] },
  { id: "nanshi", name: "Старый город Наньши", aliases: ["Наньши", "Nanshi"], images: [] },

  // === BEIJING ===
  { id: "forbidden_city", name: "Запретный город", aliases: ["Запретный город", "Forbidden City", "Gugong"], images: ["/images/places/forbidden_city/forbidden_city_1.jpg"] },
  { id: "tiananmen", name: "Тяньаньмэнь", aliases: ["Тяньаньмэнь", "Tiananmen"], images: ["/images/places/tiananmen/tiananmen_1.jpg", "/images/places/tiananmen/tiananmen_2.jpg", "/images/places/tiananmen/tiananmen_3.jpg"] },
  { id: "great_wall_badaling", name: "Великая стена (Бадалин)", aliases: ["Бадалин", "Badaling"], images: [] },
  { id: "great_wall_mutianyu", name: "Великая стена (Мутяньюй)", aliases: ["Мутяньюй", "Mutianyu"], images: ["/images/places/great_wall_mutianyu/great_wall_mutianyu_1.jpg"] },
  { id: "great_wall_simatai", name: "Великая стена (Симатай)", aliases: ["Симатай", "Simatai"], images: ["/images/places/great_wall_simatai/great_wall_simatai_1.jpg", "/images/places/great_wall_simatai/great_wall_simatai_2.jpg"] },
  { id: "summer_palace", name: "Летний дворец", aliases: ["Летний дворец", "Summer Palace", "Yiheyuan"], images: ["/images/places/summer_palace/summer_palace_1.jpg"] },
  { id: "temple_of_heaven", name: "Храм Неба", aliases: ["Храм Неба", "Temple of Heaven"], images: ["/images/places/temple_of_heaven/temple_of_heaven_1.jpg"] },
  { id: "lama_temple", name: "Храм Ламы", aliases: ["Храм Ламы", "Lama Temple", "Yonghe"], images: ["/images/places/lama_temple/lama_temple_1.jpg", "/images/places/lama_temple/lama_temple_2.jpg", "/images/places/lama_temple/lama_temple_3.jpg"] },
  { id: "hutong_nanluoguxiang", name: "Хутун (Наньлогосян)", aliases: ["Наньлогосян", "Nanluoguxiang"], images: ["/images/places/hutong_nanluoguxiang/hutong_nanluoguxiang_1.jpg", "/images/places/hutong_nanluoguxiang/hutong_nanluoguxiang_2.jpg", "/images/places/hutong_nanluoguxiang/hutong_nanluoguxiang_3.jpg"] },
  { id: "wudaoying_hutong", name: "Бада хутун (Wudaoying)", aliases: ["Wudaoying", "Бада хутун", "Wudaoying Hutong"], images: ["/images/places/wudaoying_hutong/wudaoying_hutong_1.jpg"] },
  { id: "qianmen_hutong", name: "Хутуны Цяньмэнь", aliases: ["Цяньмэнь", "Qianmen", "хутунам Цяньмэнь"], images: ["/images/places/qianmen_hutong/qianmen_hutong_1.jpg"] },
  { id: "olympic_park", name: "Олимпийский парк", aliases: ["Олимпийский парк", "Olympic Park"], images: ["/images/places/olympic_park/olympic_park_1.jpg", "/images/places/olympic_park/olympic_park_2.jpg", "/images/places/olympic_park/olympic_park_3.jpg"] },
  { id: "birds_nest", name: "Национальный стадион", aliases: ["Национальный стадион", "Bird's Nest", "Bird", "Национальный"], images: ["/images/places/birds_nest/birds_nest_1.jpg"] },
  { id: "wangfujing", name: "Ванфуцзин", aliases: ["Ванфуцзин", "Wangfujing"], images: ["/images/places/wangfujing/wangfujing_1.jpg", "/images/places/wangfujing/wangfujing_2.jpg", "/images/places/wangfujing/wangfujing_3.jpg"] },
  { id: "wangfujing_market", name: "Ночной рынок Ванфуцзин", aliases: ["рынок Ванфуцзин", "Wangfujing night market", "ночному рынку"], images: ["/images/places/wangfujing_market/wangfujing_market_1.jpg", "/images/places/wangfujing_market/wangfujing_market_2.jpg", "/images/places/wangfujing_market/wangfujing_market_3.jpg"] },
  { id: "gulou", name: "Гулоу (Барабанная башня)", aliases: ["Гулоу", "Барабанная башня", "Drum Tower", "Gulou"], images: ["/images/places/gulou/gulou_1.jpg", "/images/places/gulou/gulou_2.jpg", "/images/places/gulou/gulou_3.jpg"] },
  { id: "beihai_park", name: "Парк Бэйхай", aliases: ["Бэйхай", "Beihai"], images: ["/images/places/beihai_park/beihai_park_2.jpg"] },
  { id: "798_art", name: "798 Art Zone", aliases: ["798", "Art Zone"], images: ["/images/places/798_art/798_art_1.jpg", "/images/places/798_art/798_art_2.jpg", "/images/places/798_art/798_art_3.jpg"] },
  { id: "beijing_zoo", name: "Пекинский зоопарк (панды)", aliases: ["панды", "Beijing Zoo", "Zoo", "панд"], images: ["/images/places/beijing_zoo/beijing_zoo_1.jpg", "/images/places/beijing_zoo/beijing_zoo_2.jpg", "/images/places/beijing_zoo/beijing_zoo_3.jpg"] },
  { id: "universal_beijing", name: "Universal Beijing Resort", aliases: ["Universal", "Universal Beijing"], images: ["/images/places/universal_beijing/universal_beijing_1.jpg", "/images/places/universal_beijing/universal_beijing_2.jpg", "/images/places/universal_beijing/universal_beijing_3.jpg"] },
  { id: "liu_xinyuan", name: "Парк Лю Синя", aliases: ["Лю Синя", "Liu Xinyuan", "Лю Син"], images: ["/images/places/liu_xinyuan/liu_xinyuan_1.jpg", "/images/places/liu_xinyuan/liu_xinyuan_2.jpg"] },

  // === OTHER CITIES ===
  { id: "west_lake", name: "Озеро Сиху (West Lake)", aliases: ["Сиху", "West Lake", "Xi Hu", "озеро Сиху"], images: ["/images/places/west_lake/west_lake_1.jpg", "/images/places/west_lake/west_lake_2.jpg", "/images/places/west_lake/west_lake_3.jpg"] },
  { id: "lingyin_temple", name: "Линъинь Сы (Ханчжоу)", aliases: ["Линъинь", "Lingyin"], images: ["/images/places/lingyin_temple/lingyin_temple_1.jpg", "/images/places/lingyin_temple/lingyin_temple_2.jpg"] },
  { id: "meijiawu", name: "Чайная деревня Мэйцзяу", aliases: ["Мэйцзяу", "Meijiawu", "чайная деревня"], images: ["/images/places/meijiawu/meijiawu_1.jpg", "/images/places/meijiawu/meijiawu_2.jpg", "/images/places/meijiawu/meijiawu_3.jpg"] },
  { id: "qingshanhu", name: "Qingshanhu Water Forest", aliases: ["Qingshanhu", "Water Forest"], images: ["/images/places/qingshanhu/qingshanhu_1.jpg"] },
  { id: "huangshan_mountains", name: "Жёлтые горы (Huangshan)", aliases: ["Жёлтые горы", "Huangshan", "Хуаншань"], images: ["/images/places/huangshan_mountains/huangshan_mountains_1.jpg"] },
  { id: "huangshan_hot_springs", name: "Горячие источники Хуаншань", aliases: ["Горячие источники", "hot springs"], images: [] },
  { id: "ningbo_city", name: "Нинбо", aliases: ["Нинбо", "Ningbo"], images: ["/images/places/ningbo_city/ningbo_city_1.jpg"] },
  { id: "tianyi_ge", name: "Тяньи-гэ (Нинбо)", aliases: ["Тяньи", "Tianyi"], images: ["/images/places/tianyi_ge/tianyi_ge_1.jpg"] },
  { id: "baoguo_temple", name: "Храм Баого (Нинбо)", aliases: ["Баого", "Baoguo"], images: ["/images/places/baoguo_temple/baoguo_temple_1.jpg"] },
  { id: "houwan_village", name: "Houwan Village", aliases: ["Houwan", "заброшенная деревня"], images: ["/images/places/houwan_village/houwan_village_1.jpg"] },
  { id: "wangxian_valley", name: "Wangxian Valley", aliases: ["Wangxian", "Wangxian Valley"], images: [] },
  { id: "nanjing_city", name: "Нанкин", aliases: ["Нанкин", "Nanjing"], images: [] },
];

/**
 * Match a free-text name (from program items, ideas, etc.) to a place with images.
 * Uses fuzzy matching: checks if any alias is included in the text.
 */
export function findPlaceImages(text: string): string[] {
  if (!text) return [];
  const lower = text.toLowerCase();

  // Score each place by how many alias chars match
  let bestMatch: PlaceImageEntry | null = null;
  let bestScore = 0;

  for (const place of PLACE_IMAGES) {
    if (place.images.length === 0) continue;

    // Check all aliases + name
    const candidates = [place.name, ...(place.aliases || [])];
    for (const alias of candidates) {
      const aliasLower = alias.toLowerCase();
      if (lower.includes(aliasLower)) {
        // Score = alias length (longer match = more specific)
        if (aliasLower.length > bestScore) {
          bestScore = aliasLower.length;
          bestMatch = place;
        }
      }
    }
  }

  return bestMatch ? bestMatch.images : [];
}
