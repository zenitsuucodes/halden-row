import cv2, numpy as np, sys
src, dst = sys.argv[1], sys.argv[2]
img = cv2.imread(src)
g = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
g = cv2.bilateralFilter(g, 9, 60, 60)
# pencil: dodge blend
inv = 255 - g
blur = cv2.GaussianBlur(inv, (0, 0), 12)
pencil = cv2.divide(g, 255 - blur, scale=256)
pencil = np.clip((pencil.astype(np.float32) - 120) * 1.6 + 120, 0, 255)
# crisp architectural edges
e = cv2.Canny(cv2.GaussianBlur(g, (5, 5), 0), 40, 110)
e = cv2.dilate(e, np.ones((2, 2), np.uint8))
lines = np.minimum(pencil, 255 - e.astype(np.float32) * 0.85)
# light hatch tone from shadows
tone = cv2.GaussianBlur(g, (0, 0), 3).astype(np.float32)
lines = np.minimum(lines, 175 + tone * 0.32)
t = lines / 255.0
paper = np.array([234, 241, 244], np.float32)  # BGR of #f4f1ea
ink = np.array([42, 40, 38], np.float32)
out = paper * t[..., None] + ink * (1 - t[..., None])
# faint grid
h, w = g.shape
for x in range(0, w, 60): out[:, x] = out[:, x] * 0.93 + np.array([200, 190, 170]) * 0.07
for y in range(0, h, 60): out[y, :] = out[y, :] * 0.93 + np.array([200, 190, 170]) * 0.07
cv2.imwrite(dst, out.astype(np.uint8), [cv2.IMWRITE_JPEG_QUALITY, 85])
