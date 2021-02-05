import requests

s = requests.Session()
r = s.post('https://www.duolingo.com/login', data = {'login':'helloworldbye@gmail.com', 'password': 'helloworldbye'})
d = s.get('https://www.duolingo.com/users/wagihoma')
