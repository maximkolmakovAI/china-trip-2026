#!/usr/bin/env python3
"""
Download place/landmark images from Wikimedia Commons — optimized version.
Uses generator API to search + get image URLs in a SINGLE request per place.
Respects rate limits with proper delays.
"""

import urllib.request
import urllib.parse
import ssl
import json
import os
import time

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(BASE_DIR, "public", "images", "places")

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
    "Accept": "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
    "Referer": "https://commons.wikimedia.org/",
}

# Simplified places list — one search term per place (the most specific one)
PLACES = [
    # === SHANGHAI ===
    {"id": "bund", "name": "Бунд", "search": "The Bund Shanghai"},
    {"id": "nanjing_road", "name": "Нанкин Роуд", "search": "Nanjing Road Shanghai"},
    {"id": "pudong", "name": "Пудун", "search": "Pudong Shanghai skyline"},
    {"id": "shanghai_tower", "name": "Shanghai Tower", "search": "Shanghai Tower"},
    {"id": "jin_mao", "name": "Цзинь Мао", "search": "Jin Mao Tower Shanghai"},
    {"id": "oriental_peal", "name": "Восточная жемчужина", "search": "Oriental Pearl Tower Shanghai"},
    {"id": "disneyland", "name": "Shanghai Disneyland", "search": "Shanghai Disneyland"},
    {"id": "yuyuan", "name": "Юй Юань", "search": "Yu Garden Shanghai"},
    {"id": "old_town", "name": "Старый город", "search": "City God Temple Shanghai"},
    {"id": "tianzifang", "name": "Tianzifang", "search": "Tianzifang Shanghai"},
    {"id": "french_concession", "name": "Французская концессия", "search": "French Concession Shanghai"},
    {"id": "shanghai_museum", "name": "Шанхайский музей", "search": "Shanghai Museum"},
    {"id": "peoples_square", "name": "Народная площадь", "search": "People's Square Shanghai"},
    {"id": "peoples_park", "name": "Народный парк", "search": "People's Park Shanghai"},
    {"id": "m50", "name": "M50", "search": "M50 art district Shanghai"},
    {"id": "1933", "name": "1933", "search": "1933 Old Millfun Shanghai"},
    {"id": "planetarium", "name": "Планетарий", "search": "Shanghai Astronomy Museum"},
    {"id": "science_museum", "name": "Музей науки", "search": "Shanghai Science and Technology Museum"},
    {"id": "zhujiajiao", "name": "Чжуцзяцзяо", "search": "Zhujiajiao water town"},
    {"id": "auto_museum", "name": "Авто музей", "search": "Shanghai Auto Museum"},
    {"id": "oceanarium", "name": "Океанариум", "search": "Shanghai Ocean Aquarium"},
    {"id": "longhua_temple", "name": "Храм Лунхуа", "search": "Longhua Temple Shanghai"},
    {"id": "wenmiao", "name": "Храм Конфуция", "search": "Shanghai Confucian Temple"},
    {"id": "fuxing_park", "name": "Фуксин", "search": "Fuxing Park Shanghai"},
    {"id": "jewish_museum", "name": "Музей еврейских беженцев", "search": "Shanghai Jewish Refugees Museum"},
    {"id": "lujiazui_bridge", "name": "Мост Луцзяцзуй", "search": "Lujiazui Shanghai"},
    {"id": "urban_planning", "name": "Центр городского планирования", "search": "Shanghai Urban Planning Exhibition Center"},
    {"id": "tianshan_tea", "name": "Tianshan Tea City", "search": "Shanghai tea market"},
    {"id": "nanshi", "name": "Старый город Наньши", "search": "Shanghai old city Nanshi"},

    # === BEIJING ===
    {"id": "forbidden_city", "name": "Запретный город", "search": "Forbidden City Beijing"},
    {"id": "tiananmen", "name": "Тяньаньмэнь", "search": "Tiananmen Square Beijing"},
    {"id": "great_wall_badaling", "name": "Стена Бадалин", "search": "Badaling Great Wall"},
    {"id": "great_wall_mutianyu", "name": "Стена Мутяньюй", "search": "Mutianyu Great Wall"},
    {"id": "great_wall_simatai", "name": "Стена Симатай", "search": "Simatai Great Wall"},
    {"id": "summer_palace", "name": "Летний дворец", "search": "Summer Palace Beijing"},
    {"id": "temple_of_heaven", "name": "Храм Неба", "search": "Temple of Heaven Beijing"},
    {"id": "lama_temple", "name": "Храм Ламы", "search": "Lama Temple Beijing Yonghe"},
    {"id": "hutong_nanluoguxiang", "name": "Хутун Наньлогосян", "search": "Nanluoguxiang Beijing"},
    {"id": "wudaoying_hutong", "name": "Wudaoying", "search": "Wudaoying Hutong Beijing"},
    {"id": "qianmen_hutong", "name": "Хутуны Цяньмэнь", "search": "Qianmen street Beijing"},
    {"id": "olympic_park", "name": "Олимпийский парк", "search": "Beijing Olympic Park"},
    {"id": "birds_nest", "name": "Национальный стадион", "search": "Beijing National Stadium Bird's Nest"},
    {"id": "wangfujing", "name": "Ванфуцзин", "search": "Wangfujing Street Beijing"},
    {"id": "wangfujing_market", "name": "Ночной рынок Ванфуцзин", "search": "Wangfujing night market"},
    {"id": "gulou", "name": "Гулоу", "search": "Beijing Drum Tower"},
    {"id": "beihai_park", "name": "Парк Бэйхай", "search": "Beihai Park Beijing"},
    {"id": "798_art", "name": "798 Art Zone", "search": "798 Art Zone Beijing"},
    {"id": "beijing_zoo", "name": "Пекинский зоопарк", "search": "Beijing Zoo panda"},
    {"id": "universal_beijing", "name": "Universal Beijing", "search": "Universal Studios Beijing"},
    {"id": "liu_xinyuan", "name": "Парк Лю Синя", "search": "Beijing park pavilion"},

    # === OTHER CITIES ===
    {"id": "west_lake", "name": "Озеро Сиху", "search": "West Lake Hangzhou"},
    {"id": "lingyin_temple", "name": "Линъинь Сы", "search": "Lingyin Temple Hangzhou"},
    {"id": "meijiawu", "name": "Мэйцзяу", "search": "Meijiawu tea village Hangzhou"},
    {"id": "qingshanhu", "name": "Qingshanhu", "search": "Qingshanhu Water Forest"},
    {"id": "huangshan_mountains", "name": "Жёлтые горы", "search": "Huangshan mountains China"},
    {"id": "huangshan_hot_springs", "name": "Источники Хуаншань", "search": "Huangshan hot springs"},
    {"id": "ningbo_city", "name": "Нинбо", "search": "Ningbo city China"},
    {"id": "tianyi_ge", "name": "Тяньи-гэ", "search": "Tianyi Pavilion Ningbo"},
    {"id": "baoguo_temple", "name": "Храм Баого", "search": "Baoguo Temple Ningbo"},
    {"id": "houwan_village", "name": "Houwan Village", "search": "Shengsi islands village"},
    {"id": "wangxian_valley", "name": "Wangxian Valley", "search": "Wangxian Valley Shangrao"},
    {"id": "nanjing_city", "name": "Нанкин", "search": "Nanjing Sun Yat-sen Mausoleum"},
]


def fetch_json(url):
    """Fetch JSON with retry on 429."""
    for attempt in range(5):
        try:
            req = urllib.request.Request(url, headers=HEADERS)
            resp = urllib.request.urlopen(req, context=ctx, timeout=25)
            return json.loads(resp.read().decode("utf-8"))
        except urllib.error.HTTPError as e:
            if e.code == 429 and attempt < 4:
                wait = 8 * (attempt + 1)
                print(f"  ⏳ Rate limited, waiting {wait}s (attempt {attempt+1})")
                time.sleep(wait)
                continue
            raise
        except Exception as e:
            if attempt < 4:
                print(f"  ⚠ Error (attempt {attempt+1}): {e}")
                time.sleep(3)
                continue
            raise


def search_and_get_urls(query, max_images=3):
    """
    Use generator API: search + get image info in one request.
    Returns list of (file_title, download_url) tuples.
    """
    params = {
        "action": "query",
        "generator": "search",
        "gsrsearch": query,
        "gsrnamespace": 6,  # File namespace
        "gsrlimit": str(max_images + 3),  # request a few extra in case some are not images
        "prop": "imageinfo",
        "iiprop": "url|size|mime",
        "iiurlwidth": "1024",
        "format": "json",
    }
    api_url = "https://commons.wikimedia.org/w/api.php?" + urllib.parse.urlencode(params)
    data = fetch_json(api_url)

    results = []
    pages = data.get("query", {}).get("pages", {})
    # Sort by search index
    sorted_pages = sorted(pages.values(), key=lambda p: p.get("index", 999))

    for page in sorted_pages:
        if "imageinfo" not in page:
            continue
        ii = page["imageinfo"][0]
        mime = ii.get("mime", "")
        if "image" not in mime:
            continue
        title = page.get("title", "")
        # Skip SVG and very small files
        if mime == "image/svg+xml":
            continue
        thumb = ii.get("thumburl")
        if thumb and ii.get("width", 0) > 300:
            results.append((title, thumb))

    return results[:max_images]


def download_image(url, filepath):
    """Download image to filepath."""
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        resp = urllib.request.urlopen(req, context=ctx, timeout=30)
        data = resp.read()
        if len(data) < 5000:
            print(f"  ⚠ Too small ({len(data)} bytes), skipping")
            return False
        if data[:3] != b"\xff\xd8\xff" and data[:4] != b"\x89PNG":
            print(f"  ⚠ Not JPEG/PNG, skipping")
            return False
        with open(filepath, "wb") as f:
            f.write(data)
        return True
    except Exception as e:
        print(f"  ⚠ Download error: {e}")
        return False


def process_place(place, max_images=3):
    """Download images for one place."""
    place_id = place["id"]
    place_dir = os.path.join(OUT_DIR, place_id)
    os.makedirs(place_dir, exist_ok=True)

    # Skip if already done
    existing = [f for f in os.listdir(place_dir) if f.lower().endswith((".jpg", ".jpeg", ".png"))]
    if len(existing) >= max_images:
        return len(existing)

    print(f"\n→ {place_id} ({place['name']})")
    time.sleep(2)  # Inter-place delay

    try:
        results = search_and_get_urls(place["search"], max_images)
    except Exception as e:
        print(f"  ✗ Search failed: {e}")
        return 0

    downloaded = 0
    for i, (title, url) in enumerate(results):
        filename = f"{place_id}_{downloaded + 1}.jpg"
        filepath = os.path.join(place_dir, filename)
        print(f"  [{downloaded+1}/{max_images}] {title[:50]}...")
        if download_image(url, filepath):
            downloaded += 1
            print(f"  ✓ Saved ({os.path.getsize(filepath) // 1024}KB)")
            time.sleep(1)
        else:
            if os.path.exists(filepath):
                os.remove(filepath)

    if downloaded == 0:
        print(f"  ✗ No images for {place_id}")
    return downloaded


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    print(f"=== Downloading place images ({len(PLACES)} places) ===")

    total = 0
    summary = {}

    for i, place in enumerate(PLACES, 1):
        print(f"[{i}/{len(PLACES)}]", end="")
        count = process_place(place)
        total += count
        summary[place["id"]] = count

    print(f"\n=== COMPLETE: {total} images, {sum(1 for v in summary.values() if v > 0)}/{len(PLACES)} places ===")

    summary_path = os.path.join(OUT_DIR, "_download_summary.json")
    with open(summary_path, "w", encoding="utf-8") as f:
        json.dump(summary, f, indent=2, ensure_ascii=False)


if __name__ == "__main__":
    main()
