;
(function($) {
    $(document.ready).ready(function(){ 
        loadAjax();
    });

    function loadAjax() {
        $.ajax({
            url: 'http://api.alquran.cloud/v1/surah',
            method: 'GET',
            success: function(response) {
                $('.quran-loader').hide(200);
                showSurah(response.data);
            },
            error: function(err) {
                console.log('An Error Occured' + err);
            }
        })


        function showSurah(surahs) {
            surahs.map(function(surah) {
                $('.surah').append(`
			<div class="col-xs-2 col-md-3 col-lg-4">
					<div class="card mb-3 bg-info text-white" style="width: 100%">
  <div class="card-body">
    <h5 class="card-title">${surah.number}. ${surah.name}</h5>
    <h6 class="card-subtitle mb-2 text-light">${surah.englishName} - ${surah.englishNameTranslation}</h6>
    <p class="card-text text-light">Total Verses ${surah.numberOfAyahs} <br> Revelation Type ${surah.revelationType}</p>
    <a href="#" onclick="showSingleSura(${surah.number});" class="single-sura btn btn-outline card-link text-primary" surano = "${surah.number}">Read Surah</a>
  </div>
  </div>
</div>
        			`);
                //console.log(surah);
                //console.log(surah.englishName);
            })
        }
    }

    // show single sura
    function showSingleSura(id) {
        //e.preventDefault();
        $('.surah > div[class *= "col"]').hide();
        console.log('Click Event Triggered.');
        var that = $(this),
            suraNumber = that.attr('surano');
        $.ajax({
            method: 'GET',
            url: 'http://api.alquran.cloud/v1/surah/' + id,
            success: function(response) {
                console.log(response);
            },
            error: function(err) {
                console.log('An erro Occured' + err);
            }
        });

        return false;
    };


})(jQuery)