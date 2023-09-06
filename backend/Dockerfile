# Use an Alpine-based Python image
FROM python:3.8-alpine

# Installing dependencies for Selenium, headless Chrome, and other utilities
RUN apk update && apk add --no-cache \
    curl \
    unzip \
    wget \
    xvfb \
    chromium \
    chromium-chromedriver \
    libx11-dev \
    libxrender-dev \
    libxrandr-dev \
    mariadb-dev \
    # Additional packages for BLAS and build tools
    g++ \
    gcc \
    build-base \
    libstdc++ \
    openblas-dev \
    python3-dev\
    libffi-dev \
    openssl-dev
# Set environment variables for Chromium to run headlessly
ENV CHROME_BIN=/usr/bin/chromium-browser
ENV CHROME_PATH=/usr/lib/chromium/

# Set up the working environment
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 5000
CMD ["flask", "run", "--host=0.0.0.0"]
