FROM python:3.13-slim
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

WORKDIR /app

COPY . .

# Copy design assets to static directory (they're copied with . but we organize them)
RUN mkdir -p static/design && cp -r design-assets/* static/design/

RUN uv sync --frozen --no-cache
ENV PATH="/app/.venv/bin:$PATH"

EXPOSE 8080
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
