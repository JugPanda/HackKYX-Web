#!/usr/bin/env python3
"""
Create a lightweight PDF version of docs/tech-stack.md without external deps.
"""

from __future__ import annotations

import textwrap
from pathlib import Path

PAGE_WIDTH = 612
PAGE_HEIGHT = 792
LEFT_MARGIN = 72
RIGHT_MARGIN = 72
TOP_Y = PAGE_HEIGHT - 42
BOTTOM_Y = 72
LINE_HEIGHT = 16
FONT_SIZE = 12
CONTENT_WIDTH = PAGE_WIDTH - LEFT_MARGIN - RIGHT_MARGIN
WRAP_WIDTH = 90


def normalize_lines(md_text: str) -> list[str]:
    lines: list[str] = []
    for raw_line in md_text.splitlines():
        line = raw_line.rstrip()
        if not line:
            lines.append("")
            continue
        if line.startswith("# "):
            lines.append(line[2:].upper())
            lines.append("")
            continue
        if line.startswith("## "):
            lines.append(line[3:].upper())
            lines.append("")
            continue
        if line.startswith("- "):
            line = "• " + line[2:]
        wrapped = textwrap.wrap(line, width=WRAP_WIDTH) or [line]
        lines.extend(wrapped)
    return lines


def paginate(lines: list[str]) -> list[list[tuple[float, float, str]]]:
    pages: list[list[tuple[float, float, str]]] = []
    current_page: list[tuple[float, float, str]] = []
    y = TOP_Y

    def push_page():
        nonlocal current_page, y
        if current_page:
            pages.append(current_page)
        current_page = []
        y = TOP_Y

    for line in lines:
        if line == "":
            y -= LINE_HEIGHT
            if y <= BOTTOM_Y:
                push_page()
            continue
        if y <= BOTTOM_Y:
            push_page()
        current_page.append((LEFT_MARGIN, y, line))
        y -= LINE_HEIGHT

    if current_page:
        pages.append(current_page)
    if not pages:
        pages.append([])
    return pages


def escape_pdf_text(text: str) -> str:
    return (
        text.replace("\\", "\\\\")
        .replace("(", "\\(")
        .replace(")", "\\)")
    )


def build_pdf_objects(pages: list[list[tuple[float, float, str]]]) -> list[str]:
    objects: list[str] = []

    def add_object(body: str | None = None) -> int:
        objects.append(body or "")
        return len(objects)

    font_obj = add_object("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>")
    page_entries: list[tuple[int, int]] = []

    for page in pages:
        stream_lines = ["BT", f"/F1 {FONT_SIZE} Tf"]
        for x, y, text in page:
            stream_lines.append(
                f"1 0 0 1 {x:.2f} {y:.2f} Tm ({escape_pdf_text(text)}) Tj"
            )
        stream_lines.append("ET")
        stream_lines.append("")
        stream_data = "\n".join(stream_lines)
        stream_bytes = stream_data.encode("utf-8")
        content_obj = add_object(
            f"<< /Length {len(stream_bytes)} >>\nstream\n{stream_data}\nendstream"
        )
        page_obj = add_object()  # placeholder, will fill after pages_obj exists
        page_entries.append((page_obj, content_obj))

    pages_obj = add_object()
    catalog_obj = add_object()

    for page_obj, content_obj in page_entries:
        objects[page_obj - 1] = (
            "<< /Type /Page "
            f"/Parent {pages_obj} 0 R "
            f"/MediaBox [0 0 {PAGE_WIDTH} {PAGE_HEIGHT}] "
            "/Resources << /Font << /F1 {font} 0 R >> >> "
            f"/Contents {content_obj} 0 R >>"
        ).format(font=font_obj)

    kids = " ".join(f"{page_obj} 0 R" for page_obj, _ in page_entries)
    objects[pages_obj - 1] = f"<< /Type /Pages /Kids [{kids}] /Count {len(page_entries)} >>"
    objects[catalog_obj - 1] = f"<< /Type /Catalog /Pages {pages_obj} 0 R >>"

    return objects


def write_pdf(objects: list[str], output_path: Path) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    parts = ["%PDF-1.4\n"]
    offsets = [0]
    current_offset = len(parts[0].encode("utf-8"))

    for idx, body in enumerate(objects, start=1):
        obj_str = f"{idx} 0 obj\n{body}\nendobj\n"
        parts.append(obj_str)
        offsets.append(current_offset)
        current_offset += len(obj_str.encode("utf-8"))

    xref_start = current_offset
    xref_lines = [f"xref\n0 {len(objects) + 1}\n", "0000000000 65535 f \n"]
    for offset in offsets[1:]:
        xref_lines.append(f"{offset:010d} 00000 n \n")
    xref_str = "".join(xref_lines)
    parts.append(xref_str)
    trailer = (
        f"trailer\n<< /Size {len(objects) + 1} /Root {len(objects)} 0 R >>\nstartxref\n"
        f"{xref_start}\n%%EOF\n"
    )
    parts.append(trailer)
    output_path.write_bytes("".join(parts).encode("utf-8"))


def main() -> None:
    md_path = Path("docs/tech-stack.md")
    pdf_path = Path("docs/tech-stack.pdf")
    md_text = md_path.read_text(encoding="utf-8")
    lines = normalize_lines(md_text)
    pages = paginate(lines)
    objects = build_pdf_objects(pages)
    write_pdf(objects, pdf_path)
    print(f"Wrote {pdf_path}")


if __name__ == "__main__":
    main()
