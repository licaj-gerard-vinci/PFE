# Step 1: Use the official Python image to build the backend
FROM python:3.10-slim

# Step 2: Install system dependencies
RUN apt-get update && apt-get install -y gcc libpq-dev

# Step 3: Set the working directory in the container
WORKDIR /app

# Step 4: Copy the dependencies file to the working directory
COPY requirements.txt .

# Step 5: Install dependencies
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Step 6: Copy the project files into the working directory
COPY . .

# Step 7: Expose the default Django port
EXPOSE 8000

# Step 8: Run the Django application
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
