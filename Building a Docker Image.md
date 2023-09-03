## Building a Docker Image

From the root directory of your project, execute the following command to build a Docker image:

```
docker build -t UI_test .
```

This will construct a Docker image named `UI_test` based on your `Dockerfile`.

### Running the Docker Container

To run your application, use the command below:

```
docker run -p 3000:3000 UI_test
```

This initiates a new Docker container instance based on the `UI_test` image. The `-p 3000:3000` flag maps the container's port 3000 to port 3000 on the host machine.

### Accessing the Application

Visit [http://localhost:3000](http://localhost:3000/) in your browser, and you should see your application running.