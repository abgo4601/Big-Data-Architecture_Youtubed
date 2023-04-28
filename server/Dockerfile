FROM python:3.8
RUN mkdir /backend
WORKDIR /backend
COPY requirements.txt /backend/requirements.txt
RUN pip install --upgrade pip
RUN pip install -r requirements.txt
COPY . .
# Expose port for backend
EXPOSE 5000
CMD ["flask", "run", "--host=0.0.0.0"]