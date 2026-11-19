import sys, os, urllib.request, urllib.parse, concurrent.futures as cf, json
out, dl = sys.argv[1], sys.argv[2]
UA = {"User-Agent": "Mozilla/5.0"}
X0, X1, Y0, Y1 = 426+160, 445+160, -89+512, -78+512   # z10 inclusive
jobs = []
for z in range(10, 5, -1):
    s = 10 - z
    for x in range(X0 >> s, (X1 >> s) + 1):
        for y in range(Y0 >> s, (Y1 >> s) + 1):
            jobs.append((z, x, y))
def get(j):
    z, x, y = j
    p = f"{out}/{z}/{x}/{y}.webp"
    if os.path.exists(p) and os.path.getsize(p) > 0: return 0
    os.makedirs(os.path.dirname(p), exist_ok=True)
    try:
        r = urllib.request.urlopen(urllib.request.Request(f"https://tiles.isometricsf.com/v1/art/{z}/{x}/{y}.webp", headers=UA), timeout=40)
        d = r.read(); open(p, "wb").write(d); return len(d)
    except Exception as e:
        return f"{j} {e}"
with cf.ThreadPoolExecutor(6) as ex: res = list(ex.map(get, jobs))
bad = [r for r in res if isinstance(r, str)]
print(len(jobs), "tiles", sum(r for r in res if isinstance(r, int)) / 1e6, "MB new", "failed:", bad[:5], len(bad))
# elevation + OSM
urllib.request.urlretrieve("https://isometricsf.com/data/elev.png", f"{dl}/elev.png") if not os.path.exists(f"{dl}/elev.png") else None
q = """[out:json][timeout:60];(way["building"](37.416,-122.186,37.441,-122.152);way["highway"~"footway|path|pedestrian|steps|cycleway|living_street"](37.416,-122.186,37.441,-122.152);relation["building"](37.416,-122.186,37.441,-122.152););out geom tags;"""
if not os.path.exists(f"{dl}/osm.json"):
    for host in ["https://overpass-api.de/api/interpreter", "https://overpass.kumi.systems/api/interpreter"]:
        try:
            r = urllib.request.urlopen(urllib.request.Request(host, data=urllib.parse.urlencode({"data": q}).encode(), headers=UA), timeout=90)
            d = r.read(); json.loads(d); open(f"{dl}/osm.json", "wb").write(d); print("osm", len(d)); break
        except Exception as e: print("overpass fail", host, e)
