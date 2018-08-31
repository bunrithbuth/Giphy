const apikey = 'Ed6piFHJMlGrBHXtEj8H2dtxt0RAZDfw'
let words = []
let offset = 0
let favoritedSearchArr = []
let favoritedGifArr = []


function searchGiphy(searchStr, isAppending) {
    if(isAppending === false){
        $('.gifSection').empty()
        offset = 0
    }else{
        offset = offset + 10
    }

    $('.favoriteButton').empty()
    if(favoritedSearchArr.indexOf(searchStr) > -1){
        $('.favoriteButton').append(`
            <span class="btn halfway-fab waves-effect waves-light red"><i class="material-icons">clear</i></span>
        `)
    }else{
        $('.favoriteButton').append(`
            <span class="btn halfway-fab waves-effect waves-light green"><i class="material-icons">add</i></span>
        `)
    }
    $('.searchString').text(searchStr)
    searchStr = searchStr.replace(/ /g, '+');
    let queryURL = 'http://api.giphy.com/v1/gifs/search?q=' + searchStr + '&api_key=' + apikey + '&limit=10' + '&offset=' + offset
    $.ajax({
        url: queryURL,
        method: "GET"
    })
    .then(function(response) {
        console.log(response.data);
        $('.viewMore').remove()

        response.data.forEach( item => {
            console.log(item.images.preview_gif.url)
            // background-image:url('${item.images.original.url}'); background-size:cover;background-position:center;
            $('.gifSection').append(`
                <div class="col l4 m6 s12">
                    <div class="card">
                        <div class="card-image waves-effect waves-block waves-light">
                            <img class="gifCard" data-title='${item.title}' src='${item.images.original_still.url}'>
                            <span class="card-title">Rating: ${item.rating}</span>
                            <span class="card-title playstop" style="top: 0 !important;"><i class="center large material-icons orange-text no-margin valign-wrapper center" href="#">play_arrow</i></span>
                        </div>
                        <div class="card-action center row valign-wrapper">
                            <div id="spacer1" class="valign-wrapper no-margin  col s12"></div>
                            <div id="favoriteGif" class="valign-wrapper no-margin  col s12">
                                <i class=" small material-icons orange-text no-margin" href="#">add</i>
                                <a class=" favoritegif no-margin" href="#">Favorite</a>
                            </div>
                            <div id="spacer1" class="valign-wrapper no-margin  col s12"></div>
                            <div id="downloadGif" class="valign-wrapper  no-margin  col s12">
                                <i class="small material-icons orange-text no-margin" href="#">vertical_align_bottom</i>
                                <a class="download no-margin" href="${item.images.original_mp4.mp4}" target="_blank" download>Download</a>
                            </div>
                            <div id="spacer1" class="valign-wrapper no-margin  col s12"></div>
                        </div>
                    </div>
                </div>
            `)
        })

        $('.gifSection').append(`
            <div class="viewMore waves-effect waves-light hover-cyan-4 rounded col s12">
                <h5 class="viewMoreText" style="font-weight: 900;">View More </h5>
            </div>
        `)
    })
    .catch(function(e){
        console.log(e)
    })
}

$(document).ready(function() {
    searchGiphy('boku no hero')

    $(document).on("click", ".searchButton", function(){
        let queryStr = $('#search_text').val()
        console.log(queryStr)
        searchGiphy(queryStr, false)
    })

    $(document).on("click", ".viewMore", function(){
        let queryStr = $('.searchString').html()
        console.log(queryStr)
        searchGiphy(queryStr, true)
    })

    $(document).on("click", ".favoriteButton", function(){
        let queryStr = $('.searchString').html()

        if(favoritedGifArr.indexOf(queryStr) > -1){
            var index = favoritedSearchArr.indexOf(queryStr);
            if (index > -1) {
                favoritedSearchArr.splice(index, 1);
            }

            $('.favoriteButton').empty()
            $('.favoriteButton').append(`
                <span class="btn halfway-fab waves-effect waves-light green"><i class="material-icons">add</i></span>
            `)

            let selStr = $(document).find(`div[favorited-data='${queryStr}']`)
            $(selStr).remove()

        }else{
            favoritedGifArr.push(queryStr)

            $('.favoriteButton').empty()
            $('.favoriteButton').append(`
                <span class="btn halfway-fab waves-effect waves-light red"><i class="material-icons">clear</i></span>
            `)

            $('.favoritedSearches').append(`
                <div class="col s12 left" favorited-data="${queryStr}">
                    <span class="favoritedButton btn halfway-fab waves-effect waves-light red"><i class="material-icons">clear</i></span>
                    <h6 class="favoritedText">${queryStr}</h6>
                </div>
            `)

        }
    })

    $(document).on("click", ".favoritedButton", function(){
        let favoritedStr = $(this).parent().children('h6').html()
        let queryStr = $('.searchString').html()

        var index = favoritedSearchArr.indexOf(favoritedStr);
        favoritedSearchArr.splice(index, 1);
        
        $(this).parent().remove()
        if(favoritedStr === queryStr){
            $('.favoriteButton').empty()
            $('.favoriteButton').append(`
                <span class="btn halfway-fab waves-effect waves-light green"><i class="material-icons">add</i></span>
            `)
        }
    })

    $(document).on("click", ".favoritedGifButton", function(){
        let favoritedGifStr = $(this).parent().children('h6').html()
        let queryStr = $('.searchString').html()

        var index = favoritedGifArr.indexOf(favoritedGifStr);
        favoritedGifArr.splice(index, 1);
        
        $(this).parent().remove()
        if(favoritedGifArr.length === 0){
            $('.viewAllGifsSection').remove()
        }


    })

    $(document).on("click",".card-image",function() {
        let gif = $(this).children('.gifCard').attr('src')
        let newGif = ''

        let playstop = $(this).children('.playstop')


        if(gif.includes('giphy_s.gif')){
            newGif = gif.replace("giphy_s.gif", "giphy.gif")
            playstop.empty()
            $(playstop).append(`
                <i class="center large material-icons orange-text no-margin valign-wrapper center" href="#">pause</i>
            `)
        }else{
            newGif = gif.replace("giphy.gif", "giphy_s.gif")
            $(playstop).empty()
            $(playstop).append(`
                <i class="center large material-icons orange-text no-margin valign-wrapper center" href="#">play_arrow</i>
            `)
        }
        $(this).children('.gifCard').attr("src", newGif)
    })

    $(document).on("click", "#favoriteGif", function() {
        if(favoritedGifArr.length === 0){
            $('.favoritedGifs').append(`
            <div class="col s12 left viewAllGifsSection">
                <span class="viewAllGifButton btn halfway-fab waves-effect waves-light viewAllGifsBtn"><i class="material-icons">apps</i></span>
                <h6 class="viewAllGifsLink pointer">View All Gifs</h6>
            </div>
        `)
        }

        let gifSel = $(this).parent().parent().children('.card-image').children('.gifCard')
        let gif = $(gifSel).attr('src')
        let gifTitle = $(gifSel).attr('data-title')

        if(gif.includes('giphy_s.gif')){
            gif = gif.replace("giphy.gif", "giphy_s.gif")
        }

        favoritedGifArr.push(gifTitle)

        $('.favoritedGifs').append(`
            <div class="col s12 left" favorited-data="${gif}">
                <span class="favoritedGifButton btn halfway-fab waves-effect waves-light red"><i class="material-icons">clear</i></span>
                <h6 class="favoritedGifText">${gifTitle}</h6>
            </div>
        `)


    })

    $('.tooltipped').tooltip();
    
}) //document ready end