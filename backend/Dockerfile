# Use a Python image with Selenium dependencies
FROM python:3.8-slim-buster

# Install necessary packages for Selenium and headless Chrome
RUN apt-get update && apt-get install -y \
    curl unzip wget \
    libxi6 libgconf-2-4 \
    xvfb \
    && rm -rf /var/lib/apt/lists/*

# Install Chrome
RUN wget -N https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb -P ~/
RUN dpkg -i ~/google-chrome-stable_current_amd64.deb; apt-get -fy install

# Set up ChromeDriver environment variables
ENV CHROMEDRIVER_VERSION 89.0.4389.23
ENV CHROMEDRIVER_DIR /chromedriver
RUN mkdir $CHROMEDRIVER_DIR

# Install ChromeDriver
RUN wget -N https://chromedriver.storage.googleapis.com/$CHROMEDRIVER_VERSION/chromedriver_linux64.zip -P ~/
RUN unzip ~/chromedriver_linux64.zip && rm ~/chromedriver_linux64.zip
RUN mv -f ~/chromedriver $CHROMEDRIVER_DIR
ENV PATH $CHROMEDRIVER_DIR:$PATH

# Set up the working environment
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 5000
CMD ["flask", "run", "--host=0.0.0.0"]