---
name: commit
description: Propone (y, si el usuario lo confirma, crea) un commit con formato Conventional Commits a partir del diff actual. Usar cuando se pida commitear, preparar un commit o redactar el mensaje.
disable-model-invocation: true
---

# Commit

Solo se ejecuta cuando Patricio lo pide (`/commit`). Nunca hagas `git push`.

1. Mirá el estado: `git status`, `git diff` y `git diff --staged`.
2. Comprobá que no se cuele nada que no corresponde: `dist/`, `.env`,
   `docs/privado/`, archivos temporales. Si hay términos sensibles, corré el
   `git grep` del skill `/verificar`.
3. Si el diff mezcla temas distintos, proponé dividirlo en varios commits.
4. Redactá el mensaje:
   - Tipo: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `style`,
     `perf` o `ci`.
   - Asunto en español, imperativo o descriptivo en minúscula, ≤ 72
     caracteres, sin punto final (ver `git log --oneline -10` para el estilo).
   - Cuerpo opcional: el **porqué**, no el qué.
5. Mostrá el mensaje y la lista de archivos. Con la confirmación, `git add`
   de esos archivos (por nombre, no `git add -A`) y `git commit`.
