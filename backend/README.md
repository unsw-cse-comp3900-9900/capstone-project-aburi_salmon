# Backend

## Setting up virtual environment

Note: Make sure that you're under `backend` directory. Minimum Python version (check with `python3 --version`): 3.6.5

```bash
# create a sandbox for the backend. You might use different path for your python3 executable 
virtualenv -p /usr/bin/python3 env

# enter sandbox
source env/bin/activate

# set up sandbox
python3 -m pip install -r requirements.txt
```

## Entering the virtual environment and running code

Note: If you're already under env (having `(env)` on your console), you can skip the first command

```bash
source env/bin/activate

# Inside virtual environment
python3 server.py
```


## Adding modules and storing it inside requirements.txt
```sh
# Inside virtual environment
pip install <package_name>

# Example:
# pip install flask

# Storing inside requirements.txt
pip freeze | grep -v 'pkg-resources' > requirements.txt
```
