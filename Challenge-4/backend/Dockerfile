FROM python:3.13-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    python3-dev \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . .

# Expose port
EXPOSE 8000

# Set Python path
ENV PYTHONPATH=/app

# The actual command will be provided by docker-compose.yml
CMD ["daphne", "-b", "0.0.0.0", "-p", "8000", "backend.asgi:application"]