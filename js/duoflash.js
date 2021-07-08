

Array.prototype.sample = function(){
    return this[Math.floor(Math.random()*this.length)];
}

var DUOFLASH_USERNAME = 'DUOFLASH_USERNAME'

window.flip_language = false


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

        var listener = new window.keypress.Listener();
        listener.simple_combo("space", function() {
            next_word();
        });



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
