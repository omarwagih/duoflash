from django.shortcuts import render
from django.http import HttpResponse
import requests
import logging
import logging
logger = logging.getLogger('mylogger')

logging.basicConfig(
    level = logging.DEBUG,
    format = '%(name)s %(levelname)s %(message)s',
)

# Create your views here.
def index(request):
    logger = logging.getLogger(__name__)
    username = request.GET.get('q', '')
    logger.info('fetching data for username='+username)
    if not username:
        logger.info('could not find username')
        return HttpResponse("{}", content_type='application/json')

    # Start session and login
    s = requests.Session()
    r = s.post('https://www.duolingo.com/login', data = {'login':'helloworldbye@gmail.com', 'password': 'helloworldbye'})

    # Fetch data
    d = s.get('https://www.duolingo.com/users/' + username)
    return HttpResponse(d.text, content_type='application/json')
