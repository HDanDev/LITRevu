# LITRevu

Welcome to LITRevu, a django web application that allows you to request or publish reviews of books or articles and search for interesting books and articles to read based on reviews from other users.

## Features

- **Publish Reviews**: Publish reviews of books or articles.
- **Request Reviews**: Request reviews for a specific book or article.
- **Search Content**: Search for interesting books and articles to read based on reviews from other users.

## Prerequisites

- Python 3.x
- [pip](https://pip.pypa.io/en/stable/)
- [virtualenv](https://virtualenv.pypa.io/en/stable/)
- [MailHog](https://github.com/mailhog/MailHog) (for email handling)

## Installation

1. **Clone the GitHub repository**

   ```sh
   git clone https://github.com/HDanDev/LITRevu.git
   cd LITRevu
   
2. **Create a virtual environment**
    Create a virtual environment

  ```sh
  python -m venv venv

3. **Activate the virtual environment**

On Windows:
  ```sh
  venv\Scripts\activate

On macOS/Linux:
  ```sh
  source venv/bin/activate

4. **Install dependencies**

  ```sh
  pip install -r requirements.txt

5. **Set up the database**

Apply the migrations to set up the SQLite database.

  ```sh
  python manage.py migrate

6. **Set up MailHog**

  Ensure MailHog is installed and running to capture emails sent by the application.

  [Install MailHog](https://github.com/mailhog/MailHog#installation)
  Start MailHog:
  Start Mailhog server using your favored CLI

  ```sh
  MailHog_windows_386.exe

Access your Mailhog local server: 
  [Local Mailhog server](http://localhost:8025/)

## Usage

    Run the development server

  ```sh
  py manage.py runserver

Access the application

Open your browser and go to: http://localhost:8000
