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
    r_type = request.GET.get('t', '')

    if r_type == 'translate':
        query = request.GET.get('query', '')
        to_lang = request.GET.get('to_lang', '')
        from_lang = request.GET.get('from_lang', '')

        url = "https://duolingo-lexicon-prod.duolingo.com/api/1/search?exactness=1&languageId=%s&uiLanguageId=%s&query=%s" % (from_lang, to_lang, query)
        logger.info('url translate:'+url)
        # Fetch data
        d = requests.get(url)
        return HttpResponse(d.text, content_type='application/json')

    if r_type == 'users':
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
    
    return HttpResponse("hello duo")

