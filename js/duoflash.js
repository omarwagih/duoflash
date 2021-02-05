

Array.prototype.sample = function(){
    return this[Math.floor(Math.random()*this.length)];
}


$(document).ready(function(){
    $('#username').keypress(function (e) {
        if (e.which == 13) {
            init_user($('#username').val())
            return false;
        }
      });
});

var init_user = function(username){
    console.log('Initializing user:' + username)
    if(!username){
        alert('Username cannot be blank!')
        return;
    }

    $.getJSON('https://serene-atoll-60587.herokuapp.com?q=' + username, function(data) {
        console.log('fetching user data')
        window.data = data

        if(!data.language_data){
            alert('Username not found!')
            return;
        }

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



    });

}

// $.getJSON('https://serene-atoll-60587.herokuapp.com?q=wagihoma', function(data) {
//     console.log(data)
//     window.data = data
// })


    


var next_word = function(){
    console.log('next word')

    var w = lang_data[0].learned_words
    window.word = w.sample();
    var lang_id_ui = lang_data[0].lang_id_ui
    var lang_id = lang_data[0].lang_id

    $('#translate-from').html(word)

    var url = `https://duolingo-lexicon-prod.duolingo.com/api/1/search?exactness=1&languageId=${lang_id}&query=${word}&uiLanguageId=${lang_id_ui}`
    $.getJSON(url, function(data){
        window.d = data;
        var translations = $.map( d.results, function( val ) {
        // Keep exact matches only
        if(!val.exactMatch) return(null)
        return val.translations[lang_id_ui]
        });
        $('#translate-to').html(translations.join('<br>'))


    });
}