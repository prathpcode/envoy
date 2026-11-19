import sys, json, numpy as np
from PIL import Image
from scipy import ndimage as ndi
tiles, outdir, dl = sys.argv[1], sys.argv[2], sys.argv[3]
C0, R0, NC, NR = 426, -89, 20, 12            # world = z10 cells
# z9 mosaic of the world
X0, Y0 = (C0+160) >> 1, (R0+512) >> 1
X1, Y1 = (C0+NC-1+160) >> 1, (R0+NR-1+512) >> 1
M = Image.new("RGB", ((X1-X0+1)*512, (Y1-Y0+1)*512))
for x in range(X0, X1+1):
    for y in range(Y0, Y1+1):
        M.paste(Image.open(f"{tiles}/9/{x}/{y}.webp").convert("RGB"), ((x-X0)*512, (y-Y0)*512))
ox, oy = ((C0+160) - X0*2)*256, ((R0+512) - Y0*2)*256
M = M.crop((ox, oy, ox+NC*256, oy+NR*256)); print("z9 world", M.size)
M = M.filter(__import__("PIL.ImageFilter", fromlist=["x"]).MedianFilter(5))
a = np.asarray(M.convert("HSV")).astype(np.float32)
h, s, v = a[..., 0]*360/255, a[..., 1]/255, a[..., 2]/255
sand = (h > 24) & (h < 52) & (s > 0.10) & (s < 0.50) & (v > 0.66)
grey = (s < 0.20) & (v > 0.27) & (v < 0.80)
lawn = (h > 60) & (h < 125) & (s > 0.30) & (v > 0.56)
walk = sand | grey | lawn
walk[1100:1300, 2760:2860] = False   # Hoover Tower shaft reads as sand
walk = ndi.binary_opening(walk, iterations=1)
walk = ndi.binary_erosion(walk, iterations=3)           # ~2 m clear of walls, trunks, outlines
lab, n = ndi.label(walk)
sizes = ndi.sum(walk, lab, range(1, n+1))
keep = np.isin(lab, 1 + np.flatnonzero(sizes > 2200))     # drop specks (roof highlights, cars)
m8 = keep.reshape(NR*128, 2, NC*128, 2).all(axis=(1, 3))
print("walkable share", m8.mean())
Image.fromarray((m8*255).astype(np.uint8)).convert("1").save(f"{outdir}/walk.png", optimize=True)
dbg = np.asarray(M).copy(); k = keep
dbg[k] = (dbg[k]*0.45 + np.array([255, 0, 200])*0.55).astype(np.uint8)
Image.fromarray(dbg).resize((NC*128, NR*128)).save(f"{dl}/dbg.jpg", quality=80)
Image.fromarray(dbg).crop((2300, 1100, 3500, 2000)).save(f"{dl}/dbg_quad.jpg", quality=85)
# elevation grid (cell means, metres) around the world, for lat/lon -> map placement
E = Image.open(f"{dl}/elev.png"); pal = E.getpalette(); e = np.asarray(E)
print("elev mode", E.mode, "hoover idx", e[-84+512, 437+160], "pal", pal[e[-84+512,437+160]*3:e[-84+512,437+160]*3+3] if pal else None)
c0, r0, c1, r1 = C0-2, R0-3, C0+NC+2, R0+NR+3
grid = e[r0+512:r1+512, c0+160:c1+160].astype(int).tolist()
json.dump({"C0": C0, "R0": R0, "NC": NC, "NR": NR, "tile": 512, "zmin": 6, "zmax": 10, "fx": 160, "fy": 512,
  "geo": {"lat0": 37.82, "lon0": -122.36, "stepLat": 0.0009, "stepLon": 0.00227865, "mPerRow": 115.5},
  "elev": {"c0": c0, "r0": r0, "w": c1-c0, "h": r1-r0, "idx": grid}}, open(f"{outdir}/meta.json", "w"), separators=(",", ":"))
