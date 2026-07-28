<!-- CODEGRAPH_START -->
## CodeGraph

This repo has CodeGraph indexed at `app/.codegraph/` (not at the `GUS/` repo root, but inside the `app/` folder). When you need to understand or locate code within `app/`, reach for it BEFORE grep/find or reading files manually:

- **MCP tool** (when available): `codegraph_explore` answers most code questions in one call — the relevant symbols' verbatim source plus the call paths between them, including dynamic-dispatch hops grep can't follow. Name a file or symbol in the query to read its current line-numbered source. If it's listed but deferred, load it by name via tool search.
- **Shell** (always works): `codegraph explore "<symbol names or question>"` — run this from `app/` or with paths relative to `app/`.

If `app/.codegraph/` doesn't exist, skip CodeGraph entirely — indexing is the user's decision.
<!-- CODEGRAPH_END -->