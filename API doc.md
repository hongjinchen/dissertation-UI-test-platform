# Installation and Running Guide

## Running the project without docker

### 1. Install Node.js and npm

#### 1.1 For Windows and macOS

1. Visit the [official Node.js website](https://nodejs.org/).

2. Download the latest stable version of Node.js suitable for your operating system.

3. Execute the downloaded installer and follow the installation guide.

4. After the installation, open the command prompt or terminal and input the following commands to verify the installation:

   ```
   bashCopy codenode -v
   npm -v
   ```

#### 1.2 For Linux (Debian and Ubuntu as examples)

```
bashCopy codesudo apt update
sudo apt install nodejs npm
```

Verify the installation:

```
bashCopy codenode -v
npm -v
```

### 2. Install Python and pip

#### 2.1 For Windows

1. Visit the [official Python website](https://www.python.org/downloads/).

2. Download the latest stable version of Python suitable for your OS.

3. Run the downloaded installer. Ensure you select the option "Add Python to PATH" or a similar option during the installation process.

4. After the installation, open the command prompt and verify with:

   ```
   bashCopy codepython --version
   pip --version
   ```

#### 2.2 For macOS

macOS typically comes preinstalled with Python, but it might be Python 2. To install Python 3 and pip, it's recommended to use Homebrew:

```
bashCopy code
brew install python3
```

Verify the installation:

```
bashCopy codepython3 --version
pip3 --version
```

#### 2.3 For Linux (Debian and Ubuntu as examples)

```
bashCopy codesudo apt update
sudo apt install python3 python3-pip
```

Verify the installation:

```
bashCopy codepython3 --version
pip3 --version
```

### 3. Run React Project

Navigate to the project directory and start it:

```
bashCopy codecd ui-test
npm run start
```

### 4. Run Flask Project

#### 4.1 Install dependencies

Before running the Flask project, make sure to install all required packages listed in `requirements.txt`.

Navigate to the backend directory:

```
bashCopy code
cd backend
```

Install the dependencies:

```
bashCopy code
pip install -r requirements.txt
```

#### 4.2 Run the Flask application

Now, run the Python script:

```
bashCopy code
python run.py
```



## Running the project with docker

### 