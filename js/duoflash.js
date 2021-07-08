

Array.prototype.sample = function(){
    return this[Math.floor(Math.random()*this.length)];
}

var DUOFLASH_USERNAME = 'DUOFLASH_USERNAME'

window.flip_language = false

window.is_mobile_or_tablet = function() {
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

$(document).ready(function(){
    $('#username').keypress(function (e) {
        if (e.which == 13) {
            var username = $('#username').val();
            init_user(username)
            return false;
        }
    });

    var existing_username = localStorage.getItem(DUOFLASH_USERNAME);
    if(existing_username != ''){
        $('#username').val(existing_username);
        init_user(existing_username)
    }

    $('#flip-language').change(function(){
        if($('#flip-language').is(':checked')){
            window.flip_language = true
        }else{
            window.flip_language = false
        }
        next_word(refresh_word=false)
    })
});



var init_user = function(username){

    localStorage.setItem(DUOFLASH_USERNAME, username);
    
    console.log('Initializing user:' + username)

    url = 'https://serene-atoll-60587.herokuapp.com?t=users&q=' + username
    console.log(url)
    $.getJSON(url, function(data) {
        console.log('fetching user data')
        window.data = data

        var d = data.language_data
        var learned_words = {}
        var unlearned_words = {}

        var language_keys = Object.keys(d);
        window.lang_data = [];
        for(var i = 0; i < language_keys.length; i++){
            var ld = d[language_keys[i]]

            var lang = ld.language_string
            console.log('Processing: ' + lang)
            //var lang_id_ui = ld.tracking_properties.ui_language 
            var lang_id_ui = 'en'//fix this
            var lang_id = ld.skills[0].language

            var learned_words = []
            var unlearned_words = []
            

            for(var j = 0; j < ld.skills.length; j++){
            if(ld.skills[j].learned){
                learned_words = learned_words.concat(ld.skills[j].words)
            }else{
                unlearned_words = unlearned_words.concat(ld.skills[j].words)
            }
            }
            // Remove words that contain numbers
            unlearned_words = unlearned_words.filter(function(a){return !/\d/.test(a)})
            learned_words = learned_words.filter(function(a){return !/\d/.test(a)})

            // Skip language if no learned words
            if(learned_words.length == 0) continue;

            lang_data.push({
            'lang': lang,
            'lang_id_ui': lang_id_ui,
            'lang_id': lang_id,
            'learned_words' : learned_words,
            'unlearned_words': unlearned_words
            })
        }

        if(lang_data.length == 0){
            alert('No language data/learned words found')
            $('#username').val('')
            localStorage.setItem(DUOFLASH_USERNAME, '');
            return;
        }

        next_word();
        $('#flip-container').slideDown();
        $('#username').blur();


        document.addEventListener('dblclick', function(){
            console.log('DBLclick')
        }); 

        if(is_mobile_or_tablet()){
            console.log('-- Running on mobile or tablet --')
            $( "#flip-container" ).on("swiperight", function(event) {
                //console.log("It's a swipe!");
                next_word();
            });

            $('#help-text-events').text('tap on the card to reveal translation, tap outside the card to flip back, swipe right for the next word')
            $('.flip > .front,.flip > .back').css('transition-duration', '0s')
        }else{
            console.log('-- Running on browser --')
            var listener = new window.keypress.Listener();
            listener.simple_combo("space", function() {
                next_word();
            });
        }




    }).fail(function(e) {
        alert('Could not fetch data for this username. Please make sure username is correct.')
        console.log( "error" );
    });

}

// $.getJSON('https://serene-atoll-60587.herokuapp.com?q=wagihoma', function(data) {
//     console.log(data)
//     window.data = data
// })



var next_word = function(refresh_word=true){
    console.log('next word')

    if(refresh_word){
        var w = lang_data[0].learned_words
        if(w.length == 0){
            alert('Error: No learned words found, aborting!')
            return;
        }
        window.word = w.sample();
    }
    var lang_id_ui = lang_data[0].lang_id_ui
    var lang_id = lang_data[0].lang_id

    if(flip_language){
        $('#translate-to').html(word)
    }else{
        $('#translate-from').html(word)
    }

    //var url = `https://duolingo-lexicon-prod.duolingo.com/api/1/search?exactness=1&languageId=${lang_id}&query=${word}&uiLanguageId=${lang_id_ui}?callback=?`
    var url = `https://serene-atoll-60587.herokuapp.com?t=translate&from_lang=${lang_id}&query=${word}&to_lang=${lang_id_ui}`
    url = encodeURI(url)

    console.log(url)
    $.getJSON(url, function(data){
        window.d = data;
        if(d.results.length == 0){
            console.log('skipping word, no translation found for: ' + word)
            next_word(refresh_word=true)
            return false;
        }

        exact_translations = []
        non_exact_translations = []

        for(i = 0; i<d.results.length; i ++){
            val = d.results[i]
            t = val.translations[lang_id_ui]
            if(val.exactMatch){
                exact_translations = exact_translations.concat(t)
            }else{
                non_exact_translations = non_exact_translations.concat(t)
            }
        }

        translations = exact_translations
        if(exact_translations.length == 0){
            //translations = non_exact_translations
            next_word(refresh_word=true)
            console.log('skipping non-exact translations since they are not always right')
            return false;
        }

        // var translations = $.map( d.results, function( val ) {
        //     // Keep exact matches only
        //     if(!val.exactMatch) return(null)
        //     return val.translations[lang_id_ui]
        // });

        //translations = [translations[0]]
        if(flip_language){
            $('#translate-from').html(translations.join('<br>'))
        }else{
            $('#translate-to').html(translations.join('<br>'))
        }


    });
}
