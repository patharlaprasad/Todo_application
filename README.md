# Personal To-Do List Web Application

A simple, dynamic, and persistent To-Do List web application built with a Python Flask backend and a vanilla JavaScript frontend. This project allows users to manage their daily tasks through a clean, modern web interface without requiring page reloads for any action.

This application is designed as an excellent starter project for understanding the fundamentals of full-stack web development, including building a RESTful API, manipulating the DOM, and handling data persistence with local files.

## Features

-   **Add Tasks**: Easily add new tasks with a title, description, and category.
-   **View All Tasks**: See a complete list of all your current tasks.
-   **Mark as Complete/Undo**: Toggle the completion status of a task with a single click. Completed tasks are visually distinguished.
-   **Delete Tasks**: Remove tasks you no longer need.
-   **Dynamic UI**: The user interface is updated in real-time using JavaScript. Adding, completing, or deleting a task happens instantly without a page refresh.
-   **Data Persistence**: All tasks are saved to a local `tasks.json` file, so your data is safe even if you close the browser or stop the server.

## Technology Stack

-   **Backend**: Python, Flask
-   **Frontend**: HTML, CSS, JavaScript (Vanilla)
-   **Data Storage**: JSON

## Prerequisites

Before you begin, ensure you have the following installed on your system:
-   Python 3.7+
-   `pip` (Python package installer)
-   A modern web browser (like Chrome, Firefox, or Edge)

## Installation & Setup

Follow these steps to get the application running on your local machine.

**1. Clone the Repository**
   First, clone this repository to your local machine or download the source code as a ZIP file.
   ```bash
   git clone <your-repository-url>
   cd todo_app
   ```

**2. Create a Virtual Environment**
It is highly recommended to use a virtual environment to manage project dependencies.

  - **On macOS/Linux:**

    ```bash
    python3 -m venv venv
    source venv/bin/activate
    ```

  - **On Windows:**

    ```bash
    python -m venv venv
    .\venv\Scripts\activate
    ```

**3. Install Dependencies**
With your virtual environment activated, install the required Python package (Flask).

```bash
pip install Flask
```

**4. Run the Application**
Start the Flask backend server by running the `app.py` file.

```bash
python app.py
```

You should see output in your terminal indicating that the server is running, typically on `http://127.0.0.1:5000`.

**5. Access the Application**
Open your web browser and navigate to the following address:

```
[http://127.0.0.1:5000](http://127.0.0.1:5000)
```

## How to Use

  - **Adding a Task**: Fill in the "Task Title", "Description", and "Category" fields in the form at the top of the page and click the "Add Task" button. Your new task will instantly appear in the "Your Tasks" list.
  - **Completing a Task**: Click the green "Complete" button on any task. The task will be marked with a strikethrough, and the button will change to "Undo", allowing you to reverse the action.
  - **Deleting a Task**: Click the red "Delete" button on any task. A confirmation prompt will appear. If you confirm, the task will be permanently removed from your list.

## Project Structure

The project is organized into the following file structure:

```
/todo_app
├── app.py          # Main Flask application and API logic
├── tasks.json      # Database file for storing tasks (auto-generated)
├── static/
│   ├── script.js   # Frontend JavaScript for dynamic interaction and API calls
│   └── style.css   # CSS for styling the application
└── templates/
    └── index.html  # Main HTML page structure
```

## API Endpoints

The Flask backend provides a simple RESTful API to manage tasks.

| Method | Endpoint                             | Description                                  |
|--------|--------------------------------------|----------------------------------------------|
| `GET`  | `/api/tasks`                         | Retrieves a list of all tasks.               |
| `POST` | `/api/tasks`                         | Adds a new task to the list.                 |
| `PUT`  | `/api/tasks/<int:task_id>/complete`  | Toggles the completion status of a task.     |
| `DELETE`| `/api/tasks/<int:task_id>`          | Deletes a specific task by its ID.           |
