from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class KnowledgeChunk:
    source_file: str
    source_type: str
    section: str
    content: str


def chunk_markdown_file(path: Path, root: Path, max_words: int = 220) -> list[KnowledgeChunk]:
    text = path.read_text(encoding="utf-8").strip()
    source_file = path.relative_to(root).as_posix()
    source_type = source_file.split("/", maxsplit=1)[0].removesuffix(".md")
    sections: list[tuple[str, list[str]]] = []
    current_title = path.stem.replace("-", " ").title()
    current_lines: list[str] = []

    for line in text.splitlines():
      if line.startswith("#"):
          if current_lines:
              sections.append((current_title, current_lines))
              current_lines = []
          current_title = line.lstrip("#").strip() or current_title
      else:
          current_lines.append(line)

    if current_lines:
        sections.append((current_title, current_lines))

    chunks: list[KnowledgeChunk] = []
    for title, lines in sections:
        words = "\n".join(lines).strip().split()
        for start in range(0, len(words), max_words):
            content = " ".join(words[start : start + max_words]).strip()
            if content:
                chunks.append(
                    KnowledgeChunk(
                        source_file=source_file,
                        source_type=source_type,
                        section=title,
                        content=content,
                    )
                )

    return chunks


def load_knowledge_chunks(root: Path) -> list[KnowledgeChunk]:
    return [
        chunk
        for path in sorted(root.rglob("*.md"))
        for chunk in chunk_markdown_file(path=path, root=root)
    ]
