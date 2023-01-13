FROM python:3.9.1

# Copy the source code to application home directory 
ADD . /usr/src/app/

# Set the working directory 
WORKDIR /usr/src/app/

# Install python dependencies 
RUN pip install --trusted-host pypi.org --trusted-host pypi.python.org --trusted-host=files.pythonhosted.org --no-cache-dir -r /usr/src/app/requirements.txt

CMD ["python","-u","/usr/src/app/server.py"]