# Blog Lite V2

**Blog Lite V2** is a multi-user blogging platform that allows users to create, edit, and manage blog posts, follow other users, and receive personalized feeds. The project was developed as part of the **Modern Application Development - II** course, utilizing Flask for backend APIs, Vue.js for frontend, and Redis with Celery for task scheduling and caching.

## Features

- **User Authentication**
  - User sign-up and login using Flask Security and token-based authentication.
  
- **User Profile**
  - View basic profile information, including the number of blogs created, followers, and following.
  
- **Blog Management**
  - Create, edit, and delete blog posts with support for images and multi-language content.
  - Export blogs as CSV.
  
- **Follow/Unfollow**
  - Ability to search for and follow/unfollow other users.
  
- **Personalized Feed**
  - A user’s feed displays posts from the users they follow, ordered by timestamp.

- **Scheduled Jobs**
  - **Daily Reminder Job**: Sends reminders to users via Google Chat or email if they haven't posted or visited the app.
  - **Monthly Engagement Report**: Generates and emails an HTML report of user activity at the beginning of each month.

- **Caching and Performance**
  - Redis caching is integrated to optimize performance.
  - Cache expiry for relevant data and enhanced API performance.

## Technology Stack

- **Backend**: Flask
- **Frontend**: Vue.js (with optional Vue CLI)
- **Database**: SQLite
- **Caching**: Redis
- **Task Queue**: Celery
- **Other Libraries**: Bootstrap (for UI), Jinja2 (for templating), Flask-Security, Flask-Mail

## Installation and Setup

### Prerequisites

- Python 3.x
- Node.js (for Vue.js)
- Redis (for caching and background tasks)
- SQLite (for database)
- WSL or Linux-based environment (Windows users can use WSL)

### Clone the repository

```bash
git clone https://github.com/yourusername/blog-lite-v2.git
cd blog-lite-v2
