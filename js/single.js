jQuery(document).ready(function($) {
    var suraid = 1;
    ajaxLoad(suraid);
    loadChapters();

});

var fbLoaderEffect = `<div class="translation-loader text-left"><div class="lds-facebook"><div></div><div></div><div></div></div></div>`;

// LOAD AJAX AT FIRST
function ajaxLoad(id) {
    $.ajax({
        url: 'http://api.alquran.cloud/v1/surah/' + id,
        method: 'GET',
        type: 'JSON',
        success: function(response) {
            $('.quran-loader').hide(100);
            renderAyahs(response.data);

        },
        error: function(err) {
            console.log(err);
        }
    })
}

// LOAD CHAPTERS
function loadChapters() {
    $.ajax({
        url: 'http://api.alquran.cloud/v1/surah',
        method: 'GET',
        type: 'JSON',
        success: function(response) {
            response.data.map(function(surah) {
                var chapter = `
                        <tr>
                            <th scope="row">${surah.number}</th>
                            <td><a href="#" class="sura-name-ar text-primary" onclick="loadSura(${surah.number})" >${surah.name}</a></td>
                            <td>${surah.englishName}</td>
                            <td>${surah.englishNameTranslation}</td>
                        </tr>`;

                $('.chapters').append(chapter)
            });

        },
        error: function(err) {
            console.log('An Error Occured:  ' + err);
        }
    })

}

// RENDER AYAHAS
function renderAyahs(sura) {
    var output = `<div class="render-ayahas container text-center">
        <div class="row surah-single">
            <div class="col">
                <div class="jumbotron">
                    <h1 class="display-5 sura-name"><span class="badge badge-info">${sura.number}</span> ${sura.name}  ${sura.englishName} (${sura.englishNameTranslation})</h1>
                    <p class="sura-meta text-center">Total Ayahas: <b>${sura.numberOfAyahs}</b> | Revelation Type: <b>${sura.revelationType}</b></p>
                </div>
                <div class="btn-group btn-group-handler" role="group" aria-label="Translation Option">
                  <button type="button" class="btn btn-info btn-english btn-single-sura" suraid ="${sura.number}" translation="en.sahih">English</button>
                  <button type="button" class="btn btn-outline-danger btn-english-toggle d-none">Show/Hide English</button>
                  <button type="button" class="btn btn-primary btn-bangla btn-single-sura" suraid ="${sura.number}" translation="bn.bengali">Bangla</button>
                  <button type="button" class="btn btn-outline-info btn-bangla-toggle d-none">Show/Hide Bangla</button>
                  <button type="button" class="btn btn-success btn-recite btn-single-sura" suraid ="${sura.number}" translation="ar.alafasy">Recitation</button>
                  <button type="button" class="btn btn-outline-warning btn-recite-toggle d-none">Show/Hide Recitation</button>
                  <button type="button" class="btn btn-danger btn-transliteration btn-single-sura" suraid ="${sura.number}" translation="en.transliteration">Transliteration</button>
                  <button type="button" class="btn btn-outline-danger btn-transliteration-toggle d-none">Show/Hide Transliteration</button>
                </div>
                
                <p class="bismillah text-center bg-white mb-0 py-4 h1">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
                <ol class="list-group list-group-flush ayahs text-right">`;
    var suraNumber = sura.number;
    sura.ayahs.map(function(ayah, n) {
        output += `<li class="list-group-item bg-light"><bdo dir="rtl" class="py-3 d-block"><span class="ml-3 mb-2 sura-ayah badge badge-secondary">${suraNumber}:${ayah.numberInSurah}</span> ${n==0 ? replaceBismillah(ayah.text) : ayah.text}</bdo> </li>`;
    })

    output += `
                </ol>
            </div>
            </div>
        </div>`;
    $('.search-word').after(output);

    // hide bismillah
    if (sura.number == 1 || sura.number == 9) {
        $('.bismillah').hide();
    }

    // RENDER SURA TRANSLATION
    $('.btn-single-sura').on('click', function() {

        var thatSura = $(this),
            suraid = thatSura.attr('suraid'),
            translationEngBnReTr = thatSura.attr('translation');

        if ('en.transliteration' == translationEngBnReTr) {
            $("ol.ayahs > li > bdo").after(fbLoaderEffect);
        } {
            $("ol.ayahs > li").append(fbLoaderEffect)
        }

        $.ajax({
            method: 'GET',
            url: 'http://api.alquran.cloud/v1/surah/' + suraid + '/' + translationEngBnReTr,
            type: 'JSON',
            success: function(response) {

                var suraTranslatedText = '',
                    btnTranslation = '',
                    btnTranslationToggle = '';



                response.data.ayahs.map(function(ayah, i) {

                    i = i + 1;

                    if ('en.sahih' == translationEngBnReTr) {

                        suraTranslatedText = `<p class="text-english text-left translation">${ayah.text}</p>`;
                        btnTranslation = $('.btn-english');
                        btnTranslationToggle = $('.btn-english-toggle');
                        textTranslationToggle = $('.text-english');

                    } else if ('bn.bengali' == translationEngBnReTr) {

                        suraTranslatedText = `<p class="text-bangla text-left translation">${ayah.text}</p>`;
                        btnTranslation = $('.btn-bangla');
                        btnTranslationToggle = $('.btn-bangla-toggle');
                        textTranslationToggle = $('.text-bangla');

                    } else if ('en.transliteration' == translationEngBnReTr) {

                        suraTranslatedText = `<p class="text-transliteration text-left translation">${ayah.text}</p>`;
                        btnTranslation = $('.btn-transliteration');
                        btnTranslationToggle = $('.btn-transliteration-toggle');
                        textTranslationToggle = $('.text-transliteration');

                    } else {
                        suraTranslatedText = `
                        <div class="ayah-listen text-left">
                            <audio controls>
                                <source src="${ayah.audio}" type="audio/ogg">
                                <source src="${ayah.audio}" type="audio/mpeg">
                                Your browser does not support the audio element.
                            </audio>
                        </div>`;

                        btnTranslation = $('.btn-recite');
                        btnTranslationToggle = $('.btn-recite-toggle');
                        textTranslationToggle = $('.ayah-listen');
                    }

                    if ('en.transliteration' == translationEngBnReTr) {
                        $("ol.ayahs > li:nth-child(" + i + ") > bdo").after(suraTranslatedText);
                    } else {
                        $("ol.ayahs > li:nth-child(" + i + ")").append(suraTranslatedText)
                    }

                });

                btnTranslation.addClass('d-none');
                btnTranslationToggle.addClass('d-block').on('click', function() {
                    textTranslationToggle.toggleClass('d-none');
                });

                $('.translation-loader').remove();
            },
            error: function(err) {
                console.log(err);
            }
        });
    });

}

// RENDER SURA BY NAME
function loadSura(id) {
    $('.render-ayahas').hide(200);
    $('.chapter-modal').modal('hide');
    $('.quran-loader').show(100);
    ajaxLoad(id);
}

// REPLACE 
function replaceBismillah(txt) {
    var text = txt.replace('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ', '');
    return text;
}

// GENERATE QUERY FORM FIELD
$('.btn-query').on('click', function() {
    $.ajax({
        url: 'http://api.alquran.cloud/v1/surah',
        method: 'GET',
        type: 'JSON',
        success: function(response) {
            response.data.map(function(sura) {
                $('#suraNameSelect').append(`<option value="${sura.number}" ayahs="${sura.numberOfAyahs}">${sura.number}. ${sura.englishName}  (${sura.numberOfAyahs})</option>`);
            });
        },
        error: function(err) {
            console.log(err);
        }
    })
})



// RUN QUERY
$('#query-quran').on('submit', function(e) {
    e.preventDefault();
    var para = {};
    $(this).find('[name]').each(function(i, element) {
        var that = $(this),
            name = that.attr('name'),
            value = that.val();

        para[name] = value;
    });

    $('.btn-group-single-ayah').hide();

    // validation - make sure value does not exceds total ayah of the sura
    $(this).find('[ayahs]').each(function(i, value) {
        var that = $(this);
        i = i + 1;
        if (i == para.suraid) {
            var totalAayahInSura = that.attr('ayahs');
            if (para.ayahno > totalAayahInSura || para.ayahno === 0) {
                $("input[name='ayahno']").after(`
                        <div class="alert alert-danger w-100 mt-2" role="alert">
                            Value should be in range 1 to ${totalAayahInSura}
                            <button type="button" class="close text-danger" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>`);

            } else {
                showSingleAyah(para.suraid, para.ayahno);
            }
        }
    })

})


// SHOW SINGLE AYAH
function showSingleAyah(suraid, ayahno) {

    $('#query-modal').modal('hide');
    $('.btn-group-handler').hide(200);
    $('ol.ayahs > li').hide(200);
    $('.quran-loader').show();

    $.ajax({
        url: 'http://api.alquran.cloud/v1/ayah/' + suraid + ':' + ayahno,
        method: 'GET',
        type: 'JSON',
        success: function(response) {
            // show single ayah
            $('ol.ayahs').append(`<li class="list-group-item bg-light"><bdo dir="rtl" class="py-3 d-block"><span class="ml-3 mb-2 sura-ayah badge badge-secondary">${response.data.surah.number}:${response.data.numberInSurah}</span> ${replaceBismillah(response.data.text)}</bdo> </li>`);

            // show ayah related sura name
            $('.jumbotron .sura-name').html(`<span class="badge badge-info">${response.data.surah.number}</span> ${response.data.surah.name}  ${response.data.surah.englishName} (${response.data.surah.englishNameTranslation})`);

            $('.jumbotron .sura-meta').html(`Total Ayahas: <b>${response.data.surah.numberOfAyahs}</b> | Revelation Type: <b>${response.data.surah.revelationType}</b> | Juz: <b>${response.data.juz}</b> | Ruku: <b>${response.data.ruku}</b> | Sajda: <b>${response.data.sajda}</b>`);

            // hide loader
            $('.quran-loader').hide();

            // add new button group and buttons for single ayah
            $('.jumbotron').after(`<div class="btn-group-single-ayah"></div>`)
            $('.btn-group-single-ayah').append(`<button type="button" class="btn btn-outline-info btn-singl-ayah-eng" onclick="singleAyahEngBnReTr(${response.data.number}, 'en.sahih')">English</button>`);
            $('.btn-group-single-ayah').append(`<button type="button" class="btn btn-outline-success btn-singl-ayah-bn" onclick="singleAyahEngBnReTr(${response.data.number}, 'bn.bengali')">Bangla</button>`);
            $('.btn-group-single-ayah').append(`<button type="button" class="btn btn-outline-primary btn-singl-ayah-recite" onclick="singleAyahEngBnReTr(${response.data.number}, 'ar.alafasy')">Recitation</button>`)
            $('.btn-group-single-ayah').append(`<button type="button" class="btn btn-outline-danger btn-singl-ayah-transliteration" onclick="singleAyahEngBnReTr(${response.data.number}, 'en.transliteration')">Transliteration</button>`);
        },
        error: function(err) {
            console.log(err);
        }
    })
}

// RENDER SINGLE AYAH  TRANSLATION, TRANSLITERATION & AUDIO FILE
function singleAyahEngBnReTr(ayahno, engBnReTr) {

    var btnSelector = $('.btn-singl-ayah-recite');

    if ('en.transliteration' == engBnReTr) {
        $('.ayahs > li > bdo').after(fbLoaderEffect);
    } else {
        $('.ayahs > li').append(fbLoaderEffect);
    }

    $.ajax({
        url: 'http://api.alquran.cloud/v1/ayah/' + ayahno + '/' + engBnReTr,
        method: 'GET',
        type: 'JSON',
        success: function(response) {

            var appendText = `<p class="text-english text-left translation">${response.data.text}</p>`;
            if ('en.sahih' == engBnReTr) {
                appendText = `<p class="text-english text-left translation">${response.data.text}</p>`;
                btnSelector = $('.btn-singl-ayah-eng');
            } else if ('bn.bengali' == engBnReTr) {
                appendText = `<p class="text-bangla text-left translation">${response.data.text}</p>`;
                btnSelector = $('.btn-singl-ayah-bn');
            } else if ('en.transliteration' == engBnReTr) {
                appendText = `<p class="text-transliteration text-left translation">${response.data.text}</p>`;
                btnSelector = $('.btn-singl-ayah-transliteration');
            } else {
                appendText = `<div class="ayah-listen text-left"><audio controls>
                      <source src="${response.data.audio}" type="audio/ogg">
                      <source src="${response.data.audio}" type="audio/mpeg">
                    Your browser does not support the audio element.
                    </audio></div>`;
            }

            if ('en.transliteration' == engBnReTr) {
                $('.ayahs > li > bdo').after(appendText);
            } else {
                $('.ayahs > li').append(appendText);
            }

            $('.translation-loader').remove();
            btnSelector.attr('disabled', 'disabled');
        },
        error: function(err) {
            console.log(err);
        }
    })
}

// ADD SEARCH WORD 
$('.search-word-form').on('submit', function(e) {
    e.preventDefault();
    $('.btn-group-handler').hide(200);
    $('.btn-group-single-ayah').remove();
    $('.bismillah').remove();
    $('ol.ayahs > li').remove();
    $('.quran-loader').show();

    var word = $(this).find("input[name='word']").val();
    word = $.trim(word);

    $('.jumbotron .sura-name').html(word.toUpperCase());
    $('.jumbotron .sura-meta').hide();

    $.ajax({
        url: 'http://api.alquran.cloud/v1/search/' + word + '/all/en.sahih',
        method: 'GET',
        type: 'JSON',
        success: function(response) {
            if (undefined == response) {
                $('.quran-loader').hide();
                $('.jumbotron .sura-name').html(`<span class='text-danger'>Something wrong. Try another english word or correct spelling.</span>`);
                $('.jumbotron .sura-meta').hide();
                return;
            } else {
                renderSearchWordResult(response.data);
            }
        },
        error: function(err) {
            console.log(err);
        }
    })
})

// RENDER SEARCH TEXT
function renderSearchWordResult(data) {
    $('.quran-loader').hide();
    $('.jumbotron .sura-meta').html(`Total <b class="text-info">${data.count}</b> words matches from the noble Quran (Sahih International).`).show();

    data.matches.map(function(match) {
        $('ol.ayahs').append(`
                <li class="list-group-item bg-light" ayahno ="${match.number}">
                        <p class='translation text-english text-left'>
                            <b class="text-secondary">${match.surah.number}. ${match.surah.englishName}: ${match.numberInSurah}</b><br>
                         ${match.text}</p>
                </li>`);
    });

    $("ol.ayahas > li").each(function(i, ele) {
        var surano = $(this).attr('ayahno');
        console.log(surano);
        console.log('ho ');
    });
}