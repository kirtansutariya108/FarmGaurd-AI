# Multi-stage Python Container for FarmGuard AI Backend
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies for Pillow and database drivers
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend application code
COPY . .

# Create uploads and models directory
RUN mkdir -p uploads models

ENV PORT=8000
ENV HOST=0.0.0.0
ENV APP_ENV=production
ENV DEMO_MODE=true

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
