---
title: Crop a PDF for iPad Mini
author: haruair
uuid: "7ecd3521-af3b-4813-af79-da185a005664"
type: page
date: "2026-04-25T05:30:33"
lang: en
url: /script/crop-a-pdf-for-ipad-mini
---

```py
import fitz  # PyMuPDF
import sys

input_path = sys.argv[1]
output_path = sys.argv[2]

TARGET_RATIO = 1488 / 2266  # ≈ 0.6569 (portrait iPad Mini 7)

doc = fitz.open(input_path)
for page in doc:
    rect = page.rect
    height = rect.height
    target_width = height * TARGET_RATIO
    crop_left = (rect.width - target_width) / 2
    new_rect = fitz.Rect(crop_left, 0, crop_left + target_width, height)
    page.set_cropbox(new_rect)

doc.save(output_path)
```
