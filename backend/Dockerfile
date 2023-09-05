# Use a Python image with Selenium dependencies
FROM python:3.8-slim-buster

# Set environment variables for non-interactive frontend
ENV DEBIAN_FRONTEND=noninteractive

# Change the Debian sources
RUN echo "deb http://ftp.us.debian.org/debian buster main" > /etc/apt/sources.list && \
    echo "deb http://ftp.us.debian.org/debian-security buster/updates main" >> /etc/apt/sources.list

# Install necessary packages for Selenium, headless Chrome, and mysqlclient
RUN apt-get update && apt-get install -y --fix-missing --no-install-recommends \
    curl unzip wget \
    libxi6 libgconf-2-4 \
    xvfb \
    libmariadb-dev \
    libmariadbclient-dev && \
    rm -rf /var/lib/apt/lists/*

# Install Chrome
RUN wget -N https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb -P ~/ && \
    dpkg -i ~/google-chrome-stable_current_amd64.deb || apt-get -fy install && \
    rm ~/google-chrome-stable_current_amd64.deb

# Set up ChromeDriver environment variables
ENV CHROMEDRIVER_VERSION 89.0.4389.23
ENV CHROMEDRIVER_DIR /chromedriver
RUN mkdir -p $CHROMEDRIVER_DIR

# Download and install ChromeDriver
RUN wget -N https://chromedriver.storage.googleapis.com/$CHROMEDRIVER_VERSION/chromedriver_linux64.zip -P ~/
RUN unzip -o ~/chromedriver_linux64.zip -d ~/ && rm ~/chromedriver_linux64.zip
RUN mv ~/chromedriver $CHROMEDRIVER_DIR
ENV PATH $CHROMEDRIVER_DIR:$PATH

# Set up the working environment
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 5000
CMD ["flask", "run", "--host=0.0.0.0"]
