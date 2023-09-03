# Use an existing Python mirror as a base
FROM python:3.8

# Set the working directory
WORKDIR /app

# Copy the dependency files into the container
COPY requirements.txt .

# Install the dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the source code to the working directory
COPY . .

# Make the port available to the outside world
EXPOSE 5000

# Run the command
CMD ["flask", "run", "--host=0.0.0.0"]