

Array.prototype.sample = function(){
    return this[Math.floor(Math.random()*this.length)];
}


window.flip_language = false

$(document).ready(function(){
    $('#username').keypress(function (e) {
        if (e.which == 13) {
            init_user($('#username').val())
            return false;
        }
      });

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
    console.log('Initializing user:' + username)
    if(!username){
        alert('Username cannot be blank!')
        return;
    }

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

            lang_data.push({
            'lang': lang,
            'lang_id_ui': lang_id_ui,
            'lang_id': lang_id,
            'learned_words' : learned_words,
            'unlearned_words': unlearned_words
            })
        }
        next_word();
        $('#flip-container').slideDown();
        $('#username').blur();

        var listener = new window.keypress.Listener();
        listener.simple_combo("space", function() {
            next_word();
        });



    }).fail(function() {
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
    
    console.log(url)
    $.getJSON(url, function(data){
        window.d = data;
        if(d.results.length == 0){
            console.log('skipping word, no translation found for: ' + word)
            next_word(refresh_word=true)
        }

        var translations = $.map( d.results, function( val ) {
        // Keep exact matches only
        if(!val.exactMatch) return(null)
        return val.translations[lang_id_ui]
        });
        if(flip_language){
            $('#translate-from').html(translations.join('<br>'))
        }else{
            $('#translate-to').html(translations.join('<br>'))
        }


    });
}
