FROM python:3.13-slim
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

WORKDIR /app

COPY . .

RUN uv sync --frozen --no-cache

EXPOSE 8080
CMD ["/app/.venv/bin/fastapi", "run", "main.py", "--port", "8080", "--host", "0.0.0.0"]
